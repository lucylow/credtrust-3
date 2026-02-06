// Mock Data Exports
export * from './mockData';
export * from './api';
export * from './borrowerGenerator';
export * from './demoBorrowers';
export * from './portfolioData';
export * from './productionDatasets';
export * from './loanData';
export * from './teeData';
export * from './iexecData';
export * from './analyticsData';

// Re-export types
export type {
  BorrowerProfile,
  Portfolio,
  PortfolioTranche,
  ZKProof,
  ContractEvent,
  APIResponse,
  RiskTier,
  Region,
  KycLevel,
  EmploymentType,
} from '@/types/borrower.types';

export type {
  Loan,
  LoanFilter,
  LoanApplication,
  LoanStats,
} from '@/types/loan.types';
