'use client';

import { pageHeroImagesService, PageHeroImages } from '@/services/pageHeroImagesService';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  FiExternalLink,
  FiImage,
  FiSave,
  FiBriefcase,
  FiInfo,
  FiPhone,
} from 'react-icons/fi';
import ImagePicker from '@/components/admin/ImagePicker';

export default function PageHeroImagesEditor() {
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [imagesData, setImagesData] = useState<PageHeroImages>({
    projects_hero_image_url: '',
    about_hero_image_url: '',
    about_our_story_image_url: '',
    contact_hero_image_url: '',
  });

  useEffect(() => {
    fetchPageHeroImages();
  }, []);

  const fetchPageHeroImages = async () => {
    try {
      setLoading(true);
      const data = await pageHeroImagesService.getPageHeroImages();
      
      // Convert null values to empty strings to avoid React warnings
      setImagesData({
        projects_hero_image_url: data.projects_hero_image_url || '',
        about_hero_image_url: data.about_hero_image_url || '',
        about_our_story_image_url: data.about_our_story_image_url || '',
        contact_hero_image_url: data.contact_hero_image_url || '',
      });
    } catch (err: any) {
      console.error('Failed to load page hero images:', err);
      setSaveState('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveState('idle');
    try {
      await pageHeroImagesService.updatePageHeroImages(imagesData);
      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (error: any) {
      console.error('Failed to save page hero images', error);
      setSaveState('error');
      alert(error.response?.data?.message || 'Failed to save page hero images');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page hero images...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#343A40' }}>
            Page Hero Images
          </h2>
          <p className="text-base" style={{ color: '#6c757d' }}>
            Manage hero section background images for Projects, About, and Contact pages
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto flex-shrink-0">
          <Link
            href="/projects"
            target="_blank"
            className="w-full sm:w-auto px-4 py-2 bg-white border border-[#ced4da] rounded-lg font-semibold text-sm transition-colors hover:bg-gray-50 flex items-center justify-center gap-2 flex-shrink-0"
            style={{ color: '#343A40' }}
          >
            <span className="whitespace-nowrap">Preview Projects</span>
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
          Page hero images saved successfully.
        </div>
      )}
      {saveState === 'error' && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to save page hero images. Please try again.
        </div>
      )}

      <div className="space-y-6">
        {/* Projects Page Hero Image */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 bg-[#E8F5EF] rounded-lg flex items-center justify-center">
              <FiBriefcase className="w-5 h-5 text-[#2E936B]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#343A40' }}>
                Projects Page
              </h3>
              <p className="text-sm" style={{ color: '#6c757d' }}>
                Hero background image for the Projects listing page
              </p>
            </div>
          </div>
          <ImagePicker
            label="Background Image"
            value={imagesData.projects_hero_image_url || ''}
            onChange={(url) => setImagesData({ ...imagesData, projects_hero_image_url: url })}
            onClear={() => setImagesData({ ...imagesData, projects_hero_image_url: '' })}
            placeholder="Enter image URL or select from uploaded images"
            showPreview={true}
            previewClassName="h-48"
          />
        </div>

        {/* About Page Hero Image */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 bg-[#E8F5EF] rounded-lg flex items-center justify-center">
              <FiInfo className="w-5 h-5 text-[#2E936B]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#343A40' }}>
                About Page
              </h3>
              <p className="text-sm" style={{ color: '#6c757d' }}>
                Hero background image for the About page
              </p>
            </div>
          </div>
          <ImagePicker
            label="Background Image"
            value={imagesData.about_hero_image_url || ''}
            onChange={(url) => setImagesData({ ...imagesData, about_hero_image_url: url })}
            onClear={() => setImagesData({ ...imagesData, about_hero_image_url: '' })}
            placeholder="Enter image URL or select from uploaded images"
            showPreview={true}
            previewClassName="h-48"
          />
        </div>

        {/* About Page Our Story Image */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 bg-[#E8F5EF] rounded-lg flex items-center justify-center">
              <FiInfo className="w-5 h-5 text-[#2E936B]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#343A40' }}>
                About Page - Our Story Section
              </h3>
              <p className="text-sm" style={{ color: '#6c757d' }}>
                Image for the &quot;Our Story&quot; section on the About page
              </p>
            </div>
          </div>
          <ImagePicker
            label="Our Story Image"
            value={imagesData.about_our_story_image_url || ''}
            onChange={(url) => setImagesData({ ...imagesData, about_our_story_image_url: url })}
            onClear={() => setImagesData({ ...imagesData, about_our_story_image_url: '' })}
            placeholder="Enter image URL or select from uploaded images"
            showPreview={true}
            previewClassName="h-48"
          />
        </div>

        {/* Contact Page Hero Image */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 bg-[#E8F5EF] rounded-lg flex items-center justify-center">
              <FiPhone className="w-5 h-5 text-[#2E936B]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#343A40' }}>
                Contact Page
              </h3>
              <p className="text-sm" style={{ color: '#6c757d' }}>
                Hero background image for the Contact page
              </p>
            </div>
          </div>
          <ImagePicker
            label="Background Image"
            value={imagesData.contact_hero_image_url || ''}
            onChange={(url) => setImagesData({ ...imagesData, contact_hero_image_url: url })}
            onClear={() => setImagesData({ ...imagesData, contact_hero_image_url: '' })}
            placeholder="Enter image URL or select from uploaded images"
            showPreview={true}
            previewClassName="h-48"
          />
        </div>
      </div>
    </div>
  );
}

