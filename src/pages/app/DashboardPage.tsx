import { motion } from 'framer-motion';
import Dashboard from '@/components/app/Dashboard';
import TEEVisualizer from '@/components/app/TEEVisualizer';

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your credit applications and TEE validations
        </p>
      </div>
      <Dashboard />
      <TEEVisualizer />
    </motion.div>
  );
}
