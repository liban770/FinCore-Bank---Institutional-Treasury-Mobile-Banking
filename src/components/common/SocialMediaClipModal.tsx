import React, { useState, useEffect, useRef } from 'react';
import { useBank } from '../../context/BankContext';
import {
  Play,
  Pause,
  RotateCcw,
  Share2,
  Download,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Cpu,
  Layers,
  Lock,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { FinCoreLogo } from './FinCoreLogo';

interface SocialMediaClipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  duration: number; // in seconds
  highlightMetric: string;
  highlightLabel: string;
  visualTheme: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    title: 'FinCore Sovereign Treasury',
    subtitle: 'Next-Generation Institutional Multi-Currency Banking',
    tagline: 'FDIC Insured to $2.5M • FedLine Direct Integration',
    badge: 'Tier-4 Sovereign Core',
    badgeColor: 'bg-blue-600',
    duration: 5,
    highlightMetric: '$284.6M',
    highlightLabel: 'YTD Institutional Volume',
    visualTheme: 'from-slate-950 via-[#00174b] to-slate-900',
  },
  {
    id: 2,
    title: 'Real-Time Money Movement',
    subtitle: 'Sub-Second Settlement Across FedNow & Fedwire RTGS',
    tagline: 'Instant Liquidity with Guaranteed FX Rate Locking',
    badge: 'FedNow Real-Time',
    badgeColor: 'bg-emerald-600',
    duration: 5,
    highlightMetric: '< 18ms',
    highlightLabel: 'Global Node Latency',
    visualTheme: 'from-[#00174b] via-indigo-950 to-slate-950',
  },
  {
    id: 3,
    title: 'Automated Compliance Surveillance',
    subtitle: 'Continuous Real-Time AML & OFAC Sanctions Screening',
    tagline: '6 Pre-Defined Risk Rules Enforced at 1,840 tx/second',
    badge: 'AML Surveillance',
    badgeColor: 'bg-rose-600',
    duration: 5,
    highlightMetric: '1,840/s',
    highlightLabel: 'Rule Evaluation Velocity',
    visualTheme: 'from-slate-950 via-rose-950/60 to-slate-950',
  },
  {
    id: 4,
    title: 'Pixel-Perfect Cross-Device',
    subtitle: 'Hardware-Accurate Mobile Frames & Enterprise Desktop',
    tagline: 'iPhone 15 Pro • Google Pixel 8 • Samsung Galaxy S24',
    badge: 'Cross-Device Shells',
    badgeColor: 'bg-purple-600',
    duration: 5,
    highlightMetric: '3 Phones + Desktop',
    highlightLabel: 'Unified Institutional Design',
    visualTheme: 'from-indigo-950 via-slate-950 to-blue-950',
  },
  {
    id: 5,
    title: 'The Future of Digital Banking',
    subtitle: 'Built for High-Growth Enterprises and Global Liquidity',
    tagline: 'Live on Google Cloud • ISO 20022 Compliant Architecture',
    badge: 'ISO 20022 Standard',
    badgeColor: 'bg-amber-600',
    duration: 5,
    highlightMetric: '99.98%',
    highlightLabel: 'Ledger Finality SLA',
    visualTheme: 'from-slate-950 via-[#00236f] to-slate-950',
  },
];

