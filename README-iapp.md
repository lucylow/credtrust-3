### CredTrust iApp — Production TEE Deployment (iExec)

This package brings a production-ready iApp (TEE) artifact to the CredTrust repo: Dockerized runtime, ZKP proving, and Web3Mail campaign delivery.

#### Folder Layout
```
credtrust-iapp/
├─ iapp.config.json              # iApp Generator config (Bellecour)
└─ app/
   ├─ Dockerfile                 # Production image (node:20-alpine)
   ├─ package.json               # Runtime deps (snarkjs, iExec SDKs)
   ├─ credtrust.js               # TEE entrypoint (ZKP + Web3Mail)
   └─ zkp/                       # Precompiled circuits (place your assets)
```
Supporting scripts (root `scripts/`):
- `scripts/iapp-init.sh` — optional bootstrap using iApp Generator
- `scripts/iapp-deploy.sh` — build & deploy iApp image to iExec
- `scripts/iapp-task.sh` — helper to run a task on Bellecour

#### Prerequisites
- Docker installed and running
- iExec CLI installed and configured with a funded wallet on Bellecour
- Precompiled ZKP artifacts placed at:
  - `credtrust-iapp/app/zkp/credtrust-v2.wasm`
  - `credtrust-iapp/app/zkp/credtrust-v2.zkey`
- Optional: `npm i -g @iexec/iapp` for `iapp test`

#### Quick Start
1) Optional init (writes/refreshes config)
```
./scripts/iapp-init.sh
```

2) Build production image
```
cd credtrust-iapp
docker build -f app/Dockerfile -t credtrust-iapp .
```

3) Deploy iApp to iExec (Bellecour)
```
./scripts/iapp-deploy.sh
```
The script prints the image hash used for deployment and leaves a reminder for running a task. Inspect your app on https://explorer.iex.ec.

4) Run a production task with ProtectedData
```
./scripts/iapp-task.sh 0xYourAppAddress 0xProtectedWalletData 0xProtectedContacts 0.5
```

#### TEE Entrypoint Behavior
- Reads JSON from stdin with shape:
```
{
  "walletData": { "normalizedInputs": [..], "nullifier": ".." },
  "protectedContacts": [ { "protectedData": "0x..." }, ... ]
}
```
- Proves credit score using `snarkjs.groth16.fullProve` with the precompiled circuits
- Sends Web3Mail campaigns to the first 10 contacts
- Writes a JSON result with `{ success, score, tier, proof, campaigns[], rlcCost }` to stdout

#### Notes & Tips
- Chain config: `iapp.config.json` targets Bellecour (chainId 134). Adjust if you deploy to another network.
- Secrets: reference secret names only in config (`secret.*`); load real values using iExec Secret Management.
- Costs: Web3Mail usage costs RLC. The example assumes ~0.012 RLC/email; update if pricing changes.
- Circuits: do NOT commit toxic waste or private materials. If needed, download circuits securely during the Docker build.

#### Frontend/Server Integration
This repo already contains server and UI helpers (`src/server/api/iapp.ts`, `src/components/IAppRunner.tsx`). The production iApp introduced here focuses on the TEE runtime. Use existing SDK flows to create request orders and monitor tasks, or the provided shell helpers.

#### Troubleshooting
- If `iapp test` is unavailable, ensure `npm i -g @iexec/iapp`.
- If Docker cannot find ZKP assets: place `.wasm/.zkey` into `credtrust-iapp/app/zkp/` before building.
- If deployment fails: verify iExec CLI is authenticated and wallet funded on Bellecour.
