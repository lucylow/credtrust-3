import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  TrendingUp, PieChart, BarChart3, Activity, 
  Clock, Shield, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const timeRanges = ["7d", "30d", "90d"] as const;

const analyticsData = {
  "7d": {
    score: 782,
    tier: "A",
    change: +12,
    riskDistribution: { A: 45, B: 35, C: 20 },
    loanPerformance: { approved: 87, defaulted: 3 },
    totalVolume: "$2.4M",
    avgApr: "5.8%",
  },
  "30d": {
    score: 768,
    tier: "A",
    change: +28,
    riskDistribution: { A: 42, B: 38, C: 20 },
    loanPerformance: { approved: 92, defaulted: 4 },
    totalVolume: "$8.7M",
    avgApr: "6.2%",
  },
  "90d": {
    score: 745,
    tier: "B+",
    change: +65,
    riskDistribution: { A: 38, B: 42, C: 20 },
    loanPerformance: { approved: 89, defaulted: 5 },
    totalVolume: "$24.1M",
    avgApr: "6.8%",
  },
};

const AnalyticsPreview = () => {
  const [timeRange, setTimeRange] = useState<keyof typeof analyticsData>("7d");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const data = analyticsData[timeRange];

  return (
    <section id="analytics" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-4">
            <BarChart3 className="h-4 w-4" />
            Analytics Preview
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Confidential Credit Analytics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time insights into credit performance, risk distribution, and
            marketplace activity—all computed privately in iExec TEEs.
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-lg">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  timeRange === range
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted-foreground/10"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {/* Current Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  data.change > 0 ? "text-success" : "text-destructive"
                )}
              >
                {data.change > 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {data.change > 0 ? "+" : ""}
                {data.change}
              </span>
            </div>
            <motion.p
              key={`score-${timeRange}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-bold mb-1"
            >
              {data.score}
            </motion.p>
            <p className="text-sm text-muted-foreground">
              Credit Score (Tier {data.tier})
            </p>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-secondary/10">
                <PieChart className="h-5 w-5 text-secondary" />
              </div>
              <span className="font-medium">Risk Distribution</span>
            </div>
            <div className="space-y-3">
              {(["A", "B", "C"] as const).map((tier) => (
                <div key={tier} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-medium">Tier {tier}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      key={`${tier}-${timeRange}`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${data.riskDistribution[tier]}%`,
                      }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className={cn(
                        "h-full rounded-full",
                        tier === "A" && "bg-emerald-500",
                        tier === "B" && "bg-yellow-500",
                        tier === "C" && "bg-orange-500"
                      )}
                    />
                  </div>
                  <span className="w-10 text-sm text-muted-foreground text-right">
                    {data.riskDistribution[tier]}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Loan Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-success/10">
                <Activity className="h-5 w-5 text-success" />
              </div>
              <span className="font-medium">Loan Performance</span>
            </div>
            <div className="relative h-24 flex items-end justify-center gap-3">
              <motion.div
                key={`approved-${timeRange}`}
                initial={{ height: 0 }}
                animate={{ height: `${data.loanPerformance.approved}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-12 bg-success rounded-t-lg relative"
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium">
                  {data.loanPerformance.approved}%
                </span>
              </motion.div>
              <motion.div
                key={`defaulted-${timeRange}`}
                initial={{ height: 0 }}
                animate={{ height: `${data.loanPerformance.defaulted * 10}%` }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-12 bg-destructive/70 rounded-t-lg relative"
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium">
                  {data.loanPerformance.defaulted}%
                </span>
              </motion.div>
            </div>
            <div className="flex justify-center gap-6 mt-2 text-xs text-muted-foreground">
              <span>Approved</span>
              <span>Defaulted</span>
            </div>
          </motion.div>

          {/* Volume Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Shield className="h-5 w-5 text-purple-500" />
              </div>
              <span className="font-medium">Market Stats</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Volume</p>
                <motion.p
                  key={`volume-${timeRange}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold"
                >
                  {data.totalVolume}
                </motion.p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg APR</p>
                <motion.p
                  key={`apr-${timeRange}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold text-secondary"
                >
                  {data.avgApr}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            All analytics computed in iExec TEEs—individual data never exposed
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyticsPreview;
