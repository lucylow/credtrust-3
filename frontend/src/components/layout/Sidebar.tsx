import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileUp,
  Store,
  BarChart3,
  Shield,
  Cpu,
  Wallet,
  Sparkles,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { to: "/dashboard", label: "Eliza Agents", icon: Cpu, badge: "AI" },
  { to: "/orchestration", label: "Multi-Agent", icon: Sparkles, badge: "New" },
  { to: "/chat", label: "AI Chat", icon: MessageSquare, badge: null },
  { to: "/bulk-score", label: "Bulk Scoring", icon: BarChart3, badge: null },
  { to: "/app/marketplace", label: "Marketplace", icon: Store, badge: "12" },
  { to: "/app/privacy", label: "Privacy", icon: Shield, badge: null },
  { to: "/app/nft", label: "My NFTs", icon: Wallet, badge: null },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col w-64 border-r border-border bg-card/30 backdrop-blur-sm",
        className
      )}
    >
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1" role="navigation" aria-label="Main navigation">
        <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Main
        </p>
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={cn(
                "h-4 w-4 relative z-10 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              <span className="relative z-10 flex-1">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  "relative z-10 text-xs font-medium px-2 py-0.5 rounded-full",
                  item.badge === "Live" 
                    ? "bg-emerald-500/20 text-emerald-400 animate-pulse" 
                    : "bg-primary/20 text-primary"
                )}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pro Card */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 border border-primary/20"
        >
          {/* Animated glow */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/30 rounded-full blur-2xl animate-pulse" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">iExec TEE</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Confidential computing powered by Intel SGX enclaves
            </p>
            <a
              href="https://docs.iex.ec/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Learn more <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
