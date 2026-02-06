import { Slider } from '@/components/ui/slider';
import { LoanFilter } from '@/types/loan.types';

interface LoanFiltersProps {
  filters: LoanFilter;
  onFilterChange: (filters: LoanFilter) => void;
}

const riskTiers = [
  { value: 'A', label: 'A - Low Risk', color: 'bg-success' },
  { value: 'B', label: 'B - Medium', color: 'bg-amber-500' },
  { value: 'C', label: 'C - Higher', color: 'bg-destructive' },
];

const collateralTypes = [
  { value: 'crypto', label: 'Crypto', icon: '₿' },
  { value: 'nft', label: 'NFTs', icon: '🖼️' },
  { value: 'rwa', label: 'RWA', icon: '🏠' },
  { value: 'none', label: 'Unsecured', icon: '🛡️' },
];

export default function LoanFilters({ filters, onFilterChange }: LoanFiltersProps) {
  const toggleRiskTier = (tier: string) => {
    const newTiers = filters.riskTiers.includes(tier)
      ? filters.riskTiers.filter(t => t !== tier)
      : [...filters.riskTiers, tier];
    onFilterChange({ ...filters, riskTiers: newTiers });
  };

  const toggleCollateralType = (type: string) => {
    const newTypes = filters.collateralTypes.includes(type)
      ? filters.collateralTypes.filter(t => t !== type)
      : [...filters.collateralTypes, type];
    onFilterChange({ ...filters, collateralTypes: newTypes });
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Amount Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Loan Amount</span>
          <span className="text-xs text-muted-foreground">
            ${filters.minAmount.toLocaleString()} - ${filters.maxAmount.toLocaleString()}
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Minimum</label>
            <Slider
              value={[filters.minAmount]}
              onValueChange={([value]) => onFilterChange({ ...filters, minAmount: value })}
              min={0}
              max={100000}
              step={1000}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Maximum</label>
            <Slider
              value={[filters.maxAmount]}
              onValueChange={([value]) => onFilterChange({ ...filters, maxAmount: value })}
              min={0}
              max={100000}
              step={1000}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Term Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Loan Term</span>
          <span className="text-xs text-muted-foreground">
            {filters.minTerm} - {filters.maxTerm} months
          </span>
        </div>
        <Slider
          value={[filters.minTerm, filters.maxTerm]}
          onValueChange={([min, max]) => onFilterChange({ ...filters, minTerm: min, maxTerm: max })}
          min={0}
          max={60}
          step={3}
          className="mt-2"
        />
      </div>

      {/* Risk Tiers */}
      <div>
        <span className="text-sm font-medium text-foreground block mb-3">Risk Tier</span>
        <div className="flex flex-wrap gap-2">
          {riskTiers.map((tier) => (
            <button
              key={tier.value}
              onClick={() => toggleRiskTier(tier.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filters.riskTiers.includes(tier.value)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${tier.color}`} />
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Collateral Types */}
      <div>
        <span className="text-sm font-medium text-foreground block mb-3">Collateral Type</span>
        <div className="grid grid-cols-2 gap-2">
          {collateralTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => toggleCollateralType(type.value)}
              className={`flex items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all ${
                filters.collateralTypes.includes(type.value)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <span className="text-lg">{type.icon}</span>
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <span className="text-sm font-medium text-foreground block mb-3">Loan Status</span>
        <div className="flex flex-wrap gap-2">
          {['active', 'funded', 'repaid'].map((status) => (
            <button
              key={status}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  status: filters.status === status ? undefined : status,
                })
              }
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
                filters.status === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
