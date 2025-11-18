'use client';

import { useContactSettings } from '@/hooks/useContactSettings';
import { buildWhatsAppLink, sanitizePhoneNumber } from '@/lib/contactStore';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

export default function Footer() {
  const contact = useContactSettings();

  const whatsappLink = useMemo(() => {
    if (!contact.whatsapp.enabled) return '';
    return buildWhatsAppLink(contact.whatsapp.number);
  }, [contact.whatsapp]);

  const primaryPhoneLink = useMemo(() => {
    const digits = sanitizePhoneNumber(contact.phones.primaryPhone);
    return digits ? `tel:+${digits}` : '';
  }, [contact.phones.primaryPhone]);

  const infoEmailLink = contact.email.infoEmail ? `mailto:${contact.email.infoEmail}` : '';

  const addressLine = useMemo(() => {
    const { streetAddress, area, city, state, pincode, country } = contact.address;
    return [streetAddress, area, city, state, pincode, country].filter(Boolean).join(', ');
  }, [contact.address]);

  const socialItems = useMemo(
    () =>
      [
        {
          id: 'facebook',
          href: contact.social.facebook,
          label: 'Facebook',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          ),
        },
        {
          id: 'instagram',
          href: contact.social.instagram,
          label: 'Instagram',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          ),
        },
        {
          id: 'youtube',
          href: contact.social.youtube,
          label: 'YouTube',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          ),
        },
        {
          id: 'linkedin',
          href: contact.social.linkedin,
          label: 'LinkedIn',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          ),
        },
        {
          id: 'twitter',
          href: contact.social.twitter,
          label: 'Twitter',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.608 1.794-1.574 2.163-2.724-.949.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.723 0-4.928 2.205-4.928 4.928 0 .386.045.762.127 1.124-4.094-.205-7.725-2.166-10.163-5.144-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.213 2.188 4.096-.807-.026-1.566-.247-2.228-.616v.061c0 2.386 1.698 4.374 3.946 4.827-.414.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.6 3.417-1.68 1.319-3.797 2.105-6.102 2.105-.395 0-.779-.023-1.17-.067 2.179 1.397 4.768 2.214 7.557 2.214 9.054 0 14.01-7.496 14.01-13.986 0-.21 0-.423-.015-.633a9.936 9.936 0 002.457-2.548l-.047-.02z" />
            </svg>
          ),
        },
      ].filter((item) => Boolean(item.href)),
    [contact.social],
  );

  return (
    <footer className="bg-[#1a202c] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-6 sm:mb-8">
          {/* Company Information */}
          <div>
            <Link href="/" className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                <Image
                  src="/images/logo.png"
                  alt="HSR Green Homes logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 56px, 64px"
                />
              </div>
            </Link>
            <p className="text-gray-300 mb-2 font-medium text-sm sm:text-base">Premium Living</p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
              Leading real estate developer in Karimnagar, creating premium
              residential projects that blend modern luxury with traditional
              values. Your dream home awaits.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {socialItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-[#2E936B] transition-colors"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Contact Info</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3">
                <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E936B] mt-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-gray-400 text-xs sm:text-sm">
                  {addressLine}
                </span>
              </li>
              {contact.phones.primaryPhone && (
                <li className="flex items-center gap-2 sm:gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E936B] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  {primaryPhoneLink ? (
                    <a href={primaryPhoneLink} className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                      {contact.phones.primaryPhone}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-sm">{contact.phones.primaryPhone}</span>
                  )}
                </li>
              )}
              {contact.email.infoEmail && (
                <li className="flex items-center gap-2 sm:gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E936B] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  {infoEmailLink ? (
                    <a href={infoEmailLink} className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm break-all">
                      {contact.email.infoEmail}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-sm break-all">{contact.email.infoEmail}</span>
                  )}
                </li>
              )}
              {whatsappLink && (
                <li className="flex items-center gap-2 sm:gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E936B] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#2E936B] transition-colors text-xs sm:text-sm"
                  >
                    WhatsApp Us
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <div className="text-center md:text-left w-full md:w-auto">
              <p>© 2024 HSR Green Homes. All rights reserved.</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 text-center md:text-left w-full md:w-auto">
              <p className="text-xs sm:text-sm">
                RERA Registration: RERA/TG/2024/HSR001 | Valid till: Dec 2029
              </p>
              <div className="flex gap-3 sm:gap-4">
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

