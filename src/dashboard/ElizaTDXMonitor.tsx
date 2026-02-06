// src/dashboard/ElizaTDXMonitor.tsx
import React from 'react';

interface AgentStatusCardProps {
  agent: string;
  status: 'executing' | 'waiting-hitl' | 'idle';
  score?: number;
  tier?: string;
}

const AgentStatusCard: React.FC<AgentStatusCardProps> = ({ agent, status, score, tier }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold text-white">{agent}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
          status === 'executing' ? 'bg-emerald-500/20 text-emerald-400' :
          status === 'waiting-hitl' ? 'bg-amber-500/20 text-amber-400' :
          'bg-slate-500/20 text-slate-400'
        }`}>
          {status}
        </span>
      </div>
      {score !== undefined && (
        <div className="flex items-end gap-2">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-white/60 mb-1">Score</span>
        </div>
      )}
      {tier && (
        <div className="mt-2">
          <span className="text-emerald-400 font-bold">Tier {tier}</span>
        </div>
      )}
    </div>
  );
};

export function ElizaTDXMonitor() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-900 p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-16">
          🤖 ElizaOS in TDX Trust Domain
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Agents Status */}
          <div className="space-y-8">
            <AgentStatusCard 
              agent="Credit Agent" 
              status="executing" 
              score={782} 
              tier="A" 
            />
            <AgentStatusCard 
              agent="Lending Agent" 
              status="waiting-hitl" 
              score={4.2} 
              tier="APR" 
            />
          </div>

          {/* TDX Info */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
            <h3 className="text-3xl font-bold text-white mb-8">🔒 TDX Trust Domain</h3>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Workerpool</span>
                  <code className="font-mono bg-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 font-bold">
                    tdx-labs.pools.iexec.eth
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">MRENCLAVE</span>
                  <code className="font-mono text-xs bg-black/50 px-3 py-2 rounded-xl truncate">
                    0x1a2b3c4d5e6f7890abcdef1234567890...
                  </code>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Memory</span>
                  <span className="font-bold text-emerald-400">Multi-GB+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Protection</span>
                  <span className="font-bold text-blue-400">VM-Level</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
