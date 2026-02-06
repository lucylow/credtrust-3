import { useState, useCallback } from "react";
import { useWalletClient, useAccount, usePublicClient } from "wagmi";
import { keccak256, encodeAbiParameters, parseAbiParameters } from "viem";
import { arbitrumSepolia } from "wagmi/chains";
import ABI from "../contracts/SelectiveABI.json";
import { SELECTIVE_NFT_ABI, CONTRACT_ADDRESSES } from "../contracts/abis";
import type { ProofGenerationResult, SolidityProof } from "@/types/tee.types";

interface MintParams {
  contractAddress?: `0x${string}`;
  borrower: `0x${string}`;
  a: [bigint, bigint];
  b: [[bigint, bigint], [bigint, bigint]];
  c: [bigint, bigint];
  publicInputs: bigint[];
  publicInputHash: `0x${string}`;
  metadataCID: `0x${string}`;
  attPayload: `0x${string}`;
  attSig: `0x${string}`;
}

export interface MintResult {
  tokenId: bigint;
  transactionHash: `0x${string}`;
  blockNumber?: bigint;
}

export function computePublicInputHash(publicInputs: bigint[]): `0x${string}` {
  const encoded = encodeAbiParameters(
    parseAbiParameters("uint256[]"),
    [publicInputs]
  );
  return keccak256(encoded);
}

export default function useMintWithProof() {
  const { data: walletClient } = useWalletClient();
  const { address, chain } = useAccount();
  const publicClient = usePublicClient();
  
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<MintResult | null>(null);

  const getContractAddress = useCallback((): `0x${string}` => {
    const network = chain?.name?.toLowerCase().includes('arbitrum') 
      ? 'arbitrumSepolia' 
      : 'localhost';
    return CONTRACT_ADDRESSES[network].selectiveNFT as `0x${string}`;
  }, [chain]);

  async function mintWithProof({
    contractAddress,
    borrower,
    a,
    b,
    c,
    publicInputs,
    publicInputHash,
    metadataCID,
    attPayload,
    attSig,
  }: MintParams): Promise<MintResult> {
    if (!walletClient || !address) throw new Error("Wallet not connected");

    setIsPending(true);
    setError(null);

    try {
      const targetContract = contractAddress || getContractAddress();

      const hash = await walletClient.writeContract({
        address: targetContract,
        abi: ABI,
        functionName: "mintWithProofAndAttestation",
        args: [
          borrower,
          a,
          b,
          c,
          publicInputs,
          publicInputHash,
          metadataCID,
          attPayload,
          attSig,
        ],
        chain: arbitrumSepolia,
        account: address,
        gas: BigInt(1200000),
      });

      // Wait for confirmation if publicClient available
      let blockNumber: bigint | undefined;
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        blockNumber = receipt.blockNumber;
      }

      const result: MintResult = {
        tokenId: BigInt(Date.now()), // Mock - parse from event logs in production
        transactionHash: hash,
        blockNumber,
      };

      setLastResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  }

  // Convenience method that takes a ProofGenerationResult directly
  const mintFromProofResult = useCallback(async (
    proofResult: ProofGenerationResult,
    borrower?: `0x${string}`
  ): Promise<MintResult> => {
    if (!address) throw new Error('Wallet not connected');

    // Convert SolidityProof to MintParams format
    const a: [bigint, bigint] = [proofResult.proof.a[0], proofResult.proof.a[1]];
    const b: [[bigint, bigint], [bigint, bigint]] = [
      [proofResult.proof.b[0][0], proofResult.proof.b[0][1]],
      [proofResult.proof.b[1][0], proofResult.proof.b[1][1]],
    ];
    const c: [bigint, bigint] = [proofResult.proof.c[0], proofResult.proof.c[1]];

    return mintWithProof({
      borrower: borrower || address,
      a,
      b,
      c,
      publicInputs: proofResult.proof.publicInputs,
      publicInputHash: proofResult.publicInputHash,
      metadataCID: proofResult.metadataCIDBytes32,
      attPayload: proofResult.attPayloadHex,
      attSig: proofResult.attSigHex,
    });
  }, [address, mintWithProof]);

  return { 
    mintWithProof, 
    mintFromProofResult,
    isPending,
    error,
    lastResult,
    isConnected: !!address,
    contractAddress: getContractAddress(),
  };
}
