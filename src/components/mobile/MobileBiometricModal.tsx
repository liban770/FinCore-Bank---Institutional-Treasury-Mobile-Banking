import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';

export const MobileBiometricModal: React.FC = () => {
  const {
    isBiometricModalOpen,
    closeBiometricModal,
    biometricSuccess,
    authorizeBiometricWire,
    setActiveMobileTab,
    showToast,
  } = useBank();

  const [isScanning, setIsScanning] = useState(false);

  if (!isBiometricModalOpen) return null;

  const handleScanFaceId = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      authorizeBiometricWire();
    }, 1200);
  };

  const handleDone = () => {
    closeBiometricModal();
    setActiveMobileTab('activity');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md transition-opacity duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-300">
        {/* Mobile Pull Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>

        {/* Modal Header */}
        <div className="p-5 pb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 relative shadow-2xs">
              <span className="material-symbols-outlined text-[26px]">
                {biometricSuccess ? 'verified_user' : 'face'}
              </span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10b981] border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                  Biometric Dual-Auth
                </h3>
                {biometricSuccess ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ecfdf5] dark:bg-emerald-950/80 text-[#065f46] dark:text-emerald-300 text-[11px] font-bold border border-[#10b981]/30">
                    <span className="material-symbols-outlined text-[13px] text-[#10b981]">check</span>
                    Authorized • Signed 2/2
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] dark:bg-amber-950 text-[#92400e] dark:text-amber-300 text-[11px] font-bold">
                    Signer 2/2
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {biometricSuccess
                  ? 'Cryptographic Dual-Signature Committed • FedLine Release Approved'
                  : 'Sovereign Tier-2 FedLine Outbound Authorization'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeBiometricModal}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Transaction Summary Card */}
        <div className="px-5 py-2">
          <div className="rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 p-4 space-y-3">
            {biometricSuccess && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#ecfdf5] dark:bg-emerald-950/70 border border-[#10b981]/30 text-xs">
                <span className="flex items-center gap-1.5 text-[#065f46] dark:text-emerald-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                  Status: Released to FedLine
                </span>
                <span className="text-[#065f46] dark:text-emerald-300 font-mono">15:42:08 UTC</span>
              </div>
            )}

            <div className="flex items-start justify-between border-b border-slate-200/70 dark:border-slate-700/60 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Beneficiary</span>
                <p className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
                  Apex Logistics LLC
                </p>
                <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px] text-blue-600">account_balance</span>
                  FedLine Direct • US TR #121000358
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Amount</span>
                <p className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-[#00236f] dark:text-blue-300">
                  $24,500.00
                </p>
                <span className="text-[11px] text-slate-400">USD • Fee $15.00</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
              <div>
                <span className="text-slate-500 block text-[11px]">Debit Account</span>
                <span className="font-bold text-slate-900 dark:text-white">Premier Checking (•••• 7319)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Authorized Officer</span>
                <span className="font-bold text-slate-900 dark:text-white">Elena Vance (Treasury)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Nonce: 0x7F4A...B91C</span>
              <span className="inline-flex items-center gap-1 text-[#065f46] dark:text-emerald-300 bg-[#ecfdf5] dark:bg-emerald-950/70 px-2 py-0.5 rounded font-sans font-bold">
                <span className="material-symbols-outlined text-[12px] text-[#10b981]">verified</span>
                ISO 20022 / TLS 1.3 Certified
              </span>
            </div>
          </div>
        </div>

        {/* Biometric Interactive Center */}
        {!biometricSuccess ? (
          <div className="px-5 py-4 flex flex-col items-center text-center">
            {/* Animated Face ID Scanner Reticle */}
            <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-blue-500/50 animate-pulse"></div>
              <div className="absolute -inset-1 rounded-2xl bg-blue-500/10 blur-xs"></div>

              <div className="relative w-20 h-20 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100/70 dark:from-slate-800 dark:to-blue-950/50 border border-blue-400/40 flex flex-col items-center justify-center gap-1 shadow-inner">
                <span className={`material-symbols-outlined text-[36px] text-blue-600 dark:text-blue-400 ${isScanning ? 'animate-bounce' : ''}`}>
                  fingerprint
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {isScanning ? 'Scanning...' : 'Passkey'}
                  </span>
                </div>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-600 rounded-tl"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-600 rounded-tr"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-600 rounded-bl"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-600 rounded-br"></div>
            </div>

            <h4 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              {isScanning ? 'Verifying Hardware Token...' : 'Ready to Scan Face ID'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
              Position your device at eye level or place enrolled biometric token to complete dual-signature validation.
            </p>
          </div>
        ) : (
          <div className="px-5 py-4 flex flex-col items-center text-center">
            {/* Success Checkmark Circle */}
            <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#10b981]/20 animate-ping"></div>
              <div className="absolute -inset-1 rounded-full bg-[#ecfdf5] dark:bg-emerald-950 border-2 border-[#10b981]/40"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-[#ecfdf5] to-[#10b981]/20 border border-[#10b981]/60 flex flex-col items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[42px] text-[#10b981]">
                  check_circle
                </span>
              </div>
            </div>

            <h4 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-white">
              Identity Verified &amp; Authorized
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
              Elena Vance (Signer 2/2) biometric signature validated via Apple Secure Enclave / WebAuthn FIDO2.
            </p>
          </div>
        )}

        {/* Buttons / Actions */}
        <div className="px-5 pt-1 pb-4 flex flex-col gap-2.5">
          {!biometricSuccess ? (
            <>
              <button
                type="button"
                onClick={handleScanFaceId}
                disabled={isScanning}
                className="w-full h-12 rounded-2xl bg-[#00236f] hover:bg-[#00174b] text-white font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isScanning ? 'sync' : 'face'}
                </span>
                <span>{isScanning ? 'Validating Token...' : 'Authenticate with Face ID'}</span>
                <span className="material-symbols-outlined text-[16px] text-white/70">lock</span>
              </button>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    showToast('YubiKey NFC tap recognized. Touch token sensor...', 'info');
                    handleScanFaceId();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-blue-600">usb</span>
                  <span>Use YubiKey</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('PIN entry authorized via backup channel', 'info');
                    handleScanFaceId();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-400">pin</span>
                  <span>Security PIN</span>
                </button>
              </div>

              <button
                type="button"
                onClick={closeBiometricModal}
                className="w-full py-2 text-center text-slate-500 hover:text-rose-600 text-xs font-semibold transition-colors"
              >
                Reject or Hold Outbound Wire
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDone}
                className="w-full h-12 rounded-2xl bg-[#00236f] hover:bg-[#00174b] text-white font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">done_all</span>
                <span>Done / Return to Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('Downloading Signed FedLine MT103 Receipt (PDF)...', 'info')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#eaedff] dark:bg-slate-800 text-[#00236f] dark:text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0051d5]">download</span>
                <span>Download Signed FedLine Receipt (PDF)</span>
              </button>
            </>
          )}
        </div>

        {/* Footer Hardware Audit Line */}
        <div className="px-5 py-3 bg-[#f2f3ff] dark:bg-slate-800/80 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <span className="material-symbols-outlined text-[14px] text-blue-600">shield</span>
          <span>
            {biometricSuccess
              ? '✓ FedLine Confirmation #FED-2024-89104-AZ • Immutable Audit Trail'
              : 'Hardware Enclave • FIPS 140-3 Level 3 • Session 15:42 UTC'}
          </span>
        </div>
      </div>
    </div>
  );
};
