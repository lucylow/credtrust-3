 import { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Lock, Upload, CheckCircle, FileText, Database, Briefcase, ArrowRight, Loader2 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { useRiskEngineStore } from '@/store/riskEngineStore';
 import { encryptData } from '@/utils/encryption';
 import { toast } from 'sonner';
 import { cn } from '@/lib/utils';
 
 const DATA_EXAMPLES = [
   { 
     id: 'credit', 
     label: 'Credit Report', 
     icon: FileText,
     data: { FICO: 720, income: 85000, debt: 12000 } 
   },
   { 
     id: 'bank', 
     label: 'Bank Statements', 
     icon: Database,
     data: { avgBalance: 15000, monthlyIncome: 7500, transactions: 142 } 
   },
   { 
     id: 'employment', 
     label: 'Employment', 
     icon: Briefcase,
     data: { months: 24, salary: 8500, employer: 'Tech Corp' } 
   },
 ];
 
 export function DataProtectorCard() {
   const [selectedData, setSelectedData] = useState(DATA_EXAMPLES[0]);
   const [dragActive, setDragActive] = useState(false);
   const [isProtecting, setIsProtecting] = useState(false);
   const { setProtectedData, protectedDataAddress, nextStep } = useRiskEngineStore();
 
   const handleProtect = async () => {
     setIsProtecting(true);
     try {
       // Simulate encryption delay
       await new Promise(resolve => setTimeout(resolve, 1500));
       const encrypted = await encryptData(JSON.stringify(selectedData.data));
       const mockAddress = `0x${encrypted.hash.slice(0, 40)}`;
       setProtectedData(mockAddress, encrypted.hash);
       toast.success('Data encrypted and protected!');
       
       // Auto-advance after short delay
       setTimeout(() => nextStep(), 500);
     } catch (error) {
       toast.error('Encryption failed');
     } finally {
       setIsProtecting(false);
     }
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="glass-card overflow-hidden"
     >
       {/* Header */}
       <div className="p-6 border-b border-border/50">
         <div className="flex items-center gap-3">
           <div className="p-3 rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
             <Lock className="w-6 h-6 text-emerald-500" />
           </div>
           <div>
             <h3 className="text-xl font-semibold text-foreground">Protect Your Financial Data</h3>
             <p className="text-sm text-muted-foreground">Client-side AES-256-GCM encryption</p>
           </div>
         </div>
       </div>
 
       <div className="p-6 space-y-6">
         {/* Data Selection */}
         <div className="grid grid-cols-3 gap-3">
           {DATA_EXAMPLES.map((example) => {
             const Icon = example.icon;
             const isSelected = selectedData.id === example.id;
             return (
               <motion.button
                 key={example.id}
                 onClick={() => setSelectedData(example)}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className={cn(
                   'p-4 rounded-xl border-2 transition-all text-left',
                   isSelected
                     ? 'border-emerald-500 bg-emerald-500/10'
                     : 'border-border hover:border-muted-foreground/30'
                 )}
               >
                 <Icon className={cn(
                   'w-5 h-5 mb-2',
                   isSelected ? 'text-emerald-500' : 'text-muted-foreground'
                 )} />
                 <p className={cn(
                   'font-medium text-sm',
                   isSelected ? 'text-foreground' : 'text-muted-foreground'
                 )}>
                   {example.label}
                 </p>
               </motion.button>
             );
           })}
         </div>
 
         {/* Data Preview */}
         <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
           <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Data Preview</p>
           <pre className="text-sm text-foreground font-mono overflow-x-auto">
             {JSON.stringify(selectedData.data, null, 2)}
           </pre>
         </div>
 
         {/* Drag & Drop Zone */}
         <motion.div
           onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
           onDragLeave={() => setDragActive(false)}
           onDragOver={(e) => e.preventDefault()}
           onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
           animate={{ 
             borderColor: dragActive ? 'hsl(var(--primary))' : 'hsl(var(--border))',
             backgroundColor: dragActive ? 'hsl(var(--primary) / 0.05)' : 'transparent'
           }}
           className="p-8 rounded-xl border-2 border-dashed text-center cursor-pointer hover:border-primary/50 transition-colors"
         >
           <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
           <p className="text-sm text-muted-foreground">
             Or drag your CSV/JSON file here
           </p>
           <p className="text-xs text-muted-foreground/70 mt-1">
             Data is encrypted locally before upload
           </p>
         </motion.div>
 
         {/* Action Button */}
         <div className="flex items-center gap-4">
           <Button
             onClick={handleProtect}
             disabled={isProtecting || !!protectedDataAddress}
             className="flex-1 h-12 text-base font-semibold"
             size="lg"
           >
             {isProtecting ? (
               <>
                 <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                 Encrypting...
               </>
             ) : protectedDataAddress ? (
               <>
                 <CheckCircle className="w-5 h-5 mr-2" />
                 Data Protected
               </>
             ) : (
               <>
                 🔒 Protect & Encrypt
                 <ArrowRight className="w-5 h-5 ml-2" />
               </>
             )}
           </Button>
         </div>
 
         {/* Protected Address Display */}
         <AnimatePresence>
           {protectedDataAddress && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
             >
               <div className="flex items-center gap-2 text-emerald-400">
                 <CheckCircle className="w-4 h-4" />
                 <span className="text-sm font-medium">Protected Address</span>
               </div>
               <p className="mt-1 text-xs font-mono text-muted-foreground truncate">
                 {protectedDataAddress}
               </p>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     </motion.div>
   );
 }