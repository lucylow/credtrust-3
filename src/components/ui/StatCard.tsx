import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
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

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(({
  label,
  value,
  change,
  isPositive = true,
  icon: Icon,
  color = 'from-primary to-blue-600',
  delay = 0,
  className,
}, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'glass-card-elevated p-5 hover:border-primary/20 transition-all duration-300 group relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={cn('p-2.5 rounded-xl bg-gradient-to-br shadow-lg', color)}
          >
            <Icon className="h-5 w-5 text-primary-foreground" />
          </motion.div>
        )}
        {change && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 }}
            className={cn(
              'flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg',
              isPositive 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-red-400 bg-red-500/10'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {change}
          </motion.span>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.15, type: 'spring', stiffness: 100 }}
        className="text-3xl font-bold text-foreground tracking-tight"
      >
        {value}
      </motion.p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
      
      {/* Subtle gradient line */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-gradient-to-r rounded-b-2xl',
        color
      )} />
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;

// Mini stat for inline display
interface MiniStatProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function MiniStat({ label, value, icon: Icon, trend, className }: MiniStatProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors',
        className
      )}
    >
      {Icon && (
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{value}</p>
          {trend && (
            <span className={cn(
              'text-xs',
              trend === 'up' && 'text-emerald-400',
              trend === 'down' && 'text-red-400',
              trend === 'neutral' && 'text-muted-foreground'
            )}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
