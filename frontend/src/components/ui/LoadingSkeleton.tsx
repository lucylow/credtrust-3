import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-muted/50',
        className
      )}
      {...props}
    />
  );
}

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'avatar' | 'stats';
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({
  type = 'card',
  count = 1,
  className = '',
}: LoadingSkeletonProps) {
  const skeletons = Array(count).fill(null);

  if (type === 'stats') {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
        {skeletons.map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={cn('space-y-4', className)}>
        {skeletons.map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className={cn('space-y-3', className)}>
        {skeletons.map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        {skeletons.map((_, i) => (
          <div key={i} className="h-10 w-10 rounded-full animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  return <Skeleton className={className} />;
}

// Dashboard Loading Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Stats Grid */}
      <LoadingSkeleton type="stats" count={4} />

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        <LoadingSkeleton type="card" count={1} />
        <LoadingSkeleton type="card" count={1} />
      </div>
    </div>
  );
}
