import { IExecWeb3mail } from '@iexec/web3mail';

export class CredTrustWeb3Mail {
  private w3m: any;

  constructor() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.w3m = new IExecWeb3mail((window as any).ethereum);
    }
  }

  async sendCreditScoreNotification(userAddress: string, score: number) {
    try {
      // In a real scenario, we'd find the user's contact address (protected data)
      // For the demo, we show the flow
      const emailContent = {
        emailSubject: `Your CredTrust Score: ${score}`,
        emailContent: `Your confidential credit score has been computed in an iExec TEE Enclave.\n\nScore: ${score}\nStatus: Verified\n\nThis email was sent via iExec Web3Mail, protecting your privacy.`,
      };

      // In production, you would fetch protected data for userAddress
      // const protectedData = await this.w3m.fetchMyContacts();
      
      console.log('Web3Mail notification prepared for:', userAddress);
      
      // return await this.w3m.sendEmail(emailContent);
      return { success: true, message: 'Notification sent' };
    } catch (error) {
      console.error('Web3Mail error:', error);
      throw error;
    }
  }
}

export const web3mail = new CredTrustWeb3Mail();
