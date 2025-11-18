'use client';

import {
  ContactSettings,
  getDefaultContactSettings,
} from '@/lib/contactStore';
import { ContactSettings as APIContactSettings, contactSettingsService } from '@/services/contactSettingsService';
import { useEffect, useState } from 'react';

// Shared cache to prevent multiple API calls
let cachedSettings: ContactSettings | null = null;
let cachedLoading = false;
let cachedError: string | null = null;
let fetchPromise: Promise<ContactSettings> | null = null;

// Function to invalidate cache (call after updates)
export const invalidateContactSettingsCache = () => {
  cachedSettings = null;
  cachedError = null;
  fetchPromise = null;
};

const mapAPIToLocal = (apiData: APIContactSettings): ContactSettings => {
  return {
    whatsapp: {
      enabled: apiData.whatsapp_enabled,
      number: apiData.whatsapp_number,
      businessHours: apiData.whatsapp_business_hours,
      autoReply: apiData.whatsapp_auto_reply,
    },
    phones: {
      primaryPhone: apiData.primary_phone,
      secondaryPhone: apiData.secondary_phone || '',
      tollFreeNumber: apiData.toll_free_number || '',
      businessHours: apiData.phone_business_hours,
    },
    email: {
      infoEmail: apiData.info_email,
      salesEmail: apiData.sales_email,
      supportEmail: apiData.support_email,
      autoReplyEnabled: apiData.email_auto_reply_enabled,
      autoReplySubject: apiData.email_auto_reply_subject,
      autoReplyMessage: apiData.email_auto_reply_message,
    },
    address: {
      streetAddress: apiData.street_address,
      area: apiData.area,
      city: apiData.city,
      state: apiData.state,
      pincode: apiData.pincode,
      country: apiData.country,
      googleEmbedCode: apiData.google_maps_embed_code || '',
    },
    social: {
      facebook: apiData.facebook_url && apiData.facebook_url.trim() ? apiData.facebook_url.trim() : undefined,
      instagram: apiData.instagram_url && apiData.instagram_url.trim() ? apiData.instagram_url.trim() : undefined,
      twitter: apiData.twitter_url && apiData.twitter_url.trim() ? apiData.twitter_url.trim() : undefined,
      linkedin: apiData.linkedin_url && apiData.linkedin_url.trim() ? apiData.linkedin_url.trim() : undefined,
      youtube: apiData.youtube_url && apiData.youtube_url.trim() ? apiData.youtube_url.trim() : undefined,
    },
  };
};

const fetchContactSettings = async (): Promise<ContactSettings> => {
  // If already cached and no error, return cached data
  if (cachedSettings && !cachedError) {
    return cachedSettings;
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
      const apiData = await contactSettingsService.getContactSettings();
      cachedSettings = mapAPIToLocal(apiData);
      return cachedSettings;
    } catch (err: any) {
      cachedError = err.response?.data?.message || 'Failed to load contact settings';
      console.error('Contact settings error:', err);
      // Return defaults on error
      return getDefaultContactSettings();
    } finally {
      cachedLoading = false;
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

export function useContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(cachedSettings || getDefaultContactSettings());
  const [loading, setLoading] = useState(cachedLoading);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const contactData = await fetchContactSettings();
        setSettings(contactData);
      } catch (err: any) {
        console.error('Failed to load contact settings:', err);
        setSettings(getDefaultContactSettings());
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have cached data
    if (!cachedSettings) {
      loadData();
    } else {
      // Use cached data immediately
      setSettings(cachedSettings);
      setLoading(false);
    }
  }, []);

  return settings;
}

