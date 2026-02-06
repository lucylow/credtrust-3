import { IExec } from 'iexec';

export class CredTrustIExecClient {
  private iexec: any;
  
  constructor() {
    // In a browser environment, we use window.ethereum
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.iexec = new IExec({ ethProvider: (window as any).ethereum });
    }
  }

  async deployAppIfNeeded() {
    const appAddress = import.meta.env.VITE_IEXEC_APP_ADDRESS;
    if (!appAddress) {
      console.log('Deploying new iExec app...');
      // Logic for deployment would go here if not already deployed
      // For hackathon, we usually assume it's deployed or provided in env
      return '0x0000000000000000000000000000000000000000';
    }
    return appAddress;
  }

  async runCreditScoring(userData: any, modelId?: string) {
    const appAddress = await this.deployAppIfNeeded();
    const datasetAddress = modelId || import.meta.env.VITE_IEXEC_DATASET_ADDRESS;
    
    try {
      const { dealId } = await this.iexec.app.orderSignApp({
        app: appAddress,
        dataset: datasetAddress,
        workerpool: import.meta.env.VITE_IEXEC_POOL_ADDRESS,
      });

      const { taskId } = await this.iexec.deal.compute(dealId, {
        iexec_input_files: [userData.url], // Example input
      });

      return { taskId, dealId };
    } catch (error) {
      console.error('Error running credit scoring:', error);
      throw error;
    }
  }

  async waitForTaskResult(taskId: string) {
    return await this.iexec.task.waitForTaskStatus(taskId, 'COMPLETED');
  }

  async bulkScore(users: any[]) {
    // Parallel TEE jobs
    const jobs = users.map(user => this.runCreditScoring(user));
    return Promise.all(jobs);
  }
}

export const iexecClient = new CredTrustIExecClient();
