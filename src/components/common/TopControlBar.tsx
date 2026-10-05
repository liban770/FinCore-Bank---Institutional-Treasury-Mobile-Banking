import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { FinCoreLogo } from './FinCoreLogo';
import { SocialMediaClipModal } from './SocialMediaClipModal';
import {
  Smartphone,
  Monitor,
  Moon,
  Sun,
  RefreshCw,
  Zap,
  ShieldAlert,
  SlidersHorizontal,
  Fingerprint,
  ChevronDown,
  Layers,
  Activity,
  ArrowRightLeft,
  CreditCard,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const TopControlBar: React.FC = () => {
  const {
    isDark,
    toggleDarkMode,
    activeDevice,
    setActiveDevice,
    mobileScale,
    setMobileScale,
    activeMobileTab,
    setActiveMobileTab,
    activeDesktopTab,
    setActiveDesktopTab,
    isSyncing,
    syncIntervalSec,
    setSyncIntervalSec,
    latencyMs,
    currentBlock,
    manualSync,
    simulateLiveEvent,
    openBiometricModal,
    alerts,
  } = useBank();

  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isSyncSettingsOpen, setIsSyncSettingsOpen] = useState(false);
  const [isClipModalOpen, setIsClipModalOpen] = useState(false);
  const unreadAlertsCount = alerts.filter((a) => a.unread).length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Brand & Live Sync Ticker */}
        <div className="flex items-center gap-3">
          <FinCoreLogo size="md" />

          {/* Real-time Sync Indicator Chip */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${syncIntervalSec > 0 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${syncIntervalSec > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {syncIntervalSec > 0 ? 'Live Sync Active' : 'Sync Paused'}
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
              {latencyMs}ms • #{currentBlock.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Center: Device Form Factor Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button
            onClick={() => setActiveDevice('iphone15')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeDevice === 'iphone15'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="iPhone 15 Pro (393 × 852)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">iPhone 15 Pro</span>
            <span className="sm:hidden">iPhone</span>
          </button>

          <button
            onClick={() => setActiveDevice('pixel8')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeDevice === 'pixel8'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Pixel 8 (412 × 915)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pixel 8</span>
            <span className="sm:hidden">Pixel</span>
          </button>

          <button
            onClick={() => setActiveDevice('s24')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeDevice === 's24'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Galaxy S24 (384 × 832)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Galaxy S24</span>
            <span className="sm:hidden">S24</span>
          </button>

          <button
            onClick={() => setActiveDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeDevice === 'desktop'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Full Desktop Institutional Portal"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Right Controls: Screen Navigation, Simulation, Dark Mode, Zoom */}
        <div className="flex items-center gap-2">
          {/* Quick Screen Jump for Mobile View */}
          {activeDevice !== 'desktop' && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveMobileTab('home')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  activeMobileTab === 'home'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Home Dashboard"
              >
                Home
              </button>
              <button
                onClick={() => setActiveMobileTab('transfer')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  activeMobileTab === 'transfer'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Transfer Money"
              >
                Transfer
              </button>
              <button
                onClick={() => setActiveMobileTab('accounts')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  activeMobileTab === 'accounts'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Accounts & Vaults"
              >
                Vaults
              </button>
              <button
                onClick={() => setActiveMobileTab('cards')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  activeMobileTab === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Cards Management"
              >
                Cards
              </button>
              <button
                onClick={() => setActiveMobileTab('activity')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  activeMobileTab === 'activity'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Activity & Ledger"
              >
                Activity
              </button>
              <button
                onClick={() => setActiveMobileTab('alerts')}
                className={`relative p-1.5 rounded text-xs transition-colors ${
                  activeMobileTab === 'alerts'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Security & Alerts"
              >
                Alerts
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Desktop Tab Selector if Desktop active */}
          {activeDevice === 'desktop' && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setActiveDesktopTab('dashboard')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeDesktopTab === 'dashboard'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Portal Dashboard
              </button>
              <button
                onClick={() => setActiveDesktopTab('transfer')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeDesktopTab === 'transfer'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Wire & Transfer
              </button>
              <button
                onClick={() => setActiveDesktopTab('transactions')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeDesktopTab === 'transactions'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Ledger & Audit
              </button>
              <button
                onClick={() => setActiveDesktopTab('admin')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeDesktopTab === 'admin'
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Admin Supervision
              </button>
            </div>
          )}

          {/* Live Data Sync Menu / Action */}
          <div className="relative">
            <button
              onClick={() => setIsSyncSettingsOpen(!isSyncSettingsOpen)}
              className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
              title="Real-Time Sync Engine Settings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span className="hidden lg:inline">Sync ({syncIntervalSec}s)</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isSyncSettingsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs">
                <div className="px-2 py-1.5 font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800">
                  Real-Time Sync Frequency
                </div>
                <div className="grid grid-cols-4 gap-1 p-1 my-1">
                  {[1, 3, 5, 0].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => {
                        setSyncIntervalSec(sec);
                        setIsSyncSettingsOpen(false);
                      }}
                      className={`py-1 rounded text-center font-medium ${
                        syncIntervalSec === sec
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {sec === 0 ? 'Off' : `${sec}s`}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    manualSync();
                    setIsSyncSettingsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 mt-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Force Re-Sync Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Real-time Event Simulator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSimulateOpen(!isSimulateOpen)}
              className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold transition-colors"
              title="Simulate Real-time Financial Events"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xl:inline">Simulate</span>
              <ChevronDown className="w-3 h-3 text-amber-500" />
            </button>

            {isSimulateOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs">
                <div className="px-2 py-1.5 font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Trigger Real-Time Event</span>
                  <span className="text-[10px] text-amber-600 font-mono">Sim v2.4</span>
                </div>
                <div className="flex flex-col gap-1 py-1">
                  <button
                    onClick={() => {
                      simulateLiveEvent('deposit');
                      setIsSimulateOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">+$500.00 Stripe Inflow</div>
                      <div className="text-[11px] text-slate-500">Instant FedNow settlement credit</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      openBiometricModal();
                      setIsSimulateOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <Fingerprint className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Face ID Dual-Auth Scan</div>
                      <div className="text-[11px] text-slate-500">$24,500 Apex Logistics wire release</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      simulateLiveEvent('anomaly');
                      setIsSimulateOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">AML Velocity Spike</div>
                      <div className="text-[11px] text-slate-500">Trigger high-frequency risk flag</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Scale Zoom Selector (for Mobile views) */}
          {activeDevice !== 'desktop' && (
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] text-slate-600 dark:text-slate-300">
              {[80, 90, 100].map((s) => (
                <button
                  key={s}
                  onClick={() => setMobileScale(s)}
                  className={`px-1.5 py-1 rounded transition-colors ${
                    mobileScale === s ? 'bg-white dark:bg-slate-700 font-bold text-blue-600 dark:text-blue-400' : ''
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          )}

          {/* Social Media Animated Demo Clip Launcher */}
          <button
            onClick={() => setIsClipModalOpen(true)}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-gradient-to-r from-pink-500/10 to-rose-500/10 dark:from-pink-950/40 dark:to-rose-950/40 text-pink-700 dark:text-pink-300 hover:from-pink-500/20 hover:to-rose-500/20 border border-pink-200 dark:border-pink-800 text-xs font-bold transition-all shadow-2xs"
            title="Play Animated Video Clip for Social Media"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
            <span className="hidden md:inline">Social Clip</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Social Media Animated Video Clip Modal */}
      <SocialMediaClipModal isOpen={isClipModalOpen} onClose={() => setIsClipModalOpen(false)} />
    </header>
  );
};
