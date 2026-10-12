'use client';

import React from 'react';
import { Award } from 'lucide-react';
import { mockScorecards } from '@/data/mockData';
import { useCrm } from '@/context/CrmContext';

export default function FieldTeamPage() {
  const { showAlert } = useCrm();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Field Team &amp; Incentives
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Salesman scorecards, beat tracking &amp; daily automated incentive engine.
          </p>
        </div>

        <button
          onClick={() =>
            showAlert(
              'Sales Incentive Engine',
              'Computed daily and MTD slab milestones for 15 salesmen. Total provisional payout calculated: ₹43,200.',
              'success'
            )
          }
          className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Compute Incentive Slabs</span>
        </button>
      </div>

      {/* Field Force Headcount Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Salesmen in Field</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">14 / 15</div>
          <div className="text-[10px] text-[#059669] font-medium">93.3% Field Attendance</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Beat Compliance</div>
          <div className="text-[18px] font-bold text-[#059669] mt-0.5">94.8%</div>
          <div className="text-[10px] text-[#6b7280]">GPS Geo-fenced Visits</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Average LPC Today</div>
          <div className="text-[18px] font-bold text-[#005f56] mt-0.5">6.4 Lines</div>
          <div className="text-[10px] text-[#059669] font-medium">Target: ≥ 6.0</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Incentive Earned MTD</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">₹38,400</div>
          <div className="text-[10px] text-[#6b7280]">Auto-calculated daily</div>
        </div>
      </div>

      {/* Incentive Calculation Rules Box */}
      <div className="erp-card p-4 bg-[#f0fdf4] border border-[#dcfce7]">
        <h3 className="text-[13px] font-bold text-[#111827] mb-2">
          Active Incentive Matrix Rules (October 2026)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-[11px] text-[#374151]">
          <div className="p-2 bg-white rounded border border-[#e5e7eb]">
            <span className="font-bold text-[#111827] block">1. Volume Target Slab</span>
            <span className="text-[#6b7280]">80–100%: ₹4,000 | &gt;100%: ₹8,000 bonus</span>
          </div>
          <div className="p-2 bg-white rounded border border-[#e5e7eb]">
            <span className="font-bold text-[#111827] block">2. UBO / ECO Coverage</span>
            <span className="text-[#6b7280]">≥ 80% active outlets billed: ₹2,500</span>
          </div>
          <div className="p-2 bg-white rounded border border-[#e5e7eb]">
            <span className="font-bold text-[#111827] block">3. Lines Per Call (LPC)</span>
            <span className="text-[#6b7280]">≥ 6.0 lines/call: ₹1,500 monthly</span>
          </div>
          <div className="p-2 bg-white rounded border border-[#e5e7eb]">
            <span className="font-bold text-[#111827] block">4. Must-Sell Focus SKUs</span>
            <span className="text-[#6b7280]">≥ 60% coverage on 5 focus items: ₹2,000</span>
          </div>
        </div>
      </div>

      {/* Detailed Salesman Scorecard */}
      <div className="erp-card overflow-hidden">
        <div className="p-3 border-b border-[#e5e7eb] bg-white flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-[#111827]">
            Salesman Scorecards
          </h3>
          <span className="text-[11px] text-[#059669] font-medium">Live sync active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-white table-header border-b border-[#e5e7eb]">
              <tr>
                <th className="py-2.5 px-3">Salesman</th>
                <th className="py-2.5 px-3">Assigned Beat</th>
                <th className="py-2.5 px-3 text-center">Visited Outlets</th>
                <th className="py-2.5 px-3 text-center">Productive</th>
                <th className="py-2.5 px-3 text-center">LPC</th>
                <th className="py-2.5 px-3 text-right">Daily Sales</th>
                <th className="py-2.5 px-3 text-center">Must-Sell (5)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {mockScorecards.map((sm) => (
                <tr key={sm.id} className="hover:bg-[#fafafa]">
                  <td className="py-2.5 px-3 font-semibold text-[#111827]">
                    {sm.name}
                  </td>
                  <td className="py-2.5 px-3 text-[#4b5563]">{sm.beat}</td>
                  <td className="py-2.5 px-3 text-center text-[#111827] font-semibold">{sm.visited}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#111827]">{sm.productive}</td>
                  <td className="py-2.5 px-3 text-center font-semibold text-[#005f56]">{sm.lpc}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#111827]">
                    ₹{sm.sales.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        sm.mustSell === '5/5'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : 'bg-[#fef3c7] text-[#b45309]'
                      }`}
                    >
                      {sm.mustSell}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[#15803d] font-bold bg-[#dcfce7] px-2 py-0.5 rounded text-[10px]">
                      On Track
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
