// components/orchestration/TaskTimeline.tsx
import { Task } from '@/lib/multiAgentMockData';

interface TaskTimelineProps {
  tasks: Task[];
}

export function TaskTimeline({ tasks }: TaskTimelineProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        📈 Live Task Timeline
      </h3>
      
      <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {tasks.map(task => (
          <div key={task.id} className="group">
            <div className="flex items-center gap-4 mb-4 p-4 bg-black/20 rounded-2xl">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-ping" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{task.goal}</h4>
                <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                  <span>ID: <code className="font-mono bg-black/50 px-2 py-1 rounded text-xs">{task.id.slice(0, 8)}</code></span>
                  <span>{task.status.replace('-', ' ').toUpperCase()}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400">
                  {task.metrics.estimatedCost.toFixed(3)} RLC
                </div>
                <div className="text-xs text-white/50">{task.metrics.executionTime}s</div>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="ml-12 space-y-2">
              {task.timeline.map((step, i) => (
                <div key={i} className="flex items-center gap-3 group/step">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    step.status === 'running' ? 'bg-blue-500 animate-ping' :
                    step.status === 'completed' ? 'bg-emerald-500' :
                    step.status === 'failed' ? 'bg-red-500' : 
                    step.status === 'waiting-hitl' ? 'bg-amber-500 animate-pulse' : 'bg-slate-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{step.step}</div>
                    <div className="text-xs text-white/50">
                      {new Date(step.timestamp).toLocaleTimeString()} • {step.duration ? `${step.duration.toFixed(1)}s` : '...'}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-white/40 text-right min-w-[120px]">
                    {step.agentId.slice(-6)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
