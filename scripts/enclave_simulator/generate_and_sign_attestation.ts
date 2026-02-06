#!/usr/env ts-node
/**
 * Generate a simulated TEE attestation envelope and sign it with the ENCLAVE_PRIVATE_KEY.
 * Usage:
 *  env ENCLAVE_PRIVATE_KEY=0x... ts-node generate_and_sign_attestation.ts <receiptIdHex> <ipfsCidOrFile> [--mrenclave <hex32>] [--nonce N]
 *
 * Output (JSON):
 * {
 *   attestationJson: {...}, // verbose attestation
 *   attestationHash: "0x...",
 *   signature: "0x...",
 *   nonce: N,
 *   timestamp: UNIX
 * }
 *
 * Notes: attestationJson should include fields like: enclaveType, mrenclave, mrsigner, quote (base64), results (array)
 */
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";

const argv = process.argv.slice(2);
if (argv.length < 2) {
  console.error("Usage: generate_and_sign_attestation.ts <receiptIdHex> <ipfsCidOrFile> [--mrenclave <hex32>] [--nonce N]");
  process.exit(1);
}

async function main() {
  const receiptIdHex = argv[0];
  const payloadRef = argv[1]; // either ipfs://... or file path in dev
  const mrenclaveArgIndex = argv.indexOf("--mrenclave");
  const mrenclave = mrenclaveArgIndex >= 0 ? argv[mrenclaveArgIndex + 1] : ("0x" + "00".repeat(32));
  const nonceArgIndex = argv.indexOf("--nonce");
  const nonce = nonceArgIndex >= 0 ? Number(argv[nonceArgIndex + 1]) : Math.floor(Math.random() * 1e9);

  const enclavePriv = process.env.ENCLAVE_PRIVATE_KEY;
  if (!enclavePriv) {
    console.error("Set ENCLAVE_PRIVATE_KEY in .env (dev only).");
    process.exit(1);
  }
  const wallet = new ethers.Wallet(enclavePriv);

  // Simulate producing results (in real TEE the enclave would compute the results)
  // We'll produce a tiny demo "scores" object
  // Optionally read a file or treat payloadRef as ipfs URI
  let payloadPreview = "";
  try {
    if (payloadRef.startsWith("ipfs://")) {
      payloadPreview = payloadRef;
    } else if (fs.existsSync(payloadRef)) {
      payloadPreview = fs.readFileSync(payloadRef, "utf8").slice(0, 200);
    } else {
      payloadPreview = payloadRef;
    }
  } catch (e) {
    payloadPreview = String(e);
  }

  const now = Math.floor(Date.now() / 1000);
  // Example attestation object
  const attestationObj = {
    receiptId: receiptIdHex,
    enclaveType: process.env.ENCLAVE_TYPE || "SGX",
    mrenclave: mrenclave,
    mrsigner: wallet.address, // for demo we set mrsigner to enclave signer
    timestamp: now,
    nonce,
    payloadRef: payloadRef,
    results: [
      { index: 0, score: 720, rowHash: "0x" + ethers.utils.keccak256(ethers.utils.toUtf8Bytes("row0")).slice(2, 66) },
      { index: 1, score: 650, rowHash: "0x" + ethers.utils.keccak256(ethers.utils.toUtf8Bytes("row1")).slice(2, 66) }
    ],
    quote: "SIMULATED_QUOTE_BASE64==", // placeholder
    meta: { samplePreview: payloadPreview.slice(0, 200) }
  };

  const attestationJson = JSON.stringify(attestationObj);
  // compute attestationHash (keccak256)
  const attHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(attestationJson));

  // create message hash to sign: must match contract's _messageHash layout
  const receiptIdBytes32 = ethers.utils.hexZeroPad(receiptIdHex, 32);
  const attHashBytes32 = attHash;
  const mrenclaveBytes = ethers.utils.hexZeroPad(mrenclave, 32);
  const registryAddress = process.env.ATTESTATION_REGISTRY_ADDRESS || ethers.constants.AddressZero;

  const messageHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
    ["bytes32","bytes32","uint256","uint256","bytes32","address"],
    [receiptIdBytes32, attHashBytes32, nonce, now, mrenclaveBytes, registryAddress]
  ));

  // Sign using wallet.signMessage over bytes array of messageHash (eth signed message)
  const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));

  const out = {
    attestation: attestationObj,
    attestationHash: attHash,
    signature,
    nonce,
    timestamp: now,
    signer: wallet.address
  };

  // Optionally pin attestation JSON to IPFS if IPFS env present
  if (process.env.DEV_MODE !== "true" && process.env.IPFS_API) {
    try {
      const ipfs = create({ url: process.env.IPFS_API });
      const res = await ipfs.add(attestationJson);
      const cid = res.cid.toString();
      console.log("Pinned attestation JSON to IPFS:", cid);
      (out as any)['attestationCID'] = `ipfs://${cid}`;
    } catch (e) {
      console.warn("IPFS pin failed:", e);
    }
  }

  console.log(JSON.stringify(out, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
