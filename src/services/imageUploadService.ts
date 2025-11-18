import api from '@/lib/api';

export interface UploadedImage {
  id: number;
  title: string | null;
  image_file: string;
  image_url: string;
  description: string | null;
  uploaded_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ImageUploadResponse {
  success: boolean;
  imageUrl: string;
  image: UploadedImage;
}

export interface UploadedImagesListResponse {
  results: UploadedImage[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

class ImageUploadService {
  /**
   * Upload an image file
   */
  async uploadImage(
    file: File,
    title?: string,
    description?: string
  ): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    if (title) {
      formData.append('title', title);
    }
    if (description) {
      formData.append('description', description);
    }

    const response = await api.post<{
      success: boolean;
      message: string;
      data: ImageUploadResponse;
      errors: any;
    }>(
      '/images/upload/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Extract the data from the wrapped response
    return response.data.data;
  }

  /**
   * Get list of all uploaded images
   */
  async getUploadedImages(
    page: number = 1,
    pageSize: number = 20
  ): Promise<UploadedImagesListResponse> {
    const response = await api.get<{
      success: boolean;
      message: string;
      data: UploadedImagesListResponse;
      errors: any;
    }>('/images/', {
      params: {
        page,
        page_size: pageSize,
      },
    });

    return response.data.data;
  }

  /**
   * Get a specific uploaded image by ID
   */
  async getUploadedImage(id: number): Promise<UploadedImage> {
    const response = await api.get<{
      success: boolean;
      message: string;
      data: UploadedImage;
      errors: any;
    }>(`/images/${id}/`);
    return response.data.data;
  }

  /**
   * Delete an uploaded image
   */
  async deleteUploadedImage(id: number): Promise<void> {
    await api.delete(`/images/${id}/`);
  }
}

export const imageUploadService = new ImageUploadService();

