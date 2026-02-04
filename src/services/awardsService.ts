import api from '@/lib/api';

export interface Award {
    id: number;
    title: string;
    description?: string;
    image_url?: string;
    image?: string; // computed field from backend
    display_order: number;
    is_active: boolean;
    created_at?: string;
}

export const awardsService = {
    async getAwards(): Promise<Award[]> {
        const response = await api.get<{ success: boolean; data: Award[]; message: string }>(
            '/about/awards/'
        );
        return response.data?.data || [];
    },

    async createAward(data: FormData): Promise<Award> {
        const response = await api.post<{ success: boolean; data: Award; message: string }>(
            '/about/awards/',
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },

    async updateAward(id: number, data: FormData): Promise<Award> {
        const response = await api.put<{ success: boolean; data: Award; message: string }>(
            `/about/awards/${id}/`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },

    async deleteAward(id: number): Promise<void> {
        await api.delete(`/about/awards/${id}/`);
    },

    async reorderAwards(order: { id: number; display_order: number }[]): Promise<void> {
        await api.post('/about/awards/reorder/', { order });
    },
};
