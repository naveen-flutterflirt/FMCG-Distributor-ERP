import { apiClient, ApiResponse } from './client';

export interface CollectionReceipt {
  id: string;
  outletId?: string;
  outletName: string;
  route: string;
  salesmanName: string;
  amountCollected: number;
  paymentMode: 'Cash' | 'UPI' | 'Cheque' | 'NEFT';
  referenceNo?: string;
  bankName?: string;
  clearingDate?: string;
  status: 'Cleared' | 'Pending Bank' | 'Bounced';
  previousOutstanding: number;
  newOutstanding: number;
  remarks?: string;
  collectedAt: string;
}

export interface CollectionSummary {
  totalMarketOutstanding: number;
  aging0to7: number;
  aging8to15: number;
  aging16to30: number;
  agingOver30: number;
  totalReceiptsCount: number;
  totalCollectedToday: number;
}

export interface RecordPaymentInput {
  outletId: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI' | 'Cheque' | 'NEFT';
  referenceNo?: string;
  bankName?: string;
  clearingDate?: string;
  salesmanName?: string;
  remarks?: string;
}

export interface CollectionFilterParams {
  route?: string;
  status?: string;
  mode?: string;
  search?: string;
}

export const collectionApi = {
  /**
   * Get collection receipts and live aging analysis from Neon DB
   */
  getAll: async (params?: CollectionFilterParams) => {
    const query = new URLSearchParams();
    if (params?.route && params.route !== 'All') query.append('route', params.route);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.mode && params.mode !== 'All') query.append('mode', params.mode);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString();
    const endpoint = `/collections${qs ? `?${qs}` : ''}`;
    return apiClient.get<{ receipts: CollectionReceipt[]; summary: CollectionSummary }>(endpoint);
  },

  /**
   * Record a new market collection payment
   */
  recordPayment: async (input: RecordPaymentInput) => {
    return apiClient.post<{
      receiptId: string;
      outletName: string;
      amountCollected: number;
      previousOutstanding: number;
      newOutstanding: number;
      outletStatus: string;
    }>('/collections/record', input);
  },
};
