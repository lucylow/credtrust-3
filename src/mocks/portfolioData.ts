// Mock Portfolio Data
import type { Portfolio, ZKProof, ContractEvent, APIResponse } from '@/types/borrower.types';

export const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    portfolio_id: "port-001",
    owner_address: "0x742d35Cc6634C0532925a3b8D7c7aF9eA663F39d",
    total_value_usd: 125000,
    collateral_composition: {
      stablecoins: 45000,
      bluechip_eth: 65000,
      defi_lp: 15000
    },
    loan_to_value_target: 0.65,
    duration_months: 12,
    tranches: [
      {
        seniority: "senior",
        size_usd: 81250,
        coupon_rate: "2.5%",
        risk_score: 0.92,
        nft_token_id: 1234
      },
      {
        seniority: "junior",
        size_usd: 12500,
        coupon_rate: "8.0%",
        risk_score: 0.68,
        nft_token_id: 1235
      },
      {
        seniority: "equity",
        size_usd: 6250,
        coupon_rate: "15.0%",
        risk_score: 0.45,
        nft_token_id: 1236
      }
    ],
    credit_proof_ids: [1001, 1002, 1003],
    mrenclave: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12"
  },
  {
    portfolio_id: "port-002",
    owner_address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    total_value_usd: 45000,
    collateral_composition: {
      stablecoins: 35000,
      african_tokens: 10000
    },
    loan_to_value_target: 0.75,
    duration_months: 6,
    tranches: [
      {
        seniority: "senior",
        size_usd: 30375,
        coupon_rate: "3.0%",
        risk_score: 0.88,
        nft_token_id: 2001
      },
      {
        seniority: "mezzanine",
        size_usd: 7875,
        coupon_rate: "10.5%",
        risk_score: 0.72,
        nft_token_id: 2002
      },
      {
        seniority: "equity",
        size_usd: 3750,
        coupon_rate: "18.0%",
        risk_score: 0.52,
        nft_token_id: 2003
      }
    ]
  },
  {
    portfolio_id: "port-003",
    owner_address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    total_value_usd: 250000,
    collateral_composition: {
      stablecoins: 150000,
      bluechip_eth: 75000,
      rwa_tokens: 25000
    },
    loan_to_value_target: 0.60,
    duration_months: 24,
    tranches: [
      {
        seniority: "senior",
        size_usd: 150000,
        coupon_rate: "2.0%",
        risk_score: 0.95,
        nft_token_id: 3001
      },
      {
        seniority: "mezzanine",
        size_usd: 50000,
        coupon_rate: "6.5%",
        risk_score: 0.78,
        nft_token_id: 3002
      },
      {
        seniority: "junior",
        size_usd: 35000,
        coupon_rate: "12.0%",
        risk_score: 0.62,
        nft_token_id: 3003
      },
      {
        seniority: "equity",
        size_usd: 15000,
        coupon_rate: "20.0%",
        risk_score: 0.40,
        nft_token_id: 3004
      }
    ],
    credit_proof_ids: [1004, 1005, 1006, 1007],
    mrenclave: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab"
  }
];

export const MOCK_ZK_PROOFS: ZKProof[] = [
  {
    proof_id: "zkp-001",
    score: 782,
    tier: "A",
    public_inputs: [782, 1, 0, 0, 0],
    proof: {
      pi_a: ["0x1e2b8c5f9a3d7e1b4c6f8a2d5e9b3c7f1a4d8e2b5c9f3a7d1e4b8c2f6a9d3e7b", "0x2f3a9d1e8b4c7f2a5d9e3b7c1f4a8d2e6b9c3f7a1d5e8b2c6f9a3d7e1b4c8f2a"],
      pi_b: [
        ["0x2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e"],
        ["0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l", "0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"]
      ],
      pi_c: ["0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5", "0x789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567"]
    },
    verification_key: {
      alpha: ["0x1a2b3c4d5e6f7890", "0x0987654321fedcba"],
      beta: [["0xaabbccdd", "0x11223344"], ["0x55667788", "0x99aabbcc"]],
      gamma: ["0xddeeff00", "0x11223344"],
      delta: ["0x55667788", "0x99aabbcc"],
      gamma_abc_g1: ["0xaabbccdd", "0xeeff0011"]
    },
    mrenclave: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
    generated_at: "2026-02-04T14:30:00Z"
  },
  {
    proof_id: "zkp-002",
    score: 685,
    tier: "C",
    public_inputs: [685, 0, 0, 1, 0],
    proof: {
      pi_a: ["0x3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a", "0x6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d"],
      pi_b: [
        ["0x9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a", "0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d"],
        ["0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a", "0x8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d"]
      ],
      pi_c: ["0x1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a", "0x4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d"]
    },
    mrenclave: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
    generated_at: "2026-02-04T14:35:00Z"
  },
  {
    proof_id: "zkp-003",
    score: 745,
    tier: "B",
    public_inputs: [745, 1, 0, 0, 1],
    proof: {
      pi_a: ["0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b", "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d"],
      pi_b: [
        ["0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f", "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b"],
        ["0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d", "0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f"]
      ],
      pi_c: ["0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b", "0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2"]
    },
    generated_at: "2026-02-04T14:40:00Z"
  }
];

