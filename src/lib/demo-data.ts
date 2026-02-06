 export interface DemoFinancialData {
   fico: number;
   income: number;
   debt: number;
   employmentMonths: number;
   assets: number;
   tier: 'A' | 'B' | 'C' | 'D';
 }
 
 const BASE_DATASETS = {
   A: { fico: 780, income: 95000, debt: 15000, employmentMonths: 36, assets: 250000 },
   B: { fico: 720, income: 75000, debt: 25000, employmentMonths: 24, assets: 120000 },
   C: { fico: 680, income: 55000, debt: 35000, employmentMonths: 18, assets: 50000 },
   D: { fico: 620, income: 40000, debt: 45000, employmentMonths: 12, assets: 10000 },
 };
 
 export const generateDemoDataset = (tier: 'A' | 'B' | 'C' | 'D' = 'A'): DemoFinancialData => {
   const base = BASE_DATASETS[tier];
   return {
     ...base,
     tier,
     fico: Math.round(base.fico + (Math.random() - 0.5) * 20),
     income: Math.round(base.income + (Math.random() - 0.5) * 5000),
   };
 };
 
 export const DEMO_DATASETS = [
   { label: 'Prime Borrower (A)', tier: 'A' as const, color: 'text-success' },
   { label: 'Good Credit (B)', tier: 'B' as const, color: 'text-primary' },
   { label: 'Fair Credit (C)', tier: 'C' as const, color: 'text-[hsl(var(--warning))]' },
   { label: 'Risky (D)', tier: 'D' as const, color: 'text-destructive' },
 ];
 
 export const calculateRiskScore = (data: DemoFinancialData): number => {
   const dti = data.debt / data.income;
   const ficoWeight = data.fico * 0.4;
   const dtiWeight = (1 - Math.min(dti, 1)) * 300;
   const employmentWeight = Math.min(data.employmentMonths / 60, 1) * 100;
   const assetWeight = Math.min(data.assets / 500000, 1) * 100;
   return Math.round(ficoWeight + dtiWeight + employmentWeight + assetWeight);
 };