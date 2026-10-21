import { apiClient, ApiResponse } from './client';

export interface ClaimEvidenceItem {
  id?: string;
  invoiceNo: string;
  outletName: string;
  sku: string;
  claimBasis: string;
  amount: number;
}

export interface Claim {
  id: string;
  company: string;
  type: string;
  period: string;
  amount: number;
  approvedAmount: number;
  creditNoteNo?: string;
  status: 'Submitted' | 'Query raised' | 'Audit done' | 'Credit note recd.' | 'Overdue' | 'Rejected';
  age: number;
  queryText?: string;
  queryResponse?: string;
  dueDaysLeft: number;
  items: ClaimEvidenceItem[];
}

export interface ClaimsSummary {
  totalRaisedYTD: number;
  totalSettled: number;
  totalPending: number;
  totalRejected: number;
  recoveryRate: number;
}

export interface RaiseClaimInput {
  company: string;
  claimType: string;
  period: string;
  amount: number;
  items?: {
    invoiceNo?: string;
    outletName?: string;
    sku?: string;
    claimBasis?: string;
    amount?: number;
  }[];
}

export interface ClaimFilterParams {
  company?: string;
  status?: string;
  type?: string;
}

export const claimApi = {
  /**
   * Get all company claims from Neon DB
   */
  getAll: async (params?: ClaimFilterParams) => {
    const query = new URLSearchParams();
    if (params?.company && params.company !== 'All') query.append('company', params.company);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.type && params.type !== 'All') query.append('type', params.type);

    const qs = query.toString();
    const endpoint = `/claims${qs ? `?${qs}` : ''}`;
    return apiClient.get<{ claims: Claim[]; summary: ClaimsSummary }>(endpoint);
  },

  /**
   * Raise a new claim
   */
  raise: async (input: RaiseClaimInput) => {
    return apiClient.post<{ id: string; status: string }>('/claims/raise', input);
  },

  /**
   * Resolve audit query for a claim
   */
  resolveQuery: async (id: string, responseText: string) => {
    return apiClient.post<{ id: string; status: string }>('/claims/resolve-query', {
      id,
      responseText,
    });
  },
};
