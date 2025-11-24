'use client';

import { slugify } from './utils';

export const PROJECTS_STORAGE_KEY = 'adminProjects';
export const PROJECTS_EVENT = 'hsr-projects-updated';

export type ProjectStatus = 'Ongoing' | 'Completed';

export interface ProjectRecord {
  id: number;
  title: string;
  location: string;
  reraNumber: string;
  status: ProjectStatus;
  heroImage: string;
  description?: string;
  configurations?: string[];
  price?: string;
  isFeatured?: boolean;
  galleryImages?: string[];
  floorPlans?: string[];
  amenities?: string[];
  slug: string;
}

const normalizeStatus = (status?: string): ProjectStatus => {
  if (!status) return 'Ongoing';
  return status.toLowerCase() === 'completed' ? 'Completed' : 'Ongoing';
};

const defaultProjects: ProjectRecord[] = [];

const coerceProject = (project: any, fallback?: ProjectRecord): ProjectRecord => {
  const title = project?.title ?? fallback?.title ?? 'HSR Project';

  return {
    id: Number(project?.id ?? fallback?.id ?? Date.now()),
    title,
    location: project?.location ?? fallback?.location ?? 'Karimnagar, Telangana',
    reraNumber: project?.reraNumber ?? fallback?.reraNumber ?? 'N/A',
    status: normalizeStatus(project?.status ?? fallback?.status),
    heroImage:
      project?.heroImage ||
      project?.image ||
      fallback?.heroImage ||
      '',
    description: project?.description ?? fallback?.description ?? '',
    configurations: project?.configurations ?? fallback?.configurations ?? [],
    galleryImages: project?.galleryImages ?? fallback?.galleryImages ?? [],
    floorPlans: project?.floorPlans ?? fallback?.floorPlans ?? [],
    amenities: project?.amenities ?? fallback?.amenities ?? [],
    price: project?.price ?? fallback?.price ?? 'Price on Request',
    isFeatured: Boolean(project?.isFeatured ?? fallback?.isFeatured ?? false),
    slug: project?.slug ?? fallback?.slug ?? slugify(title),
  };
};

export const getDefaultProjects = () => defaultProjects;

const readStoredProjects = (): ProjectRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const STORAGE_QUOTA_ERROR = 'STORAGE_QUOTA_EXCEEDED';

const writeStoredProjects = (projects: ProjectRecord[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    emitProjectsUpdate();
  } catch (error: any) {
    const isQuotaError =
      error?.name === 'QuotaExceededError' ||
      error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error?.code === 22;
    if (isQuotaError) {
      const quotaError = new Error(STORAGE_QUOTA_ERROR);
      quotaError.name = STORAGE_QUOTA_ERROR;
      throw quotaError;
    }
    throw error;
  }
};

export const getProjects = (): ProjectRecord[] => {
  if (typeof window === 'undefined') {
    return defaultProjects;
  }

  try {
    const storedRaw = readStoredProjects();
    const merged = [...defaultProjects];

    storedRaw.forEach((raw: any) => {
      const normalized = coerceProject(raw);
      const existingIndex = merged.findIndex((project) => project.id === normalized.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = { ...merged[existingIndex], ...normalized };
      } else {
        merged.push(normalized);
      }
    });

    return merged;
  } catch (error) {
    console.error('Failed to read admin projects:', error);
    return defaultProjects;
  }
};

export const emitProjectsUpdate = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(PROJECTS_EVENT));
};

export const subscribeToProjects = (callback: (projects: ProjectRecord[]) => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = () => callback(getProjects());
  window.addEventListener(PROJECTS_EVENT, handler);
  const storageHandler = (event: StorageEvent) => {
    if (event.key === PROJECTS_STORAGE_KEY) {
      handler();
    }
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(PROJECTS_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
};

export const getProjectById = (id: number) =>
  getProjects().find((project) => project.id === id);

export const generateProjectSlug = (title: string, id?: number) => {
  const base = slugify(title || 'project');
  const allProjects = getProjects();
  let slug = base;
  let counter = 1;
  while (allProjects.some((project) => project.slug === slug && project.id !== id)) {
    slug = `${base}-${counter++}`;
  }
  return slug;
};

export const upsertProject = (project: ProjectRecord) => {
  if (typeof window === 'undefined') return;
  const stored = readStoredProjects();
  const normalized = coerceProject(project);
  const existingIndex = stored.findIndex((item) => item.id === normalized.id);
  if (existingIndex >= 0) {
    stored[existingIndex] = { ...stored[existingIndex], ...normalized };
  } else {
    stored.push(normalized);
  }
  writeStoredProjects(stored);
};

export const deleteProject = (id: number) => {
  if (typeof window === 'undefined') return;
  const stored = readStoredProjects();
  const filtered = stored.filter((project) => project.id !== id);
  writeStoredProjects(filtered);
};

export const ProjectStoreErrors = {
  STORAGE_QUOTA_EXCEEDED: STORAGE_QUOTA_ERROR,
} as const;

