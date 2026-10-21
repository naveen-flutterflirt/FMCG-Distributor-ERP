import { apiClient } from './client';

export interface PurchaseOrderItem {
  id?: string;
  sku: string;
  batchNo?: string;
  orderedCases: number;
  receivedCases: number;
  unitRate: number;
  taxableAmount: number;
}

export interface PurchaseOrder {
  id: string;
  company: string;
  orderDate: string;
  expectedDelivery: string;
  itemsCount: number;
  grossValue: number;
  taxAmount: number;
  eInvoiceIrn: string;
  eWayBill?: string;
  status: 'Goods in Transit' | 'GRN Completed' | 'GRN Completed (Shortage Claimed)' | 'Settled & Paid' | string;
  shortageAmount: number;
  grnDate?: string;
  items?: PurchaseOrderItem[];
}

export interface PurchaseSummary {
  pendingInboundValue: number;
  mtdPurchasesValue: number;
  itcMatchRate: number;
  shortageTotal: number;
}

export interface PurchaseData {
  purchaseOrders: PurchaseOrder[];
  summary: PurchaseSummary;
}

export interface CreatePOItemInput {
  sku: string;
  batchNo?: string;
  orderedCases: number;
  unitRate: number;
}

export interface CreatePOInput {
  company: string;
  expectedDelivery: string;
  items: CreatePOItemInput[];
}

export interface CompleteGRNInput {
  id: string;
  shortageCases?: number;
  shortageAmount?: number;
}

export const purchaseApi = {
  getAll: async (params?: { company?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.company && params.company !== 'All') query.append('company', params.company);
    if (params?.status && params.status !== 'All') query.append('status', params.status);

    const qs = query.toString();
    const endpoint = `/purchase${qs ? `?${qs}` : ''}`;
    return apiClient.get<PurchaseData>(endpoint);
  },

  createPO: async (data: CreatePOInput) => {
    return apiClient.post<{ id: string; company: string; grossValue: number; status: string }>('/purchase/create-po', data);
  },

  completeGRN: async (data: CompleteGRNInput) => {
    return apiClient.post<{ id: string; status: string; grnDate: string }>('/purchase/complete-grn', data);
  }
};
