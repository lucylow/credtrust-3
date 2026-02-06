 import { motion } from 'framer-motion';
 import { Bell, AlertCircle, AlertTriangle, Info } from 'lucide-react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { useAlertCenter } from '@/hooks/useAlertCenter';
 
 export default function AlertCenter() {
   const { recentAlerts } = useAlertCenter();
 
   const alertConfig = {
     critical: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
     warning: { icon: AlertTriangle, color: 'text-[hsl(var(--warning))]', bg: 'bg-[hsl(var(--warning))]/10' },
     info: { icon: Info, color: 'text-primary', bg: 'bg-primary/10' },
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, x: 20 }}
       animate={{ opacity: 1, x: 0 }}
       transition={{ delay: 0.2 }}
     >
       <Card className="border-border">
         <CardHeader className="pb-2">
           <div className="flex items-center justify-between">
             <CardTitle className="flex items-center gap-2 text-sm">
               <Bell className="w-4 h-4 text-primary" />
               Discord Alerts (15s)
             </CardTitle>
             <Badge variant="outline" className="text-xs bg-success/20 text-success border-success/30">
               LIVE
             </Badge>
           </div>
         </CardHeader>
         <CardContent>
           <div className="space-y-2 max-h-64 overflow-y-auto">
             {recentAlerts.map((alert, i) => {
               const config = alertConfig[alert.type];
               const Icon = config.icon;
               
               return (
                 <motion.div
                   key={alert.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className={`flex items-start gap-2 p-2 rounded-lg ${config.bg}`}
                 >
                   <Icon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between gap-2">
                       <span className={`text-xs font-medium capitalize ${config.color}`}>
                         {alert.type}
                       </span>
                       <span className="text-xs text-muted-foreground">
                         {new Date(alert.timestamp).toLocaleTimeString()}
                       </span>
                     </div>
                     <p className="text-xs text-foreground truncate">{alert.message}</p>
                   </div>
                 </motion.div>
               );
             })}
           </div>
         </CardContent>
       </Card>
     </motion.div>
   );
 }