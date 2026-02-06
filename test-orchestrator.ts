import { StateMachineOrchestrator } from './src/orchestrator';

async function test() {
  const orchestrator = new StateMachineOrchestrator();
  const sessionId = 'test-session-' + Date.now();

  console.log('--- Step 1: Credit Score Request ---');
  const res1 = await orchestrator.processMessage(sessionId, 'I want to score my wallet', { wallet: '0x123' });
  console.log('Response:', res1.response);
  console.log('State:', res1.state.mode, 'Active Agent:', res1.state.activeAgent);

  console.log('\n--- Step 2: Risk Assessment (High Confidence) ---');
  const res2 = await orchestrator.processMessage(sessionId, 'Evaluate risk for this', {});
  console.log('Response:', res2.response);
  console.log('State:', res2.state.mode, 'Active Agent:', res2.state.activeAgent);

  console.log('\n--- Step 3: Lending Options ---');
  const res3 = await orchestrator.processMessage(sessionId, 'Find best loan options', {});
  console.log('Response:', res3.response);
  console.log('State:', res3.state.mode, 'Active Agent:', res3.state.activeAgent);
}

test().catch(console.error);
