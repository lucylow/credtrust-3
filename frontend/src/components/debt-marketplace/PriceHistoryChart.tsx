 import { useState, useMemo } from 'react';
 import { motion } from 'framer-motion';
 import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
 import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Badge } from '@/components/ui/badge';
 
 interface PricePoint {
   timestamp: number;
   open: number;
   high: number;
   low: number;
   close: number;
   volume: number;
 }
 
 interface PriceHistoryChartProps {
   tranche: 'senior' | 'junior' | 'equity';
   currentPrice: number;
 }
 
 const TRANCHE_COLORS = {
   senior: { main: 'hsl(var(--chart-1))', gradient: 'hsl(var(--chart-1) / 0.2)' },
   junior: { main: 'hsl(var(--chart-2))', gradient: 'hsl(var(--chart-2) / 0.2)' },
   equity: { main: 'hsl(var(--chart-3))', gradient: 'hsl(var(--chart-3) / 0.2)' },
 };
 
 const VOLATILITY = { senior: 0.002, junior: 0.008, equity: 0.02 };
 const BASE_PRICES = { senior: 1.02, junior: 0.98, equity: 1.12 };
 
 function generateHistoricalData(tranche: 'senior' | 'junior' | 'equity', timeframe: '24h' | '7d' | '30d'): PricePoint[] {
   const now = Date.now();
   const intervals = { '24h': 24, '7d': 7 * 24, '30d': 30 * 24 };
   const stepMs = { '24h': 3600000, '7d': 3600000, '30d': 86400000 };
   
   const points = intervals[timeframe];
   const step = stepMs[timeframe];
   const volatility = VOLATILITY[tranche];
   let price = BASE_PRICES[tranche];
   
   const data: PricePoint[] = [];
   
   for (let i = points; i >= 0; i--) {
     const change = (Math.random() - 0.48) * volatility * 2;
     price = Math.max(0.8, Math.min(1.5, price * (1 + change)));
     
     const high = price * (1 + Math.random() * volatility);
     const low = price * (1 - Math.random() * volatility);
     const open = low + Math.random() * (high - low);
     const close = low + Math.random() * (high - low);
     
     data.push({
       timestamp: now - i * step,
       open,
       high,
       low,
       close,
       volume: Math.floor(Math.random() * 500000 + 100000),
     });
   }
   
   return data;
 }
 
 function formatTime(timestamp: number, timeframe: '24h' | '7d' | '30d'): string {
   const date = new Date(timestamp);
   if (timeframe === '24h') {
     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
   }
   if (timeframe === '7d') {
     return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit' });
   }
   return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
 }
 
 export default function PriceHistoryChart({ tranche, currentPrice }: PriceHistoryChartProps) {
   const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
   
   const data = useMemo(() => generateHistoricalData(tranche, timeframe), [tranche, timeframe]);
   const colors = TRANCHE_COLORS[tranche];
   
   const priceChange = data.length > 1 
     ? ((data[data.length - 1].close - data[0].close) / data[0].close) * 100 
     : 0;
   const isPositive = priceChange >= 0;
   
   const minPrice = Math.min(...data.map(d => d.low)) * 0.995;
   const maxPrice = Math.max(...data.map(d => d.high)) * 1.005;
 
   return (
     <Card className="bg-card/50 backdrop-blur-sm border-border/50">
       <CardHeader className="pb-2">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <BarChart3 className="w-4 h-4 text-muted-foreground" />
             <CardTitle className="text-sm font-medium capitalize">
               {tranche} Price History
             </CardTitle>
           </div>
           <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as '24h' | '7d' | '30d')}>
             <TabsList className="h-7 bg-muted/50">
               <TabsTrigger value="24h" className="text-xs px-2 h-5">24H</TabsTrigger>
               <TabsTrigger value="7d" className="text-xs px-2 h-5">7D</TabsTrigger>
               <TabsTrigger value="30d" className="text-xs px-2 h-5">30D</TabsTrigger>
             </TabsList>
           </Tabs>
         </div>
         
         <div className="flex items-center gap-3 mt-2">
           <span className="text-2xl font-bold text-foreground">
             ${currentPrice.toFixed(4)}
           </span>
           <Badge 
             variant="outline" 
             className={`text-xs ${isPositive ? 'text-success border-success/30 bg-success/10' : 'text-destructive border-destructive/30 bg-destructive/10'}`}
           >
             {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
             {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
           </Badge>
         </div>
       </CardHeader>
       
       <CardContent className="pt-0">
         <motion.div
           key={`${tranche}-${timeframe}`}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.3 }}
           className="h-[180px] w-full"
         >
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id={`gradient-${tranche}`} x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor={colors.main} stopOpacity={0.4} />
                   <stop offset="100%" stopColor={colors.main} stopOpacity={0} />
                 </linearGradient>
               </defs>
               <XAxis 
                 dataKey="timestamp" 
                 tickFormatter={(t) => formatTime(t, timeframe)}
                 tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                 axisLine={false}
                 tickLine={false}
                 interval="preserveStartEnd"
               />
               <YAxis 
                 domain={[minPrice, maxPrice]}
                 tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                 tickFormatter={(v) => `$${v.toFixed(2)}`}
                 axisLine={false}
                 tickLine={false}
                 width={45}
               />
               <Tooltip
                 content={({ active, payload }) => {
                   if (!active || !payload?.length) return null;
                   const d = payload[0].payload as PricePoint;
                   return (
                     <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg text-xs">
                       <div className="text-muted-foreground mb-1">
                         {new Date(d.timestamp).toLocaleString()}
                       </div>
                       <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                         <span className="text-muted-foreground">Open:</span>
                         <span className="font-mono text-foreground">${d.open.toFixed(4)}</span>
                         <span className="text-muted-foreground">High:</span>
                         <span className="font-mono text-success">${d.high.toFixed(4)}</span>
                         <span className="text-muted-foreground">Low:</span>
                         <span className="font-mono text-destructive">${d.low.toFixed(4)}</span>
                         <span className="text-muted-foreground">Close:</span>
                         <span className="font-mono text-foreground">${d.close.toFixed(4)}</span>
                       </div>
                     </div>
                   );
                 }}
               />
               <Area
                 type="monotone"
                 dataKey="close"
                 stroke={colors.main}
                 strokeWidth={2}
                 fill={`url(#gradient-${tranche})`}
               />
             </AreaChart>
           </ResponsiveContainer>
         </motion.div>
       </CardContent>
     </Card>
   );
 }