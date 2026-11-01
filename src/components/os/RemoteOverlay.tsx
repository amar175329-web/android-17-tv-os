import React from 'react';
import { 
  Power, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  RotateCcw, Home, Menu, Volume2, VolumeX, Play, 
  Pause, X, Sparkles, Tv 
} from 'lucide-react';
import { tvSounds } from '../../services/sound';

interface RemoteOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  onSelect: () => void;
  onBack: () => void;
  onHome: () => void;
  onMenu: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onMute: () => void;
  onPower: () => void;
  onLaunchApp: (appId: string) => void;
}

export const RemoteOverlay: React.FC<RemoteOverlayProps> = ({
  isOpen,
  onClose,
  onUp,
  onDown,
  onLeft,
  onRight,
  onSelect,
  onBack,
  onHome,
  onMenu,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onPower,
  onLaunchApp,
}) => {
  if (!isOpen) return null;

  return (
    <aside 
      aria-label="Virtual TV Remote Control"
      className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-8 duration-200 select-none"
    >
      <div className="w-64 sm:w-72 bg-[#090d19]/95 backdrop-blur-2xl border-2 border-blue-500/30 rounded-[40px] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.2)] flex flex-col items-center">
        {/* Remote Top: Power & Close */}
        <div className="w-full flex items-center justify-between mb-4 px-1">
          <button
            onClick={() => {
              tvSounds.playPower();
              onPower();
            }}
            className="w-10 h-10 rounded-full bg-rose-600/20 hover:bg-rose-600/40 text-rose-500 hover:text-white border border-rose-500/40 transition flex items-center justify-center shadow-md shadow-rose-600/20 active:scale-95"
            title="TV Power / Standby"
          >
            <Power className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            ANDROID 17
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition flex items-center justify-center border border-white/10"
            title="Minimize Remote"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* D-Pad Circular Controller */}
        <div className="relative w-44 h-44 rounded-full bg-gradient-to-b from-[#141d33] to-[#0c1221] border-2 border-slate-700/60 shadow-xl flex items-center justify-center mb-5">
          {/* Up Button */}
          <button
            onClick={() => {
              tvSounds.playNavigate();
              onUp();
            }}
            className="absolute top-2 w-14 h-11 rounded-t-full hover:bg-blue-600/30 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Down Button */}
          <button
            onClick={() => {
              tvSounds.playNavigate();
              onDown();
            }}
            className="absolute bottom-2 w-14 h-11 rounded-b-full hover:bg-blue-600/30 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95"
          >
            <ArrowDown className="w-5 h-5" />
          </button>

          {/* Left Button */}
          <button
            onClick={() => {
              tvSounds.playNavigate();
              onLeft();
            }}
            className="absolute left-2 w-11 h-14 rounded-l-full hover:bg-blue-600/30 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Right Button */}
          <button
            onClick={() => {
              tvSounds.playNavigate();
              onRight();
            }}
            className="absolute right-2 w-11 h-14 rounded-r-full hover:bg-blue-600/30 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Center OK / Select Button */}
          <button
            onClick={() => {
              tvSounds.playSelect();
              onSelect();
            }}
            className="w-18 h-18 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 hover:from-blue-500 hover:to-sky-300 text-white font-black text-sm tracking-widest shadow-lg shadow-blue-500/40 flex items-center justify-center transition active:scale-90 border border-white/20"
          >
            OK
          </button>
        </div>

        {/* Function Keys: Back, Home, Menu */}
        <div className="w-full grid grid-cols-3 gap-2.5 mb-4">
          <button
            onClick={() => {
              tvSounds.playBack();
              onBack();
            }}
            className="h-11 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition flex items-center justify-center active:scale-95 shadow-sm"
            title="Back"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              tvSounds.playSelect();
              onHome();
            }}
            className="h-11 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition flex items-center justify-center active:scale-95 shadow-sm"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              tvSounds.playSelect();
              onMenu();
            }}
            className="h-11 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition flex items-center justify-center active:scale-95 shadow-sm"
            title="Quick Settings / Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Volume & Playback Controls */}
        <div className="w-full grid grid-cols-3 gap-2.5 mb-5">
          <button
            onClick={() => {
              tvSounds.playNavigate();
              onVolumeDown();
            }}
            className="h-10 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition font-bold text-lg active:scale-95"
            title="Volume -"
          >
            -
          </button>

          <button
            onClick={() => {
              tvSounds.playNavigate();
              onMute();
            }}
            className="h-10 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition flex items-center justify-center active:scale-95"
            title="Mute"
          >
            <VolumeX className="w-4 h-4 text-rose-400" />
          </button>

          <button
            onClick={() => {
              tvSounds.playNavigate();
              onVolumeUp();
            }}
            className="h-10 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition font-bold text-lg active:scale-95"
            title="Volume +"
          >
            +
          </button>
        </div>

        {/* Dedicated App Quick-Launch Buttons */}
        <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
          <button
            onClick={() => {
              tvSounds.playSelect();
              onLaunchApp('youtube');
            }}
            className="h-9 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            YouTube
          </button>
          <button
            onClick={() => {
              tvSounds.playSelect();
              onLaunchApp('netflix');
            }}
            className="h-9 rounded-xl bg-rose-700/20 hover:bg-rose-700/40 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            Netflix
          </button>
          <button
            onClick={() => {
              tvSounds.playSelect();
              onLaunchApp('games');
            }}
            className="h-9 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 hover:text-white border border-purple-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            Games
          </button>
          <button
            onClick={() => {
              tvSounds.playSelect();
              onLaunchApp('browser');
            }}
            className="h-9 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            Chrome
          </button>
        </div>
      </div>
    </aside>
  );
};
