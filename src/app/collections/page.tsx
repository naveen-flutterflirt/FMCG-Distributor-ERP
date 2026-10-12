'use client';

import React, { useState } from 'react';
import { IndianRupee, X } from 'lucide-react';
import { mockOutlets } from '@/data/mockData';
import { useCrm } from '@/context/CrmContext';

export default function CollectionsPage() {
  const { setNotification } = useCrm();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState('New Bharat Stores');
  const [amount, setAmount] = useState('5000');
  const [mode, setMode] = useState('UPI');

  const handleRecordReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(`Receipt of ₹${Number(amount).toLocaleString()} recorded via ${mode} for ${selectedOutlet}.`);
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Credit &amp; Collections
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Retailer credit aging, DSO monitoring, and cash/UPI receipt recording.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Record Receipt</span>
        </button>
      </div>

      {/* Top Credit Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Total Outstanding</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">₹62.4L</div>
          <div className="text-[10px] text-[#6b7280]">1,842 credit retailers</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Overdue &gt; 21 Days</div>
          <div className="text-[18px] font-bold text-[#dc2626] mt-0.5">₹9.8L</div>
          <div className="text-[10px] text-[#dc2626] font-medium">Billing freeze active</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">DSO (Days Outstanding)</div>
          <div className="text-[18px] font-bold text-[#059669] mt-0.5">11 Days</div>
          <div className="text-[10px] text-[#059669] font-medium">Target: ≤ 12 d</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Yesterday Collections</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">₹8.6L</div>
          <div className="text-[10px] text-[#005f56] font-medium">UPI 48% · Cash 37% · Chq 15%</div>
        </div>
      </div>

      {/* Aging Distribution */}
      <div className="erp-card p-4">
        <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
          Outstanding Aging Matrix
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px]">
          <div className="p-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px]">
            <span className="text-[#6b7280] block text-[10px]">Current (0–7 days)</span>
            <span className="text-[15px] font-bold text-[#111827]">₹38.2L</span>
            <span className="text-[#059669] block mt-0.5 font-medium">61.2% healthy</span>
          </div>
          <div className="p-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-[6px]">
            <span className="text-[#6b7280] block text-[10px]">8–14 days</span>
            <span className="text-[15px] font-bold text-[#111827]">₹9.6L</span>
            <span className="text-[#6b7280] block mt-0.5">15.4%</span>
          </div>
          <div className="p-2.5 bg-[#fffbeb] border border-[#fef3c7] rounded-[6px] text-[#92400e]">
            <span className="text-[#b45309] block text-[10px]">15–21 days</span>
            <span className="text-[15px] font-bold text-[#92400e]">₹4.8L</span>
            <span className="text-[#b45309] block mt-0.5">Reminder sent</span>
          </div>
          <div className="p-2.5 bg-[#fef2f2] border border-[#fee2e2] rounded-[6px] text-[#991b1b]">
            <span className="text-[#b91c1c] block text-[10px]">&gt; 21 days (Critical)</span>
            <span className="text-[15px] font-bold text-[#dc2626]">₹9.8L</span>
            <span className="text-[#b91c1c] block mt-0.5 font-medium">Owner sign-off needed</span>
          </div>
        </div>
      </div>

      {/* Critical Overdue Accounts Table */}
      <div className="erp-card overflow-hidden">
        <div className="p-3 border-b border-[#e5e7eb] bg-white flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-[#111827]">
            Critical Overdue Accounts
          </h3>
          <span className="text-[11px] text-[#dc2626] font-medium">Collection Priority</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-white table-header border-b border-[#e5e7eb]">
              <tr>
                <th className="py-2.5 px-3">Retailer Name</th>
                <th className="py-2.5 px-3">Route</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3 text-right">Credit Limit</th>
                <th className="py-2.5 px-3 text-right">Outstanding</th>
                <th className="py-2.5 px-3 text-center">Overdue Days</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {mockOutlets
                .filter((o) => o.currentOutstanding > 0)
                .map((outlet) => (
                  <tr key={outlet.id} className="hover:bg-[#fafafa]">
                    <td className="py-2.5 px-3 font-semibold text-[#111827]">{outlet.name}</td>
                    <td className="py-2.5 px-3 text-[#4b5563]">{outlet.route}</td>
                    <td className="py-2.5 px-3 font-mono text-[#6b7280]">{outlet.phone}</td>
                    <td className="py-2.5 px-3 text-right text-[#4b5563]">
                      ₹{outlet.creditLimit.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#dc2626]">
                      ₹{outlet.currentOutstanding.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-[#111827]">
                      {outlet.overdueDays} d
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {outlet.overdueDays > 21 ? (
                        <span className="bg-[#fee2e2] text-[#b91c1c] px-2 py-0.5 rounded text-[10px] font-bold">Blocked</span>
                      ) : (
                        <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded text-[10px] font-bold">Regular</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedOutlet(outlet.name);
                          setAmount(outlet.currentOutstanding.toString());
                          setModalOpen(true);
                        }}
                        className="px-2 py-0.5 bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#005f56] text-[11px] font-semibold rounded cursor-pointer transition-colors"
                      >
                        Collect
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Receipt Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-[14px] font-bold text-[#111827]">Record Payment Receipt</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordReceipt} className="p-5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                  Retailer Outlet
                </label>
                <input
                  type="text"
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  className="w-full text-[12px] border border-slate-300 rounded-[6px] p-2 bg-slate-50 text-[#111827]"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-[12px] border border-slate-300 rounded-[6px] p-2 bg-white focus:outline-none focus:border-[#005f56]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full text-[12px] border border-slate-300 rounded-[6px] p-2 bg-white focus:outline-none focus:border-[#005f56] cursor-pointer"
                  >
                    <option value="UPI">UPI Auto-Match</option>
                    <option value="Cash">Cash at Door</option>
                    <option value="Cheque">Bank Cheque</option>
                    <option value="NEFT">NEFT Direct</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 rounded-[6px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] cursor-pointer transition-colors"
                >
                  Confirm Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
