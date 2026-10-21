import { apiClient } from './client';

export interface DashboardKpis {
  secondarySalesMtd: number;
  targetCompletionPct: number;
  outletsBilled: number;
  totalOutlets: number;
  avgLpc: number;
  grossMarginPct: number;
  retailerOutstanding: number;
  overdue21d: number;
  pendingClaims: number;
  older60dClaims: number;
  collectedYesterday: number;
  collectionBreakdown?: {
    upiPct: number;
    cashPct: number;
    chequePct: number;
    neftPct: number;
    summaryText: string;
  };
  lowCoverSkusCount: number;
  nearExpiryValue: number;
  damagedStockValue: number;
}

export interface CompanyTarget {
  company: string;
  targetPct: number;
  color: string;
}

export interface ChannelMixItem {
  name: string;
  percentage: number;
  color: string;
}

export interface DashboardVanSettlement {
  id: string;
  vanNo: string;
  salesmanName: string;
  route: string;
  sales: number;
  cashDue: number;
  cashVariance: number;
  status: string;
}

export interface DashboardSalesmanScorecard {
  id: string;
  name: string;
  beat: string;
  visited: string;
  productive: number;
  lpc: number;
  sales: number;
  mustSell: string;
}

export interface DashboardStatsData {
  kpis: DashboardKpis;
  companyTargets: CompanyTarget[];
  channelMix: ChannelMixItem[];
  vanSettlements: DashboardVanSettlement[];
  salesmenScorecards: DashboardSalesmanScorecard[];
}

export const dashboardApi = {
  getStats: async (company?: string) => {
    const params = company && company !== 'All' ? `?company=${encodeURIComponent(company)}` : '';
    return apiClient.get<DashboardStatsData>(`/dashboard/stats${params}`);
  }
};
