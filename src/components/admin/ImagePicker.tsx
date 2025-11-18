'use client';

import { imageUploadService, UploadedImage } from '@/services/imageUploadService';
import { useEffect, useState } from 'react';
import { FiCheck, FiImage, FiSearch, FiUpload, FiX } from 'react-icons/fi';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
  previewClassName?: string;
}

export default function ImagePicker({
  value,
  onChange,
  onClear,
  label = 'Image URL',
  placeholder = 'Enter image URL or select from uploaded images',
  showPreview = true,
  previewClassName = '',
}: ImagePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (showPicker) {
      loadImages();
    }
  }, [showPicker]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await imageUploadService.getUploadedImages(1, 50);
      setUploadedImages(response.results);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const response = await imageUploadService.uploadImage(selectedFile);
      onChange(response.imageUrl);
      setShowPicker(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      await loadImages();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const filteredImages = uploadedImages.filter((img) =>
    (img.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectImage = (imageUrl: string) => {
    onChange(imageUrl);
    setShowPicker(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium" style={{ color: '#343A40' }}>
          {label}
        </label>
      )}

      {/* URL Input and Buttons */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="px-4 py-2 bg-[#2E936B] text-white rounded-lg hover:bg-[#257a5a] transition-colors flex items-center gap-2"
        >
          <FiImage className="w-4 h-4" />
          Browse
        </button>
        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preview */}
      {showPreview && value && (
        <div className={`relative border-2 border-gray-200 rounded-lg overflow-hidden ${previewClassName}`}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Image Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: '#343A40' }}>
                Select or Upload Image
              </h3>
              <button
                onClick={() => {
                  setShowPicker(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Section */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-picker-upload"
                />
                <label
                  htmlFor="image-picker-upload"
                  className="px-4 py-2 bg-[#2E936B] text-white rounded-lg cursor-pointer hover:bg-[#257a5a] transition-colors flex items-center gap-2"
                >
                  <FiUpload className="w-4 h-4" />
                  Upload New Image
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{selectedFile.name}</span>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                )}
              </div>
              {previewUrl && (
                <div className="mt-2">
                  <img src={previewUrl} alt="Preview" className="max-h-32 object-contain rounded" />
                </div>
              )}
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search images..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B]"
                />
              </div>
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading images...</div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No images found. Upload an image to get started.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        value === image.image_url
                          ? 'border-[#2E936B] ring-2 ring-[#2E936B]'
                          : 'border-gray-200 hover:border-[#2E936B]'
                      }`}
                      onClick={() => handleSelectImage(image.image_url)}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={image.image_url}
                          alt={image.title || 'Image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {value === image.image_url && (
                        <div className="absolute top-2 right-2 bg-[#2E936B] text-white rounded-full p-1">
                          <FiCheck className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

