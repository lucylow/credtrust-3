import { motion } from "framer-motion";
import { Shield, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/atoms/Badge";
import { PriceTag } from "@/components/atoms/PriceTag";
import { ProgressDual } from "@/components/atoms/ProgressDual";
import { cn } from "@/lib/utils";

interface TrancheData {
  totalSupply: number;
  utilization: number;
  userPosition: number;
  yield24h: number;
  remainingDays: number;
  penalty: number;
  price?: number;
  change24h?: string;
  volume24h?: number;
}

interface TrancheCardProps {
  tranche: "senior" | "junior" | "equity";
  data: TrancheData;
  isLive?: boolean;
  onMint?: () => void;
  onRedeem?: () => void;
  className?: string;
}

const TRANCHE_CONFIG = {
  senior: {
    priority: 1,
    apyRange: "4-6%",
    risk: "Low Risk",
    color: "blue",
    gradient: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30 hover:border-blue-500/50",
    icon: Shield,
  },
  junior: {
    priority: 2,
    apyRange: "8-12%",
    risk: "Medium Risk",
    color: "amber",
    gradient: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30 hover:border-amber-500/50",
    icon: TrendingUp,
  },
  equity: {
    priority: 3,
    apyRange: "15-25%",
    risk: "High Risk",
    color: "red",
    gradient: "from-red-500/20 to-red-600/10",
    border: "border-red-500/30 hover:border-red-500/50",
    icon: DollarSign,
  },
};

export function TrancheCard({
  tranche,
  data,
  isLive = false,
  onMint,
  onRedeem,
  className,
}: TrancheCardProps) {
  const config = TRANCHE_CONFIG[tranche];
  const Icon = config.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br",
        config.gradient,
        "backdrop-blur-xl border",
        config.border,
        "p-6 transition-all duration-300",
        className
      )}
      role="region"
      aria-label={`${tranche} tranche position`}
    >
      {/* Live indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Badge variant={isLive ? "live" : "outline"} size="sm">
          <span className="relative flex h-2 w-2 mr-1">
            {isLive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              isLive ? "bg-emerald-500" : "bg-muted"
            )} />
          </span>
          {isLive ? "LIVE" : "OFFLINE"}
        </Badge>
      </div>

      {/* Header */}
      <header className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl",
            `bg-${config.color}-500/20`
          )}>
            <Icon className={cn("h-5 w-5", `text-${config.color}-400`)} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold capitalize text-foreground">
              {tranche} Tranche
            </h3>
            <p className="text-sm text-muted-foreground">{config.risk}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-bold text-foreground">
            {config.apyRange}
          </p>
          <p className="text-xs text-muted-foreground">Target APY</p>
        </div>
      </header>

      {/* Price */}
      {data.price !== undefined && (
        <div className="mb-6 p-4 rounded-xl bg-card/50 border border-border/30">
          <PriceTag
            price={data.price}
            change24h={data.change24h || "+0.0%"}
            volume24h={data.volume24h}
            size="md"
          />
        </div>
      )}

      {/* Metrics */}
      <div className="space-y-4 mb-6">
        <ProgressDual
          label="Utilization"
          value={data.utilization * 100}
          color={data.utilization > 0.9 ? "warning" : "success"}
        />
        <ProgressDual
          label="Your Position"
          value={(data.userPosition / data.totalSupply) * 100}
          color="primary"
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 rounded-xl bg-card/30">
          <p className="text-lg font-bold text-foreground tabular-nums">
            ${(data.totalSupply / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-muted-foreground">TVL</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-card/30">
          <p className="text-lg font-bold text-emerald-400 tabular-nums">
            +{data.yield24h.toFixed(2)}%
          </p>
          <p className="text-xs text-muted-foreground">24h Yield</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-card/30">
          <p className="text-lg font-bold text-foreground tabular-nums">
            {data.remainingDays}d
          </p>
          <p className="text-xs text-muted-foreground">Maturity</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onMint}
          className="flex-1"
          variant="hero"
          aria-label={`Mint ${tranche} tranche position`}
        >
          <Wallet className="h-4 w-4 mr-2" aria-hidden="true" />
          Mint Position
        </Button>
        {data.userPosition > 0 && (
          <Button
            onClick={onRedeem}
            variant="outline"
            className="flex-shrink-0"
            aria-label={`Redeem ${tranche} tranche position with ${data.penalty}% early penalty`}
          >
            Redeem ({data.penalty}%)
          </Button>
        )}
      </div>

      {/* Hover glow effect */}
      <div className={cn(
        "absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10",
        `bg-gradient-to-br from-${config.color}-500/20 via-transparent to-${config.color}-500/10`,
        "blur-xl"
      )} />
    </motion.article>
  );
}
