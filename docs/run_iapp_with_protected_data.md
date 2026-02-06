# Run iApp with ProtectedData - CredTrust integration

This feature demonstrates how to run an iExec iApp with ProtectedData via the DataProtector SDK.

## Quick examples (DEV_MODE)

1. Ensure `.env` contains `DEV_MODE=true` and optional `LOCAL_IEXEC_OUT=./out`.
2. Create a sample ProtectedData (see other scripts) or use a real protectedData address.
3. Submit an iApp run:

```bash
npx ts-node scripts/iapp/run_iapp_with_protected_data.ts \
  --protectedData 0xDEMO_PD \
  --args "--input-path data/input.csv --output-format json" \
  --inputFiles "https://example.com/config.json" \
  --secrets "1:openai-api-key" \
  --tag "demo-run-001"
```

Poll & fetch result:
```bash
npx ts-node scripts/iapp/get_task_result.ts --taskId demo-task-xxxx --saveOut ./out
```

## Parameters
- **protectedData** (required): iExec protectedData address (0x...). In DEV_MODE, can be any string.
- **app** (optional): iApp (app) address or identifier to run the task.
- **args** (optional): CLI argument string passed to iApp (will appear on-chain as the request's args).
- **inputFiles** (optional): list of public URLs the iApp can download during execution.
- **secrets** (optional): mapping from secret slot index to secret name (e.g., 1:openai-key,2:db-pass). Secrets must be provisioned in iExec secret store for real runs.
- **tag** (optional): human label.

## Frontend demo
`src/components/IAppRunner.tsx` is a demo React component that posts to `/api/iapp/run` (you must implement that server endpoint or adapt to your frontend-to-backend flow).

## Notes & Production
- When `DEV_MODE=false`, `PRIVATE_KEY` must be set and the server will call the iExec SDK using that account; make sure it has RLC funds and is properly configured.
- Secrets should only be referenced by name (index->name) — never include secret values in the request payload. iExec injects secrets as envvars inside the iApp at runtime.
- `inputFiles` are public URLs accessible to the iApp runtime - do not send private files here unless protected by alternative secure delivery.
