'use client';

import { useState, useRef, useEffect } from 'react';
import { imageUploadService, UploadedImage } from '@/services/imageUploadService';
import { FiUpload, FiX, FiImage, FiTrash2, FiCheck } from 'react-icons/fi';

export default function ImageUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load uploaded images on mount
  useEffect(() => {
    loadImages();
  }, [page]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await imageUploadService.getUploadedImages(page, 20);
      setUploadedImages(response.results);
      setTotalPages(response.pagination.total_pages);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setSuccess(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const response = await imageUploadService.uploadImage(
        selectedFile,
        title || undefined,
        description || undefined
      );

      setSuccess('Image uploaded successfully!');
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Reload images list
      await loadImages();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.image?.[0] ||
        'Failed to upload image'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await imageUploadService.deleteUploadedImage(id);
      setSuccess('Image deleted successfully!');
      await loadImages();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete image');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setSuccess('Image URL copied to clipboard!');
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#343A40' }}>
          Image Upload
        </h1>
        <p className="text-gray-600 mt-2">
          Upload and manage images for your website
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#343A40' }}>
          Upload New Image
        </h2>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
            <FiCheck className="w-4 h-4" />
            {success}
          </div>
        )}

        <div className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
              Choose Image File
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload-input"
              />
              <label
                htmlFor="image-upload-input"
                className="px-6 py-3 bg-[#2E936B] text-white rounded-lg font-medium cursor-pointer hover:bg-[#257a5a] transition-colors flex items-center gap-2"
              >
                <FiUpload className="w-5 h-5" />
                Browse Files
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Preview
              </label>
              <div className="relative inline-block border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-64 object-contain"
                />
              </div>
            </div>
          )}

          {/* Optional Title */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
              Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter image title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
            />
          </div>

          {/* Optional Description */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter image description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent resize-none"
            />
          </div>

          {/* Upload Button */}
          <div>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                !selectedFile || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2E936B] text-white hover:bg-[#257a5a]'
              }`}
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload className="w-5 h-5" />
                  Upload Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Uploaded Images List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#343A40' }}>
          Uploaded Images
        </h2>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading images...</div>
        ) : uploadedImages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No images uploaded yet. Upload your first image above!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={image.image_url || 'https://via.placeholder.com/300'}
                      alt={image.title || 'Uploaded image'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    {image.title && (
                      <h3 className="font-medium mb-1" style={{ color: '#343A40' }}>
                        {image.title}
                      </h3>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleCopyUrl(image.image_url)}
                        className="flex-1 px-3 py-2 text-sm bg-[#2E936B] text-white rounded hover:bg-[#257a5a] transition-colors"
                      >
                        Copy URL
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 break-all">
                        {image.image_url}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

