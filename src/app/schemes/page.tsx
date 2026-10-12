'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';

const activeSchemesList = [
  {
    id: 'SCH-01',
    company: 'Company A',
    title: 'QPS 2% Turnover Incentive',
    type: 'Quantity Purchase Scheme',
    rule: '2% invoice rebate on gross purchase above ₹5,000 across Personal Care SKUs',
    fundedBy: 'Company-funded (Claimable)',
    budget: '₹6,00,000',
    utilized: '₹4,82,300 (80.3%)',
    validity: '01 Oct – 31 Oct 2026',
    outletFilter: 'All Classes (A, B, C)',
    status: 'Active',
  },
  {
    id: 'SCH-02',
    company: 'Company B',
    title: 'Biscuits 12+1 Free Goods',
    type: 'Free Goods',
    rule: 'Order 12 cases of Glucose ₹10 pack, receive 1 case complimentary free stock',
    fundedBy: 'Company-funded (Claimable)',
    budget: '₹3,50,000',
    utilized: '₹2,14,600 (61.3%)',
    validity: '01 Oct – 31 Oct 2026',
    outletFilter: 'General Trade & Wholesale',
    status: 'Active',
  },
  {
    id: 'SCH-03',
    company: 'Company C',
    title: 'Visicooler Display Visibility',
    type: 'Display / Visibility',
    rule: 'Flat ₹500/month payout per verified chiller adhering to 100% brand planogram',
    fundedBy: 'Company-funded (Claimable)',
    budget: '₹1,50,000',
    utilized: '₹68,000 (45.3%)',
    validity: '01 Aug – 31 Oct 2026',
    outletFilter: 'Approved Cooler Outlets',
    status: 'Active',
  },
  {
    id: 'SCH-04',
    company: 'Company D',
    title: 'Combo Pack: Bio Detergent + Bar',
    type: 'Combo Bundle',
    rule: 'Buy 6 pcs Detergent 1kg, get 1 pack Moisturizing Soap 75g complimentary',
    fundedBy: 'Distributor-funded (Shared Margin)',
    budget: '₹80,000',
    utilized: '₹42,100 (52.6%)',
    validity: '05 Oct – 20 Oct 2026',
    outletFilter: 'Urban Beats (R1, R4)',
    status: 'Active',
  },
];

export default function SchemesPage() {
  const { showAlert } = useCrm();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Scheme Engine
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Rules, Slabs &amp; Real-time Budget Enforcement (Page 6 &amp; 7 Blueprint).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/claims"
            className="px-3 py-1.5 text-[12px] font-medium bg-white border border-[#d1d5db] rounded-[6px] hover:bg-slate-50 text-[#374151] flex items-center gap-1.5 transition-colors"
          >
            <span>Claims Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() =>
              showAlert(
                'Configure Trade Scheme',
                'Scheme setup wizard loaded. Define company co-share ratio, eligible SKU categories, slab quantities, and company budget caps.',
                'info'
              )
            }
            className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Configure Scheme</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {activeSchemesList.map((scheme) => (
          <div key={scheme.id} className="erp-card p-4 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#005f56] bg-[#f0fdf4] px-1.5 py-0.2 rounded">
                  {scheme.company} · {scheme.type}
                </span>
                <h3 className="text-[14px] font-bold text-[#111827] mt-1">
                  {scheme.title}
                </h3>
              </div>
              <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded text-[10px] font-bold">{scheme.status}</span>
            </div>

            <p className="text-[11px] text-[#4b5563] bg-[#f9fafb] p-2 rounded-[6px] border border-[#f3f4f6]">
              {scheme.rule}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4b5563]">
              <div>
                <span className="text-[10px] text-[#6b7280] block">Funded By:</span>
                <span className="font-semibold text-[#111827]">{scheme.fundedBy}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6b7280] block">Outlet Eligibility:</span>
                <span className="font-semibold text-[#111827]">{scheme.outletFilter}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6b7280] block">Total Budget:</span>
                <span className="font-semibold text-[#111827]">{scheme.budget}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6b7280] block">Utilized:</span>
                <span className="font-semibold text-[#059669]">{scheme.utilized}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f3f4f6] flex items-center justify-between text-[10px] text-[#6b7280]">
              <span>Validity: {scheme.validity}</span>
              <span className="text-[#005f56] font-semibold cursor-pointer hover:underline">
                View circular
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
