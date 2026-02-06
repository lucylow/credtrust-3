 import { motion, AnimatePresence } from 'framer-motion';
 import { useRiskEngineStore } from '@/store/riskEngineStore';
 import { RiskScoreHero } from './RiskScoreHero';
 import { WorkflowSteps } from './WorkflowSteps';
 import { DataProtectorCard } from './DataProtectorCard';
 import { TEEExecutionCard } from './TEEExecutionCard';
 import { ProofGeneratorCard } from './ProofGeneratorCard';
 import { LoanNFTCard } from './LoanNFTCard';
 import { Button } from '@/components/ui/button';
 import { RotateCcw } from 'lucide-react';
import DemoDatasetPicker from '@/components/demo/DemoDatasetPicker';
 
 export function RiskEngineDashboard() {
  const { step, reset, setRiskScore, setStep } = useRiskEngineStore();

  const handleDemoSelect = (_data: any, score: number) => {
    setRiskScore(score);
    setStep(1);
  };
 
   return (
     <div className="space-y-6 lg:space-y-8">
       {/* Header */}
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl lg:text-3xl font-bold font-display text-foreground">
             Risk Engine
           </h1>
           <p className="text-muted-foreground">
             Confidential credit scoring powered by iExec TEE
           </p>
         </div>
         <Button variant="outline" size="sm" onClick={reset}>
           <RotateCcw className="w-4 h-4 mr-2" />
           Reset
         </Button>
       </div>
 
      {/* Risk Score Hero + Demo Picker */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskScoreHero />
        </div>
        <div>
          <DemoDatasetPicker onSelectDataset={handleDemoSelect} />
        </div>
      </div>
 
       {/* Workflow Steps */}
       <WorkflowSteps />
 
       {/* Current Step Content */}
       <AnimatePresence mode="wait">
         <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.3 }}
         >
           {step === 0 && <DataProtectorCard />}
           {step === 1 && <TEEExecutionCard />}
           {step === 2 && <ProofGeneratorCard />}
           {step === 3 && <LoanNFTCard />}
         </motion.div>
       </AnimatePresence>
     </div>
   );
 }