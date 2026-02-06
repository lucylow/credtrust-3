import { StateGraph, END } from '@langchain/langgraph';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { creditAgent } from './credit-agent';
import { lendingAgent } from './lending-agent';
import { riskAgent } from './risk-agent';

// Define the state for the orchestrator
interface AgentState {
  messages: any[];
  intent?: string;
  userId?: string;
  result?: any;
}

export const orchestrator = new StateGraph<AgentState>({
  channels: {
    messages: {
      value: (x: any[], y: any[]) => x.concat(y),
      default: () => [],
    },
    intent: {
      value: (x?: string, y?: string) => y ?? x,
      default: () => undefined,
    },
    userId: {
      value: (x?: string, y?: string) => y ?? x,
      default: () => undefined,
    },
    result: {
      value: (x?: any, y?: any) => y ?? x,
      default: () => undefined,
    },
  },
})
  .addNode('classifyIntent', async (state) => {
    const lastMessage = state.messages[state.messages.length - 1].content;
    
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Classify the user intent from this message: "${lastMessage}". 
      Categories: credit_score, find_loan, portfolio, general. 
      Respond with ONLY the category name.`,
    });
    
    return { intent: text.trim().toLowerCase() };
  })
  .addNode('routeToAgent', async (state) => {
    switch (state.intent) {
      case 'credit_score':
        const creditResult = await (creditAgent as any).compile().invoke(state);
        return { result: creditResult, messages: [{ role: 'assistant', content: 'Processing your credit score...' }] };
      case 'find_loan':
        const lendingResult = await (lendingAgent as any).compile().invoke(state);
        return { result: lendingResult, messages: [{ role: 'assistant', content: 'Finding the best loan for you...' }] };
      case 'portfolio':
        // Risk agent monitoring call
        const riskResult = await riskAgent.monitorPortfolio(state.userId || 'demo-user');
        return { result: riskResult, messages: [{ role: 'assistant', content: 'Analyzing your portfolio risk...' }] };
      default:
        return { messages: [{ role: 'assistant', content: "I'm not sure how to help with that. I can help with credit scoring, finding loans, or monitoring your portfolio." }] };
    }
  })
  .addEdge('classifyIntent', 'routeToAgent')
  .addEdge('routeToAgent', END)
  .setEntryPoint('classifyIntent');
