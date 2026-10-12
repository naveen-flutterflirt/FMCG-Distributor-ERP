'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Plus } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';

export function NewOrderModal() {
  const { isNewOrderModalOpen, setIsNewOrderModalOpen, addNewOrder } = useCrm();
  const [outlet, setOutlet] = useState('Gupta Kirana Store');
  const [route, setRoute] = useState('R4 Gandhi Nagar');
  const [value, setValue] = useState(6800);

  if (!isNewOrderModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewOrder({
      outlet,
      route,
      value: Number(value),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#dcfce7] text-[#15803d]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-[#111827]">Create Field / Pre-Sell Order</h2>
              <p className="text-[11px] text-[#6b7280]">Record beat order with automatic scheme calculation</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewOrderModalOpen(false)}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 rounded p-1 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-[#374151] mb-1">
              Select Retailer / Outlet
            </label>
            <select
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="w-full text-[12px] border border-slate-300 rounded-[6px] p-2 bg-white focus:outline-none focus:border-[#005f56] cursor-pointer"
            >
              <option value="Gupta Kirana Store">Gupta Kirana Store (R4 Gandhi Nagar)</option>
              <option value="Shree Ram General">Shree Ram General (R4 Gandhi Nagar)</option>
              <option value="New Bharat Stores">New Bharat Stores (R2 Station Rd)</option>
              <option value="Hotel Sagar (HoReCa)">Hotel Sagar (R1 Civil Lines)</option>
              <option value="Ma Durga Traders">Ma Durga Traders (R3 Old Market)</option>
              <option value="Radha Rani Provision">Radha Rani Provision (R4 Gandhi Nagar)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                Route / Beat
              </label>
              <input
                type="text"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full text-[12px] border border-slate-300 rounded-[6px] p-2 bg-slate-50 text-slate-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                Estimated Order Value (₹)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full text-[12px] border border-slate-300 rounded-[6px] p-2 bg-white focus:outline-none focus:border-[#005f56]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#f0fdf4] border border-[#dcfce7] rounded-[6px] text-[11px] space-y-1 text-[#166534]">
            <div className="font-semibold flex items-center justify-between">
              <span>Automatic Pre-Bill Verification</span>
              <span className="text-[10px] bg-[#dcfce7] text-[#15803d] px-2 py-0.2 rounded font-bold">ACTIVE</span>
            </div>
            <p className="text-[11px] text-[#15803d]">
              • Credit limit check: Verified within ₹25,000 threshold<br />
              • FIFO Batch deduction enabled<br />
              • Company A QPS (2%) applied on eligible items
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewOrderModalOpen(false)}
              className="px-3.5 py-1.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 rounded-[6px] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Confirm Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
