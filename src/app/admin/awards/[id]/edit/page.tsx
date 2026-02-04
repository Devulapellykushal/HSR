'use client';

import { awardsService } from '@/services/awardsService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import FileUploader from '@/components/admin/FileUploader';
import ImagePicker from '@/components/admin/ImagePicker';

interface EditAwardPageProps {
    params: Promise<{ id: string }>;
}

export default function EditAwardPage({ params }: EditAwardPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [awardId, setAwardId] = useState<string>('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '', // URL
        imageFile: null as File | null,
        displayOrder: 0,
        isActive: true,
    });

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setAwardId(resolvedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!awardId) return;
        fetchAward();
    }, [awardId]);

    const fetchAward = async () => {
        try {
            // Since we don't have a direct getById, we fetch all and find
            const awards = await awardsService.getAwards();
            const award = awards.find((a) => a.id === parseInt(awardId));

            if (award) {
                setFormData({
                    title: award.title,
                    description: award.description || '',
                    image: award.image || award.image_url || '',
                    imageFile: null,
                    displayOrder: award.display_order,
                    isActive: award.is_active,
                });
            } else {
                alert('Award not found');
                router.push('/admin/awards');
            }
        } catch (error) {
            console.error('Failed to fetch award:', error);
            alert('Failed to load award data');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) {
            alert('Please enter a title');
            return;
        }

        try {
            setLoading(true);
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('display_order', formData.displayOrder.toString());
            data.append('is_active', formData.isActive.toString());

            if (formData.imageFile) {
                data.append('image_file', formData.imageFile);
            } else if (formData.image) {
                data.append('image_url', formData.image);
            }

            await awardsService.updateAward(parseInt(awardId), data);
            router.push('/admin/awards');
        } catch (error: any) {
            console.error('Failed to update award:', error);
            alert(error.response?.data?.message || 'Failed to update award');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading award...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/awards"
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                >
                    <FiArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-[#343A40]">Edit Award</h2>
                    <p className="text-sm text-gray-500">Update award details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-[#343A40]">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Best Developer 2024"
                        className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-[#343A40]">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter brief description about the award..."
                        rows={4}
                        className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent resize-y"
                    />
                </div>

                {/* Image */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-[#343A40]">
                        Award Image
                    </label>
                    <div className="space-y-4">
                        <FileUploader
                            label="Upload Image File"
                            fileType="image"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onFileSelect={(file: File) => {
                                setFormData({ ...formData, imageFile: file, image: '' });
                            }}
                        />
                        <div className="text-sm text-gray-500 text-center">OR</div>
                        <ImagePicker
                            label="Enter Image URL"
                            value={formData.image}
                            onChange={(url) => {
                                setFormData({ ...formData, image: url, imageFile: null });
                            }}
                            onClear={() => {
                                setFormData({ ...formData, image: '', imageFile: null });
                            }}
                            placeholder="https://example.com/image.jpg"
                            showPreview={true}
                            previewClassName="h-48 object-contain bg-gray-50"
                        />
                        {formData.imageFile && (
                            <div className="relative mt-2 w-full h-48 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={URL.createObjectURL(formData.imageFile)}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, imageFile: null })}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#343A40]">
                            Display Order
                        </label>
                        <input
                            type="number"
                            value={formData.displayOrder}
                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                    </div>

                    <div className="flex items-center pt-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B]"
                            />
                            <span className="text-sm font-medium text-[#343A40]">Active (Visible on website)</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Link
                        href="/admin/awards"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-[#2E936B] text-white rounded-lg font-medium hover:bg-[#247556] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiSave className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
