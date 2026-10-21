import { apiClient, ApiResponse } from './client';

export interface Salesman {
  id: string;
  name: string;
  phone: string;
  email?: string;
  beat: string;
  targetSales: number;
  dailyOutletsTarget: number;
  sales: number;
  productive: number;
  lpc: number;
  visited: string;
  mustSell: string;
  status: string;
  createdAt?: string;
}

export interface CreateSalesmanInput {
  name: string;
  phone: string;
  email?: string;
  beat: string;
  targetSales?: number;
  dailyOutletsTarget?: number;
}

export const salesmanApi = {
  /**
   * Fetch all salesmen from backend
   */
  getAll: async (): Promise<ApiResponse<Salesman[]>> => {
    return apiClient.get<Salesman[]>('/salesmen');
  },

  /**
   * Create / Onboard a new salesman
   */
  create: async (data: CreateSalesmanInput): Promise<ApiResponse<Salesman>> => {
    return apiClient.post<Salesman>('/salesmen', data);
  },
};
