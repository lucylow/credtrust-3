// app/page.tsx - Production Orchestration UI
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiAgentMockData, Task } from '@/lib/multiAgentMockData';
import { AgentGrid, TaskTimeline, OrchestrationStats, ControlPanel, TaskGrid } from '@/components/orchestration';
import { PoCoFlow } from '@/components/PoCoFlow';
import { PoCoDebug } from '@/components/PoCoDebug';

export default function MultiAgentDashboard() {
  const { agents, tasks, stats } = useMultiAgentMockData();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'agents'>('overview');
  const [debugTask, setDebugTask] = useState<Task | null>(null);

  const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-emerald-900/20 overflow-hidden text-white">
      <div className="max-w-8xl mx-auto p-8 relative">
        {/* Background Animation */}
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center mb-20"
        >
          <h1 className="text-7xl font-black bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-8 drop-shadow-2xl py-2">
            Multi-Agent Orchestration
          </h1>
          <div className="flex flex-wrap gap-6 justify-center max-w-4xl mx-auto mb-12">
            <OrchestrationStats stats={stats} />
          </div>
        </motion.header>

        {/* Tabs */}
        <div className="flex bg-white/5 backdrop-blur-xl rounded-3xl p-1 mb-12 border border-white/20 shadow-2xl max-w-2xl mx-auto relative z-10">
          {[
            { id: 'overview' as const, label: 'Overview', icon: '📊' },
            { id: 'tasks' as const, label: `Tasks (${activeTasks.length})`, icon: '⚡' },
            { id: 'agents' as const, label: `Agents (${agents.length})`, icon: '🤖' }
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.section
              key="overview"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="grid lg:grid-cols-2 gap-12 mb-20 relative z-10"
            >
              <AgentGrid agents={agents.slice(0, 6)} />
              <div className="space-y-8">
                <PoCoFlow taskStatus={activeTasks[0]?.status} />
                <div onClick={() => activeTasks[0] && setDebugTask(activeTasks[0])} className="cursor-pointer">
                  <TaskTimeline tasks={activeTasks.slice(0, 3)} />
                </div>
                <ControlPanel />
              </div>
            </motion.section>
          )}
          
          {activeTab === 'tasks' && (
            <motion.section
              key="tasks"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="relative z-10"
            >
              <TaskGrid tasks={tasks} />
            </motion.section>
          )}
          
          {activeTab === 'agents' && (
            <motion.section
              key="agents"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="relative z-10"
            >
              <AgentGrid agents={agents} />
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {debugTask && (
            <PoCoDebug task={debugTask} onClose={() => setDebugTask(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
