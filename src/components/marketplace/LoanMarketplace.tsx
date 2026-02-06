import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, TrendingUp, DollarSign, Users, Percent, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoanCard from './LoanCard';
import LoanFilters from './LoanFilters';
import LoanApplication from './LoanApplication';
import { Loan, LoanFilter, LoanStats } from '@/types/loan.types';
import { fetchLoans, fetchLoanStats } from '@/services/loan.service';

export default function LoanMarketplace() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rate' | 'risk' | 'newest'>('rate');
  const [stats, setStats] = useState<LoanStats | null>(null);
  const [filters, setFilters] = useState<LoanFilter>({
    minAmount: 0,
    maxAmount: 100000,
    minTerm: 0,
    maxTerm: 60,
    riskTiers: ['A', 'B', 'C'],
    collateralTypes: ['crypto', 'nft', 'rwa', 'none'],
    status: 'active',
  });
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [loansData, statsData] = await Promise.all([
        fetchLoans(),
        fetchLoanStats(),
      ]);
      setLoans(loansData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLoans = useMemo(() => {
    let result = [...loans];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (loan) =>
          loan.title.toLowerCase().includes(term) ||
          loan.description.toLowerCase().includes(term)
      );
    }

    // Apply filters
    result = result.filter((loan) => {
      if (loan.amount < filters.minAmount || loan.amount > filters.maxAmount) return false;
      if (loan.termMonths < filters.minTerm || loan.termMonths > filters.maxTerm) return false;
      if (!filters.riskTiers.includes(loan.riskTier)) return false;
      if (!filters.collateralTypes.includes(loan.collateralType)) return false;
      if (filters.status && loan.status !== filters.status) return false;
      return true;
    });

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rate':
          return a.interestRate - b.interestRate;
        case 'risk':
          return a.riskTier.localeCompare(b.riskTier);
        case 'newest':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });

    return result;
  }, [loans, searchTerm, filters, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Credit Marketplace</h1>
            <p className="text-muted-foreground">
              Access undercollateralized loans using your confidential credit score
            </p>
          </div>
          <Button onClick={loadData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Volume</p>
                  <p className="text-xl font-bold text-foreground">
                    ${(stats.totalVolume / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Percent className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg. Interest</p>
                  <p className="text-xl font-bold text-foreground">
                    {stats.avgInterest.toFixed(1)}%
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Loans</p>
                  <p className="text-xl font-bold text-foreground">{stats.activeLoans}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Lenders</p>
                  <p className="text-xl font-bold text-foreground">{stats.totalLenders}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters && <X className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm"
          >
            <option value="rate">Best Rate</option>
            <option value="risk">Lowest Risk</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="lg:w-80 flex-shrink-0"
            >
              <LoanFilters filters={filters} onFilterChange={setFilters} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loans Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredLoans.length} loans
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="glass-card p-6 h-80 animate-pulse bg-muted/30"
                />
              ))}
            </div>
          ) : filteredLoans.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredLoans.map((loan, index) => (
                <motion.div
                  key={loan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <LoanCard loan={loan} onApply={() => setSelectedLoan(loan)} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No loans found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loan Application Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedLoan(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <LoanApplication
                loan={selectedLoan}
                onClose={() => setSelectedLoan(null)}
                onSuccess={() => {
                  setSelectedLoan(null);
                  loadData();
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
