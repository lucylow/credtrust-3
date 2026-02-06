import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  User, Briefcase, Wallet, Shield, Cpu, Award, 
  ArrowRight, Check, Lock, Zap, Sparkles, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const borrowerProfiles = [
  {
    id: "gig",
    name: "Gig Worker",
    icon: User,
    income: "$45k-65k",
    debt: "Low",
    walletActivity: "Moderate",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "sme",
    name: "SME Owner",
    icon: Briefcase,
    income: "$120k-200k",
    debt: "Medium",
    walletActivity: "High",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "defi",
    name: "DeFi Power User",
    icon: Wallet,
    income: "$80k-150k",
    debt: "Low",
    walletActivity: "Very High",
    color: "from-emerald-500 to-teal-500",
  },
];

const teeSteps = [
  { label: "Encrypting data", icon: Lock, duration: 800 },
  { label: "Sending to iExec workerpool", icon: Zap, duration: 1000 },
  { label: "Running model in TEE", icon: Cpu, duration: 1500 },
  { label: "Generating attested score", icon: Shield, duration: 800 },
];

const scoreTiers = {
  gig: { score: 712, tier: "B", color: "text-yellow-400", bg: "bg-yellow-500/20" },
  sme: { score: 782, tier: "A", color: "text-emerald-400", bg: "bg-emerald-500/20" },
  defi: { score: 825, tier: "A+", color: "text-primary", bg: "bg-primary/20" },
};

const loanOffers = {
  gig: { maxLoan: "$15,000", ltv: "65%", apr: "8.5%" },
  sme: { maxLoan: "$75,000", ltv: "80%", apr: "5.2%" },
  defi: { maxLoan: "$120,000", ltv: "85%", apr: "4.1%" },
};

