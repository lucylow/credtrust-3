/**
 * API service for CredTrust data fetching
 * These functions can be used with React Query for data prefetching
 */

// Simulated delay for demo purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface CreditAnalytics {
  currentScore: number;
  peerComparison: {
    avgScore: number;
    percentile: number;
  };
  history: Array<{ date: string; score: number }>;
}

export interface LoanOffer {
  id: string;
  lender: string;
  amount: string;
  apr: string;
  term: string;
  requiredScore: number;
  collateral: string;
  status: 'available' | 'pending' | 'funded';
}

export interface TEEJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  encryptedData: string;
  attestation?: string;
}

/**
 * Fetch credit analytics for the dashboard
 */
export async function fetchCreditAnalytics(range: string = '30d'): Promise<CreditAnalytics> {
  await delay(400);
  
  return {
    currentScore: 745,
    peerComparison: {
      avgScore: 720,
      percentile: 78,
    },
    history: [
      { date: '2026-01-01', score: 720 },
      { date: '2026-01-15', score: 735 },
      { date: '2026-02-01', score: 745 },
    ],
  };
}

/**
 * Fetch available loan offers from marketplace
 */
export async function fetchLoanOffers(filters?: {
  minScore?: number;
  maxApr?: number;
  lender?: string;
}): Promise<LoanOffer[]> {
  await delay(300);
  
  const offers: LoanOffer[] = [
    {
      id: '1',
      lender: 'DeFi Prime',
      amount: '50,000 USDC',
      apr: '8.5%',
      term: '12 months',
      requiredScore: 700,
      collateral: '25%',
      status: 'available',
    },
    {
      id: '2',
      lender: 'Aave Institution',
      amount: '100,000 USDC',
      apr: '6.2%',
      term: '24 months',
      requiredScore: 750,
      collateral: '15%',
      status: 'available',
    },
    {
      id: '3',
      lender: 'Compound Labs',
      amount: '25,000 USDC',
      apr: '11.0%',
      term: '6 months',
      requiredScore: 650,
      collateral: '40%',
      status: 'pending',
    },
  ];

  // Apply filters if provided
  return offers.filter((offer) => {
    if (filters?.minScore && offer.requiredScore > filters.minScore) {
      return false;
    }
    if (filters?.lender && !offer.lender.toLowerCase().includes(filters.lender.toLowerCase())) {
      return false;
    }
    return true;
  });
}

/**
 * Submit encrypted data to TEE for processing
 */
export async function submitToTEE(encryptedData: string): Promise<TEEJob> {
  await delay(200);
  
  return {
    id: `job_${Date.now()}`,
    status: 'pending',
    progress: 0,
    encryptedData,
  };
}

/**
 * Check TEE job status
 */
export async function checkTEEJobStatus(jobId: string): Promise<TEEJob> {
  await delay(100);
  
  // Simulate progress
  const progress = Math.min(100, Math.floor(Math.random() * 30) + 70);
  
  return {
    id: jobId,
    status: progress >= 100 ? 'completed' : 'processing',
    progress,
    encryptedData: '...',
    attestation: progress >= 100 ? '0x7a8f3e2d...' : undefined,
  };
}

/**
 * Mint Credit NFT with proof and attestation
 */
export async function mintCreditNFT(params: {
  attestation: string;
  score: number;
  proof: string;
}): Promise<{ tokenId: string; txHash: string }> {
  await delay(500);
  
  return {
    tokenId: `#${Math.floor(Math.random() * 10000)}`,
    txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
  };
}

export default {
  fetchCreditAnalytics,
  fetchLoanOffers,
  submitToTEE,
  checkTEEJobStatus,
  mintCreditNFT,
};
