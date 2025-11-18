'use client';

import SectionHeader from '../common/SectionHeader';
import { useHomepage } from '@/hooks/useHomepage';

export default function Testimonials() {
  const { data } = useHomepage();
  const testimonials = data?.testimonials || [];

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="Read testimonials from our satisfied customers who now call HSR Green Homes their home"
        />
        {testimonials.length === 0 ? (
          <p className="text-center text-gray-500">No testimonials yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial) => {
              const avatarSrc =
                testimonial.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  testimonial.name,
                )}&background=E8F5EF&color=2E936B`;
              return (
                <div key={testimonial.id} className="bg-white p-5 sm:p-6 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <img
                      src={avatarSrc}
                      alt={testimonial.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#E8F5EF]"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 text-sm sm:text-base">
                        {testimonial.name}
                      </div>
                      {testimonial.project && (
                        <div className="text-xs sm:text-sm text-gray-600 truncate">
                          <span className="text-[#2E936B]">{testimonial.project.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    "{testimonial.testimonial_text}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

