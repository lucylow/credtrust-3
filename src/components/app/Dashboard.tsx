import { motion } from 'framer-motion';
import { TrendingUp, Users, Shield, Zap } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';

const stats = [
  {
    label: 'Total Applications',
    value: '1,247',
    change: '+12.5%',
    isPositive: true,
    icon: TrendingUp,
    color: 'from-primary to-blue-600',
  },
  {
    label: 'Active Lenders',
    value: '89',
    change: '+5.2%',
    isPositive: true,
    icon: Users,
    color: 'from-secondary to-pink-600',
  },
  {
    label: 'TEE Validations',
    value: '3,892',
    change: '+23.1%',
    isPositive: true,
    icon: Shield,
    color: 'from-emerald-500 to-green-600',
  },
  {
    label: 'Avg. Processing',
    value: '2.3s',
    change: '-15%',
    isPositive: true,
    icon: Zap,
    color: 'from-orange-500 to-amber-600',
  },
];

const recentActivity = [
  { type: 'application', message: 'New credit application submitted', time: '2 min ago' },
  { type: 'validation', message: 'TEE validation completed', time: '5 min ago' },
  { type: 'nft', message: 'Credit NFT minted', time: '8 min ago' },
  { type: 'loan', message: 'Loan funded successfully', time: '12 min ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            color={stat.color}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <StaggerContainer staggerDelay={0.1} className="space-y-3">
          {recentActivity.map((activity, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activity.type === 'application'
                        ? 'bg-primary'
                        : activity.type === 'validation'
                        ? 'bg-success'
                        : activity.type === 'nft'
                        ? 'bg-secondary'
                        : 'bg-orange-500'
                    }`}
                  />
                  <span className="text-sm text-foreground">{activity.message}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </motion.div>
    </div>
  );
}
