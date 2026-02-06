 import { motion } from 'framer-motion';
import { Layers, Wifi, WifiOff, BarChart3 } from 'lucide-react';
 import { useDebtOpsStore } from '@/store/debtOpsStore';
 import { useTrancheManager } from '@/hooks/useTrancheManager';
import { useTranchePrices } from '@/hooks/useTranchePrices';
 import DebtHero from './DebtHero';
 import PositionCard from './PositionCard';
import OrderBookDepth from './OrderBookDepth';
import PriceHistoryChart from './PriceHistoryChart';
 import HSMMonitor from '@/components/ops-center/HSMMonitor';
 import AlertCenter from '@/components/ops-center/AlertCenter';
 
 export default function TrancheManager() {
   const { tranches, totalPool } = useDebtOpsStore();
   const { mintTranchePosition, redeemTranchePosition } = useTrancheManager();
  const { isConnected } = useTranchePrices();
 
   const trancheTypes = ['senior', 'junior', 'equity'] as const;
 
   return (
     <div className="space-y-6">
       <DebtHero totalPool={totalPool} />
 
       <div className="grid lg:grid-cols-3 gap-6">
         {/* Tranche Waterfall */}
         <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Debt Waterfall</h2>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              isConnected 
                ? 'bg-success/10 text-success border border-success/20' 
                : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}>
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? 'Live Pricing' : 'Offline'}
            </div>
           </div>
           
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {trancheTypes.map((type, index) => (
               <motion.div
                 key={type}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
               >
                 <PositionCard
                   tranche={tranches[type]}
                   type={type}
                   onMint={() => mintTranchePosition(type)}
                   onRedeem={() => redeemTranchePosition(type)}
                  isLive={isConnected}
                 />
               </motion.div>
             ))}
           </div>

            {/* Price History Charts */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Price History</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trancheTypes.map((type, index) => (
                  <motion.div
                    key={`chart-${type}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <PriceHistoryChart
                      tranche={type}
                      currentPrice={tranches[type].price || 1}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
         </div>
 
         {/* Ops Dashboard */}
         <div className="space-y-4">
           <h2 className="text-xl font-semibold text-foreground">Ops Center</h2>
          <OrderBookDepth />
           <HSMMonitor />
           <AlertCenter />
         </div>
       </div>
     </div>
   );
 }