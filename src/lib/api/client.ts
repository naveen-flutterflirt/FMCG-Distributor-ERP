export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('fmcg_auth_token');
  }

  private handleUnauthorized(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('fmcg_auth_token');
    localStorage.removeItem('fmcg_auth_user');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = true, headers = {}, ...restOptions } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    if (requiresAuth) {
      const token = this.getToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: requestHeaders,
      });

      // Handle 401 Unauthorized globally
      if (response.status === 401 && requiresAuth) {
        this.handleUnauthorized();
        throw new Error('Session expired or unauthorized. Please login again.');
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          data?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data as ApiResponse<T>;
    } catch (error: any) {
      // Re-throw standardized error
      throw new Error(error.message || 'Network error occurred. Please try again.');
    }
  }

  get<T = any>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = any>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
