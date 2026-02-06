import { motion } from 'framer-motion';
import { BarChart3, Activity, ShieldAlert, TrendingUp } from 'lucide-react';

export default function PrivacyMetrics() {
  const complianceDays = [95, 100, 100, 98, 100, 92, 100];
  const alerts = [
    { message: 'Token auto-revoked', time: '2h ago' },
    { message: 'MRENCLAVE rotation', time: '3d ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Privacy Metrics</h3>
      </div>

      <div className="space-y-4">
        {/* Privacy Score */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Privacy Score</span>
            <div className="flex items-center gap-1 text-success">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">+2%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">96/100</p>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '96%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-success rounded-full"
            />
          </div>
        </div>

        {/* Compliance Timeline */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">7-Day Compliance</span>
          </div>
          <div className="flex justify-between gap-1">
            {complianceDays.map((score, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${score * 0.4}px` }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className={`flex-1 rounded-t-sm ${
                  score >= 95
                    ? 'bg-success'
                    : score >= 80
                    ? 'bg-amber-500'
                    : 'bg-destructive'
                }`}
                style={{ minHeight: 8 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <span key={i} className="text-xs text-muted-foreground flex-1 text-center">
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Security Alerts */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-muted-foreground">Security Alerts</span>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{alert.message}</span>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
