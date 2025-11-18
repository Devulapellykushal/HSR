import api from '@/lib/api';

export interface SessionInfo {
  login_time: string | null;
  ip_address: string;
  browser: string;
  user_agent: string;
  status: string;
}

export interface SystemSettings {
  site_name: string;
  site_url: string;
  session_timeout: number;
  maintenance_mode: boolean;
  auto_backup: boolean;
  email_notifications: boolean;
}

export const settingsService = {
  async getSessionInfo(): Promise<SessionInfo> {
    const response = await api.get<{ success: boolean; data: SessionInfo; message: string }>(
      '/auth/session-info/'
    );
    return response.data.data;
  },

  async getSystemSettings(): Promise<SystemSettings> {
    const response = await api.get<{ success: boolean; data: SystemSettings; message: string }>(
      '/system-settings/'
    );
    return response.data.data;
  },

  async updateSystemSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await api.put<{ success: boolean; data: SystemSettings; message: string }>(
      '/system-settings/',
      data
    );
    return response.data.data;
  },
};

