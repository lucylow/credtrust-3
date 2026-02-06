// Mock TEE/ZK Service - Simulates backend proof generation

import type { 
  TEEJobRequest, 
  TEEJobStatus, 
  ProofGenerationResult, 
  AttestorInfo,
  CreditApplicationData,
  SolidityProof 
} from '@/types/tee.types';
import type { RiskTier } from '@/types/borrower.types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock attestor keypair (in production, this is in the TEE)
const MOCK_ATTESTOR = {
  publicKey: "04a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
  address: "0x742d35Cc6634C0532925a3b8D7c7aF9eA663F39d" as `0x${string}`,
  mrenclave: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
};

// Generate random hex string
const randomHex = (length: number): string => {
  const chars = '0123456789abcdef';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * 16)]).join('');
};

// Generate mock Groth16 proof (in production, this comes from snarkjs)
function generateMockGroth16Proof(): SolidityProof {
  const randomBigInt = () => BigInt('0x' + randomHex(64));
  
  return {
    a: [randomBigInt(), randomBigInt()],
    b: [[randomBigInt(), randomBigInt()], [randomBigInt(), randomBigInt()]],
    c: [randomBigInt(), randomBigInt()],
    publicInputs: [BigInt(1)], // valid = 1
  };
}

// Calculate credit score from application data
function calculateCreditScore(data: CreditApplicationData): { score: number; tier: RiskTier } {
  let score = 300;
  
  // Income factor (up to 200 points)
  score += Math.min(200, Math.floor(data.income / 500));
  
  // Employment stability (up to 100 points)
  score += Math.min(100, Math.floor(data.employmentMonths / 2));
  
  // Debt-to-income ratio (up to 150 points)
  const dti = data.existingDebt / (data.income || 1);
  score += Math.max(0, Math.floor(150 * (1 - dti)));
  
  // On-chain factors
  if (data.walletAge) {
    score += Math.min(50, Math.floor(data.walletAge / 30));
  }
  if (data.txCount90d) {
    score += Math.min(30, data.txCount90d);
  }
  if (data.paymentHistoryGood) {
    score += 70;
  }
  if (data.recentInquiries !== undefined) {
    score -= data.recentInquiries * 10;
  }
  
  // Clamp to valid range
  score = Math.max(300, Math.min(850, score));
  
  // Assign tier
  let tier: RiskTier;
  if (score >= 750) tier = 'A';
  else if (score >= 700) tier = 'B';
  else if (score >= 650) tier = 'C';
  else tier = 'D';
  
  return { score, tier };
}

// In-memory job store
const jobs = new Map<string, TEEJobStatus>();

// Get attestor info
export async function fetchAttestorInfo(): Promise<AttestorInfo> {
  await delay(100);
  return {
    publicKey: MOCK_ATTESTOR.publicKey,
    address: MOCK_ATTESTOR.address,
    trusted: true,
    mrenclave: MOCK_ATTESTOR.mrenclave,
  };
}

// Submit TEE job
export async function submitTEEJob(request: TEEJobRequest): Promise<{ taskId: string }> {
  await delay(200);
  
  const taskId = `tee_${Date.now()}_${randomHex(8)}`;
  
  jobs.set(taskId, {
    taskId,
    status: 'PENDING',
    progress: 0,
    enclaveStatus: 'INITIALIZING',
    mrenclave: MOCK_ATTESTOR.mrenclave,
  });
  
  // Simulate async processing
  simulateJobProgress(taskId, request);
  
  return { taskId };
}

