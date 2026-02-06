// Privacy Dashboard Types

export interface PrivacyJob {
  id: string;
  status: 'protected' | 'processing' | 'completed' | 'error';
  ipfsHash: string;
  createdAt: number;
  riskTier: 'A' | 'B' | 'C' | 'D';
  mrenclave: string;
  disclosureTokens: DisclosureToken[];
}

export interface DisclosureToken {
  id: string;
  tokenId: number;
  verifier: string;
  disclosureLevel: 0 | 1 | 2; // 0=Basic, 1=Income, 2=Full
  expiresAt: number;
  used: boolean;
}

export interface PrivacyStats {
  totalJobs: number;
  activeTokens: number;
  dataProtected: number; // MB
  avgRiskTier: string;
}

export interface PrivacyAttestation {
  mrenclave: string;
  riskTier: 'A' | 'B' | 'C' | 'D';
  chainId: number;
  timestamp: number;
  signature: string;
}
