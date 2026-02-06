 import { useQueryClient } from "@tanstack/react-query";
 import { useCallback } from "react";
 
 /**
  * Prefetch data for faster navigation
  */
 export default function usePrefetch() {
   const queryClient = useQueryClient();
 
   const prefetch = useCallback(
     <T>(key: string | string[], fetcher?: () => Promise<T>) => {
       const queryKey = Array.isArray(key) ? key : [key];
       if (fetcher) {
         queryClient.prefetchQuery({ queryKey, queryFn: fetcher });
       }
     },
     [queryClient]
   );
 
   const prefetchOnHover = useCallback(
     <T>(key: string | string[], fetcher: () => Promise<T>) => ({
       onMouseEnter: () => prefetch(key, fetcher),
       onFocus: () => prefetch(key, fetcher),
     }),
     [prefetch]
   );
 
   return { prefetch, prefetchOnHover };
 }