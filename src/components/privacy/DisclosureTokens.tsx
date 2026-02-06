import { motion } from 'framer-motion';
import { KeySquare, Clock, Eye, X, Plus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrivacyStore } from '@/store/privacyStore';
import { toast } from 'sonner';

const disclosureLevels = [
  { level: 0, label: 'Basic (Tier)', variant: 'secondary' as const },
  { level: 1, label: 'Income Proof', variant: 'default' as const },
  { level: 2, label: 'Full Disclosure', variant: 'outline' as const },
];

export default function DisclosureTokens() {
  const { disclosureTokens, revokeToken } = usePrivacyStore();

  const handleRevoke = (tokenId: number) => {
    revokeToken(tokenId);
    toast.success('Token revoked', { description: `Token #${tokenId} has been revoked.` });
  };

  const handleIssueNew = () => {
    toast.info('Issue Token', { description: 'Token issuance modal would open here.' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10">
            <KeySquare className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Disclosure Tokens</h3>
        </div>
        <Button size="sm" className="gap-2" onClick={handleIssueNew}>
          <Plus className="h-4 w-4" />
          Issue New Token
        </Button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {disclosureTokens.map((token) => {
          const levelConfig = disclosureLevels[token.disclosureLevel];
          const isExpired = Date.now() > token.expiresAt;

          return (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-xl border transition-all ${
                isExpired
                  ? 'bg-muted/20 border-border/50 opacity-60'
                  : 'bg-muted/30 border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isExpired ? 'bg-muted' : 'bg-primary/10'
                    }`}
                  >
                    <KeySquare
                      className={`h-4 w-4 ${
                        isExpired ? 'text-muted-foreground' : 'text-primary'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Token #{token.tokenId}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {token.verifier.slice(0, 6)}...{token.verifier.slice(-4)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge variant={levelConfig.variant}>{levelConfig.label}</Badge>
                  <Badge variant={isExpired ? 'destructive' : 'default'}>
                    {isExpired ? 'Expired' : 'Active'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Expires</span>
                  <span className="text-foreground font-medium">
                    {new Date(token.expiresAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span>Status: </span>
                  <span className="text-foreground font-medium">
                    {token.used ? 'Used' : 'Available'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {!token.used && !isExpired && (
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    View Disclosure
                  </Button>
                )}
                <Button
                  variant={isExpired ? 'ghost' : 'destructive'}
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => handleRevoke(token.tokenId)}
                  disabled={token.used}
                >
                  <X className="h-3.5 w-3.5" />
                  {isExpired ? 'Revoked' : 'Revoke'}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {disclosureTokens.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <Shield className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="font-medium text-foreground mb-1">No Disclosure Tokens</p>
          <p className="text-sm text-muted-foreground mb-4">
            Issue disclosure tokens to grant time-limited access to your privacy-protected
            data.
          </p>
          <Button onClick={handleIssueNew}>Issue First Token</Button>
        </motion.div>
      )}
    </motion.div>
  );
}
