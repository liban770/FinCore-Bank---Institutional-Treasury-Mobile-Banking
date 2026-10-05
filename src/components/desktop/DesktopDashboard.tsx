import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { CurrencyCode } from '../../types/bank';
import { SpendingInsightsWidget } from './SpendingInsightsWidget';
import { AccountSummarySection } from './AccountSummarySection';

export const DesktopDashboard: React.FC = () => {
  const {
    currency,
    setCurrency,
    formatCurrency,
    isBalanceConcealed,
    toggleBalanceConceal,
    accounts,
    transactions,
    setActiveDesktopTab,
    showToast,
  } = useBank();

  const [chartPeriod, setChartPeriod] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');
  const [filterSearch, setFilterSearch] = useState('');

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1560px] mx-auto w-full select-none">
      {/* Section 1: Welcome & Status Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight">
              Welcome back, Elena
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaedff] dark:bg-blue-950/80 text-[#00236f] dark:text-blue-300 text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px] text-[#0051d5]">verified_user</span>
              Tier 3 Verified Enterprise Vault
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffddb8] dark:bg-amber-950/80 text-[#5c3800] dark:text-amber-300 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              FDIC Insured to $2.5M
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px]">calendar_today</span>
            Thursday, October 24, 2024 • Global Financial Markets Open • DRF Liquidity Settlement: Synchronized
          </p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setActiveDesktopTab('transfer')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00236f] dark:bg-blue-600 hover:bg-[#00174b] text-white text-xs font-bold shadow-sm transition-all active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ New Transfer</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Opening Quick Deposit Drawer...', 'info')}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 hover:bg-[#eaedff] text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
            <span>Quick Deposit</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Generating Financial Statement for October 2024...', 'info')}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Statement</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Add Counterparty Protocol wizard initiated', 'info')}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Add Beneficiary</span>
          </button>
        </div>
      </div>

      {/* Section 2: Metric Overview Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Total Balance Card (5 Columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Combined Balance
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleBalanceConceal}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title="Toggle Privacy"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isBalanceConcealed ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
                <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/60 dark:border-slate-700">
                  {(['USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                        currency === c
                          ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-blue-300 shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight">
                  {formatCurrency(24850.00)}
                </span>
                <span className="text-sm font-semibold text-slate-500">{currency}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200/50">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">trending_up</span>
                <span>+4.8% ($1,140.20)</span>
                <span className="font-normal text-slate-500">this billing cycle</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 bg-[#f2f3ff] dark:bg-slate-800/80 -mx-6 -mb-6 p-4 px-6 rounded-b-2xl flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined text-[18px] text-[#0051d5]">verified</span>
              <span>Next Auto-Sweep scheduled in <strong>4h 12m</strong></span>
            </div>
            <button
              type="button"
              onClick={() => showToast('Opening Automated Sweeps Scheduler...', 'info')}
              className="text-xs font-bold text-[#0051d5] dark:text-blue-400 hover:underline"
            >
              Manage Sweeps →
            </button>
          </div>
        </div>

        {/* Secondary Stats (7 Columns: 3 tiles) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tile 1: Available Liquidity */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Available Liquidity
              </span>
              <span className="material-symbols-outlined text-[#0051d5] text-[20px]">account_balance_wallet</span>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                {formatCurrency(22410.00)}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Pending hold: <strong>$2,440.00</strong></span>
              </p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#0051d5] h-full rounded-full" style={{ width: '90.1%' }}></div>
            </div>
          </div>

          {/* Tile 2: Managed Ledgers */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Managed Ledgers
              </span>
              <span className="material-symbols-outlined text-[#00236f] dark:text-blue-300 text-[20px]">layers</span>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                3 Vaults
              </div>
              <p className="text-xs text-slate-500 mt-1 truncate">
                Operating, HY-Savings &amp; Treasury
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All sub-accounts 100% healthy</span>
            </div>
          </div>

          {/* Tile 3: 30-Day Volume */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                30-Day Volume
              </span>
              <span className="material-symbols-outlined text-amber-600 text-[20px]">swap_horiz</span>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                {formatCurrency(18920.40)}
              </div>
              <p className="text-xs text-slate-500 mt-1">142 settled operations</p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>SLA Delivery</span>
              <strong className="text-slate-900 dark:text-white">99.98%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Institutional Account Summary (Clean Tabular Ledger & Activity) */}
      <AccountSummarySection />

      {/* Section 4: 30-Day Spending Insights Interactive Bar Chart Widget */}
      <SpendingInsightsWidget />

      {/* Section 5: Analytics Chart & Liquidity Stream */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              Cash Flow &amp; Settlement Trends
            </h2>
            <p className="text-xs text-slate-500">
              Automated volume reconciliation across multi-channel clearinghouses
            </p>
          </div>

          {/* Period selector */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            {(['7d', '30d', '90d', 'ytd'] as const).map((p) => {
              const labels = { '7d': '7 Days', '30d': '30 Days', '90d': '90 Days', ytd: 'Year-to-Date' };
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    chartPeriod === p
                      ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-blue-300 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 flex-wrap text-xs font-semibold pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2563eb]"></span>
            <span className="text-slate-700 dark:text-slate-300">Deposits &amp; Inflows</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#64748b]"></span>
            <span className="text-slate-700 dark:text-slate-300">Inter-Account Transfers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
            <span className="text-slate-700 dark:text-slate-300">Withdrawals &amp; Outflows</span>
          </div>
        </div>

        {/* High-Fidelity Responsive SVG Chart Container */}
        <div className="relative w-full h-72 bg-[#f2f3ff] dark:bg-slate-800/60 rounded-xl p-4 overflow-hidden flex items-end">
          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 800 240">
            {/* Grid lines */}
            <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="40" y2="40" className="dark:stroke-slate-700" />
            <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100" className="dark:stroke-slate-700" />
            <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="160" y2="160" className="dark:stroke-slate-700" />
            <line stroke="#cbd5e1" strokeWidth="1" x1="0" x2="800" y1="210" y2="210" className="dark:stroke-slate-600" />

            {/* May */}
            <rect fill="#2563eb" height="120" rx="4" width="16" x="50" y="90" />
            <rect fill="#64748b" height="80" opacity="0.8" rx="4" width="16" x="70" y="130" />
            <rect fill="#f59e0b" height="60" rx="4" width="16" x="90" y="150" />

            {/* June */}
            <rect fill="#2563eb" height="150" rx="4" width="16" x="175" y="60" />
            <rect fill="#64748b" height="100" opacity="0.8" rx="4" width="16" x="195" y="110" />
            <rect fill="#f59e0b" height="70" rx="4" width="16" x="215" y="140" />

            {/* July */}
            <rect fill="#2563eb" height="130" rx="4" width="16" x="300" y="80" />
            <rect fill="#64748b" height="85" opacity="0.8" rx="4" width="16" x="320" y="125" />
            <rect fill="#f59e0b" height="45" rx="4" width="16" x="340" y="165" />

            {/* August */}
            <rect fill="#2563eb" height="165" rx="4" width="16" x="425" y="45" />
            <rect fill="#64748b" height="115" opacity="0.8" rx="4" width="16" x="445" y="95" />
            <rect fill="#f59e0b" height="75" rx="4" width="16" x="465" y="135" />

            {/* September */}
            <rect fill="#2563eb" height="140" rx="4" width="16" x="550" y="70" />
            <rect fill="#64748b" height="105" opacity="0.8" rx="4" width="16" x="570" y="105" />
            <rect fill="#f59e0b" height="55" rx="4" width="16" x="590" y="155" />

            {/* October (Current Month) */}
            <rect fill="#2563eb" height="180" rx="4" width="16" x="675" y="30" />
            <rect fill="#64748b" height="125" opacity="0.8" rx="4" width="16" x="695" y="85" />
            <rect fill="#f59e0b" height="50" rx="4" width="16" x="715" y="160" />

            {/* Spline Curve */}
            <path
              d="M 58 90 Q 183 60 308 80 T 433 45 T 558 70 T 683 30"
              fill="none"
              stroke="#00236f"
              strokeLinecap="round"
              strokeWidth="2.5"
              className="dark:stroke-blue-400"
            />
            <circle cx="683" cy="30" fill="#00236f" r="4.5" className="dark:fill-blue-400" />
          </svg>

          {/* Hover State Tooltip Simulation */}
          <div className="absolute top-4 right-16 sm:right-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl shadow-md flex flex-col gap-1">
            <span className="text-[11px] font-medium text-slate-500">October 2024 Actuals</span>
            <span className="text-sm font-bold text-emerald-600">+$5,420.00 Inflow</span>
            <span className="text-[11px] text-slate-500">-$1,840.00 Settlements</span>
          </div>
        </div>

        {/* X-Axis Labels */}
        <div className="grid grid-cols-6 text-center text-xs font-bold text-slate-500 dark:text-slate-400 px-4">
          <span>MAY</span>
          <span>JUN</span>
          <span>JUL</span>
          <span>AUG</span>
          <span>SEP</span>
          <span className="text-[#0051d5] dark:text-blue-400 font-extrabold">OCT (MTD)</span>
        </div>
      </div>

      {/* Section 5: Recent Settlement Activity Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              Recent Settlement Activity
            </h2>
            <p className="text-xs text-slate-500">
              Immutable real-time audit ledger for all linked accounts
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative min-w-[220px]">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
                search
              </span>
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Filter by note or ref..."
                className="w-full h-9 pl-8 pr-3 text-xs bg-[#f2f3ff] dark:bg-slate-800 rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <button
              type="button"
              onClick={() => showToast('Filter applied: All Types', 'info')}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#f2f3ff] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              <span>All Types</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveDesktopTab('transactions')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0051d5] dark:text-blue-400 hover:underline pl-2"
            >
              <span>View all transactions →</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f2f3ff] dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Date &amp; Description</th>
                <th className="py-3 px-4">Reference ID</th>
                <th className="py-3 px-4">Account Source</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.slice(0, 5).map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          row.amount > 0
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {row.amount > 0 ? 'south_west' : 'sync_alt'}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {row.title}
                        </span>
                        <span className="text-[11px] text-slate-400">{row.date} • {row.timestamp}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{row.ref}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {row.accountSource}
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-bold tabular-nums ${
                      row.amount > 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {formatCurrency(row.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Completed
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => showToast(`Audit trail inspector for ${row.ref}`, 'info')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer */}
        <div className="p-4 px-6 bg-[#f2f3ff] dark:bg-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <span>Displaying latest 5 of 142 records • Filtered by all entities</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 opacity-50 cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2 py-1 font-bold text-slate-800 dark:text-slate-200">Page 1 of 29</span>
            <button
              type="button"
              onClick={() => showToast('Page 2 loaded', 'info')}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
