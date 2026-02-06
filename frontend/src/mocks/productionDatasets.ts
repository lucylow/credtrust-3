// Pre-generated Production Datasets
import { generateBorrowerDataset } from './borrowerGenerator';
import { DEMO_BORROWERS_LIST } from './demoBorrowers';
import type { BorrowerProfile, RiskTier } from '@/types/borrower.types';

// Generate datasets lazily to avoid blocking initial load
let _productionBorrowers: BorrowerProfile[] | null = null;
let _africanBorrowers: BorrowerProfile[] | null = null;
let _highRiskBorrowers: BorrowerProfile[] | null = null;
let _primeApplicants: BorrowerProfile[] | null = null;

export function getProductionBorrowers(count = 500): BorrowerProfile[] {
  if (!_productionBorrowers) {
    _productionBorrowers = generateBorrowerDataset(count, { africa: 0.6, global: 0.4 });
  }
  return _productionBorrowers;
}

export function getAfricanBorrowers(count = 200): BorrowerProfile[] {
  if (!_africanBorrowers) {
    _africanBorrowers = generateBorrowerDataset(count, { africa: 1.0, global: 0 });
  }
  return _africanBorrowers;
}

export function getHighRiskBorrowers(count = 100): BorrowerProfile[] {
  if (!_highRiskBorrowers) {
    _highRiskBorrowers = generateBorrowerDataset(count, 
      { africa: 0.5, global: 0.5 },
      { A: 0, B: 0, C: 0.5, D: 0.5 }
    );
  }
  return _highRiskBorrowers;
}

export function getPrimeApplicants(count = 100): BorrowerProfile[] {
  if (!_primeApplicants) {
    _primeApplicants = generateBorrowerDataset(count,
      { africa: 0.4, global: 0.6 },
      { A: 0.6, B: 0.4, C: 0, D: 0 }
    );
  }
  return _primeApplicants;
}

export function getDemoBorrowers(): BorrowerProfile[] {
  return DEMO_BORROWERS_LIST;
}

// Get borrowers filtered by criteria
export function getBorrowersByTier(tier: RiskTier, count = 50): BorrowerProfile[] {
  const all = getProductionBorrowers();
  return all.filter(b => b.risk_tier === tier).slice(0, count);
}

export function getBorrowersByCountry(country: string, count = 50): BorrowerProfile[] {
  const all = getProductionBorrowers();
  return all.filter(b => b.country === country).slice(0, count);
}

// Stats summary
export function getDatasetStats() {
  const production = getProductionBorrowers();
  
  const tierCounts: Record<RiskTier, number> = { A: 0, B: 0, C: 0, D: 0 };
  const regionCounts = { africa: 0, global: 0 };
  const countryCounts: Record<string, number> = {};
  let totalScore = 0;
  let totalIncome = 0;
  
  for (const b of production) {
    tierCounts[b.risk_tier]++;
    regionCounts[b.region]++;
    countryCounts[b.country] = (countryCounts[b.country] || 0) + 1;
    totalScore += b.credit_score;
    totalIncome += b.annual_income_usd;
  }
  
  return {
    total: production.length,
    tierDistribution: tierCounts,
    regionDistribution: regionCounts,
    countryDistribution: countryCounts,
    avgCreditScore: Math.round(totalScore / production.length),
    avgIncome: Math.round(totalIncome / production.length),
    medianScore: production.sort((a, b) => a.credit_score - b.credit_score)[Math.floor(production.length / 2)].credit_score,
  };
}

// Export all datasets for easy access
export { generateBorrowerDataset } from './borrowerGenerator';
export { DEMO_BORROWERS, DEMO_BORROWERS_LIST } from './demoBorrowers';
