'use client';

/**
 * Homepage State Management Hook
 * 
 * This hook provides efficient state management for homepage data with:
 * 
 * 1. **In-Memory Caching**: Prevents duplicate API calls within the same tab
 * 2. **Cross-Tab Synchronization**: Uses localStorage events to sync cache invalidation across browser tabs
 * 3. **Cache Versioning**: Tracks cache version in localStorage to detect updates from other tabs/devices
 * 4. **Automatic Expiration**: Cache expires after 15 seconds for faster cross-device updates
 * 5. **Visibility Detection**: Checks for stale cache when tab becomes active
 * 
 * How it works:
 * - When admin updates content, `invalidateHomepageCache()` increments cache version in localStorage
 * - Other tabs detect the version change via StorageEvent and automatically refresh
 * - Cache expires after 15 seconds to ensure fresh data across devices
 * - Tab visibility changes trigger cache validation checks
 * 
 * Usage:
 * ```tsx
 * const { data, loading, error } = useHomepage();
 * ```
 */

import { CompleteHomePage, homepageService } from '@/services/homepageService';
import { useEffect, useState } from 'react';

// Shared cache to prevent multiple API calls
let cachedData: CompleteHomePage | null = null;
let cachedLoading = false;
let cachedError: string | null = null;
let fetchPromise: Promise<CompleteHomePage> | null = null;
let cacheTimestamp: number | null = null;

// Cache expiration time: 15 seconds (15000 ms) - reduced for faster cross-device updates
const CACHE_EXPIRY_MS = 15 * 1000;

// localStorage keys for cross-tab synchronization
const CACHE_VERSION_KEY = 'hsr_homepage_cache_version';
const CACHE_TIMESTAMP_KEY = 'hsr_homepage_cache_timestamp';

// Initialize cache version if not exists
if (typeof window !== 'undefined') {
  try {
    if (!localStorage.getItem(CACHE_VERSION_KEY)) {
      localStorage.setItem(CACHE_VERSION_KEY, '0');
    }
  } catch (e) {
    // Ignore localStorage errors
  }
}

// Function to get current cache version
const getCacheVersion = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    return parseInt(localStorage.getItem(CACHE_VERSION_KEY) || '0', 10);
  } catch {
    return 0;
  }
};

// Function to increment cache version (triggers cross-tab invalidation)
const incrementCacheVersion = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const currentVersion = getCacheVersion();
    localStorage.setItem(CACHE_VERSION_KEY, String(currentVersion + 1));
    // Also update timestamp to trigger storage event
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
  } catch (e) {
    console.warn('Failed to update cache version:', e);
  }
};

// Function to invalidate cache (call this after admin updates)
export function invalidateHomepageCache() {
  cachedData = null;
  cachedError = null;
  fetchPromise = null;
  cacheTimestamp = null;
  
  if (typeof window !== 'undefined') {
    try {
      // Clear old localStorage keys
      localStorage.removeItem('hsr_home_content');
      
      // Increment cache version to notify all tabs
      incrementCacheVersion();
      
      // Dispatch event to notify components in this tab
      window.dispatchEvent(new CustomEvent('homepage-cache-invalidated'));
    } catch (e) {
      console.warn('Failed to invalidate cache:', e);
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
      cacheTimestamp = Date.now();
      
      // Update localStorage timestamp for cross-tab coordination
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(CACHE_TIMESTAMP_KEY, String(cacheTimestamp));
        } catch (e) {
          // Ignore localStorage errors
        }
      }
      
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
  const [cacheVersion, setCacheVersion] = useState<number>(getCacheVersion());

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

    // Listen for cache invalidation events (same tab)
    const handleCacheInvalidation = () => {
      cachedData = null;
      cachedError = null;
      fetchPromise = null;
      cacheTimestamp = null;
      const newVersion = getCacheVersion();
      setCacheVersion(newVersion);
      loadData();
    };

    // Listen for homepage data updates (same tab)
    const handleHomepageDataUpdate = () => {
      cachedData = null;
      cachedError = null;
      fetchPromise = null;
      cacheTimestamp = null;
      const newVersion = getCacheVersion();
      setCacheVersion(newVersion);
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

    // Listen for localStorage changes (cross-tab synchronization)
    const handleStorageChange = (event: StorageEvent) => {
      // Check if cache version changed (cache was invalidated in another tab)
      if (event.key === CACHE_VERSION_KEY || event.key === CACHE_TIMESTAMP_KEY) {
        const newVersion = getCacheVersion();
        // Always check against current state, not closure value
        setCacheVersion(prevVersion => {
          if (newVersion !== prevVersion) {
            // Cache was invalidated in another tab, clear our cache
            cachedData = null;
            cachedError = null;
            fetchPromise = null;
            cacheTimestamp = null;
            // Reload data
            loadData();
            return newVersion;
          }
          return prevVersion;
        });
      }
    };

    // Listen for visibility change (tab becomes active - check for stale cache)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentVersion = getCacheVersion();
        setCacheVersion(prevVersion => {
          if (currentVersion !== prevVersion) {
            // Cache version changed while tab was inactive
            cachedData = null;
            cachedError = null;
            fetchPromise = null;
            cacheTimestamp = null;
            loadData();
            return currentVersion;
          } else if (cacheTimestamp && (Date.now() - cacheTimestamp) > CACHE_EXPIRY_MS) {
            // Cache expired while tab was inactive
            cachedData = null;
            cachedError = null;
            fetchPromise = null;
            cacheTimestamp = null;
            loadData();
          }
          return prevVersion;
        });
      }
    };

    window.addEventListener('homepage-cache-invalidated', handleCacheInvalidation);
    window.addEventListener('homepage-data-updated', handleHomepageDataUpdate);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Only fetch if we don't have cached data
    if (!cachedData) {
      loadData();
    } else {
      // Use cached data immediately, but check if it's still valid
      const isStale = cacheTimestamp && (Date.now() - cacheTimestamp) > CACHE_EXPIRY_MS;
      if (isStale) {
        // Cache is stale, reload
        loadData();
      } else {
        setData(cachedData);
        setLoading(false);
        setError(cachedError);
      }
    }

    return () => {
      window.removeEventListener('homepage-cache-invalidated', handleCacheInvalidation);
      window.removeEventListener('homepage-data-updated', handleHomepageDataUpdate);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cacheVersion]);

  return { data, loading, error };
}

