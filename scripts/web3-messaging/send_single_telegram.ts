// scripts/web3-messaging/send_single_telegram.ts
import { createSDKs } from '../../src/lib/iexecMessaging';
import * as dotenv from 'dotenv';
dotenv.config();

// Usage: npx ts-node scripts/web3-messaging/send_single_telegram.ts <protectedDataAddress> "<messageBody>"
async function main() {
  const pd = process.argv[2];
  const body = process.argv[3] || 'Hello from CredTrust via Web3Telegram';

  if (!pd) {
    console.error('Usage: send_single_telegram.ts <protectedDataAddress> "<messageBody>"');
    process.exit(1);
  }

  const sdk = createSDKs();
  console.log('Sending single telegram to', pd);
  if (!sdk.web3telegram) throw new Error('Web3Telegram SDK not initialized');
  const res = await sdk.web3telegram.sendTelegram({
    protectedData: pd,
    telegramContent: body
  });
  console.log('sendTelegram result:', res);
}

main().catch(e => { console.error(e); process.exit(1); });
