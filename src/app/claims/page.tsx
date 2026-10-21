'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
  Send,
  X,
  Building2,
  FileCheck,
  ShieldAlert,
  Percent,
  Info,
} from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { claimApi, Claim, ClaimsSummary } from '@/lib/api';

export default function ClaimsPage() {
  const { showAlert, selectedCompany: globalCompany, setSelectedCompany: setGlobalCompany } = useCrm();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [summary, setSummary] = useState<ClaimsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeClaimId, setActiveClaimId] = useState<string>('');

  // Filters - sync with global header company
  const [selectedCompany, setSelectedCompany] = useState<string>(globalCompany || 'All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    if (globalCompany) {
      setSelectedCompany(globalCompany);
    }
  }, [globalCompany]);

  // Modal: Raise New Claim
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('Company A');
  const [newType, setNewType] = useState('Scheme');
  const [newPeriod, setNewPeriod] = useState('Sep 2026');
  const [newAmount, setNewAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Modal: Resolve Query
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [queryResponseText, setQueryResponseText] = useState('');
  const [querySubmitting, setQuerySubmitting] = useState(false);

  // Fetch live claims from Neon DB
  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await claimApi.getAll({
        company: selectedCompany,
        status: selectedStatus,
        type: selectedType,
      });

      if (res.data) {
        setClaims(res.data.claims);
        setSummary(res.data.summary);
        if (res.data.claims.length > 0 && !activeClaimId) {
          setActiveClaimId(res.data.claims[0].id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load claims from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [selectedCompany, selectedStatus, selectedType]);

  const activeClaim = claims.find((c) => c.id === activeClaimId) || claims[0] || null;

  const handleRaiseClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newAmount);
    if (isNaN(amt) || amt <= 0) {
      showAlert('Invalid Amount', 'Please enter a valid claim amount.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await claimApi.raise({
        company: newCompany,
        claimType: newType,
        period: newPeriod,
        amount: amt,
      });

      if (res.success) {
        showAlert('Claim Filed!', res.message || 'Claim submitted to company.', 'success');
        setIsRaiseModalOpen(false);
        setNewAmount('');
        fetchClaims();
      }
    } catch (err: any) {
      showAlert('Claim Error', err.message || 'Failed to file claim', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClaim || !queryResponseText.trim()) return;

    try {
      setQuerySubmitting(true);
      const res = await claimApi.resolveQuery(activeClaim.id, queryResponseText);

      if (res.success) {
        showAlert('Query Resolved', res.message || 'Audit response submitted.', 'success');
        setIsQueryModalOpen(false);
        setQueryResponseText('');
        fetchClaims();
      }
    } catch (err: any) {
      showAlert('Error', err.message || 'Failed to submit response', 'danger');
    } finally {
      setQuerySubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#005f56]" />
            Company Claims &amp; Subsidy Recovery
          </h2>
          <p className="text-[11px] text-[#6b7280]">
            FMCG principal claims (Scheme, Damage, Visibility), Evidence Pack, and Credit Note reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
              setGlobalCompany(e.target.value as any);
            }}
            className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-2.5 py-1.5 font-medium text-[#374151] cursor-pointer focus:outline-none focus:border-[#005f56]"
          >
            <option value="All">Company: All ▾</option>
            <option value="Company A">Company A (HUL)</option>
            <option value="Company B">Company B (Parle)</option>
            <option value="Company C">Company C (Beverages)</option>
            <option value="Company D">Company D (ITC/HomeCare)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-2.5 py-1.5 font-medium text-[#374151] cursor-pointer focus:outline-none focus:border-[#005f56]"
          >
            <option value="All">Status: All ▾</option>
            <option value="Submitted">Submitted</option>
            <option value="Query raised">Query raised</option>
            <option value="Audit done">Audit done</option>
            <option value="Credit note recd.">Credit note recd.</option>
          </select>

          <button
            onClick={fetchClaims}
            title="Refresh"
            className="p-1.5 bg-white border border-[#d1d5db] rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsRaiseModalOpen(true)}
            className="px-3.5 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span> Raise New Claim</span>
          </button>
        </div>
      </div>

      {/* 5 Top KPI Cards with Info Hover Tooltips */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Box 1: Claims Raised YTD */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Claims Raised YTD</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Claims Raised YTD</span>
                <span>Total monetary value of trade schemes, damaged stock, and display subsidies filed this financial year.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">
            ₹{((summary?.totalRaisedYTD || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across FMCG Principal Companies</div>
        </div>

        {/* Box 2: Settled & Recovered */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">Settled &amp; Recovered</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-emerald-500 hover:text-emerald-700 transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-emerald-400">Settled &amp; Recovered</span>
                <span>Approved claims where Credit Notes (CN) have been issued by companies to offset purchase dues.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-emerald-700 mt-1 font-mono">
            ₹{((summary?.totalSettled || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            Credit Notes Received ✓
          </div>
        </div>

        {/* Box 3: Pending Audit */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-amber-600 uppercase font-bold tracking-wider">Pending Audit</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-amber-500 hover:text-amber-700 transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-amber-400">Pending Company Audit</span>
                <span>Claims currently under scrutiny by Area Sales Managers (ASM) and company audit officers.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-amber-700 mt-1 font-mono">
            ₹{((summary?.totalPending || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">Under Company Verification</div>
        </div>

        {/* Box 4: Recovery Efficiency */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-blue-700 uppercase font-bold tracking-wider">Recovery Efficiency</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-blue-400 hover:text-blue-700 transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-blue-400">Claim Recovery Efficiency</span>
                <span>Percentage of claimed money successfully approved without deductions. Industry benchmark is &gt;80%.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-blue-900 mt-1 font-mono">
            {summary?.recoveryRate || 0}%
          </div>
          <div className="text-[10px] text-blue-700 font-medium mt-0.5">Benchmark Target: &gt; 80%</div>
        </div>

        {/* Box 5: Disputed / Queries */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-rose-600 uppercase font-bold tracking-wider">Disputed / Queries</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-rose-400 hover:text-rose-600 transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-60 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-rose-400">Claims with Audit Queries</span>
                <span>Claims flagged by company auditors for invoice mismatches, requiring immediate reply before month-end.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-rose-600 mt-1 font-mono">
            ₹{(claims.filter(c => c.status === 'Query raised').reduce((acc, c) => acc + c.amount, 0) / 1000).toFixed(1)}K
          </div>
          <div className="text-[10px] text-rose-700 font-medium mt-0.5">Requires Audit Clarification</div>
        </div>
      </div>

      {/* Center Section: Claims register (Left) | Evidence pack (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Claims register */}
        <div className="lg:col-span-7 erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#005f56]" />
              Claims Register &amp; Status Ledger
            </h3>
            <span className="text-[11px] text-slate-500">Click row to view Evidence Pack</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-slate-50 text-slate-600 text-[10.5px] uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2.5">Claim ID</th>
                  <th className="py-2 px-2.5">Company</th>
                  <th className="py-2 px-2.5">Type</th>
                  <th className="py-2 px-2.5">Period</th>
                  <th className="py-2 px-2.5 text-right">Amount</th>
                  <th className="py-2 px-2.5 text-center">Age</th>
                  <th className="py-2 px-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr
                    key={claim.id}
                    onClick={() => setActiveClaimId(claim.id)}
                    className={`cursor-pointer transition-colors ${activeClaim?.id === claim.id ? 'bg-emerald-50/70 border-l-3 border-[#005f56]' : 'hover:bg-slate-50'
                      }`}
                  >
                    <td className="py-2.5 px-2.5 font-mono font-bold text-slate-900">{claim.id}</td>
                    <td className="py-2.5 px-2.5 font-medium text-slate-800">{claim.company}</td>
                    <td className="py-2.5 px-2.5 text-slate-600 text-[11px]">{claim.type}</td>
                    <td className="py-2.5 px-2.5 text-slate-500 font-mono text-[11px]">{claim.period}</td>
                    <td className="py-2.5 px-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{claim.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-mono text-slate-500 text-[11px]">
                      {claim.age} d
                    </td>
                    <td className="py-2.5 px-2.5 text-center">
                      {claim.status === 'Submitted' && (
                        <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          Submitted
                        </span>
                      )}
                      {claim.status === 'Query raised' && (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          Query raised
                        </span>
                      )}
                      {claim.status === 'Audit done' && (
                        <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          Audit done
                        </span>
                      )}
                      {claim.status === 'Credit note recd.' && (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          CN Recd ✓
                        </span>
                      )}
                      {claim.status === 'Overdue' && (
                        <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          Overdue
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Evidence pack, Active schemes, Reminder */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Evidence pack */}
          {activeClaim && (
            <div className="erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                <h3 className="text-[12.5px] font-bold text-[#111827] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#005f56]" />
                  Claim {activeClaim.id} Evidence Pack
                </h3>
                <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {activeClaim.company} &middot; ₹{activeClaim.amount.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 text-[11px] text-[#374151]">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span>Invoice-wise Free Goods proof</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Auto-Linked (DB)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span>Retailer Outlet List with GSTIN</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span>Company Scheme Circular</span>
                  <span className="text-[#005f56] font-semibold">Attached #Q3-26</span>
                </div>

                {activeClaim.creditNoteNo && (
                  <div className="flex justify-between items-center py-1.5 bg-emerald-50 p-2 rounded border border-emerald-200 text-emerald-800 font-mono">
                    <span>Credit Note Settled:</span>
                    <span className="font-bold">{activeClaim.creditNoteNo}</span>
                  </div>
                )}

                {/* Audit Query Alert & Action */}
                {activeClaim.status === 'Query raised' && (
                  <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                    <div className="flex items-start gap-1.5 text-amber-900 font-medium text-[11px]">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Company Query:</strong> {activeClaim.queryText}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setQueryResponseText(activeClaim.queryResponse || '');
                          setIsQueryModalOpen(true);
                        }}
                        className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] rounded shadow-xs cursor-pointer transition-colors"
                      >
                        Reply to Audit Query
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active schemes circular banner */}
          <div className="erp-card p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <h4 className="text-[12px] font-bold text-[#111827] mb-1 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-600" />
              Active Company Schemes · October FY27
            </h4>
            <p className="text-[11px] text-[#4b5563] leading-relaxed">
              <strong>Company A:</strong> QPS 2% on ₹5K+ &middot; <strong>Company B:</strong> biscuits 12+1 free &middot;{' '}
              <strong>Company C:</strong> cooler display ₹500/outlet &middot; <strong>Company D:</strong> combo detergent + bar
            </p>
          </div>

          {/* FMCG Deadline Alert Box */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-[11px] shadow-2xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-900 block">Critical FMCG Deadline Alert</span>
              <span className="text-rose-700">
                Company B claims strictly close 15 days after month-end. <strong>4 days left for September</strong> submission.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 4 FMCG Industry Best Practices Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <h4 className="text-[11.5px] font-bold text-slate-900 mb-1">Scheme Types Handled</h4>
          <p className="text-[10.5px] text-slate-600">
            Free goods (12+1), % cash off, QPS slab, combo deals, first-order bonus, and retailer class discounts.
          </p>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <h4 className="text-[11.5px] font-bold text-slate-900 mb-1">Funding Tagging</h4>
          <p className="text-[10.5px] text-slate-600">
            Company-funded (claimable via CN) vs Distributor-funded (own margin sacrifice) tracked per bill item.
          </p>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <h4 className="text-[11.5px] font-bold text-slate-900 mb-1">Budget Ceiling Control</h4>
          <p className="text-[10.5px] text-slate-600">
            Monthly promotional budget caps per company; billing auto-suspends scheme discounts once cap expires.
          </p>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <h4 className="text-[11.5px] font-bold text-slate-900 mb-1">Claim Categories</h4>
          <p className="text-[10.5px] text-slate-600">
            Trade scheme, transit damage &amp; expiry, price drops, refrigeration display, and salesman salary subsidy.
          </p>
        </div>
      </div>

      {/* Modal 1: Raise New Claim */}
      {isRaiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#00a693]" />
                Raise New Company Claim
              </h3>
              <button
                onClick={() => setIsRaiseModalOpen(false)}
                className="text-slate-400 hover:text-white rounded p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRaiseClaim} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Principal FMCG Company
                </label>
                <select
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                >
                  <option value="Company A">Company A (HUL)</option>
                  <option value="Company B">Company B (Parle)</option>
                  <option value="Company C">Company C (Beverages)</option>
                  <option value="Company D">Company D (ITC / HomeCare)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Claim Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                  >
                    <option value="Scheme">Trade Scheme</option>
                    <option value="Damage & Expiry">Damage &amp; Expiry</option>
                    <option value="Display">Cooler / Display</option>
                    <option value="Salary Support">Salesman Salary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                    placeholder="Sep 2026"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Claim Amount (₹)
                </label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="e.g. 24500"
                  required
                  min={1}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-mono font-bold text-slate-900 focus:outline-none focus:border-[#005f56]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRaiseModalOpen(false)}
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
                  <span>File Claim to Company</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Resolve Audit Query */}
      {isQueryModalOpen && activeClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-amber-900 text-white">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-300" />
                Resolve Audit Query · {activeClaim.id}
              </h3>
              <button
                onClick={() => setIsQueryModalOpen(false)}
                className="text-slate-300 hover:text-white rounded p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResolveQuerySubmit} className="p-5 space-y-3.5 text-xs">
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                <span className="font-bold block mb-1">Company Auditor Remark:</span>
                <p className="text-[11.5px]">{activeClaim.queryText}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Distributor Explanation &amp; Verification Reply
                </label>
                <textarea
                  rows={3}
                  value={queryResponseText}
                  onChange={(e) => setQueryResponseText(e.target.value)}
                  placeholder="Explain dispatch details and attach verified invoices..."
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsQueryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={querySubmitting}
                  className="px-4 py-2 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-md"
                >
                  {querySubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Audit Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
