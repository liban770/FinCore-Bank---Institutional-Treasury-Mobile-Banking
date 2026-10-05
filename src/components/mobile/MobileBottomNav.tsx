import React from 'react';
import { useBank } from '../../context/BankContext';
import { MobileTab } from '../../types/bank';

export const MobileBottomNav: React.FC = () => {
  const { activeMobileTab, setActiveMobileTab } = useBank();

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 bg-[#faf8ff]/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-[#e2e7ff]/70 dark:border-slate-800/80 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] select-none">
      <div className="flex justify-around items-center h-16 px-1">
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => setActiveMobileTab('home')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] gap-1 transition-colors ${
            activeMobileTab === 'home'
              ? 'text-[#0051d5] dark:text-blue-400 font-semibold'
              : 'text-[#444651] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeMobileTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            account_balance
          </span>
          <span className="text-[11px] font-medium leading-none">Home</span>
        </button>

        {/* Tab 2: Accounts */}
        <button
          type="button"
          onClick={() => setActiveMobileTab('accounts')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] gap-1 transition-colors ${
            activeMobileTab === 'accounts'
              ? 'text-[#0051d5] dark:text-blue-400 font-semibold'
              : 'text-[#444651] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeMobileTab === 'accounts' ? "'FILL' 1" : "'FILL' 0" }}
          >
            wallet
          </span>
          <span className="text-[11px] font-medium leading-none">Accounts</span>
        </button>

        {/* Center Floating Elevated Tab: Transfer */}
        <button
          type="button"
          onClick={() => setActiveMobileTab('transfer')}
          className="flex flex-col items-center justify-center -mt-5 min-w-[52px] min-h-[52px] group"
        >
          <div className="w-12 h-12 rounded-full bg-[#0051d5] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,81,213,0.35)] transition-transform active:scale-95 group-hover:scale-105">
            <span className="material-symbols-outlined text-[24px]">swap_horiz</span>
          </div>
          <span className="text-[11px] text-[#0051d5] dark:text-blue-400 font-semibold mt-1 leading-none">
            Transfer
          </span>
        </button>

        {/* Tab 4: Activity */}
        <button
          type="button"
          onClick={() => setActiveMobileTab('activity')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] gap-1 transition-colors ${
            activeMobileTab === 'activity'
              ? 'text-[#0051d5] dark:text-blue-400 font-semibold'
              : 'text-[#444651] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeMobileTab === 'activity' ? "'FILL' 1" : "'FILL' 0" }}
          >
            receipt_long
          </span>
          <span className="text-[11px] font-medium leading-none">Activity</span>
        </button>

        {/* Tab 5: Cards / More */}
        <button
          type="button"
          onClick={() => setActiveMobileTab('cards')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] gap-1 transition-colors ${
            activeMobileTab === 'cards' || activeMobileTab === 'alerts'
              ? 'text-[#0051d5] dark:text-blue-400 font-semibold'
              : 'text-[#444651] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeMobileTab === 'cards' ? "'FILL' 1" : "'FILL' 0" }}
          >
            credit_card
          </span>
          <span className="text-[11px] font-medium leading-none">Cards</span>
        </button>
      </div>
    </nav>
  );
};
