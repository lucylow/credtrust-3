import { motion } from 'framer-motion';
import { ShieldCheck, LockKeyhole, Zap, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrivacyStore } from '@/store/privacyStore';

export default function PrivacyOverview() {
  const { totalJobs, dataProtected, disclosureTokens } = usePrivacyStore();

  const activeTokens = disclosureTokens.filter(
    (t) => !t.used && Date.now() < t.expiresAt
  ).length;

  const stats = [
    {
      label: 'Privacy Jobs',
      value: totalJobs,
      icon: ShieldCheck,
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      label: 'Data Protected',
      value: `${dataProtected}MB`,
      icon: LockKeyhole,
      gradient: 'from-purple-500 to-violet-600',
    },
    {
      label: 'Active Tokens',
      value: activeTokens,
      icon: Zap,
      gradient: 'from-primary to-blue-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Privacy Overview</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="text-center p-4 rounded-xl bg-muted/30 border border-border"
          >
            <div
              className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-gradient-to-br ${stat.gradient}`}
            >
              <stat.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 gap-2">
          <Plus className="h-4 w-4" />
          New Privacy Job
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <FileText className="h-4 w-4" />
          Export Audit Log
        </Button>
      </div>
    </motion.div>
  );
}
