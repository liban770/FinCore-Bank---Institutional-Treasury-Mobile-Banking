import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { MobileHeader } from './MobileHeader';

export const MobileSecurityAlerts: React.FC = () => {
  const {
    alerts,
    dismissAlert,
    markAllAlertsRead,
    openBiometricModal,
    showToast,
  } = useBank();

  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'transactions' | 'aml' | 'compliance'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === 'all') return true;
    return a.type === activeFilter;
  });

  const unreadCount = alerts.filter((a) => a.unread).length;

  return (
    <div className="flex flex-col w-full min-h-full bg-[#faf8ff] dark:bg-slate-950 pb-12">
      <MobileHeader title="Security & Alerts" />

      <div className="px-4 py-3 space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight">
              Security &amp; Alerts
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#0051d5] text-white text-[11px] font-bold">
              {unreadCount > 0 ? `${unreadCount} New` : 'All Cleared'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllAlertsRead}
              className="h-8 px-2.5 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>Mark read</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Opening Notification Channels Policy...', 'info')}
              aria-label="Notification Preferences"
              className="w-8 h-8 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>

        {/* Security Shield Active Banner */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eaedff] dark:bg-blue-950/80 flex items-center justify-center text-[#0051d5] dark:text-blue-300 relative shrink-0">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  gshield
                </span>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10b981] ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                    Security Shield Active
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#ecfdf5] dark:bg-emerald-950/70 text-[#065f46] dark:text-emerald-300 text-[10px] font-bold">
                    ISO 20022
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Dual-layer TLS 1.3 sentinel node protecting high-value transactions
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                {unreadCount > 0 ? `${unreadCount} Action${unreadCount > 1 ? 's' : ''} Required immediately` : 'Zero exceptions logged'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => showToast('Running Cryptographic Node Diagnostic Routine...', 'info')}
              className="text-xs font-bold text-[#0051d5] dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>Diagnostics</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs ${
              activeFilter === 'all'
                ? 'bg-[#00236f] dark:bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <span>All Alerts</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
              {alerts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('critical')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs ${
              activeFilter === 'critical'
                ? 'bg-[#00236f] dark:bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Critical Security</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('transactions')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs ${
              activeFilter === 'transactions'
                ? 'bg-[#00236f] dark:bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <span>Transactions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('aml')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs ${
              activeFilter === 'aml'
                ? 'bg-[#00236f] dark:bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <span>Account &amp; AML</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('compliance')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs ${
              activeFilter === 'compliance'
                ? 'bg-[#00236f] dark:bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <span>Compliance</span>
          </button>
        </div>

        {/* SECTION 1: ACTION REQUIRED */}
        {(activeFilter === 'all' || activeFilter === 'critical' || activeFilter === 'transactions') && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-rose-600 text-[18px]">priority_high</span>
                <h2 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  Action Required
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Live Escalations</span>
            </div>

            {/* Unrecognized Login Alert */}
            {alerts.some((a) => a.id === 'alert-login') && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-rose-200/80 dark:border-rose-900/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">warning</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          Unrecognized Login Attempt
                        </span>
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        New session detected from an unfamiliar autonomous network system.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissAlert('alert-login')}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f2f3ff] dark:bg-slate-800/80 flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">public</span>
                      <span>Frankfurt, Germany (AS16509)</span>
                    </span>
                    <span className="text-slate-400">Oct 24, 15:42 UTC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">devices</span>
                      <span>Windows NT • Chrome 130.0</span>
                    </span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">IP 185.191.171.42</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      dismissAlert('alert-login');
                      showToast('Emergency Lock Triggered: Session terminated & credentials frozen', 'error');
                    }}
                    className="h-9 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                    <span>Freeze &amp; Lock</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dismissAlert('alert-login');
                      showToast('Session verified and whitelisted', 'success');
                    }}
                    className="h-9 px-3 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>It was me</span>
                  </button>
                </div>
              </div>
            )}

            {/* Wire Transfer Pending Dual-Auth */}
            {alerts.some((a) => a.id === 'alert-wire-auth') && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-amber-200/80 dark:border-amber-900/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          Wire Transfer Pending Dual-Auth
                        </span>
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        Wire outbound exceeds singular signature tier ($10k+ policy).
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] dark:bg-amber-950 text-[#92400e] dark:text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-amber-300/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Signer 2/2</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#f2f3ff] dark:bg-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500">Beneficiary</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Apex Logistics LLC</p>
                    <span className="text-[11px] text-slate-500">FedLine Direct • US TR #121000358</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500">Amount</span>
                    <p className="text-base font-extrabold text-[#00236f] dark:text-blue-300">$24,500.00</p>
                    <span className="text-[11px] text-slate-400">Fedwire Fee $15.00</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => openBiometricModal()}
                    className="flex-1 h-9 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                    <span>Review &amp; Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dismissAlert('alert-wire-auth');
                      showToast('Wire transfer held for further review', 'warn');
                    }}
                    className="h-9 px-3 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 transition-colors"
                  >
                    Hold
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: TODAY'S LEDGER ACTIVITY */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Today's Ledger Activity
            </h2>
            <span className="text-xs text-slate-400">Oct 24, 2024</span>
          </div>

          {/* FedNow Inflow Notification */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#065f46] dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">FedNow Real-time Inflow</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#ecfdf5] dark:bg-emerald-950/70 text-[#065f46] dark:text-emerald-300 text-[10px] font-bold">
                      Cleared
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Stripe Merchant Settlement credited to Premier Checking (•••• 7319).
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">2:15 PM</span>
            </div>
            <div className="flex items-center justify-between pl-11 text-xs">
              <span className="font-bold text-[#10b981]">+$500.00 USD</span>
              <button
                type="button"
                onClick={() => showToast('Opening Settlement Receipt #TXN-89210-CR...', 'info')}
                className="text-[#0051d5] dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>Receipt</span>
                <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
              </button>
            </div>
          </div>

          {/* Card Velocity Anomaly */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#92400e] dark:text-amber-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Card Velocity Anomaly</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#fef3c7] dark:bg-amber-950 text-[#92400e] dark:text-amber-300 text-[10px] font-bold">
                      85% Cap
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Virtual SaaS Card (•••• 3319) reached 85% of monthly allocation threshold.
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">11:20 AM</span>
            </div>

            <div className="pl-11 space-y-1">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>$850.00 spent of $1,000.00 limit</span>
                <button
                  type="button"
                  onClick={() => showToast('Card ceiling adjust requested', 'info')}
                  className="text-[#0051d5] dark:text-blue-400 font-semibold hover:underline"
                >
                  Adjust Ceiling
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: AUDIT LOG & HISTORY */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Audit Log &amp; History
            </h2>
            <span className="text-xs text-slate-400">Earlier this week</span>
          </div>

          {/* Item 1: YubiKey */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">key</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  New Hardware Token Registered
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  FIDO2 YubiKey 5C NFC added to enterprise authorized signature roster.
                </p>
                <div className="mt-1 flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>Oct 23, 09:15 AM</span>
                  <span>•</span>
                  <span>Device Serial #YK-90214</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#10b981] text-[18px]">verified</span>
          </div>

          {/* Item 2: Statement */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-[#0051d5] dark:text-blue-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">description</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  September Consolidated Statement
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Monthly ledger reconciliations and tax reporting manifests ready.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Downloading PDF Statement...', 'info')}
                    className="h-7 px-2.5 rounded-lg bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    <span>PDF Statement</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Exporting Raw CSV ledger records...', 'info')}
                    className="h-7 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                  >
                    CSV Raw
                  </button>
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400 shrink-0">Oct 21</span>
          </div>

          {/* Item 3: Root Verified */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Audit Ledger Root Verified
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Cryptographic checkpoint root hash validated with FedLine Gateway Node #89194.
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Oct 20, 00:00 UTC • SHA-256 Verified
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[18px]">check</span>
          </div>
        </div>

        {/* Dispatch Channels */}
        <div className="rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/80 p-4 flex flex-col gap-2 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0051d5] text-[18px]">cell_tower</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Dispatch Channels</span>
            </div>
            <button
              type="button"
              onClick={() => showToast('Opening Multi-Channel Dispatch configuration...', 'info')}
              className="text-xs font-bold text-[#0051d5] dark:text-blue-400 hover:underline"
            >
              Configure
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              <span>Push Active</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              <span>SMS Backup (+1 ••• 4192)</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              <span>Email Digest (Daily)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
