import { motion } from 'framer-motion';
import { Shield, Lock, Key, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  PrivacyOverview,
  DataControls,
  DisclosureTokens,
  AttestationViewer,
  PrivacyMetrics,
} from '@/components/privacy';
import { usePrivacy } from '@/hooks/usePrivacy';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-foreground">
              Privacy Dashboard
            </h1>
            <p className="text-muted-foreground">
              Your TEE + ZK Privacy Data Controls
            </p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              You need to be logged in to access the Privacy Dashboard and manage your TEE privacy jobs and disclosure tokens.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/auth?mode=signup">Create Account</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 lg:space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-foreground">
              Privacy Dashboard
            </h1>
            <p className="text-muted-foreground">
              Your TEE + ZK Privacy Data Controls
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="gap-2">
            <Lock className="h-4 w-4" />
            Protect New Data
          </Button>
          <Button variant="outline" className="gap-2">
            <Key className="h-4 w-4" />
            Manage Tokens
          </Button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Overview + Controls */}
        <div className="space-y-6">
          <PrivacyOverview />
          <DataControls />
        </div>

        {/* Right Column - Tokens + Attestations + Metrics */}
        <div className="space-y-6">
          <DisclosureTokens />
          <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-1 xl:grid-cols-2">
            <AttestationViewer />
            <PrivacyMetrics />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
