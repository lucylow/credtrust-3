// scripts/web3telegram/prepare_and_send_campaign_telegram.ts
import dotenv from 'dotenv';
dotenv.config();
import { createTelegramSDKs } from '../../src/lib/iexecTelegram';

async function main() {
  const sdk = createTelegramSDKs();
  console.log('Fetching contacts with bulkOnly=true...');
  const contacts = await sdk.web3telegram.fetchMyContacts({ bulkOnly: true });
  if (!contacts || contacts.length === 0) {
    console.log('No bulk-enabled contacts found. Make sure recipients granted allowBulk=true.');
    return;
  }
  const grantedAccessArray = contacts.map((c: any) => c.grantedAccess);
  console.log('Found', grantedAccessArray.length, 'bulk-enabled contacts');

  console.log('Preparing telegram campaign...');
  const campaign = await sdk.web3telegram.prepareTelegramCampaign({
    grantedAccesses: grantedAccessArray,
    telegramContent: 'CredTrust demo bulk telegram message'
  });

  console.log('Sending campaign...');
  const res = await sdk.web3telegram.sendTelegramCampaign({ campaignRequest: campaign.campaignRequest });
  console.log('sendTelegramCampaign result tasks:', res.tasks);
}

main().catch(e => { console.error(e); process.exit(1); });
