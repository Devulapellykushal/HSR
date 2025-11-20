'use client';

import { getAdminSettings } from './adminSettingsStore';

const TOKEN_KEY = 'hsr_access_token';
const REFRESH_TOKEN_KEY = 'hsr_refresh_token';
const USER_KEY = 'hsr_user';
const ADMIN_LOGOUT_ALL_KEY = 'hsr_admin_logout_all';
const SESSION_ID_KEY = 'hsr_session_id';
const SESSION_LOGGED_OUT_KEY = 'hsr_session_logged_out';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role?: string;
  is_staff: boolean;
}

// Token Management
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (tokens: AuthTokens): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  // Generate a new session ID when tokens are set (on login)
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem(SESSION_ID_KEY, sessionId);
  // Clear any previous session logged out flag
  localStorage.removeItem(SESSION_LOGGED_OUT_KEY);
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(SESSION_LOGGED_OUT_KEY);
};

// User Management
export const getUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
    } catch {
    return null;
  }
};

export const setUser = (user: AuthUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
};

// Authentication Status
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = getToken();
  const user = getUser();
  return !!(token && user && user.is_staff);
};

// Logout
export const clearAdminAuthentication = (): void => {
  clearTokens();
  clearUser();
};

export const broadcastAdminLogoutAll = (): void => {
  if (typeof window === 'undefined') return;
  clearAdminAuthentication();
  // Writing a unique value will trigger the storage event across tabs
  localStorage.setItem(ADMIN_LOGOUT_ALL_KEY, String(Date.now()));
};

export const subscribeToAdminLogoutAll = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const handler = (event: StorageEvent) => {
    if (event.key === ADMIN_LOGOUT_ALL_KEY) {
      callback();
    }
    if (event.key === TOKEN_KEY && !event.newValue) {
      callback();
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};

// Session validation - check if current token is still valid
export const validateSession = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  const token = getToken();
  if (!token) return false;
  
  try {
    // Decode JWT to check expiry (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false; // Token expired
    }
    return true;
  } catch {
    return false;
  }
};

// Session Management
export const getSessionId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_ID_KEY);
};

export const markSessionLoggedOut = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_LOGGED_OUT_KEY, 'true');
  // Broadcast to other tabs
  localStorage.setItem(SESSION_LOGGED_OUT_KEY, String(Date.now()));
};

export const isSessionLoggedOut = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SESSION_LOGGED_OUT_KEY) !== null;
};

export const subscribeToSessionLogout = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const handler = (event: StorageEvent) => {
    if (event.key === SESSION_LOGGED_OUT_KEY && event.newValue) {
      callback();
    }
  };
  window.addEventListener('storage', handler);
  // Also listen for same-tab changes using a custom event
  const customHandler = () => {
    if (isSessionLoggedOut()) {
      callback();
    }
  };
  window.addEventListener('session-logged-out', customHandler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('session-logged-out', customHandler);
  };
};

// Admin Passcode - get from admin settings
export const getAdminPasscode = (): string => {
  if (typeof window === 'undefined') return 'admin';
  try {
    const settings = getAdminSettings();
    return settings.password || 'admin';
  } catch {
    return 'admin';
  }
};

