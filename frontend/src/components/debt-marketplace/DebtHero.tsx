 import { motion } from 'framer-motion';
 import { TrendingUp, ArrowRight } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 interface DebtHeroProps {
   totalPool: number;
 }
 
 export default function DebtHero({ totalPool }: DebtHeroProps) {
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card/80 to-primary/10 border border-border p-6 lg:p-8 mb-8"
     >
       {/* Background glow */}
       <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
       
       <div className="relative z-10">
         <div className="flex items-center gap-3 mb-4">
           <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
             <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
             LIVE
           </span>
           <span className="text-muted-foreground text-sm">
             24h Volume: <span className="text-foreground font-semibold">${totalPool.toLocaleString()}</span>
           </span>
         </div>
 
         <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
           Debt Tranches
         </h1>
         
         <p className="text-muted-foreground max-w-2xl mb-6">
           Dynamic senior/junior/equity positions as NFTs with institutional-grade 
           HSM key management and real-time Discord alerting.
         </p>
 
         <div className="flex flex-wrap gap-3">
           <Button variant="hero" size="lg">
             <TrendingUp className="w-5 h-5" />
             Enter Marketplace
           </Button>
           <Button variant="heroOutline" size="lg">
             View Ops Dashboard
             <ArrowRight className="w-4 h-4" />
           </Button>
         </div>
       </div>
     </motion.div>
   );
 }