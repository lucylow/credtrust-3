import { motion } from 'framer-motion';
import { ShieldCheck, LockKeyhole, Zap, FileText, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrivacy } from '@/hooks/usePrivacy';
import { toast } from 'sonner';

export default function PrivacyOverview() {
  const { totalJobs, dataProtected, activeTokens, submitPrivacyJob, isLoading } = usePrivacy();

  const handleNewJob = async () => {
    // Generate a mock encrypted data hash (in production, this comes from client-side encryption)
    const mockEncryptedHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    submitPrivacyJob.mutate(mockEncryptedHash);
  };

  const handleExportAudit = () => {
    toast.info('Preparing audit log...', { description: 'Your privacy audit will be exported shortly.' });
  };

  const stats = [
    {
      label: 'Privacy Jobs',
      value: isLoading ? '...' : totalJobs,
      icon: ShieldCheck,
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      label: 'Data Protected',
      value: isLoading ? '...' : `${dataProtected.toFixed(1)}MB`,
      icon: LockKeyhole,
      gradient: 'from-purple-500 to-violet-600',
    },
    {
      label: 'Active Tokens',
      value: isLoading ? '...' : activeTokens,
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
        <Button 
          className="flex-1 gap-2" 
          onClick={handleNewJob}
          disabled={submitPrivacyJob.isPending}
        >
          {submitPrivacyJob.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {submitPrivacyJob.isPending ? 'Processing...' : 'New Privacy Job'}
        </Button>
        <Button variant="outline" className="flex-1 gap-2" onClick={handleExportAudit}>
          <FileText className="h-4 w-4" />
          Export Audit Log
        </Button>
      </div>
    </motion.div>
  );
}
