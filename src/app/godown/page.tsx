'use client';

import React, { useState, useEffect } from 'react';
import { Search, PackagePlus, RefreshCw, Loader2, QrCode } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { productApi, Product } from '@/lib/api';
import { AddProductModal } from '@/components/modals/AddProductModal';

export default function GodownPage() {
  const { showAlert, globalSearch, selectedCompany } = useCrm();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with global header search if provided
  useEffect(() => {
    if (globalSearch !== search) {
      setSearch(globalSearch);
    }
  }, [globalSearch]);

  // Sync with header selected company
  useEffect(() => {
    if (selectedCompany) {
      setFilterCompany(selectedCompany);
    }
  }, [selectedCompany]);

  // Fetch live products & inventory from Neon DB
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.getAll({
        company: filterCompany,
        search: search,
      });
      if (res.data) {
        setProducts(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load products from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterCompany]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleProductAdded = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showAlert(
      'SKU & Inventory Inwarded!',
      `${newProduct.sku} (Batch ${newProduct.batch}) added with opening stock of ${newProduct.godownStock} units.`,
      'success'
    );
  };

  // Dynamic Stock Calculations
  const totalGodownUnits = products.reduce((acc, p) => acc + (p.godownStock || 0), 0);
  const totalVanUnits = products.reduce((acc, p) => acc + (p.vanStock || 0), 0);
  const totalStockValuation = products.reduce(
    (acc, p) => acc + (p.godownStock + p.vanStock) * (p.purchaseRate || p.mrp * 0.8),
    0
  );
  const lowStockCount = products.filter((p) => p.godownStock < 50 || p.coverDays < 5).length;
  const nearExpiryCount = products.filter((p) => p.status.toLowerCase().includes('expiry')).length;

  return (
    <div className="space-y-4">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Godown &amp; Stock Ledger
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Batch-wise FIFO inventory with barcode tracking, near-expiry alerts, and live godown vs van stock.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              showAlert(
                'Barcode Physical Audit',
                'Wireless barcode scanner connected. Scan any carton or inner pack barcode to verify physical inventory against batch records.',
                'info'
              )
            }
            className="px-3 py-1.5 text-[12px] font-semibold bg-white border border-[#d1d5db] hover:bg-slate-50 text-[#374151] rounded-[6px] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Barcode Audit</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>+ Inward / Add SKU</span>
          </button>
        </div>
      </div>

      {/* Stock Health Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Total Valuation (Buy)</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">
            ₹{(totalStockValuation / 100000).toFixed(1)} Lakhs
          </div>
          <div className="text-[10px] text-[#059669] font-medium">
            {totalGodownUnits + totalVanUnits} Total Units
          </div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Godown Stock</div>
          <div className="text-[18px] font-bold text-[#005f56] mt-0.5">
            {totalGodownUnits.toLocaleString()} Pcs
          </div>
          <div className="text-[10px] text-[#6b7280]">Warehouse racks</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Van Stock (In Market)</div>
          <div className="text-[18px] font-bold text-[#111827] mt-0.5">
            {totalVanUnits.toLocaleString()} Pcs
          </div>
          <div className="text-[10px] text-[#6b7280]">Loaded in delivery fleet</div>
        </div>
        <div className="erp-card p-3">
          <div className="text-[10px] text-[#6b7280] font-medium uppercase">Low Cover / Near Expiry</div>
          <div className="text-[18px] font-bold text-[#dc2626] mt-0.5">
            {lowStockCount + nearExpiryCount} Batches
          </div>
          <div className="text-[10px] text-[#dc2626] font-medium">Re-order / Clearance needed</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU name, batch code, or category..."
            className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-white border border-[#d1d5db] rounded-[6px] text-[#111827] focus:outline-none focus:border-[#005f56]"
          />
        </div>

        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-3 py-1.5 text-[#374151] focus:outline-none focus:border-[#005f56] cursor-pointer"
        >
          <option value="All">All Companies ▾</option>
          <option value="Company A">Company A (Personal Care)</option>
          <option value="Company B">Company B (Foods)</option>
          <option value="Company C">Company C (Beverages)</option>
          <option value="Company D">Company D (Home Care)</option>
        </select>

        <button
          onClick={fetchProducts}
          title="Refresh Inventory"
          className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer flex items-center justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inventory Table */}
      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#005f56] mb-2" />
            <span className="text-xs">Fetching godown inventory ...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No inventory found. Click &quot;+ Inward / Add SKU&quot; to add a product batch.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-white table-header border-b border-[#e5e7eb]">
                <tr>
                  <th className="py-2.5 px-3">SKU Name</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3 font-mono">Batch Code</th>
                  <th className="py-2.5 px-3 text-right">MRP</th>
                  <th className="py-2.5 px-3 text-right">Godown Qty</th>
                  <th className="py-2.5 px-3 text-right">Van Stock</th>
                  <th className="py-2.5 px-3 text-right">Total Qty</th>
                  <th className="py-2.5 px-3 text-center">Cover</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fafafa]">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#111827]">{item.sku}</div>
                      <div className="text-[10px] text-slate-400">
                        Buy: ₹{item.purchaseRate} · Sell: ₹{item.sellRate}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#4b5563]">{item.company}</td>
                    <td className="py-2.5 px-3 font-mono text-[#6b7280] font-medium">{item.batch}</td>
                    <td className="py-2.5 px-3 text-right text-[#111827]">₹{item.mrp}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-[#111827]">{item.godownStock}</td>
                    <td className="py-2.5 px-3 text-right text-[#005f56] font-medium">{item.vanStock}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#111827]">{item.totalStock}</td>
                    <td className="py-2.5 px-3 text-center text-[#4b5563]">{item.coverDays} d</td>
                    <td className="py-2.5 px-3 text-[#6b7280]">{item.expiryDate}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.status === 'Healthy'
                            ? 'bg-[#dcfce7] text-[#15803d]'
                            : item.status.includes('Low')
                              ? 'bg-[#fee2e2] text-[#b91c1c]'
                              : 'bg-[#fef3c7] text-[#b45309]'
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProductAdded}
      />
    </div>
  );
}
