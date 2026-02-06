// Borrower Service - API for accessing borrower data

import { 
  getProductionBorrowers, 
  getAfricanBorrowers, 
  getHighRiskBorrowers,
  getDemoBorrowers,
  getDatasetStats 
} from '@/mocks/productionDatasets';
import { generateBorrower, generateBorrowerDataset } from '@/mocks/borrowerGenerator';
import { MOCK_PORTFOLIOS, MOCK_ZK_PROOFS, MOCK_CONTRACT_EVENTS, MOCK_API_RESPONSES } from '@/mocks/portfolioData';
import type { BorrowerProfile, Portfolio, ZKProof, RiskTier, Region } from '@/types/borrower.types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Borrower APIs
export async function fetchBorrowers(options?: {
  count?: number;
  region?: Region;
  riskTier?: RiskTier;
}): Promise<BorrowerProfile[]> {
  await delay(300);
  
  if (options?.region === 'africa') {
    return getAfricanBorrowers(options.count || 200);
  }
  
  if (options?.riskTier === 'C' || options?.riskTier === 'D') {
    return getHighRiskBorrowers(options.count || 100);
  }
  
  return getProductionBorrowers(options?.count || 500);
}

export async function fetchBorrowerById(borrowerId: string): Promise<BorrowerProfile | null> {
  await delay(150);
  
  const allBorrowers = [...getDemoBorrowers(), ...getProductionBorrowers()];
  return allBorrowers.find(b => b.borrower_id === borrowerId) || null;
}

export async function fetchBorrowerByWallet(walletAddress: string): Promise<BorrowerProfile | null> {
  await delay(150);
  
  const allBorrowers = [...getDemoBorrowers(), ...getProductionBorrowers()];
  return allBorrowers.find(b => b.wallet_address === walletAddress) || null;
}

export async function fetchDemoBorrowers(): Promise<BorrowerProfile[]> {
  await delay(100);
  return getDemoBorrowers();
}

export async function generateNewBorrower(
  region?: Region,
  riskTier?: RiskTier
): Promise<BorrowerProfile> {
  await delay(200);
  return generateBorrower(Date.now(), region, riskTier);
}

export async function fetchBorrowerStats(): Promise<ReturnType<typeof getDatasetStats>> {
  await delay(100);
  return getDatasetStats();
}

// Portfolio APIs
export async function fetchPortfolios(): Promise<Portfolio[]> {
  await delay(250);
  return MOCK_PORTFOLIOS;
}

export async function fetchPortfolioById(portfolioId: string): Promise<Portfolio | null> {
  await delay(150);
  return MOCK_PORTFOLIOS.find(p => p.portfolio_id === portfolioId) || null;
}

export async function fetchPortfolioByOwner(ownerAddress: string): Promise<Portfolio[]> {
  await delay(200);
  return MOCK_PORTFOLIOS.filter(p => p.owner_address === ownerAddress);
}

// ZK Proof APIs
export async function fetchZKProofs(): Promise<ZKProof[]> {
  await delay(200);
  return MOCK_ZK_PROOFS;
}

export async function fetchZKProofById(proofId: string): Promise<ZKProof | null> {
  await delay(100);
  return MOCK_ZK_PROOFS.find(p => p.proof_id === proofId) || null;
}

export async function fetchZKProofByScore(score: number): Promise<ZKProof | null> {
  await delay(100);
  return MOCK_ZK_PROOFS.find(p => p.score === score) || null;
}

// Contract Event APIs
export async function fetchContractEvents(eventType?: 'Mint' | 'Transfer' | 'DisclosureAuthorized') {
  await delay(150);
  
  if (eventType) {
    return MOCK_CONTRACT_EVENTS[eventType];
  }
  
  return MOCK_CONTRACT_EVENTS;
}

export async function fetchMintEvents() {
  await delay(100);
  return MOCK_CONTRACT_EVENTS.Mint;
}

// Task/API Response simulation
export async function submitCreditScoreTask(borrowerData: Partial<BorrowerProfile>) {
  await delay(500);
  return MOCK_API_RESPONSES.creditScoreSuccess;
}

export async function checkTaskStatus(taskId: string) {
  await delay(200);
  
  // Simulate progress
  const statuses = [
    MOCK_API_RESPONSES.taskStatusPending,
    MOCK_API_RESPONSES.taskStatusProcessing,
    MOCK_API_RESPONSES.taskStatusComplete,
  ];
  
  return statuses[Math.floor(Math.random() * statuses.length)];
}

export async function requestDisclosure(tokenId: number, level: number) {
  await delay(300);
  return MOCK_API_RESPONSES.disclosureResponse;
}

// Batch data generation for testing
export async function generateTestDataset(count: number, options?: {
  regionMix?: Record<Region, number>;
  tierDistribution?: Record<RiskTier, number>;
}): Promise<BorrowerProfile[]> {
  await delay(500);
  
  return generateBorrowerDataset(
    count,
    options?.regionMix || { africa: 0.6, global: 0.4 },
    options?.tierDistribution || { A: 0.25, B: 0.35, C: 0.25, D: 0.15 }
  );
}
