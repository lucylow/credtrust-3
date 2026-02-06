// Backend connection status indicator component

import { useEffect, useState } from 'react';
import { useHealthCheck } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type BackendStatus = 'connected' | 'disconnected' | 'checking' | 'degraded';

interface BackendStatusProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BackendStatus({ className, showLabel = false, size = 'md' }: BackendStatusProps) {
  const { data, isLoading, isError, refetch } = useHealthCheck();
  const [status, setStatus] = useState<BackendStatus>('checking');

  useEffect(() => {
    if (isLoading) {
      setStatus('checking');
    } else if (isError) {
      setStatus('disconnected');
    } else if (data?.status === 'ok') {
      setStatus('connected');
    } else {
      setStatus('degraded');
    }
  }, [data, isLoading, isError]);

  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const iconClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const statusConfig = {
    connected: {
      color: 'bg-success',
      icon: CheckCircle,
      label: 'Backend Connected',
      description: 'All systems operational',
    },
    disconnected: {
      color: 'bg-destructive',
      icon: WifiOff,
      label: 'Backend Offline',
      description: 'Using local simulation',
    },
    checking: {
      color: 'bg-muted-foreground animate-pulse',
      icon: Wifi,
      label: 'Connecting...',
      description: 'Checking backend status',
    },
    degraded: {
      color: 'bg-yellow-500',
      icon: AlertCircle,
      label: 'Degraded',
      description: 'Some services unavailable',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => refetch()}
          className={cn(
            'flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-muted/50',
            className
          )}
        >
          <span className={cn('rounded-full', sizeClasses[size], config.color)} />
          {showLabel && (
            <span className="text-xs text-muted-foreground">{config.label}</span>
          )}
          <Icon className={cn(iconClasses[size], 'text-muted-foreground')} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-medium">{config.label}</p>
          <p className="text-xs text-muted-foreground">{config.description}</p>
          {status === 'disconnected' && (
            <p className="text-xs text-muted-foreground">
              Click to retry connection
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Minimal inline status dot
export function StatusDot({ 
  status, 
  className 
}: { 
  status: 'online' | 'offline' | 'pending';
  className?: string;
}) {
  const colors = {
    online: 'bg-success',
    offline: 'bg-destructive',
    pending: 'bg-muted-foreground animate-pulse',
  };

  return (
    <span 
      className={cn(
        'inline-block h-2 w-2 rounded-full',
        colors[status],
        className
      )} 
    />
  );
}
