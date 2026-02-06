// components/orchestration/ControlPanel.tsx
import { motion } from 'framer-motion';

export function ControlPanel() {
  const mockActions = [
    { name: 'Score Wallet', agent: 'credit', color: 'emerald', icon: '🧮' },
    { name: 'Find Loan', agent: 'lending', color: 'blue', icon: '🏦' },
    { name: 'Risk Check', agent: 'risk', color: 'orange', icon: '🛡️' },
    { name: 'Execute TX', agent: 'execution', color: 'purple', icon: '⚡' },
    { name: 'Full Analysis', agent: 'orchestrator', color: 'indigo', icon: '🎛️' }
  ];

  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-500/90 to-emerald-600/90 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/30 hover:border-emerald-400/50',
    blue: 'from-blue-500/90 to-blue-600/90 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/30 hover:border-blue-400/50',
    orange: 'from-orange-500/90 to-orange-600/90 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/30 hover:border-orange-400/50',
    purple: 'from-purple-500/90 to-purple-600/90 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/30 hover:border-purple-400/50',
    indigo: 'from-indigo-500/90 to-indigo-600/90 hover:from-indigo-600 hover:to-indigo-700 hover:shadow-indigo-500/30 hover:border-indigo-400/50'
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-8">🎮 Quick Actions</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {mockActions.map(({ name, agent, color, icon }) => (
          <motion.button
            key={agent}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`
              group relative p-6 rounded-2xl font-bold text-white shadow-xl
              bg-gradient-to-br ${colorMap[color].split(' ').slice(0, 2).join(' ')}
              ${colorMap[color].split(' ').slice(2).join(' ')} transition-all
              border border-white/20
            `}
            onClick={() => console.log(`Execute: ${name} (${agent})`)}
          >
            <div className="text-2xl mb-3">{icon}</div>
            <div className="text-lg">{name}</div>
            <div className="absolute -bottom-2 -right-2 bg-white/20 px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all">
              {agent}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
