import { PlayCircle, Github, Lock, Shield, Zap, Award, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const tags = [
    { label: "iExec TEE", icon: Shield, color: "from-emerald-500 to-green-600" },
    { label: "SGX Enclaves", icon: Cpu, color: "from-primary to-blue-600" },
    { label: "Groth16 ZK", icon: Zap, color: "from-secondary to-pink-600" },
    { label: "Arbitrum", icon: Award, color: "from-orange-500 to-red-600" },
  ];

  const stats = [
    { value: "300ms", label: "Proof Gen", icon: Zap },
    { value: "99.9%", label: "Uptime", icon: Shield },
    { value: "Winner", label: "Hack4Privacy", icon: Award },
    { value: "Mainnet", label: "Ready", icon: Cpu },
  ];

  // Mouse parallax
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 20,
        y: (clientY / innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-hero min-h-screen flex items-center">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl bg-gradient-to-br from-primary/20 to-secondary/20"
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{ type: "spring", stiffness: 50 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl bg-gradient-to-tr from-secondary/20 to-primary/20"
        animate={{
          x: mousePosition.x * -1.5,
          y: mousePosition.y * -1.5,
        }}
        transition={{ type: "spring", stiffness: 50 }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Hack4Privacy Grand Prize Winner
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block"
              >
                Confidential
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gradient block"
              >
                Credit Markets
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl"
            >
              TEE-powered credit scoring + ZK proofs + structured debt tranches.
              <span className="text-foreground font-semibold"> Privacy by design.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/app">
                  <ArrowRight className="h-5 w-5" />
                  Launch App
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="#demo">
                  <PlayCircle className="h-5 w-5" />
                  Watch Demo
                </a>
              </Button>
            </motion.div>

            {/* Tech Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {tags.map((tag, index) => (
                <motion.span
                  key={tag.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tag.color} text-primary-foreground text-sm font-medium shadow-lg cursor-default`}
                >
                  <tag.icon className="h-4 w-4" />
                  {tag.label}
                </motion.span>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 rounded-xl bg-muted/30 border border-border/50"
                >
                  <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 0.3}deg) rotateX(${-mousePosition.y * 0.3}deg)`,
            }}
            className="relative"
          >
            <div className="absolute inset-0 gradient-primary rounded-2xl blur-xl opacity-30" />
            <div className="glass-card p-6 md:p-8 shadow-glow relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  Private Credit Assessment
                </h3>
                <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm font-semibold border border-success/30">
                  Live Demo
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Borrower Identity", encrypted: true },
                  { label: "Financial Data", encrypted: true },
                  { label: "Risk Model", encrypted: true },
                  { label: "Credit Score Output", value: "750 (Verified)" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.15 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                  >
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                    {item.encrypted ? (
                      <span className="flex items-center gap-1.5 text-primary font-semibold">
                        <Lock className="h-4 w-4" />
                        Encrypted
                      </span>
                    ) : (
                      <span className="text-success font-semibold">
                        {item.value}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="flex items-center gap-2 mt-6 text-success font-semibold"
              >
                <Shield className="h-5 w-5" />
                <span>All computations secured in iExec TEE</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
