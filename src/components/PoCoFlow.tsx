import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Zap, Coins, CheckCircle, FileText, Search, Database, CloudUpload, Lock } from 'lucide-react';
import { PoCoTaskStatus } from '@/lib/multiAgentMockData';

interface StepProps {
  icon: React.ReactNode;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  description: string;
  onStepClick?: (label: string) => void;
}

const Step = ({ icon, label, status, description, onStepClick }: StepProps) => {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isFailed = status === 'failed';

  return (
    <div 
      onClick={() => onStepClick?.(label)}
      className={`flex flex-col items-center text-center space-y-3 relative z-10 ${onStepClick ? 'cursor-pointer group/step-node' : ''}`}
    >
      <motion.div 
        whileHover={onStepClick ? { scale: 1.1, y: -5 } : {}}
        className={`
          w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500
          ${isCompleted ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 
            isActive ? 'bg-blue-500 animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 
            isFailed ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' :
            'bg-white/10 grayscale'}
          ${onStepClick ? 'group-hover/step-node:ring-2 ring-white/20' : ''}
        `}
      >
        {React.cloneElement(icon as React.ReactElement, { 
          className: `w-8 h-8 ${isCompleted || isActive || isFailed ? 'text-white' : 'text-white/40'}` 
        })}
      </motion.div>
      <div className="space-y-1">
        <h4 className={`font-bold transition-colors ${isCompleted || isActive || isFailed ? 'text-white' : 'text-white/40'} ${onStepClick ? 'group-hover/step-node:text-emerald-400' : ''}`}>
          {label}
        </h4>
        <p className="text-[10px] text-white/40 max-w-[120px] leading-tight uppercase tracking-wider font-mono">
          {description}
        </p>
      </div>
    </div>
  );
};

export const PoCoFlow = ({ taskStatus = 'RECEIVED', onStepClick }: { taskStatus?: PoCoTaskStatus, onStepClick?: (label: string) => void }) => {
  const getStatus = (targetStatuses: PoCoTaskStatus[], current: PoCoTaskStatus) => {
    const statusOrder: PoCoTaskStatus[] = [
      'RECEIVED', 'INITIALIZING', 'INITIALIZED', 'RUNNING', 'CONSENSUS_REACHED', 
      'AT_LEAST_ONE_REVEALED', 'RESULT_UPLOADING', 'RESULT_UPLOADED', 'FINALIZING', 'FINALIZED', 'COMPLETED'
    ];
    
    const currentIndex = statusOrder.indexOf(current);
    const targetIndex = Math.max(...targetStatuses.map(s => statusOrder.indexOf(s)));

    if (current.includes('FAILED')) return 'failed';
    if (currentIndex > targetIndex) return 'completed';
    if (targetStatuses.includes(current)) return 'active';
    return 'pending';
  };

  const steps: StepProps[] = [
    { 
      icon: <Search />, 
      label: 'Detection', 
      status: getStatus(['RECEIVED', 'INITIALIZING'], taskStatus),
      description: 'Scheduler detected deal'
    },
    { 
      icon: <Lock />, 
      label: 'Initialization', 
      status: getStatus(['INITIALIZED'], taskStatus),
      description: 'Task initialized on-chain'
    },
    { 
      icon: <Cpu />, 
      label: 'Execution', 
      status: getStatus(['RUNNING'], taskStatus),
      description: 'Workers computing TEE'
    },
    { 
      icon: <Shield />, 
      label: 'Consensus', 
      status: getStatus(['CONSENSUS_REACHED', 'AT_LEAST_ONE_REVEALED'], taskStatus),
      description: 'PoCo Consensus reached'
    },
    { 
      icon: <CloudUpload />, 
      label: 'Uploading', 
      status: getStatus(['RESULT_UPLOADING', 'RESULT_UPLOADED'], taskStatus),
      description: 'Result stored on IPFS'
    },
    { 
      icon: <Coins />, 
      label: 'Finalization', 
      status: getStatus(['FINALIZING', 'FINALIZED', 'COMPLETED'], taskStatus),
      description: 'Payment & Rewards released'
    },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === 'active');
  const lastCompletedIndex = steps.reduce((acc, s, i) => s.status === 'completed' ? i : acc, -1);
  const progressWidth = currentStepIndex !== -1 
    ? (currentStepIndex / (steps.length - 1)) * 100 
    : lastCompletedIndex === steps.length - 1 ? 100 : 0;

  return (
    <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-3xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <CheckCircle className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">iExec PoCo Integrated</span>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-black text-white flex items-center gap-3">
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">PoCo</span> 
          Execution Flow
        </h3>
        <p className="text-white/40 text-sm mt-1">Verifiable Trust Inheritance via Proof-of-Contribution</p>
      </div>

      <div className="flex justify-between items-start relative">
        {/* Progress Bar Background */}
        <div className="absolute top-8 left-0 w-full h-[2px] bg-white/5 -z-0" />
        
        {/* Progress Bar Fill */}
        <motion.div 
          className="absolute top-8 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] -z-0"
          initial={{ width: 0 }}
          animate={{ width: `${progressWidth}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {steps.map((step, index) => (
          <Step key={index} {...step} onStepClick={onStepClick} />
        ))}
      </div>

      <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h5 className="text-white font-bold text-sm">Hardware-Level Security</h5>
            <p className="text-white/50 text-xs mt-1 leading-relaxed">
              CredTrust does not custody your secrets. Every computation is isolated in a 
              <strong> Trusted Execution Environment (TEE)</strong>. Results are cryptographically 
              signed by the hardware and verified by iExec PoCo before any value is exchanged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
