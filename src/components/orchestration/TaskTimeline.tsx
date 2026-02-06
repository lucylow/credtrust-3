// components/orchestration/TaskTimeline.tsx
import { Task, PoCoReplicateStatus } from '@/lib/multiAgentMockData';
import { AlertCircle } from 'lucide-react';

interface TaskTimelineProps {
  tasks: Task[];
}

const getStatusColor = (status: PoCoReplicateStatus) => {
  if (status.includes('FAILED')) return 'bg-red-500';
  if (['COMPUTING', 'CONTRIBUTING', 'REVEALING', 'RESULT_UPLOADING', 'STARTING', 'APP_DOWNLOADING', 'DATA_DOWNLOADING'].includes(status)) return 'bg-blue-500 animate-pulse';
  if (['COMPLETED', 'COMPUTED', 'CONTRIBUTED', 'REVEALED', 'RESULT_UPLOADED', 'CONTRIBUTE_AND_FINALIZE_DONE'].includes(status)) return 'bg-emerald-500';
  if (['ABORTED', 'WORKER_LOST'].includes(status)) return 'bg-slate-500';
  return 'bg-slate-500';
};

export function TaskTimeline({ tasks }: TaskTimelineProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        📈 Live Task Timeline
      </h3>
      
      <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {tasks.map(task => (
          <div key={task.id} className="group">
            <div className="flex items-center gap-4 mb-4 p-4 bg-black/20 rounded-2xl border border-white/5">
              <div className={`w-3 h-3 rounded-full ${task.status.includes('FAILED') ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-400 to-blue-500 animate-ping'}`} />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{task.goal}</h4>
                <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                  <span>ID: <code className="font-mono bg-black/50 px-2 py-1 rounded text-xs">{task.id.slice(0, 8)}</code></span>
                  <span className={task.status.includes('FAILED') ? 'text-red-400 font-bold' : ''}>{task.status.replace(/_/g, ' ')}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400">
                  {task.metrics.estimatedCost.toFixed(3)} RLC
                </div>
                <div className="text-xs text-white/50">{task.metrics.executionTime}s</div>
              </div>
            </div>

            {task.failureCause && (
              <div className="ml-12 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-400 font-mono leading-relaxed">
                  <strong>Failure Cause:</strong> {task.failureCause}
                </div>
              </div>
            )}

            {/* Timeline Steps */}
            <div className="ml-12 space-y-4">
              {task.timeline.map((step, i) => (
                <div key={i} className="flex flex-col gap-1 group/step">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(step.status)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{step.step}</div>
                      <div className="text-xs text-white/50">
                        {new Date(step.timestamp).toLocaleTimeString()} • {step.duration ? `${step.duration.toFixed(1)}s` : step.status.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-white/40 text-right min-w-[120px]">
                      {step.agentId.slice(-6)}
                    </div>
                  </div>
                  {step.failureCause && (
                    <div className="ml-6 text-[10px] text-red-400/80 font-mono italic">
                      Error: {step.failureCause}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
