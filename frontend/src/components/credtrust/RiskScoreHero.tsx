 import { motion } from 'framer-motion';
 import { Shield, TrendingUp, Award } from 'lucide-react';
 import { useRiskEngineStore } from '@/store/riskEngineStore';
 
 const tierColors = {
   A: { bg: 'from-emerald-500/20 to-emerald-600/10', ring: 'ring-emerald-500/50', text: 'text-emerald-400' },
   B: { bg: 'from-blue-500/20 to-blue-600/10', ring: 'ring-blue-500/50', text: 'text-blue-400' },
   C: { bg: 'from-amber-500/20 to-amber-600/10', ring: 'ring-amber-500/50', text: 'text-amber-400' },
   D: { bg: 'from-red-500/20 to-red-600/10', ring: 'ring-red-500/50', text: 'text-red-400' },
 };
 
 export function RiskScoreHero() {
   const { riskScore, riskTier, teeStatus } = useRiskEngineStore();
   const colors = tierColors[riskTier];
 
   return (
     <motion.div
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       className="relative overflow-hidden"
     >
       <div className={`glass-card p-8 bg-gradient-to-br ${colors.bg}`}>
         {/* Animated background orbs */}
         <div className="absolute inset-0 overflow-hidden">
           <motion.div
             animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl"
           />
         </div>
 
         <div className="relative flex items-center justify-between">
           <div className="space-y-4">
             <div className="flex items-center gap-3">
               <div className="p-3 rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                 <Shield className="w-6 h-6 text-primary" />
               </div>
               <div>
                 <p className="text-sm text-muted-foreground">Confidential Risk Score</p>
                 <h2 className="text-lg font-semibold text-foreground">TEE-Verified Assessment</h2>
               </div>
             </div>
 
             <div className="flex items-baseline gap-4">
               <motion.span
                 key={riskScore}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-6xl font-bold font-display text-foreground"
               >
                 {riskScore || '---'}
               </motion.span>
               
               {riskScore > 0 && (
                 <motion.div
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={`flex items-center gap-1 px-3 py-1 rounded-full ring-2 ${colors.ring} ${colors.text}`}
                 >
                   <Award className="w-4 h-4" />
                   <span className="font-semibold">Tier {riskTier}</span>
                 </motion.div>
               )}
             </div>
 
             <div className="flex items-center gap-4 text-sm text-muted-foreground">
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${teeStatus.enclave === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-muted'}`} />
                 <span>Enclave {teeStatus.enclave}</span>
               </div>
               {teeStatus.processingTime > 0 && (
                 <div className="flex items-center gap-1">
                   <TrendingUp className="w-4 h-4" />
                   <span>{teeStatus.processingTime}ms processing</span>
                 </div>
               )}
             </div>
           </div>
 
           {/* Score Ring Visualization */}
           <div className="relative w-40 h-40">
             <svg className="w-full h-full -rotate-90">
               <circle
                 cx="80" cy="80" r="70"
                 fill="none"
                 stroke="hsl(var(--muted))"
                 strokeWidth="8"
               />
               <motion.circle
                 cx="80" cy="80" r="70"
                 fill="none"
                 stroke="hsl(var(--primary))"
                 strokeWidth="8"
                 strokeLinecap="round"
                 strokeDasharray={440}
                 initial={{ strokeDashoffset: 440 }}
                 animate={{ strokeDashoffset: 440 - (440 * (riskScore / 850)) }}
                 transition={{ duration: 1.5, ease: 'easeOut' }}
               />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-2xl font-bold text-foreground">
                 {riskScore > 0 ? `${Math.round((riskScore / 850) * 100)}%` : '—'}
               </span>
             </div>
           </div>
         </div>
       </div>
     </motion.div>
   );
 }