import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatedPrefetchLink } from './PrefetchLink';
import appRoutes from '@/routes/appRoutes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  className?: string;
}

export default function AppSidebar({ className }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle responsive collapse
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Group routes by category
  const mainRoutes = appRoutes.filter(r => 
    ['/app', '/app/submit', '/app/nft', '/app/marketplace'].includes(r.path)
  );
  const toolRoutes = appRoutes.filter(r =>
    ['/app/visualizer', '/app/disclosure'].includes(r.path)
  );
  const settingsRoutes = appRoutes.filter(r =>
    r.path === '/app/settings'
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'relative h-full border-r border-border bg-card/50 backdrop-blur-xl flex flex-col shrink-0',
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center h-16 border-b border-border px-4',
        isCollapsed ? 'justify-center' : 'gap-3'
      )}>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="p-2 rounded-lg gradient-primary shrink-0"
        >
          <Shield className="h-5 w-5 text-primary-foreground" />
        </motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg text-foreground whitespace-nowrap overflow-hidden"
            >
              CredTrust
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Main Section */}
        <div>
          {!isCollapsed && (
            <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </p>
          )}
          <div className="space-y-1">
            {mainRoutes.map((route) => (
              <SidebarItem
                key={route.path}
                route={route}
                isCollapsed={isCollapsed}
                isActive={location.pathname === route.path}
              />
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <div>
          {!isCollapsed && (
            <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tools
            </p>
          )}
          <div className="space-y-1">
            {toolRoutes.map((route) => (
              <SidebarItem
                key={route.path}
                route={route}
                isCollapsed={isCollapsed}
                isActive={location.pathname === route.path}
              />
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="mt-auto">
          {!isCollapsed && (
            <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account
            </p>
          )}
          <div className="space-y-1">
            {settingsRoutes.map((route) => (
              <SidebarItem
                key={route.path}
                route={route}
                isCollapsed={isCollapsed}
                isActive={location.pathname === route.path}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Collapse Toggle */}
      {!isMobile && (
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'w-full justify-center',
              !isCollapsed && 'justify-between'
            )}
          >
            {!isCollapsed && <span className="text-xs text-muted-foreground">Collapse</span>}
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </motion.aside>
  );
}

interface SidebarItemProps {
  route: typeof appRoutes[0];
  isCollapsed: boolean;
  isActive: boolean;
}

function SidebarItem({ route, isCollapsed, isActive }: SidebarItemProps) {
  const Icon = route.icon;

  if (isCollapsed) {
    return (
      <AnimatedPrefetchLink
        to={route.path}
        className={cn(
          'flex items-center justify-center p-3 rounded-xl transition-all',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
        title={route.name}
        showActiveIndicator={false}
      >
        <Icon className="h-5 w-5" />
      </AnimatedPrefetchLink>
    );
  }

  return (
    <AnimatedPrefetchLink
      to={route.path}
      icon={<Icon className="h-5 w-5" />}
    >
      {route.name}
    </AnimatedPrefetchLink>
  );
}
