'use client';

import { HeroSection, homepageService, StatisticsSection } from '@/services/homepageService';
import { invalidateHomepageCache } from '@/hooks/useHomepage';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Clear any localStorage cache that might interfere
const clearHomepageLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('hsr_home_content');
      // Also clear any other potential cache keys
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('homepage') || key.includes('home_content')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Failed to clear localStorage cache:', e);
    }
  }
};
import {
  FiArrowUpRight,
  FiBarChart2,
  FiExternalLink,
  FiImage,
  FiInfo,
  FiMessageSquare,
  FiSave,
  FiStar
} from 'react-icons/fi';
import ImagePicker from '@/components/admin/ImagePicker';

export default function HomePageEditor() {
  const [activeTab, setActiveTab] = useState<'hero' | 'statistics' | 'featured' | 'testimonials'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [heroData, setHeroData] = useState<HeroSection>({
    hero_title: '',
    hero_subtitle: '',
    hero_background_image: '',
    hero_cta_button_text: '',
  });
  
  const [statisticsData, setStatisticsData] = useState<StatisticsSection>({
    stats_experience_value: '',
    stats_experience_label: '',
    stats_projects_value: '',
    stats_projects_label: '',
    stats_families_value: '',
    stats_families_label: '',
    stats_sqft_value: '',
    stats_sqft_label: '',
  });
  

  useEffect(() => {
    // Force refresh on initial load to ensure we see the current data that users see
    fetchHomePageData(true);
    // Restore last tab
    try {
      const savedTab = localStorage.getItem('homeEditorActiveTab') as
        | 'hero'
        | 'statistics'
        | 'featured'
        | 'testimonials'
        | null;
      if (savedTab) {
        setActiveTab(savedTab);
      }
    } catch {}
  }, []);

  // Persist tab
  useEffect(() => {
    try {
      localStorage.setItem('homeEditorActiveTab', activeTab);
    } catch {}
  }, [activeTab]);

  const fetchHomePageData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setSaveState('idle');
      
      // Use the same endpoint that the public homepage uses to ensure we see exactly what users see
      // Add cache-busting parameter to ensure we get fresh data
      const completeHomePage = await homepageService.getCompleteHomePage();
      
      // Extract hero section from complete homepage data
      if (completeHomePage.hero_section) {
        console.log('Hero section data received:', completeHomePage.hero_section);
        setHeroData({
          hero_title: completeHomePage.hero_section.hero_title ?? '',
          hero_subtitle: completeHomePage.hero_section.hero_subtitle ?? '',
          hero_background_image: completeHomePage.hero_section.hero_background_image ?? '',
          hero_cta_button_text: completeHomePage.hero_section.hero_cta_button_text ?? '',
        });
      } else {
        console.warn('Hero section data not received');
      }
      
      // Extract statistics section from complete homepage data
      if (completeHomePage.statistics) {
        console.log('Statistics section data received:', completeHomePage.statistics);
        setStatisticsData({
          stats_experience_value: completeHomePage.statistics.stats_experience_value ?? '',
          stats_experience_label: completeHomePage.statistics.stats_experience_label ?? '',
          stats_projects_value: completeHomePage.statistics.stats_projects_value ?? '',
          stats_projects_label: completeHomePage.statistics.stats_projects_label ?? '',
          stats_families_value: completeHomePage.statistics.stats_families_value ?? '',
          stats_families_label: completeHomePage.statistics.stats_families_label ?? '',
          stats_sqft_value: completeHomePage.statistics.stats_sqft_value ?? '',
          stats_sqft_label: completeHomePage.statistics.stats_sqft_label ?? '',
        });
      } else {
        console.warn('Statistics section data not received');
      }
      
    } catch (err: any) {
      console.error('Failed to load home page data:', err);
      setSaveState('error');
      // Show error message but don't block the UI
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load home page content. Please refresh the page.';
      console.error('Homepage data fetch error:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHeroImage = () => {
    setHeroData((prev) => ({
      ...prev,
      hero_background_image: '',
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveState('idle');
    try {
      console.log('Saving hero data:', heroData);
      console.log('Saving statistics data:', statisticsData);
      
      // Save each section separately
      const [heroResult, statsResult] = await Promise.all([
        homepageService.updateHeroSection(heroData),
        homepageService.updateStatisticsSection(statisticsData),
      ]);
      
      console.log('Hero section saved:', heroResult);
      console.log('Statistics section saved:', statsResult);
      
      setSaveState('success');
      
      // Clear any localStorage cache that might interfere
      clearHomepageLocalStorage();
      
      // Invalidate homepage cache so frontend shows updated content
      invalidateHomepageCache();
      
      // Force a page reload event to ensure all components refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('homepage-data-updated'));
      }
      
      // Refresh data from server to ensure we have the latest saved values
      // Small delay to ensure backend has processed the save, force refresh to bypass cache
      setTimeout(async () => {
        await fetchHomePageData(true);
      }, 500);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSaveState('idle'), 5000);
    } catch (error: any) {
      console.error('Failed to save home content', error);
      setSaveState('error');
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.detail || 
                          error.message ||
                          'Failed to save home page content. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: FiImage },
    { id: 'statistics', label: 'Statistics', icon: FiBarChart2 },
    { id: 'featured', label: 'Featured Projects', icon: FiStar },
    { id: 'testimonials', label: 'Testimonials', icon: FiMessageSquare },
  ] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading home page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#343A40' }}>
            Home Page Editor
          </h2>
          <p className="text-base" style={{ color: '#6c757d' }}>
            Customize your website&apos;s home page content
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="w-full sm:w-auto px-4 py-2 bg-white border border-[#ced4da] rounded-lg font-semibold text-sm transition-colors hover:bg-gray-50 flex items-center justify-center gap-2 flex-shrink-0"
            style={{ color: '#343A40' }}
          >
            <span className="whitespace-nowrap">Preview</span>
            <FiExternalLink className="w-4 h-4 flex-shrink-0" />
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto px-4 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed flex-shrink-0"
          >
            <FiSave className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {saveState === 'success' && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Home page content saved successfully.
        </div>
      )}
      {saveState === 'error' && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to save home page content. Please try again.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 lg:px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap flex-shrink-0 border-b-2 ${
                activeTab === tab.id
                  ? 'bg-white border-[#2E936B] text-[#2E936B]'
                  : 'bg-white border-transparent text-[#343A40] hover:text-[#2E936B] hover:border-gray-300'
              }`}
            >
              <tab.icon
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              />
              <span>{tab.label}</span>
            </button>
          ))}
          </div>
        </div>
      </div>

      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
            Hero Section
          </h3>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Main Title
              </label>
              <input
                type="text"
                value={heroData.hero_title || ''}
                onChange={(e) => setHeroData({ ...heroData, hero_title: e.target.value })}
                className="w-full min-w-0 px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                style={{ color: '#343A40' }}
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Subtitle
              </label>
              <input
                type="text"
                value={heroData.hero_subtitle || ''}
                onChange={(e) => setHeroData({ ...heroData, hero_subtitle: e.target.value })}
                className="w-full min-w-0 px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                style={{ color: '#343A40' }}
                disabled={isSaving}
              />
            </div>
            <div>
              <ImagePicker
                label="Background Image"
                  value={heroData.hero_background_image || ''}
                onChange={(url) => setHeroData({ ...heroData, hero_background_image: url })}
                onClear={handleClearHeroImage}
                placeholder="Enter image URL or select from uploaded images"
                showPreview={true}
                previewClassName="h-48"
                  />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                CTA Button Text
              </label>
              <input
                type="text"
                value={heroData.hero_cta_button_text || ''}
                onChange={(e) => setHeroData({ ...heroData, hero_cta_button_text: e.target.value })}
                className="w-full min-w-0 px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                style={{ color: '#343A40' }}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'statistics' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
            Statistics Section
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { valueKey: 'stats_experience_value', labelKey: 'stats_experience_label', label: 'Experience' },
              { valueKey: 'stats_projects_value', labelKey: 'stats_projects_label', label: 'Projects' },
              { valueKey: 'stats_families_value', labelKey: 'stats_families_label', label: 'Families' },
              { valueKey: 'stats_sqft_value', labelKey: 'stats_sqft_label', label: 'Sqft' },
            ].map((stat) => (
              <div key={stat.valueKey}>
                <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                  {stat.label} - Value
                </label>
                <input
                  type="text"
                  value={statisticsData[stat.valueKey as keyof StatisticsSection] || ''}
                  onChange={(e) =>
                    setStatisticsData({
                      ...statisticsData,
                      [stat.valueKey]: e.target.value,
                    })
                  }
                  className="w-full min-w-0 px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50"
                  style={{ color: '#343A40' }}
                  disabled={isSaving}
                />
                <label className="block text-sm font-medium mb-2 mt-4" style={{ color: '#343A40' }}>
                  {stat.label} - Label
                </label>
                <input
                  type="text"
                  value={statisticsData[stat.labelKey as keyof StatisticsSection] || ''}
                  onChange={(e) =>
                    setStatisticsData({
                      ...statisticsData,
                      [stat.labelKey]: e.target.value,
                    })
                  }
                  className="w-full min-w-0 px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50"
                  style={{ color: '#343A40' }}
                  disabled={isSaving}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'featured' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
            Featured Projects
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
            <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: '#343A40' }}>
                Project Selection
              </h4>
              <p className="text-sm" style={{ color: '#6c757d' }}>
                Featured projects are automatically selected from projects marked as &apos;Featured&apos;
                in the Projects Management section.
              </p>
            </div>
          </div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center px-4 py-2 bg-white border border-[#2E936B] rounded-lg font-semibold text-sm transition-colors hover:bg-[#E8F5EF] gap-2"
            style={{ color: '#2E936B' }}
          >
            <span>Manage Featured Projects</span>
            <FiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {activeTab === 'testimonials' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
            Testimonials Section
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
            <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: '#343A40' }}>
                Testimonial Display
              </h4>
              <p className="text-sm" style={{ color: '#6c757d' }}>
                The latest testimonials are automatically displayed on the home page. Manage
                testimonials in the Testimonials section.
              </p>
            </div>
          </div>
          <Link
            href="/admin/testimonials"
            className="inline-flex items-center px-4 py-2 bg-white border border-[#2E936B] rounded-lg font-semibold text-sm transition-colors hover:bg-[#E8F5EF] gap-2"
            style={{ color: '#2E936B' }}
          >
            <span>Manage Testimonials</span>
            <FiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
}
