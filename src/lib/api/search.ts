import { apiClient } from './client';

export interface GlobalSearchResult {
  outlets: Array<{
    id: string;
    name: string;
    route: string;
    owner_name?: string;
    phone?: string;
    current_outstanding?: number;
    status?: string;
  }>;
  products: Array<{
    id: string;
    sku: string;
    category: string;
    mrp: number;
    godown_stock: number;
    company: string;
  }>;
  orders: Array<{
    id: string;
    outlet_name: string;
    route: string;
    total_value: number;
    checks: string;
    status: string;
  }>;
  salesmen: Array<{
    id: string;
    name: string;
    beat: string;
    phone?: string;
    status?: string;
  }>;
}

export const searchApi = {
  search: (queryText: string) =>
    apiClient.get<GlobalSearchResult>(`/search?q=${encodeURIComponent(queryText)}`),
};
