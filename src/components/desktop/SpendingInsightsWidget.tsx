import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';

interface DailySpendingData {
  day: number;
  dateStr: string;
  weekday: string;
  volume: number;
  inflow: number;
  txCount: number;
  primaryMerchant: string;
  category: 'SaaS' | 'Logistics' | 'Settlement' | 'Travel' | 'Payroll' | 'Office' | 'None';
}

const LAST_30_DAYS_DATA: DailySpendingData[] = [
  { day: 1, dateStr: 'Sep 25', weekday: 'Wed', volume: 85.0, inflow: 0, txCount: 1, primaryMerchant: 'Figma Subscription', category: 'SaaS' },
  { day: 2, dateStr: 'Sep 26', weekday: 'Thu', volume: 140.5, inflow: 1200.0, txCount: 2, primaryMerchant: 'Datadog APM Observability', category: 'SaaS' },
  { day: 3, dateStr: 'Sep 27', weekday: 'Fri', volume: 42.0, inflow: 0, txCount: 1, primaryMerchant: 'Uber for Business', category: 'Travel' },
  { day: 4, dateStr: 'Sep 28', weekday: 'Sat', volume: 0.0, inflow: 0, txCount: 0, primaryMerchant: 'No Outflows', category: 'None' },
  { day: 5, dateStr: 'Sep 29', weekday: 'Sun', volume: 18.5, inflow: 0, txCount: 1, primaryMerchant: 'Office Sundries & Coffee', category: 'Office' },
  { day: 6, dateStr: 'Sep 30', weekday: 'Mon', volume: 320.0, inflow: 3400.0, txCount: 3, primaryMerchant: 'Gusto Payroll Taxes', category: 'Payroll' },
  { day: 7, dateStr: 'Oct 01', weekday: 'Tue', volume: 210.0, inflow: 0, txCount: 2, primaryMerchant: 'GitHub Enterprise Suite', category: 'SaaS' },
  { day: 8, dateStr: 'Oct 02', weekday: 'Wed', volume: 95.0, inflow: 0, txCount: 1, primaryMerchant: 'Slack Technologies Pro', category: 'SaaS' },
  { day: 9, dateStr: 'Oct 03', weekday: 'Thu', volume: 160.0, inflow: 850.0, txCount: 2, primaryMerchant: 'Google Workspace Cloud', category: 'SaaS' },
  { day: 10, dateStr: 'Oct 04', weekday: 'Fri', volume: 75.0, inflow: 0, txCount: 1, primaryMerchant: 'Delta Airlines Executive', category: 'Travel' },
  { day: 11, dateStr: 'Oct 05', weekday: 'Sat', volume: 25.0, inflow: 0, txCount: 1, primaryMerchant: 'Catering & Dining', category: 'Office' },
  { day: 12, dateStr: 'Oct 06', weekday: 'Sun', volume: 0.0, inflow: 0, txCount: 0, primaryMerchant: 'No Outflows', category: 'None' },
  { day: 13, dateStr: 'Oct 07', weekday: 'Mon', volume: 410.0, inflow: 2100.0, txCount: 3, primaryMerchant: 'AWS Cloud Compute Reserve', category: 'SaaS' },
  { day: 14, dateStr: 'Oct 08', weekday: 'Tue', volume: 120.0, inflow: 0, txCount: 1, primaryMerchant: 'Notion AI Enterprise', category: 'SaaS' },
  { day: 15, dateStr: 'Oct 09', weekday: 'Wed', volume: 65.0, inflow: 0, txCount: 1, primaryMerchant: 'Vercel Deployment Cloud', category: 'SaaS' },
  { day: 16, dateStr: 'Oct 10', weekday: 'Thu', volume: 190.0, inflow: 950.0, txCount: 2, primaryMerchant: 'Intercom Customer Portal', category: 'SaaS' },
  { day: 17, dateStr: 'Oct 11', weekday: 'Fri', volume: 85.0, inflow: 0, txCount: 1, primaryMerchant: 'WeWork Flexible Office', category: 'Office' },
  { day: 18, dateStr: 'Oct 12', weekday: 'Sat', volume: 0.0, inflow: 0, txCount: 0, primaryMerchant: 'No Outflows', category: 'None' },
  { day: 19, dateStr: 'Oct 13', weekday: 'Sun', volume: 30.0, inflow: 0, txCount: 1, primaryMerchant: 'Express Courier & DHL', category: 'Logistics' },
  { day: 20, dateStr: 'Oct 14', weekday: 'Mon', volume: 1840.0, inflow: 4200.0, txCount: 4, primaryMerchant: 'Apex Logistics Freight Settlement', category: 'Logistics' },
  { day: 21, dateStr: 'Oct 15', weekday: 'Tue', volume: 110.0, inflow: 0, txCount: 1, primaryMerchant: 'Vault Escrow Regulatory Fee', category: 'Settlement' },
  { day: 22, dateStr: 'Oct 16', weekday: 'Wed', volume: 90.0, inflow: 0, txCount: 1, primaryMerchant: 'Twilio & Sendgrid Messaging', category: 'SaaS' },
  { day: 23, dateStr: 'Oct 17', weekday: 'Thu', volume: 145.0, inflow: 600.0, txCount: 2, primaryMerchant: 'Zoom Enterprise Video', category: 'SaaS' },
  { day: 24, dateStr: 'Oct 18', weekday: 'Fri', volume: 70.0, inflow: 0, txCount: 1, primaryMerchant: 'Amtrak Acela Regional Fare', category: 'Travel' },
  { day: 25, dateStr: 'Oct 19', weekday: 'Sat', volume: 15.0, inflow: 0, txCount: 1, primaryMerchant: 'Packaging Supplies', category: 'Office' },
  { day: 26, dateStr: 'Oct 20', weekday: 'Sun', volume: 0.0, inflow: 0, txCount: 0, primaryMerchant: 'No Outflows', category: 'None' },
  { day: 27, dateStr: 'Oct 21', weekday: 'Mon', volume: 100.0, inflow: 0, txCount: 1, primaryMerchant: 'ATM Midtown Fleet Cash', category: 'Settlement' },
  { day: 28, dateStr: 'Oct 22', weekday: 'Tue', volume: 142.5, inflow: 0, txCount: 1, primaryMerchant: 'AWS Cloud Services East', category: 'SaaS' },
  { day: 29, dateStr: 'Oct 23', weekday: 'Wed', volume: 250.0, inflow: 0, txCount: 1, primaryMerchant: 'FedNow Wire to Marcus Vance', category: 'Settlement' },
  { day: 30, dateStr: 'Oct 24', weekday: 'Thu', volume: 55.0, inflow: 500.0, txCount: 2, primaryMerchant: 'FinCore Commercial Card Settlement', category: 'Settlement' },
];

