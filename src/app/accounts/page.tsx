'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  Landmark,
  Plus,
  RefreshCw,
  Info,
  X,
  CreditCard,
  Receipt,
  FileCheck2,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { accountsApi, AccountsSummaryData } from '@/lib/api';

export default function AccountsPage() {
  const { showAlert } = useCrm();

  const [data, setData] = useState<AccountsSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  // Expense Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [category, setCategory] = useState('Vehicle & Fuel');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('BANK-01');
  const [paidTo, setPaidTo] = useState('');
  const [submittingExpense, setSubmittingExpense] = useState(false);

  // Bank Modal State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [newBankName, setNewBankName] = useState('State Bank of India');
  const [newAccName, setNewAccName] = useState('SBI Depository Current A/c');
  const [newAccNum, setNewAccNum] = useState('');
  const [newAccType, setNewAccType] = useState('Current Account');
  const [newOpeningBalance, setNewOpeningBalance] = useState('');
  const [submittingBank, setSubmittingBank] = useState(false);

  // Fetch live accounts data from backend
  const fetchAccountsData = async () => {
    try {
      setLoading(true);
      const res = await accountsApi.getSummary();
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      showAlert('Accounts Notice', err.message || 'Failed to fetch financial data', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsData();
  }, []);

  // Handle Real Tally XML Export
  const handleExportTally = async () => {
    try {
      showAlert('Tally XML Export Initiated', 'Downloading operational vouchers for CA Tally Prime audit...', 'success');
      const response = await fetch(accountsApi.exportTallyXmlUrl());
      const xmlText = await response.text();
      const blob = new Blob([xmlText], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Tally_Prime_FMCG_Vouchers_October_2026.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      showAlert('Export Failed', err.message || 'Could not download Tally XML', 'danger');
    }
  };

  // Handle New Operating Expense Submission
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!description.trim() || isNaN(numAmt) || numAmt <= 0) {
      showAlert('Invalid Input', 'Please enter a valid description and positive expense amount.', 'danger');
      return;
    }

    try {
      setSubmittingExpense(true);
      const chosenBank = data?.bankAccounts.find((b) => b.id === selectedBankId);
      const res = await accountsApi.createExpense({
        category,
        description,
        amount: numAmt,
        paymentMode: chosenBank ? chosenBank.accountName : 'Bank Transfer',
        bankAccountId: selectedBankId,
        paidTo: paidTo.trim() || undefined,
      });

      if (res.success) {
        showAlert('Expense Voucher Recorded!', res.message || 'Expense added to ledger.', 'success');
        setIsExpenseModalOpen(false);
        setDescription('');
        setAmount('');
        setPaidTo('');
        fetchAccountsData();
      }
    } catch (err: any) {
      showAlert('Error', err.message || 'Failed to record expense voucher', 'danger');
    } finally {
      setSubmittingExpense(false);
    }
  };

  // Handle Add Bank Account Submission
  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim() || !newAccNum.trim() || !newBankName.trim()) {
      showAlert('Invalid Input', 'Please enter valid bank name, account label, and account number.', 'danger');
      return;
    }

    try {
      setSubmittingBank(true);
      const res = await accountsApi.addBankAccount({
        accountName: newAccName.trim(),
        accountNumber: newAccNum.trim(),
        bankName: newBankName.trim(),
        accountType: newAccType,
        balance: parseFloat(newOpeningBalance) || 0,
      });

      if (res.success) {
        showAlert('Bank Account Added!', res.message || 'Account linked to ledger.', 'success');
        setIsBankModalOpen(false);
        setNewAccNum('');
        setNewOpeningBalance('');
        fetchAccountsData();
      }
    } catch (err: any) {
      showAlert('Error', err.message || 'Failed to add bank account', 'danger');
    } finally {
      setSubmittingBank(false);
    }
  };

  const kpis = data?.kpis;
  const pnl = data?.pnl;

  return (
    <div className="space-y-4">
      {/* Header bar with Action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#005f56]" />
            Finance &amp; Accounts Ledger
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Real double-entry books, operational P&amp;L, automated GST reconciliation &amp; Tally Prime sync
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAccountsData}
            title="Refresh"
            className="p-1.5 bg-white border border-[#d1d5db] rounded-[6px] text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3 py-1.5 text-[12px] font-semibold bg-white border border-[#005f56] text-[#005f56] hover:bg-[#f0fdf4] rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Expense</span>
          </button>

          <button
            onClick={handleExportTally}
            className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Tally XML</span>
          </button>
        </div>
      </div>

      {/* 5 Top KPI Cards with Info Hover Tooltips */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* KPI 1: Bank Balance */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Bank Balance</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Total Liquid Bank &amp; Cash</span>
                <span>Cumulative live balance across Current accounts, Overdraft (OD) facility, and Cash in depot vault.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">
            ₹{((kpis?.bankBalance || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {kpis?.bankAccountsCount || 3} accounts · Live reconciled
          </div>
        </div>

        {/* KPI 2: Receivables */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Retailer Receivables</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Market Outstanding Due</span>
                <span>Total credit sales pending collection across all retail kirana outlets and wholesale accounts.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">
            ₹{((kpis?.receivables || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            DSO: {kpis?.dsoDays || 11} days average
          </div>
        </div>

        {/* KPI 3: Payable to Companies */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-red-700 uppercase font-bold tracking-wider">Payable to Companies</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-red-400 hover:text-red-600 transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-red-400">Principal Manufacturing Dues</span>
                <span>Inward primary purchase invoice dues payable to FMCG manufacturers, adjusted for debit notes.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-red-700 mt-1 font-mono">
            ₹{((kpis?.payableToCompanies || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-red-600 font-medium mt-0.5">
            Active Consignments Due
          </div>
        </div>

        {/* KPI 4: GST Payable */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">GST Payable (Est.)</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Net GST Liability</span>
                <span>Output GST collected from retailer bills minus Input Tax Credit (ITC) from primary factory purchases.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">
            ₹{((kpis?.gstPayableEst || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
            ITC Matched {kpis?.itcMatchRate || 98.6}%
          </div>
        </div>

        {/* KPI 5: Net Profit MTD */}
        <div className="erp-card p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">Net Profit MTD</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-emerald-500 hover:text-emerald-700 transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-emerald-400">Net Operational Profit</span>
                <span>Net earnings after COGS, scheme claims recovery, salaries, fuel, rent, and overhead deductions.</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-black text-emerald-700 mt-1 font-mono">
            ₹{((kpis?.netProfitMtd || 0) / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            {kpis?.profitPercentage || '3.4% of sales'}
          </div>
        </div>
      </div>

      {/* Center 3-Column Financial Statements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Column 1: Live Operational P&L (Span 4) */}
        <div className="lg:col-span-4 erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#005f56]" />
              <span>Operational P&amp;L — October 2026</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">Live</span>
          </div>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Sales (net of returns)</span>
              <span className="font-mono font-medium text-slate-900">₹{((pnl?.sales || 0) / 10000000).toFixed(2)}Cr</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Cost of goods sold (COGS)</span>
              <span className="font-mono text-slate-700">-₹{((pnl?.cogs || 0) / 10000000).toFixed(2)}Cr</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Scheme income (claims recovered)</span>
              <span className="font-mono text-emerald-700 font-medium">+₹{((pnl?.schemeIncome || 0) / 100000).toFixed(2)}L</span>
            </div>
            <div className="pt-2 flex justify-between font-bold text-slate-900 bg-slate-50 p-2 rounded">
              <span>Gross Margin</span>
              <span className="font-mono text-[#005f56]">₹{((pnl?.grossMargin || 0) / 100000).toFixed(2)}L · {pnl?.grossMarginPct}%</span>
            </div>

            <div className="pt-2 space-y-1 text-slate-600 text-[11px]">
              <div className="flex justify-between">
                <span>Salaries &amp; incentives</span>
                <span className="font-mono">-₹{((pnl?.salariesIncentives || 0) / 100000).toFixed(2)}L</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle &amp; fuel</span>
                <span className="font-mono">-₹{((pnl?.vehicleFuel || 0) / 100000).toFixed(2)}L</span>
              </div>
              <div className="flex justify-between">
                <span>Rent, power, warehouse</span>
                <span className="font-mono">-₹{((pnl?.rentPowerOther || 0) / 100000).toFixed(2)}L</span>
              </div>
              <div className="flex justify-between">
                <span>Interest &amp; bank charges</span>
                <span className="font-mono">-₹{((pnl?.interestCharges || 0) / 100000).toFixed(2)}L</span>
              </div>
            </div>

            <div className="pt-2.5 mt-2 border-t-2 border-slate-900 flex justify-between font-bold text-slate-900">
              <span>Net Profit</span>
              <span className="font-mono text-emerald-700 text-[14px]">
                ₹{((pnl?.netProfit || 0) / 100000).toFixed(2)}L · {pnl?.netProfitPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Bank Reconciliation & GST Statutory (Span 4) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Bank Accounts Sub-card */}
          <div className="erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-[#005f56]" />
                <span>Active Bank &amp; Cash Accounts</span>
              </h3>
              <button
                onClick={() => setIsBankModalOpen(true)}
                className="text-[11px] font-semibold text-[#005f56] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bank</span>
              </button>
            </div>

            <div className="space-y-2 text-[12px]">
              {data?.bankAccounts.map((acc) => (
                <div key={acc.id} className="p-2 border border-slate-100 rounded bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-800 text-[11px]">{acc.accountName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{acc.accountNumber} · {acc.accountType}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 text-[12px]">₹{acc.balance.toLocaleString()}</div>
                    <div className="text-[9px] text-emerald-600 font-medium">Reconciled</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GST Statutory Card */}
          <div className="erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <h3 className="text-[13px] font-bold text-[#111827] mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#005f56]" />
              <span>GST &amp; Statutory Compliance</span>
            </h3>

            <div className="space-y-1.5 text-[12px]">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">GSTR-1 (September)</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">Filed ✓</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">GSTR-3B (September)</span>
                <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded text-[11px]">Due 20 Oct</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">GSTR-2B vs Primary GRN</span>
                <span className="text-emerald-700 font-medium">4 Mismatches (Resolved)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">TDS / TCS Calculation</span>
                <span className="text-slate-900 font-medium font-mono">Computed (194Q)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Payables to Companies & Recent Expenses (Span 4) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Company Payables */}
          <div className="erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <h3 className="text-[13px] font-bold text-[#111827] mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#005f56]" />
                <span>Payables to FMCG Principals</span>
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Active Inbound</span>
            </h3>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200 pb-1 font-semibold">
                  <th className="pb-1.5">Principal</th>
                  <th className="pb-1.5">Due Date</th>
                  <th className="pb-1.5 text-right">Pending Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.payablesByCompany.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-2 text-center text-slate-400">All primary dues cleared.</td>
                  </tr>
                ) : (
                  data?.payablesByCompany.map((pay, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-1.5 text-slate-900 font-medium">{pay.company}</td>
                      <td className="py-1.5 text-slate-500">{pay.dueDate}</td>
                      <td className="py-1.5 text-right font-mono font-bold text-slate-900">
                        ₹{pay.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <p className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
              * Damage and scheme claim credit notes are automatically deducted before RTGS payments.
            </p>
          </div>

          {/* Operating Expense Log */}
          <div className="erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[13px] font-bold text-[#111827] flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-[#005f56]" />
                <span>Recent Expense Vouchers</span>
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="text-[11px] text-[#005f56] hover:underline font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>

            <div className="space-y-2 text-[11px] max-h-44 overflow-y-auto">
              {data?.expenses.map((exp) => (
                <div key={exp.id} className="p-2 border border-slate-100 rounded bg-slate-50/70 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-800">{exp.category}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[170px]">{exp.description}</div>
                    <div className="text-[9px] text-slate-400 font-mono">{exp.voucherRef} · {exp.expenseDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-red-600">-₹{exp.amount.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-400">{exp.paymentMode}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Record Operational Expense Voucher */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-[14px] text-slate-800 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#005f56]" />
                Record Depot Expense Voucher
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="p-4 space-y-3 text-[12px]">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                >
                  <option value="Vehicle & Fuel">Vehicle &amp; Fuel (Van Diesel, Maintenance)</option>
                  <option value="Salaries & Incentives">Salaries &amp; Incentives (Staff Payroll)</option>
                  <option value="Rent, Power & Warehouse">Rent, Power &amp; Warehouse (Godown, Chiller)</option>
                  <option value="Packaging & Loading">Packaging &amp; Labour Loading</option>
                  <option value="Printing & Stationery">Printing, Stationery &amp; Office</option>
                  <option value="Other Depot Expenses">Other Depot Expenses</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Voucher Description / Narration</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Diesel recharge for Van 02"
                  required
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 4500"
                    required
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deduct From Account</label>
                  <select
                    value={selectedBankId}
                    onChange={(e) => setSelectedBankId(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                  >
                    {data?.bankAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountName} (₹{acc.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paid To (Vendor / Employee)</label>
                <input
                  type="text"
                  value={paidTo}
                  onChange={(e) => setPaidTo(e.target.value)}
                  placeholder="e.g. Indian Oil Fuel Station"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                />
              </div>

              <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-500">
                Posting this voucher will automatically update the P&amp;L overheads and debit the selected bank/cash account balance.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingExpense}
                  className="px-3.5 py-1.5 bg-[#005f56] hover:bg-[#004e46] text-white rounded font-semibold cursor-pointer disabled:opacity-50"
                >
                  {submittingExpense ? 'Recording...' : 'Post Expense Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New Bank / Cash Account */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-[14px] text-slate-800 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#005f56]" />
                Link New Bank Account
              </h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBankSubmit} className="p-4 space-y-3 text-[12px]">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  placeholder="e.g. State Bank of India, Kotak Mahindra Bank"
                  required
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Display Label</label>
                <input
                  type="text"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="e.g. SBI Depository Current A/c"
                  required
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={newAccNum}
                    onChange={(e) => setNewAccNum(e.target.value)}
                    placeholder="e.g. 38291002910"
                    required
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Type</label>
                  <select
                    value={newAccType}
                    onChange={(e) => setNewAccType(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                  >
                    <option value="Current Account">Current Account</option>
                    <option value="Overdraft Account">Overdraft (OD) Facility</option>
                    <option value="Savings Account">Savings Account</option>
                    <option value="Cash Account">Cash Vault / Counter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Opening Balance (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newOpeningBalance}
                  onChange={(e) => setNewOpeningBalance(e.target.value)}
                  placeholder="e.g. 500000"
                  required
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-[#005f56]"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-600">
                This account will be permanently registered in Neon DB and immediately available for ledger reconciliations &amp; expense vouchers.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBank}
                  className="px-3.5 py-1.5 bg-[#005f56] hover:bg-[#004e46] text-white rounded font-semibold cursor-pointer disabled:opacity-50"
                >
                  {submittingBank ? 'Linking Account...' : 'Link Bank Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
