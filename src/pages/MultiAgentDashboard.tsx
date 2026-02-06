import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiAgentMockData, Task } from '@/lib/multiAgentMockData';
import { AgentGrid, TaskTimeline, OrchestrationStats, ControlPanel, TaskGrid } from '@/components/orchestration';

export default function MultiAgentDashboard() {
  const { agents, tasks, stats } = useMultiAgentMockData();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'agents'>('overview');

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  // const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Background elements that work without being too heavy */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 py-2">
            Multi-Agent Orchestration
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto mb-12 text-lg">
            Real-time TEE-secured agent coordination and task execution monitoring
          </p>
          <div className="max-w-5xl mx-auto">
            <OrchestrationStats stats={stats} />
          </div>
        </motion.header>

        {/* Tabs */}
        <div className="flex bg-white/5 backdrop-blur-xl rounded-2xl p-1 mb-12 border border-white/10 shadow-2xl max-w-xl mx-auto">
          {[
            { id: 'overview' as const, label: 'Overview', icon: '📊' },
            { id: 'tasks' as const, label: `Tasks (${activeTasks.length})`, icon: '⚡' },
            { id: 'agents' as const, label: `Agents (${agents.length})`, icon: '🤖' }
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.id === 'tasks' && <span className="sm:hidden">({activeTasks.length})</span>}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.section
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-5 gap-8"
            >
              <div className="lg:col-span-3 space-y-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">●</span> Active Agents
                </h2>
                <AgentGrid agents={agents.slice(0, 4)} />
              </div>
              <div className="lg:col-span-2 space-y-8">
                <TaskTimeline tasks={activeTasks.slice(0, 3)} />
                <ControlPanel />
              </div>
            </motion.section>
          )}
          
          {activeTab === 'tasks' && (
            <motion.section
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TaskGrid tasks={tasks} />
            </motion.section>
          )}
          
          {activeTab === 'agents' && (
            <motion.section
              key="agents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AgentGrid agents={agents} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
