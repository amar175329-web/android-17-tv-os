import React, { useState, useEffect } from 'react';
import { CloudSun, Sparkles } from 'lucide-react';

interface ScreensaverProps {
  onWake: () => void;
}

const AMBIENT_WALLPAPERS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2560&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2560&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2560&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2560&auto=format&fit=crop',
];

export const Screensaver: React.FC<ScreensaverProps> = ({ onWake }) => {
  const [bgIndex, setBgIndex] = useState(0);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };

    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % AMBIENT_WALLPAPERS.length);
    }, 12000);

    const handleWake = () => onWake();

    window.addEventListener('keydown', handleWake);
    window.addEventListener('click', handleWake);
    window.addEventListener('mousemove', handleWake);

    return () => {
      clearInterval(clockInterval);
      clearInterval(bgInterval);
      window.removeEventListener('keydown', handleWake);
      window.removeEventListener('click', handleWake);
      window.removeEventListener('mousemove', handleWake);
    };
  }, [onWake]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-12 select-none overflow-hidden animate-in fade-in duration-1000">
      {/* Background with slow zoom Ken-Burns effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105"
        style={{ backgroundImage: `url(${AMBIENT_WALLPAPERS[bgIndex]})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      </div>

      {/* Top Tag */}
      <div className="relative z-10 flex items-center gap-2 text-white/80">
        <Sparkles className="w-5 h-5 text-amber-300" />
        <span className="text-xs uppercase tracking-widest font-semibold">Android 17 TV Ambient Mode</span>
      </div>

      {/* Bottom Clock & Ambient Info */}
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter drop-shadow-2xl">
            {timeStr}
          </h1>
          <p className="text-lg sm:text-2xl text-slate-200 font-medium drop-shadow-lg mt-2">
            {dateStr}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 shadow-2xl">
          <CloudSun className="w-8 h-8 text-amber-400" />
          <div className="text-right">
            <span className="text-2xl font-bold text-white">72°F</span>
            <p className="text-xs text-slate-300">Beverly Hills · Clear Sky</p>
          </div>
        </div>
      </div>

      {/* Wakeup hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-white/40 tracking-widest">
        PRESS ANY KEY OR TAP TO WAKE
      </div>
    </div>
  );
};
