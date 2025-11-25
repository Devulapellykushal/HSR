'use client';

import SessionLogoutModal from '@/components/common/SessionLogoutModal';
import { clearAdminAuthentication, isAdminAuthenticated, isSessionLoggedOut, subscribeToAdminLogoutAll, subscribeToSessionLogout } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiBriefcase,
  FiExternalLink,
  FiGrid,
  FiHome,
  FiImage,
  FiLogOut,
  FiMenu,
  FiMessageCircle,
  FiPhone,
  FiSettings,
  FiUsers,
  FiX,
} from 'react-icons/fi';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [showSessionLogoutModal, setShowSessionLogoutModal] = useState(false);
  const isLoginRoute = pathname === '/admin/login';
  const isForgotRoute = pathname === '/admin/forgot';
  const isChangePasscodeRoute = pathname === '/admin/change-passcode';
  const isPublicAdminRoute = isLoginRoute || isForgotRoute || isChangePasscodeRoute;
  // Get session timeout from backend settings, fallback to 30 minutes
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(30);
  const WARNING_SECONDS = 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(sessionTimeoutMinutes * 60);

  useEffect(() => {
    if (isPublicAdminRoute) {
      setIsAuthorized(true);
      return;
    }
    if (isAdminAuthenticated()) {
      setIsAuthorized(true);
      return;
    }
    setIsAuthorized(false);
    router.replace(`/admin/login?returnTo=${encodeURIComponent(pathname || '/admin/dashboard')}`);
  }, [isPublicAdminRoute, pathname, router]);

  useEffect(() => {
    const unsubscribe = subscribeToAdminLogoutAll(() => {
      setIsAuthorized(false);
      router.replace('/admin/login');
    });
    return unsubscribe;
  }, [router]);

  // Listen for session logout from another device
  useEffect(() => {
    if (isPublicAdminRoute) return;

    const unsubscribe = subscribeToSessionLogout(() => {
      setShowSessionLogoutModal(true);
      setIsAuthorized(false);
    });

    // Also listen for custom event
    const handleSessionLoggedOut = () => {
      if (isSessionLoggedOut()) {
        setShowSessionLogoutModal(true);
        setIsAuthorized(false);
      }
    };

    window.addEventListener('session-logged-out', handleSessionLoggedOut);

    // Check on mount if session is already logged out
    if (isSessionLoggedOut() && isAdminAuthenticated()) {
      setShowSessionLogoutModal(true);
      setIsAuthorized(false);
    }

    return () => {
      unsubscribe();
      window.removeEventListener('session-logged-out', handleSessionLoggedOut);
    };
  }, [isPublicAdminRoute, router]);

  // Session validation - check if token is still valid periodically
  useEffect(() => {
    if (!isAuthorized || isPublicAdminRoute) return;

    let sessionCheckInterval: ReturnType<typeof setInterval> | null = null;
    let healthCheckInterval: ReturnType<typeof setInterval> | null = null;
    let isChecking = false;

    const validateSession = async () => {
      if (isChecking) return;
      
      try {
        isChecking = true;
        const { authService } = await import('@/services/authService');
        // Try to get current user - if this fails, session is invalid
        await authService.getCurrentUser();
      } catch (error: any) {
        // If 401 or token invalid, check if it's a session logout from another device
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          const { clearAdminAuthentication, isSessionLoggedOut } = await import('@/lib/auth');
          
          // Check if session was marked as logged out (by API interceptor)
          if (isSessionLoggedOut()) {
            // Session was logged out from another device - modal will be shown by the event listener
            setShowSessionLogoutModal(true);
          } else {
            // Regular session expiry - just redirect to login
            clearAdminAuthentication();
            router.replace('/admin/login');
          }
          
          setIsAuthorized(false);
        }
      } finally {
        isChecking = false;
      }
    };

    const checkHealth = async () => {
      try {
        const { healthService } = await import('@/services/healthService');
        await healthService.ping();
      } catch (error) {
        console.warn('Health check failed:', error);
        // Health check failure doesn't require logout, just log it
      }
    };

    // Check session every 30 seconds (adjustable for production)
    const SESSION_CHECK_INTERVAL = process.env.NODE_ENV === 'production' ? 60000 : 30000; // 60s in prod, 30s in dev
    sessionCheckInterval = setInterval(validateSession, SESSION_CHECK_INTERVAL);
    
    // Check API health every 2 minutes
    const HEALTH_CHECK_INTERVAL = 120000; // 2 minutes
    healthCheckInterval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);
    // Initial health check
    checkHealth();

    // Also listen for session-expired custom event (from API interceptor)
    const handleSessionExpired = () => {
      const { clearAdminAuthentication } = require('@/lib/auth');
      clearAdminAuthentication();
      setIsAuthorized(false);
      router.replace('/admin/login');
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      if (sessionCheckInterval) clearInterval(sessionCheckInterval);
      if (healthCheckInterval) clearInterval(healthCheckInterval);
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [isAuthorized, isPublicAdminRoute, router]);

  // Fetch session timeout from backend settings
  useEffect(() => {
    if (isPublicAdminRoute) return;
    
    const fetchSessionTimeout = async () => {
      try {
        const { settingsService } = await import('@/services/settingsService');
        const systemSettings = await settingsService.getSystemSettings().catch(() => null);
        if (systemSettings?.session_timeout) {
          setSessionTimeoutMinutes(systemSettings.session_timeout);
          setSecondsLeft(systemSettings.session_timeout * 60);
        }
      } catch (error) {
        console.warn('Failed to fetch session timeout, using default 30 minutes:', error);
        // Keep default 30 minutes
      }
    };
    
    fetchSessionTimeout();
    
    // Listen for system settings updates (when session_timeout is changed in settings page)
    const handleSettingsUpdate = (event: CustomEvent) => {
      if (event.detail?.session_timeout) {
        setSessionTimeoutMinutes(event.detail.session_timeout);
        setSecondsLeft(event.detail.session_timeout * 60);
      }
    };
    
    window.addEventListener('system-settings-updated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('system-settings-updated', handleSettingsUpdate as EventListener);
    };
  }, [isPublicAdminRoute]);

  // Idle session timeout with warning
  useEffect(() => {
    if (!isAuthorized || isPublicAdminRoute) return;
    let interval: ReturnType<typeof setInterval> | null = null;
    let lastAction = Date.now();
    const reset = () => {
      lastAction = Date.now();
      setSecondsLeft(sessionTimeoutMinutes * 60);
    };
    const activity = () => reset();
    window.addEventListener('mousemove', activity);
    window.addEventListener('keydown', activity);
    window.addEventListener('click', activity);
    interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastAction) / 1000);
      const left = sessionTimeoutMinutes * 60 - elapsed;
      setSecondsLeft(left);
      if (left <= 0) {
        clearAdminAuthentication();
        setIsAuthorized(false);
        router.replace('/admin/login');
      }
    }, 1000);
    return () => {
      window.removeEventListener('mousemove', activity);
      window.removeEventListener('keydown', activity);
      window.removeEventListener('click', activity);
      if (interval) clearInterval(interval);
    };
  }, [isAuthorized, isPublicAdminRoute, sessionTimeoutMinutes, router]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid, path: '/admin/dashboard' },
    { id: 'home', label: 'Home Page Content', icon: FiHome, path: '/admin/home' },
    { id: 'page-hero-images', label: 'Page Hero Images', icon: FiImage, path: '/admin/page-hero-images' },
    { id: 'projects', label: 'Projects', icon: FiBriefcase, path: '/admin/projects' },
    { id: 'testimonials', label: 'Testimonials', icon: FiMessageCircle, path: '/admin/testimonials' },
    { id: 'leads', label: 'Leads', icon: FiUsers, path: '/admin/leads' },
    { id: 'images', label: 'Image Upload', icon: FiImage, path: '/admin/images' },
    { id: 'contact', label: 'Contact Info', icon: FiPhone, path: '/admin/contact' },
    { id: 'settings', label: 'Settings', icon: FiSettings, path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    try {
      const { authService } = await import('@/services/authService');
      const { getRefreshToken } = await import('@/lib/auth');
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
    clearAdminAuthentication();
    setIsAuthorized(false);
      router.push('/admin/login');
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isPublicAdminRoute) {
    return <>{children}</>;
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <span className="text-gray-500 text-sm">Checking access...</span>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <SessionLogoutModal
        isOpen={showSessionLogoutModal}
        onClose={() => {
          setShowSessionLogoutModal(false);
          clearAdminAuthentication();
        }}
      />
      <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Session warning banner - responsive design */}
      {secondsLeft <= WARNING_SECONDS && secondsLeft > 0 && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 px-3 sm:px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-lg max-w-[90%] sm:max-w-md md:max-w-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs sm:text-sm font-medium">
              Your session will expire in <strong>{secondsLeft} seconds</strong> due to inactivity. Move your mouse or press any key to stay logged in.
            </p>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#F8F9FA] border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2E936B] rounded flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold" style={{ color: '#343A40' }}>Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                  active ? 'bg-[#E8F5EF]' : 'hover:bg-gray-50'
                }`}
                style={{
                  color: active ? '#2E936B' : '#343A40',
                }}
                onClick={() => setIsSidebarOpen(false)}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2E936B] rounded-l-lg"></div>
                )}
                <item.icon className="w-5 h-5" style={{ color: active ? '#2E936B' : '#343A40' }} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-[#F8F9FA]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ color: '#DC3545' }}
          >
            <FiLogOut className="w-5 h-5" style={{ color: '#DC3545' }} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-white min-h-screen md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4 w-full md:max-w-6xl md:mx-auto">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                aria-label="Toggle navigation"
              >
                {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
              <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                <Image
                  src="/images/logo.png"
                  alt="HSR Green Homes logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 48px, 56px"
                  priority
                />
              </div>
            </div>
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-white border border-[#2E936B] rounded-lg font-semibold text-sm transition-colors hover:bg-[#E8F5EF] flex items-center gap-2"
              style={{ color: '#2E936B' }}
            >
              <span>View Website</span>
              <FiExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="px-4 sm:px-6 py-6 overflow-x-hidden">
          <div className="w-full md:max-w-6xl md:mx-auto min-w-0">
            {children}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}

