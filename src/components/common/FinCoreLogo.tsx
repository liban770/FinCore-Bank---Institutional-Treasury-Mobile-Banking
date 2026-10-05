import React from 'react';

interface FinCoreLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBankBadge?: boolean;
}

export const FinCoreLogo: React.FC<FinCoreLogoProps> = ({
  className = '',
  size = 'md',
  showBankBadge = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon: Blue Shield with Target/Sun Crosshair */}
      <div className={`relative ${iconSizes[size]} rounded-lg bg-[#1e3a8a] dark:bg-blue-900/90 shadow-sm flex items-center justify-center shrink-0 overflow-hidden`}>
        {/* Inner subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90"></div>
        {/* Shield shape */}
        <svg viewBox="0 0 32 32" className="w-5 h-5 relative z-10" fill="none">
          {/* Shield outline */}
          <path
            d="M16 3L26 7.5V15.5C26 21.8 21.7 27.6 16 29C10.3 27.6 6 21.8 6 15.5V7.5L16 3Z"
            fill="#2563eb"
            stroke="#60a5fa"
            strokeWidth="1.2"
          />
          {/* Center Sun/Core */}
          <circle cx="16" cy="16" r="4.2" fill="#f59e0b" />
          {/* Crosshair ticks */}
          <line x1="16" y1="8" x2="16" y2="12.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="19.5" x2="16" y2="24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="16" x2="12.5" y2="16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="19.5" y1="16" x2="24" y2="16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex items-center gap-1.5 leading-none">
        <span className={`font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-[#00236f] dark:text-blue-100 ${textSizes[size]}`}>
          Fin<span className="text-[#0051d5] dark:text-blue-400">Core</span>
        </span>

        {showBankBadge && (
          <span className="px-1.5 py-0.5 rounded font-sans text-[10px] font-bold tracking-widest uppercase bg-[#ffddb8] dark:bg-amber-950/80 text-[#5c3800] dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/50 shadow-2xs">
            BANK
          </span>
        )}
      </div>
    </div>
  );
};
