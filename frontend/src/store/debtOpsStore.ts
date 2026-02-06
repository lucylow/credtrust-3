 import { create } from 'zustand';
 import { persist } from 'zustand/middleware';
 
 export interface TrancheData {
   totalSupply: number;
   utilization: number;
   userPosition: number;
   yield24h: number;
   remainingDays: number;
   penalty: number;
  price?: number;
  change24h?: string;
 }
 
 export interface AlertData {
   id: string;
   type: 'critical' | 'warning' | 'info';
   message: string;
   timestamp: number;
 }
 
 interface DebtOpsState {
   tranches: {
     senior: TrancheData;
     junior: TrancheData;
     equity: TrancheData;
   };
   totalPool: number;
   hsmStatus: 'healthy' | 'warning' | 'critical';
   keyRotationDays: number;
   mrenclaveStatus: { hash: string; enclaveName: string };
   recentAlerts: AlertData[];
   
   // Actions
   mintPosition: (tranche: 'senior' | 'junior' | 'equity', amount: number) => void;
   redeemPosition: (tranche: 'senior' | 'junior' | 'equity') => void;
   addAlert: (alert: Omit<AlertData, 'id' | 'timestamp'>) => void;
   updateHSMStatus: (status: 'healthy' | 'warning' | 'critical') => void;
  updateTranchePrice: (tranche: 'senior' | 'junior' | 'equity', price: number, change24h: string) => void;
  setTotalPool: (totalPool: number) => void;
 }
 
 export const useDebtOpsStore = create<DebtOpsState>()(
   persist(
     (set, get) => ({
       tranches: {
          senior: { totalSupply: 10000000, utilization: 0.87, userPosition: 0, yield24h: 0.12, remainingDays: 89, penalty: 0, price: 1.02, change24h: '+0.3%' },
          junior: { totalSupply: 5000000, utilization: 0.94, userPosition: 0, yield24h: 0.89, remainingDays: 89, penalty: 1.2, price: 0.98, change24h: '-0.5%' },
          equity: { totalSupply: 2000000, utilization: 0.67, userPosition: 0, yield24h: 2.34, remainingDays: 89, penalty: 3.5, price: 1.12, change24h: '+1.8%' },
       },
       totalPool: 17200000,
       hsmStatus: 'healthy',
       keyRotationDays: 67,
       mrenclaveStatus: { hash: '0x1a2b3c4d5e6f7890abcdef', enclaveName: 'credtrust-v2.1' },
       recentAlerts: [
         { id: '1', type: 'info', message: 'Senior tranche yield updated', timestamp: Date.now() - 30000 },
         { id: '2', type: 'warning', message: 'Junior utilization above 90%', timestamp: Date.now() - 15000 },
         { id: '3', type: 'info', message: 'HSM key rotation in 67 days', timestamp: Date.now() },
       ],
       
       mintPosition: (tranche, amount) => set((state) => ({
         tranches: {
           ...state.tranches,
           [tranche]: {
             ...state.tranches[tranche],
             userPosition: state.tranches[tranche].userPosition + amount,
             totalSupply: state.tranches[tranche].totalSupply + amount,
           },
         },
         totalPool: state.totalPool + amount,
       })),
       
       redeemPosition: (tranche) => set((state) => {
         const position = state.tranches[tranche].userPosition;
         return {
           tranches: {
             ...state.tranches,
             [tranche]: {
               ...state.tranches[tranche],
               userPosition: 0,
               totalSupply: state.tranches[tranche].totalSupply - position,
             },
           },
           totalPool: state.totalPool - position,
         };
       }),
    
    updateTranchePrice: (tranche, price, change24h) => set((state) => ({
      tranches: {
        ...state.tranches,
        [tranche]: {
          ...state.tranches[tranche],
          price,
          change24h,
        },
      },
    })),
    
    setTotalPool: (totalPool) => set({ totalPool }),
    
       addAlert: (alert) => set((state) => ({
         recentAlerts: [
           { ...alert, id: crypto.randomUUID(), timestamp: Date.now() },
           ...state.recentAlerts.slice(0, 9),
         ],
       })),
       
       updateHSMStatus: (status) => set({ hsmStatus: status }),
     }),
     { name: 'credtrust-debt-ops' }
   )
 );