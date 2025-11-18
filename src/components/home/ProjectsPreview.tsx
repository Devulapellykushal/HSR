'use client';

import SectionHeader from '../common/SectionHeader';
import ProjectCard from '../projects/ProjectCard';
import Link from 'next/link';
import { useHomepage } from '@/hooks/useHomepage';
import { DEFAULT_PROJECT_IMAGE } from '@/lib/projectsStore';

export default function ProjectsPreview() {
  const { data } = useHomepage();
  const featuredProjects = data?.featured_projects || [];

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured Projects"
          subtitle="Discover our signature developments designed for modern living"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {featuredProjects.length > 0 ? (
            featuredProjects
              .filter((fp) => fp.is_active)
              .slice(0, 3)
              .map((featuredProject) => {
                const project = featuredProject.project;
                return (
              <ProjectCard
                    key={featuredProject.id}
                project={{
                  id: String(project.id),
                  title: project.title,
                  location: project.location,
                      status: 'ongoing' as 'ongoing' | 'completed',
                      image: project.hero_image_url || DEFAULT_PROJECT_IMAGE,
                  slug: project.slug,
                      reraId: '',
                      configurations: [],
                      price: undefined,
                }}
              />
                );
              })
          ) : (
            <p className="text-center text-gray-500 col-span-full">No featured projects yet.</p>
          )}
        </div>
        <div className="text-center">
          <Link
            href="/projects"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-[#2E936B] text-[#2E936B] rounded-lg font-semibold text-sm sm:text-base hover:bg-[#2E936B] hover:text-white transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}

