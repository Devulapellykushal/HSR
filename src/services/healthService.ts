import api from '@/lib/api';

export interface ApiInfo {
  name?: string;
  version?: string;
  description?: string;
  documentation_url?: string;
  endpoints?: {
    auth?: string;
    projects?: string;
    leads?: string;
    testimonials?: string;
    homepage?: string;
    dashboard?: string;
  };
}

export interface PingResponse {
  status: string;
  message: string;
  db?: string;
  version?: string;
  uptime_seconds?: number;
  timestamp?: string;
}

export const healthService = {
  async ping(): Promise<PingResponse> {
    const response = await api.get<{ success: boolean; data: PingResponse; message: string }>(
      '/ping/'
    );
    return response.data.data;
  },

  async getApiInfo(): Promise<ApiInfo> {
    const response = await api.get<{ success: boolean; data: ApiInfo; message: string }>(
      '/'
    );
    return response.data.data;
  },
};

