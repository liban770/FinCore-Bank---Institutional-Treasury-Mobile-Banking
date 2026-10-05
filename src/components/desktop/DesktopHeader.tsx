import React from 'react';
import { useBank } from '../../context/BankContext';

export const DesktopHeader: React.FC = () => {
  const { alerts, showToast } = useBank();
  const unreadCount = alerts.filter((a) => a.unread).length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-[#e2e8f0] dark:border-slate-800 px-6 flex items-center justify-between select-none sticky top-0 z-30">
      {/* Search Input Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search accounts, payments, wire IDs..."
            className="w-full h-10 pl-9 pr-12 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0051d5] transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600">
            ⌘K
          </kbd>
        </div>

        {/* Live Encryption Indicator */}
        <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-[11px]">256-bit Encrypted • DRF API v2.4 Live</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => showToast(`You have ${unreadCount} unread security notifications`, 'info')}
          className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#ffddb8] text-[#5c3800] text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => showToast('Opening FinCore Institutional Support Docs...', 'info')}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

        {/* Elena Vance User Profile */}
        <div
          onClick={() => showToast('Session Active: Elena Vance (Treasury Officer)', 'info')}
          className="flex items-center gap-3 pl-1 cursor-pointer group"
        >
          <img
            alt="Elena Vance"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-600 transition-all"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjMZ9OjhEkufJsUIYmpLgNuX7h7PJL8oFQdTBbS-JLSKNn0iSTkTGv8yTuI4i-BYfmdLqfcM3OOAF2x0sr_dpGy4fx4_9dLUjfJuDmPjbdOL9icOSTPRZ-XRRoS53MKre4-yprPr7VtYjH1L87AZwD20L2Ia7UTJIh1ewekuUzXRyFmPa2qy1AGMhXqRPg2isnmfc2nFMUIg3Anbu6JsoJHnaqXOU3skg71RVHG9G-kwGyNzUVRrHbpw"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">
              Elena Vance
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Treasury Officer / Tier 3 Verified
            </span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">
            expand_more
          </span>
        </div>
      </div>
    </header>
  );
};
