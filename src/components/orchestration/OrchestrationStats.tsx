// components/orchestration/OrchestrationStats.tsx
import { motion } from 'framer-motion';

interface StatsProps {
  stats: {
    activeAgents: number;
    liveTasks: number;
    totalSessions: number;
    rlcSpent: number;
    hitlInterventions: number;
  };
}

export function OrchestrationStats({ stats }: StatsProps) {
  const statCards = [
    { value: stats.activeAgents, label: 'Active Agents', color: 'emerald' },
    { value: stats.liveTasks, label: 'Live Tasks', color: 'blue' },
    { value: stats.hitlInterventions, label: 'HITL', color: 'amber' },
    { value: stats.totalSessions, label: 'Sessions', color: 'purple' },
    { value: `RLC ${stats.rlcSpent.toFixed(2)}`, label: 'Spent', color: 'indigo' }
  ];

  const colorMap: Record<string, { bg: string, text: string, hover: string, glow: string, from: string, to: string }> = {
    emerald: { 
      bg: 'from-emerald-500/10 to-emerald-600/10', 
      text: 'text-emerald-400', 
      hover: 'hover:border-emerald-400/50', 
      glow: 'hover:shadow-emerald-500/20',
      from: 'from-emerald-400',
      to: 'to-emerald-500'
    },
    blue: { 
      bg: 'from-blue-500/10 to-blue-600/10', 
      text: 'text-blue-400', 
      hover: 'hover:border-blue-400/50', 
      glow: 'hover:shadow-blue-500/20',
      from: 'from-blue-400',
      to: 'to-blue-500'
    },
    amber: { 
      bg: 'from-amber-500/10 to-amber-600/10', 
      text: 'text-amber-400', 
      hover: 'hover:border-amber-400/50', 
      glow: 'hover:shadow-amber-500/20',
      from: 'from-amber-400',
      to: 'to-amber-500'
    },
    purple: { 
      bg: 'from-purple-500/10 to-purple-600/10', 
      text: 'text-purple-400', 
      hover: 'hover:border-purple-400/50', 
      glow: 'hover:shadow-purple-500/20',
      from: 'from-purple-400',
      to: 'to-purple-500'
    },
    indigo: { 
      bg: 'from-indigo-500/10 to-indigo-600/10', 
      text: 'text-indigo-400', 
      hover: 'hover:border-indigo-400/50', 
      glow: 'hover:shadow-indigo-500/20',
      from: 'from-indigo-400',
      to: 'to-indigo-500'
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map(({ value, label, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`
            group p-6 rounded-3xl backdrop-blur-xl border border-white/20
            bg-gradient-to-br ${colorMap[color].bg}
            ${colorMap[color].hover} ${colorMap[color].glow} shadow-xl
            transition-all duration-300 cursor-default
          `}
        >
          <div className={`text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-r ${colorMap[color].from} ${colorMap[color].to} bg-clip-text mb-2`}>
            {value}
          </div>
          <div className="text-white/70 text-sm font-medium">{label}</div>
        </motion.div>
      ))}
    </div>
  );
}
