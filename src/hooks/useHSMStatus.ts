 import { useDebtOpsStore } from '@/store/debtOpsStore';
 
 export function useHSMStatus() {
   const { hsmStatus, keyRotationDays, mrenclaveStatus, updateHSMStatus } = useDebtOpsStore();
   
   return {
     hsmStatus,
     keyRotationDays,
     mrenclaveStatus,
     updateHSMStatus,
     rotationProgress: ((90 - keyRotationDays) / 90) * 100,
   };
 }