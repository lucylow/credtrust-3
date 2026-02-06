import { useState, useEffect } from 'react';

// lib/multiAgentMockData.ts - 100% Frontend Mock Data
export interface Agent {
  id: string;
  name: string;
  type: 'credit' | 'lending' | 'risk' | 'execution' | 'orchestrator';
  avatar: string;
  status: 'idle' | 'planning' | 'executing' | 'waiting-hitl' | 'completed' | 'error';
  confidence: number;
  priority: number;
  capabilities: string[];
  framework?: string;
}

export type PoCoTaskStatus = 
  | 'RECEIVED' | 'INITIALIZING' | 'INITIALIZED' | 'RUNNING' | 'CONSENSUS_REACHED' 
  | 'AT_LEAST_ONE_REVEALED' | 'RESULT_UPLOADING' | 'RESULT_UPLOADED' | 'FINALIZING' 
  | 'FINALIZED' | 'COMPLETED' | 'INITIALIZE_FAILED' | 'RUNNING_FAILED' 
  | 'CONTRIBUTION_TIMEOUT' | 'RESULT_UPLOAD_TIMEOUT' | 'FINALIZE_FAILED' 
  | 'FINAL_DEADLINE_REACHED' | 'FAILED';

export type PoCoReplicateStatus =
  | 'CREATED' | 'STARTING' | 'STARTED' | 'START_FAILED' | 'APP_DOWNLOADING' 
  | 'APP_DOWNLOADED' | 'APP_DOWNLOAD_FAILED' | 'DATA_DOWNLOADING' | 'DATA_DOWNLOADED' 
  | 'DATA_DOWNLOAD_FAILED' | 'COMPUTING' | 'COMPUTED' | 'COMPUTE_FAILED' 
  | 'CONTRIBUTING' | 'CONTRIBUTE_FAILED' | 'CONTRIBUTED' | 'REVEALING' 
  | 'REVEALED' | 'REVEAL_FAILED' | 'RESULT_UPLOAD_REQUESTED' | 'RESULT_UPLOADING' 
  | 'RESULT_UPLOAD_FAILED' | 'RESULT_UPLOADED' | 'CONTRIBUTE_AND_FINALIZE_ONGOING' 
  | 'CONTRIBUTE_AND_FINALIZE_DONE' | 'CONTRIBUTE_AND_FINALIZE_FAILED' | 'COMPLETING' 
  | 'COMPLETED' | 'COMPLETE_FAILED' | 'FAILED' | 'ABORTED' | 'RECOVERING' | 'WORKER_LOST';

export interface Task {
  id: string;
  sessionId: string;
  goal: string;
  status: PoCoTaskStatus;
  failureCause?: string;
  route: {
    primaryAgent: string;
    backupAgent: string;
    confidence: number;
  };
  timeline: TaskStep[];
  metrics: {
    estimatedCost: number; // RLC
    executionTime: number; // seconds
    hitlRequired: boolean;
  };
}

