// scripts/web3-messaging/prepare_and_send_campaign_telegram.ts
import { createSDKs } from '../../src/lib/iexecMessaging';
import * as dotenv from 'dotenv';
dotenv.config();

// This script demonstrates bulk campaign flow for Web3Telegram.
// Usage: npx ts-node scripts/web3-messaging/prepare_and_send_campaign_telegram.ts

async function main() {
  const sdk = createSDKs();
  if (!sdk.web3telegram) throw new Error('Web3Telegram SDK not initialized');

  console.log('Fetching telegram contacts with bulkOnly=true...');
  const contacts = await sdk.web3telegram.fetchMyContacts({ bulkOnly: true });
  if (!contacts.length) {
    console.log('No bulk-enabled telegram contacts found.');
    return;
  }
  const grantedAccessArray = contacts.map((c: any) => c.grantedAccess);
  console.log('Found telegram contacts:', grantedAccessArray.length);

  console.log('Preparing telegram campaign...');
  const campaign = await sdk.web3telegram.prepareTelegramCampaign({
    grantedAccesses: grantedAccessArray,
    telegramContent: 'Hello from CredTrust Telegram bulk demo!'
  });

  console.log('Campaign prepared. Sending...');
  const { tasks } = await sdk.web3telegram.sendTelegramCampaign({
    campaignRequest: campaign.campaignRequest
  });
  console.log('Campaign sent. tasks:', tasks);
}

main().catch(e => { console.error(e); process.exit(1); });
