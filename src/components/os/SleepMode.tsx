import React, { useEffect } from 'react';
import { Power } from 'lucide-react';
import { tvSounds } from '../../services/sound';

interface SleepModeProps {
  onWake: () => void;
}

export const SleepMode: React.FC<SleepModeProps> = ({ onWake }) => {
  useEffect(() => {
    const handleWake = (e: KeyboardEvent) => {
      tvSounds.playPower();
      onWake();
    };

    window.addEventListener('keydown', handleWake);
    return () => window.removeEventListener('keydown', handleWake);
  }, [onWake]);

  return (
    <div
      onClick={() => {
        tvSounds.playPower();
        onWake();
      }}
      className="fixed inset-0 z-50 bg-[#020409] flex flex-col items-center justify-center cursor-pointer select-none"
    >
      <div className="flex flex-col items-center gap-4 text-center p-6 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-rose-600/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
          <Power className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-300 tracking-wide">TV Standby Mode</h2>
        <p className="text-xs text-slate-500 max-w-xs">
          Virtual Android 17 TV is sleeping. Press <span className="text-rose-400 font-semibold">Power</span>, click anywhere, or press any key to wake.
        </p>
      </div>

      {/* Tiny corner standby red LED */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-[0_0_10px_#e11d48] animate-pulse" />
        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">STANDBY</span>
      </div>
    </div>
  );
};