const CreditFlowDemo = () => {
  const [step, setStep] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [teeProgress, setTeeProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const resetDemo = () => {
    setStep(0);
    setSelectedProfile(null);
    setTeeProgress(0);
    setIsProcessing(false);
  };

  const runTeeSimulation = async () => {
    setIsProcessing(true);
    for (let i = 0; i < teeSteps.length; i++) {
      setTeeProgress(i);
      await new Promise((resolve) => setTimeout(resolve, teeSteps[i].duration));
    }
    setTeeProgress(teeSteps.length);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsProcessing(false);
    setStep(2);
  };

  const steps = [
    { label: "Choose Profile", num: 1 },
    { label: "TEE Compute", num: 2 },
    { label: "Credit Proof", num: 3 },
    { label: "Loan Offer", num: 4 },
  ];

  return (
    <section id="demo" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Interactive Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Try the Private Credit Flow
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience how CredTrust uses iExec TEEs to compute confidential credit scores
            without exposing your financial data.
          </p>
        </motion.div>

        {/* Stepper */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    step >= i
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground border border-border"
                  )}
                  animate={step === i ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {step > i ? <Check className="h-5 w-5" /> : s.num}
                </motion.div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 md:w-20 h-1 mx-2 rounded transition-colors",
                      step > i ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 md:p-10 max-w-4xl mx-auto min-h-[400px]"
        >
          <AnimatePresence mode="wait">
            {/* Step 0: Choose Profile */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-bold mb-6 text-center">
                  Select a Borrower Profile
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {borrowerProfiles.map((profile) => (
                    <motion.button
                      key={profile.id}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedProfile(profile.id)}
                      className={cn(
                        "p-6 rounded-xl border-2 text-left transition-all",
                        selectedProfile === profile.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 bg-background/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br",
                          profile.color
                        )}
                      >
                        <profile.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-bold mb-3">{profile.name}</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Income: {profile.income}</p>
                        <p>Debt Level: {profile.debt}</p>
                        <p>On-chain Activity: {profile.walletActivity}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Button
                    variant="hero"
                    size="lg"
                    disabled={!selectedProfile}
                    onClick={() => setStep(1)}
                    className="group"
                  >
                    Run in iExec TEE
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 1: TEE Processing */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold mb-8">
                  Processing in iExec TEE
                </h3>
                <div className="max-w-md mx-auto space-y-4">
                  {teeSteps.map((teeStep, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.3 }}
                      animate={{
                        opacity: teeProgress >= i ? 1 : 0.3,
                      }}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                        teeProgress > i
                          ? "border-success bg-success/10"
                          : teeProgress === i
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          teeProgress > i
                            ? "bg-success text-success-foreground"
                            : teeProgress === i
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {teeProgress > i ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <teeStep.icon
                            className={cn(
                              "h-5 w-5",
                              teeProgress === i && "animate-pulse"
                            )}
                          />
                        )}
                      </div>
                      <span
                        className={cn(
                          "font-medium",
                          teeProgress >= i
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {teeStep.label}
                      </span>
                      {teeProgress === i && isProcessing && (
                        <div className="ml-auto">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                {!isProcessing && teeProgress === 0 && (
                  <Button
                    variant="hero"
                    size="lg"
                    className="mt-8"
                    onClick={runTeeSimulation}
                  >
                    <Cpu className="h-4 w-4 mr-2" />
                    Start TEE Computation
                  </Button>
                )}
              </motion.div>
            )}

            {/* Step 2: Credit Proof NFT */}
            {step === 2 && selectedProfile && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold mb-8">
                  Credit Proof NFT Generated
                </h3>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="max-w-sm mx-auto"
                >
                  <div className="glass-card p-6 border-2 border-primary/30 relative overflow-hidden">
                    {/* NFT Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-sm text-muted-foreground">
                          Credit Proof #7842
                        </span>
                        <span className="px-2 py-1 bg-success/20 text-success text-xs font-bold rounded">
                          VERIFIED
                        </span>
                      </div>

                      <div className="flex items-center justify-center mb-6">
                        <div
                          className={cn(
                            "w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold",
                            scoreTiers[selectedProfile as keyof typeof scoreTiers].bg,
                            scoreTiers[selectedProfile as keyof typeof scoreTiers].color
                          )}
                        >
                          {scoreTiers[selectedProfile as keyof typeof scoreTiers].tier}
                        </div>
                      </div>

                      <div className="text-center mb-6">
                        <p className="text-4xl font-bold mb-1">
                          {scoreTiers[selectedProfile as keyof typeof scoreTiers].score}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confidential Credit Score
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Issued</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MRENCLAVE</span>
                          <span className="font-mono text-xs">0x8a4f...e2c1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">iExec App</span>
                          <span className="font-mono text-xs">0x3b7c...9d4f</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <Button
                  variant="hero"
                  size="lg"
                  className="mt-8 group"
                  onClick={() => setStep(3)}
                >
                  View Loan Offers
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {/* Step 3: Loan Offer */}
            {step === 3 && selectedProfile && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold mb-2">
                  🎉 You Qualify for Under-Collateralized Lending!
                </h3>
                <p className="text-muted-foreground mb-8">
                  Based on your Credit Proof NFT (Tier{" "}
                  {scoreTiers[selectedProfile as keyof typeof scoreTiers].tier})
                </p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="max-w-md mx-auto glass-card p-6 border border-primary/30"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold">Best Available Offer</h4>
                      <p className="text-sm text-muted-foreground">
                        CredTrust Verified Lender
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {loanOffers[selectedProfile as keyof typeof loanOffers].maxLoan}
                      </p>
                      <p className="text-xs text-muted-foreground">Max Loan</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-success">
                        {loanOffers[selectedProfile as keyof typeof loanOffers].ltv}
                      </p>
                      <p className="text-xs text-muted-foreground">LTV</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-secondary">
                        {loanOffers[selectedProfile as keyof typeof loanOffers].apr}
                      </p>
                      <p className="text-xs text-muted-foreground">APR</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    In the full app, this would initiate a loan contract on Arbitrum
                    using your Credit Proof NFT as collateral attestation.
                  </p>

                  <Button variant="hero" className="w-full" asChild>
                    <a href="#marketplace">View Marketplace Preview</a>
                  </Button>
                </motion.div>

                <Button
                  variant="ghost"
                  className="mt-6"
                  onClick={resetDemo}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Another Profile
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default CreditFlowDemo;
