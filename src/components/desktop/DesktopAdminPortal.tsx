import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { AdminAuditLogSection } from './AdminAuditLogSection';
import { ComplianceMonitoringWidget } from './ComplianceMonitoringWidget';

export const DesktopAdminPortal: React.FC = () => {
  const { nodeName, latencyMs, showToast } = useBank();
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'med' | 'low'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState<string>('Dashboard');

  const handleFreezeQueue = () => {
    showToast('CRITICAL PROTOCOL: Emergency freeze triggered for review queue. 34 transactions held.', 'error');
  };

  const handleCompliance = () => {
    showToast('Generating FinCEN SAR & CTR batch export manifest...', 'info');
  };

  return (
    <div className="flex flex-col w-full select-none bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Interactive Admin Portal Active Bar */}
      <div className="bg-[#eaedff] dark:bg-slate-900 border-b border-blue-200/60 dark:border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full shadow-2xs border border-blue-200/50 dark:border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0051d5] animate-pulse"></span>
            <span className="text-[11px] font-bold text-[#00236f] dark:text-blue-300 uppercase tracking-wider">
              Admin Portal Active
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Monitoring Node: <strong className="text-slate-800 dark:text-slate-200">{nodeName}</strong>
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs text-[#0051d5] dark:text-blue-400 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            DRF API v2.4 ({latencyMs}ms latency)
          </span>
        </div>

        {/* Admin Navigation Breadcrumbs */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-2xs border border-slate-200/60 dark:border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setActiveAdminTab('Dashboard')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-2xs transition-all ${
              activeAdminTab === 'Dashboard'
                ? 'bg-[#0051d5] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">monitoring</span>
            <span>Dashboard</span>
          </button>
          {['Customers', 'Accounts', 'Transactions', 'Compliance', 'Reports', 'Audit Logs', 'System Settings'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveAdminTab(tab);
                if (tab === 'Compliance') {
                  const el = document.getElementById('compliance-monitoring-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
                showToast(`Switched admin module to ${tab}`, 'info');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeAdminTab === tab
                  ? 'bg-[#0051d5] text-white font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        {/* Top Command & Action Bar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#00236f] dark:text-blue-100 tracking-tight">
                Administrative Supervision &amp; Liquidity
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] dark:bg-blue-950 text-[#00236f] dark:text-blue-300 text-xs font-bold">
                Tier-4 Sovereign Access
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Active Superuser: <strong className="text-slate-800 dark:text-slate-200">Elena Vance</strong> (ID: #FC-ADM-0941)</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Kafka Event Bus: In-Sync
              </span>
              <span>•</span>
              <span>Last Rebalance: 15:42:01 UTC</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setActiveAdminTab('Compliance');
                const el = document.getElementById('compliance-monitoring-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                showToast('Navigated to Compliance Monitoring & Risk Rules Engine', 'info');
              }}
              className="h-10 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 shadow-2xs hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-rose-600">shield_alert</span>
              <span>Compliance Monitor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            </button>

            <button
              type="button"
              onClick={handleCompliance}
              className="h-10 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-2xs transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0051d5]">file_download</span>
              <span>Generate Compliance Report</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveAdminTab('Audit Logs');
                const el = document.getElementById('admin-audit-log-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                showToast('Navigated to Administrative Audit Trail', 'info');
              }}
              className="h-10 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-2xs transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0051d5]">history_edu</span>
              <span>Audit Trail</span>
            </button>
            <button
              type="button"
              onClick={handleFreezeQueue}
              className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[18px]">lock_clock</span>
              <span>Freeze Queue</span>
            </button>
          </div>
        </div>

        {/* If Compliance tab is explicitly selected in breadcrumb */}
        {activeAdminTab === 'Compliance' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-rose-600">shield_alert</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Focus Mode: Real-Time Compliance Surveillance &amp; Risk Rule Breaches
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveAdminTab('Dashboard')}
                className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
              >
                ← Return to Supervision Overview
              </button>
            </div>
            <ComplianceMonitoringWidget />
          </div>
        )}

        {/* If Audit Logs tab is explicitly selected in breadcrumb */}
        {activeAdminTab === 'Audit Logs' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-blue-600">history_edu</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Focus Mode: Administrative Audit Trail &amp; Ledger Proofs
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveAdminTab('Dashboard')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                ← Return to Supervision Overview
              </button>
            </div>
            <AdminAuditLogSection />
          </div>
        )}

        {/* 6 Primary Admin Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Card 1: Total Customers */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Customers</span>
              <span className="material-symbols-outlined text-[#0051d5] text-[20px]">people_alt</span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                48,290
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-[15px] text-[#0051d5]">trending_up</span>
              <span className="font-bold text-[#0051d5]">+12.4%</span>
              <span className="text-slate-400">MoM onboarding</span>
            </div>
          </div>

          {/* Card 2: Total Accounts */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Accounts</span>
              <span className="material-symbols-outlined text-[#00236f] dark:text-blue-300 text-[20px]">account_balance_wallet</span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                76,410
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0051d5]"></span>
              <span>Checking, Savings &amp; Vaults</span>
            </div>
          </div>

          {/* Card 3: Total Transactions */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Transactions</span>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">swap_horiz</span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                1,842,910
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="material-symbols-outlined text-[15px] text-[#0051d5]">done_all</span>
              <span>Ledger finalized</span>
            </div>
          </div>

          {/* Card 4: Volume (YTD) */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Volume (YTD)</span>
              <span className="material-symbols-outlined text-[#0051d5] text-[20px]">paid</span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                $284.6M
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-[15px] text-[#0051d5]">trending_up</span>
              <span className="font-bold text-[#0051d5]">+18.2%</span>
              <span className="text-slate-400">gross volume</span>
            </div>
          </div>

          {/* Card 5: Pending Clearance (Yellow) */}
          <div className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 p-4 rounded-2xl shadow-sm border border-amber-200/70 dark:border-amber-900/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                Pending Clearance
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] dark:bg-amber-900 text-[#5c3800] dark:text-amber-200 text-[10px] font-bold">
                Review Q
              </span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-amber-950 dark:text-amber-300">
                  34
                </span>
                <span className="text-xs text-slate-500">queued</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold">
              <span>Review Val:</span>
              <span>$42,800.00</span>
            </div>
          </div>

          {/* Card 6: AML & Flagged (Red) */}
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900 p-4 rounded-2xl shadow-sm border border-rose-200/70 dark:border-rose-900/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider">
                AML &amp; Flagged
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                Action Req
              </span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-rose-600 dark:text-rose-400">
                  12
                </span>
                <span className="text-xs text-slate-500">flagged</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-rose-700 dark:text-rose-400 font-semibold">
              <span>Rate: 0.006%</span>
              <span>4 AML holds</span>
            </div>
          </div>
        </div>

        {/* Real-time Compliance Monitoring Dashboard Widget */}
        <div id="compliance-monitoring-section" className="space-y-4">
          <ComplianceMonitoringWidget />
        </div>

        {/* Administrative Charts Grid (2x2 Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Transaction Volume & Velocity */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                  Transaction Volume &amp; Velocity Spikes
                </h3>
                <span className="text-xs text-slate-500">Hourly TPS &amp; settlement throughput (Past 24 Hours)</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button type="button" className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 text-xs font-bold text-[#00236f] dark:text-blue-300 shadow-2xs">
                  Hourly
                </button>
                <button type="button" className="px-2.5 py-1 rounded text-xs text-slate-500 hover:text-slate-900">
                  Daily
                </button>
                <button type="button" className="px-2.5 py-1 rounded text-xs text-slate-500 hover:text-slate-900">
                  30D
                </button>
              </div>
            </div>

            <div className="w-full h-56 relative flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="volGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#0051d5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0051d5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line stroke="#eaedff" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="40" y2="40" className="dark:stroke-slate-800" />
                <line stroke="#eaedff" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="90" y2="90" className="dark:stroke-slate-800" />
                <line stroke="#eaedff" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="600" y1="140" y2="140" className="dark:stroke-slate-800" />

                <path d="M0,170 Q45,150 90,135 T180,85 T270,115 T360,45 T450,95 T540,60 T600,40 L600,200 L0,200 Z" fill="url(#volGrad)" />
                <path d="M0,170 Q45,150 90,135 T180,85 T270,115 T360,45 T450,95 T540,60 T600,40" fill="none" stroke="#0051d5" strokeLinecap="round" strokeWidth="3" />
                <circle cx="360" cy="45" fill="#0051d5" r="5" className="animate-ping opacity-75" />
                <circle cx="360" cy="45" fill="#00236f" r="5" />
                <circle cx="600" cy="40" fill="#0051d5" r="5" />
              </svg>

              <div className="absolute top-2 left-64 bg-[#00236f] dark:bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono shadow-md flex items-center gap-1">
                <span>Peak Velocity: 4,120 tx/min</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 text-slate-500 text-xs">
              <span>00:00 UTC</span>
              <span>06:00 UTC</span>
              <span>12:00 UTC (US Open)</span>
              <span>18:00 UTC (EU Close)</span>
              <span>Current (15:45)</span>
            </div>
          </div>

          {/* Chart 2: Deposits vs Withdrawals */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                  Deposits vs. Withdrawals Ratio
                </h3>
                <span className="text-xs text-slate-500">Daily net liquidity delta (Cumulative +$14.2M Net Inflow)</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#0051d5]"></span> Deposits</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#1e3a8a]"></span> Withdrawals</span>
              </div>
            </div>

            <div className="w-full h-56 flex items-end justify-between px-4 pt-4">
              {[
                { day: 'Mon', inH: '65%', outH: '40%' },
                { day: 'Tue', inH: '82%', outH: '52%' },
                { day: 'Wed', inH: '94%', outH: '60%' },
                { day: 'Thu', inH: '70%', outH: '45%' },
                { day: 'Fri', inH: '98%', outH: '55%' },
                { day: 'Sat', inH: '48%', outH: '30%' },
                { day: 'Today', inH: '88%', outH: '38%', active: true },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end flex-1">
                  <div className="flex items-end gap-1.5 h-40">
                    <div className="w-3.5 bg-[#0051d5] rounded-t" style={{ height: item.inH }}></div>
                    <div className="w-3.5 bg-[#1e3a8a] dark:bg-blue-900 rounded-t" style={{ height: item.outH }}></div>
                  </div>
                  <span className={`text-xs ${item.active ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Deposit Inflow: <strong className="text-slate-900 dark:text-white">$38.4M</strong></span>
              <span>Withdrawal Outflow: <strong className="text-slate-900 dark:text-white">$24.2M</strong></span>
              <span className="font-bold text-[#0051d5] dark:text-blue-400">Net +$14.2M Surplus</span>
            </div>
          </div>

          {/* Chart 3: Customer Growth */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                  Customer Verification &amp; Growth
                </h3>
                <span className="text-xs text-slate-500">KYC Tier 1-3 completion trajectory</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#eaedff] dark:bg-blue-950 text-[#00236f] dark:text-blue-300 text-xs font-bold">
                99.1% Pass Rate
              </span>
            </div>

            <div className="w-full h-56 relative flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="growthGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#316bf3" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#316bf3" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,180 C100,160 200,140 300,100 C400,60 500,40 600,20 L600,200 L0,200 Z" fill="url(#growthGrad)" />
                <path d="M0,180 C100,160 200,140 300,100 C400,60 500,40 600,20" fill="none" stroke="#316bf3" strokeWidth="3" />
              </svg>
              <div className="absolute bottom-16 right-8 bg-white dark:bg-slate-800 shadow-md p-3 rounded-xl flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-[#0051d5] text-[20px]">verified</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">48,290 Verified</span>
                  <span className="text-[10px] text-slate-400">Zero backlog today</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 text-center text-xs">
              <div className="bg-[#f2f3ff] dark:bg-slate-800/80 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block">Tier 1 Basic</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">29,400</span>
              </div>
              <div className="bg-[#f2f3ff] dark:bg-slate-800/80 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block">Tier 2 Enhanced</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">14,210</span>
              </div>
              <div className="bg-[#f2f3ff] dark:bg-slate-800/80 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block">Tier 3 Corporate</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">4,680</span>
              </div>
            </div>
          </div>

          {/* Chart 4: Donut Chart Health */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                  Transaction Status Health
                </h3>
                <span className="text-xs text-slate-500">Current real-time ledger settlement breakdown</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">info</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around h-56 gap-4">
              {/* Donut SVG */}
              <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="none" r="15.915" stroke="#eaedff" strokeWidth="3.5" className="dark:stroke-slate-800" />
                  <circle cx="18" cy="18" fill="none" r="15.915" stroke="#0051d5" strokeDasharray="98.4 1.6" strokeDashoffset="0" strokeWidth="3.5" />
                  <circle cx="18" cy="18" fill="none" r="15.915" stroke="#f59e0b" strokeDasharray="1.2 98.8" strokeDashoffset="-98.4" strokeWidth="3.5" />
                  <circle cx="18" cy="18" fill="none" r="15.915" stroke="#e11d48" strokeDasharray="0.4 99.6" strokeDashoffset="-99.6" strokeWidth="3.5" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-[#00236f] dark:text-blue-300">98.4%</span>
                  <span className="text-[11px] text-slate-500">Settled</span>
                </div>
              </div>

              {/* Legend Metrics */}
              <div className="flex flex-col gap-2 w-full max-w-xs text-xs">
                <div className="flex items-center justify-between p-2 bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0051d5]"></span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Cleared &amp; Final</span>
                  </div>
                  <span className="font-mono font-bold">1,813,423</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-900 dark:text-amber-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="font-semibold">Pending Settlement</span>
                  </div>
                  <span className="font-mono font-bold">22,115</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-900 dark:text-rose-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="font-semibold">Flagged / AML Stop</span>
                  </div>
                  <span className="font-mono font-bold">7,372</span>
                </div>
              </div>
            </div>

            <div className="pt-3 text-right text-xs text-slate-400">
              Continuous reconciliation frequency: 1000ms
            </div>
          </div>
        </div>

        {/* Real-time AML & Risk Management Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-6 bg-[#f2f3ff] dark:bg-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                  Real-time Transaction Monitoring &amp; AML Rules Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#0051d5] text-white text-[10px] font-bold uppercase">
                  Live Feed
                </span>
              </div>
              <p className="text-xs text-slate-500">
                High-frequency screening against OFAC, PEP, and velocity variance thresholds
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-400 px-2 font-bold">Risk:</span>
                {(['all', 'high', 'med', 'low'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRiskFilter(r)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      riskFilter === r
                        ? 'bg-[#0051d5] text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {r === 'all' ? 'All (5)' : r === 'high' ? 'High Risk' : r === 'med' ? 'Medium' : 'Low'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setAutoRefresh(!autoRefresh);
                  showToast(autoRefresh ? 'Auto-refresh paused' : 'Auto-refresh resumed (3s)', 'info');
                }}
                className="h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-2xs"
              >
                <span className={`material-symbols-outlined text-[16px] text-blue-600 ${autoRefresh ? 'animate-spin' : ''}`}>
                  autorenew
                </span>
                <span>Auto-refresh ({autoRefresh ? '3s' : 'Off'})</span>
              </button>
            </div>
          </div>

          {/* Safety Alert Banner */}
          <div className="mx-6 my-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center gap-3 text-rose-900 dark:text-rose-200 text-xs leading-relaxed">
            <span className="material-symbols-outlined text-[22px] text-rose-600 shrink-0">gavel</span>
            <div>
              <strong>Safety &amp; Compliance Protocol:</strong> Freezing an account or flagging a transaction sends immediate immutable audit webhooks to FinCEN and SMS notification to the customer. All actions are cryptographically signed by your session key.
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f3ff] dark:bg-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Customer &amp; Email</th>
                  <th className="py-3 px-4">Account</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Risk Indicator</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Supervisory Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Row 1: High Risk */}
                <tr className="bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#00236f] dark:text-blue-300">TXN-99412-WD</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">David Sterling</div>
                    <div className="text-slate-400 font-mono text-[11px]">d.sterling@fin.com</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">Checking ••3319</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">-$24,500.00</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">Wire Out</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">Oct 24, 15:40</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[11px] inline-flex items-center gap-1.5 border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                      HIGH RISK (Velocity anomaly)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                      Under Review
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => showToast('Opening forensic transaction inspector...', 'info')}
                        className="px-2.5 py-1 rounded bg-[#0051d5] text-white font-bold text-xs hover:bg-blue-700"
                      >
                        Investigate
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast('Transaction TXN-99412-WD frozen and held', 'error')}
                        className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                      >
                        Freeze
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast('Transaction TXN-99412-WD manually approved by supervisor', 'success')}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200"
                      >
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 2: Completed */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#00236f] dark:text-blue-300">TXN-99408-CR</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">Olivia Bennett</div>
                    <div className="text-slate-400 font-mono text-[11px]">olivia.b@techcorp.io</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">Business ••8842</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0051d5]">+$150,000.00</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">ACH Inflow</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">Oct 24, 15:35</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0051d5]"></span>
                      LOW RISK (Verified merchant)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                      Completed
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => showToast('Audit record verified', 'info')}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      Audit
                    </button>
                  </td>
                </tr>

                {/* Row 3: Med Risk KYC Hold */}
                <tr className="bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#00236f] dark:text-blue-300">TXN-99395-TR</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">Carlos Mendes</div>
                    <div className="text-slate-400 font-mono text-[11px]">cmendes@rio.org</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">Savings ••9102</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">-$9,800.00</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">Int'l Wire</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">Oct 24, 15:22</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold inline-flex items-center gap-1 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      MED RISK (Cross-border)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                      Compliance Hold
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => showToast('Reviewing Carlos Mendes KYC documentation...', 'info')}
                        className="px-2.5 py-1 rounded bg-[#0051d5] text-white font-bold text-xs"
                      >
                        Review KYC
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast('Compliance hold released for TXN-99395-TR', 'success')}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
                      >
                        Release
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#f2f3ff] dark:bg-slate-800/80 border-t border-slate-200/60 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Showing <strong>5</strong> of <strong>34 flagged/queued</strong> transactions (Total database: 1,842,910 records)</span>
            <div className="flex items-center gap-1">
              <span className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 font-bold text-[#00236f] dark:text-blue-300 shadow-2xs">1</span>
              <button type="button" className="px-2.5 py-1 rounded hover:bg-slate-200">2</button>
              <button type="button" className="px-2.5 py-1 rounded hover:bg-slate-200">3</button>
              <span>...</span>
              <button type="button" className="px-2.5 py-1 rounded hover:bg-slate-200">7</button>
            </div>
          </div>
        </div>

        {/* Dedicated Administrative Audit Log Section */}
        <AdminAuditLogSection />

        {/* Component Showcase Drawer / System Standards */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0051d5]">widgets</span>
                FinCore Institutional Design System &amp; Reusable State Standards
              </h3>
              <p className="text-xs text-slate-500">Standardized UI tokens, state machines, badges, and feedback components</p>
            </div>
            <span className="font-mono text-xs text-slate-400">v2.4.0-DRF-SPEC</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-xs">
            {/* Box 1: Button States */}
            <div className="bg-[#f2f3ff] dark:bg-slate-800/80 p-4 rounded-xl space-y-2.5">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">Button State Standards</span>
              <button type="button" className="w-full py-2 rounded-xl bg-[#0051d5] text-white font-bold flex items-center justify-center gap-1 shadow-xs">
                <span>Primary Blue (Action)</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <button type="button" className="w-full py-2 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-600 shadow-2xs">
                Secondary Neutral
              </button>
              <button type="button" className="w-full py-2 rounded-xl bg-[#ffddb8] text-[#5c3800] font-bold flex items-center justify-center gap-1 shadow-2xs">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Yellow Accent Quick</span>
              </button>
              <button type="button" className="w-full py-2 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center gap-1 shadow-xs">
                <span className="material-symbols-outlined text-[16px]">block</span>
                <span>Destructive Red</span>
              </button>
            </div>

            {/* Box 2: Badges */}
            <div className="bg-[#f2f3ff] dark:bg-slate-800/80 p-4 rounded-xl space-y-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">Audit &amp; Ledger Badges</span>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-700">
                <span className="text-slate-500">Settled / Cleared:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Completed
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-700">
                <span className="text-slate-500">Pending Escrow:</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#5c3800] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-700">
                <span className="text-slate-500">Suspicious Event:</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> High Risk
                </span>
              </div>
            </div>

            {/* Box 3: Shimmer Loader */}
            <div className="bg-[#f2f3ff] dark:bg-slate-800/80 p-4 rounded-xl space-y-2">
              <div className="flex justify-between font-bold text-slate-500 uppercase tracking-wider">
                <span>Skeleton Loading</span>
                <span className="font-mono text-blue-600 text-[10px]">SHIMMER</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-xl space-y-2.5 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-600 rounded"></div>
                  <div className="h-3 w-8 bg-slate-200 dark:bg-slate-600 rounded"></div>
                </div>
                <div className="h-5 w-32 bg-slate-300 dark:bg-slate-500 rounded"></div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-600 rounded"></div>
              </div>
              <span className="text-[11px] text-slate-400 block text-center">Async transaction queue preview</span>
            </div>

            {/* Box 4: Empty Queue */}
            <div className="bg-[#f2f3ff] dark:bg-slate-800/80 p-4 rounded-xl flex flex-col justify-between">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">Empty Queue Mockup</span>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-xl flex flex-col items-center justify-center text-center py-4 shadow-2xs">
                <span className="material-symbols-outlined text-[32px] text-[#0051d5] mb-1">task_alt</span>
                <span className="font-bold text-slate-900 dark:text-white">Queue Cleared</span>
                <span className="text-[11px] text-slate-400 mt-0.5">No flagged transactions</span>
              </div>
              <span className="text-[11px] text-slate-400 text-center">Zero-exception state feedback</span>
            </div>
          </div>

          {/* Settlement Banner Notification */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border-l-4 border-[#0051d5] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0051d5] dark:text-blue-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">Settlement Order Finalized</span>
                  <span className="font-mono text-slate-400 text-[11px]">Ref: TXN-89210-CR</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transfer of <strong>$500.00</strong> successfully processed to checking account. Immediate clearing confirmed.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast('Receipt TXN-89210-CR opened in viewer', 'info')}
              className="px-3 py-1.5 rounded-lg bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 text-xs font-bold hover:bg-blue-100 shrink-0"
            >
              View Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
