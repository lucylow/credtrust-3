// src/tdx/eliza-tdx-entrypoint.ts
import { ElizaTDXOrchestrator } from '../elizaos/orchestrator';
import * as fs from 'fs';

async function tdxEntrypoint() {
  console.log('🔒 ElizaOS TDX Trust Domain - VM-Level Protection');
  console.log('🏢 Workerpool: tdx-labs.pools.iexec.eth');
  console.log('🔑 MRENCLAVE:', process.env.IEXEC_MRENCLAVE);

  // Read iExec stdin (user goal)
  const inputData = JSON.parse(process.env.IEXEC_IN_DATA || '{}');
  
  const orchestrator = new ElizaTDXOrchestrator();
  const result = await orchestrator.processGoal(inputData);

  // Write TDX-attested output
  const outputPath = '/iexec_out/elizaos-result.json';
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  
  console.log('✅ ElizaOS TDX execution complete:', result);
}

if (require.main === module) {
  tdxEntrypoint().catch(console.error);
}
