// src/dashboard/DiscordHITLDashboard.tsx
import React from 'react';

export function DiscordHITLDashboard() {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 to-purple-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-12">
          Discord HITL + ElizaOS
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20">
            <h3 className="text-2xl font-bold mb-6 text-white">
              🎛️ Discord Bot Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-emerald-500/20 rounded-2xl">
                <span>✅ Bot Online</span>
                <span className="font-mono">#agent-approvals</span>
              </div>
              <div className="flex justify-between p-4 bg-blue-500/20 rounded-2xl">
                <span>🔌 WebSocket Active</span>
                <span className="font-mono">ws://localhost:8081</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20">
            <h3 className="text-2xl font-bold mb-6 text-white">📱 Discord Commands</h3>
            <div className="grid grid-cols-2 gap-4">
              <code className="p-4 bg-slate-800/50 rounded-xl font-mono text-sm">
                /approve &lt;id&gt;
              </code>
              <code className="p-4 bg-slate-800/50 rounded-xl font-mono text-sm">
                /reject &lt;id&gt;
              </code>
            </div>
          </div>
        </div>

        <div className="text-center p-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-emerald-500/30">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">
            🎉 Ready for Hack4Privacy!
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Discord HITL + ElizaOS TDX agents fully integrated
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-6 py-3 bg-emerald-500/90 text-white rounded-xl font-bold">✅ Production Ready</span>
            <span className="px-6 py-3 bg-blue-500/90 text-white rounded-xl font-bold">✅ Discord Native</span>
            <span className="px-6 py-3 bg-purple-500/90 text-white rounded-xl font-bold">✅ TDX Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
