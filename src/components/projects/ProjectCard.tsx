'use client';

import { useContactSettings } from '@/hooks/useContactSettings';
import { buildWhatsAppLink } from '@/lib/contactStore';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  location: string;
  status: 'ongoing' | 'completed';
  image: string;
  slug: string;
  reraId?: string;
  configurations?: string[];
  price?: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const contact = useContactSettings();
  const whatsappLink =
    contact.whatsapp.enabled && contact.whatsapp.number
      ? buildWhatsAppLink(contact.whatsapp.number)
      : '';

  const statusColors = {
    ongoing: 'bg-[#F28C28]',
    completed: 'bg-[#2E936B]',
  };

  const statusText = {
    ongoing: 'Ongoing',
    completed: 'Completed',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
      <div className="relative h-48 sm:h-56 md:h-64 w-full bg-gray-200">
        {project.image &&
          (project.image.startsWith('http://') || project.image.startsWith('https://')) &&
          project.image.length > 10 ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <span
            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold text-white ${statusColors[project.status]}`}
          >
            {statusText[project.status]}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">
          {project.title}
        </h3>
        {project.location && (
          <div className="flex items-start gap-2 mb-2 text-gray-600">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-xs sm:text-sm leading-relaxed">{project.location}</span>
          </div>
        )}
        {project.reraId && (
          <div className="flex items-start gap-2 mb-2 sm:mb-3 text-gray-600">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
            <span className="text-xs sm:text-sm">{project.reraId}</span>
          </div>
        )}
        {project.configurations && project.configurations.length > 0 && (
          <div className="mb-3">
            <span className="text-xs sm:text-sm text-gray-600 mb-2 block">
              Configurations:
            </span>
            <div className="flex flex-wrap gap-2">
              {project.configurations.map((config, idx) => (
                <span
                  key={idx}
                  className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-700"
                >
                  {config.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}
        {project.price && (
          <div className="mb-3 sm:mb-4">
            <div className="w-full bg-[#E8F5EF] rounded-lg px-3 sm:px-4 py-2 text-center">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {project.price}
              </span>
            </div>
          </div>
        )}
        <div className="flex gap-2 sm:gap-3 mt-auto">
          {project.slug ? (
            <Link
              href={`/projects/${project.slug}`}
              className="flex-1 px-3 sm:px-4 py-2 border-2 border-[#2E936B] text-[#2E936B] rounded-lg font-semibold text-center text-xs sm:text-sm hover:bg-[#2E936B] hover:text-white transition-colors"
            >
              View Details
            </Link>
          ) : (
            <div className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 text-gray-400 rounded-lg font-semibold text-center text-xs sm:text-sm cursor-not-allowed">
              View Details
            </div>
          )}
          {whatsappLink && (
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 sm:px-4 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-center text-xs sm:text-sm hover:bg-[#247556] transition-colors flex items-center justify-center gap-1 sm:gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

