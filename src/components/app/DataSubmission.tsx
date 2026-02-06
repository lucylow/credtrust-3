import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Lock, Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTEE } from '@/hooks/useTEE';
import { toast } from 'sonner';
import { FinancialData } from '@/types';

const formSchema = z.object({
  income: z.number().min(1000, 'Income must be at least $1,000'),
  employmentMonths: z.number().min(3, 'Minimum 3 months employment'),
  existingDebt: z.number().min(0, 'Debt cannot be negative'),
  requestedAmount: z.number().min(100, 'Minimum loan: $100'),
  termMonths: z.number().min(1).max(60, 'Term must be 1-60 months'),
});

export default function DataSubmission() {
  const { isConnected } = useAccount();
  const { isProcessing, result, error, processData, reset } = useTEE();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<FinancialData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 75000,
      employmentMonths: 24,
      existingDebt: 15000,
      requestedAmount: 10000,
      termMonths: 12,
    },
  });

  const onSubmit = async (data: FinancialData) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setSubmitted(true);
    const teeResult = await processData(data);
    
    if (teeResult) {
      toast.success(`Credit score computed: ${teeResult.score}`);
    } else {
      toast.error('Processing failed. Please try again.');
    }
  };

  const handleReset = () => {
    reset();
    resetForm();
    setSubmitted(false);
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-success';
    if (score >= 670) return 'text-primary';
    if (score >= 580) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl gradient-primary">
          <Upload className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Submit Encrypted Financial Data
          </h2>
          <p className="text-sm text-muted-foreground">
            Your data is encrypted locally before submission
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="income">Annual Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  {...register('income', { valueAsNumber: true })}
                  className="bg-muted/50"
                />
                {errors.income && (
                  <p className="text-sm text-destructive">{errors.income.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentMonths">Employment Duration (months)</Label>
                <Input
                  id="employmentMonths"
                  type="number"
                  {...register('employmentMonths', { valueAsNumber: true })}
                  className="bg-muted/50"
                />
                {errors.employmentMonths && (
                  <p className="text-sm text-destructive">{errors.employmentMonths.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="existingDebt">Existing Debt ($)</Label>
                <Input
                  id="existingDebt"
                  type="number"
                  {...register('existingDebt', { valueAsNumber: true })}
                  className="bg-muted/50"
                />
                {errors.existingDebt && (
                  <p className="text-sm text-destructive">{errors.existingDebt.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestedAmount">Requested Loan Amount ($)</Label>
                <Input
                  id="requestedAmount"
                  type="number"
                  {...register('requestedAmount', { valueAsNumber: true })}
                  className="bg-muted/50"
                />
                {errors.requestedAmount && (
                  <p className="text-sm text-destructive">{errors.requestedAmount.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="termMonths">Loan Term (months)</Label>
                <Input
                  id="termMonths"
                  type="number"
                  {...register('termMonths', { valueAsNumber: true })}
                  className="bg-muted/50"
                />
                {errors.termMonths && (
                  <p className="text-sm text-destructive">{errors.termMonths.message}</p>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <Lock className="h-5 w-5 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Your data is encrypted using <span className="text-foreground font-medium">AES-256-GCM</span> before 
                leaving your browser. Only the TEE enclave can decrypt and process it.
              </p>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full gap-2"
              disabled={!isConnected || isProcessing}
            >
              <Shield className="h-5 w-5" />
              Submit Encrypted Application
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-lg font-medium text-foreground">Processing in TEE...</p>
                <p className="text-sm text-muted-foreground">This may take a few seconds</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Score Display */}
                <div className="text-center p-8 rounded-2xl bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Your Credit Score</p>
                  <p className={`text-6xl font-bold ${getCreditScoreColor(result.score)}`}>
                    {result.score}
                  </p>
                  <p className={`text-lg font-medium mt-2 ${getCreditScoreColor(result.score)}`}>
                    {getCreditScoreLabel(result.score)}
                  </p>
                </div>

                {/* Attestation */}
                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium text-success">TEE Attestation Verified</span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {result.attestation}
                  </p>
                </div>

                {/* Data Hash */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Encrypted Data Hash</p>
                  <p className="text-xs font-mono text-foreground break-all">
                    {result.encryptedDataHash}
                  </p>
                </div>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Submit New Application
                </Button>
              </div>
            ) : error ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
