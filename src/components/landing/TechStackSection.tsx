 import { motion } from 'framer-motion';
 import { useInView } from 'react-intersection-observer';
 import { Shield, Cpu, Zap, Database, Lock, Server } from 'lucide-react';
 
 const techStack = [
   { name: 'iExec TEE', desc: 'Confidential Computing', icon: Shield, color: 'from-emerald-500 to-teal-600' },
   { name: 'Intel SGX', desc: 'Hardware Enclaves', icon: Cpu, color: 'from-blue-500 to-indigo-600' },
   { name: 'Groth16 ZK', desc: '300ms Proofs', icon: Zap, color: 'from-purple-500 to-pink-600' },
   { name: 'Arbitrum', desc: 'L2 Blockchain', icon: Database, color: 'from-sky-500 to-blue-600' },
   { name: 'AWS CloudHSM', desc: 'Key Management', icon: Lock, color: 'from-amber-500 to-orange-600' },
   { name: 'IPFS', desc: 'Encrypted Storage', icon: Server, color: 'from-rose-500 to-red-600' },
 ];
 
 export default function TechStackSection() {
   const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
 
   return (
     <section ref={ref} className="py-20 bg-muted/30 border-y border-border">
       <div className="container mx-auto px-4">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={inView ? { opacity: 1, y: 0 } : {}}
           className="text-center mb-12"
         >
           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
             Production Tech Stack
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             Battle-tested infrastructure for institutional-grade confidential DeFi
           </p>
         </motion.div>
 
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {techStack.map((tech, i) => {
             const Icon = tech.icon;
             return (
               <motion.div
                 key={tech.name}
                 initial={{ opacity: 0, y: 20 }}
                 animate={inView ? { opacity: 1, y: 0 } : {}}
                 transition={{ delay: i * 0.1 }}
                 whileHover={{ scale: 1.05, y: -5 }}
                 className="glass-card p-4 text-center group cursor-pointer"
               >
                 <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow`}>
                   <Icon className="h-6 w-6 text-white" />
                 </div>
                 <h3 className="font-semibold text-foreground text-sm">{tech.name}</h3>
                 <p className="text-xs text-muted-foreground mt-1">{tech.desc}</p>
               </motion.div>
             );
           })}
         </div>
       </div>
     </section>
   );
 }