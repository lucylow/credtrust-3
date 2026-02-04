import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Cpu, Key, Shield, CheckCircle } from 'lucide-react';
import { TEE_WORKFLOW_STEPS } from '@/utils/constants';

const iconMap = {
  Lock,
  Cpu,
  Key,
  Shield,
  CheckCircle,
};

const colorMap: Record<number, string> = {
  1: 'from-primary to-blue-600',
  2: 'from-secondary to-pink-600',
  3: 'from-emerald-500 to-green-600',
  4: 'from-orange-500 to-red-600',
  5: 'from-indigo-500 to-blue-600',
};

export default function TEEVisualizer() {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev >= TEE_WORKFLOW_STEPS.length ? 1 : prev + 1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Confidential Computing Workflow
        </h2>
        <p className="text-muted-foreground">
          How iExec TEEs protect your data and proprietary models
        </p>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-border hidden lg:block" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {TEE_WORKFLOW_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap];
            const isActive = activeStep >= step.id;
            const isCurrent = activeStep === step.id;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-card border-primary/30'
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  {/* Icon */}
                  <motion.div
                    animate={{
                      scale: isCurrent ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: isCurrent ? Infinity : 0,
                    }}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${colorMap[step.id]} ${
                      isActive ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </motion.div>

                  {/* Title */}
                  <h3
                    className={`font-semibold mb-1 transition-colors ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>

                  {/* Step Number */}
                  <span
                    className={`mt-3 text-xs font-medium px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    Step {step.id}
                  </span>

                  {/* Active Indicator */}
                  {isCurrent && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Security Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-xl bg-muted/30 border border-border"
      >
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              iExec TEE Security Guarantees
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Data encrypted in transit and at rest</li>
              <li>• Remote attestation verifies enclave integrity</li>
              <li>• Hardware-based memory isolation (Intel SGX)</li>
              <li>• Cryptographically signed outputs</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
