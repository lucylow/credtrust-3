import React from 'react';
import { motion } from 'framer-motion';

export function AgentStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20">
      <StatCard title="Active Enclaves" value="14" trend="+3" color="emerald" />
      <StatCard title="Autonomous Actions" value="247" trend="+12%" color="blue" />
      <StatCard title="Credit Scores" value="89" trend="↑ A-tier" color="purple" />
      <StatCard title="Portfolio Value" value="$2.4M" trend="+1.2%" color="gold" />
    </div>
  );
}

function StatCard({ title, value, trend, color }: { title: string, value: string, trend: string, color: string }) {
    const colorClasses: Record<string, string> = {
        emerald: 'text-emerald-400',
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        gold: 'text-yellow-400'
    };

    return (
        <div className="space-y-2">
            <h4 className="text-white/60 text-sm font-medium">{title}</h4>
            <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
            <div className="text-xs text-white/40">{trend}</div>
        </div>
    );
}
