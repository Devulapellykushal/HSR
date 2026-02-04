import api from '@/lib/api';

export interface Project {
  id: number;
  title: string;
  location: string;
  rera_number?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  google_map_embed_url?: string;
  hero_image_url: string;
  hero_image?: string; // Alternative image field
  description?: string;
  configurations?: string[];
  configurations_list?: string[]; // Alternative format
  amenities?: string[];
  amenities_list?: string[]; // Alternative format
  price?: string;
  is_featured: boolean;
  view_count: number;
  slug: string;
  gallery_images?: GalleryImage[];
  floor_plans?: FloorPlan[];
  created_at: string;
  updated_at: string;
  created_by?: number; // ID only
  created_by_name?: string; // Full name from backend
  updated_by?: number; // ID only
  updated_by_name?: string; // Full name from backend
  leads_count?: number; // Count from detail view
  testimonials_count?: number; // Count from detail view
  brochure?: string; // Brochure URL
  brochure_url?: string;
  brochure_file?: string;
}

export interface GalleryImage {
  id: number;
  image_url?: string;
  image?: string; // Actual image URL (from file or URL)
  caption?: string;
  display_order: number;
}

export interface FloorPlan {
  id: number;
  title: string;
  file_url?: string;
  file_path?: string; // Actual file URL (from file or URL)
  display_order: number;
}

export interface ProjectListResponse {
  results: Project[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    page_size: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface ProjectFilters {
  status?: 'upcoming' | 'ongoing' | 'completed';
  is_featured?: boolean;
  search?: string;
  slug?: string;
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'status' | 'view_count';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: 10 | 25 | 50 | 100;
  include_deleted?: boolean;
  include_upcoming?: boolean;
}

export interface CreateProjectData {
  title: string;
  location: string;
  rera_number?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  google_map_embed_url?: string;
  hero_image_url?: string;
  hero_image_file?: File;
  description?: string;
  configurations_list?: string[];
  amenities_list?: string[];
  is_featured?: boolean;
}

export interface BulkActionData {
  project_ids: number[];
  action: 'delete' | 'restore' | 'feature' | 'unfeature' | 'change_status';
  status?: 'upcoming' | 'ongoing' | 'completed';
}

export const projectsService = {
  async getProjects(filters?: ProjectFilters): Promise<ProjectListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<{ success: boolean; data: ProjectListResponse; message: string }>(
      `/projects/?${params.toString()}`
    );
    return response.data.data;
  },

  async getProjectById(id: number): Promise<Project> {
    const response = await api.get<{ success: boolean; data: Project; message: string }>(
      `/projects/${id}/`
    );
    return response.data.data;
  },

  async createProject(data: CreateProjectData): Promise<Project> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('location', data.location);
    if (data.rera_number) {
      formData.append('rera_number', data.rera_number);
    }
    formData.append('status', data.status);
    if (data.google_map_embed_url) {
      formData.append('google_map_embed_url', data.google_map_embed_url);
    }
    if (data.hero_image_file) {
      formData.append('hero_image_file', data.hero_image_file);
    } else if (data.hero_image_url) {
      formData.append('hero_image_url', data.hero_image_url);
    }
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.configurations_list) {
      data.configurations_list.forEach((config) => {
        formData.append('configurations_list', config);
      });
    }
    if (data.amenities_list) {
      data.amenities_list.forEach((amenity) => {
        formData.append('amenities_list', amenity);
      });
    }
    if (data.is_featured !== undefined) {
      formData.append('is_featured', String(data.is_featured));
    }

