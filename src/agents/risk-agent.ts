import { supabase } from '../integrations/supabase/client';
import { iexecClient } from '../lib/iexec-client';

export const riskAgent = {
  monitorPortfolio: async (userId: string) => {
    const { data: loans, error } = await supabase
      .from('user_loans' as any) // Cast to any because table might not exist in types yet
      .select('*')
      .eq('user_id', userId);

    if (error || !loans) {
      // Mock data if table doesn't exist yet
      return [
        { id: '1', amount: 3000, pool: 'PoolY', ltv: 85, healthScore: 45, alert: 'HIGH_RISK' },
      ];
    }

    const risks = loans.map((pos: any) => ({
      ...pos,
      alert: pos.ltv > 80 ? 'HIGH_RISK' : 'OK'
    }));
    
    return risks;
  },

  predictDefault: async (loanData: any) => {
    // In a real app, this would use iExec TEE for privacy-preserving prediction
    try {
      // const prediction = await iexecClient.runRiskPrediction(loanData);
      // return prediction.probability;
      return Math.random(); // Mock probability
    } catch (e) {
      return 0.1;
    }
  }
};
