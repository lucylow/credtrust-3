import { useState, useCallback } from 'react';
import { encryptData, simulateTEEProcessing, EncryptedData } from '@/utils/encryption';
import { ProcessingStep, TEEResult, FinancialData } from '@/types';
import { TEE_WORKFLOW_STEPS } from '@/utils/constants';

export function useTEE() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<TEEResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<ProcessingStep[]>(
    TEE_WORKFLOW_STEPS.map(step => ({
      id: step.id,
      title: step.title,
      description: step.description,
      status: 'pending',
    }))
  );

  const updateStepStatus = useCallback(
    (stepId: number, status: ProcessingStep['status']) => {
      setSteps(prev =>
        prev.map(step =>
          step.id === stepId
            ? { ...step, status, timestamp: Date.now() }
            : step
        )
      );
    },
    []
  );

  const processData = useCallback(
    async (data: FinancialData): Promise<TEEResult | null> => {
      setIsProcessing(true);
      setError(null);
      setResult(null);
      setCurrentStep(0);

      // Reset all steps
      setSteps(
        TEE_WORKFLOW_STEPS.map(step => ({
          id: step.id,
          title: step.title,
          description: step.description,
          status: 'pending',
        }))
      );

      try {
        // Step 1: Local Encryption
        setCurrentStep(1);
        updateStepStatus(1, 'processing');
        await new Promise(resolve => setTimeout(resolve, 800));
        const encryptedData = await encryptData(JSON.stringify(data));
        updateStepStatus(1, 'completed');

        // Step 2: TEE Enclave
        setCurrentStep(2);
        updateStepStatus(2, 'processing');
        await new Promise(resolve => setTimeout(resolve, 600));
        updateStepStatus(2, 'completed');

        // Step 3: Private Computation
        setCurrentStep(3);
        updateStepStatus(3, 'processing');
        const teeResult = await simulateTEEProcessing(encryptedData);
        updateStepStatus(3, 'completed');

        // Step 4: Attestation
        setCurrentStep(4);
        updateStepStatus(4, 'processing');
        await new Promise(resolve => setTimeout(resolve, 500));
        updateStepStatus(4, 'completed');

        // Step 5: NFT Minting (simulated)
        setCurrentStep(5);
        updateStepStatus(5, 'processing');
        await new Promise(resolve => setTimeout(resolve, 700));
        updateStepStatus(5, 'completed');

        const finalResult: TEEResult = {
          score: teeResult.score,
          attestation: teeResult.attestation,
          timestamp: Date.now(),
          encryptedDataHash: encryptedData.hash,
        };

        setResult(finalResult);
        return finalResult;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'TEE processing failed';
        setError(errorMessage);
        
        // Mark current step as error
        updateStepStatus(currentStep, 'error');
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [currentStep, updateStepStatus]
  );

  const reset = useCallback(() => {
    setIsProcessing(false);
    setCurrentStep(0);
    setResult(null);
    setError(null);
    setSteps(
      TEE_WORKFLOW_STEPS.map(step => ({
        id: step.id,
        title: step.title,
        description: step.description,
        status: 'pending',
      }))
    );
  }, []);

  return {
    isProcessing,
    currentStep,
    steps,
    result,
    error,
    processData,
    reset,
  };
}
