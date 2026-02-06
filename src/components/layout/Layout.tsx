import React, { Suspense } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppHeader from "@/components/app/AppHeader";
import Header from "@/components/landing/Header";
import Sidebar from "@/components/layout/Sidebar";
import FloatingParticles from "@/components/landing/FloatingParticles";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isAppPath = location.pathname.startsWith("/app");
  const isDashboardPath = 
    location.pathname === "/dashboard" || 
    location.pathname === "/orchestration" || 
    location.pathname === "/chat" ||
    location.pathname === "/iexec-demo" ||
    location.pathname === "/bulk-score";

  const showSidebar = isAppPath || isDashboardPath;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <FloatingParticles />
      
      {isLandingPage ? <Header /> : <AppHeader />}

      <div className="flex">
        {showSidebar && (
          <Sidebar className="sticky top-16 h-[calc(100vh-4rem)] z-40" />
        )}
        
        <main className={`flex-1 min-w-0 ${showSidebar ? "" : "w-full"}`}>
          <Suspense fallback={
            <div className="container py-8">
              <LoadingSkeleton type="card" count={3} />
            </div>
          }>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={showSidebar ? "container py-6 lg:py-8 max-w-7xl mx-auto" : ""}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;
