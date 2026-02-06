// src/components/EnclaveTrace.tsx
import React, { useEffect, useState } from 'react';

/**
 * Animated, obfuscated enclave run trace for demo video / judges:
 * Data encrypted -> scored -> proof minted.
 * Shows attestation hash and IPFS CID (if available).
 */

const Step = ({ active, title, subtitle }: { active: boolean; title: string; subtitle?: string; key?: string }) => (
  <div className={`flex items-center gap-3 p-3 rounded-md ${active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? 'bg-white text-indigo-600' : 'bg-gray-300 text-gray-700'}`}>{active ? '✓' : '•'}</div>
    <div>
      <div className="font-semibold">{title}</div>
      {subtitle && <div className="text-xs opacity-80">{subtitle}</div>}
    </div>
  </div>
);

const EnclaveTrace: React.FC<{ attHash?: string; ipfsCID?: string }> = ({ attHash, ipfsCID }) => {
  const steps = [
    { key: 'encrypt', title: 'Data encrypted', subtitle: 'Client-side envelope (ciphertext)' },
    { key: 'scored', title: 'Scored in enclave', subtitle: 'Model scoring inside TEE' },
    { key: 'proof', title: 'Proof minted', subtitle: 'Attestation produced & signed' }
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIndex(i => Math.min(i + 1, steps.length - 1)), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-2xl p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-3">Enclave run (obfuscated demo)</h3>
      <div className="space-y-3">
        {steps.map((s, idx) => <Step key={s.key} active={idx <= activeIndex} title={s.title} subtitle={s.subtitle} />)}
      </div>
      <div className="mt-4 bg-gray-50 p-3 rounded">
        <div className="text-xs text-gray-500">Attestation hash</div>
        <div className="font-mono break-all text-sm">{attHash ?? '—'}</div>
        <div className="text-xs text-gray-500 mt-2">Attestation (verbose) stored</div>
        <div className="font-mono text-sm">{ipfsCID ?? 'not yet uploaded'}</div>
      </div>
    </div>
  );
};

export default EnclaveTrace;
