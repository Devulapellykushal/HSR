import api from '@/lib/api';

export interface HeroSection {
  hero_title: string;
  hero_subtitle: string;
  hero_background_image: string;
  hero_cta_button_text: string;
}

export interface StatisticsSection {
  stats_experience_value: string;
  stats_experience_label: string;
  stats_projects_value: string;
  stats_projects_label: string;
  stats_families_value: string;
  stats_families_label: string;
  stats_sqft_value: string;
  stats_sqft_label: string;
}

export interface FooterInfo {
  footer_office_address: string;
  footer_phone_number: string;
  footer_email_address: string;
  footer_whatsapp_number: string;
}

export interface FeaturedProject {
  id: number;
  project: {
    id: number;
    title: string;
    location: string;
    hero_image_url: string;
    slug: string;
  };
  display_order: number;
  is_active: boolean;
}

export interface CompletedProject {
  id: number;
  title: string;
  slug: string;
  location: string;
  rera_number: string;
  status: string;
  hero_image_url: string;
  configurations: string[];
  price?: string;
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  testimonial_text: string;
  rating: number;
  project?: {
    id: number;
    title: string;
  };
  avatar_url?: string;
  display_order: number;
}

export interface HomePageContent extends HeroSection, StatisticsSection, FooterInfo {
  id: number;
}

export interface CompleteHomePage {
  hero_section: HeroSection;
  statistics: StatisticsSection;
  featured_projects: FeaturedProject[];
  completed_projects: CompletedProject[];
  testimonials: Testimonial[];
}

export const homepageService = {
  // Complete Homepage (Optimized)
  async getCompleteHomePage(forceRefresh = false): Promise<CompleteHomePage> {
    // Add cache-busting parameter when force refresh is requested
    const params = forceRefresh ? { _t: Date.now() } : {};
    const response = await api.get<{ success: boolean; data: CompleteHomePage; message: string }>(
      '/homepage/',
      { params }
    );
    return response.data.data;
  },

  // Homepage Content
  async getHomePageContent(): Promise<HomePageContent> {
    const response = await api.get<{ success: boolean; data: HomePageContent; message: string }>(
      '/homepage/content/'
    );
    return response.data.data;
  },

  async updateHomePageContent(data: Partial<HomePageContent>): Promise<HomePageContent> {
    const response = await api.put<{ success: boolean; data: HomePageContent; message: string }>(
      '/homepage/content/',
      data
    );
    return response.data.data;
  },

  // Hero Section
  async getHeroSection(): Promise<HeroSection> {
    const response = await api.get<{ success: boolean; data: HeroSection; message: string }>(
      '/homepage/hero/'
    );
    return response.data.data;
  },

  async updateHeroSection(data: Partial<HeroSection>): Promise<HeroSection> {
    const response = await api.put<{ success: boolean; data: HeroSection; message: string }>(
      '/homepage/hero/',
      data
    );
    return response.data.data;
  },

  // Statistics Section
  async getStatisticsSection(): Promise<StatisticsSection> {
    const response = await api.get<{ success: boolean; data: StatisticsSection; message: string }>(
      '/homepage/statistics/'
    );
    return response.data.data;
  },

  async updateStatisticsSection(data: Partial<StatisticsSection>): Promise<StatisticsSection> {
    const response = await api.put<{ success: boolean; data: StatisticsSection; message: string }>(
      '/homepage/statistics/',
      data
    );
    return response.data.data;
  },

  // Footer Info
  async getFooterInfo(): Promise<FooterInfo> {
    const response = await api.get<{ success: boolean; data: FooterInfo; message: string }>(
      '/homepage/footer/'
    );
    return response.data.data;
  },

  async updateFooterInfo(data: Partial<FooterInfo>): Promise<FooterInfo> {
    const response = await api.put<{ success: boolean; data: FooterInfo; message: string }>(
      '/homepage/footer/',
      data
    );
    return response.data.data;
  },

  // Featured Projects
  async getFeaturedProjects(showAll?: boolean): Promise<FeaturedProject[]> {
    const params = showAll ? '?all=true' : '';
    const url = params ? `/homepage/featured-projects/${params}` : '/homepage/featured-projects/';
    const response = await api.get<{ success: boolean; data: FeaturedProject[]; message: string }>(
      url
    );
    return response.data.data;
  },

  async addFeaturedProject(data: { project_id: number; display_order?: number; is_active?: boolean }): Promise<FeaturedProject> {
    const response = await api.post<{ success: boolean; data: FeaturedProject; message: string }>(
      '/homepage/featured-projects/',
      data
    );
    return response.data.data;
  },

  async getFeaturedProject(id: number): Promise<FeaturedProject> {
    const response = await api.get<{ success: boolean; data: FeaturedProject; message: string }>(
      `/homepage/featured-projects/${id}/`
    );
    return response.data.data;
  },

  async updateFeaturedProject(id: number, data: Partial<FeaturedProject>): Promise<FeaturedProject> {
    const response = await api.put<{ success: boolean; data: FeaturedProject; message: string }>(
      `/homepage/featured-projects/${id}/`,
      data
    );
    return response.data.data;
  },

  async deleteFeaturedProject(id: number): Promise<void> {
    await api.delete(`/homepage/featured-projects/${id}/`);
  },

  // Testimonials (Display only - backend doesn't have CRUD yet)
  async getTestimonials(limit?: number): Promise<Testimonial[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get<{ success: boolean; data: Testimonial[]; message: string }>(
      `/homepage/testimonials${params}`
    );
    return response.data.data;
  },
};

