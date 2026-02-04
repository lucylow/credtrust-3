import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import WalletConnector from './WalletConnector';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { AnimatedPrefetchLink } from './PrefetchLink';
import appRoutes from '@/routes/appRoutes';
import { cn } from '@/lib/utils';

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Get main nav routes (first 4 routes for header)
  const headerRoutes = appRoutes.slice(0, 4);

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="p-2 rounded-lg gradient-primary"
          >
            <Shield className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            CredTrust
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {headerRoutes.map((route) => {
            const isActive = location.pathname === route.path;
            const Icon = route.icon;
            return (
              <AnimatedPrefetchLink
                key={route.path}
                to={route.path}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                showActiveIndicator={false}
              >
                <Icon className="h-4 w-4" />
                {route.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20 -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </AnimatedPrefetchLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle size="sm" className="hidden sm:flex" />
          <div className="hidden md:block">
            <WalletConnector />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <nav className="container py-4 space-y-1">
              {appRoutes.map((route) => {
                const isActive = location.pathname === route.path;
                const Icon = route.icon;
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <p>{route.name}</p>
                      {route.description && (
                        <p className="text-xs text-muted-foreground">{route.description}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-border">
                <WalletConnector />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
