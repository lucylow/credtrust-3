#!/usr/bin/env node
import { IExecTaskHandler } from '@iexec/sdk';
import { ElizaAgent } from 'elizaos';
import { CreditScorer } from './credit-scorer.js';
import { TDXRuntime } from './tdx-runtime.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

class CredTrustTDXAgent {
  private agent: ElizaAgent;
  private scorer: CreditScorer;
  private tdx: TDXRuntime;

  constructor() {
    this.agent = new ElizaAgent('/iexec_in/character.json');
    this.scorer = new CreditScorer();
    this.tdx = new TDXRuntime();
  }

  async handleIExecTask({ stdin, callback, stdout, stderr }: IExecTaskHandler) {
    try {
      // Read encrypted input from iExec
      const taskInput = JSON.parse(stdin);
      
      // Verify TDX attestation
      const attestation = await this.tdx.verifyEnclave();
      if (!attestation.valid) {
        throw new Error('TDX attestation failed');
      }

      // Process agent goal
      const goal = taskInput.goal || taskInput.prompt;
      const response = await this.agent.process(goal);
      
      // Execute TDX-confidential scoring if requested
      if (response.tools.includes('score_wallet')) {
        const score = await this.scorer.scoreWallet(
          taskInput.address, 
          taskInput.privateData
        );
        response.creditScore = score;
      }

      // Write attested output
      const output = {
        success: true,
        response: response.text,
        attestation: attestation.proof,
        mrenclave: attestation.mrenclave,
        timestamp: Date.now()
      };

      await callback(stdout, JSON.stringify(output));
      
    } catch (error) {
      await callback(stderr, JSON.stringify({ error: error.message }));
    }
  }
}

// TDX iExec Entrypoint
const agent = new CredTrustTDXAgent();
agent.handleIExecTask(require('@iexec/sdk').defaultTaskHandler);

export { CredTrustTDXAgent };
