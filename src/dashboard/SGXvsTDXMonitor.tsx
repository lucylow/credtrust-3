// src/dashboard/SGXvsTDXMonitor.tsx
import React from 'react';

export function SGXvsTDXMonitor() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto p-12">
        <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-16">
          🔒 SGX vs TDX Live Comparison
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* SGX Status */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/30 rounded-3xl p-10 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-green-500/90 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-bold">🛡️</span>
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">Intel SGX</h2>
                <div className="text-green-400 font-bold text-xl">PRODUCTION READY</div>
              </div>
            </div>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between">
                <span className="text-white/80">Memory Limit</span>
                <span className="font-mono text-green-400">~192MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Workerpool</span>
                <span className="font-mono bg-green-500/20 px-4 py-2 rounded-xl text-green-400">
                  sgx-labs.pools.iexec.eth
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Use Case</span>
                <span className="text-white/90">Lightweight ML</span>
              </div>
            </div>
          </div>

          {/* TDX Status */}
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 border-2 border-purple-500/30 rounded-3xl p-10 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-purple-500/90 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                <span className="text-2xl font-bold">🔬</span>
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">Intel TDX</h2>
                <div className="text-purple-400 font-bold text-xl">EXPERIMENTAL</div>
              </div>
            </div>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between">
                <span className="text-white/80">Memory</span>
                <span className="font-mono text-purple-400">Multi-GB+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Workerpool</span>
                <span className="font-mono bg-purple-500/20 px-4 py-2 rounded-xl text-purple-400">
                  tdx-labs.pools.iexec.eth
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Use Case</span>
                <span className="text-white/90">Complex AI / Legacy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Comparison */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
          <h3 className="text-4xl font-bold text-white mb-12 text-center">
            📊 Live Task Comparison
          </h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { framework: 'SGX', score: 782, time: '12s', cost: '0.008 RLC', status: '✅ COMPLETE' },
              { framework: 'TDX', score: 789, time: '18s', cost: '0.015 RLC', status: '🔬 EXPERIMENTAL' },
              { framework: 'AUTO', score: 785, time: '14s', cost: '0.010 RLC', status: '🎯 SELECTED' }
            ].map((task, i) => (
              <div key={i} className="group p-8 rounded-2xl hover:bg-white/10 transition-all">
                <div className="text-5xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text mb-4 text-center">
                  {task.score}
                </div>
                <div className="text-center space-y-2 mb-6">
                  <div className="text-xl font-bold text-white">{task.framework}</div>
                  <div className="text-sm text-white/60">{task.time} • {task.cost}</div>
                </div>
                <div className="text-center px-6 py-3 bg-black/20 rounded-xl font-mono text-sm text-white/70">
                  {task.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
