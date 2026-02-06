import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export function IExecDemoStepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: index <= currentStep ? '#3b82f6' : '#1e293b',
                scale: index === currentStep ? 1.2 : 1,
              }}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 border-slate-700 text-white font-bold",
                index < currentStep && "bg-blue-500 border-blue-500"
              )}
            >
              {index < currentStep ? (
                <Check className="w-6 h-6" />
              ) : index === currentStep ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                index + 1
              )}
            </motion.div>
            <span className={cn(
              "text-xs mt-2 font-medium",
              index <= currentStep ? "text-blue-400" : "text-slate-500"
            )}>
              {step}
            </span>
          </div>
        ))}
        {/* Progress Line */}
        <div className="absolute top-5 left-0 h-0.5 bg-slate-800 w-full -z-0" />
        <motion.div 
          className="absolute top-5 left-0 h-0.5 bg-blue-500 -z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
