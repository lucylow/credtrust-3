import { StateMachineOrchestrator } from '../../../orchestrator';

const orchestrator = new StateMachineOrchestrator();

export async function POST(req: Request) {
  try {
    const { sessionId, message, context } = await req.json();
    
    if (!sessionId || !message) {
      return Response.json({ error: 'Missing sessionId or message' }, { status: 400 });
    }

    const result = await orchestrator.processMessage(sessionId, message, context || {});
    
    return Response.json({
      response: result.response,
      state: result.state,
      routing: result.routing,
      latency: Date.now() - result.state.taskStartedAt
    });
  } catch (error: any) {
    console.error('Orchestrator error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
