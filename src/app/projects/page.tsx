'use client';

import ProjectCard from '@/components/projects/ProjectCard';
import { useContactSettings } from '@/hooks/useContactSettings';
import { useProjectsAPI } from '@/hooks/useProjectsAPI';
import { buildWhatsAppLink } from '@/lib/contactStore';
import { pageHeroImagesService } from '@/services/pageHeroImagesService';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type FilterType = 'all' | 'ongoing' | 'completed';

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [heroBg, setHeroBg] = useState<string>('');
  const { projects, loading } = useProjectsAPI();
  const contact = useContactSettings();

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const images = await pageHeroImagesService.getPageHeroImages();
        if (images.projects_hero_image_url) {
          setHeroBg(images.projects_hero_image_url);
        }
      } catch (error) {
        console.error('Failed to load projects hero image:', error);
      }
    };
    fetchHeroImage();
  }, []);

  const normalizedProjects = useMemo(
    () =>
      projects
        .filter((project) => project.status !== 'upcoming') // Exclude upcoming projects
        .map((project) => ({
          id: String(project.id),
          title: project.title,
          location: project.location,
          status: project.status === 'completed' ? 'completed' as const : 'ongoing' as const,
          image: project.hero_image_url || '',
          slug: project.slug,
          reraId: project.rera_number,
          configurations: project.configurations || [],
          price: project.price,
        })),
    [projects],
  );

  const filterCounts = {
    all: normalizedProjects.length,
    ongoing: normalizedProjects.filter((p) => p.status === 'ongoing').length,
    completed: normalizedProjects.filter((p) => p.status === 'completed').length,
  };

  const filteredProjects =
    activeFilter === 'all'
      ? normalizedProjects
      : normalizedProjects.filter((project) => project.status === activeFilter);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroBg && (
            <Image
              src={heroBg}
              alt="Our Premium Projects"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-20 text-center max-w-6xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-4 sm:mb-6 text-white leading-tight px-2">
            Our <span className="text-[#2E936B]">Premium Projects</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white max-w-2xl mx-auto font-sans leading-relaxed px-4">
            Explore our portfolio of luxury residential developments across
            Karimnagar, designed for modern living with traditional values.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 sm:py-8 md:py-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-[#2E936B] text-white'
                    : 'bg-white border-2 border-[#2E936B] text-[#2E936B] hover:bg-[#E8F5EF]'
                }`}
              >
                {filter.label} ({filterCounts[filter.key]})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#2E936B] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Interested in Any Project?
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto">
            Get in touch with our team to learn more about pricing, availability,
            and booking process.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              href={
                (() => {
                  const base = buildWhatsAppLink(contact.whatsapp.number);
                  const text = 'Hi! I would like to get price details for your projects.';
                  return base ? `${base}?text=${encodeURIComponent(text)}` : '/contact';
                })()
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 bg-[#F28C28] hover:bg-[#d9771f] text-white rounded-lg font-semibold text-sm sm:text-base transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
              Get Price Details
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 bg-white text-[#2E936B] rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
              Schedule Visit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
