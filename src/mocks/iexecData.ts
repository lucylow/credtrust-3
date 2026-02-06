// Mock iExec & Privacy Features Data

export interface IExecTask {
  taskId: string;
  dealId: string;
  workerpool: string;
  requester: string;
  app: string;
  dataset: string;
  status: 'UNSET' | 'ACTIVE' | 'REVEALING' | 'COMPLETED' | 'FAILED';
  statusMessage: string;
  startTime: string;
  completionTime?: string;
  resultHash?: string;
  enclaveChallenge?: string;
  tag: string;
  trust: number;
}

export interface DataProtectorGrant {
  grantId: string;
  protectedDataAddress: string;
  dataName: string;
  dataSchema: Record<string, string>;
  owner: string;
  authorizedApp: string;
  authorizedUser: string;
  grantType: 'one-time' | 'subscription' | 'rental';
  accessCount: number;
  maxAccess: number;
  pricePerAccess: string;
  createdAt: string;
  expiresAt: string;
  isRevoked: boolean;
}

export interface ConfidentialComputeLog {
  id: string;
  timestamp: string;
  operation: 'encrypt' | 'decrypt' | 'compute' | 'attest' | 'verify' | 'seal' | 'unseal';
  component: 'TEE' | 'DataProtector' | 'ResultProxy' | 'SMS' | 'Blockchain';
  details: string;
  durationMs: number;
  success: boolean;
  enclaveId?: string;
}

export interface PrivacyMetric {
  label: string;
  value: string;
  description: string;
  icon: string;
  category: 'encryption' | 'tee' | 'zk' | 'access-control';
}

// ─── iExec Tasks ────────────────────────────────────────────────────────────

const WORKERPOOLS = [
  'prod-v8-bellecour.main.pools.iexec.eth',
  'prod-v8-learn.main.pools.iexec.eth',
  'debug-v8-bellecour.main.pools.iexec.eth',
];

const APPS = [
  'credtrust-risk-engine.apps.iexec.eth',
  'credtrust-data-protector.apps.iexec.eth',
  'credtrust-zk-prover.apps.iexec.eth',
];

const DATASETS = [
  'encrypted-credit-data-ke-batch-01',
  'encrypted-credit-data-ng-batch-02',
  'encrypted-credit-data-gh-batch-03',
  'encrypted-income-verification-eg-01',
  'encrypted-transaction-history-za-01',
  'encrypted-kyc-bundle-multi-region',
];

function randomHex(len: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function generateIExecTasks(count = 15): IExecTask[] {
  const statuses: IExecTask['status'][] = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'ACTIVE', 'REVEALING', 'FAILED'];
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const start = new Date(Date.now() - (count - i) * 600000);
    return {
      taskId: `0x${randomHex(64)}`,
      dealId: `0x${randomHex(64)}`,
      workerpool: WORKERPOOLS[i % WORKERPOOLS.length],
      requester: `0x${randomHex(40)}`,
      app: APPS[i % APPS.length],
      dataset: DATASETS[i % DATASETS.length],
      status,
      statusMessage: status === 'COMPLETED' ? 'Task completed with TEE attestation'
        : status === 'ACTIVE' ? 'Running inside SGX enclave'
        : status === 'REVEALING' ? 'Result being revealed on-chain'
        : 'Enclave initialization timeout',
      startTime: start.toISOString(),
      completionTime: status === 'COMPLETED' ? new Date(start.getTime() + Math.random() * 5000 + 1000).toISOString() : undefined,
      resultHash: status === 'COMPLETED' ? `0x${randomHex(64)}` : undefined,
      enclaveChallenge: `0x${randomHex(40)}`,
      tag: '0x0000000000000000000000000000000000000000000000000000000000000001',
      trust: Math.floor(Math.random() * 5) + 1,
    };
  });
}

// ─── DataProtector Grants ───────────────────────────────────────────────────

