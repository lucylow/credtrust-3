import { motion } from 'framer-motion';
import { Shield, Lock, Key, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PrivacyOverview,
  DataControls,
  DisclosureTokens,
  AttestationViewer,
  PrivacyMetrics,
} from '@/components/privacy';

export default function PrivacyPage() {
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
