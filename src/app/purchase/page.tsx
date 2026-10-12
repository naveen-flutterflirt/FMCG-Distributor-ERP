'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';

export default function PurchasePage() {
  const { showAlert } = useCrm();
  const purchaseOrders = [
    {
      id: 'PO-2026-091',
      company: 'Company A · Personal Care',
      date: '08 Oct 2026',
      itemsCount: 42,
      grossValue: 1250000,
      expectedDelivery: '10 Oct 2026',
      status: 'Goods in Transit',
      eInvoiceIrn: '4c8e7...b901',
    },
    {
      id: 'PO-2026-088',
      company: 'Company B · Foods & Confectionery',
      date: '06 Oct 2026',
      itemsCount: 65,
      grossValue: 1840000,
      expectedDelivery: '08 Oct 2026',
      status: 'GRN Completed',
      eInvoiceIrn: '9a1f2...d432',
    },
    {
      id: 'PO-2026-085',
      company: 'Company C · Beverages',
      date: '05 Oct 2026',
      itemsCount: 18,
      grossValue: 620000,
      expectedDelivery: '07 Oct 2026',
      status: 'GRN Completed (Shortage Claimed)',
      eInvoiceIrn: '7e2c9...a118',
    },
    {
      id: 'PO-2026-082',
      company: 'Company D · Home Care',
      date: '02 Oct 2026',
      itemsCount: 30,
      grossValue: 910000,
      expectedDelivery: '04 Oct 2026',
      status: 'Settled & Paid',
      eInvoiceIrn: '2b4a1...e773',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Purchase from Companies
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Primary Inbound PO, e-Invoice Import &amp; GRN
          </p>
        </div>

        <button
          onClick={() =>
            showAlert(
              'Generate Primary Purchase Order',
              'Auto-PO calculation initiated based on 14-day sales velocity and buffer godown requirements. Ready to dispatch EDI order to Company DMS.',
              'success'
            )
          }
          className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate Primary PO</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Pending Inbound POs</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">₹12.5L</div>
          <div className="text-[10px] text-[#005f56] font-medium">1 In Transit (Arriving Tomorrow)</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">MTD Primary Purchases</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">₹46.2L</div>
          <div className="text-[10px] text-[#6b7280]">Across 4 Principals</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">GSTR-2B ITC Matching</div>
          <div className="text-[18px] font-bold text-[#059669] mt-0.5">98.6%</div>
          <div className="text-[10px] text-[#059669] font-medium">4 Invoices with Mismatches</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Shortage Debit Notes</div>
          <div className="text-[18px] font-bold text-[#c27803] mt-0.5">₹34,200</div>
          <div className="text-[10px] text-[#6b7280]">2 GRN Differences Claimed</div>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="erp-card overflow-hidden">
        <div className="p-3 border-b border-[#e5e7eb] bg-white flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-[#111827]">Primary Inbound Orders Register</h3>
          <span className="text-[11px] text-[#6b7280]">October 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-white table-header border-b border-[#e5e7eb]">
              <tr>
                <th className="py-2.5 px-3">PO Number</th>
                <th className="py-2.5 px-3">Company / Principal</th>
                <th className="py-2.5 px-3">Order Date</th>
                <th className="py-2.5 px-3 text-center">Items</th>
                <th className="py-2.5 px-3 text-right">Gross Value</th>
                <th className="py-2.5 px-3">e-Invoice IRN</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-[#fafafa]">
                  <td className="py-2.5 px-3 font-semibold text-[#111827]">{po.id}</td>
                  <td className="py-2.5 px-3 text-[#111827]">{po.company}</td>
                  <td className="py-2.5 px-3 text-[#6b7280]">{po.date}</td>
                  <td className="py-2.5 px-3 text-center text-[#4b5563]">{po.itemsCount} SKUs</td>
                  <td className="py-2.5 px-3 text-right font-medium text-[#111827]">
                    ₹{po.grossValue.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#6b7280] text-[11px]">{po.eInvoiceIrn}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        po.status.includes('Completed')
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : po.status.includes('Transit')
                          ? 'bg-[#f0fdf4] text-[#005f56]'
                          : 'bg-[#f3f4f6] text-[#374151]'
                      }`}
                    >
                      {po.status}
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
