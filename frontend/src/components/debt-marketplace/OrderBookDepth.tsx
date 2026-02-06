 import { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { cn } from '@/lib/utils';
 
 interface OrderLevel {
   price: number;
   volume: number;
   total: number;
 }
 
 interface OrderBookData {
   bids: OrderLevel[];
   asks: OrderLevel[];
   spread: number;
   midPrice: number;
 }
 
 // Generate mock order book data for each tranche
 const generateOrderBook = (basePrice: number, volatility: number): OrderBookData => {
   const bids: OrderLevel[] = [];
   const asks: OrderLevel[] = [];
   let bidTotal = 0;
   let askTotal = 0;
 
   for (let i = 0; i < 8; i++) {
     const bidVolume = Math.floor(Math.random() * 50000 + 10000);
     const askVolume = Math.floor(Math.random() * 50000 + 10000);
     bidTotal += bidVolume;
     askTotal += askVolume;
 
     bids.push({
       price: basePrice - (i + 1) * volatility * basePrice,
       volume: bidVolume,
       total: bidTotal,
     });
 
     asks.push({
       price: basePrice + (i + 1) * volatility * basePrice,
       volume: askVolume,
       total: askTotal,
     });
   }
 
   return {
     bids,
     asks,
     spread: asks[0].price - bids[0].price,
     midPrice: basePrice,
   };
 };
 
 const TRANCHE_CONFIG = {
   senior: { basePrice: 1.02, volatility: 0.002, color: 'primary' },
   junior: { basePrice: 0.98, volatility: 0.008, color: 'warning' },
   equity: { basePrice: 1.12, volatility: 0.015, color: 'destructive' },
 };
 
 interface OrderRowProps {
   level: OrderLevel;
   maxTotal: number;
   type: 'bid' | 'ask';
 }
 
 function OrderRow({ level, maxTotal, type }: OrderRowProps) {
   const percentage = (level.total / maxTotal) * 100;
   const isBid = type === 'bid';
 
   return (
     <motion.div
       initial={{ opacity: 0, x: isBid ? -10 : 10 }}
       animate={{ opacity: 1, x: 0 }}
       className="relative grid grid-cols-3 gap-2 py-1 text-xs font-mono"
     >
       {/* Depth bar background */}
       <div
         className={cn(
           'absolute inset-y-0 h-full opacity-20 transition-all duration-300',
           isBid ? 'left-0 bg-success rounded-r' : 'right-0 bg-destructive rounded-l'
         )}
         style={{
           width: `${percentage}%`,
           [isBid ? 'left' : 'right']: 0,
         }}
       />
       
       {isBid ? (
         <>
           <span className="text-muted-foreground z-10">{level.total.toLocaleString()}</span>
           <span className="text-center z-10">{level.volume.toLocaleString()}</span>
           <span className="text-right text-success font-medium z-10">${level.price.toFixed(4)}</span>
         </>
       ) : (
         <>
           <span className="text-destructive font-medium z-10">${level.price.toFixed(4)}</span>
           <span className="text-center z-10">{level.volume.toLocaleString()}</span>
           <span className="text-right text-muted-foreground z-10">{level.total.toLocaleString()}</span>
         </>
       )}
     </motion.div>
   );
 }
 
 interface DepthChartProps {
   orderBook: OrderBookData;
 }
 
 function DepthChart({ orderBook }: DepthChartProps) {
   const maxBidTotal = orderBook.bids[orderBook.bids.length - 1]?.total || 1;
   const maxAskTotal = orderBook.asks[orderBook.asks.length - 1]?.total || 1;
   const maxTotal = Math.max(maxBidTotal, maxAskTotal);
 
   // Create depth chart points
   const bidPoints = orderBook.bids.map((level, i) => ({
     x: 50 - (i + 1) * 6,
     y: 100 - (level.total / maxTotal) * 80,
   }));
 
   const askPoints = orderBook.asks.map((level, i) => ({
     x: 50 + (i + 1) * 6,
     y: 100 - (level.total / maxTotal) * 80,
   }));
 
   const bidPath = `M 50 100 ${bidPoints.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${bidPoints[bidPoints.length - 1]?.x || 50} 100 Z`;
   const askPath = `M 50 100 ${askPoints.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${askPoints[askPoints.length - 1]?.x || 50} 100 Z`;
 
   return (
     <div className="h-24 w-full relative">
       <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
         {/* Grid lines */}
         <line x1="50" y1="0" x2="50" y2="100" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
         <line x1="0" y1="50" x2="100" y2="50" stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="2,2" />
         
         {/* Bid depth (green) */}
         <motion.path
           d={bidPath}
           fill="hsl(var(--success) / 0.3)"
           stroke="hsl(var(--success))"
           strokeWidth="1"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5 }}
         />
         
         {/* Ask depth (red) */}
         <motion.path
           d={askPath}
           fill="hsl(var(--destructive) / 0.3)"
           stroke="hsl(var(--destructive))"
           strokeWidth="1"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5, delay: 0.1 }}
         />
       </svg>
       
       {/* Mid price indicator */}
       <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground bg-background/80 px-1 rounded">
         ${orderBook.midPrice.toFixed(4)}
       </div>
     </div>
   );
 }
 
 export default function OrderBookDepth() {
   const [activeTranche, setActiveTranche] = useState<'senior' | 'junior' | 'equity'>('senior');
   const [orderBooks, setOrderBooks] = useState(() => ({
     senior: generateOrderBook(TRANCHE_CONFIG.senior.basePrice, TRANCHE_CONFIG.senior.volatility),
     junior: generateOrderBook(TRANCHE_CONFIG.junior.basePrice, TRANCHE_CONFIG.junior.volatility),
     equity: generateOrderBook(TRANCHE_CONFIG.equity.basePrice, TRANCHE_CONFIG.equity.volatility),
   }));
 
   // Simulate live updates
   useState(() => {
     const interval = setInterval(() => {
       setOrderBooks({
         senior: generateOrderBook(TRANCHE_CONFIG.senior.basePrice, TRANCHE_CONFIG.senior.volatility),
         junior: generateOrderBook(TRANCHE_CONFIG.junior.basePrice, TRANCHE_CONFIG.junior.volatility),
         equity: generateOrderBook(TRANCHE_CONFIG.equity.basePrice, TRANCHE_CONFIG.equity.volatility),
       });
     }, 3000);
     return () => clearInterval(interval);
   });
 
   const currentBook = orderBooks[activeTranche];
   const maxTotal = Math.max(
     currentBook.bids[currentBook.bids.length - 1]?.total || 1,
     currentBook.asks[currentBook.asks.length - 1]?.total || 1
   );
 
   return (
     <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
       <CardHeader className="pb-2">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <BookOpen className="w-4 h-4 text-primary" />
             <CardTitle className="text-base">Order Book Depth</CardTitle>
           </div>
           <div className="flex items-center gap-2 text-xs">
             <span className="text-muted-foreground">Spread:</span>
             <span className="font-mono text-foreground">${currentBook.spread.toFixed(4)}</span>
           </div>
         </div>
       </CardHeader>
 
       <CardContent className="space-y-3">
         {/* Tranche Tabs */}
         <Tabs value={activeTranche} onValueChange={(v) => setActiveTranche(v as typeof activeTranche)}>
           <TabsList className="grid grid-cols-3 h-8">
             <TabsTrigger value="senior" className="text-xs">Senior</TabsTrigger>
             <TabsTrigger value="junior" className="text-xs">Junior</TabsTrigger>
             <TabsTrigger value="equity" className="text-xs">Equity</TabsTrigger>
           </TabsList>
         </Tabs>
 
         {/* Depth Chart Visualization */}
         <DepthChart orderBook={currentBook} />
 
         {/* Order Book Table */}
         <div className="space-y-1">
           {/* Header */}
           <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/50">
             <span>Total</span>
             <span className="text-center">Size</span>
             <span className="text-right">Bid Price</span>
           </div>
 
           {/* Bids */}
           <AnimatePresence mode="popLayout">
            {currentBook.bids.slice(0, 5).map((level, i) => (
              <div key={`bid-${i}`}><OrderRow level={level} maxTotal={maxTotal} type="bid" /></div>
            ))}
           </AnimatePresence>
 
           {/* Spread indicator */}
           <div className="flex items-center justify-center gap-2 py-1.5 my-1 bg-muted/30 rounded text-xs">
             <TrendingUp className="w-3 h-3 text-success" />
             <span className="font-mono font-medium">${currentBook.midPrice.toFixed(4)}</span>
             <TrendingDown className="w-3 h-3 text-destructive" />
           </div>
 
           {/* Header for asks */}
           <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/50">
             <span>Ask Price</span>
             <span className="text-center">Size</span>
             <span className="text-right">Total</span>
           </div>
 
           {/* Asks */}
           <AnimatePresence mode="popLayout">
            {currentBook.asks.slice(0, 5).map((level, i) => (
              <div key={`ask-${i}`}><OrderRow level={level} maxTotal={maxTotal} type="ask" /></div>
            ))}
           </AnimatePresence>
         </div>
       </CardContent>
     </Card>
   );
 }