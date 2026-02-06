// orchestrator/tee-selector.ts

export interface TaskInput {
  modelSize?: number;
  environment?: 'production' | 'experimental';
  complexity?: 'light' | 'heavy';
}

interface TeeDecision {
  framework: 'SGX' | 'TDX';
  reason: string;
  memoryRequiredGB: number;
  workerpool: string;
}

export class DualTeeSelector {
  decideFramework(task: TaskInput): TeeDecision {
    const { memoryMB, isProduction, complexity } = this.analyzeTask(task);
    
    // SGX: Production / Lightweight (< 1GB)
    if (isProduction && memoryMB < 1024) {
      return {
        framework: 'SGX',
        reason: 'Production ready + memory fits SGX limits',
        memoryRequiredGB: memoryMB / 1024,
        workerpool: 'sgx-labs.pools.iexec.eth'
      };
    }
    
    // TDX: Memory intensive / Experimental
    return {
      framework: 'TDX',
      reason: 'Multi-GB memory or complex workload',
      memoryRequiredGB: memoryMB / 1024,
      workerpool: 'tdx-labs.pools.iexec.eth'
    };
  }

  private analyzeTask(task: TaskInput) {
    const memoryMB = task.modelSize || 512;
    const isProduction = task.environment === 'production';
    const complexity = task.complexity || 'light';
    
    return { memoryMB, isProduction, complexity };
  }
}
