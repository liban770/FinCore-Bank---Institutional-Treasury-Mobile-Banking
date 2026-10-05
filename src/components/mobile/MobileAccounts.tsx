import React from 'react';
import { useBank } from '../../context/BankContext';
import { MobileHeader } from './MobileHeader';

export const MobileAccounts: React.FC = () => {
  const {
    accounts,
    formatCurrency,
    emergencyFreeze,
    toggleEmergencyFreeze,
    setActiveMobileTab,
    showToast,
  } = useBank();

  const handleCopy = (num: string, label: string) => {
    navigator.clipboard?.writeText?.(`021000021${num.replace(/[^0-9]/g, '')}`).catch(() => {});
    showToast(`${label} copied to clipboard`, 'info');
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-[#faf8ff] dark:bg-slate-950 pb-12">
      <MobileHeader title="Accounts & Vaults" />

      <div className="px-4 py-3 space-y-4">
        {/* Top Summary Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 p-4 space-y-3">
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl pointer-events-none"></div>

          {/* Subtitle & FDIC Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaedff] dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60 text-[#00236f] dark:text-blue-300">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <span className="text-[11px] font-bold tracking-tight">FDIC Insured to $2.5M</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              3 Active Accounts
            </span>
          </div>

          <h1 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight">
            My Accounts &amp; Vaults
          </h1>

          {/* Consolidated Net Position Card */}
          <div className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                Consolidated Holdings
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                  {formatCurrency(57030.00)}
                </span>
                <span className="text-xs font-semibold text-slate-500">USD</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#0051d5] dark:text-blue-400">
                <span className="material-symbols-outlined text-[16px] font-semibold">trending_up</span>
                <span className="text-xs font-bold">+5.2%</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">(+$2,810.00 this month)</span>
              </div>
            </div>

            {/* Mini Progress Donut Ring SVG */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 48 48">
                <circle
                  className="text-slate-200 dark:text-slate-700"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="19"
                  stroke="currentColor"
                  strokeWidth="4.5"
                />
                {/* Checking: 17% */}
                <circle
                  className="text-[#0051d5]"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="19"
                  stroke="currentColor"
                  strokeDasharray="119.38"
                  strokeDashoffset="99.0"
                  strokeLinecap="round"
                  strokeWidth="4.5"
                />
                {/* Savings: 27% */}
                <circle
                  className="text-[#1e3a8a] dark:text-blue-400"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="19"
                  stroke="currentColor"
                  strokeDasharray="119.38"
                  strokeDashoffset="87.0"
                  strokeLinecap="round"
                  strokeWidth="4.5"
                />
                {/* Treasury: 56% */}
                <circle
                  className="text-amber-500"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="19"
                  stroke="currentColor"
                  strokeDasharray="119.38"
                  strokeDashoffset="52.5"
                  strokeLinecap="round"
                  strokeWidth="4.5"
                />
              </svg>
              <span className="material-symbols-outlined absolute text-[18px] text-[#00236f] dark:text-blue-300">
                pie_chart
              </span>
            </div>
          </div>

          {/* Quick Primary Action */}
          <button
            type="button"
            onClick={() => showToast('Opening Institutional Sub-Account Application Wizard...', 'info')}
            className="w-full h-11 bg-[#00236f] dark:bg-blue-600 hover:bg-[#00174b] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Apply for Vault / Sub-Account</span>
          </button>
        </div>

        {/* Deposit & Treasury Portfolios Header */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
            Deposit &amp; Treasury Portfolios
          </h2>
          <span className="text-[11px] font-semibold text-[#0051d5] dark:text-blue-400">
            Real-Time Sync
          </span>
        </div>

        {/* ACCOUNT 1: High-Yield Savings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#eaedff] dark:bg-blue-950/80 text-[#00236f] dark:text-blue-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">savings</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">High-Yield Savings</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] dark:bg-amber-950/70 text-[#5c3800] dark:text-amber-300 text-[10px] font-bold">
                    4.65% APY
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-slate-500 font-mono">•••• 4821</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('4821', 'High-Yield Savings')}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                    title="Copy Account Number"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  </button>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active
            </span>
          </div>

          {/* Balances Grid */}
          <div className="grid grid-cols-2 gap-2 bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl p-3">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Current Balance</div>
              <div className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(accounts[0]?.balance || 15250.00)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Accrued Interest (MTD)</div>
              <div className="text-sm font-bold text-[#0051d5] dark:text-blue-400 mt-1">
                +${(accounts[0]?.accruedInterest || 58.20).toFixed(2)}
              </div>
            </div>
            <div className="col-span-2 pt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/50 dark:border-slate-700/50 mt-1">
              <span>Available Liquidity</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatCurrency(accounts[0]?.availableBalance || 15250.00)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => setActiveMobileTab('transfer')}
              className="h-9 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-100 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>Transfer</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Opening High-Yield Savings Statement Manifest...', 'info')}
              className="h-9 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-100 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">receipt</span>
              <span>Statements</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Yield Rate APY 4.65% • Compounded Daily • Tier 3', 'info')}
              className="h-9 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-100 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">analytics</span>
              <span>Details</span>
            </button>
          </div>
        </div>

        {/* ACCOUNT 2: Premier Checking */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#dae2fd] dark:bg-blue-950/80 text-[#0051d5] dark:text-blue-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Premier Checking</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] dark:bg-blue-950/70 text-[#003ea8] dark:text-blue-300 text-[10px] font-bold">
                    Primary Operating
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-slate-500 font-mono">•••• 7319</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('7319', 'Premier Checking')}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  </button>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active
            </span>
          </div>

          {/* Balances */}
          <div className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl p-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Current Balance</div>
                <div className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(accounts[1]?.balance || 9600.00)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Available Liquidity</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(accounts[1]?.availableBalance || 9210.00)}
                </div>
                <div className="text-[10px] text-slate-400">(Pending holds: $390.00)</div>
              </div>
            </div>

            {/* Debit card preview badge */}
            <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">credit_card</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">FinCore Sovereign Virtual</span>
              </div>
              <span className="text-[11px] font-semibold text-[#0051d5] dark:text-blue-400">4 cards linked</span>
            </div>

            {/* Daily Limit Progress */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                <span>Daily Limit: $1,200.00 used</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">$5,000.00</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-[#0051d5] rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => setActiveMobileTab('transfer')}
              className="h-9 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-100 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Send Wire</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileTab('cards')}
              className="h-9 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-100 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">credit_card</span>
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Mobile Deposit initiated', 'info')}
              className="h-9 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-100 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add_card</span>
              <span>Deposit</span>
            </button>
          </div>
        </div>

        {/* ACCOUNT 3: Institutional Treasury Vault */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#ffddb8] dark:bg-amber-950/80 text-[#3e2400] dark:text-amber-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">lock</span>
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Institutional Treasury Vault</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                    Fixed Term (5.10% APY)
                  </span>
                  <span className="text-xs text-slate-500 font-mono">•••• 1094</span>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Locked
            </span>
          </div>

          <div className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl p-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Principal Ledger Balance</div>
                <div className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(accounts[2]?.balance || 32180.00)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Maturity Date</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Dec 15, 2024</div>
                <div className="text-[10px] text-[#0051d5] dark:text-blue-400 font-medium">52 days remaining</div>
              </div>
            </div>

            {/* Rollover Status */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg text-xs border border-slate-200/50 dark:border-slate-800">
              <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">autorenew</span>
              <div className="text-slate-700 dark:text-slate-300">
                <span className="font-bold">Auto-Rollover:</span> Principal + Yield Reinvestment enabled
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => showToast('Generated ISO 20022 Audit Certificate #AC-9941', 'success')}
              className="h-9 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-blue-600">verified</span>
              <span>Audit Cert</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Projected Yield: $1,641.18 at 5.10% maturity', 'info')}
              className="h-9 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">calculate</span>
              <span>Yield Calculator</span>
            </button>
          </div>
        </div>

        {/* Account Tools & Controls Section */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              Account Tools &amp; Controls
            </h2>
            <span className="text-[11px] text-slate-500">Real-time governance</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {/* Interactive Emergency Outbound Freeze Switch */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3 pr-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    emergencyFreeze
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {emergencyFreeze ? 'lock' : 'security'}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Emergency Outbound Freeze
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Lock all outgoing virtual debit cards &amp; wire attempts
                  </div>
                </div>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                role="switch"
                aria-checked={emergencyFreeze}
                onClick={toggleEmergencyFreeze}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  emergencyFreeze ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    emergencyFreeze ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Statements & Tax Documents */}
            <div
              onClick={() => showToast('Opening 1099-INT and CSV Statements Archive...', 'info')}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Statements &amp; Tax Documents
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Download consolidated 1099-INT, CSV &amp; Monthly PDFs
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </div>

            {/* Beneficiaries & Policy Limits */}
            <div
              onClick={() => showToast('Opening Dual-Signature Policy & Limit Manager...', 'info')}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">supervisor_account</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Beneficiaries &amp; Policy Limits
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Update authorized signers, transfer tiers &amp; dual-approvals
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </div>

            {/* Direct Deposit & Voided Check */}
            <div
              onClick={() => showToast('Direct Deposit PDF generated & stamped', 'success')}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">file_download</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Direct Deposit &amp; Voided Check
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Auto-filled PDF pre-stamped with FinCore routing details
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </div>
          </div>
        </div>

        {/* Institutional Guarantee Footnote */}
        <div className="bg-[#f2f3ff] dark:bg-slate-800/60 rounded-2xl p-4 flex items-center gap-3 border border-slate-200/60 dark:border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-[#dae2fd] dark:bg-blue-950 text-[#00236f] dark:text-blue-300 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
            Funds held in sovereign sub-accounts are cleared through FinCore Partner Banks, N.A., Member FDIC. Automated yield swept nightly at 00:00 UTC.
          </p>
        </div>
      </div>
    </div>
  );
};
