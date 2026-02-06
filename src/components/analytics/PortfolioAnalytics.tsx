import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, BarChart3, Shield, PieChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PortfolioStats } from '@/types/analytics.types';
import { fetchPortfolioStats } from '@/services/analytics.service';

export default function PortfolioAnalytics() {
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchPortfolioStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load portfolio stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="glass-card p-6 h-64 animate-pulse bg-muted/30" />
    );
  }

  const portfolioItems = [
    {
      label: 'Total Invested',
      value: `$${stats.totalInvested.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-primary to-blue-600',
    },
    {
      label: 'Expected Return',
      value: `${stats.expectedReturn}%`,
      icon: TrendingUp,
      color: 'from-success to-emerald-600',
    },
    {
      label: 'Active Positions',
      value: stats.activePositions.toString(),
      icon: BarChart3,
      color: 'from-secondary to-pink-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-bold text-foreground mb-6">Portfolio Overview</h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {portfolioItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div
              className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
            >
              <item.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Risk Score */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Risk Score</span>
            </div>
            <span className="text-sm font-bold text-foreground">{stats.riskScore}/100</span>
          </div>
          <Progress value={stats.riskScore} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.riskScore <= 30 ? 'Conservative' : stats.riskScore <= 60 ? 'Moderate' : 'Aggressive'}
          </p>
        </div>

        {/* Diversification Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Diversification</span>
            </div>
            <span className="text-sm font-bold text-foreground">{stats.diversificationScore}/100</span>
          </div>
          <Progress value={stats.diversificationScore} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.diversificationScore >= 80 ? 'Well diversified' : stats.diversificationScore >= 50 ? 'Moderately diversified' : 'Consider diversifying'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
