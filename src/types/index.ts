// CredTrust Type Definitions

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
}

export interface FinancialData {
  income: number;
  employmentMonths: number;
  existingDebt: number;
  requestedAmount: number;
  termMonths: number;
}

export interface EncryptedSubmission {
  ciphertext: string;
  hash: string;
  iv: string;
  timestamp: number;
}

export interface TEEResult {
  score: number;
  attestation: string;
  timestamp: number;
  encryptedDataHash: string;
}

export interface CreditNFT {
  tokenId: string;
  owner: string;
  score: number;
  attestation: string;
  mintedAt: number;
  expiresAt: number;
  metadata: NFTMetadata;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface ProcessingStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  timestamp?: number;
}

export interface LoanApplication {
  id: string;
  borrower: string;
  requestedAmount: number;
  termMonths: number;
  creditScore: number;
  status: 'pending' | 'approved' | 'rejected' | 'funded';
  createdAt: number;
}

export type CreditScoreRange = 'excellent' | 'good' | 'fair' | 'poor';

// Re-export types from other modules
export * from './loan.types';
export * from './analytics.types';
export * from './borrower.types';
export * from './tee.types';
