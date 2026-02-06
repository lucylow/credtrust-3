# Integrate Web3 Messaging (Web3Mail + Web3Telegram)

This guide explains how to integrate iExec Web3 Messaging into CredTrust (Web3Mail and Web3Telegram). It follows the official iExec flow:

1. (Telegram only) Have the recipient start a chat with `@IExecWeb3TelegramBot` to obtain their Chat ID.
2. Create Protected Data using `IExecDataProtectorCore`.
3. Grant Access to your app or a sender (single or bulk).
4. Send Messages:
   - Single message: `sendEmail` / `sendTelegram`
   - Bulk campaign: `prepareEmailCampaign` / `sendEmailCampaign` (or Telegram equivalents)
5. Payment: executions are paid with RLC (see iExec docs). For demos, set `DEV_MODE=true` to skip actual iExec calls.

## Quickstart (scripts)

1. Copy `.env.example -> .env` and fill `PRIVATE_KEY` and `IEXEC_APP_ADDRESS`.
2. Install dependencies:
   ```bash
   npm ci
   ```

Protect a contact and grant access:
```bash
npm run create:protected -- user@example.com
npm run grant:access -- 0xProtectedAddress --allowBulk true
```

Send a single email:
```bash
npm run send:single:email -- 0xProtectedAddress "Subject" "Body of the email"
```

Prepare & send a campaign (email):
```bash
npm run send:campaign:email
```

Telegram: obtain Chat ID
Ask the recipient to open Telegram and start a conversation with @IExecWeb3TelegramBot. The bot replies with a Chat ID. Use that Chat ID as the "contact" value when calling protectData.
Node script examples
The repository contains scripts/web3-messaging/* which demonstrate:
create_protected_data.ts
grant_access.ts
send_single_email.ts
send_single_telegram.ts
prepare_and_send_campaign_email.ts
prepare_and_send_campaign_telegram.ts
fetch_contacts.ts
These demonstrate the canonical flows shown in the iExec docs:
protectData → grantAccess → (single or bulk) send.
Notes about payments
Each message execution requires payment; the SDK will either charge an existing iExec account or fallback to RPC/developer flows.
In test/development you may choose DEV_MODE=true to avoid spending RLC; this switches scripts to local dry-run mode.
For detailed API usage, see iExec docs: DataProtector, Web3Mail, Web3Telegram.
