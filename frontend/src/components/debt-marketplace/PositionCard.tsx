 import { motion } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, DollarSign, Wifi, WifiOff } from 'lucide-react';
 import { Card, CardContent, CardHeader } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Progress } from '@/components/ui/progress';
 import type { TrancheData } from '@/store/debtOpsStore';
 
 const TRANCHE_CONFIG = {
   senior: { priority: 1, apyRange: '4-6%', risk: 'Low', colorClass: 'border-l-[hsl(var(--tranche-senior))]', bgClass: 'bg-primary/5' },
   junior: { priority: 2, apyRange: '8-12%', risk: 'Medium', colorClass: 'border-l-[hsl(var(--tranche-junior))]', bgClass: 'bg-[hsl(var(--warning))]/5' },
   equity: { priority: 3, apyRange: '15-25%', risk: 'High', colorClass: 'border-l-[hsl(var(--tranche-equity))]', bgClass: 'bg-destructive/5' },
 };
 
 interface PositionCardProps {
   tranche: TrancheData;
   type: 'senior' | 'junior' | 'equity';
   onMint: () => void;
   onRedeem: () => void;
  isLive?: boolean;
 }
 
export default function PositionCard({ tranche, type, onMint, onRedeem, isLive = false }: PositionCardProps) {
   const config = TRANCHE_CONFIG[type];
  const isPositiveChange = tranche.change24h?.startsWith('+');
   
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       whileHover={{ scale: 1.02 }}
       transition={{ duration: 0.2 }}
     >
       <Card className={`border-l-4 ${config.colorClass} ${config.bgClass} hover:shadow-lg transition-shadow`}>
         <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
             <Badge variant="outline" className="text-xs">
               Priority {config.priority}
             </Badge>
            <div className="flex items-center gap-2">
              {isLive && (
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  <span className="text-[10px] text-success font-medium">LIVE</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground">{config.risk} Risk</span>
            </div>
           </div>
           
           <div className="flex items-center justify-between mt-3">
             <div className="flex items-center gap-2">
               <Shield className="w-5 h-5 text-primary" />
               <h3 className="font-semibold capitalize text-foreground">{type} Tranche</h3>
             </div>
             <span className="text-lg font-bold text-success">{config.apyRange}</span>
           </div>
         </CardHeader>
         
         <CardContent className="space-y-4">
          {/* Live Price */}
          {tranche.price && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">Live Price</p>
                <motion.p 
                  key={tranche.price}
                  initial={{ scale: 1.1, color: isPositiveChange ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}
                  animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                  className="text-xl font-bold"
                >
                  ${tranche.price.toFixed(4)}
                </motion.p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isPositiveChange 
                  ? 'bg-success/10 text-success' 
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {isPositiveChange ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {tranche.change24h}
              </div>
            </div>
          )}
          
           {/* Utilization */}
           <div className="space-y-2">
             <div className="flex justify-between text-sm">
               <span className="text-muted-foreground">Utilization</span>
               <span className="font-medium text-foreground">{(tranche.utilization * 100).toFixed(0)}%</span>
             </div>
             <Progress value={tranche.utilization * 100} className="h-2" />
           </div>
           
           {/* Metrics */}
           <div className="grid grid-cols-2 gap-4">
             <div>
               <p className="text-xs text-muted-foreground">Total Supply</p>
               <p className="font-semibold text-foreground">${(tranche.totalSupply / 1000000).toFixed(1)}M</p>
             </div>
             <div>
               <p className="text-xs text-muted-foreground">Your Position</p>
               <p className="font-semibold text-foreground">${tranche.userPosition.toLocaleString()}</p>
             </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
             <div className="text-center">
               <p className="text-lg font-bold text-success">{tranche.yield24h}%</p>
               <p className="text-xs text-muted-foreground">24h Yield</p>
             </div>
             <div className="text-center">
               <p className="text-lg font-bold text-foreground">{tranche.remainingDays}d</p>
               <p className="text-xs text-muted-foreground">To Maturity</p>
             </div>
           </div>
           
           {/* Actions */}
           <div className="flex gap-2 pt-2">
             <Button onClick={onMint} className="flex-1" size="sm">
               <DollarSign className="w-4 h-4" />
               Mint Position
             </Button>
             {tranche.userPosition > 0 && (
               <Button onClick={onRedeem} variant="outline" size="sm">
                 Redeem ({tranche.penalty}%)
               </Button>
             )}
           </div>
         </CardContent>
       </Card>
     </motion.div>
   );
 }