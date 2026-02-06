import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TDXJob {
  taskId: string;
  agent: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  mrenclave: string;
  score?: number;
}

export function EnclaveMonitor() {
  const [jobs, setJobs] = useState<TDXJob[]>([
    {
        taskId: '0xabc123...',
        agent: 'Credit Scorer',
        status: 'COMPLETED',
        mrenclave: '0x789def...',
        score: 742
    },
    {
        taskId: '0xdef456...',
        agent: 'Risk Monitor',
        status: 'RUNNING',
        mrenclave: '0x456ghi...'
    }
  ]);

  useEffect(() => {
    // Real-time TDX monitoring simulation
    const interval = setInterval(() => {
        // Mocking real-time updates
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6">
      {jobs.map((job) => (
        <motion.div 
          key={job.taskId}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-slate-800/70 to-blue-900/70 border border-white/20 backdrop-blur-xl group hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full animate-ping ${statusColor(job.status)}`} />
            <span className="font-bold text-white">{job.agent}</span>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Task</span>
              <code className="font-mono text-xs bg-black/40 px-2 py-1 rounded">
                {job.taskId.slice(0, 10)}...
              </code>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">TDX Enclave</span>
              <span className="font-mono text-emerald-400 text-xs">
                {job.mrenclave.slice(0, 16)}...
              </span>
            </div>
          </div>
          
          {job.score && (
            <div className="text-3xl font-black text-emerald-400 text-center mb-4">
              {job.score}
            </div>
          )}
          
          <div className={`h-2 rounded-full overflow-hidden bg-white/20`}>
            <motion.div 
              className={`h-full rounded-full ${statusColor(job.status)}`}
              initial={{ width: 0 }}
              animate={{ width: job.status === 'COMPLETED' ? '100%' : '60%' }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function statusColor(status: string) {
    switch (status) {
        case 'COMPLETED': return 'bg-emerald-400';
        case 'RUNNING': return 'bg-blue-400';
        case 'FAILED': return 'bg-red-400';
        default: return 'bg-slate-400';
    }
}
