'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { mockFinancials } from '@/data/mockData';
import { useCrm } from '@/context/CrmContext';

export default function AccountsPage() {
  const fin = mockFinancials;
  const { setNotification } = useCrm();

  const handleExportTally = () => {
    setNotification('Tally XML Vouchers generated for Chartered Accountant audit.');
    // Trigger file download
    const blob = new Blob(
      [
        `<?xml version="1.0" encoding="utf-8"?>\n<ENVELOPE>\n  <HEADER>\n    <TALLYREQUEST>Import Data</TALLYREQUEST>\n  </HEADER>\n  <BODY>\n    <IMPORTDATA>\n      <REQUESTDESC>\n        <REPORTNAME>Vouchers</REPORTNAME>\n      </REQUESTDESC>\n      <REQUESTDATA>\n        <TALLYMESSAGE xmlns:UDF="TallyUDF">\n          <VOUCHER VCHTYPE="Sales" ACTION="Create">\n            <DATE>20261009</DATE>\n            <NARRATION>Auto-posted from FMCG Distributor ERP</NARRATION>\n            <VOUCHERNUMBER>SO-61208</VOUCHERNUMBER>\n            <PARTYLEDGERNAME>Gupta Kirana Store</PARTYLEDGERNAME>\n            <AMOUNT>-6871.00</AMOUNT>\n          </VOUCHER>\n        </TALLYMESSAGE>\n      </REQUESTDATA>\n    </IMPORTDATA>\n  </BODY>\n</ENVELOPE>`,
      ],
      { type: 'application/xml' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Tally_Vouchers_Export_October_2026.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header bar with Tally Export action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[#111827]">
            Finance &amp; Accounts
          </h2>
          <p className="text-[12px] text-[#6b7280]">
            Real double-entry books, posted automatically from operations (Page 8 Blueprint).
          </p>
        </div>

        <button
          onClick={handleExportTally}
          className="px-3 py-1.5 text-[12px] font-semibold bg-[#005f56] hover:bg-[#004e46] text-white rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Tally XML</span>
        </button>
      </div>

      {/* 5 Top KPI Cards matching Page 8 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="erp-card p-3.5">
          <div className="text-[11px] text-[#6b7280]">Bank balance</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">{fin.bankBalance}</div>
          <div className="text-[11px] text-[#6b7280] mt-1">3 accounts · reconciled to 8 Oct</div>
        </div>

        <div className="erp-card p-3.5">
          <div className="text-[11px] text-[#6b7280]">Receivables</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">{fin.receivables}</div>
          <div className="text-[11px] text-[#6b7280] mt-1">DSO {fin.dsoDays} days</div>
        </div>

        <div className="erp-card p-3.5">
          <div className="text-[11px] text-[#6b7280]">Payable to companies</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">{fin.payableToCompanies}</div>
          <div className="text-[11px] text-[#dc2626] font-medium mt-1">₹38L due this week</div>
        </div>

        <div className="erp-card p-3.5">
          <div className="text-[11px] text-[#6b7280]">GST payable (Oct est.)</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">{fin.gstPayableOctEst}</div>
          <div className="text-[11px] text-[#059669] font-medium mt-1">ITC matched 98.6%</div>
        </div>

        <div className="erp-card p-3.5">
          <div className="text-[11px] text-[#6b7280]">Net profit MTD</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">{fin.netProfitMtd}</div>
          <div className="text-[11px] text-[#059669] font-medium mt-1">{fin.profitPercentage}</div>
        </div>
      </div>

      {/* Center 3-Column Grid matching Page 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Column 1: P&L - September */}
        <div className="lg:col-span-4 erp-card p-4">
          <h3 className="text-[13px] font-bold text-[#111827] mb-3">
            P&amp;L — September
          </h3>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">Sales (net of returns)</span>
              <span className="text-[#111827]">₹6.42Cr</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">Cost of goods sold</span>
              <span className="text-[#111827]">₹5.96Cr</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#374151]">Scheme income (claims)</span>
              <span className="text-[#111827]">₹0.18Cr</span>
            </div>
            <div className="pt-2 border-t border-[#f3f4f6] flex justify-between font-bold text-[#111827]">
              <span>Gross margin</span>
              <span>₹0.64Cr · 10.0%</span>
            </div>

            <div className="pt-2 space-y-1 text-[#4b5563]">
              <div className="flex justify-between">
                <span>Salaries &amp; incentives</span>
                <span>₹0.22Cr</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle &amp; fuel</span>
                <span>₹0.08Cr</span>
              </div>
              <div className="flex justify-between">
                <span>Rent, power, other</span>
                <span>₹0.07Cr</span>
              </div>
              <div className="flex justify-between">
                <span>Interest &amp; bank charges</span>
                <span>₹0.05Cr</span>
              </div>
            </div>

            <div className="pt-2.5 mt-1 border-t border-[#111827] flex justify-between font-bold text-[#111827]">
              <span>Net profit</span>
              <span>₹0.22Cr · 3.4%</span>
            </div>
          </div>
        </div>

        {/* Column 2: Bank reconciliation + GST & statutory */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="erp-card p-4">
            <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
              Bank reconciliation
            </h3>

            <div className="space-y-1 text-[12px]">
              <div className="flex justify-between py-0.5">
                <span className="text-[#374151]">Statement lines (8 Oct)</span>
                <span className="font-bold text-[#111827]">{fin.bankRecon.totalLines}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#374151]">Auto-matched</span>
                <span className="font-bold text-[#059669]">{fin.bankRecon.autoMatched}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#374151]">Needs review</span>
                <span className="font-bold text-[#dc2626]">{fin.bankRecon.needsReview}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#6b7280] mt-3 pt-2 border-t border-[#f3f4f6]">
              UPI and NEFT matched to retailer by reference; unidentified credits parked in suspense
            </p>
          </div>

          <div className="erp-card p-4">
            <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
              GST &amp; statutory
            </h3>

            <div className="space-y-1 text-[12px]">
              <div className="flex justify-between py-0.5">
                <span className="text-[#374151]">GSTR-1 (Sep)</span>
                <span className="text-[#059669] font-medium">Filed</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#374151]">GSTR-3B (Sep)</span>
                <span className="text-[#c2410c] font-medium">Due 20 Oct</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#374151]">GSTR-2B vs purchase</span>
                <span className="text-[#dc2626] font-medium">{fin.gstStatutory.gstr2bMismatches} mismatches</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#374151]">TDS / TCS</span>
                <span className="text-[#111827] font-medium">Computed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Payables to companies + Accounting features */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="erp-card p-4">
            <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
              Payables to companies
            </h3>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-[#6b7280] border-b border-[#f3f4f6] pb-1">
                  <th className="pb-1 font-normal">Company</th>
                  <th className="pb-1 font-normal">Due</th>
                  <th className="pb-1 font-normal text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f9fafb]">
                {fin.payablesByCompany.map((pay) => (
                  <tr key={pay.company}>
                    <td className="py-1.5 text-[#111827]">{pay.company}</td>
                    <td className="py-1.5 text-[#4b5563]">{pay.dueDate}</td>
                    <td className="py-1.5 text-right font-medium text-[#111827]">{pay.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-[11px] text-[#6b7280] mt-3 pt-2 border-t border-[#f3f4f6]">
              Claim credit notes adjusted before payment
            </p>
          </div>

          <div className="erp-card p-4">
            <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
              Accounting features
            </h3>

            <ul className="space-y-1.5 text-[11px] text-[#374151]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#6b7280]">•</span>
                <span>Chart of accounts, cost centres per company / route</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#6b7280]">•</span>
                <span>Day book, ledgers, trial balance, balance sheet</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#6b7280]">•</span>
                <span>Fixed assets &amp; depreciation (vans, racks)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#6b7280]">•</span>
                <span>Expense vouchers with photo receipts</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#6b7280]">•</span>
                <span>Period lock after month close</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
