import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeySquare, Clock, Eye, X, Plus, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePrivacy, DisclosureToken } from '@/hooks/usePrivacy';

const disclosureLevels = [
  { level: 0, label: 'Basic (Tier)', variant: 'secondary' as const },
  { level: 1, label: 'Income Proof', variant: 'default' as const },
  { level: 2, label: 'Full Disclosure', variant: 'outline' as const },
];

export default function DisclosureTokens() {
  const { disclosureTokens, issueToken, revokeToken, isLoading } = usePrivacy();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [verifierAddress, setVerifierAddress] = useState('');
  const [disclosureLevel, setDisclosureLevel] = useState<string>('0');
  const [expiresInDays, setExpiresInDays] = useState('7');

  const handleIssueToken = () => {
    if (!verifierAddress) return;
    
    issueToken.mutate(
      {
        verifierAddress,
        disclosureLevel: parseInt(disclosureLevel) as 0 | 1 | 2,
        expiresInDays: parseInt(expiresInDays),
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setVerifierAddress('');
          setDisclosureLevel('0');
          setExpiresInDays('7');
        },
      }
    );
  };

  const handleRevoke = (tokenId: string) => {
    revokeToken.mutate(tokenId);
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Issue New Token
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Disclosure Token</DialogTitle>
              <DialogDescription>
                Create a time-limited token to grant a verifier access to your privacy-protected data.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="verifier">Verifier Address</Label>
                <Input
                  id="verifier"
                  placeholder="0x..."
                  value={verifierAddress}
                  onChange={(e) => setVerifierAddress(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Disclosure Level</Label>
                <Select value={disclosureLevel} onValueChange={setDisclosureLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Basic (Risk Tier only)</SelectItem>
                    <SelectItem value="1">Income Proof</SelectItem>
                    <SelectItem value="2">Full Disclosure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Expires In</Label>
                <Select value={expiresInDays} onValueChange={setExpiresInDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleIssueToken}
                disabled={!verifierAddress || issueToken.isPending}
              >
                {issueToken.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Issue Token
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {disclosureTokens.map((token) => {
            const levelConfig = disclosureLevels[token.disclosure_level];
            const isExpired = new Date() > new Date(token.expires_at);
            const isRevoked = token.revoked;

            return (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border transition-all ${
                  isExpired || isRevoked
                    ? 'bg-muted/20 border-border/50 opacity-60'
                    : 'bg-muted/30 border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isExpired || isRevoked ? 'bg-muted' : 'bg-primary/10'
                      }`}
                    >
                      <KeySquare
                        className={`h-4 w-4 ${
                          isExpired || isRevoked ? 'text-muted-foreground' : 'text-primary'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Token #{token.token_id}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {token.verifier_address.slice(0, 6)}...{token.verifier_address.slice(-4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant={levelConfig.variant}>{levelConfig.label}</Badge>
                    <Badge variant={isRevoked ? 'destructive' : isExpired ? 'secondary' : 'default'}>
                      {isRevoked ? 'Revoked' : isExpired ? 'Expired' : 'Active'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Expires</span>
                    <span className="text-foreground font-medium">
                      {new Date(token.expires_at).toLocaleDateString()}
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
                  {!token.used && !isExpired && !isRevoked && (
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      View Disclosure
                    </Button>
                  )}
                  <Button
                    variant={isRevoked ? 'ghost' : 'destructive'}
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => handleRevoke(token.id)}
                    disabled={isRevoked || revokeToken.isPending}
                  >
                    <X className="h-3.5 w-3.5" />
                    {isRevoked ? 'Revoked' : 'Revoke'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoading && disclosureTokens.length === 0 && (
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
          <Button onClick={() => setIsDialogOpen(true)}>Issue First Token</Button>
        </motion.div>
      )}
    </motion.div>
  );
}
