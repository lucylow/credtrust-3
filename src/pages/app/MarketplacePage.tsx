import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Filter, TrendingUp, Clock, Shield, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';

interface LoanOffer {
  id: string;
  lender: string;
  amount: string;
  apr: string;
  term: string;
  requiredScore: number;
  collateral: string;
  status: 'available' | 'pending' | 'funded';
}

const mockLoans: LoanOffer[] = [
  {
    id: '1',
    lender: 'DeFi Prime',
    amount: '50,000 USDC',
    apr: '8.5%',
    term: '12 months',
    requiredScore: 700,
    collateral: '25%',
    status: 'available',
  },
  {
    id: '2',
    lender: 'Aave Institution',
    amount: '100,000 USDC',
    apr: '6.2%',
    term: '24 months',
    requiredScore: 750,
    collateral: '15%',
    status: 'available',
  },
  {
    id: '3',
    lender: 'Compound Labs',
    amount: '25,000 USDC',
    apr: '11.0%',
    term: '6 months',
    requiredScore: 650,
    collateral: '40%',
    status: 'pending',
  },
  {
    id: '4',
    lender: 'MakerDAO',
    amount: '200,000 USDC',
    apr: '5.8%',
    term: '36 months',
    requiredScore: 800,
    collateral: '10%',
    status: 'available',
  },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScore, setFilterScore] = useState<number | null>(null);

  const filteredLoans = mockLoans.filter((loan) => {
    if (searchQuery && !loan.lender.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterScore && loan.requiredScore > filterScore) {
      return false;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Loan Marketplace</h1>
        <p className="text-muted-foreground">
          Browse confidential loan offers that match your credit tier
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Offers', value: '47', icon: TrendingUp },
          { label: 'Avg APR', value: '7.8%', icon: DollarSign },
          { label: 'Available Now', value: '32', icon: Clock },
          { label: 'TEE Verified', value: '100%', icon: Shield },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="p-2 rounded-lg bg-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lenders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Loan Cards */}
      <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-6">
        {filteredLoans.map((loan) => (
          <StaggerItem key={loan.id}>
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-card p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{loan.lender}</h3>
                  <p className="text-2xl font-bold text-primary">{loan.amount}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    loan.status === 'available'
                      ? 'bg-success/20 text-success'
                      : loan.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {loan.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">APR</p>
                  <p className="font-semibold text-foreground">{loan.apr}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Term</p>
                  <p className="font-semibold text-foreground">{loan.term}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Collateral</p>
                  <p className="font-semibold text-foreground">{loan.collateral}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    Min Score: <span className="font-semibold text-foreground">{loan.requiredScore}</span>
                  </span>
                </div>
                <Button size="sm" className="gap-2 group">
                  Apply
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </motion.div>
  );
}
