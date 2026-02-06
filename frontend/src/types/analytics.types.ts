// Credit Analytics Type Definitions

export interface CreditAnalytics {
  currentScore: number;
  previousScore: number;
  scoreHistory: ScoreHistoryPoint[];
  riskDistribution: RiskDistribution[];
  loanPerformance: LoanPerformancePoint[];
  peerComparison: PeerComparison;
  factors: CreditFactor[];
  defaultProbability: number;
}

export interface ScoreHistoryPoint {
  date: string;
  score: number;
  projected?: boolean;
}

export interface RiskDistribution {
  tier: string;
  count: number;
  percentage: number;
  color: string;
}

export interface LoanPerformancePoint {
  month: string;
  approved: number;
  defaulted: number;
  funded: number;
}

export interface PeerComparison {
  percentile: number;
  avgScore: number;
  betterThan: number;
}

export interface CreditFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  score: number;
  maxScore: number;
  description: string;
}

export interface PortfolioStats {
  totalInvested: number;
  expectedReturn: number;
  activePositions: number;
  riskScore: number;
  diversificationScore: number;
}

export interface TEEWorkflowState {
  step: 'idle' | 'initializing' | 'deploying' | 'computing' | 'attesting' | 'complete' | 'error';
  progress: number;
  error?: string;
  taskId?: string;
  attestation?: TEEAttestation;
  result?: TEEResult;
}

export interface TEEAttestation {
  enclaveHash: string;
  mrEnclave: string;
  mrSigner: string;
  isvProdId: number;
  isvSvn: number;
  timestamp: number;
  signature: string;
  isValid: boolean;
}

export interface TEEResult {
  score: number;
  riskTier: string;
  confidence: number;
  computeTime: number;
}
