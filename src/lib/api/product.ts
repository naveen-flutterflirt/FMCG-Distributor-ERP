import { apiClient, ApiResponse } from './client';

export interface Product {
  id: string;
  sku: string;
  company: string;
  category: string;
  batch: string;
  mrp: number;
  purchaseRate: number;
  sellRate: number;
  godownStock: number;
  vanStock: number;
  totalStock: number;
  coverDays: number;
  expiryDate: string;
  status: string;
  createdAt?: string;
}

export interface CreateProductInput {
  sku: string;
  company: string;
  category?: string;
  batch: string;
  mrp: number;
  purchaseRate?: number;
  sellRate?: number;
  godownStock: number;
  coverDays?: number;
  expiryDate: string;
}

export interface ProductFilterParams {
  company?: string;
  status?: string;
  search?: string;
}

export const productApi = {
  /**
   * Fetch all products & stock ledgers with optional filters
   */
  getAll: async (params?: ProductFilterParams): Promise<ApiResponse<Product[]>> => {
    const query = new URLSearchParams();
    if (params?.company && params.company !== 'All') query.append('company', params.company);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString();
    const endpoint = `/products${qs ? `?${qs}` : ''}`;
    return apiClient.get<Product[]>(endpoint);
  },

  /**
   * Add a new SKU & initial batch in Neon DB
   */
  create: async (data: CreateProductInput): Promise<ApiResponse<Product>> => {
    return apiClient.post<Product>('/products', data);
  },
};
