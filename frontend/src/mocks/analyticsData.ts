// Mock Analytics Data for Dashboard
import type { RiskTier } from '@/types/borrower.types';

export interface DashboardMetric {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  trend: number[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface RegionData {
  region: string;
  borrowers: number;
  volume: number;
  avgScore: number;
}

export interface TierDistribution {
  tier: RiskTier;
  count: number;
  percentage: number;
  color: string;
}

// Dashboard metrics
export function getDashboardMetrics(): DashboardMetric[] {
  return [
    {
      label: 'Total Applications',
      value: '1,247',
      change: '+12.5%',
      isPositive: true,
      trend: [45, 52, 38, 65, 72, 58, 81, 94, 87, 105, 112, 124],
    },
    {
      label: 'Active Lenders',
      value: '89',
      change: '+5.2%',
      isPositive: true,
      trend: [65, 68, 72, 71, 75, 78, 80, 82, 84, 86, 88, 89],
    },
    {
      label: 'TEE Validations',
      value: '3,892',
      change: '+23.1%',
      isPositive: true,
      trend: [180, 220, 245, 289, 312, 345, 378, 412, 445, 489, 520, 567],
    },
    {
      label: 'Avg. Processing',
      value: '2.3s',
      change: '-15%',
      isPositive: true,
      trend: [4.2, 3.8, 3.5, 3.2, 2.9, 2.8, 2.6, 2.5, 2.4, 2.3, 2.3, 2.3],
    },
    {
      label: 'Default Rate',
      value: '1.8%',
      change: '-0.4%',
      isPositive: true,
      trend: [3.1, 2.9, 2.7, 2.5, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.8, 1.8],
    },
    {
      label: 'Total Volume',
      value: '$4.2M',
      change: '+18.3%',
      isPositive: true,
      trend: [1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.0, 4.2],
    },
  ];
}

// Weekly loan volume
export function getWeeklyLoanVolume(): TimeSeriesData[] {
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
  const baseValue = 150000;
  
  return weeks.map((week, i) => ({
    date: week,
    value: Math.round(baseValue * (1 + i * 0.08 + Math.random() * 0.1)),
    label: `Week ${i + 1}`,
  }));
}

// Monthly applications
export function getMonthlyApplications(): TimeSeriesData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseValue = 150;
  
  return months.map((month, i) => ({
    date: month,
    value: Math.round(baseValue * (1 + i * 0.15 + Math.random() * 0.05)),
    label: month,
  }));
}

// Region breakdown
export function getRegionBreakdown(): RegionData[] {
  return [
    { region: 'Kenya', borrowers: 342, volume: 1250000, avgScore: 712 },
    { region: 'Nigeria', borrowers: 287, volume: 980000, avgScore: 698 },
    { region: 'Ghana', borrowers: 198, volume: 720000, avgScore: 725 },
    { region: 'South Africa', borrowers: 156, volume: 650000, avgScore: 738 },
    { region: 'Egypt', borrowers: 134, volume: 480000, avgScore: 705 },
    { region: 'Morocco', borrowers: 89, volume: 320000, avgScore: 695 },
    { region: 'Global (Other)', borrowers: 41, volume: 180000, avgScore: 745 },
  ];
}

// Risk tier distribution
export function getTierDistribution(): TierDistribution[] {
  return [
    { tier: 'A', count: 312, percentage: 25, color: 'hsl(142, 76%, 36%)' },
    { tier: 'B', count: 436, percentage: 35, color: 'hsl(47, 96%, 53%)' },
    { tier: 'C', count: 312, percentage: 25, color: 'hsl(32, 95%, 44%)' },
    { tier: 'D', count: 187, percentage: 15, color: 'hsl(0, 84%, 60%)' },
  ];
}

// Recent activity feed
export interface ActivityItem {
  id: string;
  type: 'application' | 'validation' | 'nft' | 'loan' | 'repayment';
  message: string;
  time: string;
  timestamp: number;
  metadata?: {
    borrower?: string;
    amount?: number;
    score?: number;
    tier?: RiskTier;
  };
}

export function getRecentActivity(count = 10): ActivityItem[] {
  const activities: Omit<ActivityItem, 'id' | 'timestamp'>[] = [
    { type: 'application', message: 'New credit application from Kenya', time: '2 min ago', metadata: { borrower: 'Amara O.', amount: 5000 } },
    { type: 'validation', message: 'TEE validation completed', time: '5 min ago', metadata: { score: 742, tier: 'B' } },
    { type: 'nft', message: 'Credit NFT minted (Tier A)', time: '8 min ago', metadata: { tier: 'A', score: 785 } },
    { type: 'loan', message: 'Loan fully funded', time: '12 min ago', metadata: { amount: 3500 } },
    { type: 'repayment', message: 'Loan repayment received', time: '18 min ago', metadata: { amount: 850 } },
    { type: 'application', message: 'New credit application from Nigeria', time: '24 min ago', metadata: { borrower: 'Kofi M.', amount: 8000 } },
    { type: 'validation', message: 'TEE batch processing (5 records)', time: '31 min ago' },
    { type: 'nft', message: 'Credit NFT minted (Tier B)', time: '45 min ago', metadata: { tier: 'B', score: 718 } },
    { type: 'loan', message: 'New loan listing created', time: '52 min ago', metadata: { amount: 12000 } },
    { type: 'application', message: 'New credit application from Ghana', time: '1 hour ago', metadata: { borrower: 'Fatou D.', amount: 2500 } },
  ];
  
  return activities.slice(0, count).map((activity, i) => ({
    ...activity,
    id: `activity-${Date.now()}-${i}`,
    timestamp: Date.now() - i * 180000,
  }));
}

// Credit score distribution histogram
export function getScoreDistribution(): { range: string; count: number }[] {
  return [
    { range: '300-400', count: 23 },
    { range: '400-500', count: 67 },
    { range: '500-600', count: 189 },
    { range: '600-700', count: 412 },
    { range: '700-800', count: 398 },
    { range: '800-850', count: 158 },
  ];
}

// Loan performance metrics
export interface LoanPerformanceData {
  month: string;
  disbursed: number;
  repaid: number;
  defaulted: number;
}

export function getLoanPerformance(): LoanPerformanceData[] {
  return [
    { month: 'Jan', disbursed: 420000, repaid: 380000, defaulted: 8500 },
    { month: 'Feb', disbursed: 485000, repaid: 410000, defaulted: 7200 },
    { month: 'Mar', disbursed: 520000, repaid: 465000, defaulted: 6800 },
    { month: 'Apr', disbursed: 610000, repaid: 520000, defaulted: 9100 },
    { month: 'May', disbursed: 680000, repaid: 595000, defaulted: 7800 },
    { month: 'Jun', disbursed: 750000, repaid: 640000, defaulted: 8200 },
  ];
}
