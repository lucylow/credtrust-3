# TEE Integration for CredTrust (SGX / TDX friendly)

This add-on provides:
- On-chain `EnclaveAttestationRegistry` for anchoring attestations with replay protection.
- Enclave simulator for local dev producing signed attestation envelopes.
- Backend TEE service for verification & nonce management.
- Frontend EnclaveTrace for demo visualization.

## Quick local dev (DEV_MODE)

1. Copy `.env.example` → `.env` and set `DEV_MODE=true` and a test `ENCLAVE_PRIVATE_KEY`.
2. Install deps:

```bash
npm install
```

3. Compile contracts & deploy local chain:
- Start Hardhat node: `npx hardhat node`
- Deploy registry: `npx hardhat run --network localhost scripts/deploy_attestation_registry.js`
- Add the deployed address to `.env` (`ATTESTATION_REGISTRY_ADDRESS`)

4. Generate attestation envelope (simulator):

```bash
npx ts-node scripts/enclave_simulator/generate_and_sign_attestation.ts 0x1234 ./sample.csv --nonce 1234
```

5. Submit attestation on-chain (uses PRIVATE_KEY to pay gas):

```bash
npx ts-node scripts/enclave_simulator/submit_attestation_onchain.ts 0x1234 <attestationHash> 1234 <timestamp> 0x00... <signature>
```

6. In the frontend demo, render `EnclaveTrace` and feed `attHash` and `ipfsCID` for animation.

## Production notes

- **Signer key management:** The enclave's private key MUST be generated inside the TEE and NEVER leave it. The simulator uses a local private key only for testing. In real deployment the enclave signs inside TEE and only exposes the signature and quote.
- **Quote verification:** For real SGX/TDX use, verify the hardware quote (Intel Attestation Service or TDX provider) and check MRENCLAVE/MRSIGNER against a whitelist. This code uses simplified checks: signer's address must be in an on-chain allowlist or DB allowlist.
- **Nonce & replay:** Nonces must be unique per signer. The smart contract enforces uniqueness per signer. Off-chain TEE service also records used nonces (DB) for fast rejection.
- **Expiry:** Timestamps are bounded by `expirySeconds` in the contract. Tune as needed.
- **Attestation content:** The enclave should include MRENCLAVE / quote / nonce / timestamp / result digest. Only hashes and minimal metadata are anchored on-chain to save gas; verbose attestation stored in IPFS (encrypted) or trusted storage.

## Security checklist

- Use KMS/HSM (Vault/AWS KMS) for any signing key if running off-TEE.
- If you need on-chain verification of Intel quotes, integrate IAS/EPID/TDX verification libs and store attestation roots.
- Audit smart contract before production deployment.
