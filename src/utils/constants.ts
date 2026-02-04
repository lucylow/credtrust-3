// CredTrust Constants

// Contract addresses (Arbitrum Sepolia testnet)
export const CREDIT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

// Chain configuration
export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

// API endpoints (mock for demo)
export const API_ENDPOINTS = {
  teeProcess: '/api/tee/process',
  attestation: '/api/attestation/verify',
  nftMetadata: '/api/nft/metadata',
} as const;

// Credit score ranges
export const CREDIT_SCORE_RANGES = {
  excellent: { min: 750, max: 850, label: 'Excellent', color: 'success' },
  good: { min: 670, max: 749, label: 'Good', color: 'primary' },
  fair: { min: 580, max: 669, label: 'Fair', color: 'warning' },
  poor: { min: 300, max: 579, label: 'Poor', color: 'destructive' },
} as const;

// TEE workflow steps
export const TEE_WORKFLOW_STEPS = [
  {
    id: 1,
    title: 'Local Encryption',
    description: 'Data encrypted client-side using AES-256-GCM',
    icon: 'Lock',
  },
  {
    id: 2,
    title: 'TEE Enclave',
    description: 'Secure hardware isolated execution',
    icon: 'Cpu',
  },
  {
    id: 3,
    title: 'Private Computation',
    description: 'Risk model runs on encrypted data',
    icon: 'Key',
  },
  {
    id: 4,
    title: 'Attestation',
    description: 'Cryptographic proof of valid execution',
    icon: 'Shield',
  },
  {
    id: 5,
    title: 'NFT Minting',
    description: 'Non-transferable credit proof issued',
    icon: 'CheckCircle',
  },
] as const;
