import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  interactive?: boolean;
  maxWidth?: string;
  className?: string;
}

export default function InteractiveTooltip({
  content,
  children,
  position = 'top',
  delay = 300,
  interactive = false,
  maxWidth = '20rem',
  className,
}: InteractiveTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (!interactive) {
      setIsVisible(false);
    }
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  const arrowPositionClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-card border-l-transparent border-r-transparent border-b-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-card border-t-transparent border-b-transparent border-l-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-card border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-card border-t-transparent border-b-transparent border-r-transparent',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => interactive && setIsVisible(!isVisible)}
        className="inline-flex items-center cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop for interactive tooltips */}
            {interactive && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsVisible(false)}
              />
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={() => interactive && setIsVisible(true)}
              onMouseLeave={interactive ? undefined : () => setIsVisible(false)}
              className={cn('absolute z-50', positionClasses[position])}
              style={{ maxWidth }}
            >
              <div className="relative rounded-xl bg-card border border-border shadow-lg p-4">
                {interactive && (
                  <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-2 rounded-lg p-1 hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}

                <div className="text-sm text-foreground">{content}</div>

                {/* Tooltip arrow */}
                <div
                  className={cn(
                    'absolute w-0 h-0 border-[6px]',
                    arrowPositionClasses[position]
                  )}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Info Tooltip variant
export function InfoTooltip({
  term,
  definition,
}: {
  term: string;
  definition: string;
}) {
  return (
    <InteractiveTooltip
      content={
        <div>
          <p className="font-semibold text-foreground mb-1">{term}</p>
          <p className="text-muted-foreground text-xs">{definition}</p>
        </div>
      }
      interactive
    >
      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
    </InteractiveTooltip>
  );
}
