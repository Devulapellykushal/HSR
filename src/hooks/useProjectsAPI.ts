'use client';

import { useEffect, useState } from 'react';
import { projectsService, Project } from '@/services/projectsService';

// Shared cache to prevent multiple API calls
let cachedProjects: Project[] | null = null;
let cachedLoading = false;
let cachedError: string | null = null;
let fetchPromise: Promise<Project[]> | null = null;

const fetchProjectsData = async (): Promise<Project[]> => {
  // If already cached and no error, return cached data
  if (cachedProjects && !cachedError) {
    return cachedProjects;
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
      const response = await projectsService.getProjects();
      cachedProjects = response.results;
      return cachedProjects;
    } catch (err: any) {
      cachedError = err.response?.data?.message || 'Failed to load projects';
      console.error('Projects error:', err);
      throw err;
    } finally {
      cachedLoading = false;
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

// Function to invalidate cache (call after updates)
export const invalidateProjectsCache = () => {
  cachedProjects = null;
  cachedError = null;
  fetchPromise = null;
};

export function useProjectsAPI() {
  const [projects, setProjects] = useState<Project[]>(cachedProjects || []);
  const [loading, setLoading] = useState(cachedLoading);
  const [error, setError] = useState<string | null>(cachedError);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const projectsData = await fetchProjectsData();
        setProjects(projectsData);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have cached data
    if (!cachedProjects) {
      loadData();
    } else {
      // Use cached data immediately
      setProjects(cachedProjects);
      setLoading(false);
      setError(cachedError);
    }
  }, []);

  return { projects, loading, error };
}

