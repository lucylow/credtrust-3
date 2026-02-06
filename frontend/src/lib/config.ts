// App configuration with environment variables

export const config = {
  // Backend API
  api: {
    baseUrl: import.meta.env.VITE_BACKEND_URL || '',
    timeout: 30000,
  },
  
  // WebSocket
  ws: {
    url: import.meta.env.VITE_WS_URL || '',
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  },
  
  // WalletConnect
  walletConnect: {
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3a8170812b534d0ff9d794f19a901d64',
  },
  
  // Feature flags
  features: {
    enableRealTimeUpdates: import.meta.env.VITE_ENABLE_REALTIME !== 'false',
    enableMockData: import.meta.env.VITE_ENABLE_MOCK !== 'false',
    enableDebugLogging: import.meta.env.DEV,
  },
  
  // Blockchain
  blockchain: {
    chainId: 421614, // Arbitrum Sepolia
    rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc',
  },
  
  // IPFS
  ipfs: {
    gateway: import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs',
  },
} as const;

// Helper to check if backend is configured
export function isBackendConfigured(): boolean {
  return Boolean(config.api.baseUrl);
}

// Helper to check if we're in mock mode
export function isMockMode(): boolean {
  return !isBackendConfigured() || config.features.enableMockData;
}

// Debug logger
export function debugLog(message: string, data?: unknown): void {
  if (config.features.enableDebugLogging) {
    console.log(`[CredTrust] ${message}`, data ?? '');
  }
}

export type Config = typeof config;
