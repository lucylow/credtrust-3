import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Award,
  Shield,
  BarChart3,
  Download,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import CreditHistory from './CreditHistory';
import RiskVisualization from './RiskVisualization';
import PortfolioAnalytics from './PortfolioAnalytics';
import CreditFactors from './CreditFactors';
import { CreditAnalytics } from '@/types/analytics.types';
import { fetchCreditAnalytics } from '@/services/analytics.service';

export default function CreditDashboard() {
  const [analytics, setAnalytics] = useState<CreditAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await fetchCreditAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 h-32 animate-pulse bg-muted/30" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 h-80 animate-pulse bg-muted/30" />
          <div className="glass-card p-6 h-80 animate-pulse bg-muted/30" />
        </div>
      </div>
    );
  }

  const scoreChange = analytics.currentScore - analytics.previousScore;
  const isPositiveChange = scoreChange >= 0;

  const kpiCards = [
    {
      label: 'Current Credit Score',
      value: analytics.currentScore,
      change: `${isPositiveChange ? '+' : ''}${scoreChange} points`,
      isPositive: isPositiveChange,
      icon: isPositiveChange ? TrendingUp : TrendingDown,
      color: 'from-primary to-blue-600',
    },
    {
      label: 'Risk Tier',
      value: analytics.currentScore >= 750 ? 'A' : analytics.currentScore >= 650 ? 'B' : 'C',
      subtext: `${analytics.peerComparison.percentile}th percentile`,
      icon: Award,
      color: 'from-success to-emerald-600',
    },
    {
      label: 'Market Comparison',
      value: `+${Math.round(analytics.currentScore - analytics.peerComparison.avgScore)}`,
      subtext: `Above average (${analytics.peerComparison.avgScore})`,
      icon: BarChart3,
      color: 'from-secondary to-pink-600',
    },
    {
      label: 'Default Probability',
      value: `${analytics.defaultProbability}%`,
      subtext: 'Based on confidential risk model',
      icon: Shield,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Credit Analytics</h1>
          <p className="text-muted-foreground">
            Confidential insights into your credit profile and market trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
                {card.change && (
                  <div className="flex items-center gap-1 mt-1">
                    <card.icon
                      className={`h-4 w-4 ${card.isPositive ? 'text-success' : 'text-destructive'}`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        card.isPositive ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      {card.change}
                    </span>
                  </div>
                )}
                {card.subtext && (
                  <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
                )}
              </div>
              <div
                className={`p-2 rounded-lg bg-gradient-to-br ${card.color} opacity-80`}
              >
                <card.icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <CreditHistory history={analytics.scoreHistory} currentScore={analytics.currentScore} />
        <RiskVisualization distribution={analytics.riskDistribution} />
      </div>

      {/* Analytics Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <PortfolioAnalytics />
        <CreditFactors factors={analytics.factors} />
      </div>

      {/* Loan Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Loan Performance</h3>
            <p className="text-sm text-muted-foreground">
              Monthly approval vs default rates (confidential data)
            </p>
          </div>
          <Activity className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analytics.loanPerformance}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card p-3 shadow-lg border border-border">
                        <p className="font-medium text-foreground mb-2">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
              <Bar
                dataKey="approved"
                name="Approved"
                fill="hsl(var(--success))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="funded"
                name="Funded"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="defaulted"
                name="Defaulted"
                fill="hsl(var(--destructive))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
