import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { encryptData, simulateTEEProcessing, EncryptedData, mockECIESEncrypt, generateKeyRaw, bufToHex, encryptJSON } from '@/utils/crypto';
import { ProcessingStep, TEEResult, FinancialData } from '@/types';
import { TEE_WORKFLOW_STEPS } from '@/utils/constants';
import type { CreditApplicationData, ProofGenerationResult, SolidityProof } from '@/types/tee.types';

export type TEEStage = 
  | 'idle'
  | 'encrypting'
  | 'uploading'
  | 'submitting'
  | 'processing'
  | 'verifying'
  | 'complete'
  | 'error';

// Generate mock Groth16 proof
function generateMockGroth16Proof(): SolidityProof {
  const randomBigInt = () => BigInt('0x' + Array.from({ length: 64 }, () => 
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join(''));
  
  return {
    a: [randomBigInt(), randomBigInt()],
    b: [[randomBigInt(), randomBigInt()], [randomBigInt(), randomBigInt()]],
    c: [randomBigInt(), randomBigInt()],
    publicInputs: [BigInt(1)],
  };
}

// Calculate credit score from application data
function calculateCreditScore(data: CreditApplicationData): { score: number; tier: 'A' | 'B' | 'C' | 'D' } {
  let score = 300;
  score += Math.min(200, Math.floor((data.income || 0) / 500));
  score += Math.min(100, Math.floor((data.employmentMonths || 0) / 2));
  const dti = (data.existingDebt || 0) / (data.income || 1);
  score += Math.max(0, Math.floor(150 * (1 - dti)));
  if (data.walletAge) score += Math.min(50, Math.floor(data.walletAge / 30));
  if (data.txCount90d) score += Math.min(30, data.txCount90d);
  if (data.paymentHistoryGood) score += 70;
  if (data.recentInquiries !== undefined) score -= data.recentInquiries * 10;
  score = Math.max(300, Math.min(850, score));
  
  let tier: 'A' | 'B' | 'C' | 'D';
  if (score >= 750) tier = 'A';
  else if (score >= 700) tier = 'B';
  else if (score >= 650) tier = 'C';
  else tier = 'D';
  
  return { score, tier };
}

export function useTEE() {
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<TEEResult | null>(null);
  const [proofResult, setProofResult] = useState<ProofGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<TEEStage>('idle');
  const [progress, setProgress] = useState(0);
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
      setStage('encrypting');
      setProgress(0);

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
        setProgress(10);
        await new Promise(resolve => setTimeout(resolve, 800));
        const encryptedData = await encryptData(JSON.stringify(data));
        updateStepStatus(1, 'completed');
        setProgress(25);

        // Step 2: TEE Enclave
        setCurrentStep(2);
        setStage('submitting');
        updateStepStatus(2, 'processing');
        await new Promise(resolve => setTimeout(resolve, 600));
        updateStepStatus(2, 'completed');
        setProgress(40);

        // Step 3: Private Computation
        setCurrentStep(3);
        setStage('processing');
        updateStepStatus(3, 'processing');
        const teeResult = await simulateTEEProcessing(encryptedData);
        updateStepStatus(3, 'completed');
        setProgress(65);

        // Step 4: Attestation
        setCurrentStep(4);
        setStage('verifying');
        updateStepStatus(4, 'processing');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate proof result
        const proof = generateMockGroth16Proof();
        const randomHex = (len: number) => Array.from({ length: len }, () => 
          '0123456789abcdef'[Math.floor(Math.random() * 16)]
        ).join('');
        
        const generatedProof: ProofGenerationResult = {
          proof,
          publicInputHash: `0x${randomHex(64)}` as `0x${string}`,
          metadataCIDBytes32: `0x${randomHex(64)}` as `0x${string}`,
          attPayloadHex: `0x${randomHex(128)}` as `0x${string}`,
          attSigHex: `0x${randomHex(130)}` as `0x${string}`,
          score: teeResult.score,
          tier: teeResult.score >= 750 ? 'A' : teeResult.score >= 700 ? 'B' : teeResult.score >= 650 ? 'C' : 'D',
        };
        setProofResult(generatedProof);
        
        updateStepStatus(4, 'completed');
        setProgress(85);

        // Step 5: NFT Minting (simulated)
        setCurrentStep(5);
        updateStepStatus(5, 'processing');
        await new Promise(resolve => setTimeout(resolve, 700));
        updateStepStatus(5, 'completed');
        setProgress(100);
        setStage('complete');

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
        setStage('error');
        updateStepStatus(currentStep, 'error');
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [currentStep, updateStepStatus]
  );

  // Quick proof generation for applications
  const generateProofQuick = useCallback(async (
    applicationData: CreditApplicationData
  ): Promise<ProofGenerationResult> => {
    if (!address) throw new Error('Wallet not connected');

    setIsProcessing(true);
    setStage('processing');
    setProgress(0);
    setError(null);

    try {
      setProgress(20);
      await new Promise(r => setTimeout(r, 300));
      
      const { score, tier } = calculateCreditScore(applicationData);
      setProgress(50);
      await new Promise(r => setTimeout(r, 400));
      
      const proof = generateMockGroth16Proof();
      setProgress(80);
      await new Promise(r => setTimeout(r, 200));
      
      const randomHex = (len: number) => Array.from({ length: len }, () => 
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');

      const result: ProofGenerationResult = {
        proof,
        publicInputHash: `0x${randomHex(64)}` as `0x${string}`,
        metadataCIDBytes32: `0x${randomHex(64)}` as `0x${string}`,
        attPayloadHex: `0x${randomHex(128)}` as `0x${string}`,
        attSigHex: `0x${randomHex(130)}` as `0x${string}`,
        score,
        tier,
      };

      setProofResult(result);
      setProgress(100);
      setStage('complete');
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Proof generation failed';
      setError(errorMessage);
      setStage('error');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [address]);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setCurrentStep(0);
    setResult(null);
    setProofResult(null);
    setError(null);
    setStage('idle');
    setProgress(0);
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
    proofResult,
    error,
    stage,
    progress,
    processData,
    generateProofQuick,
    reset,
    isIdle: stage === 'idle',
    isComplete: stage === 'complete',
    isError: stage === 'error',
  };
}
