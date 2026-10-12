'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { FMCGCompany } from '@/types/crm';

export function Header() {
  const {
    selectedCompany,
    setSelectedCompany,
    globalSearch,
    setGlobalSearch,
    setIsNewOrderModalOpen,
    notification,
  } = useCrm();

  const companies: FMCGCompany[] = [
    'All',
    'Company A',
    'Company B',
    'Company C',
    'Company D',
  ];

  return (
    <header className="bg-transparent pt-3 lg:pt-4 px-4 lg:px-6 pb-2">
      {/* Toast Notification if active */}
      {notification && (
        <div className="mb-3 bg-[#005f56] text-white text-xs font-medium px-4 py-2 rounded-md flex items-center justify-between shadow-xs">
          <span>{notification}</span>
          <span className="text-[10px] opacity-80">Core ERP Synced</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-12 lg:pl-0">
        {/* Left greeting & subtext */}
        <div>
          <h1 className="text-[17px] lg:text-[18px] font-bold text-[#111827] tracking-tight">
            Good morning, Mr. Agarwal
          </h1>
          <p className="text-[11px] lg:text-[12px] text-[#6b7280] mt-0.5">
            Friday, 9 Oct · All companies · Month to date
          </p>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Reactive Global Search box */}
          <div className="w-full sm:w-56 md:w-64">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search outlet, SKU, invoice..."
              className="w-full px-3 py-1.5 text-[12px] bg-white border border-[#d1d5db] rounded-[6px] placeholder-[#9ca3af] text-[#111827] focus:outline-none focus:border-[#005f56]"
            />
          </div>

          {/* Company dropdown */}
          <div className="relative">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value as FMCGCompany)}
              className="appearance-none bg-white border border-[#d1d5db] rounded-[6px] pl-3 pr-6 py-1.5 text-[12px] font-medium text-[#374151] cursor-pointer focus:outline-none focus:border-[#005f56]"
            >
              {companies.map((comp) => (
                <option key={comp} value={comp}>
                  Company: {comp} ▾
                </option>
              ))}
            </select>
          </div>

          {/* New order button */}
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New order</span>
          </button>
        </div>
      </div>
    </header>
  );
}
