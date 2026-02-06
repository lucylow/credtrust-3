export class RiskAgent {
  async execute(input: any) {
    console.log("⚖️ RiskAgent executing");
    return {
      agent: 'RiskAgent',
      riskScore: 0.12,
      riskLevel: 'LOW',
      mitigation: 'Standard collateral'
    };
  }
}
