import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  change24h: string;
  volume24h?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceTag({ 
  price, 
  change24h, 
  volume24h, 
  className,
  size = "md" 
}: PriceTagProps) {
  const isPositive = change24h.startsWith("+");
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col",
        size === "sm" && "gap-0.5",
        size === "md" && "gap-1",
        size === "lg" && "gap-2",
        className
      )}
    >
      <motion.span
        key={price}
        initial={{ opacity: 0.5, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "font-display font-bold tabular-nums",
          size === "sm" && "text-lg",
          size === "md" && "text-2xl",
          size === "lg" && "text-4xl"
        )}
      >
        ${price.toFixed(4)}
      </motion.span>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-3 w-3" aria-hidden="true" />
          )}
          <span aria-label={`${isPositive ? "Up" : "Down"} ${change24h}`}>
            {change24h}
          </span>
        </span>
        
        {volume24h && (
          <span className="text-xs text-muted-foreground">
            {volume24h.toLocaleString()} vol
          </span>
        )}
      </div>
    </motion.div>
  );
}
