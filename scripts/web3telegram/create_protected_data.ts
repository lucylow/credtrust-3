// scripts/web3telegram/create_protected_data.ts
import dotenv from 'dotenv';
dotenv.config();
import { createTelegramSDKs } from '../../src/lib/iexecTelegram';

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: create_protected_data.ts <telegramChatId>');
    process.exit(1);
  }
  const sdk = createTelegramSDKs();
  console.log('Creating ProtectedData for Telegram chat id:', arg);
  const pd = await sdk.dataProtector.protectData({ data: { telegram: arg } });
  console.log('ProtectedData:', pd);
}

main().catch(e => { console.error(e); process.exit(1); });
