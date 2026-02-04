import { Link, LinkProps, useLocation } from 'react-router-dom';
import { usePrefetch } from '@/hooks/usePrefetch';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PrefetchLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  children: React.ReactNode;
  activeClassName?: string;
  prefetchOnMount?: boolean;
}

/**
 * Enhanced Link component that prefetches route bundles on hover
 * Improves navigation speed by preloading resources before click
 */
export default function PrefetchLink({
  to,
  children,
  className,
  activeClassName,
  prefetchOnMount = false,
  ...props
}: PrefetchLinkProps) {
  const prefetch = usePrefetch();
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleMouseEnter = () => {
    prefetch(to);
  };

  const handleFocus = () => {
    prefetch(to);
  };

  return (
    <Link
      to={to}
      className={cn(className, isActive && activeClassName)}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Animated prefetch link with hover effects
 */
interface AnimatedPrefetchLinkProps extends PrefetchLinkProps {
  icon?: React.ReactNode;
  showActiveIndicator?: boolean;
}

export function AnimatedPrefetchLink({
  to,
  children,
  icon,
  className,
  activeClassName,
  showActiveIndicator = true,
  ...props
}: AnimatedPrefetchLinkProps) {
  const prefetch = usePrefetch();
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleMouseEnter = () => {
    prefetch(to);
  };

  return (
    <Link
      to={to}
      className={cn(
        'relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
        isActive
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
        className,
        isActive && activeClassName
      )}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      
      {showActiveIndicator && isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}
