'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useHomepage } from '@/hooks/useHomepage';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const hasShownRef = useRef(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  // Get homepage loading state if on homepage
  const { loading: homepageLoading, data: homepageData } = useHomepage();

  // Refs to track loading state and timers
  const loadingStateRef = useRef<{
    minTimeElapsed: boolean;
    apiDataLoaded: boolean;
    checkShouldHide: (() => void) | null;
  }>({
    minTimeElapsed: false,
    apiDataLoaded: false,
    checkShouldHide: null,
  });

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect to watch homepage loading state and trigger hide check
  useEffect(() => {
    if (!isLoading || !isHomePage) return;

    // If homepage data is loaded and not loading, mark it as loaded
    if (!homepageLoading && homepageData) {
      loadingStateRef.current.apiDataLoaded = true;
      // Trigger the hide check if it exists
      if (loadingStateRef.current.checkShouldHide) {
        loadingStateRef.current.checkShouldHide();
      }
    }
  }, [isLoading, isHomePage, homepageLoading, homepageData]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || hasShownRef.current) return;

    // Check if this is a page reload/refresh (not client-side navigation)
    let isReload = false;
    
    try {
      // Method 1: Check PerformanceNavigationTiming API (most reliable)
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        const navEntry = navEntries[0];
        isReload = navEntry.type === 'reload';
      }
      
      // Method 2: Fallback - check sessionStorage flag
      // On client-side navigation, Next.js doesn't reload, so the flag persists
      // On reload, sessionStorage is cleared, so no flag exists
      if (!isReload) {
        const hasNavigated = sessionStorage.getItem('hsr-client-navigated');
        // If no flag exists, it's a fresh page load/reload
        if (!hasNavigated) {
          isReload = true;
        }
      }
    } catch (e) {
      // Fallback: check sessionStorage
      const hasNavigated = sessionStorage.getItem('hsr-client-navigated');
      if (!hasNavigated) {
        isReload = true;
      }
    }

    // Set flag to indicate client-side navigation has occurred
    // This flag persists until the tab is closed (sessionStorage)
    sessionStorage.setItem('hsr-client-navigated', 'true');

    // Only show loading screen on actual page reload/refresh
    if (!isReload) {
      return;
    }

    // Mark that we've shown the loading screen
    hasShownRef.current = true;

    // Reset loading state on page reload
    setIsLoading(true);
    setProgress(0);

    let progressInterval: NodeJS.Timeout | null = null;
    let hideTimeout: NodeJS.Timeout | null = null;
    let minTimeTimeout: NodeJS.Timeout | null = null;
    let maxWaitTimeout: NodeJS.Timeout | null = null;
    const minDisplayTime = 1500; // Minimum 1.5 seconds display time

    // Reset loading state ref
    loadingStateRef.current.minTimeElapsed = false;
    loadingStateRef.current.apiDataLoaded = false;

    // Function to check if we should hide the loading screen
    const checkShouldHide = () => {
      // If on homepage, wait for both minimum time AND API data
      // Note: apiDataLoaded is only set to true when data is actually loaded (verified by separate effect)
      if (isHomePage) {
        if (loadingStateRef.current.minTimeElapsed && 
            loadingStateRef.current.apiDataLoaded) {
          setIsLoading(false);
          // Clean up all timers
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
          if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
          }
          if (minTimeTimeout) {
            clearTimeout(minTimeTimeout);
            minTimeTimeout = null;
          }
          if (maxWaitTimeout) {
            clearTimeout(maxWaitTimeout);
            maxWaitTimeout = null;
          }
          loadingStateRef.current.checkShouldHide = null;
        }
      } else {
        // For other pages, just wait for minimum time
        if (loadingStateRef.current.minTimeElapsed) {
          setIsLoading(false);
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
          if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
          }
          loadingStateRef.current.checkShouldHide = null;
        }
      }
    };

    // Store check function in ref so it can be called from other effects
    loadingStateRef.current.checkShouldHide = checkShouldHide;

    // Start progress animation immediately
    let currentProgress = 0;
    progressInterval = setInterval(() => {
      currentProgress += 2.5; // Increment by 2.5% each interval
      if (currentProgress > 100) {
        currentProgress = 100;
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
      }
      setProgress(currentProgress);
    }, 40); // Update every 40ms for smooth animation

    // Mark minimum time as elapsed after minDisplayTime
    minTimeTimeout = setTimeout(() => {
      loadingStateRef.current.minTimeElapsed = true;
      checkShouldHide();
    }, minDisplayTime);

    // If on homepage, check if data is already loaded (from cache)
    if (isHomePage) {
      if (!homepageLoading && homepageData) {
        loadingStateRef.current.apiDataLoaded = true;
        // Will be checked when minTimeElapsed becomes true
      }
      
      // Fallback: if API takes too long, show anyway after 5 seconds
      maxWaitTimeout = setTimeout(() => {
        loadingStateRef.current.apiDataLoaded = true;
        checkShouldHide();
      }, 5000);
    } else {
      // For non-homepage, just wait for minimum time
      hideTimeout = setTimeout(() => {
        setIsLoading(false);
      }, minDisplayTime);
    }

    // Cleanup function
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      if (minTimeTimeout) {
        clearTimeout(minTimeTimeout);
      }
      if (maxWaitTimeout) {
        clearTimeout(maxWaitTimeout);
      }
    };
    // homepageLoading and homepageData are handled in separate effect (lines 36-47)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isHomePage]);

  if (!mounted || !isLoading) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center">
      <div className="bg-[#1a1a1a] rounded-2xl p-12 sm:p-16 md:p-20 flex flex-col items-center justify-center min-w-[280px] sm:min-w-[320px] md:min-w-[400px]">
        {/* Logo */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-8 sm:mb-10 md:mb-12">
          <Image
            src="/images/logo.png"
            alt="HSR Green Homes logo"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
          />
        </div>

        {/* Loading Bar */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <div className="h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

