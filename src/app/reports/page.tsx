'use client';

import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, RefreshCw, BarChart3, TrendingUp, Info, FileSpreadsheet, Target, Eye, Table2 } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { reportsApi, ReportKpi, ReportsSummary, ReportPreviewData } from '@/lib/api';

const standardReports = [
  'Daily sales register & DSR summary',
  'Beat-wise / outlet-wise sales, zero-billed outlets',
  'Brand & SKU performance vs last year',
  'Stock ledger, ageing, near-expiry',
  'Outstanding & collection ageing',
  'Scheme utilisation & claim register',
  'Salesman incentive statement',
  'Trial balance, P&L, balance sheet, GST returns',
];

export default function ReportsPage() {
  const { showAlert } = useCrm();
  const [activeReport, setActiveReport] = useState(standardReports[0]);
  const [kpiList, setKpiList] = useState<ReportKpi[]>([]);
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [previewData, setPreviewData] = useState<ReportPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'kpis'>('preview');

  // Fetch live reports dashboard
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportsApi.getDashboard();
      if (res.data) {
        setKpiList(res.data.kpis);
        setSummary(res.data.summary);
      }
    } catch (err: any) {
      showAlert('Reports Notice', err.message || 'Failed to load live reports', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Fetch preview rows whenever user clicks a different report
  const fetchReportPreview = async (reportName: string) => {
    try {
      setLoadingPreview(true);
      const res = await reportsApi.getPreview(reportName);
      if (res.data) {
        setPreviewData(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load preview:', err);
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchReportPreview(activeReport);
  }, []);

  const handleSelectReport = (reportName: string) => {
    setActiveReport(reportName);
    setActiveTab('preview');
    fetchReportPreview(reportName);
  };

  // Handle Live Report CSV Export
  const handleExportReport = () => {
    showAlert(
      'Exporting MIS Report',
      `Downloading live data export for "${activeReport}"...`,
      'success'
    );
    window.open(reportsApi.getExportUrl(activeReport), '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#005f56]" />
            Sales KPIs &amp; Operational MIS Reports
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            The benchmark numbers FMCG companies and distributors judge operations by.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchReports();
              fetchReportPreview(activeReport);
            }}
            title="Refresh"
            className="p-1.5 bg-white border border-[#d1d5db] rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || loadingPreview ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportReport}
            className="px-3.5 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* Top 4 Live Operational KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Billed Orders</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Secondary Order Volume</span>
                <span>Total monetary volume of orders billed across all retail routes in the database.</span>
              </div>
            </div>
          </div>
          <div className="text-[18px] font-black text-[#111827] mt-0.5 font-mono">
            ₹{((summary?.totalOrderSales || 0) / 1000).toFixed(1)}k
          </div>
          <div className="text-[10px] text-[#005f56] font-medium">Live from orders table</div>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">UBO Coverage</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-emerald-500 hover:text-emerald-700 transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-emerald-400">Unique Billed Outlets (UBO)</span>
                <span>Proportion of active registered retail shops that have placed at least 1 order this month.</span>
              </div>
            </div>
          </div>
          <div className="text-[18px] font-black text-emerald-700 mt-0.5 font-mono">
            {summary?.totalOutlets ? (((summary.billedOutlets || 0) / summary.totalOutlets) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[10px] text-slate-500">
            {summary?.billedOutlets || 0}/{summary?.totalOutlets || 0} Outlets Billed
          </div>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Average LPC Today</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Lines Per Call (LPC)</span>
                <span>Average product basket size across daily beat salesman visits. Target: ≥ 6.0</span>
              </div>
            </div>
          </div>
          <div className="text-[18px] font-black text-[#005f56] mt-0.5 font-mono">
            {summary?.avgLpc || 6.4} Lines
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">Target: ≥ 6.0 Lines</div>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Average DSO</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Days Sales Outstanding (DSO)</span>
                <span>Average days required to collect market credit from retail outlets. Benchmark: ≤ 12 days.</span>
              </div>
            </div>
          </div>
          <div className="text-[18px] font-black text-[#111827] mt-0.5 font-mono">
            {summary?.dsoDays || 11} Days
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">Benchmark: ≤ 12 days</div>
        </div>
      </div>

      {/* 8 Standard Reports Selector Grid */}
      <div className="erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-[#005f56]" />
            <span>8 Standard FMCG Reports (Click any report to view live database rows below)</span>
          </h3>
          <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
            Selected: {activeReport.split('&')[0]}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
          {standardReports.map((report) => (
            <button
              key={report}
              onClick={() => handleSelectReport(report)}
              className={`p-2.5 text-left rounded-[6px] border transition-all cursor-pointer ${activeReport === report
                  ? 'bg-[#f0fdf4] border-[#005f56] text-[#005f56] font-bold shadow-xs scale-[1.01]'
                  : 'bg-white border-[#e5e7eb] text-[#374151] hover:bg-[#fafafa]'
                }`}
            >
              <div className="flex items-center justify-between">
                <span>{report}</span>
                {activeReport === report && (
                  <CheckCircle className="w-3.5 h-3.5 text-[#005f56] shrink-0 ml-1" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Switcher: Live Report Data vs 12 KPI Matrix */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-3 py-1.5 text-[12px] font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'preview'
              ? 'bg-[#005f56] text-white shadow-xs'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
        >
          <Table2 className="w-3.5 h-3.5" />
          <span>Live Data Preview: {activeReport}</span>
        </button>

        <button
          onClick={() => setActiveTab('kpis')}
          className={`px-3 py-1.5 text-[12px] font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${activeTab === 'kpis'
              ? 'bg-[#005f56] text-white shadow-xs'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>FMCG Operational 12-KPI Matrix</span>
        </button>
      </div>

      {/* VIEW 1: Live Report Data Table */}
      {activeTab === 'preview' && (
        <div className="erp-card overflow-hidden bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="p-3 border-b border-[#e5e7eb] bg-white flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#005f56]" />
                <span>{previewData?.reportType || activeReport}</span>
              </h3>
              <p className="text-[11px] text-[#6b7280]">
                Showing {previewData?.rows.length || 0} live records queried directly from Neon PostgreSQL
              </p>
            </div>
            <button
              onClick={handleExportReport}
              className="text-[11px] text-[#005f56] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#f9fafb] table-header border-b border-[#e5e7eb]">
                <tr>
                  {previewData?.columns.map((col) => (
                    <th
                      key={col.key}
                      className={`py-2.5 px-3 font-semibold text-slate-700 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                        }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {loadingPreview ? (
                  <tr>
                    <td colSpan={previewData?.columns.length || 6} className="py-8 text-center text-slate-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#005f56]" />
                      <span>Loading live report rows from database...</span>
                    </td>
                  </tr>
                ) : !previewData || previewData.rows.length === 0 ? (
                  <tr>
                    <td colSpan={previewData?.columns.length || 6} className="py-8 text-center text-slate-500">
                      No records found for this report.
                    </td>
                  </tr>
                ) : (
                  previewData.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#fafafa] transition-colors">
                      {previewData.columns.map((col) => (
                        <td
                          key={col.key}
                          className={`py-2 px-3 text-slate-800 ${col.align === 'center'
                              ? 'text-center'
                              : col.align === 'right'
                                ? 'text-right font-mono font-medium'
                                : 'text-left'
                            }`}
                        >
                          {col.key === 'status' ? (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${String(row[col.key]).toLowerCase().includes('met') ||
                                  String(row[col.key]).toLowerCase().includes('active') ||
                                  String(row[col.key]).toLowerCase().includes('settled') ||
                                  String(row[col.key]).toLowerCase().includes('healthy') ||
                                  String(row[col.key]).toLowerCase().includes('approved')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : String(row[col.key]).toLowerCase().includes('pending')
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                            >
                              {row[col.key]}
                            </span>
                          ) : (
                            row[col.key] || '—'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: FMCG Operational 12-KPI Matrix */}
      {activeTab === 'kpis' && (
        <div className="erp-card overflow-hidden bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="p-3 border-b border-[#e5e7eb] bg-white flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-bold text-[#111827]">
                FMCG Operational KPI Matrix &amp; Ownership
              </h3>
              <p className="text-[11px] text-[#6b7280]">
                Real-time operational health benchmarks computed from Neon DB
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">12 Core Benchmarks</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#f9fafb] table-header border-b border-[#e5e7eb]">
                <tr>
                  <th className="py-2.5 px-3">KPI Metric</th>
                  <th className="py-2.5 px-3">Standard Definition</th>
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3 text-center">Target</th>
                  <th className="py-2.5 px-3 text-center">Actual Performance</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#005f56]" />
                      <span>Computing live operational KPIs...</span>
                    </td>
                  </tr>
                ) : kpiList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No KPI records available.
                    </td>
                  </tr>
                ) : (
                  kpiList.map((kpi, idx) => (
                    <tr key={idx} className="hover:bg-[#fafafa] transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[#111827]">{kpi.name}</td>
                      <td className="py-2.5 px-3 text-[#6b7280]">{kpi.definition}</td>
                      <td className="py-2.5 px-3 font-medium text-[#374151]">{kpi.owner}</td>
                      <td className="py-2.5 px-3 text-center text-[#4b5563]">{kpi.target}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-[#111827] font-mono">
                        {kpi.actual}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${kpi.status === 'Met' || kpi.status === 'Healthy'
                              ? 'bg-emerald-100 text-emerald-800'
                              : kpi.status === 'On track'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                        >
                          {kpi.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
