 import { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { Clock, Trophy } from 'lucide-react';
 
 const DEADLINE = new Date('2026-02-07T18:00:00Z').getTime();
 
 interface TimeLeft {
   days: number;
   hours: number;
   minutes: number;
   seconds: number;
 }
 
 export default function CountdownTimer() {
   const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
 
   useEffect(() => {
     const calculate = () => {
       const now = Date.now();
       const diff = Math.max(0, DEADLINE - now);
       setTimeLeft({
         days: Math.floor(diff / (1000 * 60 * 60 * 24)),
         hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
         minutes: Math.floor((diff / (1000 * 60)) % 60),
         seconds: Math.floor((diff / 1000) % 60),
       });
     };
     calculate();
     const interval = setInterval(calculate, 1000);
     return () => clearInterval(interval);
   }, []);
 
   const TimeBlock = ({ value, label }: { value: number; label: string }) => (
     <div className="flex flex-col items-center">
       <motion.div
         key={value}
         initial={{ scale: 1.1 }}
         animate={{ scale: 1 }}
         className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
       >
         <span className="text-2xl md:text-3xl font-bold text-primary-foreground">
           {value.toString().padStart(2, '0')}
         </span>
       </motion.div>
       <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{label}</span>
     </div>
   );
 
   return (
     <section className="py-12 bg-card/50 border-y border-border">
       <div className="container mx-auto px-4">
         <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
           <div className="flex items-center gap-3">
             <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
               <Trophy className="h-6 w-6 text-primary" />
             </div>
             <div>
               <h3 className="font-bold text-foreground">Hack4Privacy</h3>
               <p className="text-sm text-muted-foreground">Submission Deadline</p>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <TimeBlock value={timeLeft.days} label="Days" />
             <span className="text-2xl text-muted-foreground font-bold">:</span>
             <TimeBlock value={timeLeft.hours} label="Hours" />
             <span className="text-2xl text-muted-foreground font-bold">:</span>
             <TimeBlock value={timeLeft.minutes} label="Mins" />
             <span className="text-2xl text-muted-foreground font-bold hidden md:block">:</span>
             <div className="hidden md:block">
               <TimeBlock value={timeLeft.seconds} label="Secs" />
             </div>
           </div>
           
           <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30">
             <Clock className="h-4 w-4 text-success" />
             <span className="text-sm font-medium text-success">Feb 7, 2026</span>
           </div>
         </div>
       </div>
     </section>
   );
 }