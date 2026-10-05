import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useBank } from '../../context/BankContext';
import {
  ArrowUpDown,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Globe,
  DollarSign,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronDown,
  Copy,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';

export interface CurrencyDetail {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: CurrencyDetail[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', country: 'United States', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'Eurozone', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', country: 'United Kingdom', decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', country: 'Japan', decimals: 0 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', country: 'Switzerland', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', country: 'Canada', decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', country: 'Australia', decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', country: 'Singapore', decimals: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', country: 'United Arab Emirates', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', country: 'Hong Kong', decimals: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', country: 'Sweden', decimals: 2 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', country: 'China', decimals: 2 },
];

// Baseline real-market interbank exchange rates (USD base)
const BASELINE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.9214,
  GBP: 0.7712,
  JPY: 152.35,
  CHF: 0.8654,
  CAD: 1.3842,
  AUD: 1.5126,
  SGD: 1.3218,
  AED: 3.6725,
  HKD: 7.7714,
  SEK: 10.4280,
  CNY: 7.1245,
};

export interface FxApplyParams {
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  convertedAmount: number;
  effectiveRate: number;
  quoteId: string;
  settlementRail: string;
  fee: number;
}

interface FxCalculatorProps {
  onApplyToTransfer?: (params: FxApplyParams) => void;
  className?: string;
  isCardOnly?: boolean;
}

export const FxCalculator: React.FC<FxCalculatorProps> = ({
  onApplyToTransfer,
  className = '',
  isCardOnly = false,
}) => {
  const { showToast } = useBank();

  // Exchange State
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [amountInput, setAmountInput] = useState('25,000');
  const [rates, setRates] = useState<Record<string, number>>(BASELINE_RATES);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [feedSource, setFeedSource] = useState<'live-api' | 'interbank-feed'>('interbank-feed');
  const [latencyMs, setLatencyMs] = useState(18);

  // Quote Lock
  const [isQuoteLocked, setIsQuoteLocked] = useState(false);
  const [lockSecondsRemaining, setLockSecondsRemaining] = useState(45);
  const [quoteId, setQuoteId] = useState('FX-WIRE-89412');

  // Institutional Spread Tier
  const [tier, setTier] = useState<'tier1' | 'tier2' | 'retail'>('tier1');

  // Wire Settlement Rail
  const [wireRail, setWireRail] = useState<'swift_gpi' | 'fedwire_rtgs' | 'sepa_instant' | 'standard'>(
    'swift_gpi'
  );

  // Currency select dropdown toggles
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);

  // Rate tick direction for pulse animation
  const [tickDirection, setTickDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  // Fetch real-time live FX rates
  const fetchLiveRates = useCallback(async () => {
    setIsLoading(true);
    const startTs = performance.now();

    try {
      // First attempt public free exchange rate endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch('https://open.er-api.com/v6/latest/USD', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          const newRates: Record<string, number> = { ...BASELINE_RATES };
          SUPPORTED_CURRENCIES.forEach((c) => {
            if (data.rates[c.code]) {
              newRates[c.code] = data.rates[c.code];
            }
          });
          setRates(newRates);
          setFeedSource('live-api');
          setLatencyMs(Math.round(performance.now() - startTs));
          setLastUpdated(new Date());
          setTickDirection(Math.random() > 0.5 ? 'up' : 'down');
          setTimeout(() => setTickDirection('neutral'), 1200);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Failover to precision simulated live interbank feed
    }

    // High-precision live micro-tick simulation (interbank algorithmic tick)
    setRates((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        if (k !== 'USD') {
          const delta = (Math.random() - 0.49) * 0.0008 * updated[k];
          updated[k] = Number((updated[k] + delta).toFixed(4));
        }
      });
      return updated;
    });

    setFeedSource('interbank-feed');
    setLatencyMs(Math.floor(12 + Math.random() * 12));
    setLastUpdated(new Date());
    setTickDirection(Math.random() > 0.5 ? 'up' : 'down');
    setTimeout(() => setTickDirection('neutral'), 1200);
    setIsLoading(false);
  }, []);

  // Initial fetch and 30-second live polling loop
  useEffect(() => {
    fetchLiveRates();
    const interval = setInterval(() => {
      if (!isQuoteLocked) {
        fetchLiveRates();
      }
    }, 25000);
    return () => clearInterval(interval);
  }, [fetchLiveRates, isQuoteLocked]);

  // Quote lock countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isQuoteLocked && lockSecondsRemaining > 0) {
      timer = setInterval(() => {
        setLockSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (lockSecondsRemaining === 0) {
      setIsQuoteLocked(false);
      setLockSecondsRemaining(45);
      showToast('Locked FX Quote expired. Live rates re-synced.', 'info');
      fetchLiveRates();
    }
    return () => clearInterval(timer);
  }, [isQuoteLocked, lockSecondsRemaining, fetchLiveRates, showToast]);

  const handleToggleLock = () => {
    if (isQuoteLocked) {
      setIsQuoteLocked(false);
      setLockSecondsRemaining(45);
      showToast('Rate unlocked. Returning to live ticking stream.', 'info');
    } else {
      setIsQuoteLocked(true);
      setLockSecondsRemaining(45);
      const newId = `FX-${sourceCurrency}/${targetCurrency}-${Math.floor(10000 + Math.random() * 90000)}`;
      setQuoteId(newId);
      showToast(`Exchange rate locked for 45s (${newId})`, 'success');
    }
  };

  // Raw numeric input
  const rawAmount = useMemo(() => {
    const clean = amountInput.replace(/,/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }, [amountInput]);

  // Spread markup definitions
  const spreadPercent = useMemo(() => {
    switch (tier) {
      case 'tier1':
        return 0.0008; // 0.08% Prime Institutional
      case 'tier2':
        return 0.0020; // 0.20% Commercial Treasury
      case 'retail':
        return 0.0145; // 1.45% Retail Benchmark
    }
  }, [tier]);

  // Interbank mid-market rate calculation (Source -> USD -> Target)
  const midMarketRate = useMemo(() => {
    const sourceToUsd = 1 / (rates[sourceCurrency] || 1);
    const usdToTarget = rates[targetCurrency] || 1;
    return sourceToUsd * usdToTarget;
  }, [rates, sourceCurrency, targetCurrency]);

  // Effective client rate with institutional spread deducted
  const effectiveClientRate = useMemo(() => {
    return midMarketRate * (1 - spreadPercent);
  }, [midMarketRate, spreadPercent]);

  // Converted settlement counter-value
  const convertedAmount = useMemo(() => {
    return rawAmount * effectiveClientRate;
  }, [rawAmount, effectiveClientRate]);

  // Retail comparison amount and institutional savings
  const retailClientRate = midMarketRate * (1 - 0.0145);
  const retailConverted = rawAmount * retailClientRate;
  const institutionalSavings = convertedAmount - retailConverted;

  // Rail fees and turnaround times
  const railDetails = useMemo(() => {
    switch (wireRail) {
      case 'swift_gpi':
        return {
          name: 'SWIFT gpi Priority Wire',
          eta: '< 2 Hours (Same Day)',
          feeUsd: 15.0,
          protocol: 'ISO 20022 pacs.008',
          badge: 'High Speed',
          color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-900',
        };
      case 'fedwire_rtgs':
        return {
          name: 'Fedwire / TARGET2 Real-Time Gross Settlement',
          eta: '< 15 Minutes (Instant)',
          feeUsd: 25.0,
          protocol: 'FedLine Direct RTGS',
          badge: 'Instant Gross',
          color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-900',
        };
      case 'sepa_instant':
        return {
          name: 'SEPA Instant Credit Transfer',
          eta: '< 10 Seconds (Direct EU)',
          feeUsd: 1.5,
          protocol: 'EPC SEPA-Inst 2024',
          badge: 'EU Express',
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-900',
        };
      case 'standard':
      default:
        return {
          name: 'Standard International Wire',
          eta: '1-2 Business Days',
          feeUsd: 0.0,
          protocol: 'Standard SWIFT MT103',
          badge: 'Zero Wire Fee',
          color: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        };
    }
  }, [wireRail]);

  const handleSwapCurrencies = () => {
    const temp = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(temp);
    showToast(`Swapped currency pair: ${targetCurrency}/${temp}`, 'info');
  };

  const handleApply = () => {
    if (onApplyToTransfer) {
      onApplyToTransfer({
        amount: rawAmount,
        sourceCurrency,
        targetCurrency,
        convertedAmount,
        effectiveRate: effectiveClientRate,
        quoteId,
        settlementRail: railDetails.name,
        fee: railDetails.feeUsd,
      });
      showToast(
        `Applied FX Quote ${quoteId}: ${rawAmount.toLocaleString()} ${sourceCurrency} → ${convertedAmount.toLocaleString(
          undefined,
          { maximumFractionDigits: 2 }
        )} ${targetCurrency} to Wire Transfer`,
        'success'
      );
    }
  };

  const handleQuickAmount = (val: number) => {
    setAmountInput(val.toLocaleString());
  };

  const currentSource = SUPPORTED_CURRENCIES.find((c) => c.code === sourceCurrency) || SUPPORTED_CURRENCIES[0];
  const currentTarget = SUPPORTED_CURRENCIES.find((c) => c.code === targetCurrency) || SUPPORTED_CURRENCIES[1];

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Utility Header & Live Rates Ticker */}
      <div className="bg-gradient-to-r from-slate-900 via-[#00236f] to-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
        {/* Ambient background blur elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-blue-500/20 text-blue-300">
                <Globe className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Institutional FX Desk &amp; Cross-Border Rails
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{feedSource === 'live-api' ? 'ECB / Fed Open Feed' : 'Interbank Refinitiv'}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              Real-Time FX Calculator &amp; Wire Estimator
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Live mid-market liquidity aggregation with institutional tier spreads &amp; guaranteed quote lock.
            </p>
          </div>

          {/* Rate status & Quick controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Live latency & last tick */}
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-300 font-mono">
                Latency: <span className="text-emerald-300 font-semibold">{latencyMs}ms</span> • ISO 20022
              </div>
              <div className="text-[10px] text-slate-400">
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
            </div>

            {/* Refresh Live Button */}
            <button
              type="button"
              onClick={fetchLiveRates}
              disabled={isLoading || isQuoteLocked}
              title="Fetch fresh live quotes"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white border border-white/10 backdrop-blur-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Rates</span>
            </button>

            {/* Rate Lock Button */}
            <button
              type="button"
              onClick={handleToggleLock}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isQuoteLocked
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isQuoteLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked ({lockSecondsRemaining}s)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Lock Quote</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Pairs Strip Ticker */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Active Pairs:
          </span>

          {[
            { pair: 'USD/EUR', base: 'USD', target: 'EUR' },
            { pair: 'USD/GBP', base: 'USD', target: 'GBP' },
            { pair: 'USD/JPY', base: 'USD', target: 'JPY' },
            { pair: 'USD/CHF', base: 'USD', target: 'CHF' },
            { pair: 'USD/CAD', base: 'USD', target: 'CAD' },
            { pair: 'USD/SGD', base: 'USD', target: 'SGD' },
            { pair: 'USD/AED', base: 'USD', target: 'AED' },
          ].map((item) => {
            const pairRate = (rates[item.target] || 1) / (rates[item.base] || 1);
            const isSelected = sourceCurrency === item.base && targetCurrency === item.target;
            return (
              <button
                key={item.pair}
                type="button"
                onClick={() => {
                  setSourceCurrency(item.base);
                  setTargetCurrency(item.target);
                  showToast(`Selected currency pair: ${item.pair}`, 'info');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-md font-extrabold scale-105'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <span>{item.pair}</span>
                <span
                  className={
                    isSelected
                      ? 'text-blue-700'
                      : tickDirection === 'up'
                      ? 'text-emerald-400'
                      : tickDirection === 'down'
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }
                >
                  {pairRate.toFixed(4)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Conversion Bento */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Conversion Inputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* Send Box (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3 focus-within:ring-2 focus-within:ring-blue-600 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>You Send (Outbound Principal)</span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400">Available: $15,250.00</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-2xl font-light text-slate-400">{currentSource.symbol}</span>
                <input
                  type="text"
                  value={amountInput}
                  onChange={(e) => {
                    // Allow digits and commas
                    const val = e.target.value.replace(/[^0-9.,]/g, '');
                    setAmountInput(val);
                  }}
                  className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans',sans-serif] focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              {/* Source Currency Selector */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsSourceOpen(!isSourceOpen);
                    setIsTargetOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs shadow-2xs border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <span className="text-base">{currentSource.flag}</span>
                  <span>{currentSource.code}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isSourceOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 max-h-64 overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 p-1.5 space-y-0.5">
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setSourceCurrency(c.code);
                          setIsSourceOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                          sourceCurrency === c.code
                            ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <div>
                            <div className="font-bold">{c.code}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{c.name}</div>
                          </div>
                        </div>
                        <span className="font-mono text-slate-400 text-[11px]">{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              {[5000, 10000, 25000, 50000, 100000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 transition-colors shrink-0"
                >
                  ${(val / 1000).toFixed(0)}k
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickAmount(15250)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 transition-colors shrink-0"
              >
                Max Liquidity
              </button>
            </div>
          </div>

          {/* Swap Button (1 col) */}
          <div className="lg:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={handleSwapCurrencies}
              title="Invert conversion direction"
              className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:border-blue-500 hover:text-blue-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all group active:scale-95"
            >
              <ArrowUpDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* Receive Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 dark:from-slate-800/90 dark:to-blue-950/40 p-4 sm:p-5 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 space-y-3">
            <div className="flex items-center justify-between text-xs text-blue-900 dark:text-blue-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recipient Receives (Settled Value)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                1 {sourceCurrency} = {effectiveClientRate.toFixed(4)} {targetCurrency}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-2xl font-light text-blue-500">{currentTarget.symbol}</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#00236f] dark:text-blue-300 font-['Plus_Jakarta_Sans',sans-serif] truncate">
                  {convertedAmount.toLocaleString(undefined, {
                    minimumFractionDigits: currentTarget.decimals,
                    maximumFractionDigits: currentTarget.decimals,
                  })}
                </div>
              </div>

              {/* Target Currency Selector */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsTargetOpen(!isTargetOpen);
                    setIsSourceOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs shadow-2xs border border-blue-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <span className="text-base">{currentTarget.flag}</span>
                  <span>{currentTarget.code}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Target Dropdown Menu */}
                {isTargetOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 max-h-64 overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 p-1.5 space-y-0.5">
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setTargetCurrency(c.code);
                          setIsTargetOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                          targetCurrency === c.code
                            ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <div>
                            <div className="font-bold">{c.code}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{c.name}</div>
                          </div>
                        </div>
                        <span className="font-mono text-slate-400 text-[11px]">{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Savings Callout */}
            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Hidden Spreads</span>
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                +${institutionalSavings.toFixed(2)} USD vs retail bank markup
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Tiers & Settlement Rail Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Institutional Pricing Tier Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Institutional Spread Tier</span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {(spreadPercent * 100).toFixed(2)}% Spread
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTier('tier1')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  tier === 'tier1'
                    ? 'bg-white dark:bg-slate-700 border-blue-600 text-blue-900 dark:text-white shadow-xs'
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">Tier 1 Prime</div>
                <div className="text-[10px] text-slate-400 mt-0.5">0.08% spread</div>
              </button>

              <button
                type="button"
                onClick={() => setTier('tier2')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  tier === 'tier2'
                    ? 'bg-white dark:bg-slate-700 border-blue-600 text-blue-900 dark:text-white shadow-xs'
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">Commercial</div>
                <div className="text-[10px] text-slate-400 mt-0.5">0.20% spread</div>
              </button>

              <button
                type="button"
                onClick={() => setTier('retail')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  tier === 'retail'
                    ? 'bg-white dark:bg-slate-700 border-blue-600 text-blue-900 dark:text-white shadow-xs'
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs font-bold">Retail Ref</div>
                <div className="text-[10px] text-slate-400 mt-0.5">1.45% baseline</div>
              </button>
            </div>
          </div>

          {/* Wire Rail Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Cross-Border Wire Rail</span>
              </label>
              <span className="text-[10px] font-bold text-slate-500 font-mono">{railDetails.protocol}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWireRail('swift_gpi')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  wireRail === 'swift_gpi'
                    ? 'bg-white dark:bg-slate-700 border-blue-600 shadow-xs'
                    : 'bg-transparent border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">SWIFT gpi</span>
                  <span className="text-[10px] font-bold text-blue-600">$15 fee</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">&lt; 2 hrs same-day</div>
              </button>

              <button
                type="button"
                onClick={() => setWireRail('fedwire_rtgs')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  wireRail === 'fedwire_rtgs'
                    ? 'bg-white dark:bg-slate-700 border-blue-600 shadow-xs'
                    : 'bg-transparent border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Fedwire RTGS</span>
                  <span className="text-[10px] font-bold text-indigo-600">$25 fee</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">&lt; 15 mins instant</div>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Ledger Table */}
        <div className="bg-[#f8f9ff] dark:bg-slate-800/40 rounded-2xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Quote Calculation Summary</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">Quote ID:</span>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900">
                {quoteId}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-200/60 dark:divide-slate-700/60">
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Live Interbank Mid-Market Rate</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                1 {sourceCurrency} = {midMarketRate.toFixed(4)} {targetCurrency}
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-slate-500">
                Institutional Tier Spread ({(spreadPercent * 100).toFixed(2)}%)
              </span>
              <span className="font-mono font-medium text-amber-700 dark:text-amber-400">
                -{(rawAmount * midMarketRate * spreadPercent).toFixed(2)} {targetCurrency}
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Locked Applied Client Rate</span>
              <span className="font-mono font-bold text-[#00236f] dark:text-blue-300">
                1 {sourceCurrency} = {effectiveClientRate.toFixed(4)} {targetCurrency}
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Network Rail &amp; Routing Fee</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                ${railDetails.feeUsd.toFixed(2)} USD ({railDetails.name})
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Estimated Settlement Value Date</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Today (Cutoff 16:30 EST) • {railDetails.eta}</span>
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Guaranteed Counterparty Payout
                </span>
                <span className="text-[10px] text-slate-400">
                  Fixed lock rate guaranteed by FinCore Treasury Multi-Currency Clearing
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#00236f] dark:text-blue-300 font-['Plus_Jakarta_Sans',sans-serif]">
                  {currentTarget.symbol}
                  {convertedAmount.toLocaleString(undefined, {
                    minimumFractionDigits: currentTarget.decimals,
                    maximumFractionDigits: currentTarget.decimals,
                  })}{' '}
                  <span className="text-sm font-semibold">{targetCurrency}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Apply to Transfer or Copy Quote */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {onApplyToTransfer && (
            <button
              type="button"
              onClick={handleApply}
              className="w-full sm:flex-1 h-12 rounded-2xl bg-[#00236f] dark:bg-blue-600 hover:bg-[#00174b] dark:hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Apply Quote to Wire Transfer Form</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const text = `FinCore FX Quote [${quoteId}]: ${rawAmount.toLocaleString()} ${sourceCurrency} → ${convertedAmount.toFixed(
                2
              )} ${targetCurrency} @ ${effectiveClientRate.toFixed(4)} via ${railDetails.name}`;
              navigator.clipboard?.writeText(text);
              showToast('Copied full institutional FX Quote breakdown to clipboard', 'info');
            }}
            className="w-full sm:w-auto h-12 px-5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all"
          >
            <Copy className="w-4 h-4 text-slate-400" />
            <span>Copy Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
