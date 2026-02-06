// src/elizaos-orchestrator.ts
import { HITLCreditAgent } from './agents/credit-agent-hitl';

// Mocking ElizaAgent as it might not be fully installed/available in the expected path
// based on the issue description provided.
class ElizaAgent {
    async processGoal(goal: string): Promise<string> {
        return `Processed goal: ${goal}`;
    }
    
    parseGoal(goal: string): any {
        // Simple mock parser
        if (goal.includes('score wallet')) {
            const parts = goal.split(' ');
            return {
                action: 'score_wallet',
                wallet: parts[2],
                amount: parseInt(parts[4].replace('$', '').replace(',', ''))
            };
        }
        return {};
    }
}

export class DiscordHITLOrchestrator extends ElizaAgent {
  private creditAgent = new HITLCreditAgent();

  async processGoal(goal: string) {
    const parsed = this.parseGoal(goal);
    
    if (parsed.action === 'score_wallet') {
      try {
        const result = await this.creditAgent.scoreWalletWithHITL(
          parsed.wallet, 
          parsed.amount
        );
        
        return `✅ Credit score ${result.score} (${result.tier}) - Discord HITL approved`;
      } catch (error: any) {
        return `❌ Action failed: ${error.message}`;
      }
    }
    
    return super.processGoal(goal);
  }
}
