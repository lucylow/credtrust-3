 import { motion } from 'framer-motion';
 import { Lock, Shield, Zap, Sparkles, Check } from 'lucide-react';
 import { useRiskEngineStore, WorkflowStep } from '@/store/riskEngineStore';
 import { cn } from '@/lib/utils';
 
 const STEPS = [
   { id: 0, title: 'Protect Data', icon: Lock, description: 'Encrypt & upload' },
   { id: 1, title: 'TEE Execution', icon: Shield, description: 'Secure compute' },
   { id: 2, title: 'ZK Proof', icon: Zap, description: '300ms proving' },
   { id: 3, title: 'Loan NFT', icon: Sparkles, description: 'Mint credential' },
 ] as const;
 
 export function WorkflowSteps() {
   const { step, setStep } = useRiskEngineStore();
 
   return (
     <div className="glass-card p-4">
       <div className="flex items-center justify-between">
         {STEPS.map((s, index) => {
           const Icon = s.icon;
           const isCompleted = step > s.id;
           const isCurrent = step === s.id;
           const isUpcoming = step < s.id;
 
           return (
             <div key={s.id} className="flex items-center flex-1">
               <motion.button
                 onClick={() => isCompleted && setStep(s.id as WorkflowStep)}
                 whileHover={isCompleted ? { scale: 1.05 } : {}}
                 whileTap={isCompleted ? { scale: 0.95 } : {}}
                 className={cn(
                   'relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
                   isCurrent && 'bg-primary/10',
                   isCompleted && 'cursor-pointer hover:bg-primary/5',
                   isUpcoming && 'opacity-50'
                 )}
               >
                 <motion.div
                   initial={false}
                   animate={{
                     scale: isCurrent ? 1.1 : 1,
                     backgroundColor: isCompleted 
                       ? 'hsl(var(--success))' 
                       : isCurrent 
                         ? 'hsl(var(--primary))' 
                         : 'hsl(var(--muted))',
                   }}
                   className="relative w-12 h-12 rounded-xl flex items-center justify-center"
                 >
                   {isCompleted ? (
                     <Check className="w-5 h-5 text-success-foreground" />
                   ) : (
                     <Icon className={cn(
                       'w-5 h-5',
                       isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'
                     )} />
                   )}
                   
                   {isCurrent && (
                     <motion.div
                       layoutId="stepIndicator"
                       className="absolute inset-0 rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-background"
                     />
                   )}
                 </motion.div>
 
                 <div className="text-center">
                   <p className={cn(
                     'text-sm font-medium',
                     isCurrent ? 'text-foreground' : 'text-muted-foreground'
                   )}>
                     {s.title}
                   </p>
                   <p className="text-xs text-muted-foreground hidden sm:block">
                     {s.description}
                   </p>
                 </div>
               </motion.button>
 
               {index < STEPS.length - 1 && (
                 <div className="flex-1 h-0.5 mx-2">
                   <motion.div
                     initial={{ scaleX: 0 }}
                     animate={{ scaleX: isCompleted ? 1 : 0 }}
                     className="h-full bg-success origin-left"
                     transition={{ duration: 0.3 }}
                   />
                   <div className="h-full bg-muted -mt-0.5" />
                 </div>
               )}
             </div>
           );
         })}
       </div>
     </div>
   );
 }