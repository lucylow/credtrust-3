import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  ArrowRight, Github, Play, MessageCircle, 
  Sparkles, Shield, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const actions = [
    {
      icon: Play,
      label: "Run Interactive Demo",
      description: "Try the TEE credit flow",
      href: "#demo",
      variant: "hero" as const,
      primary: true,
    },
    {
      icon: Github,
      label: "Open GitHub Repo",
      description: "View the source code",
      href: "https://github.com/lucylow/credtrust6",
      variant: "heroOutline" as const,
      external: true,
    },
    {
      icon: MessageCircle,
      label: "Join Community",
      description: "Connect on Discord",
      href: "https://discord.gg/iexec",
      variant: "heroOutline" as const,
      external: true,
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-6"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Built for iExec Hack4Privacy
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Ready to Explore{" "}
            <span className="text-gradient-animated">Private Credit?</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            Experience how TEE-powered credit scoring enables under-collateralized
            lending without exposing sensitive financial data.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {actions.map((action, i) => (
              <Button
                key={action.label}
                variant={action.variant}
                size="lg"
                className={action.primary ? "group" : ""}
                asChild
              >
                <a
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                >
                  <action.icon className="h-5 w-5 mr-2" />
                  {action.label}
                  {action.primary && (
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  )}
                </a>
              </Button>
            ))}
          </motion.div>

          {/* Tech Stack Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { icon: Shield, label: "iExec TEE" },
              { icon: Cpu, label: "Intel SGX" },
              { icon: Sparkles, label: "Groth16 ZK" },
            ].map((tech, i) => (
              <motion.span
                key={tech.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-sm"
              >
                <tech.icon className="h-4 w-4 text-primary" />
                {tech.label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