export const SocialMediaClipModal: React.FC<SocialMediaClipModalProps> = ({ isOpen, onClose }) => {
  const { showToast, isDark } = useBank();

  // Video Player States
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100 within scene
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const scene = SCENES[currentSceneIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback Loop
  useEffect(() => {
    if (!isOpen) return;

    if (isPlaying) {
      const stepMs = 50;
      const totalSteps = (scene.duration * 1000) / (stepMs * playbackSpeed);

      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Next scene or loop
            setCurrentSceneIndex((idx) => (idx + 1) % SCENES.length);
            return 0;
          }
          return prev + (100 / totalSteps);
        });
      }, stepMs);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, currentSceneIndex, scene.duration, playbackSpeed]);

  if (!isOpen) return null;

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleCopyCaption = () => {
    const caption = `🚀 Experience FinCore Bank: Next-generation institutional treasury & sovereign multi-currency liquidity. Built with sub-second FedNow rails, real-time AML surveillance, and pixel-perfect mobile device frames. #FinTech #Banking #WebDev #FedNow #UXDesign #CryptoTreasury #Finance`;
    navigator.clipboard?.writeText(caption);
    setCopiedCaption(true);
    showToast('Social media promotional caption copied to clipboard!', 'success');
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Modal Navigation */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <Sparkles className="w-5 h-5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
            </span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Social Media Animated Clip Studio</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                  Viral Demo Mode
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Short clip animation ready for TikTok, Instagram Reels, YouTube Shorts, LinkedIn &amp; X
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Aspect Ratio Switcher */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs">
              {(['9:16', '16:9', '1:1'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    aspectRatio === ratio
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio === '9:16' ? 'Reels / Shorts (9:16)' : ratio === '16:9' ? 'Desktop / X (16:9)' : 'Post (1:1)'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Studio Body: Split View (Video Frame + Director Dashboard) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Left / Center: Animated Video Player Screen */}
          <div className="lg:col-span-7 p-6 flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Simulated Animated Video Frame */}
            <div
              className={`relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 transition-all duration-300 flex flex-col justify-between ${
                aspectRatio === '9:16'
                  ? 'w-[320px] h-[568px] sm:w-[360px] sm:h-[640px]'
                  : aspectRatio === '16:9'
                  ? 'w-full max-w-[540px] aspect-video'
                  : 'w-[360px] h-[360px] sm:w-[420px] sm:h-[420px]'
              } bg-gradient-to-br ${scene.visualTheme}`}
            >
              {/* Animated Floating Glow Orbs */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-rose-500/20 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

              {/* Top Scene Progress Bars (Instagram Stories / Reels style) */}
              <div className="p-3 sm:p-4 z-20 flex items-center gap-1.5 w-full">
                {SCENES.map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                    onClick={() => {
                      setCurrentSceneIndex(idx);
                      setProgress(0);
                    }}
                  >
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{
                        width:
                          idx < currentSceneIndex
                            ? '100%'
                            : idx === currentSceneIndex
                            ? `${progress}%`
                            : '0%',
                      }}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Video Content Overlay */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between z-10 text-white">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FinCoreLogo size="sm" />
                    <span className="text-xs font-extrabold tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                      FinCore
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${scene.badgeColor}`}>
                    {scene.badge}
                  </span>
                </div>

                {/* Animated Core Subject */}
                <div className="my-auto space-y-4 text-center py-4">
                  {/* Dynamic Graphic Icon Container */}
                  <div className="mx-auto w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                    {scene.id === 1 && <FinCoreLogo size="lg" />}
                    {scene.id === 2 && <Zap className="w-10 h-10 text-amber-300 animate-pulse" />}
                    {scene.id === 3 && <ShieldAlert className="w-10 h-10 text-rose-400 animate-pulse" />}
                    {scene.id === 4 && <Smartphone className="w-10 h-10 text-purple-300" />}
                    {scene.id === 5 && <TrendingUp className="w-10 h-10 text-emerald-300" />}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif] tracking-tight leading-tight">
                      {scene.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">
                      {scene.subtitle}
                    </p>
                  </div>

                  {/* Highlight Stat Pill */}
                  <div className="inline-block p-3 px-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                    <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                      {scene.highlightMetric}
                    </div>
                    <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider mt-0.5">
                      {scene.highlightLabel}
                    </div>
                  </div>
                </div>

                {/* Footer Tagline & Live Waveform */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                    <span>{scene.tagline}</span>
                    {/* Audio Waveform Animation */}
                    <div className="flex items-center gap-0.5">
                      {[12, 24, 16, 28, 20, 8, 22].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 bg-blue-400 rounded-full animate-pulse"
                          style={{
                            height: `${isPlaying ? h : 4}px`,
                            animationDelay: `${i * 0.15}s`,
                          }}
                        ></span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute bottom-2 right-3 text-[9px] text-white/40 font-mono pointer-events-none">
                fin-core.bank • #FedNow
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="mt-4 flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 px-4 rounded-2xl shadow-md">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-xs"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Replay from Scene 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-800"></div>

              {/* Scene Indicator */}
              <span className="text-xs font-mono font-bold text-slate-300">
                Scene {currentSceneIndex + 1} of {SCENES.length}
              </span>

              {/* Speed Switcher */}
              <button
                type="button"
                onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-mono text-xs font-bold"
              >
                {playbackSpeed}x
              </button>

              {/* Audio Toggle */}
              <button
                type="button"
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
              </button>
            </div>
          </div>

          {/* Right: Social Media Director Panel */}
          <div className="lg:col-span-5 p-6 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  Social Distribution Studio
                </span>
                <h4 className="text-lg font-bold text-white">
                  Publish &amp; Share System Demo
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Optimized for vertical feeds on TikTok, Instagram Reels, YouTube Shorts, LinkedIn, and X.
                </p>
              </div>

              {/* Scene Timeline Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Storyboard Scenes</label>
                <div className="space-y-2">
                  {SCENES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setCurrentSceneIndex(idx);
                        setProgress(0);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        currentSceneIndex === idx
                          ? 'bg-blue-600/15 border-blue-500 text-white font-bold'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          currentSceneIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {s.id}
                        </span>
                        <span>{s.title}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{s.duration}s</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Copy Viral Caption */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Ready-to-Post Social Caption</label>
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCaption ? 'Copied!' : 'Copy Caption'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono leading-relaxed max-h-24 overflow-y-auto">
                  🚀 Experience FinCore Bank: Next-generation institutional treasury &amp; sovereign multi-currency liquidity. Built with sub-second FedNow rails, real-time AML surveillance, and pixel-perfect mobile device frames. #FinTech #Banking #WebDev #FedNow #UXDesign #CryptoTreasury
                </div>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const url = window.location.href;
                  const text = encodeURIComponent(
                    `Check out the FinCore Bank institutional banking application featuring live FedNow settlement, AML compliance engine, and mobile frames: ${url}`
                  );
                  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                }}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to X (Twitter)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = window.location.href;
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                }}
                className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to LinkedIn</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCaption}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Download className="w-4 h-4" />
                <span>Export Clip Package &amp; Storyboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
