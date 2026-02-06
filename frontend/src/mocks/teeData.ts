// Mock TEE Execution and ZK Proof Data
import type { ZKProof, ContractEvent, APIResponse, RiskTier } from '@/types/borrower.types';

// Mock MRENCLAVE values (these would come from real iExec TEE)
const MOCK_MRENCLAVES = [
  '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
  '0xf0e1d2c3b4a5968778695a4b3c2d1e0f0e1d2c3b4a5968778695a4b3c2d1e0f',
  '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
];

// Generate mock ZK proof
export function generateMockZKProof(score: number, tier: RiskTier): ZKProof {
  const randomHex = (length: number) => 
    Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  return {
    proof_id: `proof-${randomHex(16)}`,
    score,
    tier,
    public_inputs: [score, tier.charCodeAt(0), Date.now()],
    proof: {
      pi_a: [`0x${randomHex(64)}`, `0x${randomHex(64)}`],
      pi_b: [
        [`0x${randomHex(64)}`, `0x${randomHex(64)}`],
        [`0x${randomHex(64)}`, `0x${randomHex(64)}`],
      ],
      pi_c: [`0x${randomHex(64)}`, `0x${randomHex(64)}`],
    },
    verification_key: {
      alpha: [`0x${randomHex(64)}`, `0x${randomHex(64)}`],
      beta: [
        [`0x${randomHex(64)}`, `0x${randomHex(64)}`],
        [`0x${randomHex(64)}`, `0x${randomHex(64)}`],
      ],
      gamma: [`0x${randomHex(64)}`, `0x${randomHex(64)}`],
      delta: [`0x${randomHex(64)}`, `0x${randomHex(64)}`],
      gamma_abc_g1: [`0x${randomHex(64)}`, `0x${randomHex(64)}`, `0x${randomHex(64)}`],
    },
    mrenclave: MOCK_MRENCLAVES[Math.floor(Math.random() * MOCK_MRENCLAVES.length)],
    generated_at: new Date().toISOString(),
  };
}

// Generate mock contract event
export function generateMockContractEvent(
  tokenId: number,
  borrower: string,
  score: number,
  tier: RiskTier
): ContractEvent {
  const randomHex = (length: number) => 
    Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  return {
    tokenId,
    borrower,
    score,
    tier,
    zk_proof_hash: `0x${randomHex(64)}`,
    mrenclave: MOCK_MRENCLAVES[Math.floor(Math.random() * MOCK_MRENCLAVES.length)],
    blockNumber: 10000000 + Math.floor(Math.random() * 1000000),
    timestamp: new Date().toISOString(),
  };
}

// Mock API response for TEE task submission
export function generateMockAPIResponse(taskId?: string): APIResponse {
  const statuses: APIResponse['status'][] = ['accepted', 'PENDING', 'PROCESSING', 'COMPLETED'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    task_id: taskId || `task-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    status,
    progress: status === 'COMPLETED' ? 100 : Math.floor(Math.random() * 80),
    estimated_duration: Math.floor(Math.random() * 30) + 5,
    zero_trust_context: {
      client_type: 'browser',
      verified_mrenclave: MOCK_MRENCLAVES[0],
      session_valid: true,
    },
    token_id: status === 'COMPLETED' ? Math.floor(Math.random() * 10000) : undefined,
    zk_proof_hash: status === 'COMPLETED' 
      ? `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}` 
      : undefined,
  };
}

// Mock recent TEE executions for dashboard
export interface TEEExecution {
  id: string;
  borrower_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  score?: number;
  tier?: RiskTier;
  duration_ms?: number;
  timestamp: string;
  mrenclave?: string;
}

export function generateMockTEEExecutions(count = 10): TEEExecution[] {
  const statuses: TEEExecution['status'][] = ['pending', 'processing', 'completed', 'completed', 'completed', 'failed'];
  const tiers: RiskTier[] = ['A', 'B', 'C', 'D'];
  
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isCompleted = status === 'completed';
    const score = isCompleted ? Math.floor(Math.random() * 300) + 550 : undefined;
    
    return {
      id: `exec-${Date.now() - i * 60000}-${Math.random().toString(36).substring(2, 6)}`,
      borrower_id: `borrower-${Math.random().toString(36).substring(2, 10)}`,
      status,
      score,
      tier: score ? (score >= 750 ? 'A' : score >= 700 ? 'B' : score >= 650 ? 'C' : 'D') : undefined,
      duration_ms: isCompleted ? Math.floor(Math.random() * 2000) + 500 : undefined,
      timestamp: new Date(Date.now() - i * 60000 * Math.random() * 10).toISOString(),
      mrenclave: isCompleted ? MOCK_MRENCLAVES[Math.floor(Math.random() * MOCK_MRENCLAVES.length)] : undefined,
    };
  });
}

// Dashboard statistics
export interface TEEDashboardStats {
  totalExecutions: number;
  successRate: number;
  avgDuration: number;
  activeTasks: number;
  scoreDistribution: Record<RiskTier, number>;
}

export function getTEEDashboardStats(): TEEDashboardStats {
  const executions = generateMockTEEExecutions(100);
  const completed = executions.filter(e => e.status === 'completed');
  
  const scoreDistribution: Record<RiskTier, number> = { A: 0, B: 0, C: 0, D: 0 };
  completed.forEach(e => {
    if (e.tier) scoreDistribution[e.tier]++;
  });
  
  return {
    totalExecutions: 3892,
    successRate: 98.7,
    avgDuration: 1247,
    activeTasks: executions.filter(e => e.status === 'processing').length,
    scoreDistribution,
  };
}
