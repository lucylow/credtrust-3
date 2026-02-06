 // src/hooks/useTranchePrices.ts
 import { useEffect, useState, useCallback } from 'react';
 import { useDebtOpsStore } from '@/store/debtOpsStore';
 
 const PRICE_CONFIG = {
   senior: { basePrice: 1.02, volatility: 0.001 },
   junior: { basePrice: 0.98, volatility: 0.015 },
   equity: { basePrice: 1.12, volatility: 0.045 },
 };
 
 export function useTranchePrices() {
   const [isConnected, setIsConnected] = useState(false);
   const { tranches, totalPool, updateTranchePrice, setTotalPool } = useDebtOpsStore();
 
   useEffect(() => {
     // Simulate connection delay
     const connectTimeout = setTimeout(() => setIsConnected(true), 500);
 
     // Simulate real-time price updates
     const priceInterval = setInterval(() => {
       (['senior', 'junior', 'equity'] as const).forEach((tranche) => {
         const config = PRICE_CONFIG[tranche];
         const currentPrice = tranches[tranche].price || config.basePrice;
         const change = (Math.random() - 0.5) * config.volatility * 2;
         const newPrice = Math.max(0.85, currentPrice * (1 + change));
         const change24h = Math.random() > 0.5 
           ? `+${(Math.random() * 3).toFixed(1)}%` 
           : `-${(Math.random() * 2).toFixed(1)}%`;
         
         updateTranchePrice(tranche, newPrice, change24h);
       });
 
       // Update total pool with small fluctuations
       const poolChange = (Math.random() - 0.5) * 100000;
       setTotalPool(Math.max(15000000, totalPool + poolChange));
     }, 2000);
 
     return () => {
       clearTimeout(connectTimeout);
       clearInterval(priceInterval);
     };
   }, []);
 
   return {
     prices: tranches,
     pool: { totalPool, utilization: 0.89 },
     isConnected,
   };
 }