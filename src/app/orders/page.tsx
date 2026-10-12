'use client';

import React from 'react';
import {
  CheckSquare,
  Square,
  Printer,
} from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { FMCGCompany } from '@/types/crm';

export default function OrderBillingPage() {
  const {
    orders,
    filteredOrders,
    selectedOrderIds,
    toggleSelectOrder,
    selectAllOrders,
    activePreviewOrderId,
    setActivePreviewOrderId,
    bulkBillSelected,
    selectedRoute,
    setSelectedRoute,
    selectedCompany,
    setSelectedCompany,
    setNotification,
  } = useCrm();

  const activeOrder =
    filteredOrders.find((o) => o.id === activePreviewOrderId) ||
    filteredOrders[0] ||
    orders[0];

  const allSelected =
    filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length;

  const handlePrintLoadSheet = () => {
    setNotification(`Load sheet generated for Route ${activeOrder.route}. Sending to vehicle printer.`);
    window.print();
  };

  const handlePrintInvoice = () => {
    setNotification(`Tax Invoice & e-Way bill generated for ${activeOrder.outlet} (${activeOrder.id}).`);
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Subheader Filter Bar matching Page 5 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="text-[13px] text-[#374151]">
          Pending orders <span className="font-bold text-[#111827]">· {orders.length} ·</span> delivery date <span className="font-semibold text-[#111827]">Sat 10 Oct</span>
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
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value as FMCGCompany)}
            className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-2.5 py-1.5 font-medium text-[#374151] cursor-pointer focus:outline-none focus:border-[#005f56]"
          >
            <option value="All">Company: All ▾</option>
            <option value="Company A">Company A</option>
            <option value="Company B">Company B</option>
            <option value="Company C">Company C</option>
            <option value="Company D">Company D</option>
          </select>

          <button
            onClick={bulkBillSelected}
            disabled={selectedOrderIds.length === 0}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-[6px] transition-colors cursor-pointer ${
              selectedOrderIds.length > 0
                ? 'bg-[#005f56] hover:bg-[#004e46] text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Bulk bill selected ({selectedOrderIds.length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="erp-card overflow-hidden">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrderIds.includes(order.id);
                const isActive = activePreviewOrderId === order.id;

                return (
                  <tr
                    key={order.id}
                    onClick={() => setActivePreviewOrderId(order.id)}
                    className={`cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[#f0fdf4]/80'
                        : 'hover:bg-[#fafafa]'
                    }`}
                  >
                    <td
                      className="py-2.5 px-3 text-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectOrder(order.id);
                      }}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-[#005f56]" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-[#d1d5db]" />
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
                      {order.schemeSaving > 0 ? `₹${order.schemeSaving.toLocaleString()}` : '—'}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split Pane: Invoice preview | Billing checks run | After billing */}
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
              {activeOrder.items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 text-[#111827]">{item.sku}</td>
                  <td className="py-2 text-[#4b5563]">{item.qty}</td>
                  <td className="py-2 text-right text-[#111827]">{item.rate.toFixed(2)}</td>
                  <td className="py-2 text-center text-[#4b5563]">{item.scheme}</td>
                  <td className="py-2 text-right font-medium text-[#111827]">
                    {item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 pt-2 border-t border-[#f3f4f6] text-[11px] text-[#6b7280]">
            Case / inner / piece UoM · MRP-wise batch · rates by outlet class
          </div>
        </div>

        {/* Center: Billing checks run */}
        <div className="lg:col-span-3 erp-card p-4">
          <h3 className="text-[13px] font-bold text-[#111827] mb-3">
            Billing checks run
          </h3>

          <ul className="space-y-2 text-[11px] text-[#374151]">
            <li className="flex items-center gap-1.5">
              <span className="text-[#059669] font-bold">•</span>
              <span>Credit limit &amp; overdue days</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#059669] font-bold">•</span>
              <span>Stock by MRP / batch, FIFO</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#059669] font-bold">•</span>
              <span>Scheme eligibility &amp; slabs</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#059669] font-bold">•</span>
              <span>Price list by outlet class</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#059669] font-bold">•</span>
              <span>GSTIN → B2B, else B2C</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#059669] font-bold">•</span>
              <span>e-invoice IRN &amp; e-way bill</span>
            </li>
          </ul>
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
                <span>Load sheet per vehicle (SKU-wise, cases)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#6b7280]">•</span>
                <span>Route-sorted invoice print</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#6b7280]">•</span>
                <span>Delivery trips created</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#6b7280]">•</span>
                <span>Order SMS / WhatsApp to retailer</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#6b7280]">•</span>
                <span>Short items back-ordered</span>
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
    </div>
  );
}
