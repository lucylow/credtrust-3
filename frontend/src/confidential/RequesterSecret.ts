// src/confidential/RequesterSecret.ts - User-provided secrets
export class RequesterSecrets {
  private secrets: Record<number, string> = {};

  constructor() {
    // Parse all IEXEC_REQUESTER_SECRET_* env vars
    for (let i = 1; i <= 10; i++) {
      const secret = process.env[`IEXEC_REQUESTER_SECRET_${i}`];
      if (secret) {
        this.secrets[i] = secret;
        console.log(`🔐 Requester Secret ${i} loaded:`, secret.slice(0, 8) + '...');
      }
    }
  }

  getSecret(index: number): string {
    const secret = this.secrets[index];
    if (!secret) {
      throw new Error(`❌ Requester Secret ${index} not authorized`);
    }
    return secret;
  }

  // Example: User wallet private key for signing
  async signLoanRequest(walletPrivateKeyIndex: number = 1): Promise<string> {
    const privateKey = this.getSecret(walletPrivateKeyIndex);
    // In TEE: Sign loan request confidentially
    return `signed-loan-${privateKey.slice(-8)}`;
  }
}
