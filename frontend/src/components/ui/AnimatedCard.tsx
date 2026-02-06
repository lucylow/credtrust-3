import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: boolean;
  collapsible?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function AnimatedCard({
  title,
  subtitle,
  icon,
  gradient = false,
  collapsible = false,
  children,
  footer,
  onClick,
  className,
}: AnimatedCardProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-shadow duration-300',
        gradient
          ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5'
          : 'border-border bg-card',
        onClick ? 'cursor-pointer' : '',
        isHovered ? 'shadow-glow' : 'shadow-card',
        className
      )}
    >
      {/* Shimmer effect on hover */}
      <AnimatePresence>
        {isHovered && gradient && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Glowing border effect */}
      {gradient && (
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0.5 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/30 to-secondary/30 blur-xl" />
        </motion.div>
      )}

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-2.5 rounded-xl gradient-primary"
              >
                {icon}
              </motion.div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                {gradient && (
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          {collapsible && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="rounded-lg p-2 hover:bg-muted transition-colors"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </button>
          )}

          {onClick && !collapsible && (
            <ExternalLink className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {footer && (
        <div className="relative z-10 border-t border-border px-6 py-4 bg-muted/30">
          {footer}
        </div>
      )}
    </motion.div>
  );
}
