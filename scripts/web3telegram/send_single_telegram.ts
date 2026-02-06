// scripts/web3telegram/send_single_telegram.ts
import dotenv from 'dotenv';
dotenv.config();
import { createTelegramSDKs } from '../../src/lib/iexecTelegram';

async function main() {
  const pd = process.argv[2];
  const message = process.argv[3] || 'Hello from CredTrust (Web3Telegram demo)';
  if (!pd) {
    console.error('Usage: send_single_telegram.ts <protectedData> "<message>"');
    process.exit(1);
  }
  const sdk = createTelegramSDKs();
  console.log('Sending single telegram to', pd);
  const res = await sdk.web3telegram.sendTelegram({ protectedData: pd, telegramContent: message });
  console.log('sendTelegram result:', res);
}

main().catch(e => { console.error(e); process.exit(1); });
