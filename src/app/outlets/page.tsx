'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Store, RefreshCw, Loader2 } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { outletApi, Outlet } from '@/lib/api';
import { AddOutletModal } from '@/components/modals/AddOutletModal';

export default function OutletsPage() {
  const { showAlert, globalSearch } = useCrm();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with global header search if provided
  useEffect(() => {
    if (globalSearch !== searchTerm) {
      setSearchTerm(globalSearch);
    }
  }, [globalSearch]);

  // Fetch outlets live from Neon DB
  const fetchOutlets = async () => {
    try {
      setLoading(true);
      const res = await outletApi.getAll({
        route: selectedRoute,
        search: searchTerm,
      });
      if (res.data) {
        setOutlets(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load outlets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, [selectedRoute]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOutlets();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleOutletCreated = (newOutlet: Outlet) => {
    setOutlets((prev) => [newOutlet, ...prev]);
    showAlert(
      'Retail Outlet Onboarded!',
      `${newOutlet.name} (${newOutlet.id}) added to ${newOutlet.route} with credit limit ₹${newOutlet.creditLimit.toLocaleString()}.`,
      'success'
    );
  };

  // Calculations for KPI Cards
  const totalOutlets = outlets.length;
  const activeCount = outlets.filter((o) => o.status === 'Active').length;
  const blockedCount = outlets.filter((o) => o.status === 'Credit Blocked').length;
  const totalOutstanding = outlets.reduce((acc, o) => acc + (o.currentOutstanding || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Outlet &amp; Beat Master
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Live retail outlets mapped to salesman beats with GSTIN verification and authorized credit ceilings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Onboard New Outlet</span>
          </button>
        </div>
      </div>

      {/* Beats Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Total Mapped Outlets</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">{totalOutlets} Shops</div>
          <div className="text-[10px] text-[#059669] font-medium">100% Synced with Neon DB</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Credit Approved (Active)</div>
          <div className="text-[18px] font-bold text-[#005f56] mt-0.5">{activeCount}</div>
          <div className="text-[10px] text-[#6b7280]">Authorized for daily billing</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Credit Blocked</div>
          <div className="text-[18px] font-bold text-[#dc2626] mt-0.5">{blockedCount}</div>
          <div className="text-[10px] text-[#dc2626] font-medium">Overdue &gt; credit ceiling</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Total Market Dues</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">₹{totalOutstanding.toLocaleString()}</div>
          <div className="text-[10px] text-[#6b7280]">Live receivables outstanding</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search outlet by shop name, proprietor, phone, or GSTIN..."
            className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-white border border-[#d1d5db] rounded-[6px] text-[#111827] focus:outline-none focus:border-[#005f56]"
          />
        </div>

        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-3 py-1.5 text-[#374151] focus:outline-none focus:border-[#005f56] cursor-pointer"
        >
          <option value="All">All Routes ▾</option>
          <option value="Gandhi Nagar">R4 Gandhi Nagar</option>
          <option value="Station Rd">R2 Station Rd</option>
          <option value="Civil Lines">R1 Civil Lines</option>
          <option value="Old Market">R3 Old Market</option>
          <option value="MT route">MT route (Modern Trade)</option>
        </select>

        <button
          onClick={fetchOutlets}
          title="Refresh Outlets"
          className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer flex items-center justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Outlets Table */}
      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#005f56] mb-2" />
            <span className="text-xs">Fetching retail outlets...</span>
          </div>
        ) : outlets.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No retail outlets found matching the criteria. Click &quot;+ Onboard New Outlet&quot; to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-white table-header border-b border-[#e5e7eb]">
                <tr>
                  <th className="py-2.5 px-3">Outlet Code &amp; Name</th>
                  <th className="py-2.5 px-3">Category / Class</th>
                  <th className="py-2.5 px-3">Route &amp; Beat</th>
                  <th className="py-2.5 px-3">Contact &amp; GSTIN</th>
                  <th className="py-2.5 px-3 text-right">Credit Limit</th>
                  <th className="py-2.5 px-3 text-right">Outstanding</th>
                  <th className="py-2.5 px-3 text-center">Overdue</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {outlets.map((outlet) => (
                  <tr key={outlet.id} className="hover:bg-[#fafafa]">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                          {outlet.id}
                        </span>
                        <span className="font-semibold text-[#111827]">{outlet.name}</span>
                      </div>
                      <div className="text-[10px] text-[#6b7280] mt-0.5">
                        Prop: {outlet.ownerName} · {outlet.address}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-[#374151] block">{outlet.category}</span>
                      <span className="text-[10px] font-semibold text-[#005f56] bg-[#f0fdf4] px-1.5 py-0.2 rounded">
                        Class {outlet.outletClass}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-[#4b5563] block">{outlet.route}</span>
                      <span className="text-[10px] text-[#9ca3af]">{outlet.beatId}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-[#111827] font-mono text-[11px]">{outlet.phone}</div>
                      <div className="text-[10px] text-[#6b7280]">{outlet.gstin || 'Unregistered'}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#374151]">
                      ₹{outlet.creditLimit.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#111827]">
                      ₹{outlet.currentOutstanding.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {outlet.overdueDays > 0 ? (
                        <span className="text-[#dc2626] font-bold">{outlet.overdueDays} d</span>
                      ) : (
                        <span className="text-[#059669] font-bold">0 d</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {outlet.status === 'Active' ? (
                        <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded text-[10px] font-bold">
                          Active
                        </span>
                      ) : (
                        <span className="bg-[#fee2e2] text-[#b91c1c] px-2 py-0.5 rounded text-[10px] font-bold">
                          Credit Blocked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Outlet Modal */}
      <AddOutletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleOutletCreated}
      />
    </div>
  );
}
