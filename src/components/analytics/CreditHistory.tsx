import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ScoreHistoryPoint } from '@/types/analytics.types';

interface CreditHistoryProps {
  history: ScoreHistoryPoint[];
  currentScore: number;
}

export default function CreditHistory({ history, currentScore }: CreditHistoryProps) {
  const actualData = history.filter((p) => !p.projected);
  const projectedData = history.filter((p) => p.projected);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Credit Score History</h3>
          <p className="text-sm text-muted-foreground">Score trend over time with projections</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary" />
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary/40 border-dashed" style={{ borderTopWidth: 2 }} />
            <span className="text-muted-foreground">Projected</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={history}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={['dataMin - 20', 'dataMax + 20']}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ScoreHistoryPoint;
                  return (
                    <div className="glass-card p-3 shadow-lg border border-border">
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-lg font-bold text-primary">
                        {data.score}
                        {data.projected && (
                          <span className="text-xs text-muted-foreground ml-2">(projected)</span>
                        )}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={currentScore}
              stroke="hsl(var(--success))"
              strokeDasharray="5 5"
              strokeWidth={1}
            />
            {/* Actual line */}
            <Line
              data={actualData}
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
            {/* Projected line */}
            <Line
              data={[actualData[actualData.length - 1], ...projectedData]}
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              strokeDasharray="5 5"
              strokeOpacity={0.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
