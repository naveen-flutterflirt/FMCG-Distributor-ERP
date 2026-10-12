'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCrm } from '@/context/CrmContext';

export default function DashboardPage() {
  const router = useRouter();
  const { scorecards } = useCrm();

  return (
    <div className="space-y-4">
      {/* 6 Top Metric Cards with clickable links to respective operational modules */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Secondary sales MTD */}
        <Link href="/orders" className="erp-card p-3.5 hover:border-[#005f56] transition-colors block cursor-pointer">
          <div className="text-[11px] text-[#6b7280]">Secondary sales MTD</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">₹1.94Cr</div>
          <div className="text-[11px] text-[#059669] font-medium mt-1">
            68% of target <span className="text-[#9ca3af]">·</span> day 9 of 26
          </div>
        </Link>

        {/* Card 2: Outlets billed */}
        <Link href="/outlets" className="erp-card p-3.5 hover:border-[#005f56] transition-colors block cursor-pointer">
          <div className="text-[11px] text-[#6b7280]">Outlets billed (UBO)</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">2,412</div>
          <div className="text-[11px] text-[#dc2626] font-medium mt-1">
            of 3,180 active
          </div>
        </Link>

        {/* Card 3: Lines per call */}
        <Link href="/field-team" className="erp-card p-3.5 hover:border-[#005f56] transition-colors block cursor-pointer">
          <div className="text-[11px] text-[#6b7280]">Lines per call</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">6.4</div>
          <div className="text-[11px] text-[#059669] font-medium mt-1 flex items-center gap-1">
            <span>▲ 0.5 vs last month</span>
          </div>
        </Link>

        {/* Card 4: Gross margin */}
        <Link href="/schemes" className="erp-card p-3.5 hover:border-[#005f56] transition-colors block cursor-pointer">
          <div className="text-[11px] text-[#6b7280]">Gross margin</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">9.6%</div>
          <div className="text-[11px] text-[#6b7280] mt-1">
            incl. claimable schemes
          </div>
        </Link>

        {/* Card 5: Retailer outstanding */}
        <Link href="/collections" className="erp-card p-3.5 hover:border-[#005f56] transition-colors block cursor-pointer">
          <div className="text-[11px] text-[#6b7280]">Retailer outstanding</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">₹62.4L</div>
          <div className="text-[11px] text-[#dc2626] font-medium mt-1">
            ₹9.8L over 21 days
          </div>
        </Link>

        {/* Card 6: Claims pending */}
        <Link href="/claims" className="erp-card p-3.5 hover:border-[#005f56] transition-colors block cursor-pointer">
          <div className="text-[11px] text-[#6b7280]">Claims pending</div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight">₹17.6L</div>
          <div className="text-[11px] text-[#dc2626] font-medium mt-1">
            ₹5.2L older than 60 d
          </div>
        </Link>
      </div>

      {/* Middle 3-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Column 1: Target vs achievement by company */}
        <div className="lg:col-span-4 erp-card p-4">
          <h3 className="text-[13px] font-bold text-[#111827] mb-3">
            Target vs achievement by company
          </h3>

          <div className="space-y-3 text-[12px]">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#374151]">Company A · personal care</span>
                <span className="font-bold text-[#111827]">72%</span>
              </div>
              <div className="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#005f56] h-full rounded-full" style={{ width: '72%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#374151]">Company B · foods</span>
                <span className="font-bold text-[#111827]">81%</span>
              </div>
              <div className="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#005f56] h-full rounded-full" style={{ width: '81%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#374151]">Company C · beverages</span>
                <span className="font-bold text-[#111827]">54%</span>
              </div>
              <div className="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#c2410c] h-full rounded-full" style={{ width: '54%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#374151]">Company D · home care</span>
                <span className="font-bold text-[#111827]">63%</span>
              </div>
              <div className="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#005f56] h-full rounded-full" style={{ width: '63%' }} />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#6b7280] mt-4 pt-2 border-t border-[#f3f4f6]">
            Expected by day 9: 35% (linear) — all on track except Company C
          </p>
        </div>

        {/* Column 2: Channel mix - MTD */}
        <div className="lg:col-span-4 erp-card p-4">
          <h3 className="text-[13px] font-bold text-[#111827] mb-3">
            Channel mix — MTD
          </h3>

          {/* Segmented bar chart matching screenshot */}
          <div className="w-full h-5 rounded-sm overflow-hidden flex mb-4">
            <div className="bg-[#005f56] h-full" style={{ width: '58%' }} title="General trade 58%" />
            <div className="bg-[#48b0a5] h-full" style={{ width: '16%' }} title="Van sales 16%" />
            <div className="bg-[#8ecbc3] h-full" style={{ width: '14%' }} title="Modern trade 14%" />
            <div className="bg-[#c27803] h-full" style={{ width: '8%' }} title="Wholesale 8%" />
            <div className="bg-[#d1d5db] h-full" style={{ width: '4%' }} title="HoReCa 4%" />
          </div>

          {/* Legend items */}
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-[11px] text-[#374151]">
            <div className="flex items-start gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#005f56] shrink-0 mt-0.5" />
              <span>General trade · pre-sell <strong>58%</strong></span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#48b0a5] shrink-0 mt-0.5" />
              <span>Van sales <strong>16%</strong></span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#8ecbc3] shrink-0 mt-0.5" />
              <span>Modern trade <strong>14%</strong></span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#c27803] shrink-0 mt-0.5" />
              <span>Wholesale <strong>8%</strong></span>
            </div>
            <div className="flex items-start gap-1.5 col-span-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#6b7280] shrink-0 mt-0.5" />
              <span>HoReCa / institutions <strong>4%</strong></span>
            </div>
          </div>
        </div>

        {/* Column 3: Yesterday's van settlement */}
        <div className="lg:col-span-4 erp-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-[#111827]">
              Yesterday&apos;s van settlement
            </h3>
            <Link
              href="/van-sales"
              className="text-[11px] text-[#005f56] hover:underline font-semibold cursor-pointer"
            >
              View desk →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-[#6b7280] border-b border-[#f3f4f6] pb-1.5">
                  <th className="pb-1.5 font-normal">Van</th>
                  <th className="pb-1.5 font-normal text-right">Sales</th>
                  <th className="pb-1.5 font-normal text-right">Cash due</th>
                  <th className="pb-1.5 font-normal text-right">Diff.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f9fafb]">
                <tr
                  onClick={() => router.push('/van-sales')}
                  className="hover:bg-[#fafafa] cursor-pointer"
                >
                  <td className="py-2 text-[#374151]">Van 1 · Suresh</td>
                  <td className="py-2 text-right font-medium text-[#111827]">₹1.42L</td>
                  <td className="py-2 text-right font-medium text-[#111827]">₹86,400</td>
                  <td className="py-2 text-right">
                    <span className="bg-[#dcfce7] text-[#15803d] font-bold px-1.5 py-0.5 rounded text-[10px]">
                      ₹0
                    </span>
                  </td>
                </tr>
                <tr
                  onClick={() => router.push('/van-sales')}
                  className="hover:bg-[#fafafa] cursor-pointer"
                >
                  <td className="py-2 text-[#374151]">Van 2 · Imran</td>
                  <td className="py-2 text-right font-medium text-[#111827]">₹1.18L</td>
                  <td className="py-2 text-right font-medium text-[#111827]">₹71,250</td>
                  <td className="py-2 text-right">
                    <span className="bg-[#fed7aa] text-[#c2410c] font-bold px-1.5 py-0.5 rounded text-[10px]">
                      −₹1,240
                    </span>
                  </td>
                </tr>
                <tr
                  onClick={() => router.push('/van-sales')}
                  className="hover:bg-[#fafafa] cursor-pointer"
                >
                  <td className="py-2 text-[#374151]">Van 3 · Deepak</td>
                  <td className="py-2 text-right font-medium text-[#111827]">₹0.96L</td>
                  <td className="py-2 text-right font-medium text-[#111827]">₹58,900</td>
                  <td className="py-2 text-right">
                    <span className="bg-[#dcfce7] text-[#15803d] font-bold px-1.5 py-0.5 rounded text-[10px]">
                      ₹0
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-[#6b7280] mt-3 pt-2 border-t border-[#f3f4f6]">
            Shortage recovered from salesman by default; owner can waive
          </p>
        </div>
      </div>

      {/* Bottom Section: Scorecard (Left) & Stock Alerts + Collected Yesterday (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Salesman scorecard - today (8 cols) */}
        <div className="lg:col-span-8 erp-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-[#111827]">
              Salesman scorecard — today
            </h3>
            <Link
              href="/field-team"
              className="text-[11px] text-[#005f56] hover:underline font-semibold cursor-pointer"
            >
              All salesmen →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="text-[#6b7280] border-b border-[#f3f4f6] pb-2 text-[11px]">
                  <th className="pb-2 font-normal">Salesman</th>
                  <th className="pb-2 font-normal">Beat</th>
                  <th className="pb-2 font-normal text-center">Visited</th>
                  <th className="pb-2 font-normal text-center">Productive</th>
                  <th className="pb-2 font-normal text-center">LPC</th>
                  <th className="pb-2 font-normal text-right">Sales</th>
                  <th className="pb-2 font-normal text-center">Must-sell</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f9fafb]">
                {scorecards.map((sm) => (
                  <tr
                    key={sm.id}
                    onClick={() => router.push('/field-team')}
                    className="hover:bg-[#fafafa] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-medium text-[#111827]">{sm.name.split(' ')[0]}</td>
                    <td className="py-2.5 text-[#4b5563]">{sm.beat.split(' ')[0]} {sm.beat.split(' ')[1] || ''}</td>
                    <td className="py-2.5 text-center font-bold text-[#111827]">{sm.visited}</td>
                    <td className="py-2.5 text-center font-bold text-[#111827]">{sm.productive}</td>
                    <td className="py-2.5 text-center font-bold text-[#111827]">{sm.lpc}</td>
                    <td className="py-2.5 text-right font-bold text-[#111827]">₹{sm.sales.toLocaleString()}</td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          sm.mustSell === '5/5'
                            ? 'bg-[#dcfce7] text-[#15803d]'
                            : 'bg-[#fef3c7] text-[#b45309]'
                        }`}
                      >
                        {sm.mustSell}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Stock Alerts + Collected Yesterday Card */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Stock Alerts Card */}
          <Link href="/godown" className="erp-card p-4 hover:border-[#005f56] transition-colors block cursor-pointer">
            <h3 className="text-[13px] font-bold text-[#111827] mb-2.5">
              Stock alerts
            </h3>

            <div className="space-y-1 text-[12px]">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#374151]">SKUs below 5 days cover</span>
                <span className="font-bold text-[#dc2626]">23</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#374151]">Near expiry (60 d)</span>
                <span className="font-bold text-[#111827]">₹2.9L</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#374151]">Damaged stock awaiting claim</span>
                <span className="font-bold text-[#111827]">₹1.4L</span>
              </div>
            </div>
          </Link>

          {/* Collected Yesterday Big Card */}
          <Link href="/accounts" className="bg-[#031c19] text-white p-4 rounded-[8px] flex items-center justify-between hover:bg-[#072723] transition-colors block cursor-pointer">
            <div className="text-[28px] font-bold text-white tracking-tight">
              ₹8.6L
            </div>
            <div className="text-right">
              <div className="text-[12px] font-bold text-white">Collected yesterday</div>
              <div className="text-[10px] text-[#9cb3af] mt-0.5">
                UPI 48% · cash 37% · cheque 15%
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
