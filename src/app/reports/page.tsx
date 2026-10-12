'use client';

import React, { useState } from 'react';
import { Download, CheckCircle } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';

const kpis = [
  {
    name: 'Secondary sales vs target',
    definition: 'Billed value ÷ company target, by brand',
    owner: 'Owner, ASM',
    target: '100% monthly',
    actual: '68% (Day 9 of 26)',
    status: 'On track',
  },
  {
    name: 'UBO / ECO',
    definition: 'Unique outlets billed in the month ÷ active outlets',
    owner: 'ASM',
    target: '≥ 80%',
    actual: '75.8% (2,412/3,180)',
    status: 'On track',
  },
  {
    name: 'Productive calls %',
    definition: 'Visits with an order ÷ planned visits',
    owner: 'Salesman',
    target: '≥ 70%',
    actual: '73.2%',
    status: 'Met',
  },
  {
    name: 'Lines per call (LPC)',
    definition: 'Order lines ÷ productive calls',
    owner: 'Salesman',
    target: '≥ 6',
    actual: '6.4',
    status: 'Met',
  },
  {
    name: 'Must-sell coverage',
    definition: 'Outlets billed each must-sell SKU ÷ outlets billed',
    owner: 'ASM',
    target: '≥ 60%',
    actual: '66.4%',
    status: 'Met',
  },
  {
    name: 'Fill rate',
    definition: 'Ordered lines supplied in full',
    owner: 'Godown',
    target: '≥ 97%',
    actual: '98.1%',
    status: 'Met',
  },
  {
    name: 'Days of stock',
    definition: 'Stock value ÷ avg daily sales at cost',
    owner: 'Owner',
    target: '10–15 d',
    actual: '12.4 d',
    status: 'Healthy',
  },
  {
    name: 'DSO (Collection days)',
    definition: 'Receivables ÷ avg daily credit sales',
    owner: 'Accounts',
    target: '≤ 12 d',
    actual: '11 d',
    status: 'Healthy',
  },
  {
    name: 'Claim recovery',
    definition: 'Claims settled ÷ claimable value',
    owner: 'Claims',
    target: '≥ 95%',
    actual: '84% (Sep pending)',
    status: 'Follow-up',
  },
  {
    name: 'Van variance',
    definition: 'Stock + cash differences ÷ van sales',
    owner: 'Cashier',
    target: '< 0.1%',
    actual: '0.08%',
    status: 'Controlled',
  },
  {
    name: 'Cost to serve',
    definition: 'Salaries + fleet + godown ÷ sales',
    owner: 'Owner',
    target: '< 5%',
    actual: '4.2%',
    status: 'Healthy',
  },
  {
    name: 'Net margin by company',
    definition: 'Margin + scheme income − allocated costs',
    owner: 'Owner',
    target: 'Per company',
    actual: '3.4% overall',
    status: 'Healthy',
  },
];

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Sales KPIs &amp; MIS Reports
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            The numbers FMCG companies — and owners — judge you by (Page 12 Blueprint).
          </p>
        </div>

        <button
          onClick={() =>
            showAlert(
              'Export MIS Report',
              `Generating spreadsheet and PDF export for "${activeReport}". All brand metrics, targets, and sales velocity data included.`,
              'success'
            )
          }
          className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Excel / PDF</span>
        </button>
      </div>

      {/* Standard Reports Grid */}
      <div className="erp-card p-4">
        <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
          8 Standard FMCG Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
          {standardReports.map((report) => (
            <button
              key={report}
              onClick={() => setActiveReport(report)}
              className={`p-2.5 text-left rounded-[6px] border transition-colors cursor-pointer ${
                activeReport === report
                  ? 'bg-[#f0fdf4] border-[#005f56] text-[#005f56] font-bold'
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

      {/* KPI Definition & Owner Matrix */}
      <div className="erp-card overflow-hidden">
        <div className="p-3 border-b border-[#e5e7eb] bg-white flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-[#111827]">
            FMCG Operational KPI Matrix &amp; Ownership
          </h3>
          <span className="text-[11px] text-[#6b7280]">Benchmark targets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-white table-header border-b border-[#e5e7eb]">
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
              {kpis.map((kpi) => (
                <tr key={kpi.name} className="hover:bg-[#fafafa]">
                  <td className="py-2.5 px-3 font-semibold text-[#111827]">{kpi.name}</td>
                  <td className="py-2.5 px-3 text-[#6b7280]">{kpi.definition}</td>
                  <td className="py-2.5 px-3 font-medium text-[#374151]">{kpi.owner}</td>
                  <td className="py-2.5 px-3 text-center text-[#4b5563]">{kpi.target}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#111827]">{kpi.actual}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        kpi.status === 'Met' || kpi.status === 'Healthy'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : kpi.status === 'On track'
                          ? 'bg-[#f0fdf4] text-[#005f56]'
                          : 'bg-[#fef3c7] text-[#b45309]'
                      }`}
                    >
                      {kpi.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
