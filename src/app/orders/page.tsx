'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Printer,
  RefreshCw,
  Loader2,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { orderApi, Order } from '@/lib/api';
import { PrintInvoiceModal } from '@/components/modals/PrintInvoiceModal';

export default function OrderBillingPage() {
  const { setNotification, showAlert, globalSearch } = useCrm();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState('All');
  const [selectedChecks, setSelectedChecks] = useState('All');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [activePreviewOrderId, setActivePreviewOrderId] = useState<string>('');
  const [billingInProgress, setBillingInProgress] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Fetch live orders & items from Neon DB
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getAll({
        route: selectedRoute,
        checks: selectedChecks,
      });
      if (res.data) {
        setOrders(res.data);
        if (res.data.length > 0 && !activePreviewOrderId) {
          setActivePreviewOrderId(res.data[0].id);
        }
        // Auto select 'OK' orders for quick bulk billing
        const okOrders = res.data.filter((o) => o.checks === 'OK').map((o) => o.id);
        setSelectedOrderIds(okOrders);
      }
    } catch (err: any) {
      console.error('Failed to load orders from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedRoute, selectedChecks]);

  // Filter orders reactively based on global search in header
  const filteredOrders = orders.filter((order) => {
    if (!globalSearch.trim()) return true;
    const term = globalSearch.toLowerCase();
    return (
      order.id.toLowerCase().includes(term) ||
      order.outlet.toLowerCase().includes(term) ||
      order.route.toLowerCase().includes(term) ||
      (order.source && order.source.toLowerCase().includes(term))
    );
  });

  const activeOrder =
    filteredOrders.find((o) => o.id === activePreviewOrderId) || filteredOrders[0] || null;

  const allSelected =
    filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length;

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllOrders = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(orders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  // Bulk Invoicing & Billing
  const handleBulkBill = async () => {
    if (selectedOrderIds.length === 0) return;

    try {
      setBillingInProgress(true);
      const res = await orderApi.bulkBill(selectedOrderIds);

      if (res.success) {
        showAlert(
          'Orders Billed Successfully!',
          res.message || 'Invoices generated and inventory deducted.',
          'success'
        );
        fetchOrders();
      }
    } catch (err: any) {
      showAlert('Billing Error', err.message || 'Failed to bill orders', 'danger');
    } finally {
      setBillingInProgress(false);
    }
  };

  const handlePrintLoadSheet = () => {
    if (!activeOrder) return;
    setNotification(
      `Load sheet generated for Route ${activeOrder.route}. Sending to vehicle printer.`
    );
    window.print();
  };

  const handlePrintInvoice = () => {
    if (!activeOrder) return;
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Subheader Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="text-[13px] text-[#374151]">
          Pending orders <span className="font-bold text-[#111827]">· {orders.length} ·</span> delivery date{' '}
          <span className="font-semibold text-[#111827]">Sat 10 Oct</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-2.5 py-1.5 font-medium text-[#374151] cursor-pointer focus:outline-none focus:border-[#005f56]"
          >
            <option value="All">Route: All ▾</option>
            <option value="R4">R4 Gandhi Nagar</option>
            <option value="R2">R2 Station Rd</option>
            <option value="R1">R1 Civil Lines</option>
            <option value="R3">R3 Old Market</option>
            <option value="MT">MT route</option>
          </select>

          <select
            value={selectedChecks}
            onChange={(e) => setSelectedChecks(e.target.value)}
            className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-2.5 py-1.5 font-medium text-[#374151] cursor-pointer focus:outline-none focus:border-[#005f56]"
          >
            <option value="All">Checks: All ▾</option>
            <option value="OK">OK (Ready to Bill)</option>
            <option value="Credit hold">Credit hold</option>
            <option value="Short 3 SKUs">Short Stock</option>
          </select>

          <button
            onClick={fetchOrders}
            title="Refresh Orders"
            className="p-1.5 bg-white border border-slate-300 rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleBulkBill}
            disabled={selectedOrderIds.length === 0 || billingInProgress}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-[6px] transition-colors flex items-center gap-1.5 cursor-pointer ${selectedOrderIds.length > 0 && !billingInProgress
                ? 'bg-[#005f56] hover:bg-[#004e46] text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
          >
            {billingInProgress ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Billing Invoices...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-3.5 h-3.5" />
                <span>Bulk Bill Selected ({selectedOrderIds.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#005f56] mb-2" />
            <span className="text-xs">Fetching live orders and line items...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No orders found. Click &quot;+ New order&quot; in the header to place a beat order.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="border-b border-[#e5e7eb] table-header bg-white">
                <tr>
                  <th className="py-2.5 px-3 w-8 text-center">
                    <button
                      onClick={() => selectAllOrders(!allSelected)}
                      className="text-[#9ca3af] hover:text-[#005f56] focus:outline-none cursor-pointer"
                      aria-label="Select all orders"
                    >
                      {allSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-[#005f56]" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-[#9ca3af]" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-medium">Order</th>
                  <th className="py-2.5 px-3 font-medium">Outlet</th>
                  <th className="py-2.5 px-3 font-medium">Route</th>
                  <th className="py-2.5 px-3 font-medium">Source</th>
                  <th className="py-2.5 px-3 font-medium text-center">Lines</th>
                  <th className="py-2.5 px-3 font-medium text-right">Value</th>
                  <th className="py-2.5 px-3 font-medium text-right">Scheme</th>
                  <th className="py-2.5 px-3 font-medium text-center">Checks</th>
                  <th className="py-2.5 px-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const isActive = activePreviewOrderId === order.id;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => {
                        setActivePreviewOrderId(order.id);
                        toggleSelectOrder(order.id);
                      }}
                      className={`cursor-pointer transition-colors select-none ${
                        isSelected
                          ? 'bg-[#e6f7f4] font-medium'
                          : isActive
                          ? 'bg-[#f0fdf4]/80'
                          : 'hover:bg-[#fafafa]'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center cursor-pointer">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#005f56]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#9ca3af] hover:text-[#005f56]" />
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#111827]">
                        {order.id}
                      </td>
                      <td className="py-2.5 px-3 text-[#111827]">
                        {order.outlet}
                      </td>
                      <td className="py-2.5 px-3 text-[#4b5563]">{order.route}</td>
                      <td className="py-2.5 px-3 text-[#4b5563]">{order.source}</td>
                      <td className="py-2.5 px-3 text-center text-[#111827]">
                        {order.lines}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-[#111827]">
                        ₹{order.value.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#4b5563]">
                        {order.schemeSaving > 0
                          ? `₹${order.schemeSaving.toLocaleString()}`
                          : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {order.checks === 'OK' && (
                          <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded text-[10px] font-bold">
                            OK
                          </span>
                        )}
                        {order.checks === 'Credit hold' && (
                          <span className="bg-[#fee2e2] text-[#b91c1c] px-2 py-0.5 rounded text-[10px] font-bold">
                            Credit hold
                          </span>
                        )}
                        {order.checks === 'Short 3 SKUs' && (
                          <span className="bg-[#fef3c7] text-[#b45309] px-2 py-0.5 rounded text-[10px] font-bold">
                            Short 3 SKUs
                          </span>
                        )}
                        {order.checks === 'PO match' && (
                          <span className="bg-[#ccfbf1] text-[#005f56] px-2 py-0.5 rounded text-[10px] font-bold">
                            PO match
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${order.status === 'Billed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Split Pane: Invoice preview | Billing checks run | After billing */}
      {activeOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Left: Invoice preview */}
          <div className="lg:col-span-6 erp-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[13px] font-bold text-[#111827]">
                Invoice preview <span className="text-[#6b7280] font-normal">· {activeOrder.outlet}</span>
              </div>
              <button
                onClick={handlePrintInvoice}
                className="text-[11px] font-medium text-[#005f56] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3 h-3" />
                <span>Print Invoice</span>
              </button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-[#6b7280] border-b border-[#f3f4f6] pb-1.5">
                  <th className="pb-1.5 font-normal">SKU</th>
                  <th className="pb-1.5 font-normal">Qty</th>
                  <th className="pb-1.5 font-normal text-right">Rate</th>
                  <th className="pb-1.5 font-normal text-center">Scheme</th>
                  <th className="pb-1.5 font-normal text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f9fafb]">
                {activeOrder.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 text-[#111827]">
                      {item.sku}
                      {item.isMustSell && (
                        <span className="ml-1 text-[9px] text-[#005f56] bg-[#f0fdf4] px-1 rounded font-bold">
                          Must-Sell
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-[#4b5563]">{item.qty}</td>
                    <td className="py-2 text-right text-[#4b5563]">₹{item.rate}</td>
                    <td className="py-2 text-center text-[#4b5563]">{item.scheme}</td>
                    <td className="py-2 text-right font-medium text-[#111827]">
                      ₹{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 pt-2 border-t border-[#f3f4f6] flex justify-between items-center text-[11px]">
              <span className="text-[#6b7280]">
                GSTIN: {activeOrder.gstin || 'Unregistered'} · Total: ₹{activeOrder.value.toLocaleString()}
              </span>
              <span className="font-semibold text-[#005f56]">
                Scheme Saving: ₹{activeOrder.schemeSaving.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Center: Live Billing checks run */}
          <div className="lg:col-span-3 erp-card p-4">
            <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
              Live Billing checks run
            </h3>

            <div className="space-y-2 text-[11px] text-[#374151]">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Credit Limit Ceiling</span>
                <span className="font-bold text-[#111827]">
                  ₹{(activeOrder.creditLimit || 25000).toLocaleString()}
                </span>
                <span className="text-slate-500 text-[10px] block mt-0.5">
                  Balance due: ₹{(activeOrder.balanceDue || 0).toLocaleString()}
                </span>
              </div>

              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Audit Verification Status</span>
                <span
                  className={`font-bold ${activeOrder.checks === 'OK' ? 'text-[#15803d]' : 'text-red-600'
                    }`}
                >
                  {activeOrder.checks === 'OK'
                    ? '✓ Credit & Stock Verified'
                    : `⚠️ ${activeOrder.checks}`}
                </span>
              </div>

              <div className="text-[10px] text-slate-500 space-y-1 pt-1">
                <div className="flex items-center gap-1">
                  <span className="text-[#059669] font-bold">•</span>
                  <span>FIFO Batch allocation active</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#059669] font-bold">•</span>
                  <span>GSTIN verified for B2B tax invoice</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: After billing */}
          <div className="lg:col-span-3 erp-card p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-[13px] font-bold text-[#111827] mb-3">
                After billing
              </h3>

              <ul className="space-y-2 text-[11px] text-[#374151]">
                <li className="flex items-center gap-1.5">
                  <span className="text-[#6b7280]">•</span>
                  <span>Stock auto-deducted from Godown</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#6b7280]">•</span>
                  <span>Outlet outstanding balance updated</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#6b7280]">•</span>
                  <span>e-Way bill &amp; tax invoice generated</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#6b7280]">•</span>
                  <span>Load sheet ready for vehicle loading</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handlePrintLoadSheet}
              className="mt-3 w-full py-1.5 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#111827] rounded-[6px] text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#005f56]" />
              <span>Print Load Sheet</span>
            </button>
          </div>
        </div>
      )}

      {/* Professional Tax Invoice Print Preview Modal */}
      <PrintInvoiceModal
        order={activeOrder}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
}
