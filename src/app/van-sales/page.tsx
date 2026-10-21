'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Printer,
  FileCheck,
  TrendingUp,
  Wallet,
  PackageCheck,
  Building,
  RotateCcw,
} from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { vanSalesApi, VanSettlement } from '@/lib/api';

export default function VanSalesPage() {
  const { showAlert, showConfirm } = useCrm();

  const [settlement, setSettlement] = useState<VanSettlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSettling, setIsSettling] = useState(false);

  // Fetch live settlement from Neon DB
  const fetchSettlement = async () => {
    try {
      setLoading(true);
      const res = await vanSalesApi.getAll();
      if (res.data && res.data.length > 0) {
        setSettlement(res.data[0]);
      }
    } catch (err: any) {
      console.error('Failed to load van settlement from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlement();
  }, []);

  const handleCloseSettlement = () => {
    if (!settlement) return;

    showConfirm(
      'Reconcile & Close Van Settlement',
      `Reconcile ${settlement.vanNo} (${settlement.salesmanName})? Counted good return stocks will be restored to warehouse godown, van stock cleared, and cash short variance (₹${Math.abs(
        settlement.cashVariance
      ).toLocaleString()}) will be booked as salesman recovery voucher.`,
      async () => {
        try {
          setIsSettling(true);
          const res = await vanSalesApi.close(settlement.id);
          if (res.success) {
            showAlert(
              'Van Trip Settled Successfully!',
              res.message || 'Godown inventory restored and gate pass closed.',
              'success'
            );
            fetchSettlement();
          }
        } catch (err: any) {
          showAlert(
            'Settlement Error',
            err.message || 'Failed to settle van trip',
            'danger'
          );
        } finally {
          setIsSettling(false);
        }
      },
      'Confirm & Close Settlement',
      'Cancel',
      'warning'
    );
  };

  if (loading && !settlement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <RefreshCw className="w-7 h-7 text-[#005f56] animate-spin" />
        <span className="text-sm font-medium text-slate-500">
          Loading Live Van Settlement Data...
        </span>
      </div>
    );
  }

  if (!settlement) {
    return (
      <div className="text-center py-12 text-slate-500">
        No active van settlement found in database.
      </div>
    );
  }

  // Calculate live SKU variances and sums
  const totalLoadedPcs = settlement.items.reduce((acc, it) => acc + it.loaded, 0);
  const totalSoldPcs = settlement.items.reduce((acc, it) => acc + it.sold, 0);
  const totalGoodReturnPcs = settlement.items.reduce(
    (acc, it) => acc + it.goodReturn,
    0
  );
  const totalDamagePcs = settlement.items.reduce(
    (acc, it) => acc + it.damageIn,
    0
  );

  return (
    <div className="space-y-4">
      {/* Header bar matching senior ERP standards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="text-[13px] text-[#374151]">
          <span className="font-bold text-[#111827]">
            {settlement.vanNo} · {settlement.salesmanName} · Route {settlement.route}
          </span>{' '}
          · {settlement.settlementDate} · loaded {settlement.loadedTime} · returned{' '}
          {settlement.returnedTime}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
              settlement.status === 'Settled'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {settlement.status === 'Settled' ? '✓ Trip Settled' : '● Reconciliation Active'}
          </span>

          <button
            onClick={fetchSettlement}
            title="Refresh"
            className="p-1.5 bg-white border border-[#d1d5db] rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-[12px] font-medium bg-white hover:bg-slate-50 text-[#374151] border border-[#d1d5db] rounded-[6px] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>

          <button
            onClick={handleCloseSettlement}
            disabled={settlement.status === 'Settled' || isSettling}
            className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-[6px] transition-colors cursor-pointer flex items-center gap-1.5 ${
              settlement.status === 'Settled'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#005f56] hover:bg-[#004e46] text-white shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {settlement.status === 'Settled' ? 'Settled ✓' : 'Close Settlement'}
            </span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            Total Loaded Units
          </div>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {totalLoadedPcs} <span className="text-xs font-normal text-slate-500">Pcs</span>
          </div>
          <div className="text-[10.5px] text-slate-500 mt-0.5">
            Sold: <strong className="text-slate-800">{totalSoldPcs}</strong> · Good Ret:{' '}
            <strong className="text-emerald-700">{totalGoodReturnPcs}</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Total Billed Market Value
          </div>
          <div className="text-lg font-bold text-slate-900 mt-1">
            ₹{settlement.totalBilledValue.toLocaleString()}
          </div>
          <div className="text-[10.5px] text-slate-500 mt-0.5">
            Credit Sales: ₹{settlement.creditSales.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-indigo-600" />
            Total Mkt Collection
          </div>
          <div className="text-lg font-bold text-indigo-900 mt-1">
            ₹{(settlement.cashCollected + settlement.upiCollected + settlement.chequeCollected).toLocaleString()}
          </div>
          <div className="text-[10.5px] text-slate-500 mt-0.5">
            Cash: ₹{settlement.cashCollected.toLocaleString()} · UPI: ₹
            {settlement.upiCollected.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
            Short Cash Variance
          </div>
          <div className="text-lg font-bold text-[#c2410c] mt-1">
            −₹{Math.abs(settlement.cashVariance).toLocaleString()}
          </div>
          <div className="text-[10.5px] text-amber-700 font-medium mt-0.5">
            Salesman recovery voucher pending
          </div>
        </div>
      </div>

      {/* Stock Reconciliation Table */}
      <div className="erp-card overflow-hidden bg-white border border-slate-200 rounded-lg shadow-2xs">
        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[#005f56]" />
            Item-wise Stock Reconciliation (FIFO Batch Allocation)
          </div>
          <span className="text-[11px] text-slate-500">
            Formula: Expected = (Loaded − Sold − Free + Good Return)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="border-b border-[#e5e7eb] table-header bg-white text-[11px] uppercase text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">SKU Description</th>
                <th className="py-2.5 px-3 text-right">Loaded</th>
                <th className="py-2.5 px-3 text-right">Sold</th>
                <th className="py-2.5 px-3 text-right">Free (Scheme)</th>
                <th className="py-2.5 px-3 text-right">Good Return</th>
                <th className="py-2.5 px-3 text-right">Damage In</th>
                <th className="py-2.5 px-3 text-right">Expected Back</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-900">
                  Counted Back
                </th>
                <th className="py-2.5 px-3 text-center">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {settlement.items.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#111827]">
                    {item.sku}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#4b5563] font-mono">
                    {item.loaded}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-900 font-mono">
                    {item.sold}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#4b5563] font-mono">
                    {item.freeScheme || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold font-mono">
                    {item.goodReturn > 0 ? `+${item.goodReturn}` : '0'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-700 font-medium font-mono">
                    {item.damageIn > 0 ? `${item.damageIn}` : '0'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 font-mono font-medium">
                    {item.expectedBack}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#111827] font-mono">
                    {item.countedBack}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">
                    {item.variance === 0 ? (
                      <span className="text-[#15803d] font-bold">0</span>
                    ) : (
                      <span className="text-[#c2410c] font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {item.variance}
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {/* Empty crates row */}
              <tr className="bg-[#fafafa] border-t-2 border-slate-200">
                <td className="py-2.5 px-3 font-bold text-[#111827] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  Empty Beverage Crates (Returnable)
                </td>
                <td className="py-2.5 px-3 text-right text-[#4b5563] font-mono font-bold">
                  {settlement.cratesLoaded} out
                </td>
                <td colSpan={5} className="py-2.5 px-3 text-[#6b7280] text-[11px]">
                  Market issued: {settlement.cratesLoaded - settlement.cratesReturned} crates · Received back: {settlement.cratesReturned}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-[#111827] font-mono">
                  {settlement.cratesReturned}
                </td>
                <td className="py-2.5 px-3 text-center text-[#c27803] font-bold text-[11px] font-mono">
                  {Math.abs(settlement.cratesVariance)} with outlets
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 3-Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Card 1: Cash settlement */}
        <div className="lg:col-span-4 erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <h3 className="text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-[#005f56]" />
              Cash &amp; Digital Settlement
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Cashier Gate Pass</span>
          </div>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">Total Market Billed Value</span>
              <span className="text-[#111827] font-mono font-semibold">
                ₹{settlement.totalBilledValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">UPI Received (Auto-matched)</span>
              <span className="text-emerald-700 font-mono font-medium">
                ₹{settlement.upiCollected.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">Bank Cheques Handed Over</span>
              <span className="text-slate-800 font-mono font-medium">
                ₹{settlement.chequeCollected.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">Retailer Approved Credit Sales</span>
              <span className="text-slate-600 font-mono">
                ₹{settlement.creditSales.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-t border-[#f3f4f6] flex justify-between font-bold text-[#111827]">
              <span>Expected Cash to Deposit</span>
              <span className="font-mono">
                ₹{settlement.expectedCash.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 text-[#374151]">
              <span>Actual Cash Counted (Gate in)</span>
              <span className="text-[#111827] font-mono font-semibold">
                ₹{settlement.cashCollected.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-[#c2410c] bg-amber-50/70 p-2 rounded">
              <span>Short Cash Variance</span>
              <span className="font-mono">
                −₹{Math.abs(settlement.cashVariance).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Van sales features */}
        <div className="lg:col-span-4 erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <h3 className="text-[13px] font-bold text-[#111827] mb-2.5 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-blue-600" />
            Van Sales System Rules
          </h3>

          <ul className="space-y-2 text-[11px] text-[#374151]">
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>
                <strong>Mobile Warehouse:</strong> Van stock is isolated from main depot during transit.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>
                <strong>Instant GST Bill:</strong> Field team generates spot invoices with Dynamic UPI QR.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>
                <strong>Credit Gating:</strong> Credit bills only allowed if retailer outstanding is within ceiling.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>
                <strong>Damage Segregation:</strong> Market return packs verified at gate and moved to expiry bin.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>
                <strong>Packaging Return:</strong> Empty crates &amp; beverage glass jars tracked per outlet.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 3: Settlement controls */}
        <div className="lg:col-span-4 erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <h3 className="text-[13px] font-bold text-[#111827] mb-2.5 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            Settlement Audit Controls
          </h3>

          <ul className="space-y-2 text-[11px] text-[#374151]">
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>
                <strong>Gate Lock:</strong> Van cannot be reloaded for next day until previous trip is closed.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>
                <strong>Automated Recovery:</strong> Short cash variance (₹1,240) booked to salesman salary deduction ledger.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>
                <strong>Warehouse Return:</strong> Counted stocks automatically re-inwarded to main godown racks.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#6b7280]">•</span>
              <span>
                <strong>Cheque Clearance:</strong> Bounced cheques reverse the retailer credit receipt automatically.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
