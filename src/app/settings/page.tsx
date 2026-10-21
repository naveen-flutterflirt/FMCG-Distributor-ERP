'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Lock, RefreshCw, Check, Building2, Phone, Mail, MapPin, Database, Server } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { settingsApi, SettingsData } from '@/lib/api';

export default function SettingsPage() {
  const { showAlert } = useCrm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form Fields
  const [distributorName, setDistributorName] = useState('Shree Balaji FMCG Distributors');
  const [depotAddress, setDepotAddress] = useState('Depot #4, Transport Nagar, Station Road, Kanpur');
  const [contactPhone, setContactPhone] = useState('+91 98260 99887');
  const [contactEmail, setContactEmail] = useState('operations@balajidistributors.in');
  const [gstin, setGstin] = useState('09AAAFR0123M1ZV');
  const [fssai, setFssai] = useState('10023400192837');
  const [panNumber, setPanNumber] = useState('AAAFR0123M');
  const [threshold, setThreshold] = useState('50000');
  const [mandatoryVanSettle, setMandatoryVanSettle] = useState(true);
  const [creditCeilingEnforce, setCreditCeilingEnforce] = useState(true);
  const [periodLockMonth, setPeriodLockMonth] = useState('September 2026');
  const [connectors, setConnectors] = useState({
    compA: true,
    compB: true,
    compC: true,
    tally: true,
  });

  // Fetch live settings from backend Neon DB
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.get();
      if (res.data) {
        const d = res.data;
        setDistributorName(d.distributorName);
        setDepotAddress(d.depotAddress);
        setContactPhone(d.contactPhone);
        setContactEmail(d.contactEmail);
        setGstin(d.gstin);
        setFssai(d.fssaiLicence);
        setPanNumber(d.panNumber);
        setThreshold(String(d.ewayThreshold));
        setMandatoryVanSettle(d.mandatoryVanSettle);
        setCreditCeilingEnforce(d.creditCeilingEnforce);
        setPeriodLockMonth(d.periodLockMonth);
        if (d.connectors) {
          setConnectors(d.connectors);
        }
      }
    } catch (err: any) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Save changes permanently to Neon PostgreSQL
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const res = await settingsApi.update({
        distributorName,
        depotAddress,
        contactPhone,
        contactEmail,
        gstin,
        fssaiLicence: fssai,
        panNumber,
        ewayThreshold: parseFloat(threshold) || 50000,
        mandatoryVanSettle,
        creditCeilingEnforce,
        periodLockMonth,
        connectors,
      });

      if (res.success) {
        setSaved(true);
        showAlert('Settings Saved!', 'Distributor compliance and controls updated permanently in Neon DB.', 'success');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err: any) {
      showAlert('Save Error', err.message || 'Failed to save settings', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const toggleConnector = (key: keyof typeof connectors) => {
    setConnectors((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#005f56]" />
            Agency Settings, Compliance &amp; Operational Controls
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Permanent distributor profile, GSTIN/FSSAI compliance, security guardrails &amp; cloud DB state.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSettings}
            title="Reload settings from DB"
            className="p-1.5 bg-white border border-[#d1d5db] rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="submit"
            disabled={saving}
            className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50 ${saved
                ? 'bg-[#15803d] text-white'
                : 'bg-[#005f56] hover:bg-[#004e46] text-white'
              }`}
          >
            {saved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : saved ? 'Saved in Neon DB!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Column 1: Distributor Legal & Tax Profile */}
        <div className="erp-card p-4 space-y-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center gap-1.5 pb-2 border-b border-[#f3f4f6]">
            <Building2 className="w-4 h-4 text-[#005f56]" />
            <h3 className="text-[13px] font-bold text-[#111827]">Distributor Profile &amp; GSTIN</h3>
          </div>

          <div className="space-y-2.5 text-[11px] text-[#374151]">
            <div>
              <label className="block font-medium text-[#111827] mb-1">Agency Business Name</label>
              <input
                type="text"
                value={distributorName}
                onChange={(e) => setDistributorName(e.target.value)}
                required
                className="w-full p-2 border border-[#d1d5db] rounded-[6px] bg-white text-[12px] font-medium focus:outline-none focus:border-[#005f56]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#111827] mb-1">Depot / Warehouse Address</label>
              <textarea
                rows={2}
                value={depotAddress}
                onChange={(e) => setDepotAddress(e.target.value)}
                required
                className="w-full p-2 border border-[#d1d5db] rounded-[6px] bg-white text-[11px] focus:outline-none focus:border-[#005f56]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-[#111827] mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-1.5 border border-[#d1d5db] rounded-[6px] font-mono text-[11px] focus:outline-none focus:border-[#005f56]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#111827] mb-1">PAN Number</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full p-1.5 border border-[#d1d5db] rounded-[6px] font-mono text-[11px] uppercase focus:outline-none focus:border-[#005f56]"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-[#111827] mb-1">Distributor GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                required
                className="w-full p-2 border border-[#d1d5db] rounded-[6px] font-mono bg-white text-[12px] uppercase focus:outline-none focus:border-[#005f56]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#111827] mb-1">FSSAI Licence No. (Mandatory for Food)</label>
              <input
                type="text"
                value={fssai}
                onChange={(e) => setFssai(e.target.value)}
                required
                className="w-full p-2 border border-[#d1d5db] rounded-[6px] font-mono bg-white text-[12px] focus:outline-none focus:border-[#005f56]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#111827] mb-1">e-Way Bill Mandatory Threshold (₹)</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                required
                className="w-full p-2 border border-[#d1d5db] rounded-[6px] bg-white text-[12px] font-mono focus:outline-none focus:border-[#005f56]"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Operational Guardrails & Controls */}
        <div className="erp-card p-4 space-y-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center gap-1.5 pb-2 border-b border-[#f3f4f6]">
            <Lock className="w-4 h-4 text-[#dc2626]" />
            <h3 className="text-[13px] font-bold text-[#111827]">Financial Controls &amp; Guardrails</h3>
          </div>

          <div className="space-y-2 text-[11px] text-[#374151]">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start justify-between gap-2">
              <div>
                <span className="font-bold block text-[#111827]">Mandatory Van Settlement</span>
                <span className="text-[10px] text-[#6b7280]">
                  Salesman van cannot be loaded for next beat until previous day cash and crates are balanced.
                </span>
              </div>
              <input
                type="checkbox"
                checked={mandatoryVanSettle}
                onChange={(e) => setMandatoryVanSettle(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#005f56] cursor-pointer"
              />
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start justify-between gap-2">
              <div>
                <span className="font-bold block text-[#111827]">Credit Ceiling Enforcer</span>
                <span className="text-[10px] text-[#6b7280]">
                  Block retail orders automatically if outlet overdue &gt;21 days or exceeds sanctioned credit limit.
                </span>
              </div>
              <input
                type="checkbox"
                checked={creditCeilingEnforce}
                onChange={(e) => setCreditCeilingEnforce(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#005f56] cursor-pointer"
              />
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold block text-[#111827]">Segregation of Duties (RBAC)</span>
              <span className="text-[10px] text-[#6b7280]">
                Billing clerk cannot issue credit notes; salesmen restricted to designated beats only.
              </span>
              <span className="inline-block mt-1 text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Enforced by System
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <label className="font-bold block text-[#111827] mb-1">Accounting Period Lock</label>
              <select
                value={periodLockMonth}
                onChange={(e) => setPeriodLockMonth(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-[11px] outline-none focus:border-[#005f56]"
              >
                <option value="September 2026">September 2026 (Locked)</option>
                <option value="August 2026">August 2026 (Locked)</option>
                <option value="October 2026">October 2026 (Open)</option>
              </select>
              <span className="text-[10px] text-[#6b7280] block mt-1">
                Prevents backdated voucher manipulation after CA month-close audit.
              </span>
            </div>
          </div>
        </div>

        {/* Column 3: Principal Connectors & Database State */}
        <div className="erp-card p-4 space-y-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center gap-1.5 pb-2 border-b border-[#f3f4f6]">
            <RefreshCw className="w-4 h-4 text-[#005f56]" />
            <h3 className="text-[13px] font-bold text-[#111827]">Principal DMS Connectors</h3>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <div>
                <span className="font-semibold block text-[#111827]">Company A DMS / SFA</span>
                <span className="text-[10px] text-[#6b7280]">Personal care secondary sales auto-sync</span>
              </div>
              <button
                type="button"
                onClick={() => toggleConnector('compA')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${connectors.compA ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                  }`}
              >
                {connectors.compA ? 'Active' : 'Paused'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <div>
                <span className="font-semibold block text-[#111827]">Company B Foods Portal</span>
                <span className="text-[10px] text-[#6b7280]">Primary PO &amp; e-Invoice webhook</span>
              </div>
              <button
                type="button"
                onClick={() => toggleConnector('compB')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${connectors.compB ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                  }`}
              >
                {connectors.compB ? 'Active' : 'Paused'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <div>
                <span className="font-semibold block text-[#111827]">Company C Beverages EDI</span>
                <span className="text-[10px] text-[#6b7280]">EDIFACT dispatch advice</span>
              </div>
              <button
                type="button"
                onClick={() => toggleConnector('compC')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${connectors.compC ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                  }`}
              >
                {connectors.compC ? 'Active' : 'Paused'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <div>
                <span className="font-semibold block text-[#111827]">Tally Prime XML Gateway</span>
                <span className="text-[10px] text-[#6b7280]">CA Audit XML sync endpoint</span>
              </div>
              <button
                type="button"
                onClick={() => toggleConnector('tally')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${connectors.tally ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                  }`}
              >
                {connectors.tally ? 'Ready' : 'Disabled'}
              </button>
            </div>


          </div>
        </div>
      </div>
    </form>
  );
}
