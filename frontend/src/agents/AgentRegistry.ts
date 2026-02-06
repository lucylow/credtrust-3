// src/agents/AgentRegistry.ts
import { TDXCreditAgent } from './tdx/TDXCreditAgent';
import { TDXLendingAgent } from './tdx/TDXLendingAgent';
import { TDXRiskAgent } from './tdx/TDXRiskAgent';

export type AgentType = 'credit' | 'lending' | 'risk' | 'orchestrator';

export interface Agent {
  type: string;
  process: (goal: string, context: any) => Promise<string>;
  isSpecialized: boolean;
}

export class AgentRegistry {
  private agents: Map<string, Agent> = new Map();

  constructor() {
    this.register(new TDXCreditAgent());
    this.register(new TDXLendingAgent()); 
    this.register(new TDXRiskAgent());
  }

  register(agent: Agent) {
    this.agents.set(agent.type, agent);
  }

  get(agentType: string): Agent {
    const agent = this.agents.get(agentType);
    if (!agent) {
      throw new Error(`Agent ${agentType} not registered`);
    }
    return agent;
  }

  list(): Agent[] {
    return Array.from(this.agents.values());
  }
}
