import api from '@/lib/api';

export interface ContactSettings {
  // WhatsApp
  whatsapp_enabled: boolean;
  whatsapp_number: string;
  whatsapp_business_hours: string;
  whatsapp_auto_reply: string;
  // Phone
  primary_phone: string;
  secondary_phone?: string;
  toll_free_number?: string;
  phone_business_hours: string;
  // Email
  info_email: string;
  sales_email: string;
  support_email: string;
  email_auto_reply_enabled: boolean;
  email_auto_reply_subject: string;
  email_auto_reply_message: string;
  // Address
  street_address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  google_maps_embed_code?: string;
  // Social Media
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  // Timestamps
  created_at: string;
  updated_at: string;
}

export const contactSettingsService = {
  async getContactSettings(): Promise<ContactSettings> {
    const response = await api.get<{ success: boolean; data: ContactSettings; message: string }>(
      '/contact-settings/'
    );
    return response.data.data;
  },

  async updateContactSettings(data: Partial<ContactSettings>): Promise<ContactSettings> {
    const response = await api.put<{ success: boolean; data: ContactSettings; message: string }>(
      '/contact-settings/',
      data
    );
    return response.data.data;
  },
};

