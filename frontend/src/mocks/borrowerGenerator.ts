// Production Mock Borrower Generator
import type { BorrowerProfile, RiskTier, Region, EmploymentType, KycLevel } from '@/types/borrower.types';

// African first/last names
const AFRICAN_FIRST_NAMES = [
  'Amara', 'Kwame', 'Fatou', 'Kofi', 'Nia', 'Jabari', 'Zuri', 'Sekou', 'Adaeze', 'Olumide',
  'Chiamaka', 'Tendai', 'Nkechi', 'Obinna', 'Yaa', 'Mensah', 'Akinyi', 'Chidi', 'Folake', 'Emeka'
];
const AFRICAN_LAST_NAMES = [
  'Okonkwo', 'Mensah', 'Diallo', 'Osei', 'Kamara', 'Traore', 'Adeyemi', 'Nkrumah', 'Achebe', 'Kenyatta',
  'Mandela', 'Mbeki', 'Soyinka', 'Onyango', 'Mwangi', 'Okello', 'Banda', 'Moyo', 'Chukwu', 'Afolabi'
];

const GLOBAL_FIRST_NAMES = [
  'James', 'Maria', 'Jean', 'Carlos', 'Emma', 'Lucas', 'Sophie', 'Ahmed', 'Fatima', 'Oliver',
  'Isabella', 'Noah', 'Mia', 'Ethan', 'Ava', 'Liam', 'Charlotte', 'Benjamin', 'Amelia', 'William'
];
const GLOBAL_LAST_NAMES = [
  'Smith', 'Garcia', 'Martin', 'Rodriguez', 'Johnson', 'Dubois', 'Hassan', 'Silva', 'Brown', 'Williams',
  'Jones', 'Davis', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'White', 'Harris'
];

const REGION_CONFIG = {
  africa: {
    countries: ['KE', 'NG', 'GH', 'ZA', 'EG', 'MA'],
    incomeRange: [8000, 85000] as [number, number],
    employmentTypes: ['mobile_money_agent', 'agritech_farmer', 'remittance_receiver', 'fintech_employee'] as EmploymentType[],
    walletProviders: ['m-pesa', 'mtn_momo', 'airtel_money'] as const,
    firstNames: AFRICAN_FIRST_NAMES,
    lastNames: AFRICAN_LAST_NAMES,
  },
  global: {
    countries: ['US', 'BR', 'FR', 'ES', 'EG'],
    incomeRange: [25000, 150000] as [number, number],
    employmentTypes: ['software_engineer', 'teacher', 'nurse', 'freelancer'] as EmploymentType[],
    walletProviders: ['metamask', 'coinbase', 'trust_wallet'] as const,
    firstNames: GLOBAL_FIRST_NAMES,
    lastNames: GLOBAL_LAST_NAMES,
  }
};

const RISK_DEBT_RATIOS: Record<RiskTier, [number, number]> = {
  A: [0.05, 0.20],
  B: [0.15, 0.35],
  C: [0.25, 0.45],
  D: [0.35, 0.65]
};

// Utility functions
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, decimals = 3) => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const randomChoice = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const weightedChoice = <T>(items: T[], weights: number[]): T => {
  const total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
};

const generateId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const generateWalletAddress = (region: Region): string => {
  const config = REGION_CONFIG[region];
  const provider = randomChoice(config.walletProviders);
  
  if (provider === 'm-pesa' || provider === 'mtn_momo' || provider === 'airtel_money') {
    return `${provider}:${generateId().slice(0, 8)}`;
  }
  
  const hex = Array.from({ length: 40 }, () => 
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('');
  return `0x${hex}`;
};

const computeCreditScore = (profile: Partial<BorrowerProfile>): number => {
  let score = 300;
  
  // Payment history (35%)
  score += profile.payment_history_good ? 150 : 50;
  
  // Debt utilization (30%)
  score += Math.floor(100 * (1 - (profile.debt_to_income_ratio || 0.3)));
  
  // Length of history (15%)
  score += Math.min(75, (profile.employment_months || 0) * 0.3);
  score += Math.min(25, (profile.wallet_age_days || 0) * 0.01);
  
  // New credit (10%)
  score += Math.max(0, 50 - (profile.recent_inquiries || 0) * 10);
  
  // Mix (10%)
  score += Math.floor((profile.onchain_reputation || 0.7) * 50);
  
  return Math.min(850, Math.max(300, Math.floor(score)));
};

const assignRiskTier = (score: number): RiskTier => {
  if (score >= 750) return 'A';
  if (score >= 700) return 'B';
  if (score >= 650) return 'C';
  return 'D';
};

export function generateBorrower(
  profileId: number,
  region?: Region,
  riskTier?: RiskTier
): BorrowerProfile {
  const actualRegion = region || randomChoice(['africa', 'global'] as const);
  const config = REGION_CONFIG[actualRegion];
  
  const tier = riskTier || randomChoice(['A', 'B', 'C', 'D'] as const);
  const [minDebt, maxDebt] = RISK_DEBT_RATIOS[tier];
  const debtRatio = randomFloat(minDebt, maxDebt);
  
  const baseIncome = randomInt(...config.incomeRange);
  
  const partialProfile: Partial<BorrowerProfile> = {
    payment_history_good: weightedChoice([true, false], [85, 15]),
    debt_to_income_ratio: debtRatio,
    employment_months: randomInt(6, 240),
    wallet_age_days: randomInt(30, 1825),
    recent_inquiries: randomInt(0, 4),
    onchain_reputation: randomFloat(0.4, 1.0),
  };
  
  const creditScore = computeCreditScore(partialProfile);
  
  return {
    borrower_id: generateId(),
    profile_id: profileId,
    wallet_address: generateWalletAddress(actualRegion),
    first_name: randomChoice(config.firstNames),
    last_name: randomChoice(config.lastNames),
    country: randomChoice(config.countries),
    region: actualRegion,
    age: randomInt(22, 55),
    
    annual_income_usd: Math.round(baseIncome * (1 + debtRatio * 0.1)),
    monthly_debt_payments_usd: Math.round(baseIncome * debtRatio * 0.12),
    debt_to_income_ratio: debtRatio,
    employment_months: partialProfile.employment_months!,
    employment_type: randomChoice(config.employmentTypes),
    
    wallet_age_days: partialProfile.wallet_age_days!,
    total_deposits_usd: randomFloat(100, 50000, 2),
    tx_count_90d: randomInt(5, 250),
    avg_tx_value_usd: randomFloat(50, 2000, 2),
    
    payment_history_good: partialProfile.payment_history_good!,
    recent_inquiries: partialProfile.recent_inquiries!,
    delinquencies_12m: randomInt(0, 2),
    
    onchain_reputation: partialProfile.onchain_reputation!,
    velocity_score: randomFloat(0.6, 1.0),
    kyc_level: randomChoice(['basic', 'intermediate', 'full'] as KycLevel[]),
    
    credit_score: creditScore,
    risk_tier: assignRiskTier(creditScore),
  };
}

export function generateBorrowerDataset(
  count: number,
  regionMix: Record<Region, number> = { africa: 0.6, global: 0.4 },
  tierDistribution: Record<RiskTier, number> = { A: 0.25, B: 0.35, C: 0.25, D: 0.15 }
): BorrowerProfile[] {
  const regions = Object.keys(regionMix) as Region[];
  const regionWeights = Object.values(regionMix);
  const tiers = Object.keys(tierDistribution) as RiskTier[];
  const tierWeights = Object.values(tierDistribution);
  
  return Array.from({ length: count }, (_, i) => {
    const region = weightedChoice(regions, regionWeights);
    const tier = weightedChoice(tiers, tierWeights);
    return generateBorrower(i + 1, region, tier);
  });
}
