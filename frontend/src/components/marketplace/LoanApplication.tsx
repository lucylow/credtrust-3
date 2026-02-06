import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loan } from '@/types/loan.types';
import { applyForLoan } from '@/services/loan.service';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';

interface LoanApplicationProps {
  loan: Loan;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoanApplication({ loan, onClose, onSuccess }: LoanApplicationProps) {
  const { wallet } = useWallet();
  const [amount, setAmount] = useState(loan.minInvestment.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const remainingAmount = loan.amount - loan.fundedAmount;
  const investmentAmount = parseFloat(amount) || 0;
  const isValidAmount = investmentAmount >= loan.minInvestment && investmentAmount <= remainingAmount;
  const expectedReturn = investmentAmount * (1 + (loan.interestRate / 100) * (loan.termMonths / 12));

  const handleSubmit = async () => {
    if (!wallet.address || !isValidAmount) return;

    setIsSubmitting(true);
    try {
      const result = await applyForLoan(loan.id, investmentAmount, wallet.address);
      
      if (result.success) {
        setSuccess(true);
        toast.success(result.message);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to process investment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="glass-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-10 w-10 text-success" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground mb-2">Investment Successful!</h3>
            <p className="text-muted-foreground">
              You've invested ${investmentAmount.toLocaleString()} in "{loan.title}"
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Invest in Loan</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Loan Summary */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border mb-6">
              <h4 className="font-semibold text-foreground mb-2">{loan.title}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Amount</span>
                  <p className="font-medium text-foreground">${loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Remaining</span>
                  <p className="font-medium text-foreground">${remainingAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Interest Rate</span>
                  <p className="font-medium text-success">{loan.interestRate}% APR</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Term</span>
                  <p className="font-medium text-foreground">{loan.termMonths} months</p>
                </div>
              </div>
            </div>

            {/* Investment Amount */}
            <div className="space-y-2 mb-6">
              <Label htmlFor="amount">Investment Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={loan.minInvestment}
                  max={remainingAmount}
                  className="pl-10 bg-muted/50"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Min: ${loan.minInvestment.toLocaleString()}</span>
                <span>Max: ${remainingAmount.toLocaleString()}</span>
              </div>
              {!isValidAmount && investmentAmount > 0 && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {investmentAmount < loan.minInvestment
                      ? `Minimum investment is $${loan.minInvestment}`
                      : `Maximum investment is $${remainingAmount.toLocaleString()}`}
                  </span>
                </div>
              )}
            </div>

            {/* Expected Return */}
            {isValidAmount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-success/10 border border-success/30 mb-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expected Return</span>
                  <span className="text-lg font-bold text-success">
                    ${expectedReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +${(expectedReturn - investmentAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })} profit after {loan.termMonths} months
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isValidAmount || isSubmitting || !wallet.isConnected}
                className="flex-1 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Investment'
                )}
              </Button>
            </div>

            {!wallet.isConnected && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Please connect your wallet to invest
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
