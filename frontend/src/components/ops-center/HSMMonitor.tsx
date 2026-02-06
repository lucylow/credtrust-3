 import { motion } from 'framer-motion';
 import { KeySquare, RotateCcw, ShieldCheck } from 'lucide-react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { useHSMStatus } from '@/hooks/useHSMStatus';
 
 export default function HSMMonitor() {
   const { hsmStatus, keyRotationDays, mrenclaveStatus, rotationProgress } = useHSMStatus();
 
   const statusColors = {
     healthy: 'bg-success text-success-foreground',
     warning: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]',
     critical: 'bg-destructive text-destructive-foreground animate-pulse',
   };
 
   return (
     <div className="space-y-4">
       {/* HSM Health Card */}
       <motion.div
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
       >
         <Card className="border-border">
           <CardHeader className="pb-2">
             <div className="flex items-center justify-between">
               <KeySquare className="w-5 h-5 text-primary" />
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                 <span className="text-sm font-medium text-foreground">AWS CloudHSM</span>
               </div>
             </div>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
               <span className="text-sm text-muted-foreground">Cluster Status</span>
               <Badge className={statusColors[hsmStatus]}>
                 {hsmStatus.toUpperCase()}
               </Badge>
             </div>
 
             {/* Key Rotation */}
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Key Rotation</span>
                 <span className="flex items-center gap-1 text-foreground">
                   <RotateCcw className="w-3 h-3" />
                   {keyRotationDays} days remaining
                 </span>
               </div>
               <Progress value={rotationProgress} className="h-2" />
             </div>
           </CardContent>
         </Card>
       </motion.div>
 
       {/* MRENCLAVE Pinning */}
       <motion.div
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={{ delay: 0.1 }}
       >
         <Card className="border-border">
           <CardHeader className="pb-2">
             <CardTitle className="flex items-center gap-2 text-sm">
               <ShieldCheck className="w-4 h-4 text-success" />
               MRENCLAVE Pinned
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-3">
             <code className="block text-xs font-mono text-muted-foreground bg-muted/50 p-2 rounded">
               {mrenclaveStatus.hash.slice(0, 16)}...
             </code>
             <p className="text-xs text-success">
               ✓ Verified: {mrenclaveStatus.enclaveName}
             </p>
             <Button variant="ghost" size="sm" className="w-full text-xs">
               Rotate Enclave →
             </Button>
           </CardContent>
         </Card>
       </motion.div>
     </div>
   );
 }