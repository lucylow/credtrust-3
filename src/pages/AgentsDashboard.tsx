import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMockLiveData, LiveTask } from '@/lib/mockData';
import { AgentCard, LiveTaskCard, FrameworkStatus, DemoControls } from '@/components/dashboard';

const StatusBadge = ({ count, label, color }: { count: number; label: string; color: string }) => {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  
  return (
    <div className={`px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-2 ${colors[color]}`}>
      <span className="font-bold">{count}</span>
      <span className="text-sm opacity-80">{label}</span>
    </div>
  );
};

export default function AgentsDashboard() {
  const { agents, liveTasks } = useMockLiveData();
  const [selectedTask, setSelectedTask] = useState<LiveTask | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto p-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 pb-2">
            ElizaOS AI Agents
          </h1>
          <div className="flex flex-wrap gap-4 justify-center mb-8 max-w-2xl mx-auto">
            <StatusBadge count={agents.filter(a => a.status === 'analyzing').length} label="Active" color="emerald" />
            <StatusBadge count={liveTasks.length} label="Live Tasks" color="blue" />
            <StatusBadge count={agents.filter(a => a.status === 'waiting-hitl').length} label="HITL" color="amber" />
            <StatusBadge count={4} label="TDX Enclaves" color="purple" />
          </div>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Agents Grid */}
          <motion.section 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              Agent Status ({agents.length})
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </motion.section>

          {/* Live Tasks */}
          <motion.section 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              Live Tasks ({liveTasks.length})
            </h2>
            
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {liveTasks.slice().reverse().slice(0, 5).map((task) => (
                <motion.div
                  key={task.sessionId}
                  whileHover={{ scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <LiveTaskCard task={task} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Frameworks Status */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <FrameworkStatus />
        </motion.section>

        {/* Floating Controls */}
        <DemoControls />
      </div>
    </div>
  );
}
