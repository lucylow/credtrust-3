// scripts/web3-messaging/fetch_contacts.ts
import { createSDKs } from '../../src/lib/iexecMessaging';
import * as dotenv from 'dotenv';
dotenv.config();

// Usage: npx ts-node scripts/web3-messaging/fetch_contacts.ts [--bulkOnly]
async function main() {
  const bulkOnly = process.argv.includes('--bulkOnly');
  const sdk = createSDKs();
  console.log('Fetching contacts (bulkOnly=', bulkOnly, ')');
  
  if (sdk.web3mail) {
    const contacts = await sdk.web3mail.fetchMyContacts({ bulkOnly });
    console.log('Web3Mail contacts count:', contacts.length);
    contacts.forEach(c => console.log(c));
  } else {
    console.log('Web3Mail SDK not available');
  }

  // Also show telegram contacts via web3telegram
  if (sdk.web3telegram) {
    const tgContacts = await sdk.web3telegram.fetchMyContacts({ bulkOnly });
    console.log('Web3Telegram contacts count:', tgContacts.length);
    tgContacts.forEach(c => console.log(c));
  } else {
    console.log('Web3Telegram SDK not available');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