export interface TaskStep {
  agentId: string;
  step: string;
  status: PoCoReplicateStatus;
  timestamp: number;
  result?: any;
  duration?: number;
  failureCause?: string;
}

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'credit-1',
    name: 'Credit Analyst Alpha',
    type: 'credit',
    avatar: '🧮',
    status: 'executing',
    confidence: 0.94,
    priority: 1,
    capabilities: ['wallet-scoring', 'onchain-analysis', 'credit-risk'],
    framework: 'TensorFlow 2.19.0'
  },
  {
    id: 'lending-1', 
    name: 'Loan Optimizer Beta',
    type: 'lending',
    avatar: '🏦',
    status: 'waiting-hitl',
    confidence: 0.89,
    priority: 2,
    capabilities: ['loan-discovery', 'apr-optimization', 'pool-analysis'],
    framework: 'Scikit-learn 1.6.1'
  },
  {
    id: 'risk-1',
    name: 'Risk Guardian Gamma',
    type: 'risk',
    avatar: '🛡️',
    status: 'planning',
    confidence: 0.97,
    priority: 3,
    capabilities: ['ltv-monitoring', 'liquidation-prevention', 'portfolio-health'],
    framework: 'PyTorch 2.7.0'
  },
  {
    id: 'execution-1',
    name: 'Execution Engine Delta',
    type: 'execution',
    avatar: '⚡',
    status: 'idle',
    confidence: 0.99,
    priority: 4,
    capabilities: ['tx-execution', 'contract-calls', 'signature-management']
  },
  {
    id: 'orchestrator-1',
    name: 'Master Orchestrator',
    type: 'orchestrator',
    avatar: '🎛️',
    status: 'routing',
    confidence: 1.0,
    priority: 0,
    capabilities: ['task-decomposition', 'agent-coordination', 'dynamic-routing']
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-001',
    sessionId: 'user-alice-001',
    goal: 'Score wallet 0x1234... and find optimal loan under 4.5% APR with LTV < 70%',
    status: 'RUNNING',
    route: {
      primaryAgent: 'orchestrator-1',
      backupAgent: 'credit-1',
      confidence: 0.98
    },
    timeline: [
      { agentId: 'orchestrator-1', step: 'Task decomposition', status: 'COMPLETED', timestamp: Date.now() - 120000, duration: 2.3 },
      { agentId: 'credit-1', step: 'Wallet scoring', status: 'COMPUTING', timestamp: Date.now() - 85000, duration: undefined },
      { agentId: 'lending-1', step: 'Loan discovery', status: 'STARTING', timestamp: Date.now() - 30000 },
      { agentId: 'risk-1', step: 'Risk assessment', status: 'CREATED', timestamp: Date.now() },
    ],
    metrics: {
      estimatedCost: 0.045,
      executionTime: 145,
      hitlRequired: true
    }
  },
  {
    id: 'task-002',
    sessionId: 'user-bob-002',
    goal: 'Monitor portfolio LTV continuously and auto-liquidate if > 85%',
    status: 'RUNNING_FAILED',
    failureCause: 'TEE_SESSION_GENERATION_INVALID_AUTHORIZATION',
    route: {
      primaryAgent: 'risk-1',
      backupAgent: 'execution-1', 
      confidence: 0.96
    },
    timeline: [
      { agentId: 'risk-1', step: 'LTV calculation', status: 'COMPUTED', timestamp: Date.now() - 180000, duration: 4.1 },
      { agentId: 'execution-1', step: 'Liquidation proposal', status: 'COMPUTE_FAILED', timestamp: Date.now() - 45000, duration: undefined, failureCause: 'TEE_SESSION_GENERATION_INVALID_AUTHORIZATION' }
    ],
    metrics: {
      estimatedCost: 0.023,
      executionTime: 225,
      hitlRequired: true
    }
  },
  {
    id: 'task-003',
    sessionId: 'user-charlie-003',
    goal: 'Execute $15k loan at best available rate',
    status: 'COMPLETED',
    route: {
      primaryAgent: 'lending-1',
      backupAgent: 'execution-1',
      confidence: 0.92
    },
    timeline: [
      { agentId: 'lending-1', step: 'APR optimization', status: 'COMPLETED', timestamp: Date.now() - 300000, duration: 3.8 },
      { agentId: 'execution-1', step: 'Transaction broadcast', status: 'COMPLETED', timestamp: Date.now() - 270000, duration: 1.2, result: { txHash: '0xabc123...' } }
    ],
    metrics: {
      estimatedCost: 0.012,
      executionTime: 32,
      hitlRequired: false
    }
  }
];

// Real-time data simulation
export function useMultiAgentMockData() {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [stats, setStats] = useState({
    activeAgents: 3,
    liveTasks: 2,
    totalSessions: 47,
    rlcSpent: 2.34,
    hitlInterventions: 12
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Update agent statuses
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'executing') {
          const progress = Math.random() > 0.7 ? 
            Math.min(100, agent.confidence * 100 + Math.random() * 10) : 
            agent.confidence * 100;
          
          if (progress >= 95) {
            return { ...agent, status: 'completed', confidence: 0.98 };
          }
          return { ...agent, confidence: Math.max(0.7, agent.confidence + (Math.random() - 0.5) * 0.03) };
        }
        if (Math.random() > 0.98) {
          return { ...agent, status: 'executing' as const };
        }
        return agent;
      }));

      // Update task timelines
      setTasks(prev => prev.map(task => ({
        ...task,
        timeline: task.timeline.map(step => {
          if (step.status === 'COMPUTING' && Math.random() > 0.8) {
            return { ...step, status: 'COMPUTED' as const, duration: Math.random() * 5 + 1 };
          }
          if (step.status === 'STARTING' && Math.random() > 0.8) {
            return { ...step, status: 'COMPUTING' as const, timestamp: Date.now() };
          }
          return step;
        })
      })));

      // Update stats
      setStats(prev => ({
        ...prev,
        activeAgents: Math.floor(Math.random() * 5) + 1,
        liveTasks: Math.floor(Math.random() * 4) + 1,
        rlcSpent: Number((prev.rlcSpent + Math.random() * 0.01).toFixed(2))
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return { agents, tasks, stats };
}
