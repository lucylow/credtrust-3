// src/components/Web3Messaging/SendSingleMessage.tsx
import React, { useState } from 'react';
import { getWeb3Provider } from '@iexec/dataprotector';
import { IExecWeb3mail } from '@iexec/web3mail';
import { IExecWeb3telegram } from '@iexec/web3telegram';

const SendSingleMessage: React.FC = () => {
  const [pd, setPd] = useState('');
  const [subject, setSubject] = useState('Hello');
  const [body, setBody] = useState('Demo message');
  const [result, setResult] = useState('');

  async function sendEmail() {
    try {
      setResult('Sending email...');
      const provider = getWeb3Provider((window as any).ethereum);
      const web3mail = new IExecWeb3mail(provider);
      const res = await web3mail.sendEmail({
        protectedData: pd,
        emailSubject: subject,
        emailContent: body,
        contentType: 'text/plain'
      });
      setResult(JSON.stringify(res, null, 2));
    } catch (e: any) { setResult('Error: ' + e.message); }
  }

  async function sendTelegram() {
    try {
      setResult('Sending telegram...');
      const provider = getWeb3Provider((window as any).ethereum);
      const web3telegram = new IExecWeb3telegram(provider);
      const res = await web3telegram.sendTelegram({
        protectedData: pd,
        telegramContent: body
      });
      setResult(JSON.stringify(res, null, 2));
    } catch (e: any) { setResult('Error: ' + e.message); }
  }

  return (
    <div className="p-4 border rounded mt-4">
      <h4 className="font-bold">Send Single Message</h4>
      <input value={pd} onChange={e => setPd(e.target.value)} placeholder="protectedData address" className="border p-2 w-full mt-2" />
      <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="subject (email)" className="border p-2 w-full mt-2" />
      <textarea value={body} onChange={e => setBody(e.target.value)} className="border p-2 w-full mt-2" rows={3} />
      <div className="flex gap-2 mt-2">
        <button onClick={sendEmail} className="btn">Send Email</button>
        <button onClick={sendTelegram} className="btn">Send Telegram</button>
      </div>
      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">{result}</pre>
    </div>
  );
};

export default SendSingleMessage;
