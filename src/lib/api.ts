import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getRefreshToken, getToken, markSessionLoggedOut, setTokens } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: process.env.NODE_ENV === 'production' ? 30000 : 60000, // 30s in prod, 60s in dev
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token, redirect to login
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;
        setTokens({ access, refresh: refresh || refreshToken });

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        processQueue(null, access);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - could be session expired or logged out from another device
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;
        
        // Check if this is a 401 (unauthorized) which likely means logged out from another device
        const axiosError = refreshError as AxiosError;
        if (axiosError.response?.status === 401) {
          // Mark session as logged out from another device
          markSessionLoggedOut();
          // Dispatch custom event to notify components
          if (typeof window !== 'undefined') {
            const logoutEvent = new CustomEvent('session-logged-out');
            window.dispatchEvent(logoutEvent);
          }
        }
        
        clearTokens();
        // Broadcast logout event for session expiry
        if (typeof window !== 'undefined') {
          const logoutEvent = new CustomEvent('session-expired');
          window.dispatchEvent(logoutEvent);
          // Don't redirect immediately - let the modal handle it
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 401 after refresh attempt - session expired or invalidated
    if (error.response?.status === 401 && originalRequest._retry) {
      // Token refresh failed or token was invalidated (e.g., new login from another device)
      // Mark session as logged out from another device
      markSessionLoggedOut();
      clearTokens();
      if (typeof window !== 'undefined') {
        // Dispatch session logged out event
        const logoutEvent = new CustomEvent('session-logged-out');
        window.dispatchEvent(logoutEvent);
        // Also dispatch session expired for backward compatibility
        const expiredEvent = new CustomEvent('session-expired');
        window.dispatchEvent(expiredEvent);
        // Don't redirect immediately - let the modal handle it
      }
      return Promise.reject(error);
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden:', error.response.data);
    }

    if (error.response?.status === 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;

