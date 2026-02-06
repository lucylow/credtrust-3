import { AgentType } from "../agents/AgentRegistry";

export interface OrchestratorState {
  sessionId: string;
  mode: 'orchestrator' | 'agent_active';
  activeAgent: AgentType | null;
  taskStartedAt: number;
  taskHistory: string[];
  hitlPending: boolean;
  context: any;
}

export class SessionManager {
  private sessions = new Map<string, OrchestratorState>();

  async get(sessionId: string): Promise<OrchestratorState> {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        mode: 'orchestrator',
        activeAgent: null,
        taskStartedAt: 0,
        taskHistory: [],
        hitlPending: false,
        context: {}
      };
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  async update(sessionId: string, state: Partial<OrchestratorState>) {
    const current = await this.get(sessionId);
    const updated = { ...current, ...state };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  async listActive(): Promise<OrchestratorState[]> {
    return Array.from(this.sessions.values())
      .filter(s => s.mode === 'agent_active');
  }
}
