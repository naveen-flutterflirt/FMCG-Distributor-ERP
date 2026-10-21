import { apiClient, ApiResponse } from './client';

export interface Outlet {
  id: string;
  name: string;
  ownerName: string;
  category: 'General Trade' | 'Modern Trade' | 'Wholesale' | 'HoReCa' | 'Chemist';
  outletClass: 'A' | 'B' | 'C' | 'Modern Trade';
  route: string;
  beatId: string;
  address: string;
  phone: string;
  gstin?: string;
  creditLimit: number;
  currentOutstanding: number;
  overdueDays: number;
  loyaltyPoints: number;
  lastOrderDate: string;
  status: 'Active' | 'Credit Blocked' | 'Inactive';
  createdAt?: string;
}

export interface CreateOutletInput {
  name: string;
  ownerName: string;
  category?: 'General Trade' | 'Modern Trade' | 'Wholesale' | 'HoReCa' | 'Chemist';
  outletClass?: 'A' | 'B' | 'C' | 'Modern Trade';
  route: string;
  beatId?: string;
  address: string;
  phone: string;
  gstin?: string;
  creditLimit?: number;
}

export interface OutletFilterParams {
  route?: string;
  status?: string;
  search?: string;
}

export const outletApi = {
  /**
   * Fetch outlets with optional route/status/search query filters
   */
  getAll: async (params?: OutletFilterParams): Promise<ApiResponse<Outlet[]>> => {
    const query = new URLSearchParams();
    if (params?.route && params.route !== 'All') query.append('route', params.route);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString();
    const endpoint = `/outlets${qs ? `?${qs}` : ''}`;
    return apiClient.get<Outlet[]>(endpoint);
  },

  /**
   * Onboard a new outlet in Neon DB
   */
  create: async (data: CreateOutletInput): Promise<ApiResponse<Outlet>> => {
    return apiClient.post<Outlet>('/outlets', data);
  },
};
