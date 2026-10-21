import { apiClient, ApiResponse } from './client';

export interface Scheme {
  id: string;
  company: string;
  title: string;
  type: string;
  rule: string;
  fundedBy: string;
  budget: number;
  utilized: number;
  utilizationPercent: number;
  validFrom: string;
  validTo: string;
  outletFilter: string;
  discountPercent?: number;
  discountAmount?: number;
  freeSku?: string;
  status: 'Active' | 'Paused' | 'Expired';
}

export interface SchemesSummary {
  totalBudget: number;
  totalUtilized: number;
  activeCount: number;
  overallUtilizationPercent: number;
}

export interface CreateSchemeInput {
  company: string;
  title: string;
  type: string;
  rule: string;
  fundedBy?: string;
  budget: number;
  validFrom?: string;
  validTo?: string;
  outletFilter?: string;
  discountPercent?: number;
  discountAmount?: number;
  freeSku?: string;
}

export interface SchemeFilterParams {
  company?: string;
  status?: string;
  type?: string;
}

export const schemeApi = {
  /**
   * Get all trade schemes from Neon DB
   */
  getAll: async (params?: SchemeFilterParams) => {
    const query = new URLSearchParams();
    if (params?.company && params.company !== 'All') query.append('company', params.company);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.type && params.type !== 'All') query.append('type', params.type);

    const qs = query.toString();
    const endpoint = `/schemes${qs ? `?${qs}` : ''}`;
    return apiClient.get<{ schemes: Scheme[]; summary: SchemesSummary }>(endpoint);
  },

  /**
   * Configure a new trade scheme
   */
  create: async (input: CreateSchemeInput) => {
    return apiClient.post<{ id: string; title: string; status: string }>('/schemes', input);
  },
};
