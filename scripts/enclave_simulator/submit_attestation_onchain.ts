#!/usr/env ts-node
/**
 * Submit an attestation anchor to the deployed EnclaveAttestationRegistry contract.
 * Usage:
 *  npx ts-node submit_attestation_onchain.ts <receiptIdHex> <attestationHash> <nonce> <timestamp> <mrenclaveHex> <signatureHex>
 *
 * Requires RPC_URL and ATTESTATION_REGISTRY_ADDRESS in .env and a private key in .env (or use env PROVIDER/PK)
 */
import dotenv from "dotenv";
dotenv.config();
import { ethers } from "ethers";
import fs from "fs";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 6) {
    console.error("Usage: submit_attestation_onchain.ts <receiptIdHex> <attestationHash> <nonce> <timestamp> <mrenclaveHex> <signatureHex>");
    process.exit(1);
  }
  const [receiptIdHex, attestationHash, nonceStr, timestampStr, mrenclaveHex, signatureHex] = args;
  const providerUrl = process.env.RPC_URL!;
  if (!providerUrl) throw new Error("RPC_URL not set");
  const pk = process.env.PRIVATE_KEY!;
  if (!pk) throw new Error("PRIVATE_KEY not set");
  
  let registryAddr = process.env.ATTESTATION_REGISTRY_ADDRESS;
  if (!registryAddr && fs.existsSync('deployed_attestation_registry.json')) {
      registryAddr = JSON.parse(fs.readFileSync('deployed_attestation_registry.json','utf8')).address;
  }
  
  if (!registryAddr) {
      throw new Error("ATTESTATION_REGISTRY_ADDRESS not set in .env and deployed_attestation_registry.json not found");
  }

  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(pk, provider);

  // load ABI
  const artifactPath = 'artifacts/contracts/EnclaveAttestationRegistry.sol/EnclaveAttestationRegistry.json';
  if (!fs.existsSync(artifactPath)) {
      throw new Error(`Artifact not found at ${artifactPath}. Run 'npx hardhat compile' first.`);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const contract = new ethers.Contract(registryAddr, artifact.abi, wallet);

  const receiptId = receiptIdHex;
  const nonce = Number(nonceStr);
  const ts = Number(timestampStr);
  const tx = await contract.submitAttestation(receiptId, attestationHash, nonce, ts, mrenclaveHex, signatureHex, { gasLimit: 300000 });
  console.log("tx sent:", tx.hash);
  const rc = await tx.wait();
  console.log("tx confirmed:", rc.transactionHash);
}

main().catch(e => { console.error(e); process.exit(1); });
