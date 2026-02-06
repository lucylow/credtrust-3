import React, { useState, useRef } from "react";
import { UserCheck, Building2, Zap, Link, Shield, Cpu, ArrowRight, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    title: "TEE Risk Engine",
    description:
      "SGX/TDX risk models compute confidential scores inside hardware enclaves.",
    gradient: "from-emerald-500 to-teal-600",
    accentColor: "emerald",
  },
  {
    icon: Zap,
    title: "Groth16 ZK Proofs",
    description:
      '300ms succinct proofs verify "score ∈ tier X" without revealing inputs.',
    gradient: "from-purple-500 to-pink-600",
    accentColor: "purple",
  },
  {
    icon: UserCheck,
    title: "Selective Disclosure",
    description:
      "Ephemeral tokens grant time-limited access to encrypted metadata.",
    gradient: "from-blue-500 to-indigo-600",
    accentColor: "blue",
  },
  {
    icon: Building2,
    title: "Debt Tranches",
    description:
      "Dynamic tranching creates senior/junior/equity positions as NFTs.",
    gradient: "from-orange-500 to-red-600",
    accentColor: "orange",
  },
  {
    icon: Link,
    title: "HSM Key Management",
    description:
      "AWS CloudHSM + 90-day rotation + MRENCLAVE pinning.",
    gradient: "from-gray-400 to-slate-600",
    accentColor: "slate",
  },
  {
    icon: Cpu,
    title: "Monitoring Stack",
    description:
      "15s Discord alerts for enclave crashes, proof timeouts, reverts.",
    gradient: "from-sky-500 to-blue-600",
    accentColor: "sky",
  },
];

interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
  inView: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index, inView }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className="relative glass-card p-6 group cursor-default overflow-hidden"
    >
      {/* Animated gradient background on hover */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
          feature.gradient
        )}
        animate={{ opacity: isHovered ? 0.08 : 0 }}
      />
      
      {/* Spotlight effect following cursor */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(circle at ${((x as number) + 0.5) * 100}% ${((y as number) + 0.5) * 100}%, hsl(var(--primary) / 0.15) 0%, transparent 50%)`
          ),
        }}
      />
      
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
        style={{ borderColor: 'rgba(0, 0, 0, 0)' }}
        animate={{
          borderColor: isHovered ? 'hsl(217 91% 60% / 0.4)' : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Floating particles on hover */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={cn("absolute w-1 h-1 rounded-full bg-gradient-to-r", feature.gradient)}
              initial={{ 
                x: 20 + i * 30, 
                y: 80,
                opacity: 0,
                scale: 0 
              }}
              animate={{ 
                y: [80, 20, -10],
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5],
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}
      
      {/* Icon with enhanced animation */}
      <motion.div
        animate={{
          scale: isHovered ? 1.15 : 1,
          rotate: isHovered ? 8 : 0,
          y: isHovered ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={cn(
          "relative w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-5",
          feature.gradient
        )}
        style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
      >
        {/* Icon glow */}
        <motion.div
          className={cn("absolute inset-0 rounded-xl bg-gradient-to-br blur-xl", feature.gradient)}
          animate={{ opacity: isHovered ? 0.6 : 0.3, scale: isHovered ? 1.3 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <feature.icon className="h-7 w-7 text-white relative z-10" />
        
        {/* Sparkle effect on hover */}
        <motion.div
          className="absolute -top-1 -right-1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isHovered ? [0, 1.2, 1] : 0, 
            opacity: isHovered ? 1 : 0,
            rotate: isHovered ? [0, 15, 0] : 0
          }}
          transition={{ duration: 0.4 }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </motion.div>
      </motion.div>
      
      {/* Title with underline animation */}
      <div className="relative mb-3" style={{ transform: "translateZ(10px)" }}>
        <motion.h3 
          className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {feature.title}
        </motion.h3>
        <motion.div
          className={cn("absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r", feature.gradient)}
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "60%" : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      
      {/* Description with fade-up animation */}
      <motion.p 
        className="text-muted-foreground text-sm leading-relaxed relative z-10"
        animate={{ 
          opacity: isHovered ? 1 : 0.8,
          y: isHovered ? -2 : 0 
        }}
        transition={{ duration: 0.2 }}
        style={{ transform: "translateZ(5px)" }}
      >
        {feature.description}
      </motion.p>
      
      {/* Enhanced arrow indicator */}
      <motion.div
        className="absolute bottom-6 right-6 flex items-center gap-2 text-primary"
        initial={{ opacity: 0, x: -15 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : -15,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.span
          className="text-xs font-medium"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ delay: 0.1 }}
        >
          Learn more
        </motion.span>
        <motion.div
          animate={{ x: isHovered ? [0, 4, 0] : 0 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </motion.div>
      
      {/* Corner accent */}
      <motion.div
        className={cn(
          "absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl opacity-0 rounded-bl-full",
          feature.gradient
        )}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

const FeaturesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--secondary)/0.05)_0%,transparent_50%)]" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            initial={{ 
              x: `${20 + i * 15}%`, 
              y: "100%",
              opacity: 0 
            }}
            animate={{ 
              y: "-10%",
              opacity: [0, 0.5, 0],
            }}
            transition={{ 
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Features
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Production-Grade Privacy
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every component battle-tested for institutional DeFi. Built for scale, designed for trust.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1000px" }}>
          {features.map((feature, index) => (
            <FeatureCard 
              feature={feature} 
              index={index} 
              inView={inView} 
              key={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
