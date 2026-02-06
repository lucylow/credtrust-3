// scripts/demo_flow.js
// Full demo: generate keys (libsodium X25519), encrypt sample CSV with XChaCha20-Poly1305,
// envelope the symmetric key to enclave + recipients, upload to IPFS (optional),
// deploy registry (or read deployed_encrypted.json), register receipt, enclave decrypt & attest,
// update attestation on-chain.
//
// Usage:
// 1) Start local Hardhat node: `npx hardhat node`
// 2) Deploy contract with: `npx hardhat run --network localhost scripts/deploy_encrypted_registry.js`
//    (or run the script which will expect deployed_encrypted.json)
// 3) Run: node scripts/demo_flow.js
//
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sodium = require('libsodium-wrappers');
const { create } = require('ipfs-http-client-lite');
const crypto = require('crypto');
const { ethers } = require('ethers');

const DEMO_DIR = path.join(__dirname, '..', 'demo_data');
if (!fs.existsSync(DEMO_DIR)) fs.mkdirSync(DEMO_DIR, { recursive: true });

(async () => {
  await sodium.ready;

  // === Configuration ===
  const IPFS_API = process.env.IPFS_API || ""; // e.g. http://127.0.0.1:5001
  const useIpfs = !!IPFS_API;
  const ipfs = useIpfs ? create({ url: IPFS_API }) : null;

  // Ethereum / Hardhat
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
  // Use the first Hardhat account as uploader/attestor for demo
  const signer = provider.getSigner(0);
  const signerAddress = await signer.getAddress();
  console.log("Using signer account:", signerAddress);

  // Read deployed contract
  const deployedPath = path.join(process.cwd(), "deployed_encrypted.json");
  if (!fs.existsSync(deployedPath)) {
    console.error("Please deploy EncryptedReceiptRegistry first. Run:");
    console.error("  npx hardhat run --network localhost scripts/deploy_encrypted_registry.js");
    process.exit(1);
  }
  const deployed = JSON.parse(fs.readFileSync(deployedPath, "utf8"));
  const registryAddress = deployed.registry;
  console.log("Registry address:", registryAddress);

  // Load contract ABI (compiled artifact expected in artifacts)
  const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'EncryptedReceiptRegistry.sol', 'EncryptedReceiptRegistry.json');
  if (!fs.existsSync(artifactPath)) {
    // try the alternative path
    const altArtifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'arb', 'EncryptedReceiptRegistry.sol', 'EncryptedReceiptRegistry.json');
    if (fs.existsSync(altArtifactPath)) {
        artifactPath = altArtifactPath;
    } else {
        console.error("Please compile contracts first: npx hardhat compile");
        process.exit(1);
    }
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath));
  const registry = new ethers.Contract(registryAddress, artifact.abi, signer);

  // === 1) Generate keypairs (X25519 via libsodium) ===
  // sodium.crypto_box_keypair() returns Curve25519 keypair suitable for crypto_box_* functions.
  // We'll use crypto_box_seal to anonymously encrypt (seal) symmetric key for recipients.
  const enclaveKeypair = sodium.crypto_box_keypair();
  const lenderKeypair = sodium.crypto_box_keypair();
  const regulatorKeypair = sodium.crypto_box_keypair();

  // Export public keys as hex (for metadata/envelope)
  const enclavePubHex = Buffer.from(enclaveKeypair.publicKey).toString('hex');
  const enclavePrivHex = Buffer.from(enclaveKeypair.privateKey).toString('hex');
  const lenderPubHex = Buffer.from(lenderKeypair.publicKey).toString('hex');
  const lenderPrivHex = Buffer.from(lenderKeypair.privateKey).toString('hex');
  const regulatorPubHex = Buffer.from(regulatorKeypair.publicKey).toString('hex');
  const regulatorPrivHex = Buffer.from(regulatorKeypair.privateKey).toString('hex');

  console.log("Enclave pub:", enclavePubHex);
  // Note: Keep enclavePrivHex secret in production

  // For demo persist enclave pub in demo_data for front-end usage
  fs.writeFileSync(path.join(DEMO_DIR, 'enclave_keys.json'), JSON.stringify({
    enclavePubHex, enclavePrivHex, lenderPubHex, lenderPrivHex, regulatorPubHex, regulatorPrivHex
  }, null, 2));

  // === 2) Create sample CSV ===
  const sampleCsv = `wallet,name,email,income,debts
0x1000000000000000000000000000000000000001,Alice,alice@example.com,85000,5000
0x1000000000000000000000000000000000000002,Bob,bob@example.com,60000,15000
`;
  const csvPath = path.join(DEMO_DIR, 'sample_batch.csv');
  fs.writeFileSync(csvPath, sampleCsv, 'utf8');
  console.log("Wrote sample CSV to", csvPath);

  // === 3) Client-side: encrypt CSV with symmetric key (XChaCha20-Poly1305) ===
  // generate a random 32-byte symmetric key
  const symKey = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES);
  // random 24-byte nonce
  const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
  const plaintextData = Buffer.from(sampleCsv, 'utf8');

  // encrypt with XChaCha20-Poly1305
  const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(plaintextData, null, null, nonce, symKey);
  const cipherFile = path.join(DEMO_DIR, 'encrypted_batch.bin');
  fs.writeFileSync(cipherFile, Buffer.from(ciphertext));
  console.log("Encrypted batch written to", cipherFile);

  // Compute SHA-256 merkle root over rows
  function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
  const rows = sampleCsv.split(/\r?\n/).filter(r => r.trim().length > 0);
  const leafHashes = rows.map(r => sha256(Buffer.from(r, 'utf8')));
  function computeMerkleRoot(hashes) {
    if (hashes.length === 0) return '00'.repeat(32);
    let level = hashes.slice();
    while (level.length > 1) {
      const next = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = (i+1 < level.length) ? level[i+1] : level[i];
        const combined = Buffer.from(left + right, 'hex');
        next.push(sha256(combined));
      }
      level = next;
    }
    return level[0];
  }
  const merkleRootHex = computeMerkleRoot(leafHashes);
  console.log("Merkle root:", merkleRootHex);

  // === 4) Envelope encryption: seal symmetric key to enclave + lender + regulator ===
  // crypto_box_seal encrypts to recipient's publicKey (anonymous)
  const sealedForEnclave = sodium.crypto_box_seal(symKey, enclaveKeypair.publicKey);
  const sealedForLender = sodium.crypto_box_seal(symKey, lenderKeypair.publicKey);
  const sealedForRegulator = sodium.crypto_box_seal(symKey, regulatorKeypair.publicKey);

  // save metadata JSON with sealed keys (to be uploaded to IPFS alongside ciphertext)
  const metadata = {
    sealedKeys: {
      enclave: Buffer.from(sealedForEnclave).toString('hex'),
      lender: Buffer.from(sealedForLender).toString('hex'),
      regulator: Buffer.from(sealedForRegulator).toString('hex')
    },
    nonce: Buffer.from(nonce).toString('hex'),
    cipherHash: crypto.createHash('sha256').update(ciphertext).digest('hex'),
    merkleRoot: merkleRootHex,
    createdAt: Math.floor(Date.now()/1000)
  };
  const metadataPath = path.join(DEMO_DIR, 'encrypted_metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log("Wrote metadata to", metadataPath);

  // === 5) Upload ciphertext and metadata to IPFS (optional) ===
  let ipfsCID = null;
  if (useIpfs) {
    console.log("Uploading to IPFS at", IPFS_API);
    try {
      const addCipher = await ipfs.add(fs.createReadStream(cipherFile));
      const addMeta = await ipfs.add(JSON.stringify(metadata));
      ipfsCID = `ipfs://${addCipher.cid.toString()}`;
      const metaCID = `ipfs://${addMeta.cid.toString()}`;
      console.log("Uploaded cipher CID:", ipfsCID);
      console.log("Uploaded metadata CID:", metaCID);
      // For demonstrative purposes, attach metadata CID to registry or store off-chain as needed.
    } catch (err) {
      console.error("IPFS upload failed:", err.message);
      console.log("Falling back to local file URIs");
    }
  }
  if (!ipfsCID) {
    ipfsCID = `file://${cipherFile}`;
    console.log("Using local file URI", ipfsCID);
  }

  // === 6) Compute deterministic receiptId (keccak256(ipfsCID + '|' + uploaderLowercase)) ===
  const uploaderAddress = signerAddress.toLowerCase();
  const abiCoder = ethers.utils.defaultAbiCoder;
  const receiptId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${ipfsCID}|${uploaderAddress}`));
  console.log("Computed receiptId:", receiptId);

  // === 7) Register receipt on-chain ===
  // call registry.registerEncryptedReceipt(receiptId, ipfsCID, merkleRoot)
  const tx = await registry.registerEncryptedReceipt(receiptId, ipfsCID, '0x' + merkleRootHex);
  await tx.wait();
  console.log("Registered receipt on-chain:", receiptId);

  // === 8) Simulate enclave: decrypt sealed key using enclave priv, decrypt ciphertext, produce attestation ===
  // Enclave opens sealed key using crypto_box_seal_open
  const sealedForEnclaveBuf = Buffer.from(metadata.sealedKeys.enclave, 'hex');
  const openedKey = sodium.crypto_box_seal_open(sealedForEnclaveBuf, enclaveKeypair.publicKey, enclaveKeypair.privateKey);
  // openedKey is Uint8Array symmetric key
  console.log("Enclave successfully opened symmetric key");

  // Decrypt ciphertext using symmetric key + nonce (XChaCha20-Poly1305)
  // Note: ciphertext (Node) was created with sodium.crypto_aead_xchacha20poly1305_ietf_encrypt returning ciphertext including tag
  const decrypted = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, ciphertext, null, nonce, openedKey);
  console.log("Enclave decrypted payload (first 200 chars):", Buffer.from(decrypted).toString('utf8').slice(0,200));

  // Process the CSV inside enclave (demo scoring)
  const plaintext = Buffer.from(decrypted).toString('utf8');
  const pRows = plaintext.split(/\r?\n/).filter(r => r.trim().length > 0);
  const results = pRows.map((r, i) => {
    const score = (crypto.createHash('sha256').update(r).digest()[0] % 700) + 300;
    return { index: i, rowHash: crypto.createHash('sha256').update(r).digest('hex'), score };
  });
  const attestation = {
    enclave: "demo-enclave",
    modelVersion: "v1",
    processedAt: Math.floor(Date.now()/1000),
    results,
    merkleRoot: merkleRootHex
  };

  // Sign attestation: we use the deployer/signer as attestor for demo
  // Sign attestation hash using Ethereum wallet to create a reproducible signature anchor
  const attBytes = Buffer.from(JSON.stringify(attestation));
  const attHashBytes = ethers.utils.keccak256(attBytes); // 0x...
  // Sign via signer.privateKey not directly accessible; create a wallet with a private key for demo if needed
  // For simplicity, use provider.getSigner(0).signMessage
  const attHashArray = ethers.utils.arrayify(ethers.utils.hashMessage(ethers.utils.arrayify(attHashBytes)));
  const attestationSignature = await signer.signMessage(attHashArray);
  console.log("Attestation signed by", signerAddress);

  // Upload attestation JSON to IPFS if available, else store locally
  let attestationCID = null;
  const attestationPath = path.join(DEMO_DIR, 'attestation.json');
  fs.writeFileSync(attestationPath, JSON.stringify({ attestation, attHash: attHashBytes, signature: attestationSignature, signer: signerAddress }, null, 2));
  if (useIpfs) {
    try {
      const added = await ipfs.add(fs.createReadStream(attestationPath));
      attestationCID = `ipfs://${added.cid.toString()}`;
      console.log("Uploaded attestation to", attestationCID);
    } catch (e) {
      console.error("IPFS attestation upload failed", e.message);
    }
  }
  if (!attestationCID) {
    attestationCID = `file://${attestationPath}`;
    console.log("Using local attestation path", attestationCID);
  }

  // Compute attestationHash to anchor on-chain -- use keccak256 of attestation JSON bytes
  const attestationHash = ethers.utils.keccak256(Buffer.from(JSON.stringify(attestation)));
  console.log("Attestation hash (keccak256):", attestationHash);

  // === 9) Update registry with attestationHash ===
  const tx2 = await registry.updateAttestation(receiptId, attestationHash);
  await tx2.wait();
  console.log("Updated registry with attestation hash");

  // Summary
  console.log("Demo flow complete. Data locations and keys in demo_data/");
  console.log("You can inspect:");
  console.log(" - encrypted file:", cipherFile);
  console.log(" - metadata:", metadataPath);
  console.log(" - attestation:", attestationPath);
  console.log(" - enclave keys:", path.join(DEMO_DIR, 'enclave_keys.json'));
  console.log(" - contract deployed info: deployed_encrypted.json");

  // DONE
  process.exit(0);
})();
