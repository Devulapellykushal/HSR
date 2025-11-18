import api from '@/lib/api';

export interface Testimonial {
  id: number;
  customer_name: string;
  project_id: number;
  project_title?: string;
  project_location?: string;
  quote: string;
  customer_photo?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TestimonialCreateUpdatePayload {
  customer_name: string;
  project_id: number;
  quote: string;
  customer_photo?: string;
  is_active?: boolean;
  display_order?: number;
}

export const testimonialsService = {
  async getAllTestimonials(filters?: {
    is_active?: boolean;
    project_id?: number;
    search?: string;
    include_deleted?: boolean;
  }): Promise<Testimonial[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<{ success: boolean; data: Testimonial[]; message: string }>(
      `/testimonials/?${params.toString()}`
    );
    return response.data.data;
  },

  async getTestimonialById(id: number): Promise<Testimonial> {
    const response = await api.get<{ success: boolean; data: Testimonial; message: string }>(
      `/testimonials/${id}/`
    );
    return response.data.data;
  },

  async createTestimonial(testimonialData: TestimonialCreateUpdatePayload): Promise<Testimonial> {
    const response = await api.post<{ success: boolean; data: Testimonial; message: string }>(
      '/testimonials/',
      testimonialData
    );
    return response.data.data;
  },

  async updateTestimonial(id: number, testimonialData: Partial<TestimonialCreateUpdatePayload>): Promise<Testimonial> {
    const response = await api.put<{ success: boolean; data: Testimonial; message: string }>(
      `/testimonials/${id}/`,
      testimonialData
    );
    return response.data.data;
  },

  async patchTestimonial(id: number, testimonialData: Partial<TestimonialCreateUpdatePayload>): Promise<Testimonial> {
    const response = await api.patch<{ success: boolean; data: Testimonial; message: string }>(
      `/testimonials/${id}/`,
      testimonialData
    );
    return response.data.data;
  },

  async deleteTestimonial(id: number): Promise<void> {
    await api.delete(`/testimonials/${id}/`);
  },

  async restoreTestimonial(id: number): Promise<Testimonial> {
    const response = await api.post<{ success: boolean; data: Testimonial; message: string }>(
      `/testimonials/${id}/restore/`
    );
    return response.data.data;
  },
};

