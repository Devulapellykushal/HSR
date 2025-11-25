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

// Helper function to check if a URL is a public endpoint
const isPublicEndpoint = (url: string): boolean => {
  if (!url) return false;
  
  // Normalize URL - remove base URL if present, ensure it starts with /
  let normalizedUrl = url;
  try {
    // If it's a full URL, extract the pathname
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url);
      normalizedUrl = urlObj.pathname;
    }
    // Ensure it starts with /
    if (!normalizedUrl.startsWith('/')) {
      normalizedUrl = '/' + normalizedUrl;
    }
  } catch (e) {
    // If URL parsing fails, use as-is
  }
  
  // Public endpoints that don't require authentication
  const publicPaths = [
    '/projects/', // Project list, details, gallery, and floor plans (GET)
    '/homepage/', // Homepage content (includes /homepage/testimonials/ for public display)
    '/contact/', // Contact settings
    '/ping/', // Health check
  ];
  // Note: /testimonials/ is ADMIN ONLY - not included in public paths
  
  // Explicit checks for gallery and floor-plans (most common public endpoints)
  if (normalizedUrl.includes('/gallery/') || normalizedUrl.includes('/floor-plans/')) {
    return true;
  }
  
  // Check if URL matches any public path
  // This includes:
  // - /projects/ (list)
  // - /projects/{id}/ (details)
  // - /projects/{id}/gallery/ (gallery images)
  // - /projects/{id}/floor-plans/ (floor plans)
  return publicPaths.some(path => normalizedUrl.includes(path));
};

// Helper function to check if a URL is an admin endpoint
const isAdminEndpoint = (url: string): boolean => {
  if (!url) return false;
  const adminPaths = [
    '/admin/',
    '/dashboard/',
    '/auth/',
    '/leads/',
  ];
  return adminPaths.some(path => url.includes(path));
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check the relative URL (config.url is relative to baseURL)
    const relativeUrl = config.url || '';
    // Also check if there's a full URL in the request
    const fullUrl = (config as any).fullURL || (config.baseURL ? `${config.baseURL}${relativeUrl}` : relativeUrl);
    
    // Try both relative and full URL for public endpoint detection
    const isPublicGet = (isPublicEndpoint(relativeUrl) || isPublicEndpoint(fullUrl)) && 
                        config.method?.toUpperCase() === 'GET';
    
    // Check if we have a token
    const token = getToken();
    
    // For public GET endpoints:
    // - If we have a token (admin context), send it for better security/consistency
    // - If we don't have a token (public access), don't send auth header
    if (isPublicGet) {
      if (token && config.headers) {
        // We have a token (admin context), so include it even for "public" endpoints
        // This ensures admin pages work correctly with gallery/floor-plans
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // No token exists, so remove any Authorization header for truly public access
        if (config.headers) {
          delete config.headers.Authorization;
          delete (config.headers as any).authorization;
        }
      }
    } else {
      // For non-public endpoints or non-GET requests, always add token if available
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    // Check both relative and full URL for public endpoint detection
    const relativeUrl = originalRequest?.url || '';
    const fullUrl = originalRequest?.baseURL ? `${originalRequest.baseURL}${relativeUrl}` : relativeUrl;
    // Also check the error response URL if available
    const errorUrl = error.config?.url || relativeUrl;
    const isPublic = isPublicEndpoint(relativeUrl) || isPublicEndpoint(fullUrl) || isPublicEndpoint(errorUrl);

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if we have a token - if we do, we should try to refresh it
      const token = getToken();
      
      // For public GET endpoints:
      // - If we have a token (admin context), try to refresh it
      // - If we don't have a token (public access), retry without auth
      if (isPublic && originalRequest.method?.toUpperCase() === 'GET' && !token) {
        // No token exists, so this is truly public access - retry without auth
        // Clear any invalid tokens but don't redirect
        clearTokens();
        // Remove Authorization header and retry without auth
        if (originalRequest.headers) {
          delete originalRequest.headers.Authorization;
        }
        // Mark as retry to prevent infinite loop
        originalRequest._retry = true;
        return api(originalRequest);
      }
      
      // If we have a token or it's not a public endpoint, proceed with token refresh

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
        // No refresh token
        clearTokens();
        // Only redirect to login if it's an admin endpoint
        const checkUrl = relativeUrl || fullUrl || errorUrl;
        if (typeof window !== 'undefined' && isAdminEndpoint(checkUrl)) {
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
      // Check both relative and full URL for public endpoint detection
      const relativeUrl = originalRequest?.url || '';
      const fullUrl = originalRequest?.baseURL ? `${originalRequest.baseURL}${relativeUrl}` : relativeUrl;
      const requestUrl = relativeUrl || fullUrl;
      
      // Check if we have a token
      const token = getToken();
      
      // For public GET endpoints without token, just clear tokens and retry without auth
      if (isPublicEndpoint(requestUrl) && originalRequest.method?.toUpperCase() === 'GET' && !token) {
        clearTokens();
        // Remove Authorization header and retry without auth
        if (originalRequest.headers) {
          delete originalRequest.headers.Authorization;
        }
        // Prevent infinite retry loop - use a different flag
        const publicRetryFlag = '_publicRetry';
        if (!(originalRequest as any)[publicRetryFlag]) {
          (originalRequest as any)[publicRetryFlag] = true;
          return api(originalRequest);
        }
      }
      
      // For admin endpoints or when we had a token, mark session as logged out
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