export function generateDataProtectorGrants(count = 10): DataProtectorGrant[] {
  const schemas = [
    { credit_score: 'number', income_bracket: 'string', payment_history: 'bool' },
    { transaction_volume_90d: 'number', avg_balance: 'number', account_age_days: 'number' },
    { kyc_level: 'string', id_verified: 'bool', country: 'string' },
    { debt_to_income: 'number', employment_months: 'number', delinquencies: 'number' },
    { wallet_age_days: 'number', onchain_reputation: 'number', tx_count: 'number' },
  ];
  const names = [
    'Credit History Bundle', 'Transaction Profile', 'KYC Verification Pack',
    'Debt Analysis Dataset', 'On-chain Reputation Score', 'Income Verification',
    'Payment Behavior Data', 'Multi-source Credit File', 'Encrypted Financial Summary',
    'Mobile Money Transaction Log',
  ];
  const grantTypes: DataProtectorGrant['grantType'][] = ['one-time', 'subscription', 'rental'];

  return Array.from({ length: count }, (_, i) => {
    const created = new Date(Date.now() - Math.random() * 30 * 86400000);
    return {
      grantId: `grant-${randomHex(12)}`,
      protectedDataAddress: `0x${randomHex(40)}`,
      dataName: names[i % names.length],
      dataSchema: schemas[i % schemas.length],
      owner: `0x${randomHex(40)}`,
      authorizedApp: APPS[i % APPS.length],
      authorizedUser: `0x${randomHex(40)}`,
      grantType: grantTypes[i % grantTypes.length],
      accessCount: Math.floor(Math.random() * 10),
      maxAccess: Math.floor(Math.random() * 20) + 5,
      pricePerAccess: `${(Math.random() * 0.5 + 0.01).toFixed(3)} RLC`,
      createdAt: created.toISOString(),
      expiresAt: new Date(created.getTime() + 90 * 86400000).toISOString(),
      isRevoked: Math.random() < 0.1,
    };
  });
}

// ─── Confidential Compute Logs ──────────────────────────────────────────────

export function generateConfidentialLogs(count = 25): ConfidentialComputeLog[] {
  const operations: ConfidentialComputeLog['operation'][] = ['encrypt', 'decrypt', 'compute', 'attest', 'verify', 'seal', 'unseal'];
  const components: ConfidentialComputeLog['component'][] = ['TEE', 'DataProtector', 'ResultProxy', 'SMS', 'Blockchain'];
  const detailsMap: Record<string, string[]> = {
    encrypt: ['AES-256-GCM encryption of borrower dataset', 'ECIES envelope encryption for TEE transport', 'Encrypting KYC bundle with ephemeral key'],
    decrypt: ['Decrypting dataset inside SGX enclave', 'Unsealing previous attestation result', 'ECIES decryption of session key'],
    compute: ['Running Groth16 ZK proof generation', 'Computing credit risk score (5 factors)', 'Evaluating debt-to-income model', 'Processing batch of 50 borrower profiles'],
    attest: ['SGX remote attestation with IAS', 'Generating MRENCLAVE measurement', 'Publishing attestation receipt to IPFS'],
    verify: ['Verifying ZK proof on-chain (Arbitrum Sepolia)', 'Validating MRENCLAVE against whitelist', 'Checking DataProtector access rights'],
    seal: ['Sealing credit result for storage', 'Sealing encrypted receipt in registry'],
    unseal: ['Unsealing result for authorized verifier', 'Unsealing disclosure for lender review'],
  };

  return Array.from({ length: count }, (_, i) => {
    const op = operations[Math.floor(Math.random() * operations.length)];
    const details = detailsMap[op];
    return {
      id: `log-${randomHex(8)}`,
      timestamp: new Date(Date.now() - i * 30000 - Math.random() * 15000).toISOString(),
      operation: op,
      component: components[Math.floor(Math.random() * components.length)],
      details: details[Math.floor(Math.random() * details.length)],
      durationMs: Math.floor(Math.random() * 3000) + 50,
      success: Math.random() > 0.05,
      enclaveId: op === 'compute' || op === 'attest' ? `sgx-${randomHex(8)}` : undefined,
    };
  });
}

// ─── Privacy Metrics ────────────────────────────────────────────────────────

