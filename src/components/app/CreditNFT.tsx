import { motion } from 'framer-motion';
import { Award, Shield, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';

interface CreditNFTProps {
  score?: number;
  attestation?: string;
  tokenId?: string;
}

export default function CreditNFT({ score = 750, attestation, tokenId }: CreditNFTProps) {
  const { wallet } = useWallet();

  const getCreditScoreGradient = (creditScore: number) => {
    if (creditScore >= 750) return 'from-emerald-400 via-green-500 to-teal-500';
    if (creditScore >= 670) return 'from-primary via-blue-500 to-cyan-500';
    if (creditScore >= 580) return 'from-yellow-400 via-orange-500 to-amber-500';
    return 'from-red-400 via-rose-500 to-pink-500';
  };

  const getCreditScoreLabel = (creditScore: number) => {
    if (creditScore >= 750) return 'Excellent';
    if (creditScore >= 670) return 'Good';
    if (creditScore >= 580) return 'Fair';
    return 'Poor';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl gradient-primary">
            <Award className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Credit Proof NFT</h2>
            <p className="text-sm text-muted-foreground">Non-transferable Soulbound Token</p>
          </div>
        </div>
        {tokenId && (
          <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium border border-success/30">
            Minted
          </span>
        )}
      </div>

      {/* NFT Card Preview */}
      <motion.div
        whileHover={{ scale: 1.02, rotateY: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative overflow-hidden rounded-2xl p-6 mb-6"
        style={{
          background: `linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)`,
        }}
      >
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 opacity-30 bg-gradient-to-br ${getCreditScoreGradient(score)}`}
        />
        
        {/* Sparkle Effects */}
        <div className="absolute top-4 right-4">
          <Sparkles className="h-6 w-6 text-primary/50 animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">CredTrust</span>
          </div>

          {/* Score Display */}
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-2">Verified Credit Score</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`text-7xl font-bold bg-gradient-to-r ${getCreditScoreGradient(score)} bg-clip-text text-transparent`}
            >
              {score}
            </motion.p>
            <p className={`text-xl font-semibold mt-2 bg-gradient-to-r ${getCreditScoreGradient(score)} bg-clip-text text-transparent`}>
              {getCreditScoreLabel(score)}
            </p>
          </div>

          {/* Owner Info */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="font-mono text-sm text-foreground">
                {wallet.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}` : '0x...'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Token ID</p>
              <p className="font-mono text-sm text-foreground">
                {tokenId || '#---'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* NFT Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">TEE Verified</span>
          </div>
          <span className="text-sm font-medium text-success">✓ Attested</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Valid Until</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </span>
        </div>

        {attestation && (
          <div className="p-3 rounded-xl bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Attestation Hash</p>
            <p className="font-mono text-xs text-foreground break-all">{attestation}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" className="flex-1 gap-2">
          <ExternalLink className="h-4 w-4" />
          View on Explorer
        </Button>
        <Button variant="hero" className="flex-1 gap-2">
          <Award className="h-4 w-4" />
          Share Proof
        </Button>
      </div>
    </motion.div>
  );
}
