// scripts/web3-messaging/prepare_and_send_campaign_email.ts
import { createSDKs } from '../../src/lib/iexecMessaging';
import * as dotenv from 'dotenv';
dotenv.config();

// This script demonstrates bulk campaign flow for Web3Mail.
// Usage: npx ts-node scripts/web3-messaging/prepare_and_send_campaign_email.ts

async function main() {
  const sdk = createSDKs();
  if (!sdk.web3mail) throw new Error('Web3Mail SDK not initialized');

  console.log('Fetching contacts with bulkOnly=true...');
  const contacts = await sdk.web3mail.fetchMyContacts({ bulkOnly: true });
  if (!contacts.length) {
    console.log('No bulk-enabled contacts found. Make sure recipients granted allowBulk=true.');
    return;
  }
  const grantedAccessArray = contacts.map((c: any) => c.grantedAccess);
  console.log('Found contacts:', grantedAccessArray.length);

  console.log('Preparing campaign...');
  const emailCampaign = await sdk.web3mail.prepareEmailCampaign({
    grantedAccesses: grantedAccessArray,
    emailSubject: 'CredTrust Bulk Demo: Hello!',
    emailContent: 'This is a bulk email from CredTrust demo using iExec Web3Mail',
    contentType: 'text/plain',
  });
  console.log('Campaign prepared. Sending...');
  const { tasks } = await sdk.web3mail.sendEmailCampaign({
    campaignRequest: emailCampaign.campaignRequest
  });
  console.log('Campaign sent. tasks:', tasks);
}

main().catch(e => { console.error(e); process.exit(1); });
