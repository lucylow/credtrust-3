// dashboard/TDXMonitor.tsx
export function TDXMonitor() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-12">
          🔒 CredTrust TDX Monitor
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* TDX Status */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">🛡️ TDX Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-emerald-500/20 rounded-2xl">
                <span className="text-white/80">Workerpool</span>
                <code className="font-mono bg-black/50 px-3 py-1 rounded-lg text-sm text-emerald-400">
                  tdx-labs.pools.iexec.eth
                </code>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-500/20 rounded-2xl">
                <span className="text-white/80">Framework</span>
                <span className="font-bold text-blue-400">TDX ✅</span>
              </div>
              <div className="flex justify-between p-4 bg-purple-500/20 rounded-2xl">
                <span className="text-white/80">Memory</span>
                <span className="text-purple-400">Multi-GB+</span>
              </div>
            </div>
          </div>

          {/* Recent Scores */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">📊 Recent TDX Scores</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { wallet: '0x1234...', score: 782, tier: 'A', mrenclave: '0x1a2b...' },
                { wallet: '0x5678...', score: 692, tier: 'B', mrenclave: '0x3c4d...' },
                { wallet: '0x9abc...', score: 584, tier: 'C', mrenclave: '0x5e6f...' }
              ].map((score, i) => (
                <div key={i} className="p-6 bg-black/20 rounded-2xl group hover:bg-white/10 transition-all">
                  <div className="text-3xl font-black text-emerald-400 mb-2">{score.score}</div>
                  <div className={`px-4 py-2 rounded-full w-fit font-bold text-sm mb-3 ${
                    score.tier === 'A' ? 'bg-emerald-500/90 text-white' :
                    score.tier === 'B' ? 'bg-blue-500/90 text-white' : 'bg-amber-500/90 text-white'
                  }`}>
                    {score.tier}-TIER
                  </div>
                  <div className="text-xs font-mono text-white/60 mb-2 truncate">{score.wallet}</div>
                  <div className="text-xs font-mono bg-black/50 px-2 py-1 rounded w-fit text-white/80">
                    {score.mrenclave.slice(0, 16)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
