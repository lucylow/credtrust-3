// src/elizaos/agents/AgentPool.ts
import { CreditAgent } from './CreditAgent';
import { LendingAgent } from './LendingAgent';
import { RiskAgent } from './RiskAgent';

interface AgentCharacter {
  name: string;
  personality: string;
  capabilities: string[];
}

export class AgentPool {
  private agents: Map<string, any> = new Map();

  constructor() {
    this.register('credit', new CreditAgent());
    this.register('lending', new LendingAgent());
    this.register('risk', new RiskAgent());
  }

  private register(type: string, agent: any) {
    this.agents.set(type, agent);
  }

  get(agentType: string) {
    return this.agents.get(agentType);
  }
}
