 import { useEffect, useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Zap, CheckCircle, Loader2, Copy, ExternalLink } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { useRiskEngineStore } from '@/store/riskEngineStore';
 import { toast } from 'sonner';
 
 export function ProofGeneratorCard() {
   const [proofTime, setProofTime] = useState(0);
   const { proofStatus, proofProgress, setProofStatus, setProofProgress, riskTier, nextStep } = useRiskEngineStore();
   const [proofHash, setProofHash] = useState<string | null>(null);
 
   const handleGenerateProof = async () => {
     setProofStatus('generating');
     setProofProgress(0);
     setProofTime(0);
 
     const startTime = Date.now();
     const targetTime = 300; // 300ms proving time
 
     // Animate progress to match 300ms
     const interval = setInterval(() => {
       const elapsed = Date.now() - startTime;
       setProofTime(Math.min(elapsed, targetTime));
       setProofProgress(Math.min((elapsed / targetTime) * 100, 100));
 
       if (elapsed >= targetTime) {
         clearInterval(interval);
         setProofStatus('complete');
         setProofHash(`0x${Array.from({ length: 64 }, () => 
           Math.floor(Math.random() * 16).toString(16)
         ).join('')}`);
         toast.success('Groth16 proof generated!');
         setTimeout(() => nextStep(), 500);
       }
     }, 16);
   };
 
   const copyProofHash = () => {
     if (proofHash) {
       navigator.clipboard.writeText(proofHash);
       toast.success('Proof hash copied!');
     }
   };
 
   // Ring progress calculation
   const circumference = 2 * Math.PI * 70;
   const strokeDashoffset = circumference - (proofProgress / 100) * circumference;
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="glass-card overflow-hidden"
     >
       {/* Header */}
       <div className="p-6 border-b border-border/50">
         <div className="flex items-center gap-3">
           <div className="p-3 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
             <Zap className="w-6 h-6 text-indigo-500" />
           </div>
           <div>
             <h3 className="text-xl font-semibold text-foreground">Generate ZK Proof</h3>
             <p className="text-sm text-muted-foreground">
               Prove "score ∈ Tier {riskTier}" in 300ms
             </p>
           </div>
         </div>
       </div>
 
       <div className="p-6 space-y-6">
         {/* Progress Ring */}
         <div className="flex justify-center">
           <div className="relative w-48 h-48">
             <svg className="w-full h-full -rotate-90">
               {/* Background ring */}
               <circle
                 cx="96"
                 cy="96"
                 r="70"
                 fill="none"
                 stroke="hsl(var(--muted))"
                 strokeWidth="8"
               />
               {/* Progress ring */}
               <motion.circle
                 cx="96"
                 cy="96"
                 r="70"
                 fill="none"
                 stroke="hsl(var(--primary))"
                 strokeWidth="8"
                 strokeLinecap="round"
                 strokeDasharray={circumference}
                 initial={{ strokeDashoffset: circumference }}
                 animate={{ strokeDashoffset }}
                 transition={{ duration: 0.05 }}
               />
             </svg>
             
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <motion.span
                 key={proofTime}
                 className="text-4xl font-bold font-display text-foreground"
               >
                 {proofTime}
               </motion.span>
               <span className="text-sm text-muted-foreground">milliseconds</span>
             </div>
           </div>
         </div>
 
         {/* Proof Info */}
         <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
           <div className="flex items-center justify-between text-sm">
             <span className="text-muted-foreground">Circuit</span>
             <span className="font-mono text-foreground">Groth16</span>
           </div>
           <div className="flex items-center justify-between text-sm">
             <span className="text-muted-foreground">Statement</span>
             <span className="font-mono text-foreground">score ∈ [{riskTier === 'A' ? '750-850' : riskTier === 'B' ? '700-749' : riskTier === 'C' ? '650-699' : '300-649'}]</span>
           </div>
           <div className="flex items-center justify-between text-sm">
             <span className="text-muted-foreground">Curve</span>
             <span className="font-mono text-foreground">BN254</span>
           </div>
         </div>
 
         {/* Proof Hash */}
         <AnimatePresence>
           {proofHash && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
             >
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2 text-emerald-400">
                   <CheckCircle className="w-4 h-4" />
                   <span className="text-sm font-medium">Proof Generated</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <button onClick={copyProofHash} className="p-1 hover:bg-emerald-500/20 rounded">
                     <Copy className="w-4 h-4 text-emerald-400" />
                   </button>
                   <button className="p-1 hover:bg-emerald-500/20 rounded">
                     <ExternalLink className="w-4 h-4 text-emerald-400" />
                   </button>
                 </div>
               </div>
               <p className="text-xs font-mono text-muted-foreground truncate">
                 {proofHash}
               </p>
             </motion.div>
           )}
         </AnimatePresence>
 
         {/* Action Button */}
         <Button
           onClick={handleGenerateProof}
           disabled={proofStatus === 'generating' || proofStatus === 'complete'}
           className="w-full h-12 text-base font-semibold"
           size="lg"
         >
           {proofStatus === 'generating' ? (
             <>
               <Loader2 className="w-5 h-5 mr-2 animate-spin" />
               Proving...
             </>
           ) : proofStatus === 'complete' ? (
             <>
               <CheckCircle className="w-5 h-5 mr-2" />
               Proof Ready
             </>
           ) : (
             <>
               <Zap className="w-5 h-5 mr-2" />
               Generate Groth16 Proof
             </>
           )}
         </Button>
       </div>
     </motion.div>
   );
 }