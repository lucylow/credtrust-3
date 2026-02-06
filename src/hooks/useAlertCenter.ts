 import { useDebtOpsStore } from '@/store/debtOpsStore';
 
 export function useAlertCenter() {
   const { recentAlerts, addAlert } = useDebtOpsStore();
   
   return { recentAlerts, addAlert };
 }