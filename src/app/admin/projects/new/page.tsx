'use client';

import FileUploader from '@/components/admin/FileUploader';
import ImagePicker from '@/components/admin/ImagePicker';
import { mapAmenitiesToBackend, mapConfigurationsToBackend } from '@/lib/projectMappings';
import { projectsService } from '@/services/projectsService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddNewProject() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    reraNumber: '',
    status: 'ongoing' as 'upcoming' | 'ongoing' | 'completed',
    description: '',
    heroImage: '',
    heroImageFile: null as File | null,
    galleryImages: [] as string[],
    galleryImageFiles: [] as File[],
    floorPlans: [] as string[],
    floorPlanFiles: [] as File[],
    configurations: [] as string[],
    amenities: [] as string[],
    isFeatured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'info' },
    { id: 'media', label: 'Media', icon: 'image' },
    { id: 'details', label: 'Details', icon: 'list' },
    { id: 'settings', label: 'Settings', icon: 'gear' },
  ];

  const configurations = ['1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Duplex'];
  const defaultAmenities = [
    'Swimming Pool',
    "Children's Play Area",
    'Security',
    'Parking',
    'Jogging Track',
    'Gym',
    'Clubhouse',
    'Power Backup',
    'Garden',
    'Community Hall',
  ];
  
  // State to manage dynamic amenities list
  const [amenities, setAmenities] = useState<string[]>(defaultAmenities);
  const [newAmenity, setNewAmenity] = useState('');

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      info: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      image: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      ),
      list: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      gear: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    };
    return icons[iconName] || icons.info;
  };


  const handleSave = async () => {
    // Prevent duplicate submissions
    if (isSubmitting) {
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.location || !formData.reraNumber) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    let requestCancelled = false;

    try {
      // Create project (with hero image file if available, otherwise use URL)
      const newProject = await projectsService.createProject({
        title: formData.title,
        location: formData.location,
        rera_number: formData.reraNumber,
        status: formData.status,
        description: formData.description,
        hero_image_url: formData.heroImage || '',
        hero_image_file: formData.heroImageFile || undefined,
        configurations_list: mapConfigurationsToBackend(formData.configurations),
        amenities_list: mapAmenitiesToBackend(formData.amenities),
        is_featured: formData.isFeatured,
      });

      // Add gallery images (URLs first, then files)
      for (const imageUrl of formData.galleryImages) {
        await projectsService.addGalleryImage(newProject.id, {
          image_url: imageUrl,
          display_order: formData.galleryImages.indexOf(imageUrl),
        });
      }

      // Add gallery image files
      for (const imageFile of formData.galleryImageFiles) {
        await projectsService.addGalleryImage(newProject.id, {
          image_file: imageFile,
          display_order: formData.galleryImages.length + formData.galleryImageFiles.indexOf(imageFile),
        });
      }

      // Add floor plans (URLs first, then files)
      for (const planUrl of formData.floorPlans) {
        await projectsService.addFloorPlan(newProject.id, {
          title: `Floor Plan ${formData.floorPlans.indexOf(planUrl) + 1}`,
          file_url: planUrl,
          display_order: formData.floorPlans.indexOf(planUrl),
        });
      }

      // Add floor plan files
      for (const planFile of formData.floorPlanFiles) {
        await projectsService.addFloorPlan(newProject.id, {
          title: `Floor Plan ${formData.floorPlans.length + formData.floorPlanFiles.indexOf(planFile) + 1}`,
          file: planFile,
          display_order: formData.floorPlans.length + formData.floorPlanFiles.indexOf(planFile),
        });
      }

      // Only redirect if request wasn't cancelled
      if (!requestCancelled) {
        router.push('/admin/projects');
      }
    } catch (error: any) {
      if (requestCancelled) return;
      
      console.error('Failed to save project', error);
      
      // User-friendly error messages
      let errorMessage = 'Something went wrong while saving the project. Please try again.';
      if (error.response?.status === 401 || error.response?.status === 403) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Please check all fields and try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const fieldErrors = Object.entries(errors)
          .map(([field, messages]: [string, any]) => {
            const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            const messageList = Array.isArray(messages) ? messages : [messages];
            return `${fieldLabel}: ${messageList.join(', ')}`;
          })
          .join('\n');
        errorMessage = fieldErrors || errorMessage;
      }
      
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/projects');
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#343A40' }}>Add New Project</h2>
          <p className="text-sm sm:text-base" style={{ color: '#6c757d' }}>Create a new project for HSR Green Homes</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleCancel}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-[#ced4da] rounded-lg font-semibold text-sm transition-colors hover:bg-gray-50"
            style={{ color: '#343A40' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
            <span>{isSubmitting ? 'Saving...' : 'Save Project'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === tab.id
                ? 'bg-[#2E936B] text-white'
                : 'bg-white text-[#343A40] hover:bg-gray-50'
            }`}
            style={{
              color: activeTab === tab.id ? '#FFFFFF' : '#343A40',
            }}
          >
            <div style={{ color: activeTab === tab.id ? '#FFFFFF' : '#343A40' }}>
              {getIcon(tab.icon)}
            </div>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>Basic Information</h3>
          
          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter project title"
                className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                style={{ color: '#343A40' }}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter project location"
                className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                style={{ color: '#343A40' }}
              />
            </div>

            {/* RERA Number */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                RERA Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.reraNumber}
                onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                placeholder="Enter RERA number"
                className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                style={{ color: '#343A40' }}
              />
            </div>

            {/* Project Status */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Project Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'upcoming' | 'ongoing' | 'completed' })}
                className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-white"
                style={{ color: '#343A40' }}
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Project Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                rows={6}
                className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent resize-y"
                style={{ color: '#343A40' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>Media</h3>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Hero Image */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Hero Image
              </label>
              <div className="space-y-3">
                <FileUploader
                  label="Upload Image File"
                  fileType="image"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onFileSelect={(file: File) => {
                    setFormData({ ...formData, heroImageFile: file, heroImage: '' });
                  }}
                />
                <div className="text-sm text-gray-500 text-center">OR</div>
                <ImagePicker
                  label=""
                  value={formData.heroImage}
                  onChange={(url) => {
                    setFormData({ ...formData, heroImage: url, heroImageFile: null });
                  }}
                  onClear={() => {
                    setFormData({ ...formData, heroImage: '', heroImageFile: null });
                  }}
                  placeholder="Enter image URL or select from uploaded images"
                  showPreview={true}
                  previewClassName="h-64"
                />
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Gallery Images
              </label>
              <div className="border-2 border-dashed border-[#ced4da] rounded-lg p-4 sm:p-8">
                <div className="mb-4 space-y-3">
                  <FileUploader
                    label="Upload Image File"
                    fileType="image"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    buttonText="Upload Gallery Image"
                    onFileSelect={(file: File) => {
                      setFormData({
                        ...formData,
                        galleryImageFiles: [...formData.galleryImageFiles, file],
                      });
                    }}
                  />
                  <div className="text-sm text-gray-500 text-center">OR</div>
                  <ImagePicker
                    label=""
                    value=""
                    onChange={(imageUrl: string) => {
                      if (imageUrl) {
                        setFormData({
                          ...formData,
                          galleryImages: [...formData.galleryImages, imageUrl],
                        });
                      }
                    }}
                    placeholder="Select or enter image URL to add to gallery"
                    showPreview={false}
                  />
                </div>
                {(formData.galleryImages.length > 0 || formData.galleryImageFiles.length > 0) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                    {formData.galleryImages.map((url, index) => (
                      <div key={`url-${index}`} className="relative">
                        <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-24 sm:h-32 object-cover rounded-lg" />
                        <button
                          onClick={() => setFormData({
                            ...formData,
                            galleryImages: formData.galleryImages.filter((_, i) => i !== index),
                          })}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {formData.galleryImageFiles.map((file, index) => {
                      const previewUrl = URL.createObjectURL(file);
                      return (
                        <div key={`file-${index}`} className="relative">
                          <img src={previewUrl} alt={`Gallery File ${index + 1}`} className="w-full h-24 sm:h-32 object-cover rounded-lg" />
                          <button
                            onClick={() => {
                              URL.revokeObjectURL(previewUrl);
                              setFormData({
                                ...formData,
                                galleryImageFiles: formData.galleryImageFiles.filter((_, i) => i !== index),
                              });
                            }}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Floor Plans */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Floor Plans
              </label>
              <div className="border-2 border-dashed border-[#ced4da] rounded-lg p-4 sm:p-8">
                <div className="mb-4 space-y-3">
                  <FileUploader
                    label="Upload File"
                    fileType="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                    buttonText="Upload Floor Plan"
                    onFileSelect={(file: File) => {
                      setFormData({
                        ...formData,
                        floorPlanFiles: [...formData.floorPlanFiles, file],
                      });
                    }}
                  />
                  <div className="text-sm text-gray-500 text-center">OR</div>
                  <div>
                    <input
                      type="url"
                      placeholder="Enter file URL and press Enter"
                      className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                      style={{ color: '#343A40' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            floorPlans: [...formData.floorPlans, e.currentTarget.value],
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                {(formData.floorPlans.length > 0 || formData.floorPlanFiles.length > 0) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                    {formData.floorPlans.map((url, index) => (
                      <div key={`url-${index}`} className="relative">
                        <img src={url} alt={`Floor Plan ${index + 1}`} className="w-full h-24 sm:h-32 object-cover rounded-lg" />
                        <button
                          onClick={() => setFormData({
                            ...formData,
                            floorPlans: formData.floorPlans.filter((_, i) => i !== index),
                          })}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {formData.floorPlanFiles.map((file, index) => {
                      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
                      return (
                        <div key={`file-${index}`} className="relative">
                          {previewUrl ? (
                            <img src={previewUrl} alt={`Floor Plan File ${index + 1}`} className="w-full h-24 sm:h-32 object-cover rounded-lg" />
                          ) : (
                            <div className="w-full h-24 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <button
                            onClick={() => {
                              if (previewUrl) URL.revokeObjectURL(previewUrl);
                              setFormData({
                                ...formData,
                                floorPlanFiles: formData.floorPlanFiles.filter((_, i) => i !== index),
                              });
                            }}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold mb-6" style={{ color: '#343A40' }}>Project Details</h3>
          
          <div className="space-y-8">
            {/* Configurations */}
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#343A40' }}>Configurations</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {configurations.map((config) => (
                  <label key={config} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.configurations.includes(config)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            configurations: [...formData.configurations, config],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            configurations: formData.configurations.filter(c => c !== config),
                          });
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B]"
                    />
                    <span className="text-sm" style={{ color: '#343A40' }}>{config}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: '#343A40' }}>Amenities</h4>
              
              {/* Add New Amenity Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                  Add New Amenity
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newAmenity.trim()) {
                        e.preventDefault();
                        const trimmedAmenity = newAmenity.trim();
                        if (!amenities.includes(trimmedAmenity)) {
                          setAmenities([...amenities, trimmedAmenity]);
                          setFormData({
                            ...formData,
                            amenities: [...formData.amenities, trimmedAmenity],
                          });
                        }
                        setNewAmenity('');
                      }
                    }}
                    placeholder="Enter amenity name and press Enter"
                    className="flex-1 px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                    style={{ color: '#343A40' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newAmenity.trim()) {
                        const trimmedAmenity = newAmenity.trim();
                        if (!amenities.includes(trimmedAmenity)) {
                          setAmenities([...amenities, trimmedAmenity]);
                          setFormData({
                            ...formData,
                            amenities: [...formData.amenities, trimmedAmenity],
                          });
                        }
                        setNewAmenity('');
                      }
                    }}
                    className="px-4 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Amenities Checkbox List */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            amenities: [...formData.amenities, amenity],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            amenities: formData.amenities.filter(a => a !== amenity),
                          });
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B]"
                    />
                    <span className="text-sm" style={{ color: '#343A40' }}>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>Project Settings</h3>
          
          <div className="space-y-6">
            {/* Featured Project */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B]"
                />
                <div>
                  <span className="text-sm font-medium" style={{ color: '#343A40' }}>Featured Project</span>
                  <p className="text-xs mt-1" style={{ color: '#6c757d' }}>
                    Featured projects appear prominently on the homepage
                  </p>
                </div>
              </label>
            </div>

            {/* Project Visibility */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm" style={{ color: '#6c757d' }}>
                Once saved, this project will be visible on the website. You can edit or hide it later from the projects list.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

