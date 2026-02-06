// src/components/Web3Messaging/ProtectAndGrant.tsx
import React, { useState } from 'react';
import { DataProtectorWrapper } from '../../lib/dataProtector';

const ProtectAndGrant: React.FC<{ privateKey?: string }> = ({ privateKey }) => {
  const [email, setEmail] = useState('');
  const [protectedAddr, setProtectedAddr] = useState('');
  const [status, setStatus] = useState('');

  async function onProtect() {
    try {
      setStatus('protecting...');
      const dp = new DataProtectorWrapper({ privateKey });
      const res = await dp.protectContact({ email });
      setProtectedAddr(res.address || (res as any));
      setStatus('protected');
    } catch (e: any) {
      setStatus('error: ' + e.message);
    }
  }

  async function onGrant() {
    if (!protectedAddr) return setStatus('no protected data');
    try {
      setStatus('granting...');
      const dp = new DataProtectorWrapper({ privateKey });
      // grant the current app (IEXEC_APP_ADDRESS from env)
      const granted = await dp.grantAccess({
        protectedData: protectedAddr,
        authorizedApp: (import.meta.env.VITE_IEXEC_APP_ADDRESS || ''),
        allowBulk: true,
        numberOfAccess: 100
      });
      setStatus('granted: ' + JSON.stringify((granted as any)?.grantedAccess || granted));
    } catch (e: any) {
      setStatus('error: ' + e.message);
    }
  }

  return (
    <div className="p-4 rounded shadow bg-card text-card-foreground">
      <h3 className="text-lg font-bold mb-4">Protect Contact & Grant Access</h3>
      <input 
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-2" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="email or telegram chat id" 
      />
      <div className="flex gap-2">
        <button 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" 
          onClick={onProtect}
        >
          Protect
        </button>
        <button 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2" 
          onClick={onGrant} 
          disabled={!protectedAddr}
        >
          Grant Access (allowBulk)
        </button>
      </div>
      <div className="mt-4 text-sm text-muted-foreground break-all">ProtectedData: {protectedAddr}</div>
      <div className="mt-2 text-xs text-muted-foreground">Status: {status}</div>
    </div>
  );
};

export default ProtectAndGrant;
