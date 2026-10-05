import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { MobileHeader } from './MobileHeader';

export const MobileActivityLedger: React.FC = () => {
  const {
    transactions,
    formatCurrency,
    showToast,
  } = useBank();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'wires' | 'inflow' | 'cards' | 'pending'>('all');
  const [isTraceDrawerOpen, setIsTraceDrawerOpen] = useState(false);
  const [expandedTxnId, setExpandedTxnId] = useState<string | null>('txn-apex');

  const filteredTransactions = transactions.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.ref.toLowerCase().includes(q) ||
        t.accountSource.toLowerCase().includes(q) ||
        t.amount.toString().includes(q);
      if (!match) return false;
    }

    if (activeFilter === 'wires') {
      return t.type === 'Transfer' || t.type === 'Wire Deposit';
    }
    if (activeFilter === 'inflow') {
      return t.amount > 0;
    }
    if (activeFilter === 'cards') {
      return t.type === 'Card Spend' || t.subtitle.toLowerCase().includes('card');
    }
    if (activeFilter === 'pending') {
      return t.status !== 'Completed';
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full min-h-full bg-[#faf8ff] dark:bg-slate-950 pb-12">
      <MobileHeader title="Activity" />

      <div className="px-4 py-3 space-y-4">
        {/* Header Context */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight">
              Activity &amp; Ledger
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Real-time transaction log • FedLine Direct</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('Exporting ISO 20022 Audit Manifest...', 'info')}
              aria-label="Export Statements"
              className="w-9 h-9 rounded-xl bg-[#eaedff] dark:bg-slate-800 flex items-center justify-center text-[#00236f] dark:text-blue-300 hover:bg-blue-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Opening Advanced Ledger Filters...', 'info')}
              aria-label="Filter Preferences"
              className="w-9 h-9 rounded-xl bg-[#eaedff] dark:bg-slate-800 flex items-center justify-center text-[#00236f] dark:text-blue-300 hover:bg-blue-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>

        {/* Live Settlement Dispatched Banner (In-Flight Wire) */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1e3a8a] via-[#316bf3] to-[#00236f] text-white p-4 shadow-md relative overflow-hidden space-y-2.5">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-start justify-between gap-2 relative z-10">
            <div className="flex items-start gap-2.5">
              <div className="mt-1">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(255,185,95,0.9)] animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                    Settlement Dispatched
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                    In-Flight
                  </span>
                </div>
                <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] mt-0.5">
                  Wire Dispatched: $24,500.00 to Apex Logistics LLC
                </h3>
                <p className="text-[11px] text-blue-100/80 mt-0.5">
                  Signed 2/2 • Ref #FED-2024-89104-AZ • 15:42 UTC
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTraceDrawerOpen(!isTraceDrawerOpen)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold transition-all shadow-xs"
            >
              {isTraceDrawerOpen ? 'Close' : 'Trace'}
            </button>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
            <button
              type="button"
              onClick={() => showToast('Opening FedLine Direct Certificate #FED-2024-89104-AZ', 'info')}
              className="inline-flex items-center gap-1 font-semibold hover:underline"
            >
              <span>View FedLine Receipt</span>
              <span className="material-symbols-outlined text-[14px]">north_east</span>
            </button>
            <span className="text-[11px] flex items-center gap-1 opacity-90">
              <span className="material-symbols-outlined text-[13px]">verified_user</span> FedNow/Wire
            </span>
          </div>

          {/* Trace Drawer */}
          {isTraceDrawerOpen && (
            <div className="pt-2 border-t border-white/20 text-xs font-mono space-y-1 bg-black/20 p-2.5 rounded-xl">
              <div className="flex justify-between">
                <span className="text-blue-200">ISO 20022 Nonce:</span>
                <span className="font-bold">0x7F4A...B91C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Routing Protocol:</span>
                <span>FedLine Direct (#121000358)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Signer 2 (Biometric):</span>
                <span className="font-bold text-amber-300">Elena Vance [FIDO2 Passkey]</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Expected Settlement:</span>
                <span className="text-emerald-300 font-bold">T+0 (&lt; 4 mins)</span>
              </div>
            </div>
          )}
        </div>

        {/* Search Input Container */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payee, ID, amount, reference..."
            className="w-full h-11 pl-9 pr-10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-2xl text-xs shadow-2xs border border-slate-200/80 dark:border-slate-800 outline-none focus:border-blue-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Horizontal Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition-all ${
              activeFilter === 'all'
                ? 'bg-[#00236f] dark:bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('wires')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition-all ${
              activeFilter === 'wires'
                ? 'bg-[#00236f] dark:bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            Outbound Wires (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('inflow')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition-all ${
              activeFilter === 'inflow'
                ? 'bg-[#00236f] dark:bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            FedNow Inflow
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('cards')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition-all ${
              activeFilter === 'cards'
                ? 'bg-[#00236f] dark:bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            Card Spend
          </button>
        </div>

        {/* LEDGER SECTION: TODAY */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Today • Oct 24, 2024
            </span>
            <span className="text-xs text-slate-400">Live Operations</span>
          </div>

          <div className="space-y-2.5">
            {filteredTransactions.map((tx) => {
              const isExpanded = expandedTxnId === tx.id;
              const isApexWire = tx.title.includes('Apex');

              return (
                <div
                  key={tx.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border transition-all overflow-hidden ${
                    isApexWire
                      ? 'border-blue-400/80 dark:border-blue-600 shadow-md'
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div
                    onClick={() => setExpandedTxnId(isExpanded ? null : tx.id)}
                    className="p-4 cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                            tx.amount > 0
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-[#10b981]'
                              : isApexWire
                              ? 'bg-[#00236f] text-white'
                              : 'bg-[#eaedff] dark:bg-slate-800 text-[#0051d5] dark:text-blue-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {tx.amount > 0 ? 'bolt' : isApexWire ? 'account_balance' : 'receipt'}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {tx.title}
                            </span>
                            {isApexWire && (
                              <span className="material-symbols-outlined text-blue-600 text-[16px]">verified</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {tx.accountSource} • {tx.subtitle}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {tx.timestamp} • Ref #{tx.ref}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-base font-extrabold font-['Plus_Jakarta_Sans',sans-serif] block tabular-nums ${
                            tx.amount > 0 ? 'text-[#10b981]' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {formatCurrency(tx.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">USD</span>
                      </div>
                    </div>

                    {/* Status Pill & Metadata Row */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'Completed'
                              ? 'bg-[#ecfdf5] dark:bg-emerald-950/70 text-[#065f46] dark:text-emerald-300'
                              : 'bg-[#eaedff] dark:bg-blue-950/70 text-[#00236f] dark:text-blue-300'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{isApexWire ? 'Released to FedLine' : tx.status}</span>
                        </span>

                        {isApexWire && (
                          <span className="px-2 py-0.5 rounded-full bg-[#eaedff] dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                            Signed 2/2
                          </span>
                        )}
                      </div>

                      <span className="material-symbols-outlined text-slate-400 text-[18px]">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Audit Drawer */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-2 bg-[#f2f3ff]/40 dark:bg-slate-800/40">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1 border border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex justify-between">
                          <span className="font-sans text-slate-400">Cryptographic Nonce:</span>
                          <span className="font-bold">{tx.nonce || '0x4F1A...C091'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-sans text-slate-400">Clearing Speed:</span>
                          <span>{tx.speed || 'Sub-second real-time'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-sans text-slate-400">Authorized Session:</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">Elena Vance (Treasury)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => showToast(`Receipt for ${tx.ref} generated as PDF`, 'success')}
                          className="py-2 px-3 rounded-xl bg-[#00236f] dark:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">receipt</span>
                          <span>Receipt PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => showToast(`Prefilled counterparty for ${tx.title}`, 'info')}
                          className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                          <span>Repeat Wire</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Institutional Export Card */}
        <div className="rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/80 p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dae2fd] dark:bg-blue-950/80 text-[#00236f] dark:text-blue-300 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">policy</span>
            </div>
            <div>
              <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                Monthly Ledger Manifest
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Export ISO 20022 compliant XML, CSV or cryptographically signed PDF statements with FedLine audit hashes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => showToast('Exported ISO 20022 CSV Manifest (48 entries)', 'success')}
              className="h-10 rounded-xl bg-[#00236f] dark:bg-blue-600 hover:bg-[#00174b] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">table_view</span>
              <span>Download CSV</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Audit Hash #FED-9942 verified by FedLine node', 'info')}
              className="h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              <span>Audit Cert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
