import { apiClient, ApiResponse } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface AuthResponseData {
  token: string;
  user: UserProfile;
}

export const authApi = {
  /**
   * Authenticate admin / user and receive JWT token
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/auth/login', credentials, {
      requiresAuth: false,
    });
  },

  /**
   * Fetch current authenticated user profile
   */
  getProfile: async (): Promise<{ success: boolean; user: UserProfile }> => {
    return apiClient.get<{ user: UserProfile }>('/auth/profile', {
      requiresAuth: true,
    }) as unknown as Promise<{ success: boolean; user: UserProfile }>;
  },
};
