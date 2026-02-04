import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppHeader from '@/components/app/AppHeader';
import Dashboard from '@/components/app/Dashboard';
import DataSubmission from '@/components/app/DataSubmission';
import TEEVisualizer from '@/components/app/TEEVisualizer';
import CreditNFT from '@/components/app/CreditNFT';
import FloatingParticles from '@/components/landing/FloatingParticles';

export default function AppPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingParticles />
      <AppHeader />
      
      <main className="container py-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/nft" element={<NFTPage />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function DashboardPage() {
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

function SubmitPage() {
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

function NFTPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Credit Proof NFT</h1>
        <p className="text-muted-foreground">
          Your verified credit score as a non-transferable soulbound token
        </p>
      </div>
      <CreditNFT score={750} attestation="0x7a8f...3e2d" tokenId="#1247" />
    </motion.div>
  );
}
