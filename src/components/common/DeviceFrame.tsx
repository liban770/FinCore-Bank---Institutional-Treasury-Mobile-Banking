import React from 'react';
import { useBank } from '../../context/BankContext';
import { Wifi, Signal, BatteryCharging } from 'lucide-react';
import { MobileBottomNav } from '../mobile/MobileBottomNav';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { activeDevice, mobileScale } = useBank();

  // If desktop view is chosen, render children directly without phone mockup
  if (activeDevice === 'desktop') {
    return <div className="w-full min-h-[calc(100vh-53px)]">{children}</div>;
  }

  // Device specs
  const deviceSpecs = {
    iphone15: {
      width: 393,
      height: 852,
      radius: 'rounded-[50px]',
      bezel: 'p-3',
      name: 'iPhone 15 Pro',
    },
    pixel8: {
      width: 412,
      height: 915,
      radius: 'rounded-[44px]',
      bezel: 'p-3',
      name: 'Google Pixel 8',
    },
    s24: {
      width: 384,
      height: 832,
      radius: 'rounded-[36px]',
      bezel: 'p-3',
      name: 'Galaxy S24 Ultra',
    },
  }[activeDevice];

  const scaleStyle = mobileScale !== 100 ? { transform: `scale(${mobileScale / 100})`, transformOrigin: 'top center' } : {};

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start py-4 sm:py-8 px-2 overflow-x-hidden min-h-[calc(100vh-53px)] bg-slate-100 dark:bg-slate-950/80 transition-colors">
      <div
        style={scaleStyle}
        className="transition-transform duration-200"
      >
        {/* Device Outer Titanium Housing */}
        <div
          style={{ width: `${deviceSpecs.width + 24}px`, minHeight: `${deviceSpecs.height + 24}px` }}
          className={`relative ${deviceSpecs.radius} bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-black p-3 shadow-2xl ring-1 ring-white/20 select-none`}
        >
          {/* Hardware Buttons simulation */}
          {activeDevice === 'iphone15' && (
            <>
              {/* Action Button */}
              <div className="absolute -left-[5px] top-[108px] w-[5px] h-[26px] bg-slate-600 rounded-l-md"></div>
              {/* Volume Up */}
              <div className="absolute -left-[5px] top-[148px] w-[5px] h-[48px] bg-slate-600 rounded-l-md"></div>
              {/* Volume Down */}
              <div className="absolute -left-[5px] top-[206px] w-[5px] h-[48px] bg-slate-600 rounded-l-md"></div>
              {/* Power Button */}
              <div className="absolute -right-[5px] top-[170px] w-[5px] h-[72px] bg-slate-600 rounded-r-md"></div>
            </>
          )}

          {/* Device Screen Area */}
          <div
            style={{ width: `${deviceSpecs.width}px`, height: `${deviceSpecs.height}px` }}
            className={`relative w-full h-full bg-[#faf8ff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${
              activeDevice === 'iphone15' ? 'rounded-[42px]' : activeDevice === 'pixel8' ? 'rounded-[36px]' : 'rounded-[28px]'
            } overflow-hidden shadow-inner flex flex-col`}
          >
            {/* Top Status Bar & Notch / Dynamic Island */}
            <div className="absolute top-0 left-0 right-0 z-50 h-11 px-6 flex items-center justify-between pointer-events-none select-none text-[13px] font-semibold text-slate-800 dark:text-slate-200">
              {/* Time */}
              <span className="tracking-tight font-medium">9:41</span>

              {/* iPhone 15 Pro Dynamic Island */}
              {activeDevice === 'iphone15' && (
                <div className="w-[120px] h-[28px] bg-black rounded-full shadow-md flex items-center justify-between px-3 text-[10px] text-white pointer-events-auto cursor-pointer hover:scale-105 transition-transform">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-mono text-[9px] tracking-widest text-slate-400">FINCORE</span>
                  <div className="w-3 h-3 rounded-full bg-blue-900/60 border border-blue-400/40"></div>
                </div>
              )}

              {/* Pixel 8 & S24 Centered Punch Hole */}
              {(activeDevice === 'pixel8' || activeDevice === 's24') && (
                <div className="w-3.5 h-3.5 bg-black rounded-full shadow-inner border border-slate-800"></div>
              )}

              {/* Status Icons: 5G, Wi-Fi, Battery */}
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-mono">100%</span>
                  <BatteryCharging className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Scrollable Screen Content Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col relative w-full pt-10 pb-20">
              {children}
            </div>

            {/* Bottom Navigation */}
            <MobileBottomNav />

            {/* Bottom Safe Area Home Indicator Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-4 flex items-center justify-center pointer-events-none z-50">
              <div className="w-32 h-1 bg-slate-900/40 dark:bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
