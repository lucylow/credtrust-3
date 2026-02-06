import { motion } from 'framer-motion';
import { Task } from '@/lib/multiAgentMockData';

interface TaskGridProps {
  tasks: Task[];
}

export function TaskGrid({ tasks }: TaskGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task, i) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all group flex flex-col h-full"
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
              task.status === 'executing' ? 'bg-emerald-500/20 text-emerald-400' :
              task.status === 'hitl-pending' ? 'bg-amber-500/20 text-amber-400' :
              task.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
              'bg-white/10 text-white/60'
            }`}>
              {task.status.replace('-', ' ')}
            </div>
            <span className="text-white/30 font-mono text-xs">#{task.id.slice(-6)}</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-emerald-400 transition-colors">
            {task.goal}
          </h3>

          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
              <span className="text-xs text-white/40 font-medium">Primary Route</span>
              <span className="text-xs text-white font-bold">{task.route.primaryAgent}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                <div className="text-[10px] text-white/40 uppercase mb-1">Cost</div>
                <div className="text-sm font-black text-emerald-400">{task.metrics.estimatedCost.toFixed(3)} RLC</div>
              </div>
              <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                <div className="text-[10px] text-white/40 uppercase mb-1">Time</div>
                <div className="text-sm font-black text-white">{task.metrics.executionTime}s</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-white/40">Step Progress</span>
              <span className="text-white font-bold">
                {task.timeline.filter(s => s.status === 'completed').length} / {task.timeline.length}
              </span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden flex gap-0.5">
              {task.timeline.map((step, idx) => (
                <div 
                  key={idx}
                  className={`h-full flex-1 transition-all duration-500 ${
                    step.status === 'completed' ? 'bg-emerald-500' :
                    step.status === 'running' ? 'bg-blue-500 animate-pulse' :
                    step.status === 'failed' ? 'bg-red-500' : 
                    step.status === 'waiting-hitl' ? 'bg-amber-500' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
