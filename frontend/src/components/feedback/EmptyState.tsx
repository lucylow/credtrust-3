import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Users, CreditCard, Plus, ArrowRight } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'compact';
  className?: string;
}

const defaultIcons = {
  search: <Search className="h-12 w-12" />,
  document: <FileText className="h-12 w-12" />,
  users: <Users className="h-12 w-12" />,
  credit: <CreditCard className="h-12 w-12" />,
};

export default function EmptyState({
  icon = defaultIcons.search,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variant === 'default' ? 'py-16 px-8' : 'py-8 px-4',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="relative mb-6"
      >
        {/* Background glow */}
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl scale-150" />
        
        {/* Icon container */}
        <div className="relative p-6 rounded-full bg-muted/50 border border-border text-muted-foreground">
          {icon}
        </div>

        {/* Animated ring */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-primary/30"
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          'font-semibold text-foreground mb-2',
          variant === 'default' ? 'text-xl' : 'text-lg'
        )}
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cn(
          'text-muted-foreground max-w-md mb-6',
          variant === 'default' ? 'text-base' : 'text-sm'
        )}
      >
        {description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        {action && (
          <GradientButton
            onClick={action.onClick}
            icon={action.icon || <Plus className="h-4 w-4" />}
            size={variant === 'default' ? 'md' : 'sm'}
          >
            {action.label}
          </GradientButton>
        )}

        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {secondaryAction.label}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

// Preset empty states
export function NoApplicationsState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="h-12 w-12" />}
      title="No Applications Yet"
      description="You haven't submitted any credit applications. Start your first one to get a verified credit score."
      action={{
        label: 'Submit Application',
        onClick: onCreateClick,
      }}
      secondaryAction={{
        label: 'Learn how it works',
        onClick: () => {},
      }}
    />
  );
}

export function NoNFTsState({ onMintClick }: { onMintClick: () => void }) {
  return (
    <EmptyState
      icon={<CreditCard className="h-12 w-12" />}
      title="No Credit NFTs"
      description="Complete a credit assessment to mint your first Credit Proof NFT. This soulbound token verifies your creditworthiness."
      action={{
        label: 'Get Started',
        onClick: onMintClick,
      }}
    />
  );
}
