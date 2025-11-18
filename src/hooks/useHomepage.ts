'use client';

import { useEffect, useState } from 'react';
import { homepageService, CompleteHomePage } from '@/services/homepageService';

// Shared cache to prevent multiple API calls
let cachedData: CompleteHomePage | null = null;
let cachedLoading = false;
let cachedError: string | null = null;
let fetchPromise: Promise<CompleteHomePage> | null = null;

const fetchHomepageData = async (): Promise<CompleteHomePage> => {
  // If already cached and no error, return cached data
  if (cachedData && !cachedError) {
    return cachedData;
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

    // Only fetch if we don't have cached data
    if (!cachedData) {
      loadData();
    } else {
      // Use cached data immediately
      setData(cachedData);
      setLoading(false);
      setError(cachedError);
    }
  }, []);

  return { data, loading, error };
}

