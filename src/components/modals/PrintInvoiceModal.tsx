'use client';

import React from 'react';
import { X, Printer } from 'lucide-react';
import { Order } from '@/lib/api';

interface PrintInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintInvoiceModal({ order, isOpen, onClose }: PrintInvoiceModalProps) {
  if (!isOpen || !order) return null;

  const subTotal = order.value || 0;
  const gstAmount = Math.round(subTotal * 0.18);
  const netTotal = subTotal + gstAmount;

  const handlePrint = () => {
    const printContent = document.getElementById('printable-tax-invoice');
    if (!printContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tax Invoice - ${order.id}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 15mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 0;
              background: #fff;
              font-size: 10pt;
              line-height: 1.35;
            }
            .invoice-wrap {
              border: 1.5px solid #0f172a;
              border-radius: 4px;
              overflow: hidden;
            }
            .header-bar {
              background: #f8fafc;
              border-bottom: 2px solid #0f172a;
              padding: 12px 16px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .company-title {
              font-size: 15pt;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: -0.3px;
              color: #0f172a;
              margin: 0;
            }
            .company-meta {
              font-size: 8.5pt;
              color: #475569;
              margin-top: 2px;
            }
            .badge-tax {
              background: #0f172a;
              color: #fff;
              font-size: 8pt;
              font-weight: 800;
              padding: 3px 8px;
              border-radius: 3px;
              display: inline-block;
            }
            .meta-block {
              display: flex;
              border-bottom: 1.5px solid #0f172a;
            }
            .meta-col {
              flex: 1;
              padding: 10px 16px;
              font-size: 8.5pt;
            }
            .meta-col:first-child {
              border-right: 1.5px solid #0f172a;
            }
            .meta-label {
              font-size: 7.5pt;
              font-weight: 800;
              text-transform: uppercase;
              color: #64748b;
              margin-bottom: 2px;
            }
            .retailer-title {
              font-size: 11pt;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 2px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 8.5pt;
            }
            th {
              background: #f1f5f9;
              color: #1e293b;
              font-weight: 800;
              text-transform: uppercase;
              font-size: 7.5pt;
              padding: 7px 10px;
              border-bottom: 1.5px solid #0f172a;
              border-right: 1px solid #cbd5e1;
              text-align: left;
            }
            th:last-child { border-right: none; }
            td {
              padding: 6px 10px;
              border-bottom: 1px solid #e2e8f0;
              border-right: 1px solid #e2e8f0;
            }
            td:last-child { border-right: none; }
            tr:nth-child(even) td {
              background: #fafafa;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-mono { font-family: monospace; }
            .summary-container {
              display: flex;
              border-top: 1.5px solid #0f172a;
            }
            .summary-left {
              flex: 1.2;
              padding: 10px 16px;
              border-right: 1.5px solid #0f172a;
              font-size: 8pt;
              color: #475569;
            }
            .summary-right {
              flex: 0.9;
              padding: 8px 16px;
              font-size: 8.5pt;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 2px 0;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-weight: 900;
              font-size: 10.5pt;
              color: #0f172a;
              border-top: 1.5px solid #0f172a;
              padding-top: 4px;
              margin-top: 4px;
            }
            .footer-strip {
              display: flex;
              border-top: 1.5px solid #0f172a;
              background: #f8fafc;
            }
            .footer-col {
              flex: 1;
              padding: 10px 16px;
              font-size: 8pt;
            }
            .footer-col:first-child {
              border-right: 1.5px solid #0f172a;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Screen Only) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#031c19] text-white shrink-0">
          <div>
            <h3 className="text-sm font-bold tracking-tight">Tax Invoice Preview</h3>
            <p className="text-[11px] text-[#9cb3af]">
              Standard GST Compliant Invoice &middot; Ready to Print
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#00a693] hover:bg-[#008f7f] text-[#031c19] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice View Body */}
        <div className="p-6 overflow-y-auto bg-slate-50 flex justify-center">
          <div
            id="printable-tax-invoice"
            className="invoice-wrap w-full max-w-2xl bg-white border border-slate-900 rounded shadow-xs overflow-hidden text-slate-900"
          >
            {/* Header */}
            <div className="header-bar bg-slate-50/80 p-4 border-b border-slate-800 flex justify-between items-start">
              <div>
                <h1 className="company-title text-base font-black uppercase tracking-tight text-slate-900 m-0">
                  FMCG DISTRIBUTORS PVT LTD
                </h1>
                <p className="company-meta text-[11px] text-slate-600 mt-0.5">
                  Warehouse Depot, Transport Nagar, Phase-2
                </p>
                <p className="company-meta text-[11px] text-slate-600">
                  GSTIN: <span className="font-mono font-bold text-slate-900">09AAACD4491B1Z2</span> &middot; Phone: +91 98765 00000
                </p>
              </div>
              <div className="text-right">
                <span className="badge-tax inline-block bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  TAX INVOICE
                </span>
                <p className="text-xs font-mono font-bold text-slate-900 mt-1">
                  Invoice No: INV-{order.id.replace('SO-', '')}
                </p>
                <p className="text-[11px] text-slate-500">
                  Date: {order.deliveryDate || 'Dispatched Today'}
                </p>
              </div>
            </div>

            {/* Billed To / Details */}
            <div className="meta-block grid grid-cols-2 border-b border-slate-800">
              <div className="meta-col p-3 border-r border-slate-800 text-xs">
                <div className="meta-label text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  Billed To (Retailer)
                </div>
                <div className="retailer-title font-bold text-[13px] text-slate-900 leading-tight">
                  {order.outlet}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Route: {order.route} (Class: {order.outletClass || 'A'})
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  GSTIN: <span className="font-semibold">{order.gstin || 'Unregistered B2C'}</span>
                </div>
              </div>

              <div className="meta-col p-3 text-xs bg-slate-50/40">
                <div className="meta-label text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  Dispatch &amp; Order Details
                </div>
                <div className="text-[11px] text-slate-700">
                  Order ID: <span className="font-mono font-bold text-slate-900">{order.id}</span>
                </div>
                <div className="text-[11px] text-slate-700">
                  Source: {order.source}
                </div>
                <div className="text-[11px] text-slate-700">
                  Payment Terms: Credit (Limit: ₹{(order.creditLimit || 30000).toLocaleString()})
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-800 text-[10px] uppercase font-bold">
                  <th className="py-2 px-2.5 w-7 text-center border-r border-slate-300">#</th>
                  <th className="py-2 px-2.5 border-r border-slate-300">Item Description / SKU</th>
                  <th className="py-2 px-2.5 text-center border-r border-slate-300">Pack / Qty</th>
                  <th className="py-2 px-2.5 text-right border-r border-slate-300">MRP (₹)</th>
                  <th className="py-2 px-2.5 text-right border-r border-slate-300">Rate (₹)</th>
                  <th className="py-2 px-2.5 text-center border-r border-slate-300">Scheme</th>
                  <th className="py-2 px-2.5 text-right font-bold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                    <td className="py-2 px-2.5 text-center font-mono text-slate-400 border-r border-slate-200">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-2.5 font-bold text-slate-900 border-r border-slate-200">
                      {item.sku}
                      {item.isMustSell && (
                        <span className="ml-1.5 text-[8px] bg-slate-100 text-slate-700 border border-slate-200 px-1 py-0.2 rounded font-normal">
                          Focus SKU
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200">
                      {item.qty || `${item.units} pc`}
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono text-slate-500 border-r border-slate-200">
                      {item.mrp || item.rate}
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono font-medium border-r border-slate-200">
                      {item.rate}
                    </td>
                    <td className="py-2 px-2.5 text-center text-slate-600 text-[10px] border-r border-slate-200">
                      {item.scheme || '—'}
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{(item.amount || item.units * item.rate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Summary */}
            <div className="summary-container grid grid-cols-12 border-t border-slate-800">
              <div className="summary-left col-span-7 p-3 border-r border-slate-800 text-[10px] text-slate-600 space-y-1">
                <div>&bull; Scheme Discounts Applied: ₹{(order.schemeSaving || 0).toLocaleString()}</div>
                <div>&bull; Computer generated Tax Invoice. No physical signature required.</div>
                <div>&bull; Payment due as per standard 7-day distribution credit terms.</div>
              </div>

              <div className="summary-right col-span-5 p-3 font-mono text-xs space-y-1">
                <div className="summary-row flex justify-between text-slate-600">
                  <span>Taxable Value:</span>
                  <span>₹{subTotal.toLocaleString()}</span>
                </div>
                <div className="summary-row flex justify-between text-slate-600">
                  <span>GST (18% Est):</span>
                  <span>₹{gstAmount.toLocaleString()}</span>
                </div>
                <div className="total-row flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-800">
                  <span>Total Amount:</span>
                  <span>₹{netTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer-strip grid grid-cols-2 border-t border-slate-800 bg-slate-50/60 p-3 text-[10px] text-slate-600">
              <div className="footer-col">
                <div className="font-bold text-slate-800 mb-0.5">Bank Details for RTGS / UPI:</div>
                <div>HDFC Bank &middot; A/c: 50200012345678</div>
                <div>IFSC: HDFC0001234</div>
              </div>
              <div className="footer-col text-right flex flex-col justify-end">
                <div className="font-bold text-slate-900">For FMCG DISTRIBUTORS PVT LTD</div>
                <div className="text-[9px] text-slate-500 mt-2">Authorized Signatory / Dispatch Officer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
