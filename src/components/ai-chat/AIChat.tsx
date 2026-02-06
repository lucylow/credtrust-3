import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, CreditCard, Search, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  agent?: string;
  data?: any;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Hi! I'm your CredTrust AI. I can help you score your credit, find the best loans, or monitor your portfolio. What would you like to do today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate Orchestrator & Agent Workflow
      // In a real app, this would call /api/chat which invokes the orchestrator
      
      // Step 1: Classifying intent (Simulated)
      setActiveAgent('Orchestrator');
      await new Promise(r => setTimeout(r, 1000));

      let responseContent = "";
      let agentName = "CredTrust AI";
      let additionalData = null;

      if (input.toLowerCase().includes('score') || input.toLowerCase().includes('credit')) {
        setActiveAgent('CreditAgent');
        await new Promise(r => setTimeout(r, 1500));
        responseContent = "I've analyzed your wallet activity. Your on-chain credit score is 720 (Tier B). Would you like to mint your Credit Proof NFT or provide more data for a better score?";
        agentName = "CreditAgent";
        additionalData = { type: 'score', value: 720, tier: 'B' };
      } else if (input.toLowerCase().includes('loan') || input.toLowerCase().includes('find')) {
        setActiveAgent('LendingAgent');
        await new Promise(r => setTimeout(r, 1500));
        responseContent = "I found 3 loan offers for your Tier B profile. The best rate is 7.8% APR from PoolY. I've negotiated it down from 8.2% for you!";
        agentName = "LendingAgent";
        additionalData = { type: 'loan', apr: 7.8, pool: 'PoolY' };
      } else if (input.toLowerCase().includes('portfolio') || input.toLowerCase().includes('risk')) {
        setActiveAgent('RiskAgent');
        await new Promise(r => setTimeout(r, 1500));
        responseContent = "Monitoring your portfolio... Alert! Your loan in PoolY has an LTV of 85%. I recommend rebalancing to avoid liquidation.";
        agentName = "RiskAgent";
        additionalData = { type: 'risk', ltv: 85, alert: 'HIGH' };
      } else {
        responseContent = "I can help you with credit scoring, finding loans, or monitoring your portfolio. Just ask!";
      }

      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: responseContent,
        agent: agentName,
        data: additionalData
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setActiveAgent(null);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col shadow-xl border-t-4 border-t-primary">
      <CardHeader className="border-b bg-muted/30 flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Bot size={24} />
          </div>
          <div>
            <CardTitle className="text-xl">CredTrust Agentic Chat</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                AI Systems Online
              </span>
              {activeAgent && (
                <Badge variant="secondary" className="animate-in fade-in zoom-in duration-300">
                  {activeAgent} thinking...
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1"><ShieldAlert size={12}/> TEE Protected</Badge>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className={`h-8 w-8 mt-1 ${m.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <AvatarFallback>{m.role === 'assistant' ? <Bot size={18}/> : <User size={18}/>}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className={`rounded-2xl p-4 shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-card border rounded-tl-none'
                    }`}>
                      {m.agent && <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">{m.agent}</div>}
                      <p className="text-sm leading-relaxed">{m.content}</p>
                    </div>
                    
                    {m.data && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 border rounded-xl bg-muted/50 text-xs"
                      >
                        {m.data.type === 'score' && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CreditCard size={14} className="text-primary" />
                              <span className="font-semibold">Credit Score Revealed</span>
                            </div>
                            <Badge className="bg-primary/20 text-primary border-primary/30">{m.data.value} (Tier {m.data.tier})</Badge>
                          </div>
                        )}
                        {m.data.type === 'loan' && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Search size={14} className="text-primary" />
                              <span className="font-semibold">Best Match: {m.data.pool}</span>
                            </div>
                            <Badge variant="outline" className="border-green-500/50 text-green-600">{m.data.apr}% APR</Badge>
                          </div>
                        )}
                        {m.data.type === 'risk' && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-destructive">
                              <ShieldAlert size={14} />
                              <span className="font-semibold">High LTV Warning</span>
                            </div>
                            <Badge variant="destructive">{m.data.ltv}% LTV</Badge>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8 mt-1 bg-primary text-primary-foreground">
                  <AvatarFallback><Bot size={18}/></AvatarFallback>
                </Avatar>
                <div className="bg-card border rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">{activeAgent || 'Thinking'}...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-card">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-2 mb-3">
          <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => setInput("What's my credit score?")}>
            <CreditCard size={12}/> Score Me
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => setInput("Find me a $5k loan")}>
            <Search size={12}/> Find Loan
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => setInput("Check portfolio risk")}>
            <ShieldAlert size={12}/> Risk Check
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the agents (e.g., 'Score me' or 'Find a $2k loan')"
            className="pr-12 py-6 rounded-2xl shadow-inner bg-muted/20 border-muted-foreground/20 focus-visible:ring-primary/30"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl transition-all duration-300"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </Button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-3 flex items-center justify-center gap-1">
          <Sparkles size={10} className="text-primary"/> 
          Powered by ElizaOS Multi-Agent System & iExec TEE
        </p>
      </div>
    </Card>
  );
}
