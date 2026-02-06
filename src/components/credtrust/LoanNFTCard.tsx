 import { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Sparkles, Award, Clock, Eye, Share2, CheckCircle, Loader2 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { useRiskEngineStore, LoanNFT } from '@/store/riskEngineStore';
 import { toast } from 'sonner';
 import { cn } from '@/lib/utils';
 
 const tierGradients = {
   A: 'from-emerald-500 via-emerald-400 to-teal-500',
   B: 'from-blue-500 via-blue-400 to-cyan-500',
   C: 'from-amber-500 via-amber-400 to-orange-500',
   D: 'from-red-500 via-red-400 to-rose-500',
 };
 
 export function LoanNFTCard() {
   const [isMinting, setIsMinting] = useState(false);
   const { riskScore, riskTier, nfts, addNFT, grantAccess, proofStatus } = useRiskEngineStore();
 
   const handleMint = async () => {
     setIsMinting(true);
     await new Promise(r => setTimeout(r, 2000));
     
     const newNFT: LoanNFT = {
       id: `CRED-${Date.now()}`,
       amount: Math.floor(Math.random() * 50) + 10,
       term: [12, 24, 36][Math.floor(Math.random() * 3)],
       rate: Number((Math.random() * 5 + 3).toFixed(2)),
       scoreRange: riskTier === 'A' ? '750-850' : riskTier === 'B' ? '700-749' : riskTier === 'C' ? '650-699' : '300-649',
       tier: riskTier,
       expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
       accesses: 0,
       maxAccesses: 5,
     };
     
     addNFT(newNFT);
     setIsMinting(false);
     toast.success('Credit Proof NFT minted!');
   };
 
   const handleGrantAccess = (nftId: string) => {
     grantAccess(nftId);
     toast.success('Ephemeral access granted');
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="space-y-6"
     >
       {/* Mint Card */}
       <div className="glass-card overflow-hidden">
         <div className="p-6 border-b border-border/50">
           <div className="flex items-center gap-3">
             <div className="p-3 rounded-2xl bg-purple-500/10 ring-1 ring-purple-500/20">
               <Sparkles className="w-6 h-6 text-purple-500" />
             </div>
             <div>
               <h3 className="text-xl font-semibold text-foreground">Mint Credit Proof NFT</h3>
               <p className="text-sm text-muted-foreground">Non-transferable soulbound credential</p>
             </div>
           </div>
         </div>
 
         <div className="p-6 space-y-6">
           {/* NFT Preview */}
           <div className={cn(
             'relative aspect-[4/3] rounded-2xl overflow-hidden',
             `bg-gradient-to-br ${tierGradients[riskTier]}`
           )}>
             <div className="absolute inset-0 bg-black/20" />
             <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
               <Award className="w-12 h-12 mb-4 opacity-90" />
               <p className="text-sm opacity-80 uppercase tracking-wider">CredTrust Score</p>
               <p className="text-5xl font-bold font-display my-2">{riskScore || '---'}</p>
               <div className="flex items-center gap-2 mt-2">
                 <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                   Tier {riskTier}
                 </span>
                 <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                   Soulbound
                 </span>
               </div>
             </div>
             
             {/* Animated shimmer */}
             <motion.div
               animate={{ x: ['-100%', '200%'] }}
               transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
             />
           </div>
 
           {/* Mint Button */}
           <Button
             onClick={handleMint}
             disabled={isMinting || proofStatus !== 'complete'}
             className="w-full h-12 text-base font-semibold"
             size="lg"
           >
             {isMinting ? (
               <>
                 <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                 Minting NFT...
               </>
             ) : (
               <>
                 <Sparkles className="w-5 h-5 mr-2" />
                 Mint Soulbound NFT
               </>
             )}
           </Button>
         </div>
       </div>
 
       {/* Minted NFTs Gallery */}
       <AnimatePresence>
         {nfts.length > 0 && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             className="space-y-4"
           >
             <h4 className="text-lg font-semibold text-foreground">Your Credit Credentials</h4>
             
             <div className="grid gap-4">
               {nfts.map((nft) => (
                 <motion.div
                   key={nft.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="glass-card p-4"
                 >
                   <div className="flex items-start justify-between mb-4">
                     <div>
                       <div className="flex items-center gap-2">
                         <span className={cn(
                           'px-2 py-0.5 rounded text-xs font-medium',
                           `bg-gradient-to-r ${tierGradients[nft.tier]} text-white`
                         )}>
                           Tier {nft.tier}
                         </span>
                         <span className="text-sm font-mono text-muted-foreground">
                           {nft.id}
                         </span>
                       </div>
                       <p className="text-sm text-muted-foreground mt-1">
                         Score Range: {nft.scoreRange}
                       </p>
                     </div>
                     <div className="flex items-center gap-1 text-muted-foreground">
                       <Clock className="w-4 h-4" />
                       <span className="text-xs">{nft.expiry}</span>
                     </div>
                   </div>
 
                   <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                     <div className="p-2 rounded-lg bg-muted/30">
                       <p className="text-lg font-semibold text-foreground">${nft.amount}k</p>
                       <p className="text-xs text-muted-foreground">Amount</p>
                     </div>
                     <div className="p-2 rounded-lg bg-muted/30">
                       <p className="text-lg font-semibold text-foreground">{nft.term}mo</p>
                       <p className="text-xs text-muted-foreground">Term</p>
                     </div>
                     <div className="p-2 rounded-lg bg-muted/30">
                       <p className="text-lg font-semibold text-foreground">{nft.rate}%</p>
                       <p className="text-xs text-muted-foreground">APR</p>
                     </div>
                   </div>
 
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <Eye className="w-4 h-4" />
                       <span>{nft.accesses}/{nft.maxAccesses} views</span>
                     </div>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleGrantAccess(nft.id)}
                       disabled={nft.accesses >= nft.maxAccesses}
                     >
                       <Share2 className="w-4 h-4 mr-1" />
                       Grant Access
                     </Button>
                   </div>
                 </motion.div>
               ))}
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </motion.div>
   );
 }