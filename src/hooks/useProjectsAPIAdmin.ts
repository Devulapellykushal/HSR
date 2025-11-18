'use client';

import { useEffect, useState } from 'react';
import { projectsService, Project } from '@/services/projectsService';

// Separate cache for admin (includes upcoming projects)
let cachedAdminProjects: Project[] | null = null;
let cachedAdminLoading = false;
let cachedAdminError: string | null = null;
let fetchAdminPromise: Promise<Project[]> | null = null;

const fetchAdminProjectsData = async (): Promise<Project[]> => {
  // If already cached and no error, return cached data
  if (cachedAdminProjects && !cachedAdminError) {
    return cachedAdminProjects;
  }

  // If already fetching, return the existing promise
  if (fetchAdminPromise) {
    return fetchAdminPromise;
  }

  // Start new fetch with include_upcoming=true for admin
  fetchAdminPromise = (async () => {
    try {
      cachedAdminLoading = true;
      cachedAdminError = null;
      const response = await projectsService.getProjects({ include_upcoming: true });
      cachedAdminProjects = response.results;
      return cachedAdminProjects;
    } catch (err: any) {
      cachedAdminError = err.response?.data?.message || 'Failed to load projects';
      console.error('Admin projects error:', err);
      throw err;
    } finally {
      cachedAdminLoading = false;
      fetchAdminPromise = null;
    }
  })();

  return fetchAdminPromise;
};

// Function to invalidate admin cache (call after updates)
export const invalidateAdminProjectsCache = () => {
  cachedAdminProjects = null;
  cachedAdminError = null;
  fetchAdminPromise = null;
};

export function useProjectsAPIAdmin() {
  const [projects, setProjects] = useState<Project[]>(cachedAdminProjects || []);
  const [loading, setLoading] = useState(cachedAdminLoading);
  const [error, setError] = useState<string | null>(cachedAdminError);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const projectsData = await fetchAdminProjectsData();
        setProjects(projectsData);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have cached data
    if (!cachedAdminProjects) {
      loadData();
    } else {
      // Use cached data immediately
      setProjects(cachedAdminProjects);
      setLoading(false);
      setError(cachedAdminError);
    }
  }, []);

  return { projects, loading, error, invalidateCache: invalidateAdminProjectsCache };
}

