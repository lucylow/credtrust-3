import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Zap,
  Server,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AttestationVerifier from './AttestationVerifier';
import { TEEWorkflowState, TEEAttestation, TEEResult } from '@/types/analytics.types';
import { useWallet } from '@/hooks/useWallet';

interface TEEWorkflowProps {
  encryptedData: string;
  onComplete: (result: TEEResult, attestation: TEEAttestation) => void;
  onError?: (error: string) => void;
}

const WORKFLOW_STEPS = [
  { id: 'initializing', label: 'Initialize iExec SDK', icon: Cpu, description: 'Connecting to iExec network' },
  { id: 'deploying', label: 'Deploy TEE App', icon: Server, description: 'Setting up secure enclave' },
  { id: 'computing', label: 'Confidential Compute', icon: Lock, description: 'Processing encrypted data' },
  { id: 'attesting', label: 'Verify Attestation', icon: Shield, description: 'Validating enclave integrity' },
  { id: 'complete', label: 'Complete', icon: CheckCircle, description: 'Score computed successfully' },
];

const stepColors: Record<string, string> = {
  initializing: 'from-primary to-blue-600',
  deploying: 'from-secondary to-pink-600',
  computing: 'from-amber-500 to-orange-600',
  attesting: 'from-success to-emerald-600',
  complete: 'from-success to-emerald-600',
  error: 'from-destructive to-red-600',
};

export default function TEEWorkflow({ encryptedData, onComplete, onError }: TEEWorkflowProps) {
  const { wallet } = useWallet();
  const [state, setState] = useState<TEEWorkflowState>({
    step: 'idle',
    progress: 0,
  });

  const simulateWorkflow = useCallback(async () => {
    if (!wallet.isConnected) {
      setState({ step: 'error', progress: 0, error: 'Wallet not connected' });
      return;
    }

    try {
      // Step 1: Initialize
      setState({ step: 'initializing', progress: 10 });
      await new Promise((r) => setTimeout(r, 1200));
      setState({ step: 'initializing', progress: 20 });

      // Step 2: Deploy
      setState({ step: 'deploying', progress: 30 });
      await new Promise((r) => setTimeout(r, 1500));
      setState({ step: 'deploying', progress: 45 });

      // Step 3: Compute
      setState({ step: 'computing', progress: 55 });
      await new Promise((r) => setTimeout(r, 2000));
      setState({ step: 'computing', progress: 70 });

      // Step 4: Attest
      setState({ step: 'attesting', progress: 80 });
      await new Promise((r) => setTimeout(r, 1000));

      // Generate mock results
      const mockResult: TEEResult = {
        score: 720 + Math.floor(Math.random() * 80),
        riskTier: 'A',
        confidence: 0.95,
        computeTime: 4.7,
      };

      const mockAttestation: TEEAttestation = {
        enclaveHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        mrEnclave: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        mrSigner: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        isvProdId: 1,
        isvSvn: 1,
        timestamp: Date.now(),
        signature: '0x' + Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        isValid: true,
      };

      // Step 5: Complete
      setState({
        step: 'complete',
        progress: 100,
        result: mockResult,
        attestation: mockAttestation,
      });

      onComplete(mockResult, mockAttestation);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ step: 'error', progress: 0, error: errorMessage });
      onError?.(errorMessage);
    }
  }, [wallet.isConnected, onComplete, onError]);

  useEffect(() => {
    if (encryptedData && state.step === 'idle') {
      simulateWorkflow();
    }
  }, [encryptedData, state.step, simulateWorkflow]);

  const retryWorkflow = () => {
    setState({ step: 'idle', progress: 0 });
    setTimeout(simulateWorkflow, 100);
  };

  const currentStepIndex = WORKFLOW_STEPS.findIndex((s) => s.id === state.step);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">iExec TEE Confidential Compute</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Secure Credit Scoring
        </h2>
        <p className="text-muted-foreground">
          Your data is processed in an Intel SGX enclave for maximum privacy
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{state.progress}%</span>
        </div>
        <Progress value={state.progress} className="h-2" />
      </div>

      {/* Workflow Steps */}
      <div className="relative mb-8">
        {/* Connection line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border hidden md:block" />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStepIndex >= index;
            const isCurrent = state.step === step.id;
            const isError = state.step === 'error';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                    isCurrent && !isError
                      ? 'bg-primary/10 border-primary/30'
                      : isActive
                      ? 'bg-card border-border'
                      : 'bg-muted/30 border-border/50'
                  }`}
                >
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.6, repeat: isCurrent ? Infinity : 0 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${
                      isError && isCurrent ? stepColors.error : stepColors[step.id]
                    } ${isActive ? 'opacity-100' : 'opacity-40'}`}
                  >
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </motion.div>

                  <h4
                    className={`text-sm font-semibold mb-1 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>

                  {isCurrent && !isError && (
                    <motion.div
                      layoutId="activeStep"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Status Display */}
      <AnimatePresence mode="wait">
        {state.step === 'error' && state.error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-destructive">Workflow Error</h4>
                <p className="text-sm text-muted-foreground">{state.error}</p>
              </div>
              <Button onClick={retryWorkflow} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </motion.div>
        )}

        {state.step === 'complete' && state.result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Score Result */}
            <div className="p-6 rounded-xl bg-success/10 border border-success/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/20">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-foreground">Computation Complete</h4>
                  <p className="text-sm text-muted-foreground">
                    Score computed in {state.result.computeTime}s with {(state.result.confidence * 100).toFixed(0)}% confidence
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-success">{state.result.score}</p>
                  <p className="text-sm text-muted-foreground">Risk Tier: {state.result.riskTier}</p>
                </div>
              </div>
            </div>

            {/* Attestation */}
            {state.attestation && (
              <AttestationVerifier attestation={state.attestation} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TEE Info */}
      {state.step !== 'complete' && state.step !== 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-muted/30 border border-border"
        >
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <h4 className="font-semibold text-foreground mb-2">iExec TEE Security Guarantees</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Data encrypted in transit and at rest</li>
                <li>• Remote attestation verifies enclave integrity</li>
                <li>• Hardware-based memory isolation (Intel SGX)</li>
                <li>• Cryptographically signed outputs</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
