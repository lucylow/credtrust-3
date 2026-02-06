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

  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-500/10 to-emerald-600/10 text-emerald-400 group-hover:border-emerald-400/50 group-hover:shadow-emerald-500/20',
    blue: 'from-blue-500/10 to-blue-600/10 text-blue-400 group-hover:border-blue-400/50 group-hover:shadow-blue-500/20',
    amber: 'from-amber-500/10 to-amber-600/10 text-amber-400 group-hover:border-amber-400/50 group-hover:shadow-amber-500/20',
    purple: 'from-purple-500/10 to-purple-600/10 text-purple-400 group-hover:border-purple-400/50 group-hover:shadow-purple-500/20',
    indigo: 'from-indigo-500/10 to-indigo-600/10 text-indigo-400 group-hover:border-indigo-400/50 group-hover:shadow-indigo-500/20'
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
            bg-gradient-to-br ${colorMap[color].split(' ').slice(0, 2).join(' ')}
            ${colorMap[color].split(' ').slice(3).join(' ')} shadow-xl
            transition-all duration-300 cursor-default
          `}
        >
          <div className={`text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-r ${color === 'emerald' ? 'from-emerald-400 to-emerald-500' : color === 'blue' ? 'from-blue-400 to-blue-500' : color === 'amber' ? 'from-amber-400 to-amber-500' : color === 'purple' ? 'from-purple-400 to-purple-500' : 'from-indigo-400 to-indigo-500'} bg-clip-text mb-2`}>
            {value}
          </div>
          <div className="text-white/70 text-sm font-medium">{label}</div>
        </motion.div>
      ))}
    </div>
  );
}
