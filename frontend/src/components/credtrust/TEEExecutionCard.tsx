 import { useEffect, useState, useRef } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Shield, Activity, Cpu, Zap, CheckCircle, Loader2 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Progress } from '@/components/ui/progress';
 import { useRiskEngineStore } from '@/store/riskEngineStore';
 import { cn } from '@/lib/utils';
 
 interface Particle {
   id: number;
   x: number;
   y: number;
   vx: number;
   vy: number;
 }
 
 export function TEEExecutionCard() {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const [isExecuting, setIsExecuting] = useState(false);
   const [progress, setProgress] = useState(0);
   const { teeStatus, setTeeStatus, setRiskScore, nextStep } = useRiskEngineStore();
   const particlesRef = useRef<Particle[]>([]);
   const animationRef = useRef<number>();
 
   // Initialize particles
   useEffect(() => {
     particlesRef.current = Array.from({ length: 20 }, (_, i) => ({
       id: i,
       x: Math.random() * 280 + 10,
       y: Math.random() * 160 + 20,
       vx: (Math.random() - 0.5) * 2,
       vy: (Math.random() - 0.5) * 2,
     }));
   }, []);
 
   // Canvas animation
   useEffect(() => {
     const canvas = canvasRef.current;
     if (!canvas) return;
     const ctx = canvas.getContext('2d');
     if (!ctx) return;
 
     const animate = () => {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
 
       // Draw enclave boundary
       const isActive = teeStatus.enclave === 'active' || teeStatus.enclave === 'computing';
       ctx.strokeStyle = isActive ? '#10b981' : '#374151';
       ctx.lineWidth = 2;
       ctx.shadowColor = isActive ? '#10b981' : 'transparent';
       ctx.shadowBlur = isActive ? 15 : 0;
       ctx.strokeRect(10, 10, 280, 180);
       ctx.shadowBlur = 0;
 
       // Draw SGX label
       ctx.fillStyle = isActive ? '#10b981' : '#6b7280';
       ctx.font = '10px monospace';
       ctx.fillText('Intel SGX Enclave', 15, 25);
 
       // Update and draw particles
       particlesRef.current.forEach((p) => {
         if (isActive) {
           p.x += p.vx;
           p.y += p.vy;
           
           // Bounce off walls
           if (p.x < 15 || p.x > 285) p.vx *= -1;
           if (p.y < 20 || p.y > 185) p.vy *= -1;
         }
 
         ctx.fillStyle = isActive 
           ? `hsla(${160 + p.id * 5}, 70%, 60%, 0.8)` 
           : 'rgba(107, 114, 128, 0.3)';
         ctx.beginPath();
         ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
         ctx.fill();
       });
 
       animationRef.current = requestAnimationFrame(animate);
     };
 
     animate();
     return () => {
       if (animationRef.current) cancelAnimationFrame(animationRef.current);
     };
   }, [teeStatus.enclave]);
 
   const handleExecute = async () => {
     setIsExecuting(true);
     setTeeStatus({ enclave: 'active', batchCount: 0 });
     setProgress(0);
 
     // Simulate TEE execution
     const startTime = Date.now();
     for (let i = 0; i <= 100; i += 5) {
       await new Promise(r => setTimeout(r, 100));
       setProgress(i);
       setTeeStatus({ batchCount: Math.floor(i / 10), enclave: 'computing' });
     }
 
     const processingTime = Date.now() - startTime;
     setTeeStatus({ enclave: 'active', processingTime });
     
     // Generate random score
     const score = Math.floor(Math.random() * 150) + 700;
     setRiskScore(score);
     
     setIsExecuting(false);
     setTimeout(() => nextStep(), 500);
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="glass-card overflow-hidden"
     >
       {/* Header */}
       <div className="p-6 border-b border-border/50">
         <div className="flex items-center gap-3">
           <div className="p-3 rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/20">
             <Shield className="w-6 h-6 text-blue-500" />
           </div>
           <div className="flex-1">
             <h3 className="text-xl font-semibold text-foreground">TEE Execution</h3>
             <p className="text-sm text-muted-foreground">Intel SGX Confidential Compute</p>
           </div>
           <div className={cn(
             'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
             teeStatus.enclave === 'idle' && 'bg-muted text-muted-foreground',
             teeStatus.enclave === 'active' && 'bg-emerald-500/10 text-emerald-400',
             teeStatus.enclave === 'computing' && 'bg-blue-500/10 text-blue-400 animate-pulse',
           )}>
             <div className={cn(
               'w-2 h-2 rounded-full',
               teeStatus.enclave === 'idle' && 'bg-muted-foreground',
               teeStatus.enclave === 'active' && 'bg-emerald-500',
               teeStatus.enclave === 'computing' && 'bg-blue-500 animate-pulse',
             )} />
             {teeStatus.enclave === 'idle' ? 'Standby' : teeStatus.enclave === 'computing' ? 'Computing...' : 'Active'}
           </div>
         </div>
       </div>
 
       <div className="p-6 space-y-6">
         {/* Canvas Visualization */}
         <div className="relative rounded-xl overflow-hidden bg-muted/20 border border-border/50">
           <canvas
             ref={canvasRef}
             width={300}
             height={200}
             className="w-full h-auto"
           />
           <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur text-xs">
             <Activity className="w-3 h-3 text-emerald-500" />
             <span className="text-muted-foreground">LIVE</span>
           </div>
         </div>
 
         {/* Stats Grid */}
         <div className="grid grid-cols-3 gap-4">
           <div className="p-3 rounded-xl bg-muted/30 text-center">
             <Cpu className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
             <p className="text-lg font-semibold text-foreground">{teeStatus.batchCount}</p>
             <p className="text-xs text-muted-foreground">Batches</p>
           </div>
           <div className="p-3 rounded-xl bg-muted/30 text-center">
             <Activity className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
             <p className="text-lg font-semibold text-foreground">{progress}%</p>
             <p className="text-xs text-muted-foreground">Progress</p>
           </div>
           <div className="p-3 rounded-xl bg-muted/30 text-center">
             <Zap className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
             <p className="text-lg font-semibold text-foreground">{teeStatus.processingTime || '--'}</p>
             <p className="text-xs text-muted-foreground">ms</p>
           </div>
         </div>
 
         {/* Progress Bar */}
         <AnimatePresence>
           {isExecuting && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
             >
               <Progress value={progress} className="h-2" />
             </motion.div>
           )}
         </AnimatePresence>
 
         {/* Action Button */}
         <Button
           onClick={handleExecute}
           disabled={isExecuting || teeStatus.enclave === 'active'}
           className="w-full h-12 text-base font-semibold"
           size="lg"
         >
           {isExecuting ? (
             <>
               <Loader2 className="w-5 h-5 mr-2 animate-spin" />
               Computing in Enclave...
             </>
           ) : teeStatus.enclave === 'active' ? (
             <>
               <CheckCircle className="w-5 h-5 mr-2" />
               Execution Complete
             </>
           ) : (
             <>
               <Shield className="w-5 h-5 mr-2" />
               Start TEE Execution
             </>
           )}
         </Button>
       </div>
     </motion.div>
   );
 }