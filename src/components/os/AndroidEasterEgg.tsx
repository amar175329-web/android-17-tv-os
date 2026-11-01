import React, { useState, useEffect } from 'react';
import { X, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { tvSounds } from '../../services/sound';

interface AndroidEasterEggProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidEasterEgg: React.FC<AndroidEasterEggProps> = ({ isOpen, onClose }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      tvSounds.playNotification();
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#050811]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center text-center max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Easter Egg Spinning Holographic Dial */}
        <div
          onClick={() => {
            setRotation((r) => r + 45);
            tvSounds.playNavigate();
            confetti({ particleCount: 30, spread: 60 });
          }}
          style={{ transform: `rotate(${rotation}deg)` }}
          className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 p-1.5 shadow-[0_0_80px_rgba(59,130,246,0.6)] cursor-pointer transition-transform duration-500 mb-8 active:scale-95"
        >
          <div className="w-full h-full rounded-full bg-[#050811] flex flex-col items-center justify-center border-4 border-dashed border-white/20 relative">
            <span className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-200 to-sky-400">
              17
            </span>
            <span className="text-[10px] tracking-[0.3em] font-extrabold text-blue-400 uppercase mt-1">
              ANDROID TV OS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3">
          <Sparkles className="w-4 h-4 text-amber-300" />
          Android 17 Concept Verified
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-2">
          Baklava Release Milestone
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
          Congratulations! You found the virtual Android 17 TV OS Easter Egg. Tap the dial to spin quantum clock cycles.
        </p>

        <button
          onClick={onClose}
          className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/40 transition"
        >
          Return to System
        </button>
      </div>
    </div>
  );
};
