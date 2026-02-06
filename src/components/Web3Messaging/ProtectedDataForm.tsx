// src/components/Web3Messaging/ProtectedDataForm.tsx
import React, { useState } from 'react';
import { getWeb3Provider, IExecDataProtectorCore } from '@iexec/dataprotector';

const ProtectedDataForm: React.FC = () => {
  const [contact, setContact] = useState('');
  const [result, setResult] = useState('');

  async function handleProtect() {
    try {
      setResult('Protecting...');
      const provider = getWeb3Provider((window as any).ethereum);
      const dp = new IExecDataProtectorCore(provider, { ipfsNode: (process.env.REACT_APP_IEXEC_IPFS_UPLOAD || undefined) });
      const data = contact.includes('@') ? { email: contact } : { telegram: contact };
      const protectedData = await dp.protectData({ data });
      setResult(JSON.stringify(protectedData, null, 2));
    } catch (e: any) {
      setResult('Error: ' + e.message);
    }
  }

  return (
    <div className="p-4 border rounded">
      <h4 className="font-bold">Protect Contact</h4>
      <input value={contact} onChange={e => setContact(e.target.value)} placeholder="email or telegram chat id" className="border p-2 w-full mt-2" />
      <div className="mt-2">
        <button onClick={handleProtect} className="btn">Protect</button>
      </div>
      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">{result}</pre>
    </div>
  );
};

export default ProtectedDataForm;
