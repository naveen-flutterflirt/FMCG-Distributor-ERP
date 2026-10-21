import { apiClient } from './client';

export interface ReportKpi {
  name: string;
  definition: string;
  owner: string;
  target: string;
  actual: string;
  status: 'Met' | 'Healthy' | 'On track' | 'Follow-up' | 'Attention' | 'Under Target' | 'Controlled' | string;
}

export interface ReportsSummary {
  totalOrderSales: number;
  totalOutlets: number;
  billedOutlets: number;
  totalSalesmen: number;
  avgLpc: number;
  dsoDays: number;
}

export interface ReportsData {
  kpis: ReportKpi[];
  summary: ReportsSummary;
}

export interface ReportColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export interface ReportPreviewData {
  reportType: string;
  columns: ReportColumn[];
  rows: any[];
}

export const reportsApi = {
  getDashboard: async () => {
    return apiClient.get<ReportsData>('/reports/dashboard');
  },

  getPreview: async (reportType: string) => {
    return apiClient.get<ReportPreviewData>(`/reports/preview?reportType=${encodeURIComponent(reportType)}`);
  },

  getExportUrl: (reportType: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return `${baseUrl}/reports/export?reportType=${encodeURIComponent(reportType)}`;
  }
};
