import api from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    full_name: string;
    role?: string;
    is_staff: boolean;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role?: string;
  is_staff: boolean;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface SessionInfo {
  user_id: number;
  email: string;
  is_authenticated: boolean;
  session_start?: string;
  last_activity?: string;
  ip_address?: string;
  user_agent?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<{ success: boolean; data: LoginResponse; message: string }>(
      '/auth/login/',
      credentials
    );
    return response.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout/', { refresh: refreshToken });
  },

  async refreshToken(refreshToken: string): Promise<{ access: string; refresh: string }> {
    const response = await api.post<{ access: string; refresh: string }>(
      '/auth/refresh/',
      { refresh: refreshToken }
    );
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User; message: string }>(
      '/auth/me/'
    );
    return response.data.data;
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/auth/change-password/', data);
  },

  async updateAccount(data: Partial<{ full_name: string; email: string }>): Promise<User> {
    const response = await api.put<{ success: boolean; data: User; message: string }>(
      '/auth/me/',
      data
    );
    return response.data.data;
  },

  async getSessionInfo(): Promise<SessionInfo> {
    const response = await api.get<{ success: boolean; data: SessionInfo; message: string }>(
      '/auth/session-info/'
    );
    return response.data.data;
  },

  async resetPassword(data: { email: string; new_password: string; confirm_password: string }): Promise<void> {
    await api.post('/auth/reset-password/', data);
  },
};

