import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { Beneficiary } from '../../types/bank';
import { FxCalculator, FxApplyParams } from './FxCalculator';

export const DesktopTransfer: React.FC = () => {
  const {
    beneficiaries,
    selectedBeneficiary,
    setSelectedBeneficiary,
    executeTransfer,
    showToast,
  } = useBank();

  const [transferType, setTransferType] = useState<'internal' | 'ach' | 'wire' | 'fx'>('internal');
  const [amountStr, setAmountStr] = useState('500.00');
  const [memo, setMemo] = useState('Quarterly reserve transfer & personal liquidity');
  const [velocity, setVelocity] = useState<'instant' | 'ach'>('instant');
  const [frequency, setFrequency] = useState<'once' | 'recurring'>('once');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [fxQuote, setFxQuote] = useState<FxApplyParams | null>(null);

  // Beneficiary Target
  const [targetName, setTargetName] = useState('Primary Operational Checking');
  const [targetSub, setTargetSub] = useState('•••• 7319 • Domestic Ledger');

  const baseAmount = parseFloat(amountStr.replace(/,/g, '')) || 0;
  const railFee = fxQuote ? fxQuote.fee : velocity === 'instant' ? 2.00 : 0.00;
  const netTotal = baseAmount + railFee;

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setSelectedBeneficiary(b);
    setTargetName(b.name);
    setTargetSub(`${b.accountMask} • ${b.bankName}`);
    showToast(`Beneficiary selected: ${b.name}`, 'info');
  };

  const handleSwap = () => {
    setTargetName('High-Yield Treasury Savings');
    setTargetSub('•••• 4821 • APY 4.85%');
    showToast('Accounts swapped in transfer rail', 'info');
  };

  const handleApplyFxQuote = (params: FxApplyParams) => {
    setFxQuote(params);
    setTransferType('fx');
    setAmountStr(params.amount.toLocaleString());
    setMemo(
      `Cross-Border Wire [${params.quoteId}]: ${params.sourceCurrency} → ${params.targetCurrency} (${params.convertedAmount.toFixed(2)} ${params.targetCurrency} @ ${params.effectiveRate.toFixed(4)}) via ${params.settlementRail}`
    );
    showToast(
      `Applied FX Quote ${params.quoteId}: $${params.amount.toLocaleString()} ${params.sourceCurrency} → ${params.convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${params.targetCurrency}`,
      'success'
    );
  };

  const handleClearFxQuote = () => {
    setFxQuote(null);
    setTransferType('wire');
    setMemo('Quarterly reserve transfer & personal liquidity');
    showToast('Reverted to domestic transfer configuration', 'info');
  };

  const handleAuthorizeTransfer = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      executeTransfer({
        fromAccountId: 'acc-savings',
        toAccountName: targetName,
        toAccountMask: targetSub,
        amount: baseAmount,
        fee: railFee,
        memo,
        rail: fxQuote
          ? `${fxQuote.settlementRail} (${fxQuote.quoteId})`
          : transferType === 'wire' || transferType === 'fx'
          ? 'Fedwire Direct'
          : 'FedNow',
      });
      setIsAuthorizing(false);
      setIsModalOpen(false);
    }, 1200);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8 select-none">
      {/* Breadcrumb & Page Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Dashboard</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Money Movement</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-900 dark:text-white font-bold">Transfer Money</span>
          </nav>
          <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white mt-1 tracking-tight">
            Initiate Wire &amp; Account Transfer
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaedff] dark:bg-blue-950/70 text-[#00236f] dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-900/60">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Settlement Rail: FedNow Active</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('fx-calculator-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              showToast('Navigated to FX Calculator & Wire Estimator', 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-bold transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
            <span>FX Calculator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Opening Settlement & Transfer History Log...', 'info')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Transfer Log</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Bento / 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Configuration */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-8">
            {/* Transfer Modality Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Transfer Rail / Modality
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-[#f2f3ff] dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setTransferType('internal')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    transferType === 'internal'
                      ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                  <span>Internal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransferType('ach')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    transferType === 'ach'
                      ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                  <span>ACH Rail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransferType('wire')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    transferType === 'wire'
                      ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span className="relative">
                    Instant Wire
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#ffddb8] text-[#5c3800] rounded-full ml-1 font-bold">
                      FedNow
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTransferType('fx');
                    const el = document.getElementById('fx-calculator-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    transferType === 'fx'
                      ? 'bg-white dark:bg-slate-700 text-[#00236f] dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">public</span>
                  <span className="relative">
                    Cross-Border FX
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full ml-1 font-bold">
                      Live
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Account Selection Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* From Account */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    From Account
                  </label>
                  <span className="text-[11px] text-[#0051d5] font-semibold">Daily Limit: $100,000</span>
                </div>

                <div className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-2xl p-4 cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200/60 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#dae2fd] dark:bg-blue-950 text-[#00236f] dark:text-blue-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          High-Yield Treasury Savings
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">•••• 4821 • APY 4.85%</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">$15,250.00</div>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Action */}
              <div className="hidden md:flex absolute left-1/2 top-9 -translate-x-1/2 z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                </button>
              </div>

              {/* To Account */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    To Account / Beneficiary
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Opening New Recipient Setup Form...', 'info')}
                    className="text-[#0051d5] dark:text-blue-400 text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">person_add</span>
                    <span>New Recipient</span>
                  </button>
                </div>

                <div className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-2xl p-4 cursor-pointer hover:bg-slate-100 transition-colors border border-slate-200/60 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#dae2fd] dark:bg-blue-950 text-[#0051d5] dark:text-blue-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">credit_card</span>
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {targetName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{targetSub}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">$9,600.00</div>
                      <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Amount Interactive Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="text-slate-800 dark:text-slate-200">Transfer Amount</label>
                <span className="text-slate-400">Fee schedule: Tier 1 Zero-Cost</span>
              </div>

              <div className="rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/80 p-6 flex flex-col items-center justify-center border border-slate-200/60 dark:border-slate-700">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-light text-slate-400">$</span>
                  <input
                    type="text"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-64 bg-transparent text-4xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white text-center focus:outline-none"
                  />
                </div>
                <span className="text-xs text-slate-500 mt-1">
                  Available balance after transfer: <strong className="text-slate-900 dark:text-white">$14,748.00</strong>
                </span>

                {/* Preset Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                  {['100.00', '250.00', '500.00', '1,000.00', '15,250.00'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmountStr(preset)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs ${
                        amountStr === preset
                          ? 'bg-[#0051d5] text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      {preset === '15,250.00' ? 'Max' : `$${preset.split('.')[0]}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Frequency & Speed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Frequency */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Execution Frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFrequency('once')}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      frequency === 'once'
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-900 dark:text-blue-200'
                        : 'bg-[#f2f3ff] dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">event</span>
                    <span>One-time (Now)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFrequency('recurring')}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      frequency === 'recurring'
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-900 dark:text-blue-200'
                        : 'bg-[#f2f3ff] dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">autorenew</span>
                    <span>Recurring</span>
                  </button>
                </div>
              </div>

              {/* Velocity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Settlement Velocity</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVelocity('instant')}
                    className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                      velocity === 'instant'
                        ? 'bg-[#eaedff] dark:bg-blue-950/80 border-blue-600'
                        : 'bg-[#f2f3ff] dark:bg-slate-800 border-transparent'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#00236f] dark:text-blue-300">Instant (FedNow)</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Real-time • $2.00 fee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVelocity('ach')}
                    className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                      velocity === 'ach'
                        ? 'bg-[#eaedff] dark:bg-blue-950/80 border-blue-600'
                        : 'bg-[#f2f3ff] dark:bg-slate-800 border-transparent'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Standard ACH</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">1-2 days • Free</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Memo */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Transfer Memo / Reference
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full h-11 px-4 pr-10 rounded-2xl bg-[#f2f3ff] dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  edit_note
                </span>
              </div>
            </div>
          </div>

          {/* Institutional FX Calculator Utility Component */}
          <div id="fx-calculator-section" className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">currency_exchange</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Institutional FX Wire &amp; Live Rate Calculator
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Real-time interbank conversion &amp; quote lock</span>
            </div>
            <FxCalculator onApplyToTransfer={handleApplyFxQuote} />
          </div>
        </div>

        {/* Right Column: Sticky Summary Card */}
        <div id="transfer-summary-card" className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                Transfer Summary
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#dbe1ff] dark:bg-blue-950 text-[#003ea8] dark:text-blue-300">
                {fxQuote ? 'FX Locked' : 'Live Preview'}
              </span>
            </div>

            {/* Primary Breakdown */}
            <div className="p-4 rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/80 space-y-3">
              {fxQuote && (
                <div className="p-3 rounded-xl bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">lock_clock</span>
                      <span>Quote {fxQuote.quoteId}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleClearFxQuote}
                      className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      Clear FX
                    </button>
                  </div>
                  <div className="text-[11px] text-blue-700 dark:text-blue-300 font-mono">
                    1 {fxQuote.sourceCurrency} = {fxQuote.effectiveRate.toFixed(4)} {fxQuote.targetCurrency}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Routing: {fxQuote.settlementRail}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Base Transfer Amount</span>
                <span className="font-bold text-slate-900 dark:text-white">${baseAmount.toFixed(2)} USD</span>
              </div>

              {fxQuote && (
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Target Foreign Payout</span>
                  <span className="font-bold text-[#00236f] dark:text-blue-300 font-mono">
                    {fxQuote.convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                    {fxQuote.targetCurrency}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{fxQuote ? 'Wire Processing Fee' : 'FedNow Rail Processing'}</span>
                <span className="font-bold text-slate-900 dark:text-white">${railFee.toFixed(2)} USD</span>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Total Debited</span>
                <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-[#00236f] dark:text-blue-300">
                  ${netTotal.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-3 p-4 bg-[#f2f3ff] dark:bg-slate-800/80 rounded-2xl text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0051d5]"></div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Source</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Treasury Savings (•••• 4821)</span>
                </div>
              </div>

              <div className="ml-1 pl-3.5 border-l border-dashed border-slate-300 dark:border-slate-700 py-1">
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Estimated Arrival: &lt; 30 seconds
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Destination</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{targetName}</span>
                </div>
              </div>
            </div>

            {/* Compliance Note */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed border border-slate-200/50 dark:border-slate-700/50">
              <span className="material-symbols-outlined text-[#0051d5] text-[18px] shrink-0">verified_user</span>
              <span>Protected by FinCore Institutional Multi-Signature and Automated Sanctions Screening. Transfers submitted before 5:00 PM EST settle in real-time.</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full h-12 rounded-xl bg-[#00236f] dark:bg-blue-600 hover:bg-[#00174b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Review &amp; Authorize Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Transfer draft saved in queue', 'info')}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white text-center"
              >
                Save Draft &amp; Exit
              </button>
            </div>
          </div>

          {/* Security Guardrail Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-600 text-[24px]">shield_lock</span>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Dual-Factor Verification Ready</div>
                <div className="text-[11px] text-slate-400">Hardware &amp; SMS Push bound to Elena Vance</div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>

      {/* Recent Beneficiaries Strip */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              Recent Beneficiaries
            </h3>
            <p className="text-xs text-slate-500">Select a counterparty to prefill external transfer protocols</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {beneficiaries.map((b) => (
            <div
              key={b.id}
              onClick={() => handleSelectBeneficiary(b)}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                {b.avatarUrl ? (
                  <img src={b.avatarUrl} alt={b.name} className="w-12 h-12 rounded-full object-cover shadow-2xs" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                    {b.initials || 'CP'}
                  </div>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {b.badge}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {b.name}
                </div>
                <div className="text-xs text-slate-400">{b.bankName} • {b.accountMask}</div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100 dark:border-slate-800">
                <span>{b.lastSent}</span>
                <span className="material-symbols-outlined text-[16px] text-blue-600 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}

          {/* Add Beneficiary Card */}
          <div
            onClick={() => showToast('Opening Counterparty Setup wizard...', 'info')}
            className="bg-[#f2f3ff] dark:bg-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-100 cursor-pointer transition-colors border border-dashed border-slate-300 dark:border-slate-700 group"
          >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">add</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-3">Add Beneficiary</div>
            <div className="text-[11px] text-slate-500">Setup FedNow or SWIFT routing</div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">shield_with_heart</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                    Confirm Fund Transfer
                  </h3>
                  <p className="text-xs text-slate-500">Verify dual-signature authorization parameters</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Notice */}
            <div className="p-3.5 rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Please review carefully. Once authorized,{' '}
              <strong className="text-slate-900 dark:text-white">${netTotal.toFixed(2)} USD</strong> will
              immediately debit from <strong>Treasury Savings (•••• 4821)</strong> and route via{' '}
              <strong>{fxQuote ? fxQuote.settlementRail : 'FedNow Real-Time Settlement'}</strong>.
            </div>

            {/* Table */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Beneficiary</span>
                <span className="font-bold text-slate-900 dark:text-white">{targetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Principal Amount</span>
                <span className="font-bold text-slate-900 dark:text-white">${baseAmount.toFixed(2)} USD</span>
              </div>
              {fxQuote && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Locked Exchange Rate</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      1 {fxQuote.sourceCurrency} = {fxQuote.effectiveRate.toFixed(4)} {fxQuote.targetCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Beneficiary Foreign Counter-Value</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {fxQuote.convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                      {fxQuote.targetCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quote Reference ID</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">{fxQuote.quoteId}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {fxQuote ? 'SWIFT Wire Clearing Fee' : 'Platform & FedNow Clearing Fee'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">${railFee.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Execution Speed</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {fxQuote ? 'Immediate Processing (ISO 20022)' : 'Immediate (Sub-second)'}
                </span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-bold text-slate-900 dark:text-white">Net Outflow Debited</span>
                <span className="text-xl font-extrabold text-[#00236f] dark:text-blue-300">
                  ${netTotal.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* 2FA 6-digit Code */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">security</span>
                  <span>Security Authenticator Code (2FA)</span>
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Dispatched new 2FA token via SMS', 'info')}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Resend SMS
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {['4', '9', '1', '8', '•', '•'].map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-11 h-12 rounded-xl flex items-center justify-center font-mono text-lg font-bold ${
                      idx < 4
                        ? 'bg-[#eaedff] dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
              <p className="text-center text-[11px] text-slate-400">
                Code dispatched to authorized hardware token ending in ••84
              </p>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                Cancel / Edit
              </button>
              <button
                type="button"
                onClick={handleAuthorizeTransfer}
                disabled={isAuthorizing}
                className="w-full py-3 rounded-xl bg-[#00236f] dark:bg-blue-600 hover:bg-[#00174b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isAuthorizing ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Settling Ledger...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Authorize ${netTotal.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
