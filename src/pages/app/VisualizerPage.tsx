import { motion } from 'framer-motion';
import TEEVisualizer from '@/components/app/TEEVisualizer';
import { Shield, Lock, Cpu, CheckCircle, ArrowRight } from 'lucide-react';

const processSteps = [
  {
    icon: Lock,
    title: 'Data Encryption',
    description: 'Your financial data is encrypted locally using AES-256-GCM before leaving your device.',
    status: 'completed' as const,
  },
  {
    icon: Cpu,
    title: 'TEE Processing',
    description: 'Encrypted data enters the Intel SGX enclave where the lender\'s risk model processes it confidentially.',
    status: 'active' as const,
  },
  {
    icon: Shield,
    title: 'Attestation',
    description: 'The TEE generates a cryptographic attestation proving the computation was performed correctly.',
    status: 'pending' as const,
  },
  {
    icon: CheckCircle,
    title: 'NFT Minting',
    description: 'Your credit proof is minted as a non-transferable soulbound NFT on Arbitrum.',
    status: 'pending' as const,
  },
];

export default function VisualizerPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">TEE Visualizer</h1>
        <p className="text-muted-foreground">
          Watch the confidential compute workflow in real-time
        </p>
      </div>

      {/* Process Steps */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Computation Pipeline</h2>
        <div className="space-y-4">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-start gap-4"
              >
                <div className="relative">
                  <div
                    className={`p-3 rounded-xl ${
                      step.status === 'completed'
                        ? 'bg-success/20 text-success'
                        : step.status === 'active'
                        ? 'bg-primary/20 text-primary animate-pulse'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="absolute left-1/2 top-full h-8 w-0.5 -translate-x-1/2 bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    {step.status === 'active' && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Processing
                      </span>
                    )}
                    {step.status === 'completed' && (
                      <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                        Complete
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Visualizer */}
      <TEEVisualizer />
    </motion.div>
  );
}
