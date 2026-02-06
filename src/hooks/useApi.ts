// React hooks for API integration with loading/error states

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type ApiResponse } from '@/lib/api';

// Health check hook
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await api.checkHealth();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    retry: 1,
    staleTime: 30000,
  });
}

// Tranche prices hook with polling
export function useTranchePrices(pollInterval = 5000) {
  return useQuery({
    queryKey: ['tranche-prices'],
    queryFn: async () => {
      const response = await api.getTranchePrices();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    refetchInterval: pollInterval,
    staleTime: pollInterval / 2,
  });
}

// HSM status hook
export function useHSMStatus() {
  return useQuery({
    queryKey: ['hsm-status'],
    queryFn: async () => {
      const response = await api.getHSMStatus();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 60000,
  });
}

// TEE protect data mutation
export function useProtectData() {
  const [progress, setProgress] = useState(0);
  
  const mutation = useMutation({
    mutationFn: async ({ data, wallet }: { data: object; wallet: string }) => {
      setProgress(10);
      const response = await api.protectData(data, wallet);
      setProgress(100);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onError: () => setProgress(0),
  });

  return {
    ...mutation,
    progress,
    protect: mutation.mutate,
    protectAsync: mutation.mutateAsync,
  };
}

// TEE job execution mutation with polling
export function useRunTEEJob() {
  const [jobProgress, setJobProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState<string>('idle');

  const mutation = useMutation({
    mutationFn: async (ipfsHash: string) => {
      setJobStatus('submitting');
      setJobProgress(5);
      
      // Submit job
      const submitResponse = await api.runTEEJob(ipfsHash);
      if (!submitResponse.success) throw new Error(submitResponse.error);
      
      const { taskId } = submitResponse.data!;
      setJobStatus('processing');
      setJobProgress(10);
      
      // Poll for completion
      const maxAttempts = 60;
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, 1000));
        
        const statusResponse = await api.getTEEJobStatus(taskId);
        if (!statusResponse.success) continue;
        
        const { status, progress, result } = statusResponse.data!;
        setJobProgress(Math.max(10, progress));
        setJobStatus(status);
        
        if (status === 'COMPLETED' && result) {
          setJobProgress(100);
          return result;
        }
        
        if (status === 'FAILED') {
          throw new Error('TEE job failed');
        }
      }
      
      throw new Error('TEE job timed out');
    },
    onError: () => {
      setJobStatus('error');
    },
  });

  const reset = useCallback(() => {
    setJobProgress(0);
    setJobStatus('idle');
    mutation.reset();
  }, [mutation]);

  return {
    ...mutation,
    jobProgress,
    jobStatus,
    reset,
    run: mutation.mutate,
    runAsync: mutation.mutateAsync,
  };
}

// Mint tranche position mutation
export function useMintPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tranche,
      amount,
      wallet,
    }: {
      tranche: 'senior' | 'junior' | 'equity';
      amount: number;
      wallet: string;
    }) => {
      const response = await api.mintTranchePosition(tranche, amount, wallet);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['tranche-prices'] });
    },
  });
}

// Generic API hook for custom endpoints
export function useApiRequest<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await requestFn();
      if (response.success && response.data) {
        setData(response.data);
        return response.data;
      } else {
        setError(response.error || 'Request failed');
        return null;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, execute, reset };
}
