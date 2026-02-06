import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressDualProps {
  label: string;
  value: number;
  max?: number;
  color?: "primary" | "success" | "warning" | "critical";
  showPercentage?: boolean;
  className?: string;
  animated?: boolean;
}

const colorMap = {
  primary: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

const glowMap = {
  primary: "shadow-primary/50",
  success: "shadow-emerald-500/50",
  warning: "shadow-amber-500/50",
  critical: "shadow-red-500/50",
};

export function ProgressDual({
  label,
  value,
  max = 100,
  color = "primary",
  showPercentage = true,
  className,
  animated = true,
}: ProgressDualProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">{label}</span>
        {showPercentage && (
          <span className="text-foreground font-semibold tabular-nums">
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
      
      <div 
        className="h-2 rounded-full bg-muted/50 overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${percentage.toFixed(0)}%`}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={cn(
            "h-full rounded-full shadow-lg",
            colorMap[color],
            glowMap[color]
          )}
        />
      </div>
    </div>
  );
}
