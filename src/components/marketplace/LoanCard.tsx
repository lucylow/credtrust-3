import { motion } from 'framer-motion';
import { TrendingUp, Clock, Shield, Users, DollarSign, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loan } from '@/types/loan.types';

interface LoanCardProps {
  loan: Loan;
  onApply: () => void;
}

export default function LoanCard({ loan, onApply }: LoanCardProps) {
  const fundingProgress = (loan.fundedAmount / loan.amount) * 100;
  const remainingAmount = loan.amount - loan.fundedAmount;
  const daysRemaining = Math.ceil((loan.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));

  const riskColors = {
    A: 'from-success to-emerald-600',
    B: 'from-amber-500 to-yellow-600',
    C: 'from-destructive to-red-600',
  };

  const riskBgColors = {
    A: 'bg-success/10 border-success/30 text-success',
    B: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
    C: 'bg-destructive/10 border-destructive/30 text-destructive',
  };

  const collateralLabels = {
    crypto: '₿ Crypto',
    nft: '🖼️ NFT',
    rwa: '🏠 RWA',
    none: '🛡️ Unsecured',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-6 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${riskBgColors[loan.riskTier]}`}>
              Tier {loan.riskTier}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {collateralLabels[loan.collateralType]}
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {loan.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {loan.description}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${riskColors[loan.riskTier]} flex items-center justify-center shadow-lg`}>
          <Shield className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="h-3.5 w-3.5" />
            <span className="text-xs">Amount</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            ${loan.amount.toLocaleString()}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Percent className="h-3.5 w-3.5" />
            <span className="text-xs">Interest</span>
          </div>
          <p className="text-lg font-bold text-success">
            {loan.interestRate}% APR
          </p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">Term</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            {loan.termMonths} months
          </p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-xs">Credit Score</span>
          </div>
          <p className="text-lg font-bold text-primary">
            {loan.creditScore}
          </p>
        </div>
      </div>

      {/* Funding Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Funding Progress</span>
          <span className="font-medium text-foreground">{fundingProgress.toFixed(0)}%</span>
        </div>
        <Progress value={fundingProgress} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>${loan.fundedAmount.toLocaleString()} funded</span>
          <span>${remainingAmount.toLocaleString()} remaining</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">{loan.lendersCount} lenders</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{daysRemaining}d left</span>
          </div>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onApply();
          }}
          size="sm"
          variant="default"
          disabled={loan.status !== 'active'}
        >
          {loan.status === 'active' ? 'Invest' : loan.status === 'funded' ? 'Funded' : 'Closed'}
        </Button>
      </div>
    </motion.div>
  );
}
