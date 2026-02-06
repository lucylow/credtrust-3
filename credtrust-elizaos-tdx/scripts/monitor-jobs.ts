// scripts/monitor-jobs.ts
import { IExecSDK } from '@iexec/sdk';

const sdk = new IExecSDK({ chainId: 421614 });

async function monitorAgentJobs(appAddress: string) {
  const tasks = await sdk.task.showAppTasks(appAddress);
  
  for (const task of tasks) {
    const status = await sdk.task.showTask(task.taskId);
    
    console.log(`🤖 Task ${task.taskId.slice(0,12)}...`);
    console.log(`Status: ${status.status}`);
    // Note: status.results.stdout access might vary based on SDK version and actual response structure
    console.log(`MRENCLAVE: ${status.results?.stdout?.mrenclave?.slice(0,16)}...`);
    
    if (status.status === 'COMPLETED') {
      const result = JSON.parse(status.results.stdout);
      console.log(`✅ Score: ${result.score} (${result.tier})`);
    }
  }
}

const appAddress = process.argv[2];
if (appAddress) {
    monitorAgentJobs(appAddress).catch(console.error);
} else {
    console.log("Please provide an app address as an argument.");
}
