import { ElizaOSChat } from '@/components/eliza-chat/Chat';
import { EnclaveMonitor } from '@/components/agent-dashboard/EnclaveMonitor';
import { AgentStats } from '@/components/agent-stats/Stats';
import { motion } from 'framer-motion';

export default function ElizaOSDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-emerald-900/20">
      <div className="max-w-7xl mx-auto p-12">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl font-black bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent text-center mb-24"
        >
          🤖 CredTrust ElizaOS Agent
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/80 text-center max-w-4xl mx-auto mb-20 leading-relaxed"
        >
          Autonomous DeFi credit management running in <span className="font-bold text-emerald-400">Intel TDX</span>
          <br />Scores wallets confidentially • Executes loans autonomously • Monitors 24/7
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          {/* ElizaOS Chat */}
          <ElizaOSChat />
          
          {/* Live TDX Monitoring */}
          <div className="space-y-8">
            <EnclaveMonitor />
            <QuickActions />
          </div>
        </div>

        {/* Production Stats */}
        <AgentStats />
      </div>
    </div>
  );
}

function QuickActions() {
    return (
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-2xl text-emerald-400 transition-all">
                    Scan Wallet
                </button>
                <button className="p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-2xl text-blue-400 transition-all">
                    Find Loans
                </button>
            </div>
        </div>
    );
}
