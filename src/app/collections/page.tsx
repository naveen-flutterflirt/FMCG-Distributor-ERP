'use client';

import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  X,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building,
  Printer,
  Search,
  Filter,
  Info,
} from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import {
  collectionApi,
  CollectionReceipt,
  CollectionSummary,
  outletApi,
  Outlet,
} from '@/lib/api';

export default function CollectionsPage() {
  const { showAlert } = useCrm();

  const [receipts, setReceipts] = useState<CollectionReceipt[]>([]);
  const [summary, setSummary] = useState<CollectionSummary | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedRoute, setSelectedRoute] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Record Payment Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOutletId, setSelectedOutletId] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'Cash' | 'UPI' | 'Cheque' | 'NEFT'>('UPI');
  const [refNo, setRefNo] = useState('');
  const [bank, setBank] = useState('HDFC Bank');
  const [submitting, setSubmitting] = useState(false);

  // Active Tab: 'receipts' vs 'outstandings'
  const [activeTab, setActiveTab] = useState<'receipts' | 'outstandings'>('outstandings');

  // Fetch collections & outlets live from Neon DB
  const fetchData = async () => {
    try {
      setLoading(true);
      const [colRes, outRes] = await Promise.all([
        collectionApi.getAll({
          route: selectedRoute,
          status: selectedStatus,
          mode: selectedMode,
          search: searchQuery,
        }),
        outletApi.getAll(),
      ]);

      if (colRes.data) {
        setReceipts(colRes.data.receipts);
        setSummary(colRes.data.summary);
      }
      if (outRes.data) {
        setOutlets(outRes.data);
      }
    } catch (err: any) {
      console.error('Failed to load collections from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRoute, selectedStatus, selectedMode]);

  const handleOpenModal = (outlet?: Outlet) => {
    if (outlet) {
      setSelectedOutletId(outlet.id);
      setAmount(String(outlet.currentOutstanding));
    } else if (outlets.length > 0) {
      setSelectedOutletId(outlets[0].id);
      setAmount(String(outlets[0].currentOutstanding || 5000));
    }
    setModalOpen(true);
  };

  const handleRecordReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!selectedOutletId || isNaN(parsedAmount) || parsedAmount <= 0) {
      showAlert('Invalid Amount', 'Please enter a valid payment amount.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await collectionApi.recordPayment({
        outletId: selectedOutletId,
        amount: parsedAmount,
        paymentMode: mode,
        referenceNo: refNo || (mode === 'UPI' ? 'UPI/APP/DIRECT' : 'CSH-REC'),
        bankName: mode === 'Cash' ? '—' : bank,
        remarks: 'Direct market collection recorded',
      });

      if (res.success) {
        showAlert(
          'Payment Recorded Successfully!',
          res.message || 'Retailer outstanding reduced in database.',
          'success'
        );
        setModalOpen(false);
        setRefNo('');
        fetchData();
      }
    } catch (err: any) {
      showAlert('Payment Error', err.message || 'Failed to record payment', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedOutletObj = outlets.find((o) => o.id === selectedOutletId);
  const currentBal = selectedOutletObj?.currentOutstanding || 0;
  const projectedBal = Math.max(0, currentBal - (parseFloat(amount) || 0));

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#005f56]" />
            Credit Collections &amp; Market Recovery
          </h2>
          <p className="text-[11px] text-[#6b7280]">
            Aging buckets (0–7d, 8–15d, &gt;30d), live outstanding auto-deduction, and payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchData}
            title="Refresh"
            className="p-1.5 bg-white border border-[#d1d5db] rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>+ Record Payment</span>
          </button>
        </div>
      </div>

      {/* Top 4 Credit Metrics Boxes (with Info Hover Tooltips) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Box 1: Total Market Outstanding */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-[#6b7280] font-bold uppercase tracking-wider">
              Total Market Outstanding
            </div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Total Market Outstanding</span>
                <span>Cumulative unpaid credit balance pending recovery across all market retail outlets.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-[#111827] mt-1 font-mono">
            ₹{(summary?.totalMarketOutstanding || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Across {outlets.filter((o) => o.currentOutstanding > 0).length} Credit Outlets
          </div>
        </div>

        {/* Box 2: Critical Overdue */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
              Critical Overdue (&gt; 21 Days)
            </div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-rose-400 hover:text-rose-600 transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-rose-400">Critical Overdue (&gt;21 Days)</span>
                <span>Accounts overdue beyond 21 days. Automated billing freeze and credit hold enforced.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-rose-600 mt-1 font-mono">
            ₹{(summary?.agingOver30 || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-rose-700 font-medium mt-0.5">
            Credit Hold &amp; Freeze Active
          </div>
        </div>

        {/* Box 3: Collected Today */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
              Collected Today
            </div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-emerald-500 hover:text-emerald-700 transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-emerald-400">Collected Today</span>
                <span>Total live payments received today through Cash, UPI/QR, and Bank Cheque deposits.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-emerald-700 mt-1 font-mono">
            ₹{(summary?.totalCollectedToday || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {receipts.length} Direct Market Receipts
          </div>
        </div>

        {/* Box 4: Healthy Float */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
              Healthy Float (0–7 Days)
            </div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-blue-400 hover:text-blue-700 transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-blue-400">Healthy Credit Float</span>
                <span>Active credit balance within the standard 7-day FMCG distribution cycle.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-blue-900 mt-1 font-mono">
            ₹{(summary?.aging0to7 || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-blue-700 font-medium mt-0.5">
            Within Standard Credit Cycle
          </div>
        </div>
      </div>

      {/* Aging Analysis Matrix Strip (4 Aging Boxes with Info Tooltips) */}
      <div className="erp-card p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
        <h3 className="text-xs font-bold text-[#111827] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#005f56]" />
            Market Credit Aging Breakdown
          </span>
          <span className="text-[11px] font-normal text-slate-500">Live FIFO Calculation</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px]">
          {/* Box 5: Aging 0-7 Days */}
          <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-[6px] relative">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-semibold text-[10px] uppercase">
                Current (0–7 Days)
              </span>
              <div className="group relative cursor-help">
                <Info className="w-3 h-3 text-emerald-600 hover:text-emerald-800" />
                <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:flex flex-col w-52 p-2 bg-slate-900 text-white text-[10px] rounded-md shadow-xl z-50 pointer-events-none normal-case">
                  <span className="font-bold text-emerald-400">Current (0–7 Days)</span>
                  <span>Normal billing credit cycle. Orders dispatched with payment terms still valid.</span>
                </div>
              </div>
            </div>
            <span className="text-[15px] font-mono font-bold text-slate-900 block mt-0.5">
              ₹{(summary?.aging0to7 || 0).toLocaleString()}
            </span>
            <span className="text-emerald-700 block mt-0.5 text-[10px] font-medium">Regular Flow</span>
          </div>

          {/* Box 6: Aging 8-15 Days */}
          <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-[6px] relative">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-semibold text-[10px] uppercase">
                Follow-up (8–15 Days)
              </span>
              <div className="group relative cursor-help">
                <Info className="w-3 h-3 text-blue-600 hover:text-blue-800" />
                <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:flex flex-col w-52 p-2 bg-slate-900 text-white text-[10px] rounded-md shadow-xl z-50 pointer-events-none normal-case">
                  <span className="font-bold text-blue-400">Follow-up (8–15 Days)</span>
                  <span>Due date passed. Field salesman scheduled for payment collection on next beat visit.</span>
                </div>
              </div>
            </div>
            <span className="text-[15px] font-mono font-bold text-slate-900 block mt-0.5">
              ₹{(summary?.aging8to15 || 0).toLocaleString()}
            </span>
            <span className="text-blue-700 block mt-0.5 text-[10px]">Salesman Reminder</span>
          </div>

          {/* Box 7: Aging 16-30 Days */}
          <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-[6px] relative">
            <div className="flex items-center justify-between">
              <span className="text-amber-800 font-semibold text-[10px] uppercase">
                Warning (16–30 Days)
              </span>
              <div className="group relative cursor-help">
                <Info className="w-3 h-3 text-amber-600 hover:text-amber-800" />
                <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:flex flex-col w-56 p-2 bg-slate-900 text-white text-[10px] rounded-md shadow-xl z-50 pointer-events-none normal-case">
                  <span className="font-bold text-amber-400">Warning (16–30 Days)</span>
                  <span>High-risk zone. New order dispatch is held pending clearance of overdue bills.</span>
                </div>
              </div>
            </div>
            <span className="text-[15px] font-mono font-bold text-amber-900 block mt-0.5">
              ₹{(summary?.aging16to30 || 0).toLocaleString()}
            </span>
            <span className="text-amber-700 block mt-0.5 text-[10px]">Credit Threshold Exceeded</span>
          </div>

          {/* Box 8: Aging > 30 Days */}
          <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-[6px] relative">
            <div className="flex items-center justify-between">
              <span className="text-rose-800 font-semibold text-[10px] uppercase">
                Critical (&gt; 30 Days)
              </span>
              <div className="group relative cursor-help">
                <Info className="w-3 h-3 text-rose-600 hover:text-rose-800" />
                <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:flex flex-col w-56 p-2 bg-slate-900 text-white text-[10px] rounded-md shadow-xl z-50 pointer-events-none normal-case">
                  <span className="font-bold text-rose-400">Critical (&gt;30 Days)</span>
                  <span>Severe default risk. Complete billing freeze and direct agency recovery notice issued.</span>
                </div>
              </div>
            </div>
            <span className="text-[15px] font-mono font-bold text-rose-700 block mt-0.5">
              ₹{(summary?.agingOver30 || 0).toLocaleString()}
            </span>
            <span className="text-rose-700 block mt-0.5 text-[10px] font-bold">Billing Blocked</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('outstandings')}
          className={`pb-2 px-1 cursor-pointer transition-colors border-b-2 ${
            activeTab === 'outstandings'
              ? 'border-[#005f56] text-[#005f56]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Market Outstandings &amp; Overdue Accounts ({outlets.filter((o) => o.currentOutstanding > 0).length})
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`pb-2 px-1 cursor-pointer transition-colors border-b-2 ${
            activeTab === 'receipts'
              ? 'border-[#005f56] text-[#005f56]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Payment Receipts Ledger ({receipts.length})
        </button>
      </div>

      {/* TAB 1: Outstandings View */}
      {activeTab === 'outstandings' && (
        <div className="erp-card overflow-hidden bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Retailer Outlet</th>
                  <th className="py-2.5 px-3">Route / Beat</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3 text-right">Credit Limit</th>
                  <th className="py-2.5 px-3 text-right">Live Outstanding</th>
                  <th className="py-2.5 px-3 text-center">Overdue Days</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {outlets
                  .filter((o) => o.currentOutstanding > 0)
                  .map((outlet) => (
                    <tr key={outlet.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{outlet.name}</div>
                        <div className="text-[10px] text-slate-500">{outlet.ownerName} &middot; {outlet.id}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{outlet.route}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{outlet.phone}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        ₹{outlet.creditLimit.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                        ₹{outlet.currentOutstanding.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-mono">
                        {outlet.overdueDays} d
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {outlet.status === 'Credit Blocked' || outlet.overdueDays > 20 ? (
                          <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            Credit Blocked
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            Active Normal
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleOpenModal(outlet)}
                          className="px-2.5 py-1 bg-[#005f56] hover:bg-[#004e46] text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-2xs"
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
      )}

      {/* TAB 2: Receipts Ledger View */}
      {activeTab === 'receipts' && (
        <div className="erp-card overflow-hidden bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Outlet</th>
                  <th className="py-2.5 px-3">Salesman</th>
                  <th className="py-2.5 px-3 text-center">Mode</th>
                  <th className="py-2.5 px-3">Reference / Bank</th>
                  <th className="py-2.5 px-3 text-right">Amount Collected</th>
                  <th className="py-2.5 px-3 text-right">New Balance</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#005f56]">{rec.id}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{rec.outletName}</div>
                      <div className="text-[10px] text-slate-500">{rec.route}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{rec.salesmanName}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 bg-slate-100 font-mono text-[10.5px] rounded border border-slate-300 font-semibold text-slate-800">
                        {rec.paymentMode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      <div>{rec.referenceNo || '—'}</div>
                      <div className="text-[9.5px] text-slate-400">{rec.bankName}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                      ₹{rec.amountCollected.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                      ₹{rec.newOutstanding.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.status === 'Cleared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Receipt Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-[#00a693]" />
                  Record Market Payment Receipt
                </h3>
                <p className="text-[11px] text-slate-400">
                  Auto-deducts retailer credit and updates live ledger in database
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white rounded p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordReceipt} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Retailer Outlet
                </label>
                <select
                  value={selectedOutletId}
                  onChange={(e) => {
                    setSelectedOutletId(e.target.value);
                    const out = outlets.find((o) => o.id === e.target.value);
                    if (out) setAmount(String(out.currentOutstanding));
                  }}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                >
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} &middot; Due: ₹{o.currentOutstanding.toLocaleString()} ({o.route})
                    </option>
                  ))}
                </select>
              </div>

              {/* Outstanding vs Projected Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Current Outstanding</div>
                  <div className="text-sm font-mono font-bold text-rose-600 mt-0.5">
                    ₹{currentBal.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">New Balance After Pay</div>
                  <div className="text-sm font-mono font-bold text-emerald-700 mt-0.5">
                    ₹{projectedBal.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Amount Received (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min={1}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-mono font-bold text-slate-900 focus:outline-none focus:border-[#005f56]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56] cursor-pointer"
                  >
                    <option value="UPI">UPI (QR / BharatPe / GPay)</option>
                    <option value="Cash">Cash Handover</option>
                    <option value="Cheque">Bank PDC Cheque</option>
                    <option value="NEFT">Bank RTGS / NEFT</option>
                  </select>
                </div>
              </div>

              {mode !== 'Cash' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      UTR / Cheque No
                    </label>
                    <input
                      type="text"
                      value={refNo}
                      onChange={(e) => setRefNo(e.target.value)}
                      placeholder={mode === 'UPI' ? 'UPI/628100...' : 'CHQ-00124'}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-mono text-slate-900 focus:outline-none focus:border-[#005f56]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Bank Name
                    </label>
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold bg-[#005f56] hover:bg-[#004e46] text-white rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-md"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Receipt &amp; Deduct Due</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
