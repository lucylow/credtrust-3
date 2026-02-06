// Analytics Service - Mock implementation for demo

import { CreditAnalytics, PortfolioStats, ScoreHistoryPoint, RiskDistribution, LoanPerformancePoint, CreditFactor } from '@/types/analytics.types';

const generateScoreHistory = (timeRange: string): ScoreHistoryPoint[] => {
  const points: ScoreHistoryPoint[] = [];
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const baseScore = 720;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variation = Math.sin(i / 10) * 20 + Math.random() * 10;
    points.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.round(baseScore + variation + (days - i) * 0.3),
    });
  }
  
  // Add projected points
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const lastScore = points[points.length - 1].score;
    points.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.round(lastScore + i * 0.5),
      projected: true,
    });
  }
  
  return points;
};

const generateRiskDistribution = (): RiskDistribution[] => [
  { tier: 'A', count: 1247, percentage: 45, color: '#10B981' },
  { tier: 'B', count: 892, percentage: 32, color: '#F59E0B' },
  { tier: 'C', count: 423, percentage: 15, color: '#EF4444' },
  { tier: 'D', count: 221, percentage: 8, color: '#8B5CF6' },
];

const generateLoanPerformance = (): LoanPerformancePoint[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    approved: Math.floor(Math.random() * 300) + 200,
    defaulted: Math.floor(Math.random() * 20) + 5,
    funded: Math.floor(Math.random() * 250) + 150,
  }));
};

const generateCreditFactors = (): CreditFactor[] => [
  {
    factor: 'Payment History',
    impact: 'positive',
    score: 95,
    maxScore: 100,
    description: 'Excellent on-time payment record',
  },
  {
    factor: 'Credit Utilization',
    impact: 'positive',
    score: 85,
    maxScore: 100,
    description: 'Low credit utilization ratio',
  },
  {
    factor: 'Credit Age',
    impact: 'neutral',
    score: 70,
    maxScore: 100,
    description: 'Average length of credit history',
  },
  {
    factor: 'Credit Mix',
    impact: 'positive',
    score: 80,
    maxScore: 100,
    description: 'Good variety of credit types',
  },
  {
    factor: 'Recent Inquiries',
    impact: 'negative',
    score: 60,
    maxScore: 100,
    description: 'Recent credit applications detected',
  },
  {
    factor: 'Debt-to-Income',
    impact: 'positive',
    score: 88,
    maxScore: 100,
    description: 'Healthy debt-to-income ratio',
  },
];

export async function fetchCreditAnalytics(timeRange: string = '30d'): Promise<CreditAnalytics> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const scoreHistory = generateScoreHistory(timeRange);
  const currentScore = scoreHistory[scoreHistory.length - 6].score; // Last non-projected
  const previousScore = scoreHistory[0].score;
  
  return {
    currentScore,
    previousScore,
    scoreHistory,
    riskDistribution: generateRiskDistribution(),
    loanPerformance: generateLoanPerformance(),
    peerComparison: {
      percentile: 78,
      avgScore: 680,
      betterThan: 78,
    },
    factors: generateCreditFactors(),
    defaultProbability: currentScore >= 750 ? 0.5 : currentScore >= 650 ? 2.3 : 8.7,
  };
}

export async function fetchPortfolioStats(): Promise<PortfolioStats> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    totalInvested: 125000,
    expectedReturn: 12.5,
    activePositions: 8,
    riskScore: 35,
    diversificationScore: 82,
  };
}
