import React from 'react';
import { useBank } from '../../context/BankContext';
import { FinCoreLogo } from '../common/FinCoreLogo';
import { DesktopTab } from '../../types/bank';

export const DesktopSidebar: React.FC = () => {
  const { activeDesktopTab, setActiveDesktopTab, showToast } = useBank();

  const navItems: { id: DesktopTab; label: string; icon: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { id: 'accounts', label: 'My Accounts', icon: 'account_balance' },
    { id: 'transactions', label: 'Transactions', icon: 'receipt_long' },
    { id: 'transfer', label: 'Transfer Money', icon: 'sync_alt', badge: 'Quick' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-[#e2e8f0] dark:border-slate-800 flex flex-col justify-between shrink-0 select-none min-h-screen">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center border-b border-[#e2e8f0] dark:border-slate-800">
          <FinCoreLogo size="md" />
        </div>

        {/* Customer Portal Nav Section */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Customer Portal
          </div>

          {navItems.map((item) => {
            const isActive = activeDesktopTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveDesktopTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#eaedff] dark:bg-blue-950/80 text-[#00236f] dark:text-blue-300 border-l-4 border-[#0051d5]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="bg-[#ffddb8] dark:bg-amber-950 text-[#5c3800] dark:text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => showToast('Opening Deposit Options dialog...', 'info')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
            <span>Deposit</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Opening Outbound Liquidity / Withdrawal flow...', 'info')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
            <span>Withdraw</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Opening Counterparty Directory (28 active)...', 'info')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span>Beneficiaries</span>
          </button>

          {/* Organization & Tools */}
          <div className="pt-4 px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Organization &amp; Tools
          </div>

          <button
            type="button"
            onClick={() => showToast('Opening Notifications & Alerts center...', 'info')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span>Notifications</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Opening Security & Cryptographic Access settings...', 'info')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            <span>Settings &amp; Security</span>
          </button>
        </nav>
      </div>

      {/* Switch to Admin Portal Button */}
      <div className="p-3 border-t border-[#e2e8f0] dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveDesktopTab('admin')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            activeDesktopTab === 'admin'
              ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#0051d5] dark:text-blue-400">
              shield
            </span>
            <span>Switch to Admin</span>
          </div>
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </button>
      </div>
    </aside>
  );
};
