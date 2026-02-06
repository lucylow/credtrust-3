import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, PoCoTaskStatus, PoCoReplicateStatus } from '@/lib/multiAgentMockData';
import { Terminal, Shield, Cpu, Activity, AlertCircle, X, ChevronRight, Info } from 'lucide-react';

interface PoCoDebugProps {
  task: Task;
  onClose: () => void;
}

export const PoCoDebug = ({ task, onClose }: PoCoDebugProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">PoCo Debug Console</h2>
              <p className="text-xs text-white/40 font-mono">iexec task debug {task.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white/60" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* On-Chain / Off-Chain Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">On-Chain Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">Task Status</span>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 
                    task.status.includes('FAILED') ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40">Deal ID</span>
                  <span className="text-white font-mono">{task.sessionId.slice(0, 12)}...</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40">Task ID</span>
                  <span className="text-white font-mono">{task.id}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Off-Chain Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40">Consensus Status</span>
                  <span className="text-white font-bold">
                    {['CONSENSUS_REACHED', 'AT_LEAST_ONE_REVEALED', 'RESULT_UPLOADING', 'RESULT_UPLOADED', 'FINALIZING', 'FINALIZED', 'COMPLETED'].includes(task.status) ? 'Reached' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40">Active Replicates</span>
                  <span className="text-white font-bold">{task.timeline.length}</span>
                </div>
                {task.failureCause && (
                  <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] text-red-400 font-bold uppercase">Failure Detected</span>
                    <span className="text-xs text-red-400 font-mono break-all">{task.failureCause}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Replicates Detailed View */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Replicate Audit Trail</h3>
            </div>
            
            <div className="space-y-4">
              {task.timeline.map((step, idx) => (
                <div key={idx} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-emerald-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/10">
                        <span className="text-xl">🤖</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{step.step}</div>
                        <div className="text-[10px] text-white/40 font-mono uppercase">Worker: {step.agentId}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      step.status.includes('FAILED') ? 'bg-red-500/20 text-red-400' :
                      ['COMPLETED', 'COMPUTED', 'CONTRIBUTED', 'REVEALED', 'RESULT_UPLOADED'].includes(step.status) ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-blue-500/20 text-blue-400 animate-pulse'
                    }`}>
                      {step.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-2 bg-black/20 rounded-lg">
                      <div className="text-[9px] text-white/40 uppercase mb-1">Time</div>
                      <div className="text-xs text-white font-mono">{new Date(step.timestamp).toLocaleTimeString()}</div>
                    </div>
                    <div className="p-2 bg-black/20 rounded-lg col-span-2">
                      <div className="text-[9px] text-white/40 uppercase mb-1">Status Info</div>
                      <div className="text-xs text-white/70">
                        {step.status === 'COMPUTING' ? 'Processing TEE Enclave workload...' : 
                         step.status === 'COMPUTED' ? 'Workload finished, waiting for contribution instruction.' :
                         step.status === 'CONTRIBUTED' ? 'Result digest submitted on Arbitrum.' :
                         step.status.includes('FAILED') ? `Execution failed: ${step.failureCause || 'Unknown error'}` :
                         'Awaiting next transition...'}
                      </div>
                    </div>
                  </div>

                  {step.failureCause && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] font-bold text-red-400 uppercase">Worker Failure Log</div>
                        <div className="text-xs text-red-400 font-mono mt-1 leading-relaxed">
                          {step.failureCause}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Debugging Tip</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                If a task is stuck in <code className="text-blue-300">RUNNING</code>, check the individual worker logs. 
                Common issues include TEE enclave initialization failures or dataset download timeouts.
                Use <code className="text-blue-300">--logs</code> to see the full application output.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/10"
          >
            Close Console
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
