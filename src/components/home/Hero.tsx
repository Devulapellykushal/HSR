'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useHomepage } from '@/hooks/useHomepage';
import { useContactSettings } from '@/hooks/useContactSettings';
import { buildWhatsAppLink } from '@/lib/contactStore';

export default function Hero() {
  const { data, loading } = useHomepage();
  const contact = useContactSettings();
  const whatsappLink =
    contact.whatsapp.enabled && contact.whatsapp.number
      ? buildWhatsAppLink(contact.whatsapp.number)
      : '';

  // Don't show hero section if data is not loaded yet
  if (loading || !data?.hero_section) {
    return null;
  }

  const heroContent = data.hero_section;

  // Validate image URL - ensure it's a complete, valid URL
  const backgroundImage = heroContent.hero_background_image?.trim();
  const isValidImageUrl = backgroundImage &&
    (backgroundImage.startsWith('http://') || backgroundImage.startsWith('https://')) &&
    backgroundImage.length > 10; // Basic validation for complete URL

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {isValidImageUrl && (
          <Image
            src={backgroundImage}
            alt="HSR Green Homes Karimnagar"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-3 sm:mb-4 md:mb-6 text-white leading-tight">
          {heroContent.hero_title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-white max-w-2xl mx-auto mb-6 sm:mb-8 font-sans leading-relaxed px-2">
          {heroContent.hero_subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            href="/projects"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[#2E936B] hover:bg-[#247556] text-white font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center tracking-wide"
          >
            {heroContent.hero_cta_button_text}
          </Link>
        </div>
      </div>
    </section>
  );
}

