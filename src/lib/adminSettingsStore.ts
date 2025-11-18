'use client';

export const ADMIN_SETTINGS_STORAGE_KEY = 'adminSettings';
export const ADMIN_SETTINGS_EVENT = 'hsr-admin-settings-updated';

export type AccountSettings = {
  fullName: string;
  email: string;
  role: string;
  lastLogin: string;
};

export type SystemSettings = {
  siteName: string;
  siteUrl: string;
  sessionTimeout: string;
  maintenanceMode: boolean;
  autoBackup: boolean;
  emailNotifications: boolean;
};

export type AdminSettings = {
  account: AccountSettings;
  system: SystemSettings;
  password: string; // simple local password storage for demo purposes
};

const defaultSettings: AdminSettings = {
  account: {
    fullName: 'HSR Admin',
    email: 'admin@hsrgreenhomes.com',
    role: 'Super Admin',
    lastLogin: new Date().toLocaleString(),
  },
  system: {
    siteName: 'HSR Green Homes',
    siteUrl: 'https://hsrgreenhomes.com',
    sessionTimeout: '60',
    maintenanceMode: false,
    autoBackup: true,
    emailNotifications: true,
  },
  password: 'admin', // default local password
};

export const getDefaultAdminSettings = () => defaultSettings;

export const getAdminSettings = (): AdminSettings => {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return {
      account: { ...defaultSettings.account, ...(parsed.account || {}) },
      system: { ...defaultSettings.system, ...(parsed.system || {}) },
      password: parsed.password || defaultSettings.password,
    };
  } catch {
    return defaultSettings;
  }
};

export const saveAdminSettings = (next: Partial<AdminSettings>) => {
  if (typeof window === 'undefined') return;
  const current = getAdminSettings();
  const merged: AdminSettings = {
    account: { ...current.account, ...(next.account || {}) },
    system: { ...current.system, ...(next.system || {}) },
    password: next.password ?? current.password,
  };
  localStorage.setItem(ADMIN_SETTINGS_STORAGE_KEY, JSON.stringify(merged));
  emitAdminSettingsUpdate();
};

export const emitAdminSettingsUpdate = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(ADMIN_SETTINGS_EVENT));
};

export const subscribeToAdminSettings = (callback: (settings: AdminSettings) => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const handler = () => callback(getAdminSettings());
  window.addEventListener(ADMIN_SETTINGS_EVENT, handler);
  const storageHandler = (event: StorageEvent) => {
    if (event.key === ADMIN_SETTINGS_STORAGE_KEY) {
      handler();
    }
  };
  window.addEventListener('storage', storageHandler);
  return () => {
    window.removeEventListener(ADMIN_SETTINGS_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
};


