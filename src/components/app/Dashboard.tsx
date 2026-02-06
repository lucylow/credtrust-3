import { motion } from 'framer-motion';
import { TrendingUp, Users, Shield, Zap, ArrowRight, Activity, Clock, CheckCircle2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { getRecentActivity } from '@/mocks/analyticsData';
import { cn } from '@/lib/utils';

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

const quickActions = [
  { label: 'Submit Application', icon: TrendingUp, href: '/app/submit', color: 'primary' },
  { label: 'Browse Marketplace', icon: Users, href: '/app/marketplace', color: 'secondary' },
  { label: 'View Analytics', icon: Activity, href: '/app/analytics', color: 'emerald' },
];

const activityIcons = {
  application: TrendingUp,
  validation: Shield,
  nft: CheckCircle2,
  loan: Activity,
  repayment: Clock,
};

const activityColors = {
  application: 'bg-primary text-primary-foreground',
  validation: 'bg-emerald-500 text-white',
  nft: 'bg-secondary text-secondary-foreground',
  loan: 'bg-orange-500 text-white',
  repayment: 'bg-blue-500 text-white',
};

export default function Dashboard() {
  const recentActivity = getRecentActivity(6);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
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
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.a
                key={action.label}
                href={action.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'interactive-card p-4 flex items-center gap-4 group',
                  'hover:border-primary/40'
                )}
              >
                <div className={cn(
                  'p-3 rounded-xl bg-gradient-to-br',
                  action.color === 'primary' && 'from-primary/20 to-primary/5',
                  action.color === 'secondary' && 'from-secondary/20 to-secondary/5',
                  action.color === 'emerald' && 'from-emerald-500/20 to-emerald-500/5',
                )}>
                  <Icon className={cn(
                    'h-5 w-5',
                    action.color === 'primary' && 'text-primary',
                    action.color === 'secondary' && 'text-secondary',
                    action.color === 'emerald' && 'text-emerald-500',
                  )} />
                </div>
                <span className="flex-1 font-medium text-foreground">{action.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.a>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card-elevated p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Latest transactions and updates</p>
          </div>
          <motion.a
            href="/app/analytics"
            whileHover={{ x: 4 }}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </motion.a>
        </div>
        
        <StaggerContainer staggerDelay={0.08} className="space-y-2">
          {recentActivity.map((activity) => {
            const Icon = activityIcons[activity.type] || Activity;
            const colorClass = activityColors[activity.type] || 'bg-muted text-muted-foreground';
            
            return (
              <StaggerItem key={activity.id}>
                <motion.div
                  whileHover={{ x: 4, backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                  className="flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className={cn('p-2 rounded-lg', colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.message}
                    </p>
                    {activity.metadata?.amount && (
                      <p className="text-xs text-muted-foreground">
                        ${activity.metadata.amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    {activity.metadata?.tier && (
                      <span className={cn(
                        'inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full',
                        activity.metadata.tier === 'A' && 'bg-emerald-500/20 text-emerald-400',
                        activity.metadata.tier === 'B' && 'bg-blue-500/20 text-blue-400',
                        activity.metadata.tier === 'C' && 'bg-amber-500/20 text-amber-400',
                        activity.metadata.tier === 'D' && 'bg-red-500/20 text-red-400',
                      )}>
                        Tier {activity.metadata.tier}
                      </span>
                    )}
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </motion.div>
    </div>
  );
}
