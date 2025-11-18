'use client';

export const CONTACT_STORAGE_KEY = 'adminContactSettings';
export const CONTACT_EVENT = 'hsr-contact-updated';

export type WhatsAppSettings = {
  enabled: boolean;
  number: string;
  businessHours: string;
  autoReply: string;
};

export type PhoneSettings = {
  primaryPhone: string;
  secondaryPhone: string;
  tollFreeNumber: string;
  businessHours: string;
};

export type EmailSettings = {
  infoEmail: string;
  salesEmail: string;
  supportEmail: string;
  autoReplyEnabled: boolean;
  autoReplySubject: string;
  autoReplyMessage: string;
};

export type AddressSettings = {
  streetAddress: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  googleEmbedCode: string;
};

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
};

export type ContactSettings = {
  whatsapp: WhatsAppSettings;
  phones: PhoneSettings;
  email: EmailSettings;
  address: AddressSettings;
  social: SocialLinks;
};

const defaultContactSettings: ContactSettings = {
  whatsapp: {
    enabled: true,
    number: '+919876543210',
    businessHours: '9:00 AM - 8:00 PM',
    autoReply: 'Hello! Thank you for contacting HSR Green Homes. We will get back to you shortly.',
  },
  phones: {
    primaryPhone: '+919876543210',
    secondaryPhone: '+919876543211',
    tollFreeNumber: '1800-123-4567',
    businessHours: '9:00 AM - 6:00 PM',
  },
  email: {
    infoEmail: 'info@hsrgreenhomes.com',
    salesEmail: 'sales@hsrgreenhomes.com',
    supportEmail: 'support@hsrgreenhomes.com',
    autoReplyEnabled: true,
    autoReplySubject: 'Thank you for contacting HSR Green Homes',
    autoReplyMessage: 'We have received your inquiry and will respond within 24 hours.',
  },
  address: {
    streetAddress: 'HSR Green Homes Building',
    area: 'Karimnagar',
    city: 'Karimnagar',
    state: 'Telangana',
    pincode: '505001',
    country: 'India',
    googleEmbedCode:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.123!2d79.123!3d18.456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTJCsDI3Ljk1LjJzLjk1LjIyKwMDcnMDcnMjU0!5e0!3m2!1sen!2sin!4v1234567890',
  },
  social: {
    facebook: 'https://facebook.com/hsrgreenhomes',
    instagram: 'https://instagram.com/hsrgreenhomes',
    twitter: 'https://twitter.com/hsrgreenhomes',
    linkedin: 'https://linkedin.com/company/hsrgreenhomes',
    youtube: 'https://youtube.com/@hsrgreenhomes',
  },
};

export const getDefaultContactSettings = () => defaultContactSettings;

const mergeSettings = (overrides?: Partial<ContactSettings>): ContactSettings => ({
  whatsapp: { ...defaultContactSettings.whatsapp, ...overrides?.whatsapp },
  phones: { ...defaultContactSettings.phones, ...overrides?.phones },
  email: { ...defaultContactSettings.email, ...overrides?.email },
  address: { ...defaultContactSettings.address, ...overrides?.address },
  social: { ...defaultContactSettings.social, ...overrides?.social },
});

export const sanitizePhoneNumber = (value: string) => value.replace(/[^\d]/g, '');

export const buildWhatsAppLink = (number?: string) => {
  const digits = sanitizePhoneNumber(number || '');
  return digits ? `https://wa.me/${digits}` : '';
};

export const getContactSettings = (): ContactSettings => {
  if (typeof window === 'undefined') {
    return defaultContactSettings;
  }
  try {
    const stored = JSON.parse(localStorage.getItem(CONTACT_STORAGE_KEY) || '{}');
    return mergeSettings(stored);
  } catch {
    return defaultContactSettings;
  }
};

export const saveContactSettings = (settings: ContactSettings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(settings));
  emitContactUpdate();
};

export const emitContactUpdate = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CONTACT_EVENT));
};

export const subscribeToContactSettings = (callback: (settings: ContactSettings) => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const handler = () => callback(getContactSettings());
  window.addEventListener(CONTACT_EVENT, handler);
  const storageHandler = (event: StorageEvent) => {
    if (event.key === CONTACT_STORAGE_KEY) {
      handler();
    }
  };
  window.addEventListener('storage', storageHandler);
  return () => {
    window.removeEventListener(CONTACT_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
};

