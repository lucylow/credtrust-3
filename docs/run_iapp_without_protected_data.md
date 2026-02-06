# Run iApp without ProtectedData — CredTrust Integration

This feature allows you to start iExec iApp tasks using command-line arguments, input files, and secrets (no ProtectedData required).

## Quickstart (dev)

1. Copy `.env.example` → `.env` and set `DEV_MODE=true`.
2. Install dependencies: `npm install`.
3. Start server: `npm run start:server`.
4. Open front-end route that mounts `IAppOrderRunner` or call the CLI:

```bash
# create & run request order (simulate in DEV_MODE)
npx ts-node scripts/iapp/create_and_run_requestorder.ts --app 0xDEMO_APP --args "--foo bar" --inputFiles "https://example.com/config.json" --secrets "1:openai-key"

# Poll for task completion:
npx ts-node scripts/iapp/monitor_task.ts --taskId <taskId>
```

## Parameters

- `--app`: REQUIRED when running for real — iExec app identifier/address.
- `--workerpool`: optional; if omitted uses env `IEXEC_WORKERPOOL`.
- `--args`: command line string to pass to the iApp.
- `--inputFiles`: comma-separated public URLs (e.g., config files).
- `--secrets`: comma-separated list of `index:secret_name` entries. iExec injects secrets as env vars inside the iApp.

## Production notes

- When `DEV_MODE=false` you must provide `PRIVATE_KEY` env variable. The server will call iExec SDK and submit orders on-chain (costs RLC).
- For production, prefer server-side SDK calls (not spawning CLI) and secure private keys in KMS.
- Ensure `iexec.order.createRequestorder` and `iexec.order.signRequestorder` semantics match your SDK version. The wrapper isolates differences.

## Design notes & guidance

- The wrapper `src/lib/iexecOrder.ts` centralizes SDK calls so you only have to adapt there if your `iexec` version differs.
- `DEV_MODE` prevents network activity and provides predictable simulated outputs for the hackathon/demo environment.
- Server API `/api/iapp/run` uses SDK directly; this is the recommended pattern (server holds the signer & funds). Don't spawn processes on production.
- Secrets passed to `iexec.order.createRequestorder` are **names** and `index` (not actual secret values). iExec secret store must map index→secret.
- Input files are public HTTP(S) URLs; the iApp runtime downloads these.
- `args` are visible on chain (transactions include them) — do not pass private data as args.
