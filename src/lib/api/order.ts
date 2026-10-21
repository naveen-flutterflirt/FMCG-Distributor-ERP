import { apiClient, ApiResponse } from './client';

export interface OrderItem {
  id?: string;
  productId?: string;
  sku: string;
  qty: string;
  units: number;
  rate: number;
  mrp: number;
  scheme: string;
  amount: number;
  isMustSell?: boolean;
}

export interface Order {
  id: string;
  outlet: string;
  outletClass?: 'A' | 'B' | 'C' | 'Modern Trade' | 'HoReCa';
  route: string;
  source: string;
  lines: number;
  value: number;
  schemeSaving: number;
  checks: 'OK' | 'Credit hold' | 'Short 3 SKUs' | 'PO match' | 'Under Review';
  deliveryDate: string;
  gstin?: string;
  balanceDue?: number;
  creditLimit?: number;
  status?: string;
  items: OrderItem[];
}

export interface CreateOrderInput {
  outletId?: string;
  outletName: string;
  route: string;
  source?: string;
  deliveryDate?: string;
  items: {
    productId?: string;
    sku: string;
    units: number;
    qty?: string;
    rate?: number;
    mrp?: number;
    scheme?: string;
    isMustSell?: boolean;
  }[];
}

export interface OrderFilterParams {
  route?: string;
  status?: string;
  checks?: string;
  search?: string;
}

export const orderApi = {
  /**
   * Fetch all orders with items from Neon DB
   */
  getAll: async (params?: OrderFilterParams): Promise<ApiResponse<Order[]>> => {
    const query = new URLSearchParams();
    if (params?.route && params.route !== 'All') query.append('route', params.route);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.checks && params.checks !== 'All') query.append('checks', params.checks);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString();
    const endpoint = `/orders${qs ? `?${qs}` : ''}`;
    return apiClient.get<Order[]>(endpoint);
  },

  /**
   * Create order with automatic credit & stock check
   */
  create: async (data: CreateOrderInput): Promise<ApiResponse<Order>> => {
    return apiClient.post<Order>('/orders', data);
  },

  /**
   * Bulk bill orders: generates invoice, deducts godown stock, and adds to outlet balance
   */
  bulkBill: async (orderIds: string[]): Promise<ApiResponse<any>> => {
    return apiClient.post('/orders/bulk-bill', { orderIds });
  },
};
