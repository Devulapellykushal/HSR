'use client';

import { useHomepage } from '@/hooks/useHomepage';

interface StatDefinition {
  id: 'experience' | 'projects' | 'families' | 'sqft';
  icon: React.ReactNode;
}

const statDefinitions: StatDefinition[] = [
  {
    id: 'experience',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
      </svg>
    ),
  },
  {
    id: 'projects',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    id: 'families',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    id: 'sqft',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

export default function Stats() {
  const { data, loading } = useHomepage();

  // Don't show stats section if data is not loaded yet
  if (loading || !data?.statistics) {
    return null;
  }

  const statsContent = data.statistics;

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {statDefinitions.map((definition) => {
            let value = '';
            let label = '';
            
            switch (definition.id) {
              case 'experience':
                value = statsContent.stats_experience_value;
                label = statsContent.stats_experience_label;
                break;
              case 'projects':
                value = statsContent.stats_projects_value;
                label = statsContent.stats_projects_label;
                break;
              case 'families':
                value = statsContent.stats_families_value;
                label = statsContent.stats_families_label;
                break;
              case 'sqft':
                value = statsContent.stats_sqft_value;
                label = statsContent.stats_sqft_label;
                break;
            }
            
            return (
            <div
                key={definition.id}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <div className="text-[#2E936B] scale-75 sm:scale-90 md:scale-100">
                      {definition.icon}
                </div>
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                      {value}
              </div>
              <div className="text-gray-600 text-xs sm:text-sm md:text-base leading-tight">
                      {label}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

