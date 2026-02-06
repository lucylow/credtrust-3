import React from 'react';
import { AIChat } from '@/components/ai-chat/AIChat';
import { motion } from 'framer-motion';
import { Bot, Shield, Zap } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-wider border border-primary/20">
          <Zap size={14} /> ElizaOS-Powered Credit Intelligence
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 gradient-text">
          CredTrust AI Agents
        </h1>
        <p className="text-muted-foreground text-lg">
          Experience the future of decentralized credit. Our autonomous agents use iExec TEE 
          to analyze your data privately and negotiate the best loan terms for you.
        </p>
      </motion.div>

      <AIChat />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm">
          <Bot className="text-primary mb-3" size={24} />
          <h3 className="font-bold mb-1">Autonomous Scoring</h3>
          <p className="text-sm text-muted-foreground">CreditAgent analyzes on-chain and private data using SGX enclaves.</p>
        </div>
        <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm">
          <Shield className="text-primary mb-3" size={24} />
          <h3 className="font-bold mb-1">AI Negotiation</h3>
          <p className="text-sm text-muted-foreground">LendingAgent finds and negotiates optimal rates from loan pools.</p>
        </div>
        <div className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm">
          <Zap className="text-primary mb-3" size={24} />
          <h3 className="font-bold mb-1">Risk Monitoring</h3>
          <p className="text-sm text-muted-foreground">RiskAgent provides real-time portfolio health checks and alerts.</p>
        </div>
      </div>
    </div>
  );
}
