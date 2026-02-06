import { motion } from 'framer-motion';
import { AgentStatus } from '@/lib/mockData';

interface AgentCardProps {
  agent: AgentStatus;
}

export function AgentCard({ agent }: AgentCardProps) {
  const getStatusColor = (status: AgentStatus['status']) => {
    return {
      idle: 'bg-emerald-500/20 border-emerald-500/40 ring-emerald-500/30',
      analyzing: 'bg-blue-500/20 border-blue-500/40 ring-blue-500/30',
      'waiting-hitl': 'bg-amber-500/20 border-amber-500/40 ring-amber-500/30',
      completed: 'bg-emerald-500/20 border-emerald-500/40 ring-emerald-500/30',
      error: 'bg-red-500/20 border-red-500/40 ring-red-500/30'
    }[status];
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`
        relative p-8 rounded-3xl border-2 backdrop-blur-xl shadow-2xl group
        ${getStatusColor(agent.status)}
        hover:border-emerald-400/70 hover:shadow-emerald-500/25
        transition-all duration-300 overflow-hidden
      `}
    >
      {/* Status Badge */}
      <div className="absolute -top-3 -right-3 bg-white/90 px-4 py-1 rounded-full text-xs font-bold text-slate-900 shadow-lg">
        {agent.status.toUpperCase()}
      </div>

      {/* Agent Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`
            w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg
            ${agent.type === 'credit' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
              agent.type === 'lending' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
              agent.type === 'risk' ? 'bg-gradient-to-r from-orange-500 to-red-600' :
              'bg-gradient-to-r from-purple-500 to-pink-600'}
          `}>
            <span className="text-2xl font-bold text-white">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-xl text-white">{agent.name}</h3>
            <p className="text-sm text-white/70 capitalize">{agent.type}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-black text-emerald-400">
            {agent.confidence ? `${Math.round(agent.confidence * 100)}%` : '-'}
          </div>
          {agent.framework && (
            <div className="text-xs bg-black/50 px-2 py-1 rounded mt-1 font-mono">
              {agent.framework}
            </div>
          )}
        </div>
      </div>

      {/* Task Info */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></span>
          <span className="text-white/80 truncate">{agent.task}</span>
        </div>
        
        {agent.wallet && (
          <div className="text-xs font-mono bg-black/30 px-3 py-2 rounded-xl truncate">
            {agent.wallet.slice(0, 6)}...{agent.wallet.slice(-4)}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${agent.progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* Score + MRENCLAVE */}
      {agent.score && (
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/20 rounded-2xl">
          <div className="text-center">
            <div className="text-3xl font-black text-emerald-400">{agent.score}</div>
            <div className={`text-sm font-bold px-3 py-1 rounded-full mt-1 ${
              agent.tier === 'A' ? 'bg-emerald-500/90 text-white' :
              agent.tier === 'B' ? 'bg-blue-500/90 text-white' :
              agent.tier === 'C' ? 'bg-amber-500/90 text-white' : 'bg-red-500/90 text-white'
            }`}>
              {agent.tier}-Tier
            </div>
          </div>
          {agent.mrenclave && (
            <div className="text-xs font-mono text-white/60 truncate">
              {agent.mrenclave.slice(0, 16)}...
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-white/20">
        {agent.status === 'waiting-hitl' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-emerald-500/90 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
          >
            ✅ APPROVE
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="flex-1 bg-slate-600/90 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
        >
          📋 Details
        </motion.button>
      </div>
    </motion.div>
  );
}
