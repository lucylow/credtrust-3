// TEE/ZK Types for CredTrust

export interface Groth16Proof {
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
}

export interface SolidityProof {
  a: [bigint, bigint];
  b: [[bigint, bigint], [bigint, bigint]];
  c: [bigint, bigint];
  publicInputs: bigint[];
}

export interface ProofGenerationResult {
  proof: SolidityProof;
  publicInputHash: `0x${string}`;
  metadataCIDBytes32: `0x${string}`;
  attPayloadHex: `0x${string}`;
  attSigHex: `0x${string}`;
  score: number;
  tier: 'A' | 'B' | 'C' | 'D';
}

export interface TEEJobRequest {
  ipfsHash: string;
  borrower: `0x${string}`;
  encryptedKey: string;
}

export interface TEEJobStatus {
  taskId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  enclaveStatus: 'INITIALIZING' | 'COMPUTING' | 'HEALTHY' | 'ERROR';
  mrenclave?: string;
  result?: ProofGenerationResult;
  error?: string;
}

export interface AttestorInfo {
  publicKey: string;
  address: `0x${string}`;
  trusted: boolean;
  mrenclave: string;
}

export interface EncryptedPayload {
  ciphertext: number[];
  iv: string;
  ipfsHash: string;
}

export interface CreditApplicationData {
  income: number;
  employmentMonths: number;
  existingDebt: number;
  walletAge?: number;
  txCount90d?: number;
  totalDeposits?: number;
  paymentHistoryGood?: boolean;
  recentInquiries?: number;
}

export interface CircuitInput {
  score: number;
  threshold: number;
}

export interface VerificationKey {
  protocol: string;
  curve: string;
  nPublic: number;
  vk_alpha_1: string[];
  vk_beta_2: string[][];
  vk_gamma_2: string[][];
  vk_delta_2: string[][];
  vk_alphabeta_12: string[][][];
  IC: string[][];
}

export interface ProofCommit {
  metadataCID: `0x${string}`;
  publicInputHash: `0x${string}`;
  issuedAt: bigint;
  underwriter: `0x${string}`;
  revoked: boolean;
}

export interface MintEvent {
  tokenId: bigint;
  borrower: `0x${string}`;
  metadataCID: `0x${string}`;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
}
