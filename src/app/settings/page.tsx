'use client';

import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, RefreshCw, Check } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';

export default function SettingsPage() {
  const { setNotification } = useCrm();
  const [saved, setSaved] = useState(false);
  const [gstin, setGstin] = useState('09AAAFR0123M1ZV');
  const [fssai, setFssai] = useState('10023400192837');
  const [threshold, setThreshold] = useState('₹50,000');
  const [connectors, setConnectors] = useState({
    compA: true,
    compB: true,
    compC: true,
    tally: true,
  });

  const handleSave = () => {
    setSaved(true);
    setNotification('Compliance settings & tax configuration saved successfully.');
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleConnector = (key: keyof typeof connectors) => {
    setConnectors((prev) => ({ ...prev, [key]: !prev[key] }));
    setNotification('Connector status updated.');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Compliance, Security &amp; Controls
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Clean books, clean tax, no cash leakage (Page 15 &amp; 16 Blueprint).
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`px-3 py-1.5 text-[12px] font-semibold rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer ${
            saved
              ? 'bg-[#15803d] text-white'
              : 'bg-[#005f56] hover:bg-[#004e46] text-white'
          }`}
        >
          {saved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Tax & Statutory */}
        <div className="erp-card p-4 space-y-3">
          <div className="flex items-center gap-1.5 pb-2 border-b border-[#f3f4f6]">
            <FileText className="w-4 h-4 text-[#005f56]" />
            <h3 className="text-[13px] font-bold text-[#111827]">Tax &amp; Statutory</h3>
          </div>

          <div className="space-y-2.5 text-[11px] text-[#374151]">
            <div>
              <label className="block font-medium text-[#111827] mb-1">Distributor GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full p-2 border border-[#d1d5db] rounded-[6px] font-mono bg-white text-[12px] focus:outline-none focus:border-[#005f56]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#111827] mb-1">FSSAI Licence No.</label>
              <input
                type="text"
                value={fssai}
                onChange={(e) => setFssai(e.target.value)}
                className="w-full p-2 border border-[#d1d5db] rounded-[6px] font-mono bg-white text-[12px] focus:outline-none focus:border-[#005f56]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#111827] mb-1">e-Invoice Portal (NIC/IRP API)</label>
              <span className="inline-block text-[10px] bg-[#dcfce7] text-[#15803d] font-bold px-2 py-0.5 rounded">
                GSP Active · Auto-IRN Enabled
              </span>
            </div>
            <div>
              <label className="block font-medium text-[#111827] mb-1">e-Way Bill Threshold</label>
              <input
                type="text"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full p-2 border border-[#d1d5db] rounded-[6px] bg-white text-[12px] focus:outline-none focus:border-[#005f56]"
              />
            </div>
          </div>
        </div>

        {/* Financial Controls */}
        <div className="erp-card p-4 space-y-3">
          <div className="flex items-center gap-1.5 pb-2 border-b border-[#f3f4f6]">
            <Lock className="w-4 h-4 text-[#dc2626]" />
            <h3 className="text-[13px] font-bold text-[#111827]">Financial Controls</h3>
          </div>

          <div className="space-y-2 text-[11px] text-[#374151]">
            <div className="p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <span className="font-bold block text-[#111827]">Segregation of Duties</span>
              <span className="text-[10px] text-[#6b7280]">
                Billing, Cash Receipt, Credit Override and Accounts are strictly separate roles.
              </span>
            </div>

            <div className="p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <span className="font-bold block text-[#111827]">Credit Ceiling Enforcer</span>
              <span className="text-[10px] text-[#6b7280]">
                Orders beyond limit or &gt;21 days overdue require owner MFA authorization.
              </span>
            </div>

            <div className="p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <span className="font-bold block text-[#111827]">Mandatory Van Settle</span>
              <span className="text-[10px] text-[#6b7280]">
                Van cannot be loaded again until previous day stock and cash are closed.
              </span>
            </div>

            <div className="p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <span className="font-bold block text-[#111827]">Period Lock</span>
              <span className="text-[10px] text-[#6b7280]">
                September 2026 books locked against tampering or backdated entry.
              </span>
            </div>
          </div>
        </div>

        {/* Integration Hub */}
        <div className="erp-card p-4 space-y-3">
          <div className="flex items-center gap-1.5 pb-2 border-b border-[#f3f4f6]">
            <RefreshCw className="w-4 h-4 text-[#005f56]" />
            <h3 className="text-[13px] font-bold text-[#111827]">Principal DMS Connectors</h3>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <div>
                <span className="font-semibold block text-[#111827]">Company A DMS / SFA</span>
                <span className="text-[10px] text-[#6b7280]">Secondary sales sync: 09:15 AM</span>
              </div>
              <button
                onClick={() => toggleConnector('compA')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  connectors.compA ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                }`}
              >
                {connectors.compA ? 'Active' : 'Paused'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <div>
                <span className="font-semibold block text-[#111827]">Company B Portal</span>
                <span className="text-[10px] text-[#6b7280]">Primary PO &amp; invoices</span>
              </div>
              <button
                onClick={() => toggleConnector('compB')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  connectors.compB ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                }`}
              >
                {connectors.compB ? 'Active' : 'Paused'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <div>
                <span className="font-semibold block text-[#111827]">Company C DMS</span>
                <span className="text-[10px] text-[#6b7280]">EDI Adapter</span>
              </div>
              <button
                onClick={() => toggleConnector('compC')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  connectors.compC ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                }`}
              >
                {connectors.compC ? 'Active' : 'Paused'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2 bg-[#f9fafb] rounded border border-[#f3f4f6]">
              <div>
                <span className="font-semibold block text-[#111827]">Tally XML Export Gateway</span>
                <span className="text-[10px] text-[#6b7280]">CA Audit export ready</span>
              </div>
              <button
                onClick={() => toggleConnector('tally')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  connectors.tally ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                }`}
              >
                {connectors.tally ? 'Ready' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
