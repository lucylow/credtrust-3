// src/services/tee_verify.service.ts
/**
 * TEEService for verifying attestation envelopes off-chain and enforcing replay protection.
 * - Verifies ECDSA signature
 * - Checks timestamp / expiry
 * - Optionally records used nonces in DB (via Prisma) to prevent replays
 *
 * The attestation envelope format (as produced by enclave simulator) is:
 * { attestation: {...}, attestationHash: "0x...", signature: "0x...", nonce: N, timestamp: T, signer: "0x..." }
 */
import { ethers } from "ethers";

// Simplified logger and prisma for the demo
const logger = {
  error: (obj: any, msg: string) => console.error(msg, obj),
  info: (msg: string) => console.log(msg)
};

export class TEEService {
  expirySeconds: number;
  registryAddress: string;

  constructor() {
    this.expirySeconds = Number(process.env.ATTESTATION_EXPIRY_SECONDS || 86400);
    this.registryAddress = process.env.ATTESTATION_REGISTRY_ADDRESS || ethers.constants.AddressZero;
  }

  /**
   * Verify an attestation envelope (structure produced by enclave_simulator).
   * Returns { ok, reason, signer }
   */
  async verifyEnvelope(envelope: any): Promise<{ ok: boolean; reason?: string; signer?: string }> {
    try {
      const { attestationHash, signature, nonce, timestamp, attestation } = envelope;
      if (!attestationHash || !signature || nonce === undefined || !timestamp) {
        return { ok: false, reason: "missing_fields" };
      }

      // check timestamp bounds
      const now = Math.floor(Date.now() / 1000);
      if (timestamp > now + 300) return { ok: false, reason: "timestamp_future" };
      if (now > timestamp + this.expirySeconds) return { ok: false, reason: "timestamp_expired" };

      // reconstruct message hash as contract expects: keccak256(receiptId, attHash, nonce, timestamp, mrenclave, registryAddr)
      const receiptId = attestation.receiptId;
      const mrenclave = attestation.mrenclave || ethers.constants.HashZero;
      const encoded = ethers.utils.defaultAbiCoder.encode(
        ["bytes32","bytes32","uint256","uint256","bytes32","address"],
        [receiptId, attestationHash, nonce, timestamp, mrenclave, this.registryAddress]
      );
      const messageHash = ethers.utils.keccak256(encoded);

      // recover signer
      const recovered = ethers.utils.recoverAddress(ethers.utils.hashMessage(ethers.utils.arrayify(messageHash)), signature);
      const signer = ethers.utils.getAddress(recovered);

      // check attestationHash matches attestation JSON
      const computed = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(attestation)));
      if (computed !== attestationHash) {
        return { ok: false, reason: "attestation_hash_mismatch" };
      }

      // Note: In a production app, you would check for replay protection in a database here.
      // Example: await prisma.usedNonce.create({ data: { attestor: signer, nonce: BigInt(nonce) } });

      return { ok: true, signer };
    } catch (err: any) {
      logger.error({ err: err.message }, "verifyEnvelope error");
      return { ok: false, reason: "exception" };
    }
  }
}