export const MOCK_CONTRACT_EVENTS: { Mint: ContractEvent[]; Transfer: any[]; DisclosureAuthorized: any[] } = {
  Mint: [
    {
      tokenId: 1001,
      borrower: "0x742d35Cc6634C0532925a3b8D7c7aF9eA663F39d",
      score: 782,
      tier: "A",
      zk_proof_hash: "0x1234567890abcdef1234567890abcdef12345678",
      mrenclave: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
      blockNumber: 12345678,
      timestamp: "2026-02-04T14:20:15Z"
    },
    {
      tokenId: 1002,
      borrower: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      score: 685,
      tier: "C",
      zk_proof_hash: "0xfedcba0987654321fedcba0987654321fedcba09",
      mrenclave: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
      blockNumber: 12345685,
      timestamp: "2026-02-04T14:22:30Z"
    },
    {
      tokenId: 1003,
      borrower: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      score: 745,
      tier: "B",
      zk_proof_hash: "0xabcdef1234567890abcdef1234567890abcdef12",
      mrenclave: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
      blockNumber: 12345700,
      timestamp: "2026-02-04T14:25:00Z"
    }
  ],
  Transfer: [
    {
      from: "0x0000000000000000000000000000000000000000",
      to: "0x742d35Cc6634C0532925a3b8D7c7aF9eA663F39d",
      tokenId: 1001,
      blockNumber: 12345678
    },
    {
      from: "0x0000000000000000000000000000000000000000",
      to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      tokenId: 1002,
      blockNumber: 12345685
    }
  ],
  DisclosureAuthorized: [
    {
      tokenId: 1001,
      verifier: "0xVerifierAddress1234567890123456789012345678",
      level: 1,
      expires: 1741579200, // 2025-03-10
      blockNumber: 12345700
    },
    {
      tokenId: 1002,
      verifier: "0xVerifierAddress9876543210987654321098765432",
      level: 2,
      expires: 1742184000, // 2025-03-17
      blockNumber: 12345750
    }
  ]
};

export const MOCK_API_RESPONSES: Record<string, APIResponse | any> = {
  creditScoreSuccess: {
    task_id: "risk_1646349200_1a2b3c4d",
    status: "accepted",
    estimated_duration: 300,
    zero_trust_context: {
      client_type: "underwriter",
      verified_mrenclave: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
      session_valid: true
    }
  },
  taskStatusPending: {
    task_id: "risk_1646349200_1a2b3c4d",
    status: "PENDING",
    progress: 0,
    enclave_status: "INITIALIZING"
  },
  taskStatusProcessing: {
    task_id: "risk_1646349200_1a2b3c4d",
    status: "PROCESSING",
    progress: 65,
    enclave_status: "COMPUTING"
  },
  taskStatusComplete: {
    task_id: "risk_1646349200_1a2b3c4d",
    status: "COMPLETED",
    progress: 100,
    enclave_status: "HEALTHY",
    mrenclave: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
    zero_trust: {
      verified: true,
      client_matches: true
    },
    token_id: 1001,
    zk_proof_hash: "0x1234567890abcdef1234567890abcdef12345678"
  },
  portfolioTranches: {
    task_id: "portfolio_1646349500_742d35cc",
    tranches: [
      {
        seniority: "senior",
        size_usd: 81250,
        coupon_rate: "2.5%",
        risk_score: 0.92
      },
      {
        seniority: "junior",
        size_usd: 12500,
        coupon_rate: "8.0%",
        risk_score: 0.68
      },
      {
        seniority: "equity",
        size_usd: 6250,
        coupon_rate: "15.0%",
        risk_score: 0.45
      }
    ]
  },
  disclosureResponse: {
    decryption_key: "AgMFBA...base64key...",
    metadata_cid: "ipfs://QmX1234567890abcdef1234567890abcdef12345678",
    disclosure_level: 1,
    expires_at: "2026-03-04T14:30:00Z"
  }
};
