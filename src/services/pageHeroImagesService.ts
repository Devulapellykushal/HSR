import api from '@/lib/api';

export interface PageHeroImages {
  projects_hero_image_url: string;
  about_hero_image_url: string;
  about_our_story_image_url: string;
  contact_hero_image_url: string;
}

export const pageHeroImagesService = {
  /**
   * Get page hero images (public access)
   */
  async getPageHeroImages(): Promise<PageHeroImages> {
    const response = await api.get<{
      success: boolean;
      data: PageHeroImages;
      message: string;
    }>('/page-hero-images/');
    return response.data.data;
  },

  /**
   * Update page hero images (admin only)
   */
  async updatePageHeroImages(
    data: Partial<PageHeroImages>
  ): Promise<PageHeroImages> {
    const response = await api.put<{
      success: boolean;
      data: PageHeroImages;
      message: string;
    }>('/page-hero-images/', data);
    return response.data.data;
  },
};

