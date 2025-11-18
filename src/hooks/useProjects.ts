'use client';

import { useEffect, useState } from 'react';
import { getDefaultProjects, getProjects, subscribeToProjects, ProjectRecord } from '@/lib/projectsStore';

export function useProjects() {
  const [projects, setProjects] = useState<ProjectRecord[]>(getDefaultProjects());

  useEffect(() => {
    setProjects(getProjects());
    const unsubscribe = subscribeToProjects((next) => setProjects(next));
    return unsubscribe;
  }, []);

  return projects;
}

