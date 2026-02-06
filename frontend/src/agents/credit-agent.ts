import { StateGraph, END } from '@langchain/langgraph';
import { iexecClient } from '../lib/iexec-client';

interface CreditState {
  address?: string;
  walletScore?: number;
  needsPrivateData?: boolean;
  encryptedData?: any;
  teeScore?: number;
  enclaveProof?: string;
  nftId?: string;
}

const analyzeWalletActivity = async (address: string) => {
  console.log(`Analyzing wallet activity for ${address}`);
  // Mock analysis: random score between 300 and 850
  return Math.floor(Math.random() * (850 - 300 + 1)) + 300;
};

const mintCreditProof = async (score: number, proof?: string) => {
  console.log(`Minting Credit Proof NFT for score ${score}`);
  return { id: `NFT-${Math.floor(Math.random() * 1000000)}` };
};

export const creditAgent = new StateGraph<CreditState>({
  channels: {
    address: { value: (x, y) => y ?? x, default: () => '0x0000000000000000000000000000000000000000' },
    walletScore: { value: (x, y) => y ?? x, default: () => 0 },
    needsPrivateData: { value: (x, y) => y ?? x, default: () => false },
    encryptedData: { value: (x, y) => y ?? x, default: () => undefined },
    teeScore: { value: (x, y) => y ?? x, default: () => 0 },
    enclaveProof: { value: (x, y) => y ?? x, default: () => undefined },
    nftId: { value: (x, y) => y ?? x, default: () => undefined },
  }
})
  .addNode('analyzeWallet', async (state) => {
    const walletScore = await analyzeWalletActivity(state.address || '0x...');
    return { walletScore };
  })
  .addNode('requestPrivateData', async (state) => {
    const needsPrivateData = (state.walletScore || 0) < 650;
    return { needsPrivateData };
  })
  .addNode('teeCompute', async (state) => {
    if (state.needsPrivateData && state.encryptedData) {
      // In a real app, we'd encrypt and send to iExec
      const teeResult = await iexecClient.runCreditScoring(state.encryptedData);
      // For demo purposes, we'll wait for a mock score
      return { teeScore: 720, enclaveProof: 'ipfs://proof-hash' };
    }
    return { teeScore: state.walletScore };
  })
  .addNode('mintNFT', async (state) => {
    const nftTx = await mintCreditProof(state.teeScore || 0, state.enclaveProof);
    return { nftId: nftTx.id };
  })
  .addEdge('analyzeWallet', 'requestPrivateData')
  .addEdge('requestPrivateData', 'teeCompute')
  .addEdge('teeCompute', 'mintNFT')
  .addEdge('mintNFT', END)
  .setEntryPoint('analyzeWallet');
