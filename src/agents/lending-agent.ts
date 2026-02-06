import { StateGraph, END } from '@langchain/langgraph';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

interface LendingState {
  amount?: number;
  tier?: string;
  creditScore?: number;
  availableLoans?: any[];
  selectedLoan?: any;
  negotiationHistory?: any[];
  finalTerms?: any;
}

const getAvailableLoans = async (amount: number, tier: string) => {
  // Mock marketplace data
  return [
    { id: 'pool-1', lender: 'PoolX', apr: 4.5, maxLtv: 85, tier: 'A' },
    { id: 'pool-2', lender: 'PoolY', apr: 8.2, maxLtv: 70, tier: 'B' },
  ].filter(l => l.tier === tier);
};

export const lendingAgent = new StateGraph<LendingState>({
  channels: {
    amount: { value: (x, y) => y ?? x, default: () => 0 },
    tier: { value: (x, y) => y ?? x, default: () => 'B' },
    creditScore: { value: (x, y) => y ?? x, default: () => 700 },
    availableLoans: { value: (x, y) => y ?? x, default: () => [] },
    selectedLoan: { value: (x, y) => y ?? x, default: () => undefined },
    negotiationHistory: { value: (x, y) => (x ?? []).concat(y ?? []), default: () => [] },
    finalTerms: { value: (x, y) => y ?? x, default: () => undefined },
  }
})
  .addNode('scanMarketplace', async (state) => {
    const loans = await getAvailableLoans(state.amount || 5000, state.tier || 'B');
    return { availableLoans: loans };
  })
  .addNode('negotiateTerms', async (state) => {
    const loan = state.availableLoans?.[0];
    if (!loan) return { finalTerms: null };

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Negotiate loan terms for a user with credit score ${state.creditScore}. 
      Initial offer: ${loan.apr}% APR from ${loan.lender}. 
      Can you improve the APR for a Tier ${state.tier} user? 
      Respond with a final APR number only.`,
    });

    const finalApr = parseFloat(text);
    return { 
      finalTerms: { ...loan, apr: isNaN(finalApr) ? loan.apr : finalApr },
      negotiationHistory: [{ role: 'ai', content: `Negotiated APR to ${text}%` }]
    };
  })
  .addEdge('scanMarketplace', 'negotiateTerms')
  .addEdge('negotiateTerms', END)
  .setEntryPoint('scanMarketplace');
