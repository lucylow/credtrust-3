 import { useEffect, useState } from "react";
 
 export default function useMediaQuery(query: string): boolean {
   const [matches, setMatches] = useState(() => 
     typeof window !== 'undefined' ? matchMedia(query).matches : false
   );
 
   useEffect(() => {
     if (typeof window === 'undefined') return;
     
     const mq = matchMedia(query);
     const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
     
     // Set initial value
     setMatches(mq.matches);
     
     mq.addEventListener("change", handler);
     return () => mq.removeEventListener("change", handler);
   }, [query]);
   
   return matches;
 }
 
 // Preset breakpoint hooks
 export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
 export const useIsTablet = () => useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
 export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");