"use client";

import { useState } from 'react';

// Mock components to replace the ones in the snippet if they don't exist
const SessionCard = ({ session }: any) => (
  <div className="bg-white/10 p-4 rounded-xl mb-4 border border-white/10">
    <div className="flex justify-between items-center mb-2">
      <span className="text-emerald-400 font-mono text-sm">{session.sessionId}</span>
      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs uppercase">{session.mode}</span>
    </div>
    <p className="text-white/70 text-sm">Active Agent: <span className="text-white">{session.activeAgent || 'None'}</span></p>
    <p className="text-white/70 text-sm">History: <span className="text-white">{session.taskHistory.join(' → ') || 'Empty'}</span></p>
  </div>
);

const RouteAnalytics = ({ routes }: any) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center text-sm">
      <span className="text-white/60">Average Confidence</span>
      <span className="text-emerald-400 font-bold">94.2%</span>
    </div>
    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
      <div className="bg-emerald-500 h-full w-[94.2%]" />
    </div>
    <div className="grid grid-cols-3 gap-4 mt-8">
      <div className="text-center">
        <div className="text-2xl font-bold text-white">1.2s</div>
        <div className="text-xs text-white/40 uppercase">Avg Latency</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">85</div>
        <div className="text-xs text-white/40 uppercase">Total Routes</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">99.9%</div>
        <div className="text-xs text-white/40 uppercase">Success Rate</div>
      </div>
    </div>
  </div>
);

export default function RoutingDashboard() {
  const [activeSessions] = useState([
    { sessionId: 'user_123', mode: 'agent_active', activeAgent: 'credit', taskHistory: ['orchestrator'] },
    { sessionId: 'user_456', mode: 'orchestrator', activeAgent: null, taskHistory: ['risk completed'] }
  ]);
  const [recentRoutes] = useState([]);

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-br from-slate-900 to-emerald-900">
      <div className="max-w-7xl mx-auto p-12">
        <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-12">
          🧠 Multi-Agent Routing Orchestrator
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Active Sessions */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">⚡ Live Routing</h2>
            {activeSessions.map(session => (
              <SessionCard key={session.sessionId} session={session} />
            ))}
            {activeSessions.length === 0 && <p className="text-white/40 italic text-center py-8">No active sessions</p>}
          </div>

          {/* Route Analytics */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">📊 Routing Stats</h2>
            <RouteAnalytics routes={recentRoutes} />
          </div>
        </div>
      </div>
    </div>
  );
}
