import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  color?: string;
  delay?: number;
  className?: string;
}

export default function StatCard({
  label,
  value,
  change,
  isPositive = true,
  icon: Icon,
  color = 'from-primary to-blue-600',
  delay = 0,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'glass-card p-5 hover:shadow-glow transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={cn('p-2.5 rounded-xl bg-gradient-to-br', color)}>
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
        {change && (
          <span
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              isPositive ? 'text-success' : 'text-destructive'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {change}
          </span>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, type: 'spring', stiffness: 100 }}
        className="text-2xl font-bold text-foreground"
      >
        {value}
      </motion.p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

// Mini stat for inline display
interface MiniStatProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  className?: string;
}

export function MiniStat({ label, value, icon: Icon, className }: MiniStatProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border',
        className
      )}
    >
      {Icon && (
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      )}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
