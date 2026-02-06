import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PrivacyJob, DisclosureToken, PrivacyAttestation } from '@/types/privacy.types';

interface PrivacyState {
  privacyJobs: PrivacyJob[];
  disclosureTokens: DisclosureToken[];
  latestAttestation: PrivacyAttestation | null;
  totalJobs: number;
  dataProtected: number;
  anonymizeData: boolean;
  autoRevokeTokens: boolean;

  // Actions
  addPrivacyJob: (job: PrivacyJob) => void;
  updateJobStatus: (jobId: string, status: PrivacyJob['status']) => void;
  addDisclosureToken: (token: DisclosureToken) => void;
  revokeToken: (tokenId: number) => void;
  toggleAnonymize: () => void;
  toggleAutoRevoke: () => void;
  deleteAllData: () => void;
}

// Sample disclosure tokens for demo
const sampleTokens: DisclosureToken[] = [
  {
    id: 'token-1',
    tokenId: 1001,
    verifier: '0x742d35Cc6634C0532925a3b844Bc9e7595f2e5B8',
    disclosureLevel: 0,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    used: false,
  },
  {
    id: 'token-2',
    tokenId: 1002,
    verifier: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    disclosureLevel: 1,
    expiresAt: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days
    used: false,
  },
  {
    id: 'token-3',
    tokenId: 1003,
    verifier: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    disclosureLevel: 2,
    expiresAt: Date.now() - 24 * 60 * 60 * 1000, // Expired
    used: true,
  },
];

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      privacyJobs: [],
      disclosureTokens: sampleTokens,
      latestAttestation: {
        mrenclave: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        riskTier: 'A',
        chainId: 421614,
        timestamp: Date.now(),
        signature: '0x1234567890abcdef...',
      },
      totalJobs: 12,
      dataProtected: 12.4,
      anonymizeData: true,
      autoRevokeTokens: true,

      addPrivacyJob: (job) =>
        set((state) => ({
          privacyJobs: [job, ...state.privacyJobs.slice(0, 9)],
          totalJobs: state.totalJobs + 1,
          latestAttestation: {
            mrenclave: job.mrenclave,
            riskTier: job.riskTier,
            chainId: 421614,
            timestamp: Date.now(),
            signature: '0x' + Math.random().toString(16).slice(2),
          },
        })),

      updateJobStatus: (jobId, status) =>
        set((state) => ({
          privacyJobs: state.privacyJobs.map((job) =>
            job.id === jobId ? { ...job, status } : job
          ),
        })),

      addDisclosureToken: (token) =>
        set((state) => ({
          disclosureTokens: [token, ...state.disclosureTokens.slice(0, 19)],
        })),

      revokeToken: (tokenId) =>
        set((state) => ({
          disclosureTokens: state.disclosureTokens.map((token) =>
            token.tokenId === tokenId ? { ...token, used: true } : token
          ),
        })),

      toggleAnonymize: () =>
        set((state) => ({
          anonymizeData: !state.anonymizeData,
        })),

      toggleAutoRevoke: () =>
        set((state) => ({
          autoRevokeTokens: !state.autoRevokeTokens,
        })),

      deleteAllData: () =>
        set({
          privacyJobs: [],
          disclosureTokens: [],
          totalJobs: 0,
          latestAttestation: null,
        }),
    }),
    { name: 'credtrust-privacy-storage' }
  )
);
