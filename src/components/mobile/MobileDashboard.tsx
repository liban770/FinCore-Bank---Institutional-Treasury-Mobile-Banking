import React from 'react';
import { useBank } from '../../context/BankContext';
import { MobileHeader } from './MobileHeader';
import { CurrencyCode } from '../../types/bank';

export const MobileDashboard: React.FC = () => {
  const {
    currency,
    setCurrency,
    formatCurrency,
    isBalanceConcealed,
    toggleBalanceConceal,
    accounts,
    setActiveMobileTab,
    showToast,
  } = useBank();

  const handleCurrencyChange = (c: CurrencyCode) => {
    setCurrency(c);
    showToast(`Display currency switched to ${c}`, 'info');
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-[#faf8ff] dark:bg-slate-950 pb-8">
      <MobileHeader title="Dashboard" />

      <div className="px-4 py-3 space-y-4">
        {/* Header Greeting & FDIC Badge */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Thursday, Oct 24
            </span>
            <h1 className="text-[22px] font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight leading-snug">
              Welcome back, Elena
            </h1>
          </div>

          <div className="flex items-center gap-1.5 bg-[#e2e7ff] dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60 px-2.5 py-1 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
            <span className="text-[11px] font-semibold text-blue-900 dark:text-blue-200">
              FDIC • Tier 3
            </span>
          </div>
        </div>

        {/* Consolidated Balance Bento Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200/70 dark:border-slate-800 flex flex-col gap-3">
          {/* Subtle Ambient Card Glow */}
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Consolidated Balance
                </span>
                <button
                  type="button"
                  onClick={toggleBalanceConceal}
                  className="text-slate-400 hover:text-blue-600 transition-colors"
                  title="Toggle Privacy Mask"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isBalanceConcealed ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[30px] font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight">
                  {formatCurrency(24850.00)}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {currency}
                </span>
              </div>
            </div>

            {/* Currency Switcher Pill */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
              {(['USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCurrencyChange(c)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                    currency === c
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-row: Performance Pill & Available Liquidity */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-900/40 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                +4.8% ($1,140.20)
              </span>
              <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/70">
                this mo
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Available Liquidity
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(22410.00)}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Primary Action Buttons Row */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => setActiveMobileTab('transfer')}
            className="flex flex-col items-center justify-center gap-1.5 bg-[#0051d5] hover:bg-[#003ea8] text-white py-3 px-2 rounded-2xl shadow-sm transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </div>
            <span className="text-xs font-semibold tracking-tight">Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Mobile Check Deposit Camera Initiated', 'info')}
            className="flex flex-col items-center justify-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 py-3 px-2 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-full bg-[#eaedff] dark:bg-slate-800 text-[#0051d5] dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-[20px]">add_card</span>
            </div>
            <span className="text-xs font-medium">Deposit</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Downloading October Consolidated Statement PDF...', 'info')}
            className="flex flex-col items-center justify-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 py-3 px-2 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-full bg-[#eaedff] dark:bg-slate-800 text-[#0051d5] dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-[20px]">description</span>
            </div>
            <span className="text-xs font-medium">Statement</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMobileTab('cards')}
            className="flex flex-col items-center justify-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 py-3 px-2 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-full bg-[#eaedff] dark:bg-slate-800 text-[#0051d5] dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
            </div>
            <span className="text-xs font-medium">Cards</span>
          </button>
        </div>

        {/* Accounts Carousel Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              Accounts
            </h2>
            <button
              type="button"
              onClick={() => setActiveMobileTab('accounts')}
              className="text-xs font-semibold text-[#0051d5] dark:text-blue-400 hover:underline"
            >
              Manage (3)
            </button>
          </div>

          {/* Swipeable Horizontal Rail */}
          <div className="flex overflow-x-auto gap-3 pb-1 -mx-4 px-4 no-scrollbar scroll-smooth snap-x snap-mandatory">
            {/* Card 1: HY Savings */}
            <div
              onClick={() => setActiveMobileTab('accounts')}
              className="snap-start shrink-0 w-[240px] bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-36 relative overflow-hidden cursor-pointer hover:border-blue-400 dark:hover:border-blue-700 transition-all"
            >
              <div className="absolute right-0 top-0 w-20 h-20 bg-blue-500/10 dark:bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#0051d5] dark:text-blue-400">
                    savings
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    HY Savings
                  </span>
                </div>
                <span className="text-[11px] font-bold bg-[#ffddb8] dark:bg-amber-950/70 text-[#5c3800] dark:text-amber-300 px-1.5 py-0.5 rounded">
                  4.65% APY
                </span>
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">•••• 4821</span>
                <div className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight mt-0.5">
                  {formatCurrency(accounts[0]?.balance || 15250.00)}
                </div>
              </div>
            </div>

            {/* Card 2: Premier Checking */}
            <div
              onClick={() => setActiveMobileTab('accounts')}
              className="snap-start shrink-0 w-[240px] bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-36 cursor-pointer hover:border-blue-400 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#00236f] dark:text-blue-300">
                    account_balance_wallet
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Premier Checking
                  </span>
                </div>
                <span className="text-[11px] font-medium bg-[#eaedff] dark:bg-slate-800 text-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">
                  Limit $5k/d
                </span>
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">•••• 7319</span>
                <div className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight mt-0.5">
                  {formatCurrency(accounts[1]?.balance || 9600.00)}
                </div>
              </div>
            </div>

            {/* Card 3: Business Treasury */}
            <div
              onClick={() => setActiveMobileTab('accounts')}
              className="snap-start shrink-0 w-[240px] bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-36 cursor-pointer hover:border-blue-400 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-amber-600 dark:text-amber-400">
                    lock
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Treasury Vault
                  </span>
                </div>
                <span className="text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                  5.10% APY
                </span>
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">•••• 1094</span>
                <div className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight mt-0.5">
                  {formatCurrency(accounts[2]?.balance || 32180.00)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Mini Summary */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-blue-600 dark:text-blue-400">
                analytics
              </span>
              <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                Monthly Cash Flow
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Net +$3,840.00
            </span>
          </div>

          {/* Segmented Flow Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-[#10b981] h-full rounded-l-full" style={{ width: '68%' }} title="Inflows: 68%"></div>
              <div className="bg-[#00236f] dark:bg-blue-600 h-full rounded-r-full" style={{ width: '32%' }} title="Outflows: 32%"></div>
            </div>
            <div className="flex items-center justify-between text-xs font-medium pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                <span className="text-slate-500 dark:text-slate-400">
                  Inflow: <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(8190.00)}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00236f] dark:bg-blue-600"></span>
                <span className="text-slate-500 dark:text-slate-400">
                  Outflow: <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(4350.00)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              Recent Activity
            </h2>
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
              Real-time sync
            </span>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {/* Activity 1: Stripe */}
            <div
              onClick={() => setActiveMobileTab('activity')}
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#10b981] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    Stripe Merchant Settlement
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-400">Today, 2:15 PM</span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[#ecfdf5] dark:bg-emerald-950/70 text-[#065f46] dark:text-emerald-300">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="text-sm font-bold text-[#10b981]">
                  + $500.00
                </span>
                <span className="text-[11px] text-slate-400">Checking</span>
              </div>
            </div>

            {/* Activity 2: Marcus Vance */}
            <div
              onClick={() => setActiveMobileTab('activity')}
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#eaedff] dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">arrow_outward</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    Transfer to Marcus Vance
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-400">Yesterday, 6:40 PM</span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[#ecfdf5] dark:bg-emerald-950/70 text-[#065f46] dark:text-emerald-300">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                  - $250.00
                </span>
                <span className="text-[11px] text-slate-400">Savings</span>
              </div>
            </div>

            {/* Activity 3: ATM Cash Withdrawal */}
            <div
              onClick={() => setActiveMobileTab('activity')}
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">local_atm</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    ATM Cash Withdrawal
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-400">Oct 21, 11:04 AM</span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[#ecfdf5] dark:bg-emerald-950/70 text-[#065f46] dark:text-emerald-300">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  - $100.00
                </span>
                <span className="text-[11px] text-slate-400">Checking</span>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <button
            type="button"
            onClick={() => setActiveMobileTab('activity')}
            className="w-full py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[#0051d5] dark:text-blue-400 font-semibold text-xs transition-colors shadow-2xs"
          >
            <span>View All Transactions</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
