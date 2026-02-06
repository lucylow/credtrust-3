import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ThemeToggle({ className, size = 'md', showLabel = false }: ThemeToggleProps) {
  const { theme, resolvedTheme, toggleTheme, isTransitioning } = useTheme();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const themeConfig = {
    dark: { 
      icon: Moon, 
      label: 'Dark',
      gradient: 'from-indigo-500 to-purple-600',
      glow: 'shadow-[0_0_15px_hsl(var(--primary)/0.3)]'
    },
    light: { 
      icon: Sun, 
      label: 'Light',
      gradient: 'from-amber-400 to-orange-500',
      glow: 'shadow-[0_0_15px_hsl(45_100%_50%/0.3)]'
    },
    system: { 
      icon: Monitor, 
      label: 'System',
      gradient: 'from-gray-400 to-gray-600',
      glow: 'shadow-[0_0_15px_hsl(var(--muted-foreground)/0.2)]'
    },
  };

  const config = themeConfig[theme];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        disabled={isTransitioning}
        className={cn(
          'relative flex items-center justify-center rounded-xl border border-border bg-card overflow-hidden',
          'hover:border-primary/50 transition-colors duration-200',
          config.glow,
          sizeClasses[size],
        )}
        aria-label={`Current theme: ${theme}. Click to toggle.`}
      >
        {/* Background gradient */}
        <motion.div
          className={cn('absolute inset-0 bg-gradient-to-br opacity-10', config.gradient)}
          initial={false}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Icon with rotation animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ 
              rotate: theme === 'light' ? 180 : -180, 
              scale: 0,
              opacity: 0 
            }}
            animate={{ 
              rotate: 0, 
              scale: 1,
              opacity: 1 
            }}
            exit={{ 
              rotate: theme === 'dark' ? 180 : -180, 
              scale: 0,
              opacity: 0 
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 15 
            }}
            className="relative z-10"
          >
            <Icon className={cn(iconSizes[size], 'text-foreground')} />
          </motion.div>
        </AnimatePresence>
        
        {/* Shine effect on toggle */}
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        )}
      </motion.button>
      
      {showLabel && (
        <AnimatePresence mode="wait">
          <motion.span
            key={theme}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm font-medium text-muted-foreground"
          >
            {config.label}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}

// Expanded theme selector for settings
export function ThemeSelector({ className }: { className?: string }) {
  const { theme, setTheme, isTransitioning } = useTheme();

  const options = [
    { value: 'light', label: 'Light', icon: Sun, gradient: 'from-amber-400 to-orange-500' },
    { value: 'dark', label: 'Dark', icon: Moon, gradient: 'from-indigo-500 to-purple-600' },
    { value: 'system', label: 'System', icon: Monitor, gradient: 'from-gray-400 to-gray-600' },
  ] as const;

  return (
    <div className={cn('flex gap-2 p-1 rounded-xl bg-muted/50 border border-border', className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = theme === option.value;

        return (
          <motion.button
            key={option.value}
            whileHover={{ scale: isSelected ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme(option.value)}
            disabled={isTransitioning}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 overflow-hidden',
              isSelected
                ? 'bg-card text-foreground shadow-md border border-border'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="theme-selector-bg"
                className={cn('absolute inset-0 bg-gradient-to-br opacity-10', option.gradient)}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium relative z-10">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// Compact pill-style toggle (just dark/light)
export function ThemePillToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme, isTransitioning } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      disabled={isTransitioning}
      className={cn(
        'relative flex items-center w-16 h-8 rounded-full p-1 transition-colors duration-300',
        isDark ? 'bg-indigo-600' : 'bg-amber-400',
        className
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background icons */}
      <Sun className="absolute left-1.5 h-4 w-4 text-white/30" />
      <Moon className="absolute right-1.5 h-4 w-4 text-white/30" />
      
      {/* Sliding thumb */}
      <motion.div
        className="relative z-10 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isDark ? (
              <Moon className="h-3.5 w-3.5 text-indigo-600" />
            ) : (
              <Sun className="h-3.5 w-3.5 text-amber-500" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
