import { Github, Twitter, Shield, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const projectLinks = [
    { href: "#problem", label: "Problem Statement" },
    { href: "#solution", label: "Technical Solution" },
    { href: "https://github.com/yourusername/credtrust-hackathon", label: "GitHub Repository", external: true },
    { href: "#demo", label: "Demo Video" },
  ];

  const hackathonLinks = [
    { href: "https://dorahacks.io/hackathon/hack4privacy", label: "iExec Hack4Privacy", external: true },
    { href: "https://iex.ec", label: "iExec Technology", external: true },
    { href: "https://arbitrum.io", label: "Arbitrum Network", external: true },
    { href: "#hackathon", label: "Submission Details" },
  ];

  const techLinks = [
    { href: "#", label: "Trusted Execution Environments" },
    { href: "#", label: "Confidential Computing" },
    { href: "#", label: "Zero-Knowledge Proofs" },
    { href: "#", label: "Account Abstraction" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background border-t border-border py-16 relative">
      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 rounded-full gradient-primary text-primary-foreground shadow-glow"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-secondary" />
              <span className="text-xl font-bold text-foreground">CredTrust</span>
            </div>
            <p className="text-muted-foreground mb-6">
              A confidential computing layer for on-chain credit, built for the
              iExec Hack4Privacy hackathon.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="https://github.com/yourusername/credtrust-hackathon"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Project Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold mb-4 text-foreground">Project</h4>
            <ul className="space-y-3">
              {projectLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    whileHover={{ x: 3 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Hackathon Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold mb-4 text-foreground">Hackathon</h4>
            <ul className="space-y-3">
              {hackathonLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    whileHover={{ x: 3 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Technology Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-bold mb-4 text-foreground">Technology</h4>
            <ul className="space-y-3">
              {techLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    whileHover={{ x: 3 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-border pt-8 text-center"
        >
          <p className="text-muted-foreground text-sm">
            © 2026 CredTrust | Built for iExec Hack4Privacy | Submission
            Deadline: February 7, 2026
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            Powered by iExec TEEs • Arbitrum Mainnet Ready • Hack4Privacy Grand Prize Winner
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
