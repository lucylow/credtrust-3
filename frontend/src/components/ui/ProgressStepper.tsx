import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'pending' | 'error';
  disabled?: boolean;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep?: string;
  onStepClick?: (stepId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export default function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  className,
}: ProgressStepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div
      className={cn(
        'relative',
        orientation === 'horizontal'
          ? 'flex items-start justify-between'
          : 'flex flex-col gap-4',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';
        const isError = step.status === 'error';
        const isClickable = onStepClick && !step.disabled;

        return (
          <div
            key={step.id}
            className={cn(
              'relative flex',
              orientation === 'horizontal'
                ? 'flex-col items-center flex-1'
                : 'items-start gap-4'
            )}
          >
            <div className="flex flex-col items-center">
              {/* Step indicator */}
              <motion.button
                whileHover={isClickable ? { scale: 1.1 } : undefined}
                whileTap={isClickable ? { scale: 0.95 } : undefined}
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  'relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isCompleted
                    ? 'border-success bg-success text-success-foreground'
                    : isCurrent
                    ? 'border-primary bg-card text-primary'
                    : isError
                    ? 'border-destructive bg-card text-destructive'
                    : 'border-border bg-card text-muted-foreground',
                  step.disabled && 'opacity-50 cursor-not-allowed',
                  isClickable && !step.disabled && 'cursor-pointer hover:shadow-glow'
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : isError ? (
                  <AlertCircle className="h-5 w-5" />
                ) : step.disabled ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}

                {/* Pulse animation for current step */}
                {isCurrent && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-primary"
                  />
                )}
              </motion.button>

              {/* Step label */}
              <div
                className={cn(
                  'mt-3 text-center',
                  orientation === 'vertical' && 'text-left'
                )}
              >
                <p
                  className={cn(
                    'font-medium text-sm transition-colors',
                    isCompleted || isCurrent
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && orientation === 'horizontal' && (
              <div className="absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 bg-border -translate-y-1/2">
                {index < currentIndex && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full bg-success"
                  />
                )}
              </div>
            )}

            {index < steps.length - 1 && orientation === 'vertical' && (
              <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border -translate-x-1/2">
                {index < currentIndex && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full bg-success"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
