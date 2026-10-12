'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';

const mockInventory = [
  {
    sku: 'Premium CTC Tea 250 g',
    company: 'Company A',
    batch: 'B26-10-A',
    mrp: 125,
    godownStock: 840,
    vanStock: 156,
    totalStock: 996,
    coverDays: 14,
    expiryDate: '15 Aug 2027',
    status: 'Healthy',
  },
  {
    sku: 'Glucose Biscuit ₹10 pack',
    company: 'Company B',
    batch: 'B26-09-F',
    mrp: 10,
    godownStock: 2400,
    vanStock: 492,
    totalStock: 2892,
    coverDays: 18,
    expiryDate: '10 Feb 2027',
    status: 'Healthy',
  },
  {
    sku: 'Soft drink 600 ml Pet',
    company: 'Company C',
    batch: 'B26-08-C',
    mrp: 40,
    godownStock: 180,
    vanStock: 44,
    totalStock: 224,
    coverDays: 3,
    expiryDate: '28 Nov 2026',
    status: 'Low Cover (< 5 d)',
  },
  {
    sku: 'Floor Cleaner 1L Citrus',
    company: 'Company D',
    batch: 'B26-07-D',
    mrp: 145,
    godownStock: 45,
    vanStock: 12,
    totalStock: 57,
    coverDays: 2,
    expiryDate: '15 Dec 2026',
    status: 'Low Cover (< 5 d)',
  },
  {
    sku: 'Potato Crisps ₹10 Masala',
    company: 'Company B',
    batch: 'B26-05-B',
    mrp: 10,
    godownStock: 120,
    vanStock: 0,
    totalStock: 120,
    coverDays: 6,
    expiryDate: '20 Nov 2026',
    status: 'Near Expiry (40 d)',
  },
  {
    sku: 'Moisturizing Soap 4-pack',
    company: 'Company A',
    batch: 'B26-09-M',
    mrp: 140,
    godownStock: 620,
    vanStock: 48,
    totalStock: 668,
    coverDays: 12,
    expiryDate: '12 Sep 2027',
    status: 'Healthy',
  },
];

export default function GodownPage() {
  const { showAlert } = useCrm();
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('All');

  const filteredItems = mockInventory.filter((item) => {
    const matchesSearch = item.sku.toLowerCase().includes(search.toLowerCase()) || item.batch.toLowerCase().includes(search.toLowerCase());
    const matchesComp = filterCompany === 'All' || item.company.includes(filterCompany);
    return matchesSearch && matchesComp;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Godown &amp; Stock Ledger
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Batch-wise FIFO inventory with barcode scanning, near-expiry alerts, and stock movement logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              showAlert(
                'Barcode Physical Audit',
                'Wireless barcode scanner connected. Scan any carton or inner pack barcode to verify physical inventory against batch records.',
                'info'
              )
            }
            className="px-3 py-1.5 text-[12px] font-semibold bg-white border border-[#d1d5db] hover:bg-slate-50 text-[#374151] rounded-[6px] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            Barcode Audit
          </button>
          <button
            type="button"
            onClick={() =>
              showAlert(
                'Stock Inward / GRN Adjustment',
                'Ready to record Goods Receipt Note (GRN) or batch re-allocation. Stock changes will update FIFO ledgers and Tally sync vouchers.',
                'success'
              )
            }
            className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            + Inward / Adjust
          </button>
        </div>
      </div>

      {/* Stock Health Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Total Valuation</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">₹58.6L</div>
          <div className="text-[10px] text-[#6b7280]">Days of stock: 12.4 d</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Below 5 Days Cover</div>
          <div className="text-[18px] font-bold text-[#dc2626] mt-0.5">23 SKUs</div>
          <div className="text-[10px] text-[#dc2626] font-medium">Re-order required</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Near Expiry (60 d)</div>
          <div className="text-[18px] font-bold text-[#c27803] mt-0.5">₹2.9L</div>
          <div className="text-[10px] text-[#c27803] font-medium">Clearance scheme</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Damaged Stock</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">₹1.4L</div>
          <div className="text-[10px] text-[#6b7280]">Quarantined in Rack Q-2</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU or batch code..."
            className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-white border border-[#d1d5db] rounded-[6px] text-[#111827] focus:outline-none focus:border-[#005f56]"
          />
        </div>
        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-3 py-1.5 text-[#374151] focus:outline-none focus:border-[#005f56] cursor-pointer"
        >
          <option value="All">All Companies ▾</option>
          <option value="Company A">Company A (Personal Care)</option>
          <option value="Company B">Company B (Foods)</option>
          <option value="Company C">Company C (Beverages)</option>
          <option value="Company D">Company D (Home Care)</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="erp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-white table-header border-b border-[#e5e7eb]">
              <tr>
                <th className="py-2.5 px-3">SKU Name</th>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3 font-mono">Batch Code</th>
                <th className="py-2.5 px-3 text-right">MRP</th>
                <th className="py-2.5 px-3 text-right">Godown Qty</th>
                <th className="py-2.5 px-3 text-right">Van Stock</th>
                <th className="py-2.5 px-3 text-right">Total Qty</th>
                <th className="py-2.5 px-3 text-center">Cover</th>
                <th className="py-2.5 px-3">Expiry</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {filteredItems.map((item) => (
                <tr key={item.sku} className="hover:bg-[#fafafa]">
                  <td className="py-2.5 px-3 font-semibold text-[#111827]">{item.sku}</td>
                  <td className="py-2.5 px-3 text-[#4b5563]">{item.company}</td>
                  <td className="py-2.5 px-3 font-mono text-[#6b7280]">{item.batch}</td>
                  <td className="py-2.5 px-3 text-right text-[#111827]">₹{item.mrp}</td>
                  <td className="py-2.5 px-3 text-right text-[#111827]">{item.godownStock}</td>
                  <td className="py-2.5 px-3 text-right text-[#005f56] font-medium">{item.vanStock}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#111827]">{item.totalStock}</td>
                  <td className="py-2.5 px-3 text-center text-[#4b5563]">{item.coverDays} d</td>
                  <td className="py-2.5 px-3 text-[#6b7280]">{item.expiryDate}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'Healthy'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : item.status.includes('Low')
                          ? 'bg-[#fee2e2] text-[#b91c1c]'
                          : 'bg-[#fef3c7] text-[#b45309]'
                      }`}
                    >
                      {item.status}
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
