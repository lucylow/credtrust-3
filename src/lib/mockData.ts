import { useState, useEffect } from 'react';

export interface AgentStatus {
  id: string;
  name: string;
  type: 'credit' | 'lending' | 'risk' | 'execution' | 'orchestrator';
  status: 'idle' | 'analyzing' | 'waiting-hitl' | 'completed' | 'error';
  confidence: number;
  task: string;
  wallet?: string;
  score?: number;
  tier?: string;
  mrenclave?: string;
  framework?: string;
  progress: number;
  startedAt: number;
  hitlThreadId?: string;
}

export interface LiveTask {
  sessionId: string;
  goal: string;
  route: { agent: string; confidence: number };
  timeline: Array<{
    agent: string;
    status: string;
    timestamp: number;
    result?: any;
  }>;
  hitlRequired: boolean;
}

export const MOCK_AGENTS: AgentStatus[] = [
  {
    id: 'agent-1',
    name: 'Credit Analyst',
    type: 'credit',
    status: 'analyzing',
    confidence: 0.94,
    task: 'Scoring wallet 0x1234...7890',
    wallet: '0x1234567890abcdef1234567890abcdef12345678',
    score: 782,
    tier: 'A',
    framework: 'TensorFlow 2.19.0',
    mrenclave: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    progress: 85,
    startedAt: Date.now() - 45000
  },
  {
    id: 'agent-2', 
    name: 'Loan Finder',
    type: 'lending',
    status: 'waiting-hitl',
    confidence: 0.88,
    task: 'Found 4.2% APR loan ($25k)',
    hitlThreadId: '123456789',
    progress: 100,
    startedAt: Date.now() - 120000
  },
  {
    id: 'agent-3',
    name: 'Risk Guardian',
    type: 'risk',
    status: 'idle',
    confidence: 0.96,
    task: 'Portfolio LTV: 72%',
    progress: 0,
    startedAt: Date.now() - 300000
  }
];

export const MOCK_LIVE_TASKS: LiveTask[] = [
  {
    sessionId: 'user-123-session',
    goal: 'Score my wallet and find best loan under 5% APR',
    route: { agent: 'orchestrator', confidence: 0.98 },
    timeline: [
      { agent: 'orchestrator', status: 'routing', timestamp: Date.now() - 60000 },
      { agent: 'credit', status: 'analyzing', timestamp: Date.now() - 45000, result: { score: 782 } },
      { agent: 'lending', status: 'waiting-hitl', timestamp: Date.now() - 15000 }
    ],
    hitlRequired: true
  }
];

// Live data stream simulation
export const useMockLiveData = () => {
  const [agents, setAgents] = useState<AgentStatus[]>(MOCK_AGENTS);
  const [liveTasks, setLiveTasks] = useState<LiveTask[]>(MOCK_LIVE_TASKS);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        return prev.map(agent => {
          if (agent.status === 'analyzing') {
            return {
              ...agent,
              progress: Math.min(100, agent.progress + Math.random() * 15),
              confidence: Math.max(0.7, agent.confidence + (Math.random() - 0.5) * 0.05)
            };
          }
          return agent;
        });
      });

      // Simulate new tasks
      if (Math.random() > 0.85) {
        setLiveTasks(prev => [
          ...prev,
          {
            sessionId: `user-${Math.random().toString(36).slice(2)}`,
            goal: ['Monitor portfolio', 'Score wallet', 'Find loan'][Math.floor(Math.random()*3)],
            route: { agent: 'orchestrator', confidence: 0.95 },
            timeline: [{ agent: 'orchestrator', status: 'routing', timestamp: Date.now() }],
            hitlRequired: Math.random() > 0.7
          }
        ]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { agents, liveTasks };
};
