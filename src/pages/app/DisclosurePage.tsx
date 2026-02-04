import { motion } from 'framer-motion';
import { useState } from 'react';
import { Key, Clock, Shield, Copy, ExternalLink, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';

interface DisclosureToken {
  id: string;
  verifier: string;
  scope: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  token: string;
}

const mockTokens: DisclosureToken[] = [
  {
    id: '1',
    verifier: 'DeFi Prime Lender',
    scope: 'Credit Score Tier',
    expiresAt: '2026-02-10',
    status: 'active',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
  {
    id: '2',
    verifier: 'Compound Labs',
    scope: 'Full Credit Report',
    expiresAt: '2026-02-05',
    status: 'active',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
  {
    id: '3',
    verifier: 'MakerDAO',
    scope: 'Credit Score Tier',
    expiresAt: '2026-01-28',
    status: 'expired',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
];

export default function DisclosurePage() {
  const [tokens, setTokens] = useState(mockTokens);
  const [showNewForm, setShowNewForm] = useState(false);
  const [revealedTokens, setRevealedTokens] = useState<Set<string>>(new Set());

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success('Token copied to clipboard');
  };

  const handleRevokeToken = (id: string) => {
    setTokens(tokens.map(t => 
      t.id === id ? { ...t, status: 'revoked' as const } : t
    ));
    toast.success('Token revoked successfully');
  };

  const toggleRevealToken = (id: string) => {
    const newRevealed = new Set(revealedTokens);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedTokens(newRevealed);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Selective Disclosure</h1>
          <p className="text-muted-foreground">
            Issue ephemeral tokens to share verified credit data with specific verifiers
          </p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Token
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Tokens', value: tokens.filter(t => t.status === 'active').length, icon: Key },
          { label: 'Total Issued', value: tokens.length, icon: Shield },
          { label: 'Avg Duration', value: '7 days', icon: Clock },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="p-2 rounded-lg bg-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Token Form */}
      {showNewForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Create New Disclosure Token</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Input placeholder="Verifier name" />
            <Input placeholder="Scope (e.g., Credit Score Tier)" />
            <Input type="date" placeholder="Expiration date" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
            <Button>Create Token</Button>
          </div>
        </motion.div>
      )}

      {/* Token List */}
      <StaggerContainer staggerDelay={0.1} className="space-y-4">
        {tokens.map((token) => (
          <StaggerItem key={token.id}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`glass-card p-6 ${
                token.status !== 'active' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    token.status === 'active' 
                      ? 'bg-success/20' 
                      : 'bg-muted'
                  }`}>
                    <Key className={`h-5 w-5 ${
                      token.status === 'active' ? 'text-success' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{token.verifier}</h3>
                    <p className="text-sm text-muted-foreground">{token.scope}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  token.status === 'active'
                    ? 'bg-success/20 text-success'
                    : token.status === 'expired'
                    ? 'bg-yellow-500/20 text-yellow-600'
                    : 'bg-destructive/20 text-destructive'
                }`}>
                  {token.status}
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg mb-4">
                <code className="flex-1 text-xs text-muted-foreground font-mono truncate">
                  {revealedTokens.has(token.id) ? token.token : '••••••••••••••••••••••••'}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleRevealToken(token.id)}
                >
                  {revealedTokens.has(token.id) ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyToken(token.token)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Expires: <span className="text-foreground">{token.expiresAt}</span>
                </p>
                {token.status === 'active' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRevokeToken(token.id)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Revoke
                  </Button>
                )}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </motion.div>
  );
}
