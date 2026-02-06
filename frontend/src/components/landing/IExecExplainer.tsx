import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Cpu, Shield, Database, FileCode, Layers, 
  CheckCircle, ArrowRight, Lock, Zap, Server
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "app",
    label: "App & Dataset",
    icon: FileCode,
    title: "iApp Generator + Protected Datasets",
    description:
      "Bootstrap CredTrust's scoring app in minutes using iExec's iApp Generator. Credit models and borrower data are encrypted as iExec datasets.",
    steps: [
      "Credit scoring model packaged as iExec iApp",
      "Borrower financial data encrypted with Data Protector",
      "Datasets stored on IPFS with iExec access controls",
      "Only TEE can decrypt and process the data",
    ],
    diagram: [
      { label: "Credit Model", icon: FileCode, color: "from-blue-500 to-cyan-500" },
      { label: "Encrypted Data", icon: Lock, color: "from-purple-500 to-pink-500" },
      { label: "iApp Package", icon: Layers, color: "from-emerald-500 to-teal-500" },
    ],
  },
  {
    id: "tee",
    label: "TEE Execution",
    icon: Cpu,
    title: "Gramine-SGX Workerpool",
    description:
      "The scoring logic runs inside Intel SGX enclaves via iExec's Gramine workerpool. Neither raw data nor model weights are ever exposed.",
    steps: [
      "Job dispatched to TEE workerpool",
      "SGX enclave loads encrypted model + data",
      "Computation runs in isolated memory",
      "Only attested output leaves the enclave",
    ],
    diagram: [
      { label: "TEE Worker", icon: Server, color: "from-orange-500 to-red-500" },
      { label: "SGX Enclave", icon: Shield, color: "from-blue-500 to-indigo-500" },
      { label: "Attested Output", icon: CheckCircle, color: "from-emerald-500 to-green-500" },
    ],
  },
  {
    id: "verify",
    label: "On-chain Verification",
    icon: Shield,
    title: "Arbitrum Contract Verification",
    description:
      "Smart contracts on Arbitrum verify the TEE attestation (MRENCLAVE) and mint a non-transferable Credit Proof NFT with the verified score tier.",
    steps: [
      "TEE attestation submitted to verifier contract",
      "MRENCLAVE hash validated against registry",
      "Score tier extracted from attested output",
      "Credit Proof NFT minted to borrower",
    ],
    diagram: [
      { label: "Attestation", icon: Lock, color: "from-purple-500 to-violet-500" },
      { label: "Verifier", icon: CheckCircle, color: "from-blue-500 to-cyan-500" },
      { label: "Credit NFT", icon: Zap, color: "from-yellow-500 to-orange-500" },
    ],
  },
];

const IExecExplainer = () => {
  const [activeTab, setActiveTab] = useState("app");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="iexec" className="py-20 md:py-28 gradient-dark text-primary-foreground relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-sm font-medium mb-4">
            <Cpu className="h-4 w-4" />
            Powered by iExec
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Inside the iExec TEE
          </h2>
          <p className="opacity-80 max-w-2xl mx-auto">
            See how CredTrust leverages iExec's Trusted Execution Environments
            to compute confidential credit scores without exposing sensitive data.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/10 hover:bg-white/20"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-4">{currentTab.title}</h3>
                <p className="opacity-80 mb-6">{currentTab.description}</p>

                <ul className="space-y-3">
                  {currentTab.steps.map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      <span className="opacity-90">{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right: Interactive Diagram */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glass-card p-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Diagram Nodes */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {currentTab.diagram.map((node, i) => (
                    <motion.div
                      key={node.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={cn(
                          "w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg mb-2",
                          node.color
                        )}
                      >
                        <node.icon className="h-10 w-10 text-white" />
                      </motion.div>
                      <span className="text-sm font-medium text-center">
                        {node.label}
                      </span>
                      {i < currentTab.diagram.length - 1 && (
                        <ArrowRight className="absolute h-6 w-6 opacity-50 hidden md:block" style={{ transform: "translateX(70px)" }} />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Flow arrows */}
                <div className="flex justify-center items-center gap-2 py-4">
                  {currentTab.diagram.map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      {i < currentTab.diagram.length - 1 && (
                        <div className="w-16 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Info box */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Security Guarantee</span>
                  </div>
                  <p className="text-sm opacity-70">
                    {activeTab === "app" &&
                      "Data is encrypted client-side before upload. Only the TEE can decrypt."}
                    {activeTab === "tee" &&
                      "Intel SGX provides hardware-level isolation. Even iExec cannot access the data."}
                    {activeTab === "verify" &&
                      "MRENCLAVE attestation proves the exact code that ran. Tamper-proof verification."}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* iExec Tools Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: "iApp Generator", desc: "Bootstrap TEE apps in minutes", icon: FileCode },
            { label: "Data Protector", desc: "Encrypt & control access", icon: Lock },
            { label: "TEE Workerpools", desc: "SGX compute infrastructure", icon: Server },
            { label: "On-chain Oracle", desc: "Verifiable off-chain data", icon: Database },
          ].map((tool, i) => (
            <motion.div
              key={tool.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card p-4 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-primary/20">
                <tool.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">{tool.label}</h4>
                <p className="text-sm opacity-70">{tool.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IExecExplainer;
