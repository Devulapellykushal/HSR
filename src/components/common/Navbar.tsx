'use client';

import { useContactSettings } from '@/hooks/useContactSettings';
import { clearAdminAuthentication } from '@/lib/auth';
import { buildWhatsAppLink } from '@/lib/contactStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

const LOGO_CLICK_COUNT_KEY = 'hsr_logo_click_count';

// Helper functions to manage click count in localStorage
const getClickCount = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const count = localStorage.getItem(LOGO_CLICK_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
};

const setClickCount = (count: number): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOGO_CLICK_COUNT_KEY, count.toString());
  } catch {
    // Ignore localStorage errors
  }
};

const resetClickCount = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOGO_CLICK_COUNT_KEY);
  } catch {
    // Ignore localStorage errors
  }
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const contact = useContactSettings();
  const whatsappLink =
    contact.whatsapp.enabled && contact.whatsapp.number
      ? buildWhatsAppLink(contact.whatsapp.number)
      : '';

  const handleLogoClick = useMemo(() => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      
      // Get current count from localStorage
      const currentCount = getClickCount();
      const newCount = currentCount + 1;
      
      // Clear existing timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      // If clicked 5 times, force admin logout and navigate to admin login
      if (newCount >= 5) {
        resetClickCount();
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
        }
        // Force logout even if already logged in
        clearAdminAuthentication();
        router.push('/admin/login');
        return;
      }

      // Update count in localStorage
      setClickCount(newCount);

      // If single click, wait 500ms to see if more clicks come
      if (newCount === 1) {
        clickTimeoutRef.current = setTimeout(() => {
          // If still only 1 click after 500ms, navigate to home
          if (getClickCount() === 1) {
            router.push('/');
          }
          resetClickCount();
        }, 500);
      } else {
        // For multiple clicks (2-4), wait 3 seconds before resetting
        clickTimeoutRef.current = setTimeout(() => {
          resetClickCount();
        }, 3000);
      }
    };
  }, [router]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (isMenuOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav ref={navRef} className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0 cursor-pointer"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
              <Image
                src="/images/logo.png"
                alt="HSR Green Homes logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
              />
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                pathname === '/'
                  ? 'text-[#2E936B] border-b-2 border-[#2E936B] pb-1'
                  : 'text-gray-700 hover:text-[#2E936B]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/projects"
              className={`font-medium transition-colors ${
                pathname?.startsWith('/projects')
                  ? 'text-[#2E936B] border-b-2 border-[#2E936B] pb-1'
                  : 'text-gray-700 hover:text-[#2E936B]'
              }`}
            >
              Projects
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-colors ${
                pathname === '/about'
                  ? 'text-[#2E936B] border-b-2 border-[#2E936B] pb-1'
                  : 'text-gray-700 hover:text-[#2E936B]'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`font-medium transition-colors ${
                pathname === '/contact'
                  ? 'text-[#2E936B] border-b-2 border-[#2E936B] pb-1'
                  : 'text-gray-700 hover:text-[#2E936B]'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* WhatsApp Button - Desktop */}
          {whatsappLink && (
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-[#2E936B] hover:bg-[#247556] text-white rounded-lg font-semibold text-sm lg:text-base transition-colors"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="hidden lg:inline">WhatsApp Us</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className={`font-medium py-2 transition-colors ${
                  pathname === '/'
                    ? 'text-[#2E936B]'
                    : 'text-gray-700 hover:text-[#2E936B]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/projects"
                className={`font-medium py-2 transition-colors ${
                  pathname?.startsWith('/projects')
                    ? 'text-[#2E936B]'
                    : 'text-gray-700 hover:text-[#2E936B]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/about"
                className={`font-medium py-2 transition-colors ${
                  pathname === '/about'
                    ? 'text-[#2E936B]'
                    : 'text-gray-700 hover:text-[#2E936B]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`font-medium py-2 transition-colors ${
                  pathname === '/contact'
                    ? 'text-[#2E936B]'
                    : 'text-gray-700 hover:text-[#2E936B]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {whatsappLink && (
                <Link
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#2E936B] hover:bg-[#247556] text-white rounded-lg font-semibold transition-colors mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp Us
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

