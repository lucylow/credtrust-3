import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, Suspense } from 'react';
import AppHeader from '@/components/app/AppHeader';
import Dashboard from '@/components/app/Dashboard';
import DataSubmission from '@/components/app/DataSubmission';
import TEEVisualizer from '@/components/app/TEEVisualizer';
import CreditNFT from '@/components/app/CreditNFT';
import FloatingParticles from '@/components/landing/FloatingParticles';
import LoanMarketplace from '@/components/marketplace/LoanMarketplace';
import CreditDashboard from '@/components/analytics/CreditDashboard';
import TEEWorkflow from '@/components/iExecIntegration/TEEWorkflow';
import { SlideViewer } from '@/components/slides';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.3,
};

export default function AppPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingParticles />
      <AppHeader />
      
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar className="sticky top-16 h-[calc(100vh-4rem)]" />
        
        <main className="flex-1 overflow-auto">
          <div className="container py-6 lg:py-8 max-w-6xl">
            <Suspense fallback={<LoadingSkeleton type="card" count={3} />}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/submit" element={<SubmitPage />} />
                  <Route path="/nft" element={<NFTPage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/slides" element={<SlidesPage />} />
                  <Route path="/tee" element={<TEEPage />} />
                  <Route path="*" element={<Navigate to="/app" replace />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-6 lg:space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl lg:text-3xl font-bold text-foreground"
          >
            Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Overview of your credit applications and TEE validations
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-400">Live Data</span>
        </motion.div>
      </div>
      <Dashboard />
      <TEEVisualizer />
    </motion.div>
  );
}

function SubmitPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="max-w-2xl mx-auto space-y-6 lg:space-y-8"
    >
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl lg:text-3xl font-bold text-foreground"
        >
          Submit Application
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm lg:text-base text-muted-foreground mt-1"
        >
          Encrypt and submit your financial data for confidential credit scoring
        </motion.p>
      </div>
      <DataSubmission />
    </motion.div>
  );
}

function NFTPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="max-w-lg mx-auto space-y-6 lg:space-y-8"
    >
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl lg:text-3xl font-bold text-foreground"
        >
          Credit Proof NFT
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm lg:text-base text-muted-foreground mt-1"
        >
          Your verified credit score as a non-transferable soulbound token
        </motion.p>
      </div>
      <CreditNFT score={750} attestation="0x7a8f...3e2d" tokenId="#1247" />
    </motion.div>
  );
}

function MarketplacePage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <LoanMarketplace />
    </motion.div>
  );
}

function AnalyticsPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <CreditDashboard />
    </motion.div>
  );
}

function TEEPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="max-w-4xl mx-auto space-y-6 lg:space-y-8"
    >
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl lg:text-3xl font-bold text-foreground"
        >
          iExec TEE Workflow
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm lg:text-base text-muted-foreground mt-1"
        >
          Experience confidential computing with Intel SGX trusted execution
        </motion.p>
      </div>
      <TEEWorkflow
        encryptedData="demo-encrypted-data"
        onComplete={(result, attestation) => {
          console.log('TEE Complete:', result, attestation);
        }}
      />
    </motion.div>
  );
}

function SlidesPage() {
  const [activeSlug, setActiveSlug] = useState('solution');
  const slugs = ['problem', 'solution', 'privacy-features'];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-6 lg:space-y-8"
    >
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl lg:text-3xl font-bold text-foreground"
        >
          Presentation Slides
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm lg:text-base text-muted-foreground mt-1"
        >
          Interactive mock data slides showcasing CredTrust features
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 flex-wrap"
      >
        {slugs.map(slug => (
          <Button
            key={slug}
            variant={activeSlug === slug ? 'default' : 'outline'}
            onClick={() => setActiveSlug(slug)}
            className="capitalize"
          >
            {slug.replace('-', ' ')}
          </Button>
        ))}
      </motion.div>

      <SlideViewer slug={activeSlug} />
    </motion.div>
  );
}