export const SpendingInsightsWidget: React.FC = () => {
  const { formatCurrency, showToast } = useBank();

  const [activeDayIndex, setActiveDayIndex] = useState<number>(19); // Default to peak day Oct 14
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'category'>('daily');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Stats calculation
  const totalSpend = LAST_30_DAYS_DATA.reduce((acc, cur) => acc + cur.volume, 0);
  const avgDaily = totalSpend / LAST_30_DAYS_DATA.length;
  const maxDay = LAST_30_DAYS_DATA.reduce((prev, current) => (prev.volume > current.volume ? prev : current));
  const activeDay = LAST_30_DAYS_DATA[activeDayIndex] || maxDay;

  // Filtered dataset
  const filteredData = LAST_30_DAYS_DATA.map((d) => {
    if (categoryFilter === 'all') return d;
    return {
      ...d,
      volume: d.category.toLowerCase() === categoryFilter.toLowerCase() ? d.volume : 0,
    };
  });

  const maxVolume = Math.max(...filteredData.map((d) => d.volume), 100);

  // 4-Week Aggregates
  const weeklyData = [
    { label: 'Week 1 (Sep 25 - Oct 01)', total: 816.0, txs: 10, primary: 'Gusto Payroll' },
    { label: 'Week 2 (Oct 02 - Oct 08)', total: 885.0, txs: 9, primary: 'AWS Cloud Compute' },
    { label: 'Week 3 (Oct 09 - Oct 15)', total: 2320.0, txs: 10, primary: 'Apex Logistics Freight' },
    { label: 'Week 4 (Oct 16 - Oct 24)', total: 553.7, txs: 9, primary: 'Transfer to Marcus Vance' },
  ];
  const maxWeekly = Math.max(...weeklyData.map((w) => w.total));

  // Category Aggregates
  const categoryData = [
    { name: 'Logistics & Freight', amount: 1870.0, color: 'bg-indigo-600', percent: 40.9, icon: 'local_shipping' },
    { name: 'Cloud & SaaS Infrastructure', amount: 1618.0, color: 'bg-blue-600', percent: 35.4, icon: 'cloud_sync' },
    { name: 'Inter-Account Settlements', amount: 515.0, color: 'bg-emerald-600', percent: 11.3, icon: 'swap_horiz' },
    { name: 'Payroll & Compliance Taxes', amount: 320.0, color: 'bg-amber-600', percent: 7.0, icon: 'badge' },
    { name: 'Travel & Operations', amount: 251.7, color: 'bg-rose-500', percent: 5.5, icon: 'flight_takeoff' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] dark:bg-blue-950 text-[#00236f] dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
              Treasury Analytics
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 font-semibold">30-Day Rolling Window</span>
          </div>
          <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight mt-1">
            Spending Insights
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Visualize outbound transaction volume, daily spend velocity, and category distribution over the last 30 days.
          </p>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setViewMode('daily');
                showToast('Switched to 30-Day Daily Bar Chart view', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'daily'
                  ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-blue-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">bar_chart</span>
              <span>Daily (30 Days)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('weekly');
                showToast('Switched to Weekly Rollup view', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'weekly'
                  ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-blue-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">calendar_view_week</span>
              <span>Weekly (4 Wks)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('category');
                showToast('Switched to Category Breakdown view', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'category'
                  ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-blue-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">pie_chart</span>
              <span>By Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Metric 1: Total 30-Day Spending */}
        <div className="bg-[#f2f3ff] dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total 30d Spend
          </span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              {formatCurrency(totalSpend)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <span className="material-symbols-outlined text-[14px]">trending_down</span>
            <span>-8.4% vs previous 30d</span>
          </div>
        </div>

        {/* Metric 2: Daily Average */}
        <div className="bg-[#f2f3ff] dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Daily Average Spend
          </span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              {formatCurrency(avgDaily)}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Across 38 settled debits</span>
        </div>

        {/* Metric 3: Peak Volume Day */}
        <div className="bg-[#f2f3ff] dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Peak Spend Day
          </span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-[#00236f] dark:text-blue-300">
              {formatCurrency(maxDay.volume)}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            {maxDay.dateStr} • {maxDay.primaryMerchant.split(' ')[0]}
          </span>
        </div>

        {/* Metric 4: Monthly Cap Pace */}
        <div className="bg-[#f2f3ff] dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Monthly Cap Utilization
          </span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              45.7%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#0051d5] h-full rounded-full" style={{ width: '45.7%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      {viewMode === 'daily' && (
        <div className="space-y-3">
          {/* Active Day Detail Highlight Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/60 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                {activeDay.day}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {activeDay.weekday}, {activeDay.dateStr}, 2024
                  </span>
                  {activeDay.volume === maxDay.volume && (
                    <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                      ★ 30-Day Peak
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  Primary Outflow: <strong>{activeDay.primaryMerchant}</strong> ({activeDay.category})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Day Outflows</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(activeDay.volume)}
                </span>
              </div>
              {activeDay.inflow > 0 && (
                <div className="text-left sm:text-right border-l border-slate-200 dark:border-slate-700 pl-4">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                    Day Inflow
                  </span>
                  <span className="text-base font-bold text-emerald-600">
                    +{formatCurrency(activeDay.inflow)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 30-Day Interactive Bar Chart */}
          <div className="relative w-full bg-[#f2f3ff] dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/60">
            {/* Y-Axis Reference Guidelines */}
            <div className="absolute inset-x-5 top-5 bottom-12 pointer-events-none flex flex-col justify-between text-[10px] font-mono text-slate-400">
              <div className="border-b border-dashed border-slate-200 dark:border-slate-700 pb-0.5">
                $2,000
              </div>
              <div className="border-b border-dashed border-slate-200 dark:border-slate-700 pb-0.5">
                $1,500
              </div>
              <div className="border-b border-dashed border-slate-200 dark:border-slate-700 pb-0.5">
                $1,000
              </div>
              <div className="border-b border-dashed border-slate-200 dark:border-slate-700 pb-0.5">
                $500
              </div>
              <div className="border-b border-slate-300 dark:border-slate-600">
                $0
              </div>
            </div>

            {/* Average spend horizontal marker */}
            <div
              className="absolute inset-x-5 border-t-2 border-dotted border-amber-500/80 pointer-events-none z-10 flex items-center justify-end"
              style={{ bottom: `${(avgDaily / 2000) * 100 * 0.75 + 18}%` }}
            >
              <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-l-md shadow-xs">
                Avg: ${avgDaily.toFixed(0)}/d
              </span>
            </div>

            {/* 30-Day Bars Grid */}
            <div className="relative h-64 flex items-end justify-between gap-1 sm:gap-1.5 pt-6 pb-2 px-6 z-20">
              {filteredData.map((d, index) => {
                const heightPercent = Math.min(100, Math.max(6, (d.volume / 2000) * 100));
                const isSelected = activeDayIndex === index;
                const isPeak = d.volume === maxDay.volume;

                return (
                  <div
                    key={d.day}
                    onClick={() => setActiveDayIndex(index)}
                    onMouseEnter={() => setActiveDayIndex(index)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {/* Hover Value Popover */}
                    <div
                      className={`text-[10px] font-bold tabular-nums mb-1 transition-opacity ${
                        isSelected ? 'opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-0 group-hover:opacity-100 text-slate-500'
                      }`}
                    >
                      ${d.volume.toFixed(0)}
                    </div>

                    {/* Bar Pillar */}
                    <div className="w-full max-w-[18px] bg-slate-200/60 dark:bg-slate-700/50 rounded-t-md h-full flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#00236f] dark:bg-blue-400 ring-2 ring-blue-500 dark:ring-blue-300'
                            : isPeak
                            ? 'bg-amber-500 hover:bg-amber-600'
                            : d.volume > 200
                            ? 'bg-[#0051d5] dark:bg-blue-500 hover:bg-[#003ea8]'
                            : d.volume > 0
                            ? 'bg-blue-400/80 dark:bg-blue-600/80 hover:bg-blue-500'
                            : 'bg-transparent border-t border-slate-300 dark:border-slate-600'
                        }`}
                      ></div>
                    </div>

                    {/* Day Number Label */}
                    <span
                      className={`text-[9px] font-mono mt-1 transition-colors ${
                        isSelected
                          ? 'font-bold text-blue-600 dark:text-blue-400'
                          : index % 5 === 0 || index === 29
                          ? 'text-slate-600 dark:text-slate-400 font-semibold'
                          : 'text-slate-400 hidden sm:block'
                      }`}
                    >
                      {d.dateStr.split(' ')[1]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Date Reference Labels */}
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 pt-2 px-6 border-t border-slate-200 dark:border-slate-700">
              <span>Sep 25 (Day 1)</span>
              <span className="hidden sm:inline">Oct 02</span>
              <span>Oct 08</span>
              <span className="hidden sm:inline">Oct 15</span>
              <span>Oct 20</span>
              <span className="text-[#0051d5] dark:text-blue-400 font-extrabold">Today (Oct 24)</span>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Rollup View */}
      {viewMode === 'weekly' && (
        <div className="bg-[#f2f3ff] dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {weeklyData.map((w, idx) => {
              const heightPct = (w.total / maxWeekly) * 100;
              return (
                <div
                  key={w.label}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-blue-500 transition-all shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Week {idx + 1}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{w.txs} transactions</span>
                    </div>
                    <div className="text-xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white mt-1">
                      {formatCurrency(w.total)}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Top: {w.primary}</p>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#0051d5] h-full rounded-full transition-all duration-500"
                      style={{ width: `${heightPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* By Category Breakdown View */}
      {viewMode === 'category' && (
        <div className="bg-[#f2f3ff] dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
          <div className="space-y-3">
            {categoryData.map((cat) => (
              <div
                key={cat.name}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${cat.color} text-white flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{cat.percent}% of total 30d outflows</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-36 hidden sm:block bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                      {formatCurrency(cat.amount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
