import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { CreditFactor } from '@/types/analytics.types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CreditFactorsProps {
  factors: CreditFactor[];
}

export default function CreditFactors({ factors }: CreditFactorsProps) {
  const impactIcons = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: Minus,
  };

  const impactColors = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  const progressColors = {
    positive: 'bg-success',
    negative: 'bg-destructive',
    neutral: 'bg-muted-foreground',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-bold text-foreground mb-6">Credit Score Factors</h3>
      <div className="space-y-5">
        {factors.map((factor, index) => {
          const Icon = impactIcons[factor.impact];
          const percentage = (factor.score / factor.maxScore) * 100;

          return (
            <motion.div
              key={factor.factor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${impactColors[factor.impact]}`} />
                  <span className="font-medium text-foreground">{factor.factor}</span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {factor.score}/{factor.maxScore}
                </span>
              </div>
              <div className="relative">
                <Progress value={percentage} className="h-2" />
                <div
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all ${progressColors[factor.impact]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{factor.description}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
