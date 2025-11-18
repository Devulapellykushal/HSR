import api from '@/lib/api';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  project_id?: number | null;
  project_name?: string | null;
  project_slug?: string | null;
  message: string;
  source: 'contact_form' | 'whatsapp' | 'phone_call' | 'walk_in';
  source_display: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  status_display: string;
  contacted_at?: string | null;
  contacted_by?: number | null;
  contacted_by_name?: string | null;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadListResponse {
  results: Lead[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    page_size: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface LeadFilters {
  status?: 'new' | 'contacted' | 'qualified' | 'closed';
  source?: 'contact_form' | 'whatsapp' | 'phone_call' | 'walk_in';
  project_id?: number;
  search?: string;
  page?: number;
  page_size?: 10 | 25 | 50 | 100;
  include_deleted?: boolean;
}

export interface LeadStatistics {
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  qualified_leads: number;
  closed_leads: number;
}

export interface CreateLeadData {
  name: string;
  email: string;
  phone: string;
  project_id?: number | null;
  message: string;
  source?: 'contact_form' | 'whatsapp' | 'phone_call' | 'walk_in';
  status?: 'new' | 'contacted' | 'qualified' | 'closed';
}

export interface UpdateLeadData {
  name?: string;
  email?: string;
  phone?: string;
  project_id?: number | null;
  message?: string;
  source?: 'contact_form' | 'whatsapp' | 'phone_call' | 'walk_in';
  status?: 'new' | 'contacted' | 'qualified' | 'closed';
  notes?: string;
}

export const leadsService = {
  async getLeads(filters?: LeadFilters): Promise<LeadListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<{ success: boolean; data: LeadListResponse; message: string }>(
      `/leads/?${params.toString()}`
    );
    return response.data.data;
  },

  async getLeadById(id: number): Promise<Lead> {
    const response = await api.get<{ success: boolean; data: Lead; message: string }>(
      `/leads/${id}/`
    );
    return response.data.data;
  },

  async createLead(data: CreateLeadData): Promise<Lead> {
    const response = await api.post<{ success: boolean; data: Lead; message: string }>(
      '/leads/',
      data
    );
    return response.data.data;
  },

  async updateLead(id: number, data: UpdateLeadData): Promise<Lead> {
    const response = await api.put<{ success: boolean; data: Lead; message: string }>(
      `/leads/${id}/`,
      data
    );
    return response.data.data;
  },

  async patchLead(id: number, data: Partial<UpdateLeadData>): Promise<Lead> {
    const response = await api.patch<{ success: boolean; data: Lead; message: string }>(
      `/leads/${id}/`,
      data
    );
    return response.data.data;
  },

  async deleteLead(id: number): Promise<void> {
    await api.delete(`/leads/${id}/`);
  },

  async updateLeadStatus(id: number, status: 'new' | 'contacted' | 'qualified' | 'closed'): Promise<Lead> {
    const response = await api.post<{ success: boolean; data: Lead; message: string }>(
      `/leads/${id}/status/`,
      { status }
    );
    return response.data.data;
  },

  async updateLeadNotes(id: number, notes: string): Promise<Lead> {
    const response = await api.post<{ success: boolean; data: Lead; message: string }>(
      `/leads/${id}/notes/`,
      { notes }
    );
    return response.data.data;
  },

  async restoreLead(id: number): Promise<Lead> {
    const response = await api.post<{ success: boolean; data: Lead; message: string }>(
      `/leads/${id}/restore/`
    );
    return response.data.data;
  },

  async bulkAction(leadIds: number[], action: 'delete' | 'restore' | 'change_status', status?: 'new' | 'contacted' | 'qualified' | 'closed'): Promise<{ count: number }> {
    const payload: any = { lead_ids: leadIds, action };
    if (action === 'change_status' && status) {
      payload.status = status;
    }
    const response = await api.post<{ success: boolean; data: { count: number }; message: string }>(
      '/leads/bulk-actions/',
      payload
    );
    return response.data.data;
  },

  async exportLeads(filters?: { status?: string; source?: string }): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/leads/export/?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async getStatistics(): Promise<LeadStatistics> {
    const response = await api.get<{ success: boolean; data: LeadStatistics; message: string }>(
      '/leads/statistics/'
    );
    return response.data.data;
  },
};

