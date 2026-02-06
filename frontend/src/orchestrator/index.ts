import { AgentRegistry, AgentType } from '../agents/AgentRegistry';
import { SessionManager, OrchestratorState } from '../state/SessionManager';

export interface RoutingResult {
  agent: AgentType;
  confidence: number;
  reasoning: string;
  requiresHITL?: boolean;
}

export class StateMachineOrchestrator {
  private agents: AgentRegistry;
  private sessions: SessionManager;
  private hitl: { requestApproval: (routing: RoutingResult) => Promise<void> };

  constructor() {
    this.agents = new AgentRegistry();
    this.sessions = new SessionManager();
    this.hitl = {
      requestApproval: async (routing) => {
        console.log(`[HITL] Requesting approval for ${routing.agent}`);
      }
    };
  }

  async processMessage(sessionId: string, message: string, context: any) {
    const state = await this.sessions.get(sessionId);

    if (state.mode === 'agent_active') {
      return this.handleAgentActiveMode(sessionId, message, state, context);
    }

    return this.handleOrchestratorMode(sessionId, message, context);
  }

  private async handleOrchestratorMode(sessionId: string, goal: string, context: any) {
    // 1. Route to specialized agent via LLM (Simulated here)
    const routing: RoutingResult = await this.classifyGoal(goal);

    if (routing.confidence < 0.7) {
      return {
        response: `Understood. For ${goal}, I recommend the ${routing.agent} agent (confidence: ${(routing.confidence * 100).toFixed(0)}%).`,
        state: await this.sessions.get(sessionId),
        routing
      };
    }

    // 2. Transition to agent_active mode
    const newState = {
      ...await this.sessions.get(sessionId),
      mode: 'agent_active' as const,
      activeAgent: routing.agent,
      taskStartedAt: Date.now(),
      hitlPending: routing.requiresHITL || false
    };

    if (routing.requiresHITL) {
      await this.hitl.requestApproval(routing);
    }

    await this.sessions.update(sessionId, newState);

    // 3. Forward to selected agent
    const agent = this.agents.get(newState.activeAgent);
    const response = await agent.process(goal, context);

    // If agent completed task immediately
    if (this.isTaskComplete(response)) {
        return this.handleCompletion(sessionId, response, newState);
    }

    return { response, state: newState, routing };
  }

  private async handleAgentActiveMode(
    sessionId: string,
    message: string,
    state: OrchestratorState,
    context: any
  ) {
    const agent = this.agents.get(state.activeAgent!);
    
    // Forward to active agent
    let response = await agent.process(message, context);
    
    // Check for task completion [TASK_COMPLETE]
    if (this.isTaskComplete(response)) {
      return this.handleCompletion(sessionId, response, state);
    }

    return {
      response,
      state,
      routing: { agent: state.activeAgent!, confidence: 1, reasoning: 'Continuing active task' }
    };
  }

  private async handleCompletion(sessionId: string, response: string, state: OrchestratorState) {
    const cleanResponse = this.removeCompletionMarker(response);
    
    // Return to orchestrator mode
    const newState: OrchestratorState = {
      ...state,
      mode: 'orchestrator',
      activeAgent: null,
      taskHistory: [...state.taskHistory, `${state.activeAgent} completed`],
      hitlPending: false
    };
    
    await this.sessions.update(sessionId, newState);
    
    return {
      response: `${cleanResponse}\n\n✅ Task complete! What's next?`,
      state: newState,
      routing: { agent: 'orchestrator' as AgentType, confidence: 1, reasoning: 'Task completed' }
    };
  }

  private async classifyGoal(goal: string): Promise<RoutingResult> {
    // Simulated classification logic
    const g = goal.toLowerCase();
    if (g.includes('score') || g.includes('credit')) {
      return { agent: 'credit', confidence: 0.95, reasoning: 'Request involves credit scoring' };
    }
    if (g.includes('loan') || g.includes('lending')) {
      return { agent: 'lending', confidence: 0.9, reasoning: 'Request involves lending' };
    }
    if (g.includes('risk')) {
      return { agent: 'risk', confidence: 0.85, reasoning: 'Request involves risk assessment', requiresHITL: true };
    }
    return { agent: 'orchestrator' as AgentType, confidence: 0.5, reasoning: 'Unclear intent' };
  }

  private isTaskComplete(response: string): boolean {
    return /\[TASK_COMPLETE\]/.test(response);
  }

  private removeCompletionMarker(response: string): string {
    return response.replace(/\[TASK_COMPLETE\]/gi, '').trim();
  }
}
