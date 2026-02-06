 import { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Download, Play, Sparkles, ChevronDown } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { DEMO_DATASETS, generateDemoDataset, calculateRiskScore, type DemoFinancialData } from '@/lib/demo-data';
 import { toast } from 'sonner';
 
 interface DemoDatasetPickerProps {
   onSelectDataset?: (data: DemoFinancialData, score: number) => void;
 }
 
 export default function DemoDatasetPicker({ onSelectDataset }: DemoDatasetPickerProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [selectedTier, setSelectedTier] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
   const [generatedData, setGeneratedData] = useState<DemoFinancialData | null>(null);
 
   const handleSelectTier = (tier: 'A' | 'B' | 'C' | 'D') => {
     const data = generateDemoDataset(tier);
     const score = calculateRiskScore(data);
     setSelectedTier(tier);
     setGeneratedData(data);
     setIsOpen(false);
     onSelectDataset?.(data, score);
     toast.success(`Generated ${tier}-tier demo dataset`);
   };
 
   const handleExport = () => {
     if (!generatedData) return;
     const json = JSON.stringify(generatedData, null, 2);
     const blob = new Blob([json], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'credtrust-demo-data.json';
     a.click();
     URL.revokeObjectURL(url);
     toast.success('Demo data exported');
   };
 
   const handleQuickDemo = () => {
     handleSelectTier('A');
   };
 
   return (
     <Card className="border-border bg-card/50 backdrop-blur-sm">
       <CardContent className="p-4 space-y-4">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Sparkles className="w-4 h-4 text-primary" />
             <span className="text-sm font-medium text-foreground">Demo Dataset</span>
           </div>
           {selectedTier && (
             <Badge variant="outline" className="text-xs">
               Tier {selectedTier}
             </Badge>
           )}
         </div>
 
         {/* Tier Selector */}
         <div className="relative">
           <Button
             variant="outline"
             className="w-full justify-between"
             onClick={() => setIsOpen(!isOpen)}
           >
             {selectedTier ? `${DEMO_DATASETS.find(d => d.tier === selectedTier)?.label}` : 'Select Dataset Tier'}
             <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
           </Button>
           
           <AnimatePresence>
             {isOpen && (
               <motion.div
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="absolute top-full left-0 right-0 mt-2 z-10 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
               >
                 {DEMO_DATASETS.map((dataset) => (
                   <button
                     key={dataset.tier}
                     onClick={() => handleSelectTier(dataset.tier)}
                     className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                   >
                     <span className="text-sm text-foreground">{dataset.label}</span>
                     <Badge variant="outline" className={`text-xs ${dataset.color}`}>
                       {dataset.tier}
                     </Badge>
                   </button>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
         </div>
 
         {/* Generated Data Preview */}
         {generatedData && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             className="grid grid-cols-2 gap-2 text-xs"
           >
             <div className="p-2 rounded bg-muted/50">
               <span className="text-muted-foreground">FICO</span>
               <p className="font-semibold text-foreground">{generatedData.fico}</p>
             </div>
             <div className="p-2 rounded bg-muted/50">
               <span className="text-muted-foreground">Income</span>
               <p className="font-semibold text-foreground">${generatedData.income.toLocaleString()}</p>
             </div>
             <div className="p-2 rounded bg-muted/50">
               <span className="text-muted-foreground">Debt</span>
               <p className="font-semibold text-foreground">${generatedData.debt.toLocaleString()}</p>
             </div>
             <div className="p-2 rounded bg-muted/50">
               <span className="text-muted-foreground">Assets</span>
               <p className="font-semibold text-foreground">${generatedData.assets.toLocaleString()}</p>
             </div>
           </motion.div>
         )}
 
         {/* Action Buttons */}
         <div className="flex gap-2">
           <Button
             variant="outline"
             size="sm"
             onClick={handleExport}
             disabled={!generatedData}
             className="flex-1"
           >
             <Download className="w-4 h-4" />
             Export
           </Button>
           <Button
             variant="credtrust"
             size="sm"
             onClick={handleQuickDemo}
             className="flex-1"
           >
             <Play className="w-4 h-4" />
             Quick Demo
           </Button>
         </div>
       </CardContent>
     </Card>
   );
 }