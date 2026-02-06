// src/agents/credit-agent-hitl.ts
import WebSocket from 'ws';
import crypto from 'crypto';

export class HITLCreditAgent {
  private ws: WebSocket;
  private decisionId: string = '';

  constructor() {
    this.ws = new WebSocket('ws://localhost:8081');
    this.ws.on('open', () => console.log('Connected to HITL WebSocket'));
    this.ws.on('message', (data) => this.handleHITLResponse(data));
    this.ws.on('error', (err) => console.error('WebSocket Error:', err));
  }

  async scoreWalletWithHITL(wallet: string, amount: number) {
    // Risk assessment
    const riskLevel = this.assessRisk(wallet, amount);
    
    if (riskLevel === 'HIGH') {
      // Request HITL approval
      this.decisionId = crypto.randomUUID();
      this.requestHITLApproval({
        id: this.decisionId,
        agent: 'CreditAgent',
        action: `Score wallet ${wallet.slice(0,6)}... for $${amount.toLocaleString()} loan`,
        riskLevel,
        confidence: 0.78,
        wallet,
        amount,
        timestamp: Date.now(),
        details: { purpose: 'loan origination' }
      });
      
      // Wait for approval
      await this.waitForApproval();
    }

    // Execute scoring (approved or low-risk)
    return await this.executeScoring(wallet);
  }

  private assessRisk(wallet: string, amount: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (amount > 100000) return 'HIGH';
    if (amount > 25000) return 'MEDIUM';
    return 'LOW';
  }

  private requestHITLApproval(decision: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(decision));
        console.log(`⏳ HITL requested: ${decision.id}`);
    } else {
        console.error('WebSocket not open. Cannot request HITL approval.');
    }
  }

  private async waitForApproval(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('HITL timeout')), 300000);
      
      const handler = (data: WebSocket.Data) => {
        try {
            const response = JSON.parse(data.toString());
            if (response.id === this.decisionId) {
              this.ws.removeListener('message', handler);
              clearTimeout(timeout);
              
              if (response.approved) {
                console.log('✅ HITL APPROVED');
                resolve();
              } else {
                console.log('❌ HITL REJECTED');
                reject(new Error('Human rejected action'));
              }
            }
        } catch (e) {
            console.error('Error parsing response in waitForApproval:', e);
        }
      };
      
      this.ws.on('message', handler);
    });
  }

  private async executeScoring(wallet: string) {
    // TDX confidential scoring logic
    return {
      score: 782,
      tier: 'A',
      mrenclave: '0x1234abcd...',
      approved: true
    };
  }

  private handleHITLResponse(data: WebSocket.Data) {
    try {
        const response = JSON.parse(data.toString());
        console.log(`HITL Response: ${JSON.stringify(response)}`);
    } catch (e) {
        console.error('Error handling HITL response:', e);
    }
  }
}
