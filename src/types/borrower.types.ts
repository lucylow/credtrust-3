// Borrower Type Definitions

export type RiskTier = 'A' | 'B' | 'C' | 'D';
export type KycLevel = 'basic' | 'intermediate' | 'full';
export type Region = 'africa' | 'global';
export type WalletProvider = 'm-pesa' | 'mtn_momo' | 'airtel_money' | 'metamask' | 'coinbase' | 'trust_wallet';
export type EmploymentType = 
  | 'mobile_money_agent' 
  | 'agritech_farmer' 
  | 'remittance_receiver' 
  | 'fintech_employee'
  | 'software_engineer' 
  | 'teacher' 
  | 'nurse' 
  | 'freelancer';

export interface BorrowerProfile {
  borrower_id: string;
  profile_id: number;
  wallet_address: string;
  first_name: string;
  last_name: string;
  country: string;
  region: Region;
  age: number;
  
  // Financial
  annual_income_usd: number;
  monthly_debt_payments_usd: number;
  debt_to_income_ratio: number;
  employment_months: number;
  employment_type: EmploymentType;
  
  // On-chain
  wallet_age_days: number;
  total_deposits_usd: number;
  tx_count_90d: number;
  avg_tx_value_usd: number;
  
  // Credit history
  payment_history_good: boolean;
  recent_inquiries: number;
  delinquencies_12m: number;
  
  // Risk signals
  onchain_reputation: number;
  velocity_score: number;
  kyc_level: KycLevel;
  
  // Scores
  credit_score: number;
  risk_tier: RiskTier;
}

export interface PortfolioTranche {
  seniority: 'senior' | 'mezzanine' | 'junior' | 'equity';
  size_usd: number;
  coupon_rate: string;
  risk_score: number;
  nft_token_id?: number;
}

export interface Portfolio {
  portfolio_id: string;
  owner_address: string;
  total_value_usd: number;
  collateral_composition: Record<string, number>;
  loan_to_value_target: number;
  duration_months: number;
  tranches: PortfolioTranche[];
  credit_proof_ids?: number[];
  mrenclave?: string;
}

export interface ZKProof {
  proof_id: string;
  score: number;
  tier: RiskTier;
  public_inputs: number[];
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
  };
  verification_key?: {
    alpha: string[];
    beta: string[][];
    gamma: string[];
    delta: string[];
    gamma_abc_g1: string[];
  };
  mrenclave?: string;
  generated_at: string;
}

export interface ContractEvent {
  tokenId: number;
  borrower: string;
  score: number;
  tier: RiskTier;
  zk_proof_hash: string;
  mrenclave: string;
  blockNumber: number;
  timestamp: string;
}

export interface APIResponse {
  task_id: string;
  status: 'accepted' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  estimated_duration?: number;
  zero_trust_context?: {
    client_type: string;
    verified_mrenclave: string;
    session_valid: boolean;
  };
  token_id?: number;
  zk_proof_hash?: string;
}
