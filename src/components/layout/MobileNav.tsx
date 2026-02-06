 import React, { useEffect, useRef } from "react";
 import { Link, useLocation } from "react-router-dom";
 import { motion, AnimatePresence } from "framer-motion";
 import { X, Shield } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface NavLink {
   to: string;
   label: string;
   icon?: React.ReactNode;
 }
 
 interface MobileNavProps {
   open: boolean;
   onClose: () => void;
   links: NavLink[];
   footer?: React.ReactNode;
 }
 
 export default function MobileNav({ open, onClose, links, footer }: MobileNavProps) {
   const location = useLocation();
   const navRef = useRef<HTMLDivElement>(null);
 
   // Close on escape key
   useEffect(() => {
     if (!open) return;
 
     const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === "Escape") onClose();
     };
 
     document.addEventListener("keydown", handleKeyDown);
     document.body.style.overflow = "hidden";
 
     return () => {
       document.removeEventListener("keydown", handleKeyDown);
       document.body.style.overflow = "";
     };
   }, [open, onClose]);
 
   // Close on route change
   useEffect(() => {
     if (open) onClose();
   }, [location.pathname]);
 
   return (
     <AnimatePresence>
       {open && (
         <>
           {/* Backdrop */}
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
             aria-hidden="true"
           />
 
           {/* Drawer */}
           <motion.nav
             ref={navRef}
             initial={{ x: "-100%" }}
             animate={{ x: 0 }}
             exit={{ x: "-100%" }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
             className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-xl md:hidden"
             role="dialog"
             aria-modal="true"
             aria-label="Navigation menu"
           >
             {/* Header */}
             <div className="flex items-center justify-between p-4 border-b border-border">
               <Link to="/" className="flex items-center gap-2" onClick={onClose}>
                 <div className="p-1.5 rounded-lg gradient-primary">
                   <Shield className="h-4 w-4 text-primary-foreground" />
                 </div>
                 <span className="font-bold text-foreground">CredTrust</span>
               </Link>
               <button
                 onClick={onClose}
                 className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                 aria-label="Close menu"
               >
                 <X className="h-5 w-5" />
               </button>
             </div>
 
             {/* Links */}
             <div className="flex-1 overflow-y-auto p-4 space-y-1">
               {links.map((link, index) => {
                 const isActive = location.pathname === link.to;
                 return (
                   <motion.div
                     key={link.to}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 0.05 }}
                   >
                     <Link
                       to={link.to}
                       onClick={onClose}
                       className={cn(
                         "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                         isActive
                           ? "bg-primary/10 text-primary border border-primary/20"
                           : "text-muted-foreground hover:text-foreground hover:bg-muted"
                       )}
                     >
                       {link.icon}
                       {link.label}
                     </Link>
                   </motion.div>
                 );
               })}
             </div>
 
             {/* Footer */}
             {footer && (
               <div className="p-4 border-t border-border">
                 {footer}
               </div>
             )}
           </motion.nav>
         </>
       )}
     </AnimatePresence>
   );
 }