export function getPrivacyMetrics(): PrivacyMetric[] {
  return [
    { label: 'Data Protected', value: '12,847 records', description: 'Borrower records encrypted via iExec DataProtector with granular access control', icon: 'shield-lock', category: 'encryption' },
    { label: 'TEE Computations', value: '4,231', description: 'Credit scores computed inside Intel SGX enclaves — raw data never exposed', icon: 'cpu', category: 'tee' },
    { label: 'ZK Proofs Generated', value: '3,892', description: 'Groth16 proofs verifying credit tier without revealing score or income', icon: 'lock', category: 'zk' },
    { label: 'Access Grants Active', value: '156', description: 'DataProtector grants controlling who can process encrypted datasets', icon: 'key', category: 'access-control' },
    { label: 'Avg Enclave Uptime', value: '99.7%', description: 'SGX enclave availability across iExec worker pools on Bellecour', icon: 'activity', category: 'tee' },
    { label: 'Selective Disclosures', value: '892', description: 'Tier-only disclosures to lenders — score and income remain hidden', icon: 'eye-off', category: 'zk' },
    { label: 'Encrypted Receipts', value: '2,104', description: 'On-chain encrypted receipts stored in EncryptedReceiptRegistry on Arbitrum', icon: 'file-lock', category: 'encryption' },
    { label: 'MRENCLAVE Verified', value: '100%', description: 'All TEE results verified against whitelisted enclave measurements', icon: 'check-circle', category: 'tee' },
  ];
}

// ─── iExec Network Stats ────────────────────────────────────────────────────

export interface IExecNetworkStats {
  totalTasks: number;
  avgTaskDuration: string;
  activeWorkerpools: number;
  protectedDatasets: number;
  rlcStaked: string;
  trustLevel: number;
  enclaveType: string;
  networkChain: string;
}

export function getIExecNetworkStats(): IExecNetworkStats {
  return {
    totalTasks: 4231,
    avgTaskDuration: '2.1s',
    activeWorkerpools: 3,
    protectedDatasets: 847,
    rlcStaked: '125,000 RLC',
    trustLevel: 5,
    enclaveType: 'Intel SGX (Gramine)',
    networkChain: 'iExec Bellecour (sidechain)',
  };
}

// ─── Encryption Pipeline Stages ─────────────────────────────────────────────

export interface EncryptionPipelineStage {
  id: string;
  name: string;
  description: string;
  algorithm: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  inputSize: string;
  outputSize: string;
  durationMs: number;
}

export function getEncryptionPipeline(): EncryptionPipelineStage[] {
  return [
    { id: 'stage-1', name: 'Client-side Encryption', description: 'Borrower data encrypted in browser with AES-256-GCM before leaving the device', algorithm: 'AES-256-GCM', status: 'complete', inputSize: '4.2 KB', outputSize: '4.3 KB', durationMs: 12 },
    { id: 'stage-2', name: 'Key Wrapping', description: 'Ephemeral AES key wrapped with ECIES using TEE attestor public key', algorithm: 'ECIES (secp256k1)', status: 'complete', inputSize: '256 bits', outputSize: '113 bytes', durationMs: 8 },
    { id: 'stage-3', name: 'DataProtector Upload', description: 'Encrypted payload pushed to iExec DataProtector with schema metadata', algorithm: 'iExec DataProtector', status: 'complete', inputSize: '4.4 KB', outputSize: 'protectedData address', durationMs: 2400 },
    { id: 'stage-4', name: 'TEE Decryption', description: 'Data decrypted only inside SGX enclave after MRENCLAVE verification', algorithm: 'AES-256-GCM (in-enclave)', status: 'complete', inputSize: '4.3 KB', outputSize: '4.2 KB', durationMs: 3 },
    { id: 'stage-5', name: 'Confidential Compute', description: 'Credit risk model runs on plaintext inside enclave — result sealed', algorithm: 'Groth16 + Risk Model', status: 'complete', inputSize: '4.2 KB', outputSize: 'ZK Proof + Score', durationMs: 1850 },
    { id: 'stage-6', name: 'Result Sealing', description: 'Score + ZK proof sealed and encrypted receipt stored on-chain', algorithm: 'SGX Seal + AES-GCM', status: 'complete', inputSize: 'proof + score', outputSize: 'encrypted receipt', durationMs: 340 },
  ];
}
