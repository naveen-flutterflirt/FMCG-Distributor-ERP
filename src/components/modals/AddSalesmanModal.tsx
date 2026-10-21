'use client';

import React, { useState } from 'react';
import { X, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { salesmanApi, CreateSalesmanInput, Salesman } from '@/lib/api';

interface AddSalesmanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSalesman: Salesman) => void;
}

const AVAILABLE_BEATS = [
  'Gandhi Nagar (R4)',
  'Station Road (R2)',
  'Civil Lines (R1)',
  'Old Market (R3)',
  'MT Route (Modern Trade)',
  'Industrial Area (R5)',
];

export function AddSalesmanModal({
  isOpen,
  onClose,
  onSuccess,
}: AddSalesmanModalProps) {
  const [formData, setFormData] = useState<CreateSalesmanInput>({
    name: '',
    phone: '',
    email: '',
    beat: AVAILABLE_BEATS[0],
    targetSales: 500000,
    dailyOutletsTarget: 32,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name.trim() || !formData.phone.trim()) {
        throw new Error('Salesman Name and Mobile Number are required.');
      }

      const res = await salesmanApi.create({
        ...formData,
        targetSales: Number(formData.targetSales) || 500000,
        dailyOutletsTarget: Number(formData.dailyOutletsTarget) || 32,
      });

      if (res.data) {
        onSuccess(res.data);
        onClose();
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          beat: AVAILABLE_BEATS[0],
          targetSales: 500000,
          dailyOutletsTarget: 32,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to onboard salesman');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#031c19] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00a693] flex items-center justify-center text-[#031c19]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Onboard New Salesman
              </h3>
              <p className="text-[11px] text-[#9cb3af]">
                Assign beat route, contact info &amp; monthly sales targets
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
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Suresh Kumar"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="suresh@fmcg.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Beat / Route *
              </label>
              <select
                value={formData.beat}
                onChange={(e) =>
                  setFormData({ ...formData, beat: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white cursor-pointer"
              >
                {AVAILABLE_BEATS.map((beat) => (
                  <option key={beat} value={beat}>
                    {beat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Target (₹)
              </label>
              <input
                type="number"
                min={50000}
                step={10000}
                value={formData.targetSales}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetSales: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#005f56] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Daily Outlets Target
              </label>
              <input
                type="number"
                min={10}
                max={60}
                value={formData.dailyOutletsTarget}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyOutletsTarget: Number(e.target.value),
                  })
                }
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
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Save &amp; Assign Beat</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
