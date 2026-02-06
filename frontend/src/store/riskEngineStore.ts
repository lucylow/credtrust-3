 import { create } from 'zustand';
 import { persist } from 'zustand/middleware';
 
 export type RiskTier = 'A' | 'B' | 'C' | 'D';
 export type WorkflowStep = 0 | 1 | 2 | 3;
 export type EnclaveStatus = 'idle' | 'active' | 'computing' | 'error';
 export type ProofStatus = 'ready' | 'generating' | 'complete' | 'failed';
 
 export interface LoanNFT {
   id: string;
   amount: number;
   term: number;
   rate: number;
   scoreRange: string;
   tier: RiskTier;
   expiry: string;
   accesses: number;
   maxAccesses: number;
 }
 
 interface RiskEngineState {
   // Workflow
   step: WorkflowStep;
   setStep: (step: WorkflowStep) => void;
   nextStep: () => void;
   
   // Risk Score
   riskScore: number;
   riskTier: RiskTier;
   setRiskScore: (score: number) => void;
   
   // TEE Status
   teeStatus: {
     enclave: EnclaveStatus;
     batchCount: number;
     processingTime: number;
   };
   setTeeStatus: (status: Partial<RiskEngineState['teeStatus']>) => void;
   
   // Proof Status
   proofStatus: ProofStatus;
   proofProgress: number;
   setProofStatus: (status: ProofStatus) => void;
   setProofProgress: (progress: number) => void;
   
   // Protected Data
   protectedDataAddress?: string;
   encryptedHash?: string;
   setProtectedData: (address: string, hash: string) => void;
   
   // NFTs
   nfts: LoanNFT[];
   addNFT: (nft: LoanNFT) => void;
   grantAccess: (nftId: string) => void;
   
   // Reset
   reset: () => void;
 }
 
 const initialState = {
   step: 0 as WorkflowStep,
   riskScore: 0,
   riskTier: 'D' as RiskTier,
   teeStatus: { enclave: 'idle' as EnclaveStatus, batchCount: 0, processingTime: 0 },
   proofStatus: 'ready' as ProofStatus,
   proofProgress: 0,
   protectedDataAddress: undefined,
   encryptedHash: undefined,
   nfts: [] as LoanNFT[],
 };
 
 export const useRiskEngineStore = create<RiskEngineState>()(
   persist(
     (set, get) => ({
       ...initialState,
       
       setStep: (step) => set({ step }),
       
       nextStep: () => {
         const current = get().step;
         if (current < 3) {
           set({ step: (current + 1) as WorkflowStep });
         }
       },
       
       setRiskScore: (score) => {
         const tier: RiskTier = 
           score >= 750 ? 'A' : 
           score >= 700 ? 'B' : 
           score >= 650 ? 'C' : 'D';
         set({ riskScore: score, riskTier: tier });
       },
       
       setTeeStatus: (status) => 
         set((state) => ({ 
           teeStatus: { ...state.teeStatus, ...status } 
         })),
       
       setProofStatus: (status) => set({ proofStatus: status }),
       setProofProgress: (progress) => set({ proofProgress: progress }),
       
       setProtectedData: (address, hash) => 
         set({ protectedDataAddress: address, encryptedHash: hash }),
       
       addNFT: (nft) => 
         set((state) => ({ nfts: [...state.nfts, nft] })),
       
       grantAccess: (nftId) =>
         set((state) => ({
           nfts: state.nfts.map((nft) =>
             nft.id === nftId && nft.accesses < nft.maxAccesses
               ? { ...nft, accesses: nft.accesses + 1 }
               : nft
           ),
         })),
       
       reset: () => set(initialState),
     }),
     { name: 'credtrust-risk-engine' }
   )
 );