// scripts/web3telegram/fetch_contacts.ts
import dotenv from 'dotenv';
dotenv.config();
import { createTelegramSDKs } from '../../src/lib/iexecTelegram';

async function main() {
  const bulkOnly = process.argv.includes('--bulkOnly');
  const sdk = createTelegramSDKs();
  console.log('Fetching Web3Telegram contacts, bulkOnly=', bulkOnly);
  const contacts = await sdk.web3telegram.fetchMyContacts({ bulkOnly });
  console.log('Contacts count:', contacts.length);
  contacts.forEach((c: any, idx: number) => console.log(idx, c));
}

main().catch(e => { console.error(e); process.exit(1); });
