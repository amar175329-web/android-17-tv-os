import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, X, Maximize } from 'lucide-react';

export const OrientationPrompt: React.FC = () => {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobile = window.innerWidth < 820;
      setIsPortraitMobile(isPortrait && isMobile);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortraitMobile || dismissed) return null;

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    // Attempt screen orientation lock if supported
    if ('orientation' in screen && 'lock' in screen.orientation) {
      (screen.orientation as unknown as { lock: (mode: string) => Promise<void> }).lock('landscape').catch(() => {});
    }
    setDismissed(true);
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-[#0d1428]/95 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in slide-in-from-top-6 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
          <RotateCw className="w-5 h-5 animate-spin [animation-duration:4s]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Landscape Recommended</h4>
          <p className="text-[11px] text-slate-300">Rotate phone or enter fullscreen for the best Smart TV feel.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleFullscreen}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30"
        >
          <Maximize className="w-3.5 h-3.5" />
          TV Mode
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
