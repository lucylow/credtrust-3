// Loan Service - Enhanced mock implementation with realistic borrower data

import { Loan, LoanStats } from '@/types/loan.types';
import { getProductionBorrowers, getDemoBorrowers } from '@/mocks/productionDatasets';
import type { BorrowerProfile } from '@/types/borrower.types';

// Convert borrower profiles to loans
const borrowerToLoan = (borrower: BorrowerProfile, index: number): Loan => {
  const loanTitles: Record<string, string[]> = {
    mobile_money_agent: ['Mobile Money Business Expansion', 'Agent Network Growth', 'Float Capital'],
    agritech_farmer: ['Seasonal Crop Financing', 'Farm Equipment Purchase', 'Irrigation System'],
    remittance_receiver: ['Family Business Investment', 'Home Improvement', 'Education Funding'],
    fintech_employee: ['Tech Startup Funding', 'Professional Development', 'Investment Portfolio'],
    software_engineer: ['SaaS Development', 'Equipment Upgrade', 'Co-working Space'],
    teacher: ['Education Materials', 'Online Course Development', 'Tutoring Business'],
    nurse: ['Healthcare Equipment', 'Clinic Expansion', 'Medical Training'],
    freelancer: ['Business Expansion', 'Marketing Campaign', 'Equipment Purchase'],
  };

  const titles = loanTitles[borrower.employment_type] || ['General Business Loan'];
  const title = titles[index % titles.length];
  
  const descriptions: Record<string, string> = {
    mobile_money_agent: 'Expanding mobile money services to underserved communities',
    agritech_farmer: 'Agricultural investment for sustainable farming practices',
    remittance_receiver: 'Family-backed investment in local business opportunity',
    fintech_employee: 'Technology-enabled financial service innovation',
    software_engineer: 'Digital product development and scaling',
    teacher: 'Educational technology and content development',
    nurse: 'Healthcare service improvement initiative',
    freelancer: 'Independent business growth and client expansion',
  };

  // Calculate loan amount based on income and risk tier
  const incomeMultiplier = { A: 0.5, B: 0.35, C: 0.25, D: 0.15 };
  const baseAmount = borrower.annual_income_usd * incomeMultiplier[borrower.risk_tier];
  const amount = Math.round(baseAmount / 100) * 100; // Round to nearest 100

  // Interest rates by risk tier (reflecting African market rates)
  const interestRates = { A: 8 + Math.random() * 4, B: 12 + Math.random() * 5, C: 18 + Math.random() * 6, D: 25 + Math.random() * 8 };
  
  // Collateral based on wallet type
  const isAfricanWallet = borrower.wallet_address.includes('pesa') || borrower.wallet_address.includes('momo') || borrower.wallet_address.includes('airtel');
  const collateralType = isAfricanWallet 
    ? (Math.random() > 0.7 ? 'rwa' : 'none')
    : (['crypto', 'nft', 'rwa', 'none'] as const)[Math.floor(Math.random() * 4)];

  const statuses = ['active', 'active', 'active', 'funded', 'repaid'] as const;
  const fundedPercent = Math.random();

  return {
    id: `loan-${borrower.borrower_id}`,
    title,
    description: descriptions[borrower.employment_type] || 'Business growth financing',
    borrower: borrower.wallet_address,
    amount,
    interestRate: Number(interestRates[borrower.risk_tier].toFixed(2)),
    termMonths: [3, 6, 12, 18, 24][Math.floor(Math.random() * 5)],
    riskTier: borrower.risk_tier === 'D' ? 'C' : borrower.risk_tier, // Clamp D to C for UI
    collateralType,
    collateralAmount: collateralType !== 'none' ? Math.floor(amount * (0.3 + Math.random() * 0.4)) : undefined,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    creditScore: borrower.credit_score,
    fundedAmount: Math.floor(amount * fundedPercent),
    lendersCount: Math.floor(Math.random() * 15) + 1,
    createdAt: Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000),
    expiresAt: Date.now() + Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000),
    minInvestment: Math.max(50, Math.floor(amount * 0.01)),
  };
};

// Generate loans from borrower profiles
const generateMockLoans = (): Loan[] => {
  const demoBorrowers = getDemoBorrowers();
  const productionBorrowers = getProductionBorrowers(50); // Get 50 production borrowers
  
  const allBorrowers = [...demoBorrowers, ...productionBorrowers];
  return allBorrowers.map((b, i) => borrowerToLoan(b, i));
};

let mockLoans = generateMockLoans();

export async function fetchLoans(): Promise<Loan[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLoans;
}

export async function fetchLoanById(id: string): Promise<Loan | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockLoans.find(loan => loan.id === id) || null;
}

export async function applyForLoan(loanId: string, amount: number, walletAddress: string): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const loan = mockLoans.find(l => l.id === loanId);
  if (!loan) {
    return { success: false, message: 'Loan not found' };
  }
  
  if (amount < loan.minInvestment) {
    return { success: false, message: `Minimum investment is $${loan.minInvestment}` };
  }
  
  if (loan.fundedAmount + amount > loan.amount) {
    return { success: false, message: 'Investment exceeds remaining amount' };
  }
  
  // Update mock data
  loan.fundedAmount += amount;
  loan.lendersCount += 1;
  
  if (loan.fundedAmount >= loan.amount) {
    loan.status = 'funded';
  }
  
  return { success: true, message: 'Investment successful!' };
}

export async function fetchLoanStats(): Promise<LoanStats> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const totalVolume = mockLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const avgInterest = mockLoans.length > 0 
    ? mockLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / mockLoans.length
    : 0;
  const activeLoans = mockLoans.filter(loan => loan.status === 'active').length;
  const totalLenders = mockLoans.reduce((sum, loan) => sum + loan.lendersCount, 0);
  
  return { totalVolume, avgInterest, activeLoans, totalLenders };
}
