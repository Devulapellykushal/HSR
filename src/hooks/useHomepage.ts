'use client';

import { CompleteHomePage, homepageService } from '@/services/homepageService';
import { useEffect, useState } from 'react';

// Shared cache to prevent multiple API calls
let cachedData: CompleteHomePage | null = null;
let cachedLoading = false;
let cachedError: string | null = null;
let fetchPromise: Promise<CompleteHomePage> | null = null;
let cacheTimestamp: number | null = null;

// Cache expiration time: 5 minutes (300000 ms)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

// Function to invalidate cache (call this after admin updates)
export function invalidateHomepageCache() {
  cachedData = null;
  cachedError = null;
  fetchPromise = null;
  cacheTimestamp = null; // Clear cache timestamp
  // Clear any localStorage that might be caching homepage data
  if (typeof window !== 'undefined') {
    try {
      // Clear the specific localStorage key if it exists
      localStorage.removeItem('hsr_home_content');
      // Dispatch event to notify all components using the hook
      window.dispatchEvent(new CustomEvent('homepage-cache-invalidated'));
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
  }
}

const fetchHomepageData = async (forceRefresh = false): Promise<CompleteHomePage> => {
  // Check if cache is still valid (not expired)
  const isCacheValid = cachedData !== null && 
                       !cachedError && 
                       cacheTimestamp !== null && 
                       (Date.now() - cacheTimestamp) < CACHE_EXPIRY_MS;
  
  // If already cached, no error, and cache is still valid, return cached data
  if (isCacheValid && !forceRefresh && cachedData !== null) {
    return cachedData;
  }
  
  // If cache expired or force refresh, clear it
  if (!isCacheValid || forceRefresh) {
    cachedData = null;
    cachedError = null;
  }

  // If already fetching, return the existing promise
  if (fetchPromise) {
    return fetchPromise;
  }

  // Start new fetch
  fetchPromise = (async () => {
    try {
      cachedLoading = true;
      cachedError = null;
      const homepageData = await homepageService.getCompleteHomePage();
      cachedData = homepageData;
      cacheTimestamp = Date.now(); // Update cache timestamp
      return homepageData;
    } catch (err: any) {
      cachedError = err.response?.data?.message || 'Failed to load homepage data';
      console.error('Homepage error:', err);
      throw err;
    } finally {
      cachedLoading = false;
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

export function useHomepage() {
  const [data, setData] = useState<CompleteHomePage | null>(cachedData);
  const [loading, setLoading] = useState(cachedLoading);
  const [error, setError] = useState<string | null>(cachedError);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const homepageData = await fetchHomepageData();
        setData(homepageData);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load homepage data');
      } finally {
        setLoading(false);
      }
    };

    // Listen for cache invalidation events
    const handleCacheInvalidation = () => {
      cachedData = null;
      cachedError = null;
      fetchPromise = null;
      cacheTimestamp = null;
      loadData();
    };

    // Also listen for homepage data updates
    const handleHomepageDataUpdate = () => {
      cachedData = null;
      cachedError = null;
      fetchPromise = null;
      cacheTimestamp = null;
      // Force refresh with API call
      fetchHomepageData(true).then(homepageData => {
        setData(homepageData);
        setError(null);
      }).catch(err => {
        setError(err.response?.data?.message || 'Failed to load homepage data');
      }).finally(() => {
        setLoading(false);
      });
    };

    window.addEventListener('homepage-cache-invalidated', handleCacheInvalidation);
    window.addEventListener('homepage-data-updated', handleHomepageDataUpdate);

    // Only fetch if we don't have cached data
    if (!cachedData) {
      loadData();
    } else {
      // Use cached data immediately
      setData(cachedData);
      setLoading(false);
      setError(cachedError);
    }

    return () => {
      window.removeEventListener('homepage-cache-invalidated', handleCacheInvalidation);
      window.removeEventListener('homepage-data-updated', handleHomepageDataUpdate);
    };
  }, []);

  return { data, loading, error };
}

