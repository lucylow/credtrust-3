import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PrivacyJob {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'protected' | 'completed' | 'error';
  ipfs_hash: string | null;
  risk_tier: 'A' | 'B' | 'C' | 'D' | null;
  mrenclave: string | null;
  encrypted_data_hash: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export interface DisclosureToken {
  id: string;
  user_id: string;
  privacy_job_id: string | null;
  token_id: number;
  verifier_address: string;
  disclosure_level: 0 | 1 | 2;
  expires_at: string;
  used: boolean;
  used_at: string | null;
  revoked: boolean;
  created_at: string;
}

export interface Attestation {
  id: string;
  user_id: string;
  privacy_job_id: string | null;
  mrenclave: string;
  mr_signer: string | null;
  risk_tier: 'A' | 'B' | 'C' | 'D';
  chain_id: number;
  tx_hash: string | null;
  signature: string;
  is_valid: boolean;
  created_at: string;
}

export interface TEEJobResult {
  score: number;
  riskTier: 'A' | 'B' | 'C' | 'D';
  confidence: number;
  computeTime: number;
}

export function usePrivacy() {
  const queryClient = useQueryClient();

  // Fetch privacy jobs
  const { data: privacyJobs = [], isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['privacy-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('privacy_jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PrivacyJob[];
    },
  });

  // Fetch disclosure tokens
  const { data: disclosureTokens = [], isLoading: tokensLoading, refetch: refetchTokens } = useQuery({
    queryKey: ['disclosure-tokens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disclosure_tokens')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DisclosureToken[];
    },
  });

  // Fetch attestations
  const { data: attestations = [], isLoading: attestationsLoading, refetch: refetchAttestations } = useQuery({
    queryKey: ['attestations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attestations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Attestation[];
    },
  });

  // Submit TEE privacy job
  const submitPrivacyJob = useMutation({
    mutationFn: async (encryptedDataHash: string): Promise<{ jobId: string; result: TEEJobResult; attestation: Attestation }> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to submit a privacy job');
      }

      const { data, error } = await supabase.functions.invoke('tee-privacy-job', {
        body: { encryptedDataHash },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Job submission failed');

      return {
        jobId: data.jobId,
        result: data.result,
        attestation: data.attestation,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['attestations'] });
      toast.success('Privacy job completed', { description: 'Your data has been securely processed in the TEE.' });
    },
    onError: (error: Error) => {
      toast.error('Privacy job failed', { description: error.message });
    },
  });

  // Issue disclosure token
  const issueToken = useMutation({
    mutationFn: async (params: {
      verifierAddress: string;
      disclosureLevel: 0 | 1 | 2;
      expiresInDays: number;
      privacyJobId?: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to issue a token');
      }

      const { data, error } = await supabase.functions.invoke('disclosure-tokens', {
        body: params,
      });

      if (error) throw error;
      return data.token;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disclosure-tokens'] });
      toast.success('Token issued', { description: 'Disclosure token created successfully.' });
    },
    onError: (error: Error) => {
      toast.error('Failed to issue token', { description: error.message });
    },
  });

  // Revoke disclosure token
  const revokeToken = useMutation({
    mutationFn: async (tokenId: string) => {
      const { data, error } = await supabase
        .from('disclosure_tokens')
        .update({ revoked: true })
        .eq('id', tokenId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disclosure-tokens'] });
      toast.success('Token revoked');
    },
    onError: (error: Error) => {
      toast.error('Failed to revoke token', { description: error.message });
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const jobsChannel = supabase
      .channel('privacy-jobs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'privacy_jobs' },
        () => {
          refetchJobs();
        }
      )
      .subscribe();

    const tokensChannel = supabase
      .channel('disclosure-tokens-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'disclosure_tokens' },
        () => {
          refetchTokens();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(tokensChannel);
    };
  }, [refetchJobs, refetchTokens]);

  // Computed values
  const latestAttestation = attestations[0] || null;
  const totalJobs = privacyJobs.length;
  const activeTokens = disclosureTokens.filter(
    (t) => !t.used && !t.revoked && new Date(t.expires_at) > new Date()
  ).length;
  const dataProtected = totalJobs * 1.2; // Approximate MB per job

  return {
    // Data
    privacyJobs,
    disclosureTokens,
    attestations,
    latestAttestation,
    
    // Computed
    totalJobs,
    activeTokens,
    dataProtected,
    
    // Loading states
    isLoading: jobsLoading || tokensLoading || attestationsLoading,
    
    // Mutations
    submitPrivacyJob,
    issueToken,
    revokeToken,
    
    // Refetch
    refetchJobs,
    refetchTokens,
    refetchAttestations,
  };
}
