import { motion } from 'framer-motion';
import DataSubmission from '@/components/app/DataSubmission';

export default function SubmitPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Submit Application</h1>
        <p className="text-muted-foreground">
          Encrypt and submit your financial data for confidential credit scoring
        </p>
      </div>
      <DataSubmission />
    </motion.div>
  );
}
