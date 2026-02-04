import { EyeOff, Brain, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const problems = [
  {
    icon: EyeOff,
    title: "Privacy vs. Trust",
    description:
      "Current DeFi protocols force borrowers to expose complete financial history or overcollateralize at 150%+. There's no way to prove creditworthiness privately.",
    gradient: "from-red-500 to-orange-600",
  },
  {
    icon: Brain,
    title: "Proprietary Model Exposure",
    description:
      "Lenders and underwriters cannot use their sophisticated risk models on-chain without exposing proprietary algorithms and business logic to competitors.",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: ArrowRightLeft,
    title: "Inefficient Capital",
    description:
      "The $30B DeFi lending market remains limited to overcollateralized loans, excluding creditworthy borrowers and preventing institutional participation.",
    gradient: "from-blue-500 to-cyan-600",
  },
];

const ProblemSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="problem" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05)_0%,transparent_70%)]" />
      
      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The DeFi Credit Paradox
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Traditional DeFi lending is broken. Here's why we need a new approach.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-8 group cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${problem.gradient} flex items-center justify-center mb-6 shadow-lg`}
              >
                <problem.icon className="h-7 w-7 text-primary-foreground" />
              </motion.div>
              <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-gradient transition-all">
                {problem.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
