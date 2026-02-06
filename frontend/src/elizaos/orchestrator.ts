// src/elizaos/orchestrator.ts
import { AgentPool } from './agents/AgentPool';
import { CrossAgentMemory } from './memory';

interface TDXTaskInput {
  goal: string;
  wallet?: string;
  amount?: number;
}

interface TDXTaskResult {
  agent: string;
  result: any;
  mrenclave: string;
  confidence: number;
  hitlRequired: boolean;
}

export class ElizaTDXOrchestrator {
  private agentPool: AgentPool;
  private memory: CrossAgentMemory;

  constructor() {
    this.agentPool = new AgentPool();
    this.memory = new CrossAgentMemory();
  }

  async processGoal(input: TDXTaskInput): Promise<TDXTaskResult> {
    console.log(`🎯 ElizaOS processing: "${input.goal}" in TDX`);
    
    // 1. ROUTE TO SPECIALIZED AGENT
    const route = await this.routeToAgent(input);
    
    // 2. EXECUTE IN TDX TRUST DOMAIN
    const agent = this.agentPool.get(route.agent);
    const result = await agent.execute(input);
    
    // 3. HITL CHECK (High-value transactions)
    const hitlRequired = this.requiresHITL(result, input);
    
    // 4. MEMORY UPDATE
    await this.memory.recordExecution(route.agent, input, result);
    
    return {
      agent: route.agent,
      result,
      mrenclave: process.env.IEXEC_MRENCLAVE || '0x...',
      confidence: route.confidence,
      hitlRequired
    };
  }

  private async routeToAgent(input: TDXTaskInput) {
    const goal = input.goal.toLowerCase();
    
    if (goal.includes('score') || goal.includes('credit')) return { agent: 'credit', confidence: 0.98 };
    if (goal.includes('loan') || goal.includes('borrow')) return { agent: 'lending', confidence: 0.95 };
    if (goal.includes('risk') || goal.includes('ltv')) return { agent: 'risk', confidence: 0.97 };
    
    return { agent: 'general', confidence: 0.90 };
  }

  private requiresHITL(result: any, input: TDXTaskInput): boolean {
    return (input.amount && input.amount > 50000) || 
           (result.score && result.score < 650) ||
           result.riskLevel === 'HIGH';
  }
}
