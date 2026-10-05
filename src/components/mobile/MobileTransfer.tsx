import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { MobileHeader } from './MobileHeader';
import { Beneficiary } from '../../types/bank';

export const MobileTransfer: React.FC = () => {
  const {
    accounts,
    beneficiaries,
    selectedBeneficiary,
    setSelectedBeneficiary,
    executeTransfer,
    setActiveMobileTab,
    showToast,
  } = useBank();

  const [rail, setRail] = useState<'internal' | 'fednow' | 'wire'>('internal');
  const [amount, setAmount] = useState<string>('500.00');
  const [memo, setMemo] = useState<string>('Quarterly reserve transfer');
  const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState<boolean>(false);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);

  // Selected target
  const [toAccountName, setToAccountName] = useState<string>('High-Yield Savings');
  const [toAccountMask, setToAccountMask] = useState<string>('•••• 4821');

  const parsedAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const protocolFee = rail === 'wire' ? 15.00 : 0.00;
  const totalOutflow = parsedAmount + protocolFee;

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setSelectedBeneficiary(b);
    setToAccountName(b.name);
    setToAccountMask(b.accountMask);
    showToast(`Selected beneficiary: ${b.name}`, 'info');
  };

  const handleSwapAccounts = () => {
    const tempName = toAccountName;
    const tempMask = toAccountMask;
    setToAccountName('Premier Checking');
    setToAccountMask('•••• 7319');
    showToast(`Target switched to ${tempName}`, 'info');
  };

  const handleQuickAmount = (val: string) => {
    setAmount(val);
  };

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      executeTransfer({
        fromAccountId: 'acc-checking',
        toAccountName,
        toAccountMask,
        amount: parsedAmount,
        fee: protocolFee,
        memo,
        rail: rail === 'wire' ? 'Fedwire Direct' : rail === 'fednow' ? 'Instant FedNow' : 'Internal',
      });
      setIsAuthorizing(false);
      setIsConfirmSheetOpen(false);
      setActiveMobileTab('activity');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-[#faf8ff] dark:bg-slate-950 pb-12">
      <MobileHeader title="Transfer Funds" showBack onBack={() => setActiveMobileTab('home')} />

      <div className="px-4 py-3 space-y-4">
        {/* Subtitle & Protocol Badge */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Instant &amp; secure account-to-account rails
          </p>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eaedff] dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60 text-[#00236f] dark:text-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider">TLS 1.3 / ISO 20022</span>
          </div>
        </div>

        {/* Rails Segmented Control */}
        <div className="bg-[#eaedff] dark:bg-slate-900 p-1 rounded-2xl flex items-center gap-1 shadow-2xs border border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setRail('internal')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              rail === 'internal'
                ? 'bg-[#00236f] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
            <span>Internal</span>
          </button>

          <button
            type="button"
            onClick={() => setRail('fednow')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              rail === 'fednow'
                ? 'bg-[#00236f] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>FedNow / ACH</span>
          </button>

          <button
            type="button"
            onClick={() => setRail('wire')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              rail === 'wire'
                ? 'bg-[#00236f] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            <span>Wire</span>
          </button>
        </div>

        {/* Quick Beneficiaries Strip */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Recent Counterparties
            </span>
            <span className="text-xs font-semibold text-[#0051d5] dark:text-blue-400">
              Directory ({beneficiaries.length + 24})
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {/* Add New Counterparty button */}
            <button
              type="button"
              onClick={() => showToast('Opening Counterparty Registration modal...', 'info')}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 flex items-center justify-center transition-transform active:scale-95 group-hover:scale-105 shadow-2xs">
                <span className="material-symbols-outlined text-[20px]">add</span>
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Add New</span>
            </button>

            {/* Beneficiaries List */}
            {beneficiaries.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectBeneficiary(b)}
                className="flex flex-col items-center gap-1.5 shrink-0 group"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-xs transition-transform active:scale-95 group-hover:ring-2 group-hover:ring-blue-600">
                  {b.avatarUrl ? (
                    <img alt={b.name} src={b.avatarUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-bold">
                      {b.initials || 'CP'}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#0051d5] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[9px] text-white">check</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[64px]">
                  {b.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Transfer Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-4 space-y-3.5">
          {/* Originating Account */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Originating Account
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Cleared Fed Funds</span>
            </div>

            <div className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00236f] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Premier Checking</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#e2e7ff] dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      •••• 7319
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Available: <span className="font-bold text-slate-800 dark:text-slate-200">$9,600.00</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">unfold_more</span>
            </div>
          </div>

          {/* Swap Indicator Button */}
          <div className="relative flex items-center justify-center -my-2 z-10">
            <button
              type="button"
              onClick={handleSwapAccounts}
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 text-[#00236f] dark:text-blue-400 flex items-center justify-center active:scale-90 hover:scale-105 transition-all"
              title="Swap From / To"
            >
              <span className="material-symbols-outlined text-[18px]">swap_vert</span>
            </button>
          </div>

          {/* Beneficiary Target */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Beneficiary Target
              </label>
              <span className="text-xs font-semibold text-[#0051d5] dark:text-blue-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">verified_user</span> Verified Route
              </span>
            </div>

            <div className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#dae2fd] dark:bg-blue-950/80 text-[#0051d5] dark:text-blue-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">savings</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{toAccountName}</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#e2e7ff] dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {toAccountMask}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Yield: <span className="font-semibold text-slate-800 dark:text-slate-200">4.85% APY</span> • Internal Settlement
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
            </div>
          </div>

          {/* Amount Input Display */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Transfer Volume
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Daily Limit: $100,000</span>
            </div>

            <div className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-slate-400">$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-center text-3xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white tracking-tight outline-none w-44 border-none p-0 focus:text-blue-600"
                />
                <span className="text-xs font-bold text-slate-400">USD</span>
              </div>

              {/* Quick Preset Pills */}
              <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
                {['50.00', '100.00', '250.00', '500.00', '9600.00'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleQuickAmount(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                      amount === preset
                        ? 'bg-[#00236f] dark:bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {preset === '9600.00' ? 'Max' : `$${parseInt(preset)}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Instant FedNow Route Notice */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] dark:bg-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#316bf3] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[15px]">flash_on</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Instant FedNow Route
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time ledger credit • T+0</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eaedff] dark:bg-blue-950/70 text-[#00236f] dark:text-blue-300 text-xs font-bold">
              <span>{protocolFee === 0 ? 'No fee' : `$${protocolFee.toFixed(2)}`}</span>
              <span>• $0.00</span>
            </div>
          </div>

          {/* Settlement Memo */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Settlement Memo / Ledger Reference
            </label>
            <div className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl px-3 py-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">edit_note</span>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Add memo or invoice reference"
                className="bg-transparent flex-1 text-xs text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Execution Ledger Breakdown Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              Execution Ledger Breakdown
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#eaedff] dark:bg-slate-800 text-blue-900 dark:text-blue-300">
              Pre-Clearing
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Principal Amount</span>
              <span className="font-bold text-slate-900 dark:text-white">${parsedAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Network Protocol Fee</span>
              <span className="font-bold text-slate-900 dark:text-white">${protocolFee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Estimated Clearing Time</span>
              <span className="font-bold text-[#0051d5] dark:text-blue-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                Sub-second (&lt; 2.4s)
              </span>
            </div>

            <div className="pt-2 mt-2 bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Total Outflow
                </span>
                <span className="text-[11px] text-slate-400">Debited immediately</span>
              </div>
              <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                ${totalOutflow.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => setIsConfirmSheetOpen(true)}
          className="w-full h-12 rounded-2xl bg-[#0051d5] hover:bg-[#003ea8] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
          <span>Review &amp; Authorize Transfer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab('home')}
          className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium py-1 transition-colors"
        >
          Cancel &amp; Return to Dashboard
        </button>
      </div>

      {/* 2FA Confirmation Bottom Sheet Overlay */}
      {isConfirmSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end p-0">
          <div
            className="flex-1"
            onClick={() => setIsConfirmSheetOpen(false)}
          ></div>

          <div className="bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-5 border-t border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-200">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto"></div>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                    Confirm Fund Transfer
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    2FA Required
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dual-key cryptographic ledger validation
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Transfer Value Box */}
            <div className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Transfer Value
                </span>
                <span className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                  ${totalOutflow.toFixed(2)} USD
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  To: <strong className="text-slate-800 dark:text-slate-200">{toAccountName} ({toAccountMask})</strong>
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#eaedff] dark:bg-blue-950/80 text-[#0051d5] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[24px]">forward</span>
              </div>
            </div>

            {/* Authenticator Code Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Security Authenticator Code</span>
                <span className="text-[#0051d5] dark:text-blue-400">Resend SMS</span>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {['4', '9', '1', '8', '•', '•'].map((digit, i) => (
                  <div
                    key={i}
                    className={`h-11 rounded-xl flex items-center justify-center font-mono font-bold text-base ${
                      i < 4
                        ? 'bg-[#eaedff] dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                        : 'bg-[#dae2fd] dark:bg-slate-700/60 text-slate-400'
                    }`}
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-center text-slate-400">
                Code dispatched to authorized hardware token ending in ••84
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAuthorize}
                disabled={isAuthorizing}
                className="w-full h-12 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all disabled:opacity-75"
              >
                {isAuthorizing ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    <span>Settling Ledger...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                    <span>Authorize ${totalOutflow.toFixed(2)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsConfirmSheetOpen(false)}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel / Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
