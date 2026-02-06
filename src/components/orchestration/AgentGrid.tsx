import { motion } from 'framer-motion';
import { Agent } from '@/lib/multiAgentMockData';

interface AgentGridProps {
  agents: Agent[];
}

export function AgentGrid({ agents }: AgentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {agents.map((agent, i) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
        >
          <div className="flex items-start gap-4 relative z-10">
            <div className="text-4xl bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">
              {agent.avatar}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{agent.name}</h3>
                  <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">{agent.type}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                  agent.status === 'executing' ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' :
                  agent.status === 'waiting-hitl' ? 'bg-amber-500/20 text-amber-400' :
                  agent.status === 'planning' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-white/10 text-white/60'
                }`}>
                  {agent.status.replace('-', ' ')}
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Confidence</span>
                  <span className="text-white font-mono">{(agent.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.confidence * 100}%` }}
                    className={`h-full bg-gradient-to-r ${
                      agent.confidence > 0.9 ? 'from-emerald-400 to-emerald-600' : 
                      agent.confidence > 0.8 ? 'from-blue-400 to-blue-600' : 
                      'from-amber-400 to-amber-600'
                    }`}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {agent.capabilities.slice(0, 3).map(cap => (
                  <span key={cap} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-white/70">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {agent.framework && (
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px]">
              <span className="text-white/30 font-mono">{agent.framework}</span>
              <span className="text-white/30">Priority: {agent.priority}</span>
            </div>
          )}

          {/* Decorative background element */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
        </motion.div>
      ))}
    </div>
  );
}
