'use client';

import { useContactSettings } from '@/hooks/useContactSettings';
import { useProjectsAPI } from '@/hooks/useProjectsAPI';
import { buildWhatsAppLink } from '@/lib/contactStore';
import { mapAmenitiesToFrontend, mapConfigurationsToFrontend } from '@/lib/projectMappings';
import { FloorPlan, GalleryImage, Project, projectsService } from '@/services/projectsService';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const { projects } = useProjectsAPI();
  const contact = useContactSettings();
  const [project, setProject] = useState<Project | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const foundProject = projects.find((p) => p.slug === params.slug);
        if (foundProject) {
          // Fetch full project details - gallery images and floor plans are already included
          const fullProject = await projectsService.getProjectById(foundProject.id);
          
          setProject(fullProject);
          // Use gallery_images and floor_plans from the project response
          setGalleryImages(
            fullProject.gallery_images?.map((img: any) => ({
              ...img,
              image_url: img.image || img.image_url || '',
            })) || []
          );
          setFloorPlans(
            fullProject.floor_plans?.map((plan: any) => ({
              ...plan,
              file_url: plan.file_path || plan.file_url || '',
            })) || []
          );
        } else {
          setProject(null);
          setGalleryImages([]);
          setFloorPlans([]);
        }
      } catch (err: any) {
        console.error('Project fetch error:', err);
        setProject(null);
        setGalleryImages([]);
        setFloorPlans([]);
      } finally {
        setLoading(false);
      }
    };

    if (projects.length > 0) {
      fetchProject();
    }
  }, [projects, params.slug]);

  const whatsappLink = useMemo(() => {
    if (!project) return null;
    const base = buildWhatsAppLink(contact.whatsapp.number);
    if (!base) return null;
    const text = `Hi! I'm interested in your project "${project.title}" in ${project.location}. Please share the latest price details and availability.`;
    return `${base}?text=${encodeURIComponent(text)}`;
  }, [contact.whatsapp.number, project]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
          Project not found
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 text-center max-w-md">
          The project you&apos;re looking for may have been moved or is currently unavailable.
        </p>
        <Link
          href="/projects"
          className="px-5 py-2.5 rounded-lg border border-[#2E936B] text-[#2E936B] font-semibold text-sm sm:text-base hover:bg-[#E8F5EF] transition-colors"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const heroImage = project?.hero_image_url || '';
  const configurations = project ? mapConfigurationsToFrontend(project.configurations || []) : [];
  const amenities = project ? mapAmenitiesToFrontend(project.amenities || []) : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero with image */}
      <section className="relative h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage}
            alt={project.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 max-w-5xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-white/10 border border-white/40 text-white backdrop-blur mb-4">
              {project.status === 'ongoing' ? 'Ongoing' : project.status === 'completed' ? 'Completed' : 'Upcoming'}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C6.962 0 4.5 2.462 4.5 5.5c0 3.672 4.632 8.795 4.828 9.01a.75.75 0 001.144 0C10.668 14.295 15.5 9.172 15.5 5.5 15.5 2.462 13.038 0 10 0zm0 7.5A2 2 0 1110 3.5a2 2 0 010 4z" />
                </svg>
                <span>{project.location}</span>
              </div>
              {project.rera_number && project.rera_number !== 'N/A' && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 2h9l5 5v15H6zM8 4v3h7V4zm2 7h7v2h-7zm0 4h7v2h-7z" />
                  </svg>
                  <span className="text-xs sm:text-sm">
                    RERA: <span className="font-medium">{project.rera_number}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Left: description + configurations */}
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">
                  Project Overview
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                  {project.description?.trim()
                    ? project.description
                    : `Discover ${project.title}, a thoughtfully planned residential community in ${project.location}, designed to offer comfortable living with modern amenities.`}
                </p>
                
                {/* Gallery Images - from backend API */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">Gallery</h4>
                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {galleryImages.map((img) => (
                        <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                          {img.image_url ? (
                            <Image
                              src={img.image_url}
                              alt={img.caption || project.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          {img.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                              {img.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No gallery images available</p>
                  )}
                </div>

                {/* Floor Plans - from backend API */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900">Floor Plans</h4>
                  {floorPlans.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {floorPlans.map((plan) => (
                        <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-semibold mb-2 text-gray-900">{plan.title}</h5>
                          {plan.file_url && (
                            <a
                              href={plan.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-[#2E936B] hover:text-[#247556] text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                              </svg>
                              View Floor Plan
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No floor plans available</p>
                  )}
                </div>
              </div>

              {configurations.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900">
                    Configurations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {configurations.map((config, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium"
                      >
                        {config}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {amenities.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900">
                    Key Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-[#E8F5EF] text-[#2E936B] text-xs sm:text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: info card + actions */}
            <aside className="w-full md:w-80 shrink-0 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">
                  Project Snapshot
                </h3>
                <dl className="space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-600">Status</dt>
                    <dd>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          project.status === 'ongoing'
                            ? 'bg-orange-100 text-orange-700'
                            : project.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {project.status}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-600">Location</dt>
                    <dd className="text-right text-gray-900">{project.location}</dd>
                  </div>
                  {project.rera_number && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-600">RERA Number</dt>
                      <dd className="text-right text-gray-900">{project.rera_number}</dd>
                    </div>
                  )}
                  {project.price && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-gray-600">Price</dt>
                      <dd className="text-right font-semibold text-gray-900">
                        {project.price}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 space-y-3">
                <p className="text-xs sm:text-sm text-gray-600">
                  Have questions about pricing, availability, or site visits for this project?
                </p>
                <div className="flex flex-col gap-2">
                  {whatsappLink && (
                    <Link
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1EB858] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      WhatsApp About This Project
                    </Link>
                  )}
                  <Link
                    href="/projects"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800 text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Back to All Projects
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}


