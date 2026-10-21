'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Building2,
  Info,
  X,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  Receipt,
  ShieldCheck,
  Boxes
} from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { purchaseApi, PurchaseOrder, PurchaseSummary } from '@/lib/api';

export default function PurchasePage() {
  const { showAlert, selectedCompany: globalCompany, setSelectedCompany: setGlobalCompany } = useCrm();

  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [summary, setSummary] = useState<PurchaseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedPoId, setExpandedPoId] = useState<string | null>(null);

  // Filters - sync with global header company
  const [selectedCompany, setSelectedCompany] = useState<string>(globalCompany || 'All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    if (globalCompany) {
      setSelectedCompany(globalCompany);
    }
  }, [globalCompany]);

  // Modal: Generate Primary PO
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [poCompany, setPoCompany] = useState('Company A · Personal Care');
  const [poExpectedDelivery, setPoExpectedDelivery] = useState('14 Oct 2026');
  const [poSku, setPoSku] = useState('Premium CTC Tea 250 g');
  const [poCases, setPoCases] = useState('150');
  const [poRate, setPoRate] = useState('95');
  const [creatingPo, setCreatingPo] = useState(false);

  // Modal: Complete GRN
  const [isGrnModalOpen, setIsGrnModalOpen] = useState(false);
  const [activeGrnPo, setActiveGrnPo] = useState<PurchaseOrder | null>(null);
  const [shortageCases, setShortageCases] = useState('0');
  const [shortageAmount, setShortageAmount] = useState('0');
  const [completingGrn, setCompletingGrn] = useState(false);

  // Fetch live purchase data from backend
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const res = await purchaseApi.getAll({
        company: selectedCompany,
        status: selectedStatus,
      });

      if (res.data) {
        setOrders(res.data.purchaseOrders);
        setSummary(res.data.summary);
      }
    } catch (err: any) {
      showAlert('Connection Notice', err.message || 'Failed to fetch purchase orders', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [selectedCompany, selectedStatus]);

  // Handle PO Creation Submit
  const handleCreatePoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cases = parseInt(poCases, 10);
    const rate = parseFloat(poRate);

    if (!cases || cases <= 0 || !rate || rate <= 0) {
      showAlert('Invalid Input', 'Please enter valid cases and unit rate.', 'danger');
      return;
    }

    try {
      setCreatingPo(true);
      const res = await purchaseApi.createPO({
        company: poCompany,
        expectedDelivery: poExpectedDelivery,
        items: [
          {
            sku: poSku,
            orderedCases: cases,
            unitRate: rate,
          },
        ],
      });

      if (res.success) {
        showAlert('Purchase Order Generated!', res.message || 'PO generated successfully.', 'success');
        setIsPoModalOpen(false);
        fetchPurchaseOrders();
      }
    } catch (err: any) {
      showAlert('PO Creation Failed', err.message || 'Could not create PO.', 'danger');
    } finally {
      setCreatingPo(false);
    }
  };

  // Handle GRN Completion Submit
  const handleCompleteGrnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGrnPo) return;

    try {
      setCompletingGrn(true);
      const res = await purchaseApi.completeGRN({
        id: activeGrnPo.id,
        shortageCases: parseInt(shortageCases, 10) || 0,
        shortageAmount: parseFloat(shortageAmount) || 0,
      });

      if (res.success) {
        showAlert(
          'GRN Completed & Inwarded!',
          `Stock for ${activeGrnPo.id} has been physically inwarded to Godown inventory.`,
          'success'
        );
        setIsGrnModalOpen(false);
        setActiveGrnPo(null);
        setShortageCases('0');
        setShortageAmount('0');
        fetchPurchaseOrders();
      }
    } catch (err: any) {
      showAlert('GRN Error', err.message || 'Failed to complete GRN.', 'danger');
    } finally {
      setCompletingGrn(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedPoId(expandedPoId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Action Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#005f56]" />
            Purchase from Companies (Primary Inward)
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Primary Inbound PO, e-Invoice Import, e-Way Bill tracking &amp; Warehouse GRN Inwarding
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Company Filter */}
          <select
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
              setGlobalCompany(e.target.value as any);
            }}
            className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-2.5 py-1.5 text-slate-700 outline-none focus:border-[#005f56]"
          >
            <option value="All">All Companies</option>
            <option value="Company A">Company A (Personal Care)</option>
            <option value="Company B">Company B (Foods &amp; Confectionery)</option>
            <option value="Company C">Company C (Beverages)</option>
            <option value="Company D">Company D (Home Care)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-[12px] bg-white border border-[#d1d5db] rounded-[6px] px-2.5 py-1.5 text-slate-700 outline-none focus:border-[#005f56]"
          >
            <option value="All">All Statuses</option>
            <option value="Goods in Transit">Goods in Transit</option>
            <option value="GRN Completed">GRN Completed</option>
            <option value="GRN Completed (Shortage Claimed)">Shortage Claimed</option>
            <option value="Settled & Paid">Settled &amp; Paid</option>
          </select>

          <button
            onClick={fetchPurchaseOrders}
            title="Refresh"
            className="p-1.5 bg-white border border-[#d1d5db] rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsPoModalOpen(true)}
            className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Primary PO</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards with Info Hover Tooltips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* KPI 1: Pending Inbound POs */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Pending Inbound POs
            </div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Pending Inbound POs</span>
                <span>Total invoice valuation of primary consignments dispatched by FMCG companies currently on trucks in transit to your warehouse.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">
            ₹{((summary?.pendingInboundValue || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-[#005f56] font-medium flex items-center gap-1 mt-0.5">
            <Truck className="w-3 h-3 inline" />
            <span>In Transit (Awaiting GRN Inward)</span>
          </div>
        </div>

        {/* KPI 2: MTD Primary Purchases */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              MTD Primary Purchases
            </div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Month-To-Date (MTD) Primary Inward</span>
                <span>Cumulative gross purchase procurement value billed by principal manufacturing plants to this distributor depot in the current month.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">
            ₹{((summary?.mtdPurchasesValue || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across All Registered Principals</div>
        </div>

        {/* KPI 3: GSTR-2B ITC Matching */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">
              GSTR-2B ITC Matching
            </div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-emerald-500 hover:text-emerald-700 transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-emerald-400">GSTR-2B Input Tax Credit (ITC)</span>
                <span>Automated reconciliation score matching e-Invoices uploaded by FMCG manufacturers on the GST portal against inward GRNs.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-emerald-700 mt-1 font-mono">
            {summary?.itcMatchRate || 98.6}%
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 inline" />
            <span>High ITC Compliance</span>
          </div>
        </div>

        {/* KPI 4: Shortage Debit Notes */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-amber-700 uppercase font-bold tracking-wider">
              Shortage Debit Notes
            </div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-amber-500 hover:text-amber-700 transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-amber-400">Transit Shortage / Transit Breakage</span>
                <span>Short shipments detected during physical gate unloading. Automated Debit Notes are raised against the company transporter.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-amber-700 mt-1 font-mono">
            ₹{(summary?.shortageTotal || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
            Auto-linked to Company Claims
          </div>
        </div>
      </div>

      {/* Primary Inbound Purchase Register Table */}
      <div className="erp-card overflow-hidden bg-white border border-slate-200 rounded-lg shadow-2xs">
        <div className="p-3 border-b border-[#e5e7eb] bg-white flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-bold text-[#111827]">Primary Inbound Orders Register</h3>
            <span className="text-[11px] text-[#6b7280]">Real-time stock procurement records linked to Neon Database</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Total {orders.length} Consignments Recorded
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#f9fafb] table-header border-b border-[#e5e7eb]">
              <tr>
                <th className="py-2.5 px-3">PO Number</th>
                <th className="py-2.5 px-3">Company / Principal</th>
                <th className="py-2.5 px-3">Order Date</th>
                <th className="py-2.5 px-3">Expected / GRN Date</th>
                <th className="py-2.5 px-3 text-center">Items</th>
                <th className="py-2.5 px-3 text-right">Gross Value</th>
                <th className="py-2.5 px-3">e-Invoice IRN &amp; e-Way Bill</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#005f56]" />
                    <span>Loading live purchase records...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No purchase orders found matching selected filters.
                  </td>
                </tr>
              ) : (
                orders.map((po) => (
                  <React.Fragment key={po.id}>
                    <tr className="hover:bg-[#fafafa] transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[#111827]">
                        <button
                          onClick={() => toggleExpand(po.id)}
                          className="flex items-center gap-1.5 text-[#005f56] hover:underline font-mono text-[11px] cursor-pointer"
                        >
                          {po.id}
                          {expandedPoId === po.id ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-[#111827]">{po.company}</td>
                      <td className="py-2.5 px-3 text-[#6b7280]">{po.orderDate}</td>
                      <td className="py-2.5 px-3 text-[#6b7280]">
                        {po.grnDate ? (
                          <span className="text-emerald-700 font-medium">Inward: {po.grnDate}</span>
                        ) : (
                          <span>ETA: {po.expectedDelivery}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[#4b5563]">
                        {po.itemsCount} SKUs
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#111827]">
                        ₹{po.grossValue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-mono text-[10px] text-slate-600">
                          <div>IRN: {po.eInvoiceIrn}</div>
                          {po.eWayBill && <div className="text-slate-400">{po.eWayBill}</div>}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                            po.status.includes('Completed') && !po.status.includes('Shortage')
                              ? 'bg-emerald-100 text-emerald-800'
                              : po.status.includes('Shortage')
                              ? 'bg-amber-100 text-amber-800'
                              : po.status.includes('Transit')
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {po.status}
                        </span>
                        {po.shortageAmount > 0 && (
                          <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                            Shortage: -₹{po.shortageAmount.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {po.status === 'Goods in Transit' ? (
                          <button
                            onClick={() => {
                              setActiveGrnPo(po);
                              setIsGrnModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[4px] cursor-pointer flex items-center gap-1 mx-auto shadow-xs"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Inward GRN</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Inwarded</span>
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Line Items Accordion */}
                    {expandedPoId === po.id && po.items && po.items.length > 0 && (
                      <tr className="bg-slate-50/70 border-b border-slate-200">
                        <td colSpan={9} className="p-3 pl-8">
                          <div className="bg-white rounded border border-slate-200 p-2.5 text-[11px]">
                            <div className="font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                              <Boxes className="w-3.5 h-3.5 text-[#005f56]" />
                              <span>Consignment Line Item SKUs &amp; Batch Allocation</span>
                            </div>
                            <table className="w-full text-left">
                              <thead className="border-b border-slate-200 text-slate-500 font-semibold text-[10px]">
                                <tr>
                                  <th className="py-1">SKU Description</th>
                                  <th className="py-1">Batch No</th>
                                  <th className="py-1 text-center">Ordered Cases</th>
                                  <th className="py-1 text-center">Received Cases</th>
                                  <th className="py-1 text-right">Unit Rate</th>
                                  <th className="py-1 text-right">Taxable Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {po.items.map((it, idx) => (
                                  <tr key={idx} className="text-slate-700">
                                    <td className="py-1 font-medium">{it.sku}</td>
                                    <td className="py-1 font-mono text-[10px] text-slate-500">{it.batchNo || 'Auto-assigned'}</td>
                                    <td className="py-1 text-center">{it.orderedCases}</td>
                                    <td className="py-1 text-center font-semibold text-[#005f56]">{it.receivedCases}</td>
                                    <td className="py-1 text-right font-mono">₹{it.unitRate.toFixed(2)}</td>
                                    <td className="py-1 text-right font-mono font-bold">₹{it.taxableAmount.toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Generate Primary Purchase Order */}
      {isPoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-[14px] text-slate-800 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#005f56]" />
                Generate Primary Purchase Order
              </h3>
              <button
                onClick={() => setIsPoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePoSubmit} className="p-4 space-y-3 text-[12px]">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">FMCG Principal / Company</label>
                <select
                  value={poCompany}
                  onChange={(e) => setPoCompany(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                >
                  <option value="Company A · Personal Care">Company A · Personal Care</option>
                  <option value="Company B · Foods & Confectionery">Company B · Foods &amp; Confectionery</option>
                  <option value="Company C · Beverages">Company C · Beverages</option>
                  <option value="Company D · Home Care">Company D · Home Care</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expected Delivery (ETA)</label>
                <input
                  type="text"
                  value={poExpectedDelivery}
                  onChange={(e) => setPoExpectedDelivery(e.target.value)}
                  placeholder="e.g. 15 Oct 2026"
                  required
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                />
              </div>

              <div className="border-t border-slate-200 pt-3">
                <label className="block font-semibold text-slate-700 mb-1">Product SKU</label>
                <input
                  type="text"
                  value={poSku}
                  onChange={(e) => setPoSku(e.target.value)}
                  placeholder="e.g. Premium CTC Tea 250 g"
                  required
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Order Quantity (Cases)</label>
                  <input
                    type="number"
                    min="1"
                    value={poCases}
                    onChange={(e) => setPoCases(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purchase Rate / Case (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={poRate}
                    onChange={(e) => setPoRate(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono font-semibold">
                    ₹{((parseInt(poCases, 10) || 0) * (parseFloat(poRate) || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Est. GST (18%):</span>
                  <span className="font-mono font-semibold">
                    ₹{(Math.round((parseInt(poCases, 10) || 0) * (parseFloat(poRate) || 0) * 0.18)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                  <span>Total Gross PO Value:</span>
                  <span className="font-mono text-[#005f56]">
                    ₹{(Math.round((parseInt(poCases, 10) || 0) * (parseFloat(poRate) || 0) * 1.18)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPoModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPo}
                  className="px-3.5 py-1.5 bg-[#005f56] hover:bg-[#004e46] text-white rounded font-semibold cursor-pointer disabled:opacity-50"
                >
                  {creatingPo ? 'Transmitting PO...' : 'Dispatch Primary PO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Complete GRN Inward Stock */}
      {isGrnModalOpen && activeGrnPo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-[14px] text-slate-800 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-[#005f56]" />
                Inward Physical GRN: {activeGrnPo.id}
              </h3>
              <button
                onClick={() => setIsGrnModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCompleteGrnSubmit} className="p-4 space-y-3 text-[12px]">
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded text-[11px] text-emerald-800">
                Completing this GRN will automatically increment the Godown stock counts in the warehouse inventory database.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Consignment</label>
                <div className="text-slate-800 font-medium">{activeGrnPo.company}</div>
                <div className="text-slate-500 text-[11px]">Gross Invoice Value: ₹{activeGrnPo.grossValue.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shortage Cases (if any)</label>
                  <input
                    type="number"
                    min="0"
                    value={shortageCases}
                    onChange={(e) => setShortageCases(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                  />
                  <span className="text-[10px] text-slate-400">Damaged / Missing in truck</span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shortage Debit Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={shortageAmount}
                    onChange={(e) => setShortageAmount(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                  />
                  <span className="text-[10px] text-slate-400">Debit note claimed</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGrnModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={completingGrn}
                  className="px-3.5 py-1.5 bg-[#005f56] hover:bg-[#004e46] text-white rounded font-semibold cursor-pointer disabled:opacity-50"
                >
                  {completingGrn ? 'Inwarding Stock...' : 'Confirm GRN & Inward Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
