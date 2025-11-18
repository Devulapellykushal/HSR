import api from '@/lib/api';

export interface DashboardStatistics {
  total_projects: number;
  upcoming_projects: number;
  ongoing_projects: number;
  completed_projects: number;
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  qualified_leads: number;
  closed_leads: number;
}

export interface RecentLead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  project_name?: string; // Backend returns project_name as string
  project?: {
    id: number;
    title: string;
  };
  message?: string;
  status: string;
  created_at: string;
  time_ago?: string; // Human-readable time ago
}

export interface SystemStatus {
  website_status: boolean;
  website_status_display: string;
  whatsapp_integration_active: boolean;
  whatsapp_status_display: string;
  contact_forms_working: boolean;
  contact_forms_display: string;
  last_backup_at?: string;
  last_backup_display?: string;
  maintenance_mode?: boolean;
  session_timeout?: number;
}

export interface ProjectBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface LeadBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface DashboardOverview {
  statistics: DashboardStatistics;
  recent_leads: RecentLead[];
  system_status: SystemStatus;
  project_breakdown: ProjectBreakdown[];
  lead_breakdown: LeadBreakdown[];
}

export interface Analytics {
  project_breakdown: ProjectBreakdown[];
  lead_breakdown: LeadBreakdown[];
  recent_activity: {
    leads_last_7_days: number;
  };
  lead_sources: Array<{ source: string; count: number }>;
  total_projects: number;
  total_leads: number;
}

export const dashboardService = {
  async getDashboardOverview(): Promise<DashboardOverview> {
    const response = await api.get<{ success: boolean; data: DashboardOverview; message: string }>(
      '/dashboard/'
    );
    return response.data.data;
  },

  async getStatistics(): Promise<DashboardStatistics> {
    const response = await api.get<{ success: boolean; data: DashboardStatistics; message: string }>(
      '/dashboard/stats/'
    );
    return response.data.data;
  },

  async getRecentLeads(limit?: number): Promise<RecentLead[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get<{ success: boolean; data: RecentLead[]; message: string }>(
      `/dashboard/recent-leads${params}`
    );
    return response.data.data;
  },

  async getSystemStatus(): Promise<SystemStatus> {
    const response = await api.get<{ success: boolean; data: SystemStatus; message: string }>(
      '/dashboard/system-status/'
    );
    return response.data.data;
  },

  async updateSystemStatus(data: Partial<SystemStatus>): Promise<SystemStatus> {
    const response = await api.put<{ success: boolean; data: SystemStatus; message: string }>(
      '/dashboard/system-status/',
      data
    );
    return response.data.data;
  },

  async getAnalytics(): Promise<Analytics> {
    const response = await api.get<{ success: boolean; data: Analytics; message: string }>(
      '/dashboard/analytics/'
    );
    return response.data.data;
  },
};

