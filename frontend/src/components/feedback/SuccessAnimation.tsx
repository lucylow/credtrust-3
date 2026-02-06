import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps {
  show: boolean;
  title?: string;
  message?: string;
  onComplete?: () => void;
  className?: string;
}

export default function SuccessAnimation({
  show,
  title = 'Success!',
  message,
  onComplete,
  className,
}: SuccessAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            setTimeout(() => onComplete?.(), 2000);
          }}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
            className
          )}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative flex flex-col items-center text-center p-8"
          >
            {/* Sparkles */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-4 -left-4 text-primary"
            >
              <Sparkles className="h-8 w-8 animate-pulse" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-2 -right-6 text-secondary"
            >
              <Sparkles className="h-6 w-6 animate-pulse" />
            </motion.div>

            {/* Success icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 rounded-full bg-success/20 blur-xl scale-150" />
              <div className="relative p-6 rounded-full bg-success text-success-foreground">
                <CheckCircle className="h-16 w-16" />
              </div>

              {/* Animated rings */}
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-4 border-success"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 rounded-full border-2 border-success"
              />
            </motion.div>

            {/* Text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              {title}
            </motion.h2>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground max-w-sm"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Score reveal animation
interface ScoreRevealProps {
  show: boolean;
  score: number;
  label: string;
  onComplete?: () => void;
}

export function ScoreReveal({ show, score, label, onComplete }: ScoreRevealProps) {
  const getCreditScoreColor = (s: number) => {
    if (s >= 750) return 'text-success';
    if (s >= 670) return 'text-primary';
    if (s >= 580) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            setTimeout(() => onComplete?.(), 3000);
          }}
          className="flex flex-col items-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative"
          >
            {/* Background glow */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-150" />

            {/* Score display */}
            <div className="relative text-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="block text-sm text-muted-foreground mb-2"
              >
                Your Credit Score
              </motion.span>

              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.5 }}
                className={cn('block text-8xl font-bold', getCreditScoreColor(score))}
              >
                {score}
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={cn('block text-xl font-semibold mt-2', getCreditScoreColor(score))}
              >
                {label}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
