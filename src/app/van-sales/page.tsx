'use client';

import React from 'react';
import { useCrm } from '@/context/CrmContext';

export default function VanSalesPage() {
  const { vanSettlement, closeVanSettlement, showConfirm } = useCrm();

  const handleCloseSettlement = () => {
    showConfirm(
      'Close Van Settlement',
      'Are you sure you want to reconcile and close Van 2 settlement? Counted return stocks will be restored to warehouse ledger and cash variance (-₹1,240) will be recorded as salesman recovery voucher.',
      () => closeVanSettlement(),
      'Confirm & Settle',
      'Cancel',
      'warning'
    );
  };

  return (
    <div className="space-y-4">
      {/* Header bar matching Page 6 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="text-[13px] text-[#374151]">
          <span className="font-bold text-[#111827]">Van 2 · Imran · Route R6 Industrial Area</span> · Fri 9 Oct · loaded 08:10 · returned 19:25
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-[12px] font-medium bg-white hover:bg-slate-50 text-[#374151] border border-[#d1d5db] rounded-[6px] transition-colors cursor-pointer"
          >
            Print
          </button>

          <button
            onClick={handleCloseSettlement}
            disabled={vanSettlement.status === 'Settled'}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-[6px] transition-colors cursor-pointer ${
              vanSettlement.status === 'Settled'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#005f56] hover:bg-[#004e46] text-white'
            }`}
          >
            {vanSettlement.status === 'Settled' ? 'Settled ✓' : 'Close settlement'}
          </button>
        </div>
      </div>

      {/* Stock Reconciliation Table */}
      <div className="erp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="border-b border-[#e5e7eb] table-header bg-white">
              <tr>
                <th className="py-2.5 px-3 font-medium">SKU</th>
                <th className="py-2.5 px-3 font-medium text-right">Loaded</th>
                <th className="py-2.5 px-3 font-medium text-right">Sold</th>
                <th className="py-2.5 px-3 font-medium text-right">Free (scheme)</th>
                <th className="py-2.5 px-3 font-medium text-right">Good return</th>
                <th className="py-2.5 px-3 font-medium text-right">Damage in</th>
                <th className="py-2.5 px-3 font-medium text-right">Expected back</th>
                <th className="py-2.5 px-3 font-medium text-right">Counted back</th>
                <th className="py-2.5 px-3 font-medium text-center">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {vanSettlement.items.map((item) => (
                <tr key={item.sku}>
                  <td className="py-2.5 px-3 text-[#111827]">{item.sku}</td>
                  <td className="py-2.5 px-3 text-right text-[#4b5563]">{item.loaded}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-[#111827]">{item.sold}</td>
                  <td className="py-2.5 px-3 text-right text-[#4b5563]">{item.freeScheme}</td>
                  <td className="py-2.5 px-3 text-right text-[#4b5563]">{item.goodReturn}</td>
                  <td className="py-2.5 px-3 text-right text-[#4b5563]">{item.damageIn}</td>
                  <td className="py-2.5 px-3 text-right text-[#4b5563]">{item.expectedBack}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-[#111827]">{item.countedBack}</td>
                  <td className="py-2.5 px-3 text-center">
                    {item.variance === 0 ? (
                      <span className="text-[#15803d] font-bold">0</span>
                    ) : (
                      <span className="text-[#c2410c] font-bold">{item.variance}</span>
                    )}
                  </td>
                </tr>
              ))}

              {/* Empty crates row */}
              <tr className="bg-[#fafafa]">
                <td className="py-2.5 px-3 font-medium text-[#111827]">
                  Empty crates (returnable)
                </td>
                <td className="py-2.5 px-3 text-right text-[#4b5563]">10 out</td>
                <td colSpan={5} className="py-2.5 px-3 text-[#6b7280]">
                  8 crates issued to outlets · 6 collected back
                </td>
                <td className="py-2.5 px-3 text-right font-medium text-[#111827]">8</td>
                <td className="py-2.5 px-3 text-center text-[#c27803] font-medium text-[11px]">
                  2 with outlets
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 3-Card Grid matching Page 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Card 1: Cash settlement */}
        <div className="lg:col-span-4 erp-card p-4">
          <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
            Cash settlement
          </h3>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">Cash sales</span>
              <span className="text-[#111827]">₹58,420</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">Old dues collected — cash</span>
              <span className="text-[#111827]">₹12,830</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">UPI received (auto-matched)</span>
              <span className="text-[#111827]">₹31,600</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">Cheques (3)</span>
              <span className="text-[#111827]">₹14,250</span>
            </div>
            <div className="flex justify-between py-1 text-[#6b7280]">
              <span>Expenses (fuel, toll — with receipts)</span>
              <span>−₹1,140</span>
            </div>
            <div className="pt-2 border-t border-[#f3f4f6] flex justify-between font-bold text-[#111827]">
              <span>Cash to deposit</span>
              <span>₹70,110</span>
            </div>
            <div className="flex justify-between py-1 text-[#374151]">
              <span>Cash counted (denominations)</span>
              <span className="text-[#111827]">₹68,870</span>
            </div>
            <div className="pt-2 border-t border-[#f3f4f6] flex justify-between font-bold text-[#c2410c]">
              <span>Short</span>
              <span>−₹1,240</span>
            </div>
          </div>
        </div>

        {/* Card 2: Van sales features */}
        <div className="lg:col-span-4 erp-card p-4">
          <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
            Van sales features
          </h3>

          <ul className="space-y-2 text-[11px] text-[#374151]">
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Load request from salesman, approved by godown</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Van treated as a mobile warehouse with its own stock</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Bluetooth printer invoices with QR for UPI</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Credit sales allowed only for approved outlets</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Returns and damage taken back on the van, verified at unload</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Returnable containers (crates, jars) tracked per outlet</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Next-day load suggested from today&apos;s sales and beat</span>
            </li>
          </ul>
        </div>

        {/* Card 3: Settlement controls */}
        <div className="lg:col-span-4 erp-card p-4">
          <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
            Settlement controls
          </h3>

          <ul className="space-y-2 text-[11px] text-[#374151]">
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Van cannot be loaded again until the last trip is settled</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Stock variance valued and posted to the salesman&apos;s account</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Cash short / excess needs cashier and owner sign-off</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Cheques logged with bank, date; bounce reverses receipt</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>Day-end summary sent to the owner on WhatsApp</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
