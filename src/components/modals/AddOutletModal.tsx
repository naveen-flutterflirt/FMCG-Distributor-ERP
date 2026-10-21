'use client';

import React, { useState } from 'react';
import { X, Store, Loader2, AlertCircle } from 'lucide-react';
import { outletApi, CreateOutletInput, Outlet } from '@/lib/api';

interface AddOutletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newOutlet: Outlet) => void;
}

const AVAILABLE_ROUTES = [
  'R4 Gandhi Nagar',
  'R2 Station Rd',
  'R1 Civil Lines',
  'R3 Old Market',
  'MT route',
  'R5 Industrial Area',
];

const CATEGORIES: Array<CreateOutletInput['category']> = [
  'General Trade',
  'Modern Trade',
  'Wholesale',
  'HoReCa',
  'Chemist',
];

const CLASSES: Array<CreateOutletInput['outletClass']> = ['A', 'B', 'C', 'Modern Trade'];

export function AddOutletModal({ isOpen, onClose, onSuccess }: AddOutletModalProps) {
  const [formData, setFormData] = useState<CreateOutletInput>({
    name: '',
    ownerName: '',
    category: 'General Trade',
    outletClass: 'B',
    route: AVAILABLE_ROUTES[0],
    address: '',
    phone: '',
    gstin: '',
    creditLimit: 25000,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name.trim() || !formData.ownerName.trim() || !formData.phone.trim() || !formData.address.trim()) {
        throw new Error('Outlet Name, Owner Name, Mobile Phone, and Address are required.');
      }

      const res = await outletApi.create({
        ...formData,
        creditLimit: Number(formData.creditLimit) || 25000,
      });

      if (res.data) {
        onSuccess(res.data);
        onClose();
        // Reset form
        setFormData({
          name: '',
          ownerName: '',
          category: 'General Trade',
          outletClass: 'B',
          route: AVAILABLE_ROUTES[0],
          address: '',
          phone: '',
          gstin: '',
          creditLimit: 25000,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to onboard retail outlet.');
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
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Onboard Retail Outlet</h3>
              <p className="text-[11px] text-[#9cb3af]">
                Assign beat route, verify GSTIN &amp; set authorized credit limit
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shop / Outlet Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Gupta Kirana Store"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner / Proprietor Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramprasad Gupta"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class *
              </label>
              <select
                value={formData.outletClass}
                onChange={(e) => setFormData({ ...formData, outletClass: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white cursor-pointer"
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Route / Beat *
              </label>
              <select
                value={formData.route}
                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white cursor-pointer"
              >
                {AVAILABLE_ROUTES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98260 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN (Optional)
              </label>
              <input
                type="text"
                placeholder="15-digit GSTIN"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shop Address &amp; Landmark *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 14/2 Main Chowk, near SBI Bank"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Authorized Credit Limit (₹)
            </label>
            <input
              type="number"
              min={0}
              step={5000}
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Orders will automatically trigger credit-hold check if outstanding exceeds this limit.
            </p>
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
                  <span>Onboarding...</span>
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span>Onboard &amp; Activate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
