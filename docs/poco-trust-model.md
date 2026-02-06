# PoCo Trust Model in CredTrust

## Overview
CredTrust leverages the **iExec Proof-of-Contribution (PoCo)** protocol to provide hardware-enforced trust, verifiable confidentiality, and economic finality for credit scoring and AI attestations.

Instead of building a custom trust layer, CredTrust **inherits** trust from the iExec TEE (Trusted Execution Environment) infrastructure.

## Core Guarantees

### 1. Hardware-Enforced Confidentiality
- **No Replication Needed**: Trust is rooted in hardware (Intel SGX / TDX), not in a majority of nodes.
- **Enclave Isolation**: All sensitive computations (credit scoring, risk modeling) occur inside a TEE enclave.
- **SMS Secret Provisioning**: Secrets are never exposed to the worker or CredTrust; they are provisioned directly to the enclave by the iExec Secret Management Service (SMS).

### 2. Proof-of-Contribution (PoCo)
Every execution in CredTrust is governed by the PoCo protocol:
- **Order Matching**: Requesters, App providers, and Workerpools sign EIP-712 orders. Matching happens off-chain, ensuring efficiency.
- **Economic Finality**: PoCo enforces "Pay-as-you-go" and "Slash-on-failure". Workers must provide a valid enclave proof to receive payment.
- **Verifiable Proofs**: Results are cryptographically signed by the hardware and verified by the PoCo smart contracts on-chain before any RLC is transferred.

## Architecture Mapping

| CredTrust Concept | PoCo Implementation |
|-------------------|---------------------|
| Trust Model       | Hardware Enclave (TEE) |
| Governance        | Order-based Access Control |
| Payment           | RLC locking & release upon proof |
| Penalty           | Worker/Scheduler staking & slashing |
| Result Integrity  | Cryptographic Enclave Attestation |

## Data Governance
- **Dataset Orders**: Data owners define exactly who can use their data and at what price.
- **App Orders**: CredTrust algorithm owners control which requesters can trigger scoring.
- **Workerpool Selection**: Requesters can restrict execution to specific workerpools with high trust scores.

## Summary
"We do not invent trust — we inherit it from PoCo."
By using iExec's native protocol, CredTrust ensures that even the platform operators cannot see user data or manipulate credit results.
