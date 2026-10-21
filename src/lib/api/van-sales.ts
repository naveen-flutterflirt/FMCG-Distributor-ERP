import { apiClient, ApiResponse } from './client';

export interface VanSettlementItem {
  id?: string;
  sku: string;
  loaded: number;
  sold: number;
  freeScheme: number;
  goodReturn: number;
  damageIn: number;
  expectedBack: number;
  countedBack: number;
  variance: number;
  rate?: number;
}

export interface VanSettlement {
  id: string;
  vanNo: string;
  salesmanName: string;
  salesmanPhone?: string;
  route: string;
  settlementDate: string;
  loadedTime: string;
  returnedTime: string;
  totalBilledValue: number;
  cashCollected: number;
  upiCollected: number;
  chequeCollected: number;
  creditSales: number;
  expectedCash: number;
  cashVariance: number;
  cratesLoaded: number;
  cratesReturned: number;
  cratesVariance: number;
  status: 'Pending' | 'Settled' | 'Disputed';
  settledAt?: string;
  settledBy?: string;
  remarks?: string;
  items: VanSettlementItem[];
}

export const vanSalesApi = {
  /**
   * Get van settlements with items
   */
  getAll: async (params?: { status?: string; vanNo?: string }) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.vanNo) query.append('vanNo', params.vanNo);
    const qs = query.toString();
    const endpoint = `/van-sales${qs ? `?${qs}` : ''}`;
    return apiClient.get<VanSettlement[]>(endpoint);
  },

  /**
   * Close and reconcile settlement
   */
  close: async (id: string, remarks?: string, settledBy?: string) => {
    return apiClient.post<{ id: string; status: string }>('/van-sales/close', {
      id,
      remarks,
      settledBy,
    });
  },
};
