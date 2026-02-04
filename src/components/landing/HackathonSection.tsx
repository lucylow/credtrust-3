import { ListChecks, Target, Trophy, Video, CheckCircle, Star, Medal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const requirements = [
  "GitHub Repository Link",
  "Demo Video (3-5 min walkthrough)",
  "Deployed on Arbitrum Sepolia",
  "Feedback.md on iExec Tools",
  "iExec TEE Implementation",
];

const criteria = [
  { label: "Innovation:", value: "First TEE-based credit marketplace" },
  { label: "Impact:", value: "Unlocks undercollateralized lending" },
  { label: "Technical:", value: "iExec TEE + ZKP integration" },
  { label: "Demo:", value: "Fully functional prototype" },
];

const bonuses = [
  "Account Abstraction Integration",
  "iExec Bulk Processing Feature",
  "Best Use of iExec Oracle",
];

const HackathonSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cards = [
    {
      icon: ListChecks,
      title: "Submission Requirements",
      items: requirements,
      itemIcon: CheckCircle,
      itemColor: "text-success",
    },
    {
      icon: Target,
      title: "Judging Criteria Alignment",
      items: criteria,
      itemIcon: Star,
      itemColor: "text-secondary",
      isKeyValue: true,
    },
    {
      icon: Trophy,
      title: "Bonus Prize Targets",
      items: bonuses,
      itemIcon: Medal,
      itemColor: "text-secondary",
      showButton: true,
    },
  ];

  return (
    <section id="hackathon" className="py-20 md:py-28 gradient-dark text-primary-foreground relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hack4Privacy Submission
          </h2>
          <p className="opacity-80 max-w-3xl mx-auto">
            CredTrust is our submission for the iExec Hack4Privacy hackathon,
            addressing the "Confidential DeFi" and "Confidential RWA" tracks with
            a focus on maximum financial impact.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {cards.map((card, cardIndex) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: cardIndex * 0.15 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="p-2 rounded-lg gradient-primary"
                >
                  <card.icon className="h-5 w-5" />
                </motion.div>
                <h3 className="text-xl font-bold">{card.title}</h3>
              </div>
              <ul className="space-y-3">
                {card.items.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + cardIndex * 0.1 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <card.itemIcon className={`h-5 w-5 ${card.itemColor} shrink-0 mt-0.5`} />
                    <span className="opacity-90">
                      {card.isKeyValue ? (
                        <>
                          <strong>{(item as { label: string; value: string }).label}</strong>{" "}
                          {(item as { label: string; value: string }).value}
                        </>
                      ) : (
                        item as string
                      )}
                    </span>
                  </motion.li>
                ))}
              </ul>
              {card.showButton && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 }}
                  className="mt-6"
                >
                  <Button variant="hero" className="w-full group" asChild>
                    <a
                      href="https://github.com/yourusername/credtrust-hackathon"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Full Implementation
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Demo Section */}
        <motion.div
          id="demo"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-6">Demo Video</h3>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-8 md:p-12 max-w-2xl mx-auto"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Video className="h-16 w-16 mx-auto mb-6 opacity-60" />
            </motion.div>
            <p className="opacity-80 mb-6">
              Our demo video walks through the complete CredTrust workflow: from
              encrypted data submission to Credit Proof NFT minting and loan
              execution.
            </p>
            <Button variant="hero" size="lg" className="group">
              Watch Demo Video
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm opacity-60 mt-4">
              (Link will be updated with submission)
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HackathonSection;
