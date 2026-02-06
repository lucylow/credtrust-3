// Loan Marketplace Type Definitions

export interface Loan {
  id: string;
  title: string;
  description: string;
  borrower: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  riskTier: 'A' | 'B' | 'C';
  collateralType: 'crypto' | 'nft' | 'rwa' | 'none';
  collateralAmount?: number;
  status: 'active' | 'funded' | 'repaid' | 'defaulted';
  creditScore: number;
  fundedAmount: number;
  lendersCount: number;
  createdAt: number;
  expiresAt: number;
  minInvestment: number;
}

export interface LoanFilter {
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  riskTiers: string[];
  collateralTypes: string[];
  status?: string;
}

export interface LoanApplication {
  loanId: string;
  investmentAmount: number;
  walletAddress: string;
  timestamp: number;
}

export interface LoanStats {
  totalVolume: number;
  avgInterest: number;
  activeLoans: number;
  totalLenders: number;
}
