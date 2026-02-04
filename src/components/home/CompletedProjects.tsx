'use client';

import { useProjectsAPI } from '@/hooks/useProjectsAPI';
import SectionHeader from '../common/SectionHeader';
import ProjectCard from '../projects/ProjectCard';

export default function CompletedProjects() {
  const { projects } = useProjectsAPI();
  const completedProjects = projects.filter(p => p.status === 'completed');

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Completed Projects"
          subtitle="Successful projects that showcase our commitment to quality and excellence"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {completedProjects.length > 0 ? (
            completedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  id: String(project.id),
                  title: project.title,
                  location: project.location,
                  status: project.status as 'completed' | 'ongoing',
                  image: project.hero_image_url || '',
                  slug: project.slug,
                  reraId: project.rera_number,
                  configurations: project.configurations || [],
                  price: project.price,
                }}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">No completed projects yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

