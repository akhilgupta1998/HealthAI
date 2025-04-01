import { useState, useEffect, useCallback } from 'react';

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Check on initial load (SSR safe)
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  // Use useCallback to prevent recreating the handler on each render
  const checkScreenSize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < breakpoint);
    }
  }, [breakpoint]);

  useEffect(() => {
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [checkScreenSize]);

  return isMobile;
} 