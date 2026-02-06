import { motion } from 'framer-motion';
import { LiveTask } from '@/lib/mockData';

interface LiveTaskTimelineProps {
  task: LiveTask;
}

export function LiveTaskTimeline({ task }: LiveTaskTimelineProps) {
  return (
    <div className="relative pl-6 space-y-4">
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-white/10" />
      {task.timeline.map((event, i) => (
        <div key={i} className="relative">
          <div className={`
            absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-900
            ${event.status === 'completed' ? 'bg-emerald-500' : 
              event.status === 'analyzing' ? 'bg-blue-500 animate-pulse' : 
              'bg-slate-500'}
          `} />
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-bold text-white capitalize">{event.agent}</div>
              <div className="text-xs text-white/50">{event.status}</div>
            </div>
            <div className="text-[10px] text-white/30 font-mono">
              {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface LiveTaskCardProps {
  task: LiveTask;
}

export function LiveTaskCard({ task }: LiveTaskCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 hover:border-blue-400/50 group transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping" />
          <h4 className="font-bold text-lg text-white truncate max-w-[200px]">
            {task.goal.length > 50 ? `${task.goal.slice(0, 50)}...` : task.goal}
          </h4>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          task.hitlRequired ? 'bg-amber-500/90 text-white' : 'bg-emerald-500/90 text-white'
        }`}>
          {task.hitlRequired ? 'HITL REQ' : 'AUTO'}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Route:</span>
          <span className="font-mono text-emerald-400">
            {task.route.agent} ({Math.round(task.route.confidence * 100)}%)
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Session:</span>
          <span className="font-mono">{task.sessionId.slice(0, 8)}...</span>
        </div>
      </div>

      <LiveTaskTimeline task={task} />
    </motion.div>
  );
}
