// src/components/Web3Messaging/GrantAccessForm.tsx
import React, { useState } from 'react';
import { getWeb3Provider, IExecDataProtectorCore } from '@iexec/dataprotector';

const GrantAccessForm: React.FC = () => {
  const [pd, setPd] = useState('');
  const [app, setApp] = useState(process.env.REACT_APP_IEXEC_APP_ADDRESS || '');
  const [allowBulk, setAllowBulk] = useState(true);
  const [result, setResult] = useState('');

  async function handleGrant() {
    try {
      setResult('Granting...');
      const provider = getWeb3Provider((window as any).ethereum);
      const dp = new IExecDataProtectorCore(provider, { ipfsNode: (process.env.REACT_APP_IEXEC_IPFS_UPLOAD || undefined) });
      const res = await dp.grantAccess({
        protectedData: pd,
        authorizedApp: app,
        authorizedUser: '0x0000000000000000000000000000000000000000',
        allowBulk,
        numberOfAccess: 100
      });
      setResult(JSON.stringify(res, null, 2));
    } catch (e: any) {
      setResult('Error: ' + e.message);
    }
  }

  return (
    <div className="p-4 border rounded mt-4">
      <h4 className="font-bold">Grant Access</h4>
      <input value={pd} onChange={e => setPd(e.target.value)} placeholder="protectedData address" className="border p-2 w-full mt-2" />
      <input value={app} onChange={e => setApp(e.target.value)} placeholder="authorized app address (optional)" className="border p-2 w-full mt-2" />
      <div className="mt-2">
        <label className="mr-2"><input type="checkbox" checked={allowBulk} onChange={e => setAllowBulk(e.target.checked)} /> allowBulk</label>
      </div>
      <div className="mt-2">
        <button onClick={handleGrant} className="btn">Grant</button>
      </div>
      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">{result}</pre>
    </div>
  );
};

export default GrantAccessForm;
