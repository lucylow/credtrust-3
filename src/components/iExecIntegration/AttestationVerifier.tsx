import { motion } from 'framer-motion';
import { CheckCircle, Shield, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TEEAttestation } from '@/types/analytics.types';
import { toast } from 'sonner';

interface AttestationVerifierProps {
  attestation: TEEAttestation;
}

export default function AttestationVerifier({ attestation }: AttestationVerifierProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const attestationFields = [
    { label: 'Enclave Hash', value: attestation.enclaveHash },
    { label: 'MRENCLAVE', value: attestation.mrEnclave },
    { label: 'MRSIGNER', value: attestation.mrSigner },
    { label: 'ISV Prod ID', value: attestation.isvProdId.toString() },
    { label: 'ISV SVN', value: attestation.isvSvn.toString() },
    { label: 'Signature', value: attestation.signature },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${attestation.isValid ? 'bg-success/20' : 'bg-destructive/20'}`}>
          {attestation.isValid ? (
            <CheckCircle className="h-6 w-6 text-success" />
          ) : (
            <Shield className="h-6 w-6 text-destructive" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">TEE Attestation</h3>
          <p className={`text-sm ${attestation.isValid ? 'text-success' : 'text-destructive'}`}>
            {attestation.isValid ? 'Verified & Valid' : 'Verification Failed'}
          </p>
        </div>
      </div>

      {/* Attestation Details */}
      <div className="space-y-3">
        {attestationFields.map((field) => (
          <div
            key={field.label}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">{field.label}</p>
              <p className="text-sm font-mono text-foreground truncate">
                {formatHash(field.value)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(field.value, field.label)}
              className="flex-shrink-0 ml-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Timestamp */}
      <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Attestation Timestamp</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(attestation.timestamp).toLocaleString()}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </Button>
        </div>
      </div>

      {/* Security Info */}
      <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">What does this mean?</p>
            <p>
              This attestation proves that your credit score was computed inside a secure
              Intel SGX enclave. The computation is verifiable and tamper-proof, ensuring
              your financial data remained confidential throughout the process.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
