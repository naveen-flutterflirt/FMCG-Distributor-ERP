'use client';

import React, { useState } from 'react';
import { X, PackagePlus, Loader2, AlertCircle } from 'lucide-react';
import { productApi, CreateProductInput, Product } from '@/lib/api';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProduct: Product) => void;
}

const COMPANIES = ['Company A', 'Company B', 'Company C', 'Company D'];
const CATEGORIES = [
  'Beverages',
  'Foods & Confectionery',
  'Personal Care',
  'Home Care',
  'Dairy & Snacks',
];

export function AddProductModal({
  isOpen,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const [formData, setFormData] = useState<CreateProductInput>({
    sku: '',
    company: COMPANIES[0],
    category: CATEGORIES[0],
    batch: '',
    mrp: 100,
    purchaseRate: 75,
    sellRate: 88,
    godownStock: 100,
    coverDays: 15,
    expiryDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.sku.trim() || !formData.batch.trim() || !formData.expiryDate.trim()) {
        throw new Error('Product SKU, Batch No, and Expiry Date are required.');
      }

      const res = await productApi.create({
        ...formData,
        mrp: Number(formData.mrp) || 0,
        purchaseRate: Number(formData.purchaseRate) || 0,
        sellRate: Number(formData.sellRate) || 0,
        godownStock: Number(formData.godownStock) || 0,
        coverDays: Number(formData.coverDays) || 15,
      });

      if (res.data) {
        onSuccess(res.data);
        onClose();
        // Reset form
        setFormData({
          sku: '',
          company: COMPANIES[0],
          category: CATEGORIES[0],
          batch: '',
          mrp: 100,
          purchaseRate: 75,
          sellRate: 88,
          godownStock: 100,
          coverDays: 15,
          expiryDate: '',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#031c19] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00a693] flex items-center justify-center text-[#031c19]">
              <PackagePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Add Product &amp; Inward Batch</h3>
              <p className="text-[11px] text-[#9cb3af]">
                Define SKU pricing, FIFO batch number, and godown opening stock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              SKU / Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Marie Gold Biscuit 200g"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                FMCG Company *
              </label>
              <select
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white cursor-pointer"
              >
                {COMPANIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                MRP (₹) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Distributor Buy Rate (₹)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.purchaseRate}
                onChange={(e) => setFormData({ ...formData, purchaseRate: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Retailer Sell Rate (₹)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.sellRate}
                onChange={(e) => setFormData({ ...formData, sellRate: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batch No *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B26-11-K"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Opening Stock (Units)
              </label>
              <input
                type="number"
                min="0"
                value={formData.godownStock}
                onChange={(e) => setFormData({ ...formData, godownStock: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 15 Oct 2027"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <PackagePlus className="w-3.5 h-3.5" />
                  <span>Save SKU &amp; Stock</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
