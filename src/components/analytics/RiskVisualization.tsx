import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { RiskDistribution } from '@/types/analytics.types';

interface RiskVisualizationProps {
  distribution: RiskDistribution[];
}

export default function RiskVisualization({ distribution }: RiskVisualizationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">Market Risk Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Confidential risk assessment of active loans
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="percentage"
              nameKey="tier"
            >
              {distribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as RiskDistribution;
                  return (
                    <div className="glass-card p-3 shadow-lg border border-border">
                      <p className="font-medium text-foreground">Tier {data.tier}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.count.toLocaleString()} loans ({data.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {payload?.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        Tier {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {distribution.map((tier) => (
          <div
            key={tier.tier}
            className="p-3 rounded-xl bg-muted/30 border border-border/50"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tier.color }}
                />
                <span className="text-sm font-medium text-foreground">
                  Tier {tier.tier}
                </span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {tier.percentage}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {tier.count.toLocaleString()} loans
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
