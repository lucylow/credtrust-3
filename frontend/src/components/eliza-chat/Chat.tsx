'use client';
import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ElizaOSChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    content: `🤖 CredTrust Agent online (TDX Enclave #${randomTDXID()})\n\nI monitor portfolios 24/7, score credit confidentially, execute loans autonomously.\n\nTry: "Score wallet 0x123", "Find best loan", "Monitor my risk"`
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Processing: "${input}"\n\n🔒 TDX Enclave verified\n📊 Analysis complete\n✅ Result secured on-chain`
      };
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="eliza-chat p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-purple-900/50 to-emerald-900/90 border border-white/20 backdrop-blur-3xl"
    >
      <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl">
        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center">
          <span className="text-2xl font-bold">🤖</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            CredTrust Agent
          </h2>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            TDX Enclave Active
          </div>
        </div>
      </div>

      <div className="messages space-y-4 mb-8 max-h-96 overflow-y-auto p-4 bg-black/20 rounded-2xl">
        {messages.map((m) => (
          <motion.div 
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-2xl p-6 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-gradient-to-r from-emerald-500/90 to-blue-600/90 backdrop-blur-xl text-white border border-white/20 shadow-xl' 
                : 'bg-white/10 backdrop-blur-xl border border-white/30'
            }`}>
              {m.content}
            </div>
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          className="flex-1 px-6 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:outline-none backdrop-blur-xl transition-all"
          placeholder="Ask your autonomous credit agent..."
        />
        <motion.button 
          type="submit" 
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/50 disabled:opacity-50 transition-all"
        >
          {isLoading ? '🤖 Thinking...' : 'Execute'}
        </motion.button>
      </form>
    </motion.div>
  );
}

function randomTDXID() {
  return Math.random().toString(16).slice(2, 10).toUpperCase();
}