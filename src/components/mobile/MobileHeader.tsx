import React from 'react';
import { useBank } from '../../context/BankContext';
import { FinCoreLogo } from '../common/FinCoreLogo';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = 'Dashboard',
  showBack = false,
  onBack,
}) => {
  const { setActiveMobileTab, alerts, showToast } = useBank();
  const unreadAlerts = alerts.filter((a) => a.unread).length;

  return (
    <header className="sticky top-0 w-full z-40 bg-[#faf8ff]/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-[#e2e7ff]/60 dark:border-slate-800/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] px-3 sm:px-4 py-2.5 flex items-center justify-between select-none">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            type="button"
            onClick={onBack || (() => setActiveMobileTab('home'))}
            className="w-10 h-10 -ml-1.5 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
        ) : null}

        <FinCoreLogo size="sm" showBankBadge={false} />

        <div className="flex flex-col -space-y-0.5 ml-0.5">
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#00236f] dark:text-blue-200 leading-tight">
            FinCore
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Security Shield Button */}
        <button
          type="button"
          onClick={() => setActiveMobileTab('alerts')}
          aria-label="Security and Notifications"
          className="w-10 h-10 relative flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">verified_user</span>
          {unreadAlerts > 0 ? (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-950 animate-pulse"></span>
          ) : (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950"></span>
          )}
        </button>

        {/* User Profile Avatar */}
        <button
          type="button"
          onClick={() => showToast('Elena Vance • Treasury Officer / Tier 3 Verified Enterprise Vault', 'info')}
          aria-label="User Profile"
          className="w-9 h-9 rounded-full ring-2 ring-blue-600/30 overflow-hidden relative active:scale-95 transition-transform"
        >
          <img
            alt="Elena Vance Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjMZ9OjhEkufJsUIYmpLgNuX7h7PJL8oFQdTBbS-JLSKNn0iSTkTGv8yTuI4i-BYfmdLqfcM3OOAF2x0sr_dpGy4fx4_9dLUjfJuDmPjbdOL9icOSTPRZ-XRRoS53MKre4-yprPr7VtYjH1L87AZwD20L2Ia7UTJIh1ewekuUzXRyFmPa2qy1AGMhXqRPg2isnmfc2nFMUIg3Anbu6JsoJHnaqXOU3skg71RVHG9G-kwGyNzUVRrHbpw"
            onError={(e) => {
              // fallback SVG avatar
              (e.currentTarget as HTMLImageElement).src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="%231e3a8a"/><text x="50%" y="54%" text-anchor="middle" fill="white" font-size="14" font-family="sans-serif" font-weight="bold">EV</text></svg>';
            }}
          />
        </button>
      </div>
    </header>
  );
};
