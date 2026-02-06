// Contract ABIs for CredTrust

export const ATTESTATION_VERIFIER_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "admin", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "address", "name": "attestor", "type": "address" }],
    "name": "AttestorAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "attHash", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "signer", "type": "address" }
    ],
    "name": "AttestationVerified",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "address", "name": "a", "type": "address" }],
    "name": "addTrustedAttestor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "a", "type": "address" }],
    "name": "isTrusted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "trustedAttestors",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "name": "usedAttestations",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes", "name": "payload", "type": "bytes" },
      { "internalType": "bytes", "name": "signature", "type": "bytes" }
    ],
    "name": "verifyAttestation",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const SELECTIVE_NFT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "admin", "type": "address" },
      { "internalType": "address", "name": "_zkVerifierAddr", "type": "address" },
      { "internalType": "address", "name": "_attestorVerifierAddr", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" },
      { "indexed": false, "internalType": "bytes32", "name": "metadataCID", "type": "bytes32" }
    ],
    "name": "CreditProofMinted",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "borrower", "type": "address" },
      { "internalType": "uint256[2]", "name": "a", "type": "uint256[2]" },
      { "internalType": "uint256[2][2]", "name": "b", "type": "uint256[2][2]" },
      { "internalType": "uint256[2]", "name": "c", "type": "uint256[2]" },
      { "internalType": "uint256[]", "name": "publicInputs", "type": "uint256[]" },
      { "internalType": "bytes32", "name": "publicInputHash", "type": "bytes32" },
      { "internalType": "bytes32", "name": "metadataCID", "type": "bytes32" },
      { "internalType": "bytes", "name": "attPayload", "type": "bytes" },
      { "internalType": "bytes", "name": "attSig", "type": "bytes" }
    ],
    "name": "mintWithProofAndAttestation",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "proofCommits",
    "outputs": [
      { "internalType": "bytes32", "name": "metadataCID", "type": "bytes32" },
      { "internalType": "bytes32", "name": "publicInputHash", "type": "bytes32" },
      { "internalType": "uint256", "name": "issuedAt", "type": "uint256" },
      { "internalType": "address", "name": "underwriter", "type": "address" },
      { "internalType": "bool", "name": "revoked", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const BATCH_MANAGER_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "admin", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "batchId", "type": "uint256" },
      { "indexed": false, "internalType": "bytes32", "name": "merkleRoot", "type": "bytes32" },
      { "indexed": false, "internalType": "uint256", "name": "count", "type": "uint256" }
    ],
    "name": "BatchCreated",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "merkleRoot", "type": "bytes32" },
      { "internalType": "uint256", "name": "count", "type": "uint256" }
    ],
    "name": "createBatch",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "batchId", "type": "uint256" }],
    "name": "getBatch",
    "outputs": [
      { "internalType": "bytes32", "name": "merkleRoot", "type": "bytes32" },
      { "internalType": "uint256", "name": "count", "type": "uint256" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const VERIFIER_ABI = [
  {
    "inputs": [
      { "internalType": "uint256[2]", "name": "a", "type": "uint256[2]" },
      { "internalType": "uint256[2][2]", "name": "b", "type": "uint256[2][2]" },
      { "internalType": "uint256[2]", "name": "c", "type": "uint256[2]" },
      { "internalType": "uint256[]", "name": "input", "type": "uint256[]" }
    ],
    "name": "verifyProof",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract addresses (for different networks)
export const CONTRACT_ADDRESSES = {
  // Arbitrum Sepolia Testnet
  arbitrumSepolia: {
    verifier: "0x0000000000000000000000000000000000000000",
    attestationVerifier: "0x0000000000000000000000000000000000000000",
    selectiveNFT: "0x0000000000000000000000000000000000000000",
    batchManager: "0x0000000000000000000000000000000000000000",
  },
  // Localhost (Hardhat)
  localhost: {
    verifier: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    attestationVerifier: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    selectiveNFT: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    batchManager: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  }
} as const;

export type NetworkName = keyof typeof CONTRACT_ADDRESSES;
