 'use client';

import SectionHeader from '@/components/common/SectionHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pageHeroImagesService } from '@/services/pageHeroImagesService';

const DEFAULT_HERO_BG = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop';

export default function AboutPage() {
  const [heroBg, setHeroBg] = useState<string>(DEFAULT_HERO_BG);
  const [ourStoryImage, setOurStoryImage] = useState<string>('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop');
  
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const images = await pageHeroImagesService.getPageHeroImages();
        if (images.about_hero_image_url) {
          setHeroBg(images.about_hero_image_url);
        }
        if (images.about_our_story_image_url) {
          setOurStoryImage(images.about_our_story_image_url);
        }
      } catch (error) {
        console.error('Failed to load about hero image:', error);
        // Keep default image on error
      }
    };
    fetchHeroImage();
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBg || DEFAULT_HERO_BG}
            alt="About HSR Green Homes"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-3 sm:mb-4 md:mb-6 text-white leading-tight">
            About <span className="text-[#2E936B]">HSR Green Homes</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white max-w-2xl mx-auto font-sans leading-relaxed px-2">
            Building dreams, creating communities, and delivering excellence in
            real estate development for over 15 years.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Founded in 2009, HSR Green Homes has been at the forefront of
                  premium residential development in Karimnagar and surrounding
                  areas. We began with a simple yet powerful vision: to create
                  homes that blend modern luxury with traditional values.
                </p>
                <p>
                  Over the years, we have successfully delivered 50+ residential
                  projects, housing more than 2000 happy families. Our commitment
                  to quality, transparency, and customer satisfaction has made us
                  one of the most trusted real estate developers in Telangana.
                </p>
                <p>
                  Today, HSR Green Homes stands as a symbol of excellence in real
                  estate development, known for our innovative designs, sustainable
                  practices, and unwavering commitment to delivering homes that
                  exceed expectations.
                </p>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src={ourStoryImage}
                alt="HSR Green Homes Building"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Vision Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#2E936B]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
                Our Vision
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                To be the leading real estate developer in Telangana, creating
                sustainable communities that enhance the quality of life for
                residents while preserving our cultural heritage and environmental
                responsibility.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#2E936B]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                To deliver exceptional residential projects that combine innovative
                design, superior quality, and sustainable practices, while
                maintaining transparency and building lasting relationships with
                our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Core Values"
            subtitle="The principles that guide everything we do and shape our commitment to excellence"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Quality Excellence */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#2E936B]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">
                Quality Excellence
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We maintain the highest standards in construction quality, using
                premium materials and skilled craftsmanship in every project.
              </p>
            </div>

            {/* Customer First */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#2E936B]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">
                Customer First
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our customers are at the heart of everything we do. We build
                lasting relationships through transparency and trust.
              </p>
            </div>

            {/* Sustainable Living */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#2E936B]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.8 2.8C16 2.09 13.86 2 12 2s-4 .09-5.8.8C3.53 3.84 2 6.05 2 8.86c0 5.45 3.2 10.34 8.55 12.9.53.23 1.1.23 1.64 0C17.17 19.13 20.37 14.24 20.37 8.86c0-2.81-1.53-5.02-4.57-6.06z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">
                Sustainable Living
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We integrate eco-friendly practices and green technologies to
                create sustainable communities for future generations.
              </p>
            </div>

            {/* Timely Delivery */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#2E936B]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">
                Timely Delivery
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We respect our commitments and ensure timely project completion
                without compromising on quality standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Journey"
            subtitle="Milestones that mark our growth and commitment to excellence"
          />
          <div className="relative">
            {/* Timeline Line - Desktop */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#2E936B] hidden md:block"></div>

            {/* Mobile Timeline Line */}
            <div className="absolute left-4 w-0.5 h-full bg-[#2E936B] md:hidden"></div>

            {/* Milestones */}
            <div className="space-y-8 md:space-y-12">
              {/* Milestone 1 - 2009 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center pl-12 md:pl-0">
                <div className="md:w-1/2 md:pr-8 md:text-right">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-[#2E936B] font-bold text-lg mb-2">
                      2009
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      Foundation
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      HSR Green Homes was established with a vision to create
                      premium residential spaces in Karimnagar.
                    </p>
                  </div>
                </div>
                {/* Desktop Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full border-4 border-white shadow-md hidden md:block"></div>
                {/* Mobile Dot */}
                <div className="absolute left-4 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full border-4 border-white shadow-md md:hidden"></div>
                <div className="md:w-1/2 md:pl-8"></div>
              </div>

              {/* Milestone 2 - 2012 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center pl-12 md:pl-0">
                <div className="md:w-1/2 md:pr-8"></div>
                {/* Desktop Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full border-4 border-white shadow-md hidden md:block"></div>
                {/* Mobile Dot */}
                <div className="absolute left-4 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full border-4 border-white shadow-md md:hidden"></div>
                <div className="md:w-1/2 md:pl-8 md:text-left">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-[#2E936B] font-bold text-lg mb-2">
                      2012
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      First Milestone
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Completed our first residential project, setting new
                      standards for quality construction in the region.
                    </p>
                  </div>
                </div>
              </div>

              {/* Milestone 3 - 2016 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center pl-12 md:pl-0">
                <div className="md:w-1/2 md:pr-8 md:text-right">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-[#2E936B] font-bold text-lg mb-2">
                      2016
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      Expansion
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Expanded operations across Telangana, delivering multiple
                      successful residential developments.
                    </p>
                  </div>
                </div>
                {/* Desktop Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full border-4 border-white shadow-md hidden md:block"></div>
                {/* Mobile Dot */}
                <div className="absolute left-4 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full border-4 border-white shadow-md md:hidden"></div>
                <div className="md:w-1/2 md:pl-8"></div>
              </div>

              {/* Milestone 4 - 2020 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center pl-12 md:pl-0">
                <div className="md:w-1/2 md:pr-8"></div>
                {/* Desktop Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full border-4 border-white shadow-md hidden md:block"></div>
                {/* Mobile Dot */}
                <div className="absolute left-4 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full border-4 border-white shadow-md md:hidden"></div>
                <div className="md:w-1/2 md:pl-8 md:text-left">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-[#2E936B] font-bold text-lg mb-2">
                      2020
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      Innovation
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Introduced smart home technologies and sustainable building
                      practices in our projects.
                    </p>
                  </div>
                </div>
              </div>

              {/* Milestone 5 - 2024 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center pl-12 md:pl-0">
                <div className="md:w-1/2 md:pr-8 md:text-right">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-[#2E936B] font-bold text-lg mb-2">
                      2024
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      Excellence
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Celebrating 15 years of excellence with 50+ completed
                      projects and 2000+ happy families.
                    </p>
                  </div>
                </div>
                {/* Desktop Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full border-4 border-white shadow-md hidden md:block"></div>
                {/* Mobile Dot */}
                <div className="absolute left-4 transform -translate-x-1/2 w-4 h-4 bg-[#2E936B] rounded-full border-4 border-white shadow-md md:hidden"></div>
                <div className="md:w-1/2 md:pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#2E936B] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Build Your Future?
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made HSR Green Homes
            their trusted partner in finding their dream home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 bg-[#F28C28] hover:bg-[#d9771f] text-white rounded-lg font-semibold text-sm sm:text-base transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
              Connect with Us
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 bg-white text-[#2E936B] rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
              View Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
