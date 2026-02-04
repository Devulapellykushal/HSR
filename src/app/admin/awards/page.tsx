'use client';

import { awardsService, Award } from '@/services/awardsService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    FiEdit2,
    FiPlus,
    FiTrash2,
    FiCheckCircle,
    FiXCircle,
    FiMove,
    FiAward
} from 'react-icons/fi';
import Image from 'next/image';

export default function AwardsManagement() {
    const router = useRouter();
    const [awards, setAwards] = useState<Award[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAwards();
    }, []);

    const fetchAwards = async () => {
        try {
            const data = await awardsService.getAwards();
            setAwards(data);
        } catch (error) {
            console.error('Failed to fetch awards:', error);
            alert('Failed to load awards. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this award?')) {
            return;
        }
        try {
            await awardsService.deleteAward(id);
            fetchAwards();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete award');
        }
    };

    const handleToggleStatus = async (award: Award) => {
        try {
            // Assuming updateAward can accept partial data or we send full FormData
            // For toggle, we need to send FormData with all fields or just updated one?
            // Since our service expects FormData, let's build it.
            // But typically for simple toggles, a specific endpoint is better.
            // Here, we'll re-submit existing data + new status.
            // Actually, relying on updateAward with FormData might be heavy if we don't have the file object.
            // If the backend accepts URLs in image_url field, we can just send that.

            const formData = new FormData();
            formData.append('title', award.title);
            if (award.description) formData.append('description', award.description);
            formData.append('display_order', award.display_order.toString());
            formData.append('is_active', (!award.is_active).toString());

            // We don't need to re-upload image if we don't change it.
            // Backend should handle not updating image if file is missing.

            await awardsService.updateAward(award.id, formData);
            fetchAwards();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to update status');
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2" style={{ color: '#343A40' }}>Awards & Recognition</h2>
                    <p className="text-base" style={{ color: '#6c757d' }}>Manage awards and certificates displayed on About Us page</p>
                </div>
                <Link
                    href="/admin/awards/new"
                    className="w-full sm:w-auto px-4 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] flex items-center justify-center gap-2"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Add New Award</span>
                </Link>
            </div>

            {/* Awards List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading awards...</p>
                    </div>
                ) : !awards || awards.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 mb-4">No awards found.</p>
                        <Link
                            href="/admin/awards/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E936B] text-white rounded-lg font-medium hover:bg-[#247556] transition-colors"
                        >
                            <FiPlus className="w-4 h-4" />
                            Add Your First Award
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm w-20">Image</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Title</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm hidden sm:table-cell">Description</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm w-24 text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {awards.map((award) => (
                                    <tr key={award.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                {(award.image || award.image_url) ? (
                                                    <img
                                                        src={award.image || award.image_url}
                                                        alt={award.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <FiAward className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{award.title}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm hidden sm:table-cell max-w-xs truncate">
                                            {award.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleStatus(award)}
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${award.is_active
                                                    ? 'text-green-600 bg-green-100 hover:bg-green-200'
                                                    : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                                title={award.is_active ? 'Active' : 'Inactive'}
                                            >
                                                {award.is_active ? (
                                                    <FiCheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <FiXCircle className="w-5 h-5" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/awards/${award.id}/edit`}
                                                    className="p-2 text-gray-600 hover:text-[#2E936B] hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(award.id)}
                                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
