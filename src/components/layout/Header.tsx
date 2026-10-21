import React, { useState, useEffect, useRef } from 'react';
import { Plus, LogOut, Search, Store, Package, FileText, User, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCrm } from '@/context/CrmContext';
import { useAuth } from '@/context/AuthContext';
import { FMCGCompany } from '@/types/crm';
import { searchApi, GlobalSearchResult } from '@/lib/api';

export function Header() {
  const router = useRouter();
  const {
    selectedCompany,
    setSelectedCompany,
    globalSearch,
    setGlobalSearch,
    setIsNewOrderModalOpen,
    notification,
  } = useCrm();
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced live search querying PostgreSQL
  useEffect(() => {
    if (!globalSearch.trim() || globalSearch.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchApi.search(globalSearch.trim());
        if (res.data) {
          setResults(res.data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [globalSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalResults = results
    ? (results.outlets?.length || 0) +
      (results.products?.length || 0) +
      (results.orders?.length || 0) +
      (results.salesmen?.length || 0)
    : 0;

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
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name || 'Distributor Admin'}
          </h1>
          <p className="text-[11px] lg:text-[12px] text-[#6b7280] mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} · {selectedCompany === 'All' ? 'All companies' : selectedCompany} · Month to date
          </p>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Reactive Global Search box with Autocomplete Dropdown */}
          <div ref={searchRef} className="relative w-full sm:w-64 md:w-80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={globalSearch}
                onFocus={() => {
                  if (results && totalResults > 0) setIsOpen(true);
                }}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search outlet, SKU, order, salesman..."
                className="w-full pl-8 pr-7 py-1.5 text-[12px] bg-white border border-[#d1d5db] rounded-[6px] placeholder-[#9ca3af] text-[#111827] focus:outline-none focus:border-[#005f56] focus:ring-1 focus:ring-[#005f56]"
              />
              {loading && (
                <Loader2 className="w-3.5 h-3.5 text-[#005f56] animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
              )}
              {globalSearch && !loading && (
                <button
                  onClick={() => {
                    setGlobalSearch('');
                    setResults(null);
                    setIsOpen(false);
                  }}
                  className="text-slate-400 hover:text-slate-700 text-xs absolute right-2 top-1/2 -translate-y-1/2 px-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Instant Search Dropdown Panel */}
            {isOpen && results && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-2xl z-[99999] max-h-96 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                {totalResults === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-500">
                    No matching records found for &ldquo;{globalSearch}&rdquo;
                  </div>
                ) : (
                  <>
                    {/* Outlets Section */}
                    {results.outlets && results.outlets.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center gap-1.5">
                          <Store className="w-3 h-3 text-[#005f56]" />
                          <span>Retail Outlets</span>
                        </div>
                        {results.outlets.map((o) => (
                          <div
                            key={o.id}
                            onClick={() => {
                              router.push(`/outlets`);
                              setIsOpen(false);
                            }}
                            className="px-2 py-1.5 hover:bg-slate-50 rounded flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="text-xs font-semibold text-slate-900">{o.name}</div>
                              <div className="text-[10px] text-slate-500">
                                {o.id} · Route: {o.route} {o.owner_name ? `· ${o.owner_name}` : ''}
                              </div>
                            </div>
                            <span className="text-[11px] font-mono text-slate-700">
                              Due: ₹{((o.current_outstanding || 0) / 1000).toFixed(1)}k
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Products / SKUs Section */}
                    {results.products && results.products.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center gap-1.5">
                          <Package className="w-3 h-3 text-[#005f56]" />
                          <span>Warehouse SKUs</span>
                        </div>
                        {results.products.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              router.push(`/godown`);
                              setIsOpen(false);
                            }}
                            className="px-2 py-1.5 hover:bg-slate-50 rounded flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="text-xs font-semibold text-slate-900">{p.sku}</div>
                              <div className="text-[10px] text-slate-500">
                                {p.company} · {p.category}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[11px] font-mono font-bold text-emerald-700">
                                {p.godown_stock} cs
                              </span>
                              <div className="text-[10px] text-slate-400">MRP ₹{p.mrp}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Orders Section */}
                    {results.orders && results.orders.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#005f56]" />
                          <span>Orders &amp; Invoices</span>
                        </div>
                        {results.orders.map((ord) => (
                          <div
                            key={ord.id}
                            onClick={() => {
                              router.push(`/orders`);
                              setIsOpen(false);
                            }}
                            className="px-2 py-1.5 hover:bg-slate-50 rounded flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="text-xs font-semibold text-slate-900">{ord.id}</div>
                              <div className="text-[10px] text-slate-500">{ord.outlet_name} · {ord.route}</div>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-slate-800">
                              ₹{parseFloat(String(ord.total_value)).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Salesmen Section */}
                    {results.salesmen && results.salesmen.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center gap-1.5">
                          <User className="w-3 h-3 text-[#005f56]" />
                          <span>Field Salesmen</span>
                        </div>
                        {results.salesmen.map((sm) => (
                          <div
                            key={sm.id}
                            onClick={() => {
                              router.push(`/field-team`);
                              setIsOpen(false);
                            }}
                            className="px-2 py-1.5 hover:bg-slate-50 rounded flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="text-xs font-semibold text-slate-900">{sm.name}</div>
                              <div className="text-[10px] text-slate-500">Beat: {sm.beat}</div>
                            </div>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                              Active
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
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

          {/* User profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <span className="text-[12px] font-medium text-slate-700 hidden sm:inline">
              {user?.name || user?.email || 'Admin'}
            </span>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
