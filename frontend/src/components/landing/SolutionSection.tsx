import { Medal, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";

const steps = [
  {
    number: 1,
    title: "Encrypted Data Submission",
    description:
      "Borrower encrypts financial data using iExec Data Protector and submits to CredTrust Vault (TEE).",
  },
  {
    number: 2,
    title: "Confidential Computation",
    description:
      "Lender's proprietary risk model executes inside the secure TEE, processing encrypted data without exposure.",
  },
  {
    number: 3,
    title: "Verifiable Output",
    description:
      "TEE generates a cryptographically signed credit attestation, minting a non-transferable Credit Proof NFT.",
  },
  {
    number: 4,
    title: "Loan Execution",
    description:
      "Borrower uses NFT to access undercollateralized loans across integrated DeFi markets on Arbitrum.",
  },
];

const SolutionSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section id="solution" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--secondary)/0.1)_0%,transparent_50%)]" />
      
      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Simple, Secure, Private
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Architecture Steps */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8"
          >
            <div className="space-y-0">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  onHoverStart={() => setActiveStep(index)}
                  onHoverEnd={() => setActiveStep(null)}
                  className="relative flex gap-4 pb-8 last:pb-0 group cursor-default"
                >
                  {/* Connecting line */}
                  {index !== steps.length - 1 && (
                    <motion.div 
                      className="absolute left-5 top-12 w-0.5 h-full bg-border"
                      animate={{
                        backgroundColor: activeStep === index ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  
                  <motion.div
                    animate={{
                      scale: activeStep === index ? 1.15 : 1,
                      boxShadow: activeStep === index 
                        ? '0 0 25px hsl(var(--primary) / 0.5)' 
                        : '0 0 15px hsl(var(--primary) / 0.3)',
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 relative z-10"
                  >
                    {step.number}
                  </motion.div>
                  <div className="flex-1">
                    <motion.h4 
                      className="font-bold text-foreground mb-1 transition-colors"
                      animate={{ color: activeStep === index ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
                    >
                      {step.title}
                    </motion.h4>
                    <motion.p 
                      className="text-muted-foreground text-sm leading-relaxed"
                      animate={{ opacity: activeStep === index ? 1 : 0.8 }}
                    >
                      {step.description}
                    </motion.p>
                  </div>
                  
                  {/* Checkmark on hover */}
                  <motion.div
                    className="text-success"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: activeStep === index ? 1 : 0,
                      scale: activeStep === index ? 1 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Technical Architecture
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              CredTrust leverages iExec's Trusted Execution Environments (TEEs)
              to create a secure enclave where sensitive borrower data meets
              proprietary underwriting models—with neither being exposed.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              The system combines confidential computing with zero-knowledge
              proofs for verifiable output, creating a new privacy layer for
              on-chain credit.
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 border-l-4 border-primary"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Medal className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">
                    Hackathon Innovation
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our implementation uses the iExec iApp Generator for rapid
                    TEE deployment and integrates Account Abstraction (ERC-4337)
                    for gasless transactions—targeting the bonus prize.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
