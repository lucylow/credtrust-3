// scripts/demo_local_run.js
// Usage: npx hardhat run scripts/demo_local_run.js --network localhost
const hre = require("hardhat");
const fs = require("fs");
const { ethers } = hre;


async function main() {
  console.log("Starting local CredTrust Arbitrum-style demo...");


  const [deployer, alice, relayer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Relayer:", relayer.address);


  // 1) Deploy L1AttestationReceiver (this acts as L1 receiver in demo)
  const L1Receiver = await ethers.getContractFactory("L1AttestationReceiver");
  const l1Receiver = await L1Receiver.connect(deployer).deploy();
  await l1Receiver.deployed();
  console.log("L1AttestationReceiver deployed at:", l1Receiver.address);


  // 2) Deploy MockArbSys (L2 precompile mock)
  const MockArbSys = await ethers.getContractFactory("MockArbSys");
  const mockArb = await MockArbSys.connect(deployer).deploy();
  await mockArb.deployed();
  console.log("MockArbSys deployed at:", mockArb.address);


  // 3) Deploy EncryptedReceiptRegistry (L2)
  const Registry = await ethers.getContractFactory("contracts/EncryptedReceiptRegistry.sol:EncryptedReceiptRegistry");
  const registry = await Registry.connect(deployer).deploy();
  await registry.deployed();
  console.log("EncryptedReceiptRegistry deployed at:", registry.address);


  // 4) Deploy ArbitrumAttestationBridgeMock, pass mockArb address
  const Bridge = await ethers.getContractFactory("ArbitrumAttestationBridgeMock");
  const bridge = await Bridge.connect(deployer).deploy(mockArb.address);
  await bridge.deployed();
  console.log("Bridge (mock) deployed at:", bridge.address);


  // Save deployed addresses for inspection
  fs.writeFileSync("demo-deployed.json", JSON.stringify({
    l1Receiver: l1Receiver.address,
    mockArb: mockArb.address,
    registry: registry.address,
    bridge: bridge.address
  }, null, 2));


  // 5) Create a sample receipt and register it on the registry
  const sampleIpfs = "ipfs://bafkreidemoexample";
  // deterministic receiptId: keccak256(ipfsCID + "|" + uploaderLowercase)
  const receiptId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${sampleIpfs}|${deployer.address.toLowerCase()}`));
  const merkleRoot = ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.utils.randomBytes(32)), 32);


  console.log("Registering receipt on L2 registry...");
  const tx1 = await registry.connect(deployer).registerEncryptedReceipt(receiptId, sampleIpfs, merkleRoot);
  await tx1.wait();
  console.log("Registered receipt:", receiptId);


  // 6) Simulate enclave producing attestation, uploading off-chain, computing attestationHash
  const attestationSample = {
    enclave: "demo-enclave",
    timestamp: Math.floor(Date.now()/1000),
    merkleRoot,
    note: "demo attestation"
  };
  const attestationJson = JSON.stringify(attestationSample);
  const attestationHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(attestationJson));
  console.log("Simulated attestation hash:", attestationHash);


  // 7) Update attestation on registry (this emits ReceiptAttested)
  const tx2 = await registry.connect(deployer).updateAttestation(receiptId, attestationHash);
  await tx2.wait();
  console.log("Updated attestation on registry (L2). Event emitted.");


  // 8) Now call bridge.sendAttestationToL1 to create an outbox message (via MockArbSys)
  console.log("Calling bridge.sendAttestationToL1 (this will cause MockArbSys to emit OutboxMessage)...");
  const sendTx = await bridge.connect(deployer).sendAttestationToL1(l1Receiver.address, receiptId, attestationHash, sampleIpfs);
  const rc = await sendTx.wait();
  console.log("Bridge.sendAttestationToL1 tx mined:", rc.transactionHash);


  // 9) Listen for MockArbSys OutboxMessage or query logs from the bridge tx
  // We'll fetch OutboxMessage logs emitted by the MockArbSys contract
  const mockIface = new ethers.utils.Interface(["event OutboxMessage(uint256 indexed outId, address indexed destination, bytes data)"]);
  const logs = rc.logs.filter(l => l.address === mockArb.address);
  let outMsg = null;
  for (const l of logs) {
    try {
      const parsed = mockIface.parseLog(l);
      outMsg = parsed.args;
      console.log("Found OutboxMessage event in tx logs:", parsed.args.outId.toString(), parsed.args.destination, parsed.args.data);
    } catch (e) {
      // ignore parse errors
    }
  }


  if (!outMsg) {
    // If not found in the tx logs (some Hardhat versions may not include), fetch recent events
    console.log("Searching OutboxMessage events via query...");
    const filter = mockArb.filters.OutboxMessage();
    const events = await mockArb.queryFilter(filter, rc.blockNumber - 10, rc.blockNumber + 10);
    if (events.length > 0) {
      outMsg = events[0].args;
      console.log("Found OutboxMessage via query:", outMsg.outId.toString(), outMsg.destination, outMsg.data);
    }
  }


  if (!outMsg) {
    console.error("No OutboxMessage event found. Aborting.");
    return;
  }


  // 10) The relayer (here in-process) will decode the calldata and call the L1 receiver directly.
  // The MockArbSys content used encodeWithSignature("receiveAttestation(bytes32,bytes32,string,address)", ...)
  const decoded = ethers.utils.defaultAbiCoder.decode(
    ["bytes32", "bytes32", "string", "address"],
    ethers.utils.hexDataSlice(outMsg.data, 4) // slice off function selector
  );
  const [rcptId_dec, attHash_dec, ipfs_dec, l2Source_dec] = decoded;
  console.log("Relayer decoded calldata:", rcptId_dec, attHash_dec, ipfs_dec, l2Source_dec);


  // Execute the L1 call by invoking receiveAttestation on the L1Receiver contract
  console.log("Relayer executing receiveAttestation on L1Receiver...");
  const tx3 = await l1Receiver.connect(relayer).receiveAttestation(rcptId_dec, attHash_dec, ipfs_dec, l2Source_dec);
  await tx3.wait();
  console.log("L1Receiver.receiveAttestation executed:", tx3.hash);


  // 11) Inspect L1Receiver state
  const rec = await l1Receiver.attestationByReceipt(rcptId_dec);
  console.log("L1 attestation stored:", rec.attestationHash, "ipfs:", rec.ipfsCID, "l2Source:", rec.l2Source, "timestamp:", rec.receivedAt.toString());


  console.log("Demo finished successfully. Inspect demo-deployed.json and contract state.");
}


main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });