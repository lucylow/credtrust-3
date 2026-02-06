// Production Mock Loan Data
import type { Loan, LoanStats } from '@/types/loan.types';
import { DEMO_BORROWERS_LIST } from './demoBorrowers';

// Loan purposes for variety
const LOAN_PURPOSES = [
  { title: 'Mobile Money Expansion', description: 'Expand M-Pesa agent network in Nairobi suburbs' },
  { title: 'Agricultural Equipment', description: 'Purchase irrigation equipment for farm modernization' },
  { title: 'Inventory Financing', description: 'Stock up on electronics for retail business' },
  { title: 'Education Loan', description: 'Fund professional certification in software development' },
  { title: 'Healthcare Equipment', description: 'Acquire medical supplies for rural clinic' },
  { title: 'Solar Installation', description: 'Install solar panels for off-grid community center' },
  { title: 'Textile Business', description: 'Expand garment manufacturing capacity' },
  { title: 'Transport Fleet', description: 'Purchase boda-boda motorcycles for ride-sharing' },
  { title: 'Cold Storage', description: 'Build cold chain storage for agricultural products' },
  { title: 'E-commerce Platform', description: 'Launch online marketplace for local artisans' },
  { title: 'Microfinance Operations', description: 'Expand lending capacity to underserved communities' },
  { title: 'Real Estate Development', description: 'Construct affordable housing units' },
];

const COLLATERAL_TYPES: Array<'crypto' | 'nft' | 'rwa' | 'none'> = ['crypto', 'nft', 'rwa', 'none'];

function generateLoanId(): string {
  return `loan-${Math.random().toString(36).substring(2, 10)}`;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Generate a single loan
export function generateLoan(borrowerIndex?: number): Loan {
  const borrower = borrowerIndex !== undefined 
    ? DEMO_BORROWERS_LIST[borrowerIndex % DEMO_BORROWERS_LIST.length]
    : getRandomElement(DEMO_BORROWERS_LIST);
  
  const purpose = getRandomElement(LOAN_PURPOSES);
  const riskTier = borrower.risk_tier === 'D' ? 'C' : borrower.risk_tier as 'A' | 'B' | 'C';
  
  // Interest rates based on risk tier
  const interestRateRanges = {
    A: [4.5, 8.5],
    B: [8.0, 14.0],
    C: [12.0, 22.0],
  };
  const [minRate, maxRate] = interestRateRanges[riskTier];
  
  const amount = randomInt(500, 50000);
  const termMonths = getRandomElement([3, 6, 12, 18, 24, 36]);
  const fundedPercent = randomFloat(0, 100);
  const fundedAmount = Math.round(amount * fundedPercent / 100);
  
  const collateralType = getRandomElement(COLLATERAL_TYPES);
  const hasCollateral = collateralType !== 'none';
  
  const now = Date.now();
  const createdAt = now - randomInt(1, 30) * 24 * 60 * 60 * 1000; // 1-30 days ago
  const expiresAt = createdAt + randomInt(7, 60) * 24 * 60 * 60 * 1000; // 7-60 days after creation
  
  const statuses: Array<'active' | 'funded' | 'repaid' | 'defaulted'> = 
    fundedPercent >= 100 
      ? ['funded', 'repaid', 'defaulted'] 
      : ['active'];
  
  return {
    id: generateLoanId(),
    title: purpose.title,
    description: purpose.description,
    borrower: borrower.wallet_address,
    amount,
    interestRate: randomFloat(minRate, maxRate, 1),
    termMonths,
    riskTier,
    collateralType,
    collateralAmount: hasCollateral ? Math.round(amount * randomFloat(0.5, 1.5)) : undefined,
    status: getRandomElement(statuses),
    creditScore: borrower.credit_score,
    fundedAmount,
    lendersCount: fundedAmount > 0 ? randomInt(1, 15) : 0,
    createdAt,
    expiresAt,
    minInvestment: getRandomElement([25, 50, 100, 250, 500]),
  };
}

// Generate dataset of loans
export function generateLoanDataset(count: number): Loan[] {
  return Array.from({ length: count }, (_, i) => generateLoan(i));
}

// Pre-generated loans for consistent demo
let _demoLoans: Loan[] | null = null;

export function getDemoLoans(count = 24): Loan[] {
  if (!_demoLoans || _demoLoans.length < count) {
    _demoLoans = generateLoanDataset(count);
  }
  return _demoLoans.slice(0, count);
}

// Calculate loan stats
export function getLoanStats(): LoanStats {
  const loans = getDemoLoans();
  const activeLoans = loans.filter(l => l.status === 'active');
  
  const totalVolume = loans.reduce((sum, l) => sum + l.amount, 0);
  const avgInterest = loans.reduce((sum, l) => sum + l.interestRate, 0) / loans.length;
  const totalLenders = new Set(loans.flatMap(l => Array(l.lendersCount).fill(null).map((_, i) => `lender-${l.id}-${i}`))).size;
  
  return {
    totalVolume,
    avgInterest: parseFloat(avgInterest.toFixed(1)),
    activeLoans: activeLoans.length,
    totalLenders,
  };
}

// Featured loans for homepage
export function getFeaturedLoans(): Loan[] {
  const loans = getDemoLoans();
  // Return top 3 active loans with highest funding progress
  return loans
    .filter(l => l.status === 'active')
    .sort((a, b) => (b.fundedAmount / b.amount) - (a.fundedAmount / a.amount))
    .slice(0, 3);
}
