import { UserCheck, Building2, Zap, Link, Shield, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const features = [
  {
    icon: Shield,
    title: "TEE Risk Engine",
    description:
      "SGX/TDX risk models compute confidential scores inside hardware enclaves.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Zap,
    title: "Groth16 ZK Proofs",
    description:
      '300ms succinct proofs verify "score ∈ tier X" without revealing inputs.',
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: UserCheck,
    title: "Selective Disclosure",
    description:
      "Ephemeral tokens grant time-limited access to encrypted metadata.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Building2,
    title: "Debt Tranches",
    description:
      "Dynamic tranching creates senior/junior/equity positions as NFTs.",
    gradient: "from-orange-500 to-red-600",
  },
  {
    icon: Link,
    title: "HSM Key Management",
    description:
      "AWS CloudHSM + 90-day rotation + MRENCLAVE pinning.",
    gradient: "from-gray-500 to-gray-600",
  },
  {
    icon: Cpu,
    title: "Monitoring Stack",
    description:
      "15s Discord alerts for enclave crashes, proof timeouts, reverts.",
    gradient: "from-sky-500 to-blue-600",
  },
];

const FeaturesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.08)_0%,transparent_60%)]" />
      
      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Production-Grade Privacy
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every component battle-tested for institutional DeFi.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-6 group cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}
              >
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-gradient transition-all">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
