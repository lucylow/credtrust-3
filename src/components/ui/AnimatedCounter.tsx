import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (current) =>
    Math.floor(current).toLocaleString()
  );

  useEffect(() => {
    if (isVisible) {
      spring.set(value);
    }
  }, [isVisible, value, spring]);

  return (
    <motion.span className={cn('tabular-nums', className)}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  );
}

// Credit score counter with color
interface CreditScoreCounterProps {
  score: number;
  delay?: number;
  className?: string;
}

export function CreditScoreCounter({
  score,
  delay = 0,
  className,
}: CreditScoreCounterProps) {
  const [displayScore, setDisplayScore] = useState(300);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 300;
      const step = (score - 300) / 50;
      const interval = setInterval(() => {
        current += step;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 30);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [score, delay]);

  const getColor = () => {
    if (displayScore >= 750) return 'text-success';
    if (displayScore >= 670) return 'text-primary';
    if (displayScore >= 580) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getLabel = () => {
    if (displayScore >= 750) return 'Excellent';
    if (displayScore >= 670) return 'Good';
    if (displayScore >= 580) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={cn('text-center', className)}>
      <motion.p
        key={displayScore}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className={cn('text-6xl font-bold tabular-nums', getColor())}
      >
        {displayScore}
      </motion.p>
      <p className={cn('text-lg font-semibold mt-1', getColor())}>{getLabel()}</p>
    </div>
  );
}

// Percentage ring counter
interface PercentageRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  delay?: number;
  className?: string;
}

export function PercentageRing({
  percentage,
  size = 120,
  strokeWidth = 8,
  delay = 0,
  className,
}: PercentageRingProps) {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatedCounter value={percentage} suffix="%" className="text-2xl font-bold" delay={delay} />
      </div>
    </div>
  );
}
