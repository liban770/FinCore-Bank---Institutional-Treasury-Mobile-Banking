/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BankProvider, useBank } from './context/BankContext';
import { TopControlBar } from './components/common/TopControlBar';
import { DeviceFrame } from './components/common/DeviceFrame';

// Mobile Screens
import { MobileDashboard } from './components/mobile/MobileDashboard';
import { MobileTransfer } from './components/mobile/MobileTransfer';
import { MobileAccounts } from './components/mobile/MobileAccounts';
import { MobileCards } from './components/mobile/MobileCards';
import { MobileSecurityAlerts } from './components/mobile/MobileSecurityAlerts';
import { MobileActivityLedger } from './components/mobile/MobileActivityLedger';
import { MobileBiometricModal } from './components/mobile/MobileBiometricModal';

// Desktop Screens
import { DesktopSidebar } from './components/desktop/DesktopSidebar';
import { DesktopHeader } from './components/desktop/DesktopHeader';
import { DesktopDashboard } from './components/desktop/DesktopDashboard';
import { DesktopTransfer } from './components/desktop/DesktopTransfer';
import { DesktopTransactions } from './components/desktop/DesktopTransactions';
import { DesktopAdminPortal } from './components/desktop/DesktopAdminPortal';

import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastNotification: React.FC = () => {
  const { toast } = useBank();

  if (!toast) return null;

  const bgStyles = {
    info: 'bg-blue-600 text-white',
    success: 'bg-emerald-600 text-white',
    warn: 'bg-amber-600 text-white',
    error: 'bg-rose-600 text-white',
  }[toast.type || 'info'];

  const IconComponent = {
    info: Info,
    success: CheckCircle2,
    warn: AlertTriangle,
    error: AlertCircle,
  }[toast.type || 'info'];

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[100] max-w-sm flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md animate-in slide-in-from-bottom duration-200 transition-all font-sans text-xs select-none"
    >
      <div className={`p-1.5 rounded-xl shrink-0 ${bgStyles}`}>
        <IconComponent className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 font-medium text-slate-900 dark:text-white leading-tight">
        {toast.message}
      </div>
    </aside>
  );
};

const BankAppContent: React.FC = () => {
  const { activeDevice, activeMobileTab, activeDesktopTab } = useBank();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Universal Institutional Top Control Bar */}
      <TopControlBar />

      {/* Main Viewport: Mobile Phone Mockup OR Full Desktop Experience */}
      {activeDevice === 'desktop' ? (
        <main className="flex-1 flex w-full min-h-[calc(100vh-53px)] bg-[#f8fafc] dark:bg-slate-950 overflow-x-hidden">
          {/* Desktop Left Sidebar */}
          <DesktopSidebar />

          {/* Desktop Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <DesktopHeader />

            <div className="flex-1 overflow-y-auto">
              {activeDesktopTab === 'dashboard' && <DesktopDashboard />}
              {activeDesktopTab === 'accounts' && <DesktopDashboard />}
              {activeDesktopTab === 'transfer' && <DesktopTransfer />}
              {activeDesktopTab === 'transactions' && <DesktopTransactions />}
              {activeDesktopTab === 'admin' && <DesktopAdminPortal />}
            </div>
          </div>
        </main>
      ) : (
        /* Mobile Device Frame View */
        <main className="flex-1 flex flex-col items-center justify-start w-full">
          <DeviceFrame>
            {activeMobileTab === 'home' && <MobileDashboard />}
            {activeMobileTab === 'transfer' && <MobileTransfer />}
            {activeMobileTab === 'accounts' && <MobileAccounts />}
            {activeMobileTab === 'cards' && <MobileCards />}
            {activeMobileTab === 'alerts' && <MobileSecurityAlerts />}
            {activeMobileTab === 'activity' && <MobileActivityLedger />}
          </DeviceFrame>
        </main>
      )}

      {/* Biometric Dual-Auth Face ID Modal */}
      <MobileBiometricModal />

      {/* Real-time System Toast Feedback */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <BankProvider>
      <BankAppContent />
    </BankProvider>
  );
}
