'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { projectsService, Project, GalleryImage, FloorPlan } from '@/services/projectsService';
import { FiArrowLeft, FiEdit2, FiDownload, FiImage, FiFileText } from 'react-icons/fi';
import { mapConfigurationsToFrontend, mapAmenitiesToFrontend } from '@/lib/projectMappings';

export default function AdminProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const id = parseInt(projectId);
      if (!Number.isFinite(id)) {
        setError('Invalid project ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch project details - gallery images and floor plans are already included
        const projectData = await projectsService.getProjectById(id);

        setProject(projectData);
        // Use gallery_images and floor_plans from the project response
        setGalleryImages(
          projectData.gallery_images?.map((img: any) => ({
            ...img,
            image_url: img.image || img.image_url || '',
          })) || []
        );
        setFloorPlans(
          projectData.floor_plans?.map((plan: any) => ({
            ...plan,
            file_url: plan.file_path || plan.file_url || '',
          })) || []
        );
      } catch (err: any) {
        console.error('Failed to load project:', err);
        setError(err.response?.data?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 mb-4">{error || 'Project not found'}</p>
        <button
          onClick={() => router.push('/admin/projects')}
          className="text-red-600 hover:text-red-800 underline text-sm"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const heroImage = project.hero_image_url || '';
  const configurations = mapConfigurationsToFrontend(project.configurations || []);
  const amenities = mapAmenitiesToFrontend(project.amenities || []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={() => router.push('/admin/projects')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Back to projects"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold truncate" style={{ color: '#343A40' }}>
                Project Details
              </h1>
              <p className="text-sm text-gray-600 truncate">{project.title}</p>
            </div>
          </div>
          <Link
            href={`/admin/projects/${project.id}/edit`}
            className="w-full sm:w-auto px-4 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] flex items-center justify-center gap-2"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit Project
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pb-8">
        {/* Hero Section */}
        <section className="relative h-[300px] sm:h-[380px] md:h-[420px] rounded-xl overflow-hidden mb-6 shadow-lg">
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
            <div className="p-6 sm:p-8 w-full">
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Project Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: '#343A40' }}>
                Project Overview
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                {project.description?.trim()
                  ? project.description
                  : `Discover ${project.title}, a thoughtfully planned residential community in ${project.location}, designed to offer comfortable living with modern amenities.`}
              </p>
              
              {/* Gallery Images */}
              <div className="mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: '#343A40' }}>
                  <FiImage className="w-4 h-4 sm:w-5 sm:h-5" />
                  Gallery Images
                </h3>
                {galleryImages.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
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
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 sm:p-2 line-clamp-2">
                              {img.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">Total: {galleryImages.length} images</p>
                  </>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 italic">No gallery images available</p>
                )}
              </div>

              {/* Floor Plans */}
              <div className="mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: '#343A40' }}>
                  <FiFileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  Floor Plans
                </h3>
                {floorPlans.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {floorPlans.map((plan) => (
                        <div key={plan.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                          <h4 className="font-semibold mb-2 text-sm sm:text-base truncate" style={{ color: '#343A40' }}>
                            {plan.title}
                          </h4>
                          {plan.file_url && (
                            <a
                              href={plan.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-[#2E936B] hover:text-[#247556] text-xs sm:text-sm font-medium"
                            >
                              <FiDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                              View Floor Plan
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">Total: {floorPlans.length} floor plans</p>
                  </>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 italic">No floor plans available</p>
                )}
              </div>
            </div>

            {/* Configurations */}
            {configurations.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#343A40' }}>
                  Configurations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {configurations.map((config, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm font-medium"
                    >
                      {config}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#343A40' }}>
                  Key Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-[#E8F5EF] text-[#2E936B] text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-4 sm:space-y-6">
            {/* Project Snapshot */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4" style={{ color: '#343A40' }}>
                Project Snapshot
              </h3>
              <dl className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between gap-2 sm:gap-3">
                  <dt className="text-gray-600 truncate">Status</dt>
                  <dd className="flex-shrink-0">
                    <span
                      className={`inline-flex px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
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
                <div className="flex justify-between gap-2 sm:gap-3">
                  <dt className="text-gray-600 truncate">Location</dt>
                  <dd className="text-right text-gray-900 font-medium truncate ml-2">{project.location}</dd>
                </div>
                {project.rera_number && (
                  <div className="flex justify-between gap-2 sm:gap-3">
                    <dt className="text-gray-600 truncate">RERA Number</dt>
                    <dd className="text-right text-gray-900 font-medium truncate ml-2">{project.rera_number}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-2 sm:gap-3">
                  <dt className="text-gray-600 truncate">Featured</dt>
                  <dd className="flex-shrink-0">
                    <span className={`px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold ${
                      project.is_featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {project.is_featured ? 'Yes' : 'No'}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between gap-2 sm:gap-3">
                  <dt className="text-gray-600 truncate">Views</dt>
                  <dd className="text-right text-gray-900 font-medium">{project.view_count || 0}</dd>
                </div>
                {project.leads_count !== undefined && (
                  <div className="flex justify-between gap-2 sm:gap-3">
                    <dt className="text-gray-600 truncate">Leads</dt>
                    <dd className="text-right text-gray-900 font-medium">{project.leads_count}</dd>
                  </div>
                )}
                {project.testimonials_count !== undefined && (
                  <div className="flex justify-between gap-2 sm:gap-3">
                    <dt className="text-gray-600 truncate">Testimonials</dt>
                    <dd className="text-right text-gray-900 font-medium">{project.testimonials_count}</dd>
                  </div>
                )}
                {project.created_by_name && (
                  <div className="flex justify-between gap-2 sm:gap-3">
                    <dt className="text-gray-600 truncate">Created By</dt>
                    <dd className="text-right text-gray-900 font-medium truncate ml-2">{project.created_by_name}</dd>
                  </div>
                )}
                {project.updated_by_name && (
                  <div className="flex justify-between gap-2 sm:gap-3">
                    <dt className="text-gray-600 truncate">Last Updated By</dt>
                    <dd className="text-right text-gray-900 font-medium truncate ml-2">{project.updated_by_name}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-2 sm:space-y-3">
              <Link
                href={`/admin/projects/${project.id}/edit`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2E936B] text-white font-semibold text-sm hover:bg-[#247556] transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit Project
              </Link>
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800 text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                View Public Page
              </Link>
              <button
                onClick={() => router.push('/admin/projects')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800 text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Projects
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

