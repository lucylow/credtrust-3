 import React, { useEffect, useRef, useCallback } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 import { X } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface ModalProps {
   open: boolean;
   onClose: () => void;
   title?: string;
   children: React.ReactNode;
   className?: string;
   size?: "sm" | "md" | "lg" | "xl" | "full";
 }
 
 const sizeClasses = {
   sm: "max-w-sm",
   md: "max-w-md",
   lg: "max-w-lg",
   xl: "max-w-xl",
   full: "max-w-4xl",
 };
 
 export default function Modal({ 
   open, 
   onClose, 
   title, 
   children, 
   className,
   size = "md" 
 }: ModalProps) {
   const modalRef = useRef<HTMLDivElement>(null);
   const previousActiveElement = useRef<HTMLElement | null>(null);
 
   // Focus trap
   const handleKeyDown = useCallback((e: KeyboardEvent) => {
     if (e.key === "Escape") {
       onClose();
       return;
     }
 
     if (e.key !== "Tab" || !modalRef.current) return;
 
     const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
       'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
     );
     const firstElement = focusableElements[0];
     const lastElement = focusableElements[focusableElements.length - 1];
 
     if (e.shiftKey && document.activeElement === firstElement) {
       e.preventDefault();
       lastElement?.focus();
     } else if (!e.shiftKey && document.activeElement === lastElement) {
       e.preventDefault();
       firstElement?.focus();
     }
   }, [onClose]);
 
   useEffect(() => {
     if (open) {
       previousActiveElement.current = document.activeElement as HTMLElement;
       document.addEventListener("keydown", handleKeyDown);
       document.body.style.overflow = "hidden";
       
       // Focus the modal
       setTimeout(() => modalRef.current?.focus(), 0);
     } else {
       document.removeEventListener("keydown", handleKeyDown);
       document.body.style.overflow = "";
       previousActiveElement.current?.focus();
     }
 
     return () => {
       document.removeEventListener("keydown", handleKeyDown);
       document.body.style.overflow = "";
     };
   }, [open, handleKeyDown]);
 
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
             className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
             aria-hidden="true"
           />
           
           {/* Modal */}
           <motion.div
             ref={modalRef}
             role="dialog"
             aria-modal="true"
             aria-labelledby={title ? "modal-title" : undefined}
             tabIndex={-1}
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: 20 }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
             className={cn(
               "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
               "w-[calc(100%-2rem)] rounded-2xl bg-card p-6 shadow-xl border border-border",
               sizeClasses[size],
               className
             )}
           >
             {/* Header */}
             {title && (
               <div className="flex items-center justify-between mb-4">
                 <h2 id="modal-title" className="text-lg font-semibold text-foreground">
                   {title}
                 </h2>
                 <button
                   onClick={onClose}
                   className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                   aria-label="Close modal"
                 >
                   <X className="h-5 w-5" />
                 </button>
               </div>
             )}
 
             {/* Content */}
             <div className="text-card-foreground">{children}</div>
           </motion.div>
         </>
       )}
     </AnimatePresence>
   );
 }