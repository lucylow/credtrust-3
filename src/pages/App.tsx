import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppHeader from '@/components/app/AppHeader';
import AppSidebar from '@/components/app/AppSidebar';
import FloatingParticles from '@/components/landing/FloatingParticles';
import appRoutes from '@/routes/appRoutes';
import { Skeleton } from '@/components/ui/skeleton';

// Loading fallback for lazy-loaded pages
function PageLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

export default function AppPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <FloatingParticles />
      <AppHeader />
      
      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <AppSidebar className="sticky top-16 h-[calc(100vh-4rem)]" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="container py-8">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {appRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path.replace('/app', '') || '/'}
                    element={<route.component />}
                  />
                ))}
                <Route path="*" element={<Navigate to="/app" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
