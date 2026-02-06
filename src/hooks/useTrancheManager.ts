 import { useCallback } from 'react';
 import { useDebtOpsStore } from '@/store/debtOpsStore';
 import { toast } from 'sonner';
 
 export function useTrancheManager() {
   const { mintPosition, redeemPosition, addAlert } = useDebtOpsStore();
   
   const mintTranchePosition = useCallback((tranche: 'senior' | 'junior' | 'equity', amount = 10000) => {
     mintPosition(tranche, amount);
     addAlert({ type: 'info', message: `Minted $${amount.toLocaleString()} ${tranche} position` });
     toast.success(`Successfully minted ${tranche} tranche position`);
   }, [mintPosition, addAlert]);
   
   const redeemTranchePosition = useCallback((tranche: 'senior' | 'junior' | 'equity') => {
     redeemPosition(tranche);
     addAlert({ type: 'info', message: `Redeemed ${tranche} position` });
     toast.success(`Successfully redeemed ${tranche} tranche position`);
   }, [redeemPosition, addAlert]);
   
   return { mintTranchePosition, redeemTranchePosition };
 }