// Simulate job progress
async function simulateJobProgress(taskId: string, request: TEEJobRequest) {
  const job = jobs.get(taskId);
  if (!job) return;
  
  // Stage 1: Initializing (0-20%)
  await delay(500);
  job.status = 'PROCESSING';
  job.progress = 20;
  job.enclaveStatus = 'COMPUTING';
  
  // Stage 2: Decrypting key (20-40%)
  await delay(400);
  job.progress = 40;
  
  // Stage 3: Fetching IPFS data (40-60%)
  await delay(300);
  job.progress = 60;
  
  // Stage 4: Computing credit score (60-80%)
  await delay(500);
  job.progress = 80;
  
  // Stage 5: Generating ZK proof (80-95%)
  await delay(600);
  job.progress = 95;
  
  // Stage 6: Signing attestation (95-100%)
  await delay(200);
  
  // Generate result
  const mockApplicationData: CreditApplicationData = {
    income: 75000,
    employmentMonths: 48,
    existingDebt: 15000,
    walletAge: 365,
    txCount90d: 50,
    paymentHistoryGood: true,
    recentInquiries: 1,
  };
  
  const { score, tier } = calculateCreditScore(mockApplicationData);
  const proof = generateMockGroth16Proof();
  
  // Generate mock attestation payload and signature
  const attPayload = JSON.stringify({
    ipfsHash: request.ipfsHash,
    borrower: request.borrower,
    score,
    tier,
    timestamp: Date.now(),
    mrenclave: MOCK_ATTESTOR.mrenclave,
  });
  const attPayloadHex = ('0x' + Buffer.from(attPayload).toString('hex')) as `0x${string}`;
  const attSigHex = ('0x' + randomHex(130)) as `0x${string}`; // Mock signature
  
  const result: ProofGenerationResult = {
    proof,
    publicInputHash: ('0x' + randomHex(64)) as `0x${string}`,
    metadataCIDBytes32: ('0x' + Buffer.from(request.ipfsHash.padEnd(32, '\0').slice(0, 32)).toString('hex')) as `0x${string}`,
    attPayloadHex,
    attSigHex,
    score,
    tier,
  };
  
  job.status = 'COMPLETED';
  job.progress = 100;
  job.enclaveStatus = 'HEALTHY';
  job.result = result;
}

// Check job status
export async function checkTEEJobStatus(taskId: string): Promise<TEEJobStatus | null> {
  await delay(100);
  return jobs.get(taskId) || null;
}

// Wait for job completion with polling
export async function waitForJobCompletion(
  taskId: string, 
  onProgress?: (progress: number, status: string) => void,
  maxAttempts = 30
): Promise<ProofGenerationResult> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkTEEJobStatus(taskId);
    
    if (!status) {
      throw new Error('Job not found');
    }
    
    onProgress?.(status.progress, status.enclaveStatus);
    
    if (status.status === 'COMPLETED' && status.result) {
      return status.result;
    }
    
    if (status.status === 'FAILED') {
      throw new Error(status.error || 'Job failed');
    }
    
    await delay(500);
  }
  
  throw new Error('Job timed out');
}

// Direct proof generation (simulates synchronous TEE computation)
export async function generateProofDirect(
  applicationData: CreditApplicationData,
  borrower: `0x${string}`,
  ipfsHash: string,
  onProgress?: (stage: string, progress: number) => void
): Promise<ProofGenerationResult> {
  onProgress?.('Initializing TEE enclave...', 10);
  await delay(300);
  
  onProgress?.('Computing credit score...', 30);
  const { score, tier } = calculateCreditScore(applicationData);
  await delay(400);
  
  onProgress?.('Generating ZK proof...', 60);
  const proof = generateMockGroth16Proof();
  await delay(500);
  
  onProgress?.('Signing attestation...', 85);
  
  const attPayload = JSON.stringify({
    ipfsHash,
    borrower,
    score,
    tier,
    timestamp: Date.now(),
    mrenclave: MOCK_ATTESTOR.mrenclave,
  });
  const attPayloadHex = ('0x' + Buffer.from(attPayload).toString('hex')) as `0x${string}`;
  const attSigHex = ('0x' + randomHex(130)) as `0x${string}`;
  
  await delay(200);
  onProgress?.('Complete', 100);
  
  return {
    proof,
    publicInputHash: ('0x' + randomHex(64)) as `0x${string}`,
    metadataCIDBytes32: ('0x' + Buffer.from(ipfsHash.padEnd(32, '\0').slice(0, 32)).toString('hex')) as `0x${string}`,
    attPayloadHex,
    attSigHex,
    score,
    tier,
  };
}

// Verify attestation locally (for UI feedback)
export async function verifyAttestationLocal(
  attPayloadHex: `0x${string}`,
  attSigHex: `0x${string}`
): Promise<{ valid: boolean; attestor: `0x${string}`; mrenclave: string }> {
  await delay(100);
  
  // In production, this would verify the ECDSA signature
  // For mock, we just return success
  return {
    valid: true,
    attestor: MOCK_ATTESTOR.address,
    mrenclave: MOCK_ATTESTOR.mrenclave,
  };
}
