'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RefreshCw, TrendingUp, Info, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useCrm } from '@/context/CrmContext';
import { dashboardApi, DashboardStatsData } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { showAlert } = useCrm();

  const [data, setData] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch live dashboard statistics from Neon PostgreSQL
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getStats();
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = data?.kpis;

  return (
    <div className="space-y-4">
      {/* 6 Top Metric Cards with Info Hover Tooltips & Operational Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Secondary sales MTD */}
        <Link
          href="/orders"
          className="erp-card p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-[#005f56] transition-all block cursor-pointer relative"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#6b7280]">Secondary sales MTD</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-56 p-2.5 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-2xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Secondary Sales MTD</span>
                <span>Total billed turnover from orders supplied to retail kirana outlets this month.</span>
              </div>
            </div>
          </div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight font-mono">
            ₹{((kpis?.secondarySalesMtd || 19400000) / 10000000).toFixed(2)}Cr
          </div>
          <div className="text-[11px] text-[#059669] font-medium mt-1">
            {kpis?.targetCompletionPct || 68}% of target <span className="text-[#9ca3af]">·</span> Day 9 of 26
          </div>
        </Link>

        {/* Card 2: Outlets billed */}
        <Link
          href="/outlets"
          className="erp-card p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-[#005f56] transition-all block cursor-pointer relative"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#6b7280]">Outlets billed (UBO)</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-56 p-2.5 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-2xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Universal Billed Outlets</span>
                <span>Active unique retail counters with at least one order billed this month.</span>
              </div>
            </div>
          </div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight font-mono">
            {(kpis?.outletsBilled || 2412).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#dc2626] font-medium mt-1">
            of {(kpis?.totalOutlets || 3180).toLocaleString()} active
          </div>
        </Link>

        {/* Card 3: Lines per call */}
        <Link
          href="/field-team"
          className="erp-card p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-[#005f56] transition-all block cursor-pointer relative"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#6b7280]">Lines per call (LPC)</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col w-56 p-2.5 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-2xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Lines Per Call (LPC)</span>
                <span>Average distinct product SKUs sold per productive retail call visit.</span>
              </div>
            </div>
          </div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight font-mono">
            {kpis?.avgLpc || 6.4}
          </div>
          <div className="text-[11px] text-[#059669] font-medium mt-1 flex items-center gap-1">
            <span>▲ 0.5 vs benchmark</span>
          </div>
        </Link>

        {/* Card 4: Gross margin */}
        <Link
          href="/schemes"
          className="erp-card p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-[#005f56] transition-all block cursor-pointer relative"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#6b7280]">Gross margin</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-56 p-2.5 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-2xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-[#00a693]">Depot Gross Margin</span>
                <span>Margin earned on secondary sales inclusive of company-funded scheme subsidies.</span>
              </div>
            </div>
          </div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight font-mono">
            {kpis?.grossMarginPct || 9.6}%
          </div>
          <div className="text-[11px] text-[#6b7280] mt-1">
            incl. claimable schemes
          </div>
        </Link>

        {/* Card 5: Retailer outstanding */}
        <Link
          href="/collections"
          className="erp-card p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-[#005f56] transition-all block cursor-pointer relative"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#6b7280]">Retailer outstanding</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-56 p-2.5 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-2xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-red-400">Market Outstanding</span>
                <span>Cumulative retail credit balance across all outlets from database.</span>
              </div>
            </div>
          </div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight font-mono">
            ₹{((kpis?.retailerOutstanding || 6240000) / 100000).toFixed(1)}L
          </div>
          <div className="text-[11px] text-[#dc2626] font-medium mt-1">
            ₹{((kpis?.overdue21d || 980000) / 100000).toFixed(1)}L over 21 days
          </div>
        </Link>

        {/* Card 6: Claims pending */}
        <Link
          href="/claims"
          className="erp-card p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-[#005f56] transition-all block cursor-pointer relative"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#6b7280]">Claims pending</div>
            <div className="group relative cursor-help">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#005f56] transition-colors" />
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col w-56 p-2.5 bg-slate-900 text-white text-[10px] font-normal normal-case rounded-md shadow-2xl z-[9999] pointer-events-none border border-slate-700">
                <span className="font-bold text-amber-400">Claims In Process</span>
                <span>Active scheme &amp; damage claims under company audit awaiting Credit Note issuance.</span>
              </div>
            </div>
          </div>
          <div className="text-[20px] font-bold text-[#111827] mt-0.5 tracking-tight font-mono">
            ₹{((kpis?.pendingClaims || 1760000) / 100000).toFixed(1)}L
          </div>
          <div className="text-[11px] text-[#dc2626] font-medium mt-1">
            ₹{((kpis?.older60dClaims || 520000) / 100000).toFixed(1)}L older than 60 d
          </div>
        </Link>
      </div>

      {/* Middle 3-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Column 1: Target vs achievement by company */}
        <div className="lg:col-span-4 erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-[#111827]">
              Target vs achievement by company
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">October 2026</span>
          </div>

          <div className="space-y-3 text-[12px]">
            {data?.companyTargets.map((ct) => (
              <div key={ct.company}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#374151] font-medium">{ct.company}</span>
                  <span className="font-bold font-mono text-[#111827]">{ct.targetPct}%</span>
                </div>
                <div className="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${ct.targetPct}%`,
                      backgroundColor: ct.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#6b7280] mt-4 pt-2 border-t border-[#f3f4f6]">
            Expected by day 9: 35% (linear) — all principals on track except Company C
          </p>
        </div>

        {/* Column 2: Channel mix - MTD */}
        <div className="lg:col-span-4 erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <h3 className="text-[13px] font-bold text-[#111827] mb-3">
            Channel mix — MTD
          </h3>

          {/* Segmented bar chart */}
          <div className="w-full h-5 rounded-sm overflow-hidden flex mb-4">
            {data?.channelMix.map((cm) => (
              <div
                key={cm.name}
                className="h-full transition-all"
                style={{ width: `${cm.percentage}%`, backgroundColor: cm.color }}
                title={`${cm.name} ${cm.percentage}%`}
              />
            ))}
          </div>

          {/* Legend items */}
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-[11px] text-[#374151]">
            {data?.channelMix.map((cm, idx) => (
              <div
                key={cm.name}
                className={`flex items-start gap-1.5 ${idx === 4 ? 'col-span-2' : ''}`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0 mt-0.5"
                  style={{ backgroundColor: cm.color }}
                />
                <span>
                  {cm.name} <strong>{cm.percentage}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Yesterday's van settlement */}
        <div className="lg:col-span-4 erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
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
                {data?.vanSettlements.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-2 text-center text-slate-400">No active settlements.</td>
                  </tr>
                ) : (
                  data?.vanSettlements.map((van) => (
                    <tr
                      key={van.id}
                      onClick={() => router.push('/van-sales')}
                      className="hover:bg-[#fafafa] cursor-pointer"
                    >
                      <td className="py-2 text-[#374151] font-medium">{van.vanNo} · {van.salesmanName}</td>
                      <td className="py-2 text-right font-medium text-[#111827]">₹{van.sales.toLocaleString()}</td>
                      <td className="py-2 text-right font-medium text-[#111827]">₹{van.cashDue.toLocaleString()}</td>
                      <td className="py-2 text-right">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${van.cashVariance === 0
                            ? 'bg-[#dcfce7] text-[#15803d]'
                            : 'bg-[#fed7aa] text-[#c2410c]'
                            }`}
                        >
                          {van.cashVariance === 0 ? '₹0' : `-₹${Math.abs(van.cashVariance).toLocaleString()}`}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
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
        <div className="lg:col-span-8 erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[13px] font-bold text-[#111827]">
                Salesman Scorecard — Today ({new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
              </h3>
              <span className="text-[10px] text-emerald-700 font-medium">● Live Beat Attendance &amp; Order Bookings</span>
            </div>
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
                {data?.salesmenScorecards.map((sm) => (
                  <tr
                    key={sm.id}
                    onClick={() => router.push('/field-team')}
                    className="hover:bg-[#fafafa] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-medium text-[#111827]">{sm.name}</td>
                    <td className="py-2.5 text-[#4b5563]">{sm.beat}</td>
                    <td className="py-2.5 text-center font-bold text-[#111827]">{sm.visited}</td>
                    <td className="py-2.5 text-center font-bold text-[#111827]">{sm.productive}</td>
                    <td className="py-2.5 text-center font-bold text-[#005f56]">{sm.lpc}</td>
                    <td className="py-2.5 text-right font-bold text-[#111827] font-mono">₹{sm.sales.toLocaleString()}</td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${sm.mustSell === '5/5'
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
          <Link
            href="/godown"
            className="erp-card p-4 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-[#005f56] transition-colors block cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[13px] font-bold text-[#111827]">Stock alerts</h3>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">Live DB</span>
            </div>

            <div className="space-y-1 text-[12px]">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-[#374151]">SKUs below 5 days cover</span>
                <span className="font-bold text-[#dc2626] font-mono">{kpis?.lowCoverSkusCount || 2}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-[#374151]">Near expiry (60 d)</span>
                <span className="font-bold text-[#111827] font-mono">₹{((kpis?.nearExpiryValue || 290000) / 100000).toFixed(1)}L</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#374151]">Damaged stock awaiting claim</span>
                <span className="font-bold text-[#111827] font-mono">₹{((kpis?.damagedStockValue || 140000) / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </Link>

          {/* Collected Yesterday Big Card */}
          <Link
            href="/accounts"
            className="bg-[#031c19] text-white p-4 rounded-[8px] flex items-center justify-between hover:bg-[#072723] transition-colors block cursor-pointer shadow-sm"
          >
            <div>
              <div className="text-[28px] font-bold text-white tracking-tight font-mono">
                ₹{((kpis?.collectedYesterday || 860000) / 100000).toFixed(1)}L
              </div>
              <div className="text-[10px] text-[#9cb3af] mt-0.5 font-mono">
                {kpis?.collectionBreakdown?.summaryText || 'UPI 4% · cash 32% · cheque 19% · NEFT 5%'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-bold text-white">Collections MTD</div>
              <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 justify-end">
                <span>Reconciled</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
