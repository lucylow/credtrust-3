#!/usr/bin/env ts-node
// scripts/prepare_and_send_campaign.ts
import * as dotenv from 'dotenv';
dotenv.config();
import { getWeb3Provider } from '@iexec/dataprotector';
import { IExecWeb3mail } from '@iexec/web3mail';

async function main() {
  const pk = process.env.PRIVATE_KEY!;
  if (!pk) throw new Error('Set PRIVATE_KEY in .env');
  const provider = getWeb3Provider(pk);

  console.log('Instantiating web3mail...');
  const web3mail = new IExecWeb3mail(provider);

  console.log('Fetching my contacts (bulkOnly=true)...');
  try {
    const contacts = await web3mail.fetchMyContacts({ bulkOnly: true });
    console.log('contacts found:', contacts.length);
    
    if (contacts.length === 0) {
      console.log('No contacts found with bulk access. Run protect_and_grant.ts first.');
      return;
    }

    const grantedAccessArray = contacts.map(c => c.grantedAccess);

    console.log('Preparing campaign...');
    const campaign = await web3mail.prepareEmailCampaign({
      grantedAccesses: grantedAccessArray,
      emailSubject: 'CredTrust Demo: Hello!',
      emailContent: 'This is a demo message from CredTrust + iExec Web3Mail integration',
      contentType: 'text/plain'
    });

    console.log('Sending campaign...');
    const res = await web3mail.sendEmailCampaign({ campaignRequest: campaign.campaignRequest });
    console.log('send result -> tasks:', JSON.stringify(res.tasks, null, 2));
  } catch (error) {
    console.error('Error during campaign execution:', error);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
