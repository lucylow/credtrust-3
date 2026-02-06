import { motion } from 'framer-motion';
import { Copy, Download, ExternalLink, Shield, FileCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrivacy } from '@/hooks/usePrivacy';
import { getIExecExplorerUrl } from '@/lib/iexec-client';
import { toast } from 'sonner';

export default function AttestationViewer() {
  const { latestAttestation, isLoading, submitPrivacyJob } = usePrivacy();

  const handleCopy = () => {
    if (latestAttestation) {
      navigator.clipboard.writeText(JSON.stringify(latestAttestation, null, 2));
      toast.success('Copied to clipboard');
    }
  };

  const handleExport = () => {
    if (latestAttestation) {
      const blob = new Blob([JSON.stringify(latestAttestation, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attestation-${latestAttestation.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Attestation exported');
    }
  };

  const handleStartJob = () => {
    const mockEncryptedHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    submitPrivacyJob.mutate(mockEncryptedHash);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </motion.div>
    );
  }

  if (!latestAttestation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="text-center py-8">
          <FileCheck className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="font-medium text-foreground mb-1">No Attestations</p>
          <p className="text-sm text-muted-foreground mb-4">
            Run a privacy job to generate your first TEE attestation.
          </p>
          <Button onClick={handleStartJob} disabled={submitPrivacyJob.isPending}>
            {submitPrivacyJob.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Start Privacy Job
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-success/10">
            <Shield className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Latest Attestation</h3>
        </div>
        <Badge className={latestAttestation.is_valid ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive'}>
          {latestAttestation.is_valid ? 'Verified' : 'Invalid'}
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground mb-1">MRENCLAVE</p>
          <p className="font-mono text-sm text-foreground break-all">
            {latestAttestation.mrenclave.slice(0, 32)}...
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Risk Tier</p>
            <Badge
              className={`${
                latestAttestation.risk_tier === 'A'
                  ? 'bg-success/10 text-success'
                  : latestAttestation.risk_tier === 'B'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-amber-500/10 text-amber-500'
              }`}
            >
              Tier {latestAttestation.risk_tier}
            </Badge>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Chain ID</p>
            <p className="font-medium text-foreground">{latestAttestation.chain_id} (Arbitrum Sepolia)</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Created</p>
          <p className="font-medium text-foreground">
            {new Date(latestAttestation.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleCopy}>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
          <a
            href={latestAttestation.privacy_job_id ? getIExecExplorerUrl('task', latestAttestation.privacy_job_id) : getIExecExplorerUrl('address', latestAttestation.mrenclave)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Explorer
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
