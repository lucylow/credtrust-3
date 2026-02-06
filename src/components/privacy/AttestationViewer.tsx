import { motion } from 'framer-motion';
import { Copy, Download, ExternalLink, Shield, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrivacyStore } from '@/store/privacyStore';
import { toast } from 'sonner';

export default function AttestationViewer() {
  const { latestAttestation } = usePrivacyStore();

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
      a.download = `attestation-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Attestation exported');
    }
  };

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
          <Button>Start Privacy Job</Button>
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
        <Badge className="bg-success/10 text-success border-success/20">Verified</Badge>
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
                latestAttestation.riskTier === 'A'
                  ? 'bg-success/10 text-success'
                  : latestAttestation.riskTier === 'B'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-amber-500/10 text-amber-500'
              }`}
            >
              Tier {latestAttestation.riskTier}
            </Badge>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Chain ID</p>
            <p className="font-medium text-foreground">421614 (Arbitrum Sepolia)</p>
          </div>
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
        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
          <ExternalLink className="h-3.5 w-3.5" />
          Explorer
        </Button>
      </div>
    </motion.div>
  );
}
