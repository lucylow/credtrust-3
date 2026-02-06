import { motion } from 'framer-motion';

export function DemoControls() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-8 right-8 flex flex-col gap-4 z-50"
    >
      {[
        { label: 'New Credit Analysis', action: 'credit', color: 'emerald' },
        { label: 'Find Loan', action: 'lending', color: 'blue' },
        { label: 'Risk Assessment', action: 'risk', color: 'orange' }
      ].map(({ label, action, color }) => (
        <motion.button
          key={action}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            px-8 py-4 rounded-3xl font-bold shadow-2xl text-white
            bg-gradient-to-r from-${color}-500 to-${color}-600
            hover:from-${color}-600 hover:to-${color}-700
            hover:shadow-${color}-500/25 hover:shadow-xl
            transition-all duration-200
          `}
          onClick={() => console.log(`Trigger ${action} analysis`)}
        >
          {label}
        </motion.button>
      ))}
    </motion.div>
  );
}
