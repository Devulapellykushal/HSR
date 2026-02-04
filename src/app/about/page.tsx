'use client';

import SectionHeader from '@/components/common/SectionHeader';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { pageHeroImagesService } from '@/services/pageHeroImagesService';
import { awardsService, Award } from '@/services/awardsService';

export default function AboutPage() {
  const [heroBg, setHeroBg] = useState<string>('');
  const [ourStoryImage, setOurStoryImage] = useState<string>('');
  const [awards, setAwards] = useState<Award[]>([]);
  const [loadingAwards, setLoadingAwards] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const images = await pageHeroImagesService.getPageHeroImages();
        if (images.about_hero_image_url) {
          setHeroBg(images.about_hero_image_url);
        }
        if (images.about_our_story_image_url) {
          setOurStoryImage(images.about_our_story_image_url);
        }
      } catch (error) {
        console.error('Failed to load images:', error);
      }

      try {
        const awardsData = await awardsService.getAwards();
        setAwards(awardsData.filter(a => a.is_active));
      } catch (error) {
        console.error('Failed to load awards:', error);
        // Fallback or empty state is handled by UI
      } finally {
        setLoadingAwards(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroBg && (
            <Image
              src={heroBg}
              alt="About HSR Green Homes"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-3 sm:mb-4 md:mb-6 text-white leading-tight">
            About <span className="text-[#2E936B]">HSR Green Homes</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white max-w-2xl mx-auto font-sans leading-relaxed px-2">
            Delivering Excellence Since 2008.
          </p>
        </div>
      </section>

      {/* Our Journey & Philosophy - Clean & Simple */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#E8F5EF] rounded-tl-3xl -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#E8F5EF] rounded-br-3xl -z-10"></div>

              {ourStoryImage ? (
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={ourStoryImage}
                    alt="HSR Green Homes Journey"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="h-[400px] w-full bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                  Image Not Available
                </div>
              )}
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6 text-gray-900 leading-tight">
                A Legacy of Trust <br />
                <span className="text-[#2E936B]">Since 2008</span>
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-light">
                <p>
                  HSR Green Homes started its journey in 2008, delivering our first landmark project by the end of 2009. From humble beginnings, we have grown into one of Karimnagar's most trusted real estate developers.
                </p>
                <div className="border-l-4 border-[#2E936B] pl-6 py-2 my-8 italic text-gray-800 bg-gray-50 rounded-r-lg">
                  "Highest Quality Apartments and Villas with Robust After-Sales Service."
                </div>
                <p>
                  We believe in plain and simple principles: <strong className="text-gray-900 font-medium">Timely Delivery</strong> and <strong className="text-gray-900 font-medium">Good Execution</strong>. Every project we undertake is a testament to our commitment to neat planning and elegant elevations that stand the test of time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Section - Restored with Animation */}
      <section className="py-16 sm:py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Journey"
            subtitle="Milestones that mark our growth and commitment to excellence"
            className="mb-16"
          />
          <div className="relative">
            {/* Timeline Line - Desktop */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#2E936B]/30 hidden md:block"></div>

            {/* Mobile Timeline Line */}
            <div className="absolute left-6 w-0.5 h-full bg-[#2E936B]/30 md:hidden"></div>

            <div className="space-y-12">
              {/* 2008 - Inception */}
              <div className="relative flex flex-col md:flex-row items-center group">
                <div className="md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0">
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#2E936B] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <span className="text-[#2E936B] font-bold text-lg block mb-2">2008</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">The Beginning</h3>
                    <p className="text-gray-600">HSR Green Homes was established with a focused vision to redefine residential living in Karimnagar.</p>
                  </div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full ring-4 ring-white shadow-lg z-10 group-hover:scale-125 transition-transform duration-300"></div>
                <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
              </div>

              {/* 2009 - First Project */}
              <div className="relative flex flex-col md:flex-row items-center group">
                <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full ring-4 ring-white shadow-lg z-10 group-hover:scale-125 transition-transform duration-300"></div>
                <div className="md:w-1/2 md:pl-12 pl-16">
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#2E936B] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <span className="text-[#2E936B] font-bold text-lg block mb-2">2009</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">First Milestone</h3>
                    <p className="text-gray-600">Delivered our first landmark project by the end of 2009, demonstrating our promise of timely delivery.</p>
                  </div>
                </div>
              </div>

              {/* 2015 - Scaling Up */}
              <div className="relative flex flex-col md:flex-row items-center group">
                <div className="md:w-1/2 md:pr-12 md:text-right pl-16 md:pl-0">
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#2E936B] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <span className="text-[#2E936B] font-bold text-lg block mb-2">2015</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Growing Trust</h3>
                    <p className="text-gray-600">Established ourselves as a top player with multiple successful projects and a growing family of happy customers.</p>
                  </div>
                </div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full ring-4 ring-white shadow-lg z-10 group-hover:scale-125 transition-transform duration-300"></div>
                <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
              </div>

              {/* Present - Excellence */}
              <div className="relative flex flex-col md:flex-row items-center group">
                <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full ring-4 ring-white shadow-lg z-10 group-hover:scale-125 transition-transform duration-300"></div>
                <div className="md:w-1/2 md:pl-12 pl-16">
                  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#2E936B] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <span className="text-[#2E936B] font-bold text-lg block mb-2">Today</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">A Legacy of Excellence</h3>
                    <p className="text-gray-600">15+ Projects delivered. 300+ Happy families. Setting the benchmark for "Best Builders in Karimnagar".</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced Visuals */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Choose HSR Green Homes"
            subtitle="Built on the foundation of quality and trust"
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 100% Vasthu */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-[#2E936B] group">
              <div className="w-14 h-14 bg-[#E8F5EF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-[#2E936B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">100% Vasthu Compliance</h3>
              <p className="text-gray-600 leading-relaxed">
                We ensure every home is designed with 100% Vasthu compatibility, bringing peace and prosperity to your family.
              </p>
            </div>

            {/* Elegant Elevations */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-[#2E936B] group">
              <div className="w-14 h-14 bg-[#E8F5EF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-[#2E936B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Elegant Elevations</h3>
              <p className="text-gray-600 leading-relaxed">
                Our projects feature clean, modern, and elegant elevations that make a statement while remaining practical and beautiful.
              </p>
            </div>

            {/* Timely Delivery */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-b-4 border-[#2E936B] group">
              <div className="w-14 h-14 bg-[#E8F5EF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-[#2E936B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Timely Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                We value your time. Our track record of timely delivery since 2009 stands as proof of our disciplined execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Awards & Recognition"
            subtitle="Celebrating our achievements and commitment to excellence"
            className="mb-12"
          />

          {loadingAwards ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 h-64 rounded-xl"></div>
              ))}
            </div>
          ) : awards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {awards.map((award) => (
                <div key={award.id} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {award.image_url ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={award.image_url}
                        alt={award.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
                    </div>
                  ) : (
                    <div className="h-32 bg-[#E8F5EF] flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#2E936B] opacity-50" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.699-3.181a1 1 0 011.827 1.035L17.474 8l2.027 1.682a1 1 0 01-1.282 1.565l-2.733-.769L11 15v3a1 1 0 01-2 0v-3l-4.486-4.522-2.733.769a1 1 0 01-1.282-1.565L2.526 8 1.519 3.759A1 1 0 013.346 2.724l1.7 3.181L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.518 2.508-2.509.192.053L6.91 10.33l-.091.244.181-.299zM15 15a1 1 0 00-1-1H6a1 1 0 00-1 1v3a1 1 0 001 1h8a1 1 0 001-1v-3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2E936B] transition-colors">{award.title}</h3>
                    {award.description && (
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{award.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <p className="text-gray-500 font-medium">No awards added yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
