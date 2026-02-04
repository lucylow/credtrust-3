import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import appRoutes from '@/routes/appRoutes';

/**
 * Hook for prefetching route components and data on hover
 * This improves perceived performance by loading resources before navigation
 */
export function usePrefetch() {
  const queryClient = useQueryClient();
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  const prefetch = useCallback(async (path: string) => {
    // Don't prefetch the same route twice
    if (prefetchedRoutes.current.has(path)) {
      return;
    }

    const route = appRoutes.find((r) => r.path === path);
    if (!route) return;

    try {
      // Mark as prefetched immediately to prevent duplicate calls
      prefetchedRoutes.current.add(path);

      // Prefetch the component bundle
      await route.prefetch();

      // Optional: prefetch route-specific data
      // This can be extended based on route requirements
      switch (path) {
        case '/app':
          // Prefetch dashboard analytics data
          queryClient.prefetchQuery({
            queryKey: ['dashboard', 'analytics'],
            queryFn: async () => ({ cached: true }),
            staleTime: 1000 * 60 * 5, // 5 minutes
          });
          break;
        case '/app/marketplace':
          // Prefetch marketplace listings
          queryClient.prefetchQuery({
            queryKey: ['marketplace', 'loans'],
            queryFn: async () => ({ cached: true }),
            staleTime: 1000 * 60 * 2,
          });
          break;
        default:
          break;
      }
    } catch (error) {
      // Silently fail - prefetching is an optimization, not critical
      console.debug('Prefetch failed for', path, error);
    }
  }, [queryClient]);

  return prefetch;
}

export default usePrefetch;
