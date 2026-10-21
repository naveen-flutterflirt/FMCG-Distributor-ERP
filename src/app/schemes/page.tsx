'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  ArrowRight,
  Percent,
  RefreshCw,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  PieChart,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { schemeApi, Scheme, SchemesSummary } from '@/lib/api';

export default function SchemesPage() {
  const { showAlert } = useCrm();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [summary, setSummary] = useState<SchemesSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Modal State: Configure Scheme
  const [modalOpen, setModalOpen] = useState(false);
  const [company, setCompany] = useState('Company A');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Quantity Purchase Scheme');
  const [rule, setRule] = useState('');
  const [fundedBy, setFundedBy] = useState('Company-funded (Claimable)');
  const [budget, setBudget] = useState('');
  const [validFrom, setValidFrom] = useState('01 Oct 2026');
  const [validTo, setValidTo] = useState('31 Oct 2026');
  const [outletFilter, setOutletFilter] = useState('All Classes (A, B, C)');
  const [submitting, setSubmitting] = useState(false);

  // Fetch live schemes from Neon DB
  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const res = await schemeApi.getAll({
        company: selectedCompany,
        status: selectedStatus,
        type: selectedType,
      });

      if (res.data) {
        setSchemes(res.data.schemes);
        setSummary(res.data.summary);
      }
    } catch (err: any) {
      console.error('Failed to load schemes from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedCompany, selectedStatus, selectedType]);

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericBudget = parseFloat(budget);
    if (!title || !rule || isNaN(numericBudget) || numericBudget <= 0) {
      showAlert('Validation Error', 'Title, Rule, and valid positive Budget are required.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await schemeApi.create({
        company,
        title,
        type,
        rule,
        fundedBy,
        budget: numericBudget,
        validFrom,
        validTo,
        outletFilter,
      });

      if (res.success) {
        showAlert('Scheme Configured!', res.message || 'Trade scheme live in database.', 'success');
        setModalOpen(false);
        setTitle('');
        setRule('');
        setBudget('');
        fetchSchemes();
      }
    } catch (err: any) {
      showAlert('Error', err.message || 'Failed to configure scheme', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#005f56]" />
            Trade Scheme Engine &amp; Budget Control
          </h2>
          <p className="text-[11px] text-[#6b7280]">
            Live promotional slabs (QPS, 12+1 Free, Display) and real-time company budget enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
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
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Expired">Expired</option>
          </select>

          <button
            onClick={fetchSchemes}
            title="Refresh"
            className="p-1.5 bg-white border border-[#d1d5db] rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/claims"
            className="px-3 py-1.5 text-[12px] font-medium bg-white border border-[#d1d5db] rounded-[6px] hover:bg-slate-50 text-[#374151] flex items-center gap-1.5 transition-colors"
          >
            <span>Claims Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Configure Scheme</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Total Sanctioned Budget
          </div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">
            ₹{((summary?.totalBudget || 1180000) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Across {summary?.activeCount || schemes.length} Active Schemes
          </div>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
            Budget Utilized (Orders)
          </div>
          <div className="text-xl font-black text-emerald-700 mt-1 font-mono">
            ₹{((summary?.totalUtilized || 807000) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            Discounts Applied to Retailers
          </div>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
            Burn Rate Efficiency
          </div>
          <div className="text-xl font-black text-blue-900 mt-1 font-mono">
            {summary?.overallUtilizationPercent || 68}%
          </div>
          <div className="text-[10px] text-blue-700 font-medium mt-0.5">
            Pacing Within Monthly Quota
          </div>
        </div>

        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
            Remaining Scheme Pool
          </div>
          <div className="text-xl font-black text-amber-900 mt-1 font-mono">
            ₹{(((summary?.totalBudget || 1180000) - (summary?.totalUtilized || 807000)) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">
            Available for Billing
          </div>
        </div>
      </div>

      {/* Live Active Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2.5 relative"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#005f56] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {scheme.company} &middot; {scheme.type}
                </span>
                <h3 className="text-[14px] font-bold text-[#111827] mt-1.5">
                  {scheme.title}
                </h3>
              </div>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                {scheme.status}
              </span>
            </div>

            <p className="text-[11px] text-[#4b5563] bg-slate-50 p-2.5 rounded-[6px] border border-slate-200 leading-relaxed">
              {scheme.rule}
            </p>

            {/* Scheme Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px]">
                <span className="text-slate-500">Budget Utilization:</span>
                <span className="font-bold font-mono text-slate-800">
                  ₹{scheme.utilized.toLocaleString()} / ₹{scheme.budget.toLocaleString()} ({scheme.utilizationPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full transition-all ${
                    scheme.utilizationPercent > 80 ? 'bg-amber-500' : 'bg-[#005f56]'
                  }`}
                  style={{ width: `${Math.min(100, scheme.utilizationPercent)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Funded By:</span>
                <span className="font-semibold text-slate-900">{scheme.fundedBy}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Outlet Eligibility:</span>
                <span className="font-semibold text-slate-900">{scheme.outletFilter}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3 text-slate-400" />
                {scheme.validFrom} – {scheme.validTo}
              </span>
              <span className="text-[#005f56] font-semibold font-mono">
                Code: {scheme.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Configure Scheme Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#00a693]" />
                Configure New Trade Scheme
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white rounded p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScheme} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Principal FMCG Company
                  </label>
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                  >
                    <option value="Company A">Company A (HUL)</option>
                    <option value="Company B">Company B (Parle)</option>
                    <option value="Company C">Company C (Beverages)</option>
                    <option value="Company D">Company D (ITC / HomeCare)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Scheme Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                  >
                    <option value="Quantity Purchase Scheme">Quantity Purchase Scheme (QPS)</option>
                    <option value="Free Goods">Free Goods (12+1 Free)</option>
                    <option value="Display / Visibility">Display / Visibility</option>
                    <option value="Combo Bundle">Combo Bundle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Scheme Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Diwali Dhamaka 5% Turnover Incentive"
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Rule Description &amp; Slab Logic
                </label>
                <textarea
                  rows={2}
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  placeholder="e.g. Buy 10 cases get 1 case free or 2% invoice discount..."
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Sanctioned Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 500000"
                    required
                    min={1}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white font-mono font-bold text-slate-900 focus:outline-none focus:border-[#005f56]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Who Funds It
                  </label>
                  <select
                    value={fundedBy}
                    onChange={(e) => setFundedBy(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                  >
                    <option value="Company-funded (Claimable)">Company-funded (Claimable)</option>
                    <option value="Distributor-funded (Shared Margin)">Distributor-funded (Shared Margin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Valid From
                  </label>
                  <input
                    type="text"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Valid Till
                  </label>
                  <input
                    type="text"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-none focus:border-[#005f56]"
                  />
                </div>
              </div>

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
                  <span>Save Trade Scheme</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
