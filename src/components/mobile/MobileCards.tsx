import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { MobileHeader } from './MobileHeader';

export const MobileCards: React.FC = () => {
  const {
    cards,
    activeCardIndex,
    setActiveCardIndex,
    isCardDetailsRevealed,
    toggleCardReveal,
    toggleCardFreeze,
    generateBurnerCard,
    securityRules,
    toggleSecurityRule,
    showToast,
  } = useBank();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [customLimit, setCustomLimit] = useState(10000);

  const activeCard = cards[activeCardIndex] || cards[0];

  const handleOpenPin = () => {
    setIsPinModalOpen(true);
    showToast('Encrypted PIN decrypted via Hardware Token', 'info');
  };

  const handleWallet = () => {
    showToast('Tokenization dispatched to Apple Wallet / Google Pay', 'success');
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-[#faf8ff] dark:bg-slate-950 pb-12">
      <MobileHeader title="Cards Management" />

      <div className="px-4 py-3 space-y-4">
        {/* Header Title & New Card CTA */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight">
              Cards Management
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Real-time Spend Control • {cards.length} Active
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={generateBurnerCard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Card</span>
          </button>
        </div>

        {/* Hero Interactive Physical Card Visual */}
        <div
          className={`relative w-full rounded-2xl p-5 bg-gradient-to-br ${activeCard.accentGradient} text-white shadow-xl overflow-hidden transition-all duration-300 select-none ${
            activeCard.isFrozen ? 'grayscale opacity-75' : ''
          }`}
        >
          {/* Subtle Ambient Card Glows */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-amber-400/15 blur-xl pointer-events-none"></div>

          {/* Top Row: Brand & Tier Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-300 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  shield
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-white">
                  FinCore
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#ffddb8] text-[#5c3800] text-[9px] font-extrabold tracking-wider uppercase">
                  BANK
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold">
              <span className={`w-1.5 h-1.5 rounded-full ${activeCard.isFrozen ? 'bg-rose-400' : 'bg-amber-300'}`}></span>
              <span>{activeCard.isFrozen ? 'Card Frozen' : activeCard.tier}</span>
            </div>
          </div>

          {/* EMV Chip & Contactless Icons */}
          <div className="relative z-10 flex items-center gap-3.5 my-6">
            <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-inner flex items-center justify-center p-1 opacity-95">
              <div className="w-full h-full rounded border border-amber-900/30 bg-amber-500/20 flex flex-col justify-between py-0.5">
                <div className="w-full h-0.5 bg-amber-100/70"></div>
                <div className="w-full h-0.5 bg-amber-100/70"></div>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/80 text-[20px] rotate-90">
              wifi
            </span>
          </div>

          {/* Card Number & Reveal Control */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-mono text-lg font-bold tracking-widest text-white">
              {isCardDetailsRevealed ? activeCard.numberFull : activeCard.numberMasked}
            </span>

            <button
              type="button"
              onClick={toggleCardReveal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">
                {isCardDetailsRevealed ? 'visibility_off' : 'visibility'}
              </span>
              <span>{isCardDetailsRevealed ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>

          {/* Bottom Cardholder & Expiry Row */}
          <div className="relative z-10 flex items-end justify-between mt-5 pt-2 border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-slate-300">Cardholder</span>
              <span className="text-xs font-bold tracking-wider uppercase text-white mt-0.5">
                {activeCard.cardholder}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-slate-300">Expires</span>
                <span className="text-xs font-mono font-bold text-white mt-0.5">
                  {activeCard.expiry}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-slate-300">CVV</span>
                <span className="text-xs font-mono font-bold tracking-widest text-white mt-0.5">
                  {isCardDetailsRevealed ? activeCard.cvv : '•••'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Card Selector Rail */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          {cards.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCardIndex(idx)}
              className={`flex-1 min-w-[138px] p-3 rounded-2xl flex flex-col text-left transition-all border ${
                activeCardIndex === idx
                  ? 'bg-white dark:bg-slate-900 border-blue-600 dark:border-blue-500 shadow-xs'
                  : 'bg-[#f2f3ff] dark:bg-slate-800/80 border-transparent hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`w-2 h-2 rounded-full ${activeCardIndex === idx ? 'bg-[#0051d5]' : 'bg-slate-400'}`}></span>
                <span className={`text-xs font-mono ${activeCardIndex === idx ? 'text-[#0051d5] font-bold' : 'text-slate-500'}`}>
                  {c.numberMasked.slice(-4)}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate w-full">
                {c.tier}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate w-full">
                {c.subtitle}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Card Controls Row */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Freeze */}
          <button
            type="button"
            onClick={() => toggleCardFreeze(activeCard.id)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 active:scale-95 transition-all"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                activeCard.isFrozen
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {activeCard.isFrozen ? 'lock' : 'lock_open'}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              {activeCard.isFrozen ? 'Unfreeze' : 'Freeze'}
            </span>
          </button>

          {/* View PIN */}
          <button
            type="button"
            onClick={handleOpenPin}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#eaedff] dark:bg-slate-800 text-[#0051d5] dark:text-blue-300 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[20px]">key</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">View PIN</span>
          </button>

          {/* Set Limit */}
          <button
            type="button"
            onClick={() => setIsLimitModalOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#eaedff] dark:bg-slate-800 text-[#0051d5] dark:text-blue-300 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">Set Limit</span>
          </button>

          {/* Add to Apple Wallet */}
          <button
            type="button"
            onClick={handleWallet}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#eaedff] dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate w-full text-center">
              Add Wallet
            </span>
          </button>
        </div>

        {/* Monthly Card Spend & Budget Utilization */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Monthly Card Spend</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                  ${activeCard.monthlySpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-slate-500">
                  / ${activeCard.monthlyLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#eaedff] dark:bg-blue-950/70 text-[#0051d5] dark:text-blue-300 text-xs font-bold">
              {((activeCard.monthlySpent / activeCard.monthlyLimit) * 100).toFixed(1)}%
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            <div className="h-full bg-[#0051d5] rounded-l-full" style={{ width: '62%' }}></div>
            <div className="h-full bg-[#316bf3]" style={{ width: '24%' }}></div>
            <div className="h-full bg-amber-400 rounded-r-full" style={{ width: '14%' }}></div>
          </div>

          {/* Category Legend */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0051d5]"></span>
              <span>SaaS (62%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#316bf3]"></span>
              <span>Travel (24%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Dining (14%)</span>
            </div>
          </div>
        </div>

        {/* Security & Control Rules */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0051d5] dark:text-blue-400 text-[22px]">
                admin_panel_settings
              </span>
              <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                Security &amp; Control Rules
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">FinCore Guard</span>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80">
            {securityRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between pt-2.5 first:pt-0">
                <div className="flex flex-col pr-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {rule.title}
                    </span>
                    {rule.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
                        {rule.badge}
                      </span>
                    )}
                    {rule.key === 'velocityKillSwitch' && (
                      <span className="material-symbols-outlined text-amber-500 text-[14px]">bolt</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {rule.description}
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={rule.enabled}
                  onClick={() => toggleSecurityRule(rule.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    rule.enabled ? 'bg-[#0051d5]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                      rule.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Disposable Burner Cards Banner */}
        <div className="relative p-4 rounded-2xl bg-gradient-to-r from-[#eaedff] to-[#f2f3ff] dark:from-slate-900 dark:to-slate-800/90 border border-blue-200/60 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-600 text-amber-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            </div>
            <span className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              Disposable Burner Cards
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Need a safe single-use card for unfamiliar vendors? Generate an instant virtual card that auto-destroys immediately after checkout.
          </p>

          <div className="pt-1">
            <button
              type="button"
              onClick={generateBurnerCard}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 active:scale-95 transition-all text-xs font-bold shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400 dark:text-amber-600">auto_awesome</span>
              <span>Generate Single-Use Burner</span>
            </button>
          </div>
        </div>

        {/* Recent Card Activity Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              Recent Card Activity
            </h2>
            <button
              type="button"
              onClick={() => showToast('Filtered to active card ledger entries', 'info')}
              className="text-xs font-semibold text-[#0051d5] dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>View all</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {/* Tx 1: AWS */}
            <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">AWS EMEA Cloud Services</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-slate-400">Today, 2:15 PM</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900 dark:text-white">-$840.00</span>
                <span className="text-[11px] text-slate-400">SaaS</span>
              </div>
            </div>

            {/* Tx 2: Delta */}
            <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-[#0051d5] dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Delta Air Lines NY</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-slate-400">Oct 22, 10:45 AM</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#ecfdf5] dark:bg-emerald-950/70 text-[#065f46] dark:text-emerald-300 text-[10px] font-semibold">
                      Settled
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900 dark:text-white">-$480.00</span>
                <span className="text-[11px] text-slate-400">Travel</span>
              </div>
            </div>

            {/* Tx 3: Uber */}
            <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">directions_car</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Uber Executive Ride</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-slate-400">Oct 21, 6:30 PM</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#ecfdf5] dark:bg-emerald-950/70 text-[#065f46] dark:text-emerald-300 text-[10px] font-semibold">
                      Settled
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900 dark:text-white">-$45.20</span>
                <span className="text-[11px] text-slate-400">Transport</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PIN Decryption Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 max-w-xs w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">key</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Encrypted Card PIN
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                FIDO2 Hardware Key Authenticated for {activeCard.tier}
              </p>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-2xl font-extrabold tracking-widest text-slate-900 dark:text-white">
              7 8 2 4
            </div>
            <button
              type="button"
              onClick={() => setIsPinModalOpen(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Done / Conceal PIN
            </button>
          </div>
        </div>
      )}

      {/* Limit Modal */}
      {isLimitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Set Spend Policy Limit
              </h3>
              <button
                type="button"
                onClick={() => setIsLimitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Set maximum monthly authorization ceiling for {activeCard.tier}.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Monthly Limit:</span>
                <span className="text-blue-600 dark:text-blue-400">${customLimit.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={customLimit}
                onChange={(e) => setCustomLimit(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setIsLimitModalOpen(false);
                showToast(`Limit for ${activeCard.tier} updated to $${customLimit.toLocaleString()}`, 'success');
              }}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Apply Policy Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
