import React, { useEffect, useState } from 'react';
import { tvSounds } from '../../services/sound';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'particles' | 'merge' | 'logo' | 'ready'>('particles');

  useEffect(() => {
    // Play power chime
    tvSounds.playPower();

    const t1 = setTimeout(() => setPhase('merge'), 1200);
    const t2 = setTimeout(() => setPhase('logo'), 2400);
    const t3 = setTimeout(() => {
      setPhase('ready');
      onComplete();
    }, 3800);

    const handleSkip = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        onComplete();
      }
    };

    window.addEventListener('keydown', handleSkip);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleSkip);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050811] flex flex-col items-center justify-center select-none overflow-hidden animate-in fade-in duration-300">
      {/* Background radial glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Phase 1: 4 Google-colored animated pulsing orbs */}
      {phase === 'particles' && (
        <div className="flex items-center gap-6 animate-pulse">
          <div className="w-5 h-5 rounded-full bg-[#4285F4] shadow-[0_0_20px_#4285F4] animate-bounce [animation-delay:0ms]" />
          <div className="w-5 h-5 rounded-full bg-[#EA4335] shadow-[0_0_20px_#EA4335] animate-bounce [animation-delay:150ms]" />
          <div className="w-5 h-5 rounded-full bg-[#FBBC05] shadow-[0_0_20px_#FBBC05] animate-bounce [animation-delay:300ms]" />
          <div className="w-5 h-5 rounded-full bg-[#34A853] shadow-[0_0_20px_#34A853] animate-bounce [animation-delay:450ms]" />
        </div>
      )}

      {/* Phase 2: Morphing Sphere */}
      {phase === 'merge' && (
        <div className="relative flex items-center justify-center scale-125 transition-transform duration-700">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 shadow-[0_0_60px_rgba(59,130,246,0.8)] animate-spin [animation-duration:2s]" />
          <div className="absolute w-12 h-12 rounded-full bg-[#050811] flex items-center justify-center">
            <span className="text-white font-black text-xl tracking-tighter">17</span>
          </div>
        </div>
      )}

      {/* Phase 3: Android TV 17 Official Emblem */}
      {(phase === 'logo' || phase === 'ready') && (
        <div className="flex flex-col items-center animate-in zoom-in-75 duration-700">
          <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
            <img src="/tv-logo.svg" alt="Android 17 TV" className="w-full h-full drop-shadow-[0_0_35px_rgba(59,130,246,0.6)]" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-200">
            Android TV
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 tracking-widest">
              VERSION 17.0
            </span>
            <span className="text-xs text-slate-400 tracking-wider font-medium">SMART OS</span>
          </div>
        </div>
      )}

      {/* Footer Branding & Skip */}
      <div className="absolute bottom-10 flex flex-col items-center gap-3">
        <span className="text-xs tracking-[0.25em] text-slate-500 font-semibold uppercase">
          Powered by Android
        </span>
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-white px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition backdrop-blur-md"
        >
          Skip (Press Enter / Space)
        </button>
      </div>
    </div>
  );
};
