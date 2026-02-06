// API Client for CredTrust Backend Integration
// Handles all HTTP communication with configurable backend URL

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout = 30000;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint;
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timed out' };
        }
        return { success: false, error: error.message };
      }
      
      return { success: false, error: 'Network error' };
    }
  }

  // Health check
  async checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health');
  }

  // TEE Endpoints
  async protectData(data: object, wallet: string): Promise<ApiResponse<{
    ipfsHash: string;
    protectedDataAddress: string;
  }>> {
    return this.request('/api/tee/protect', {
      method: 'POST',
      body: JSON.stringify({ data, wallet }),
    });
  }

  async runTEEJob(ipfsHash: string): Promise<ApiResponse<{
    taskId: string;
    status: string;
  }>> {
    return this.request('/api/tee/run', {
      method: 'POST',
      body: JSON.stringify({ ipfsHash }),
    });
  }

  async getTEEJobStatus(taskId: string): Promise<ApiResponse<{
    status: string;
    progress: number;
    result?: object;
  }>> {
    return this.request(`/api/tee/status/${taskId}`);
  }

  // Tranche Endpoints
  async getTranchePrices(): Promise<ApiResponse<{
    timestamp: number;
    prices: {
      senior: { price: number; change24h: string; volume24h: number };
      junior: { price: number; change24h: string; volume24h: number };
      equity: { price: number; change24h: string; volume24h: number };
    };
  }>> {
    return this.request('/api/tranches/prices');
  }

  async mintTranchePosition(
    tranche: 'senior' | 'junior' | 'equity',
    amount: number,
    wallet: string
  ): Promise<ApiResponse<{
    nftId: string;
    txHash: string;
  }>> {
    return this.request('/api/tranches/mint', {
      method: 'POST',
      body: JSON.stringify({ tranche, amount, wallet }),
    });
  }

  // HSM Endpoints
  async getHSMStatus(): Promise<ApiResponse<{
    healthy: boolean;
    rotationDaysRemaining: number;
    keysActive: number;
  }>> {
    return this.request('/api/hsm/status');
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export for testing or custom instances
export { ApiClient };
export type { ApiResponse };
