// src/components/Web3Messaging/SendCampaign.tsx
import React, { useState } from 'react';
import { getWeb3Provider } from '@iexec/dataprotector';
import { IExecWeb3mail } from '@iexec/web3mail';
import { IExecWeb3telegram } from '@iexec/web3telegram';

const SendCampaign: React.FC = () => {
  const [subject, setSubject] = useState('Hello from CredTrust!');
  const [message, setMessage] = useState('Bulk demo message');
  const [log, setLog] = useState('');

  async function sendEmailCampaign() {
    try {
      setLog('Fetching contacts...');
      const provider = getWeb3Provider((window as any).ethereum);
      const web3mail = new IExecWeb3mail(provider);
      const contacts = await web3mail.fetchMyContacts({ bulkOnly: true });
      if (contacts.length === 0) { setLog('No bulk-enabled contacts found'); return; }
      const grantedAccesses = contacts.map((c: any) => c.grantedAccess);
      setLog(`Found ${grantedAccesses.length} contacts. Preparing campaign...`);
      const campaign = await web3mail.prepareEmailCampaign({
        grantedAccesses,
        emailSubject: subject,
        emailContent: message,
        contentType: 'text/plain'
      });
      setLog('Prepared. Sending...');
      const { tasks } = await web3mail.sendEmailCampaign({ campaignRequest: campaign.campaignRequest });
      setLog('Sent tasks: ' + JSON.stringify(tasks));
    } catch (e: any) {
      setLog('Error: ' + e.message);
    }
  }

  async function sendTelegramCampaign() {
    try {
      setLog('Fetching telegram contacts...');
      const provider = getWeb3Provider((window as any).ethereum);
      const web3tg = new IExecWeb3telegram(provider);
      const contacts = await web3tg.fetchMyContacts({ bulkOnly: true });
      if (contacts.length === 0) { setLog('No bulk-enabled telegram contacts found'); return; }
      const grantedAccesses = contacts.map((c: any) => c.grantedAccess);
      setLog(`Found ${grantedAccesses.length} contacts. Preparing campaign...`);
      const campaign = await web3tg.prepareTelegramCampaign({
        grantedAccesses,
        telegramContent: message
      });
      setLog('Prepared. Sending...');
      const { tasks } = await web3tg.sendTelegramCampaign({ campaignRequest: campaign.campaignRequest });
      setLog('Sent tasks: ' + JSON.stringify(tasks));
    } catch (e: any) {
      setLog('Error: ' + e.message);
    }
  }

  return (
    <div className="p-4 border rounded mt-4">
      <h4 className="font-bold">Send Bulk Campaign</h4>
      <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="subject (email)" className="border p-2 w-full mt-2" />
      <textarea value={message} onChange={e=>setMessage(e.target.value)} className="border p-2 w-full mt-2" rows={4} />
      <div className="flex gap-2 mt-2">
        <button onClick={sendEmailCampaign} className="btn">Send Email Campaign</button>
        <button onClick={sendTelegramCampaign} className="btn">Send Telegram Campaign</button>
      </div>
      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">{log}</pre>
    </div>
  );
};

export default SendCampaign;
