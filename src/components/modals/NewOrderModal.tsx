'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { outletApi, productApi, orderApi, Outlet, Product } from '@/lib/api';

interface LineItemForm {
  productId: string;
  sku: string;
  units: number;
  rate: number;
  mrp: number;
  scheme: string;
}

export function NewOrderModal() {
  const { isNewOrderModalOpen, setIsNewOrderModalOpen, setNotification } = useCrm();

  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState('');
  const [lineItems, setLineItems] = useState<LineItemForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Outlets and Products from Neon DB when modal opens
  useEffect(() => {
    if (isNewOrderModalOpen) {
      const loadMasters = async () => {
        try {
          const [outletsRes, productsRes] = await Promise.all([
            outletApi.getAll(),
            productApi.getAll(),
          ]);
          if (outletsRes.data && outletsRes.data.length > 0) {
            setOutlets(outletsRes.data);
            setSelectedOutletId(outletsRes.data[0].id);
          }
          if (productsRes.data && productsRes.data.length > 0) {
            setProducts(productsRes.data);
            // Default 1 item
            setLineItems([
              {
                productId: productsRes.data[0].id,
                sku: productsRes.data[0].sku,
                units: 12,
                rate: productsRes.data[0].sellRate || 100,
                mrp: productsRes.data[0].mrp || 120,
                scheme: 'Regular',
              },
            ]);
          }
        } catch (err) {
          console.error('Failed to load master data for new order:', err);
        }
      };
      loadMasters();
    }
  }, [isNewOrderModalOpen]);

  if (!isNewOrderModalOpen) return null;

  const currentOutlet = outlets.find((o) => o.id === selectedOutletId) || outlets[0];

  const handleProductChange = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setLineItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        productId: prod.id,
        sku: prod.sku,
        units: updated[index].units || 12,
        rate: prod.sellRate,
        mrp: prod.mrp,
        scheme: 'Regular',
      };
      return updated;
    });
  };

  const handleUnitsChange = (index: number, units: number) => {
    setLineItems((prev) => {
      const updated = [...prev];
      updated[index].units = units;
      return updated;
    });
  };

  const handleAddLine = () => {
    if (products.length === 0) return;
    const defaultProd = products[0];
    setLineItems((prev) => [
      ...prev,
      {
        productId: defaultProd.id,
        sku: defaultProd.sku,
        units: 12,
        rate: defaultProd.sellRate,
        mrp: defaultProd.mrp,
        scheme: 'Regular',
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalOrderValue = lineItems.reduce((acc, it) => acc + it.units * it.rate, 0);

  // Check if credit hold will be triggered
  const projectedBalance = (currentOutlet?.currentOutstanding || 0) + totalOrderValue;
  const isCreditOver = currentOutlet && projectedBalance > currentOutlet.creditLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!currentOutlet) throw new Error('Please select an outlet.');
      if (lineItems.length === 0) throw new Error('Order must contain at least 1 item.');

      const res = await orderApi.create({
        outletId: currentOutlet.id,
        outletName: currentOutlet.name,
        route: currentOutlet.route,
        source: 'Salesman · App',
        deliveryDate: 'Sat, 10 Oct',
        items: lineItems.map((item) => ({
          productId: item.productId,
          sku: item.sku,
          units: item.units,
          qty: `${item.units} pc`,
          rate: item.rate,
          mrp: item.mrp,
          scheme: item.scheme,
        })),
      });

      if (res.data) {
        setIsNewOrderModalOpen(false);
        setNotification(
          `Order ${res.data.id} created for ${res.data.outlet}. Automated status: ${res.data.checks}.`
        );
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#031c19] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00a693] flex items-center justify-center text-[#031c19]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Create Field / Pre-Sell Order</h2>
              <p className="text-[11px] text-[#9cb3af]">
                Live credit check &amp; stock verification against Neon DB
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewOrderModalOpen(false)}
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

          {/* Retailer Selector & Route */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Retailer / Outlet *
              </label>
              <select
                value={selectedOutletId}
                onChange={(e) => setSelectedOutletId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#005f56] cursor-pointer"
              >
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.route})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Route &amp; Credit Ceiling
              </label>
              <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 flex justify-between items-center">
                <span className="font-medium">{currentOutlet?.route || 'Loading...'}</span>
                <span className="text-[11px] text-slate-500">
                  Limit: ₹{(currentOutlet?.creditLimit || 0).toLocaleString()} (Bal: ₹{(currentOutlet?.currentOutstanding || 0).toLocaleString()})
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Order Line Items ({lineItems.length})
              </label>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-[11px] text-[#005f56] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {lineItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <select
                    value={item.productId}
                    onChange={(e) => handleProductChange(idx, e.target.value)}
                    className="flex-1 text-xs bg-white border border-slate-300 rounded p-1.5 focus:outline-none focus:border-[#005f56]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku} (Stock: {p.godownStock})
                      </option>
                    ))}
                  </select>

                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      value={item.units}
                      onChange={(e) => handleUnitsChange(idx, Number(e.target.value))}
                      className="w-full text-xs text-center bg-white border border-slate-300 rounded p-1.5 focus:outline-none focus:border-[#005f56]"
                      placeholder="Qty"
                    />
                  </div>

                  <div className="w-24 text-right font-medium text-slate-700">
                    ₹{(item.units * item.rate).toLocaleString()}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    disabled={lineItems.length === 1}
                    className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Pre-Bill Verification Box */}
          <div
            className={`p-3.5 border rounded-lg text-xs space-y-1 ${
              isCreditOver
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-[#f0fdf4] border-[#dcfce7] text-[#166534]'
            }`}
          >
            <div className="font-semibold flex items-center justify-between">
              <span>Automatic Pre-Bill Verification</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  isCreditOver
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-[#dcfce7] text-[#15803d]'
                }`}
              >
                {isCreditOver ? 'CREDIT HOLD ALERT' : 'CHECK PASSED'}
              </span>
            </div>
            <p className="text-[11px]">
              • Total Order Value: <strong>₹{totalOrderValue.toLocaleString()}</strong><br />
              • Projected Balance: ₹{projectedBalance.toLocaleString()} vs Authorized Limit ₹{(currentOutlet?.creditLimit || 0).toLocaleString()}
              {isCreditOver && (
                <span className="block text-red-600 font-bold mt-1">
                  ⚠️ This order exceeds the credit ceiling and will be flagged as &apos;Credit hold&apos;.
                </span>
              )}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-sm font-bold text-slate-800">
              Total: ₹{totalOrderValue.toLocaleString()}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsNewOrderModalOpen(false)}
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
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Create Pre-Sell Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