    const response = await api.post<{ success: boolean; data: Project; message: string }>(
      '/projects/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  async updateProject(id: number, data: Partial<CreateProjectData>): Promise<Project> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'hero_image_file' && value instanceof File) {
          formData.append('hero_image_file', value);
        } else if (key === 'configurations_list' && Array.isArray(value)) {
          value.forEach((item) => formData.append('configurations_list', item));
        } else if (key === 'amenities_list' && Array.isArray(value)) {
          value.forEach((item) => formData.append('amenities_list', item));
        } else if (typeof value === 'boolean') {
          formData.append(key, String(value));
        } else if (typeof value === 'string' || typeof value === 'number') {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.put<{ success: boolean; data: Project; message: string }>(
      `/projects/${id}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  async patchProject(id: number, data: Partial<CreateProjectData>): Promise<Project> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'hero_image_file' && value instanceof File) {
          formData.append('hero_image_file', value);
        } else if (key === 'configurations_list' && Array.isArray(value)) {
          value.forEach((item) => formData.append('configurations_list', item));
        } else if (key === 'amenities_list' && Array.isArray(value)) {
          value.forEach((item) => formData.append('amenities_list', item));
        } else if (typeof value === 'boolean') {
          formData.append(key, String(value));
        } else if (typeof value === 'string' || typeof value === 'number') {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.patch<{ success: boolean; data: Project; message: string }>(
      `/projects/${id}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}/`);
  },

  async restoreProject(id: number): Promise<Project> {
    const response = await api.post<{ success: boolean; data: Project; message: string }>(
      `/projects/${id}/restore/`
    );
    return response.data.data;
  },

  async cloneProject(id: number): Promise<Project> {
    const response = await api.post<{ success: boolean; data: Project; message: string }>(
      `/projects/${id}/clone/`
    );
    return response.data.data;
  },

  async bulkAction(data: BulkActionData): Promise<void> {
    await api.post('/projects/bulk-actions/', data);
  },

  async exportProjects(): Promise<Blob> {
    const response = await api.get('/projects/export/', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Gallery Images
  async getGalleryImages(projectId: number): Promise<GalleryImage[]> {
    const response = await api.get<{ success: boolean; data: GalleryImage[]; message: string }>(
      `/projects/${projectId}/gallery/`
    );
    // Map the response to ensure image_url is set from image field if available
    return response.data.data.map((img) => ({
      ...img,
      image_url: (img as any).image || img.image_url || '',
    }));
  },

  async addGalleryImage(
    projectId: number,
    data: { image_url?: string; image_file?: File; caption?: string; display_order?: number }
  ): Promise<GalleryImage> {
    const formData = new FormData();
    if (data.image_file) {
      formData.append('image_file', data.image_file);
    } else if (data.image_url) {
      formData.append('image_url', data.image_url);
    }
    if (data.caption) {
      formData.append('caption', data.caption);
    }
    if (data.display_order !== undefined) {
      formData.append('display_order', String(data.display_order));
    }

    const response = await api.post<{ success: boolean; data: GalleryImage; message: string }>(
      `/projects/${projectId}/gallery/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const image = response.data.data;
    return {
      ...image,
      image_url: (image as any).image || image.image_url || '',
    };
  },

  async updateGalleryImage(projectId: number, imageId: number, data: Partial<GalleryImage>): Promise<GalleryImage> {
    const response = await api.put<{ success: boolean; data: GalleryImage; message: string }>(
      `/projects/${projectId}/gallery/${imageId}/`,
      data
    );
    return response.data.data;
  },

  async deleteGalleryImage(projectId: number, imageId: number): Promise<void> {
    await api.delete(`/projects/${projectId}/gallery/${imageId}/`);
  },

  // Floor Plans
  async getFloorPlans(projectId: number): Promise<FloorPlan[]> {
    const response = await api.get<{ success: boolean; data: FloorPlan[]; message: string }>(
      `/projects/${projectId}/floor-plans/`
    );
    // Map the response to ensure file_url is set from file_path field if available
    return response.data.data.map((plan) => ({
      ...plan,
      file_url: (plan as any).file_path || plan.file_url || '',
    }));
  },

  async addFloorPlan(
    projectId: number,
    data: { title: string; file_url?: string; file?: File; display_order?: number }
  ): Promise<FloorPlan> {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.file) {
      formData.append('file', data.file);
    } else if (data.file_url) {
      formData.append('file_url', data.file_url);
    }
    if (data.display_order !== undefined) {
      formData.append('display_order', String(data.display_order));
    }

    const response = await api.post<{ success: boolean; data: FloorPlan; message: string }>(
      `/projects/${projectId}/floor-plans/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const plan = response.data.data;
    return {
      ...plan,
      file_url: (plan as any).file_path || plan.file_url || '',
    };
  },

  async updateFloorPlan(projectId: number, planId: number, data: Partial<FloorPlan>): Promise<FloorPlan> {
    const response = await api.put<{ success: boolean; data: FloorPlan; message: string }>(
      `/projects/${projectId}/floor-plans/${planId}/`,
      data
    );
    return response.data.data;
  },

  async deleteFloorPlan(projectId: number, planId: number): Promise<void> {
    await api.delete(`/projects/${projectId}/floor-plans/${planId}/`);
  },

  // Reference Data
  async getConfigurations(): Promise<Array<{ key: string; label: string }>> {
    const response = await api.get<{ success: boolean; data: Array<{ key: string; label: string }>; message: string }>(
      '/projects/configurations/'
    );
    return response.data.data;
  },

  async getAmenities(): Promise<Array<{ key: string; label: string }>> {
    const response = await api.get<{ success: boolean; data: Array<{ key: string; label: string }>; message: string }>(
      '/projects/amenities/'
    );
    return response.data.data;
  },
};

