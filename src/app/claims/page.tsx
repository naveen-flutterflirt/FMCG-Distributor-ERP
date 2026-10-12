'use client';

import React from 'react';
import { useCrm } from '@/context/CrmContext';

export default function ClaimsPage() {
  const { claims, activeClaimId, setActiveClaimId, resolveClaimQuery } = useCrm();

  return (
    <div className="space-y-4">
      {/* 5 Top KPI Cards matching Page 7 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="erp-card p-3.5">
          <div className="text-[11px] text-[#6b7280]">Claims raised YTD</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">₹1.12Cr</div>
          <div className="text-[11px] text-[#6b7280] mt-1">6 companies</div>
        </div>

        <div className="erp-card p-3.5">
          <div className="text-[11px] text-[#6b7280]">Settled</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">₹94.4L</div>
          <div className="text-[11px] text-[#059669] font-medium mt-1">84% recovery</div>
        </div>

        <div className="erp-card p-3.5">
          <div className="text-[11px] text-[#6b7280]">Pending</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">₹17.6L</div>
          <div className="text-[11px] text-[#dc2626] font-medium mt-1">₹5.2L &gt; 60 days</div>
        </div>

        <div className="erp-card p-3.5">
          <div className="text-[11px] text-[#6b7280]">Not yet raised</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">₹3.8L</div>
          <div className="text-[11px] text-[#6b7280] mt-1">September schemes</div>
        </div>

        <div className="erp-card p-3.5">
          <div className="text-[11px] text-[#6b7280]">Rejected YTD</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">₹1.9L</div>
          <div className="text-[11px] text-[#dc2626] font-medium mt-1">mostly late filing</div>
        </div>
      </div>

      {/* Center Section: Claims register (Left) | Evidence pack & Active schemes (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Claims register */}
        <div className="lg:col-span-7 erp-card p-4">
          <h3 className="text-[13px] font-bold text-[#111827] mb-3">
            Claims register
          </h3>

          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="text-[#6b7280] border-b border-[#f3f4f6] pb-1.5">
                <th className="pb-1.5 font-normal">Claim</th>
                <th className="pb-1.5 font-normal">Company</th>
                <th className="pb-1.5 font-normal">Type</th>
                <th className="pb-1.5 font-normal">Period</th>
                <th className="pb-1.5 font-normal text-right">Amount</th>
                <th className="pb-1.5 font-normal text-center">Age</th>
                <th className="pb-1.5 font-normal text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f9fafb]">
              {claims.map((claim) => (
                <tr
                  key={claim.id}
                  onClick={() => setActiveClaimId(claim.id)}
                  className={`cursor-pointer ${
                    activeClaimId === claim.id ? 'bg-[#f0fdf4]' : 'hover:bg-[#fafafa]'
                  }`}
                >
                  <td className="py-2 text-[#111827] font-medium">{claim.id}</td>
                  <td className="py-2 text-[#4b5563]">{claim.company}</td>
                  <td className="py-2 text-[#4b5563]">{claim.type}</td>
                  <td className="py-2 text-[#4b5563]">{claim.period}</td>
                  <td className="py-2 text-right font-medium text-[#111827]">
                    ₹{claim.amount.toLocaleString()}
                  </td>
                  <td className="py-2 text-center text-[#6b7280]">{claim.age} d</td>
                  <td className="py-2 text-center">
                    {claim.status === 'Submitted' && (
                      <span className="bg-[#ccfbf1] text-[#005f56] font-semibold px-1.5 py-0.5 rounded text-[10px]">
                        Submitted
                      </span>
                    )}
                    {claim.status === 'Query raised' && (
                      <span className="bg-[#fed7aa] text-[#c2410c] px-1.5 py-0.5 rounded text-[10px]">
                        Query raised
                      </span>
                    )}
                    {claim.status === 'Audit done' && (
                      <span className="bg-[#e9d5ff] text-[#7e22ce] px-1.5 py-0.5 rounded text-[10px]">
                        Audit done
                      </span>
                    )}
                    {claim.status === 'Credit note recd.' && (
                      <span className="bg-[#dcfce7] text-[#15803d] px-1.5 py-0.5 rounded text-[10px]">
                        Credit note recd.
                      </span>
                    )}
                    {claim.status === 'Overdue' && (
                      <span className="bg-[#fee2e2] text-[#b91c1c] px-1.5 py-0.5 rounded text-[10px]">
                        Overdue
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Evidence pack, Active schemes, Reminder */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Evidence pack */}
          <div className="erp-card p-4">
            <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
              Claim CL-26-086 · evidence pack
            </h3>

            <div className="space-y-2 text-[11px] text-[#374151]">
              <div className="flex justify-between items-center py-1 border-b border-[#f3f4f6]">
                <span>Invoice-wise free goods list</span>
                <span className="text-[#15803d] font-semibold">Auto</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f3f4f6]">
                <span>Outlet list with GSTIN</span>
                <span className="text-[#15803d] font-semibold">Auto</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f3f4f6]">
                <span>Scheme circular</span>
                <span className="text-[#005f56] font-semibold">Linked</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f3f4f6]">
                <span>Company&apos;s claim format</span>
                <span className="text-[#7e22ce] font-semibold">Generated</span>
              </div>
              <div className="flex justify-between items-center pt-1 text-[#c2410c]">
                <span>Query: 3 invoices outside period</span>
                <button
                  onClick={() => resolveClaimQuery('CL-26-086')}
                  className="bg-[#fed7aa] text-[#c2410c] font-semibold px-2 py-0.5 rounded hover:bg-[#fdba74] cursor-pointer"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>

          {/* Active schemes */}
          <div className="erp-card p-3.5">
            <h4 className="text-[12px] font-bold text-[#111827] mb-1">
              Active schemes · October · 41
            </h4>
            <p className="text-[11px] text-[#4b5563] leading-relaxed">
              Company A: QPS 2% on ₹5K+ · Company B: biscuits 12+1 · Company C: cooler display ₹500/outlet · Company D: combo detergent + bar
            </p>
          </div>

          {/* Reminder */}
          <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-[6px] text-[11px]">
            <span className="font-bold text-[#991b1b] block">Reminder</span>
            <span className="text-[#7f1d1d]">
              Company B claims close 15 days after month end — <strong>6 days left for September</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom 4 Cards matching Page 7 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="erp-card p-3.5">
          <h4 className="text-[12px] font-bold text-[#111827] mb-1">Scheme types</h4>
          <p className="text-[11px] text-[#6b7280]">
            Free goods · % / ₹ off · slab · QPS · combo · first-order · outlet-class
          </p>
        </div>

        <div className="erp-card p-3.5">
          <h4 className="text-[12px] font-bold text-[#111827] mb-1">Who funds it</h4>
          <p className="text-[11px] text-[#6b7280]">
            Company-funded (claimable) vs distributor-funded (own margin) — tagged on every line
          </p>
        </div>

        <div className="erp-card p-3.5">
          <h4 className="text-[12px] font-bold text-[#111827] mb-1">Budget control</h4>
          <p className="text-[11px] text-[#6b7280]">
            Company scheme budget per month; billing stops the scheme when it runs out
          </p>
        </div>

        <div className="erp-card p-3.5">
          <h4 className="text-[12px] font-bold text-[#111827] mb-1">Claim types</h4>
          <p className="text-[11px] text-[#6b7280]">
            Scheme · damage &amp; expiry · price drop · display · transport · salesman salary support
          </p>
        </div>
      </div>
    </div>
  );
}
