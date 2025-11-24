'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const hasShownRef = useRef(false);

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

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
    const minDisplayTime = 1500; // Minimum 1.5 seconds display time

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

    // Always hide after minimum display time
    hideTimeout = setTimeout(() => {
      setIsLoading(false);
    }, minDisplayTime);

    // Cleanup function
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [mounted]);

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

