'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiFile } from 'react-icons/fi';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  buttonText?: string;
  maxSizeMB?: number;
  fileType?: 'image' | 'file';
}

export default function FileUploader({
  onFileSelect,
  accept = 'image/*',
  label,
  buttonText = 'Upload File',
  maxSizeMB = 10,
  fileType = 'image',
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview for images
      if (fileType === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      // Reset after upload
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium" style={{ color: '#343A40' }}>
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${fileType}`}
        />
        <label
          htmlFor={`file-upload-${fileType}`}
          className="px-4 py-2 bg-[#2E936B] text-white rounded-lg cursor-pointer hover:bg-[#257a5a] transition-colors flex items-center gap-2"
        >
          {fileType === 'image' ? <FiImage className="w-4 h-4" /> : <FiFile className="w-4 h-4" />}
          {buttonText}
        </label>
        {selectedFile && (
          <>
            <span className="text-sm text-gray-600 flex-1 truncate">{selectedFile.name}</span>
            <button
              onClick={handleUpload}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Upload
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {previewUrl && (
        <div className="mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-32 object-contain rounded border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}

