'use client';

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { mockOutlets } from '@/data/mockData';
import { useCrm } from '@/context/CrmContext';

export default function OutletsPage() {
  const { showAlert } = useCrm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('All');

  const filteredOutlets = mockOutlets.filter((outlet) => {
    const matchesSearch =
      outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outlet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outlet.phone.includes(searchTerm);
    const matchesRoute =
      selectedRoute === 'All' || outlet.route.includes(selectedRoute);
    return matchesSearch && matchesRoute;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Outlet &amp; Beat Master
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            3,180 active retail outlets mapped to 6 weekday salesman beats with geo-tagging, GSTIN verification, and credit limits.
          </p>
        </div>

        <button
          onClick={() =>
            showAlert(
              'Onboard Retail Outlet',
              'Outlet onboarding initiated. Enter GSTIN/PAN, shop geo-coordinates, beat day assignment, and credit ceiling.',
              'info'
            )
          }
          className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Onboard New Outlet</span>
        </button>
      </div>

      {/* Beats Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Total Mapped Outlets</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">3,180</div>
          <div className="text-[10px] text-[#059669] font-medium">98.4% Geo-tagged</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Active Beats</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">6 Routes</div>
          <div className="text-[10px] text-[#6b7280]">Avg 32 outlets / day</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Credit Approved</div>
          <div className="text-[18px] font-bold text-[#005f56] mt-0.5">1,842</div>
          <div className="text-[10px] text-[#6b7280]">Avg limit: ₹25,000</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Credit Blocked</div>
          <div className="text-[18px] font-bold text-[#dc2626] mt-0.5">48</div>
          <div className="text-[10px] text-[#dc2626] font-medium">&gt; 21 days overdue</div>
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
            placeholder="Search outlet by name, owner, or phone..."
            className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-white border border-[#d1d5db] rounded-[6px] text-[#111827] focus:outline-none focus:border-[#005f56]"
          />
        </div>
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-3 py-1.5 text-[#374151] focus:outline-none focus:border-[#005f56]"
        >
          <option value="All">All Routes ▾</option>
          <option value="Gandhi Nagar">R4 Gandhi Nagar</option>
          <option value="Station Rd">R2 Station Rd</option>
          <option value="Civil Lines">R1 Civil Lines</option>
          <option value="Old Market">R3 Old Market</option>
          <option value="MT route">MT route (Modern Trade)</option>
        </select>
      </div>

      {/* Outlets Table */}
      <div className="erp-card overflow-hidden">
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
              {filteredOutlets.map((outlet) => (
                <tr key={outlet.id} className="hover:bg-[#fafafa]">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-[#111827]">{outlet.name}</div>
                    <div className="text-[10px] text-[#6b7280]">Prop: {outlet.ownerName} · {outlet.address}</div>
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
                    <div className="text-[10px] text-[#6b7280]">{outlet.gstin}</div>
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
                      <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded text-[10px] font-bold">Active</span>
                    ) : (
                      <span className="bg-[#fee2e2] text-[#b91c1c] px-2 py-0.5 rounded text-[10px] font-bold">Credit Blocked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
