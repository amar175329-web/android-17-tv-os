import React from 'react';
import { 
  Wifi, WifiOff, Bluetooth, BellOff, Plane, 
  Moon, Cast, Volume2, VolumeX, Sun, Settings, 
  Power, Sparkles, X, Sliders 
} from 'lucide-react';
import { SystemSettings } from '../../types/os';
import { tvSounds } from '../../services/sound';

interface QuickSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onOpenFullSettings: () => void;
  onTriggerSleep: () => void;
  onTriggerScreensaver: () => void;
}

export const QuickSettingsModal: React.FC<QuickSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenFullSettings,
  onTriggerSleep,
  onTriggerScreensaver,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-end animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md h-full bg-[#090e1c] border-l border-blue-500/20 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Quick Settings</h2>
                <p className="text-xs text-slate-400">Android 17 Control Hub</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 6 Quick Toggles Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Wi-Fi Toggle */}
            <button
              onClick={() => {
                tvSounds.playSelect();
                onUpdateSettings({ wifiEnabled: !settings.wifiEnabled });
              }}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col items-start justify-between h-24 ${
                settings.wifiEnabled
                  ? 'bg-blue-600/30 border-blue-400/50 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              {settings.wifiEnabled ? <Wifi className="w-5 h-5 text-sky-400" /> : <WifiOff className="w-5 h-5" />}
              <div>
                <p className="text-xs font-bold text-left">{settings.wifiEnabled ? 'Wi-Fi On' : 'Wi-Fi Off'}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{settings.connectedSsid}</p>
              </div>
            </button>

            {/* Bluetooth Toggle */}
            <button
              onClick={() => {
                tvSounds.playSelect();
                onUpdateSettings({ bluetoothEnabled: !settings.bluetoothEnabled });
              }}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col items-start justify-between h-24 ${
                settings.bluetoothEnabled
                  ? 'bg-blue-600/30 border-blue-400/50 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <Bluetooth className={`w-5 h-5 ${settings.bluetoothEnabled ? 'text-sky-400' : ''}`} />
              <div>
                <p className="text-xs font-bold text-left">{settings.bluetoothEnabled ? 'Bluetooth On' : 'Bluetooth Off'}</p>
                <p className="text-[10px] text-slate-400">Remote Connected</p>
              </div>
            </button>

            {/* Do Not Disturb */}
            <button
              onClick={() => {
                tvSounds.playSelect();
                onUpdateSettings({ dnd: !settings.dnd });
              }}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col items-start justify-between h-24 ${
                settings.dnd
                  ? 'bg-amber-600/30 border-amber-400/50 text-white shadow-lg shadow-amber-600/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <BellOff className={`w-5 h-5 ${settings.dnd ? 'text-amber-400' : ''}`} />
              <div>
                <p className="text-xs font-bold text-left">Do Not Disturb</p>
                <p className="text-[10px] text-slate-400">{settings.dnd ? 'Enabled' : 'Off'}</p>
              </div>
            </button>

            {/* Night Light */}
            <button
              onClick={() => {
                tvSounds.playSelect();
                onUpdateSettings({ nightLight: !settings.nightLight });
              }}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col items-start justify-between h-24 ${
                settings.nightLight
                  ? 'bg-amber-600/30 border-amber-400/50 text-white shadow-lg shadow-amber-600/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <Moon className={`w-5 h-5 ${settings.nightLight ? 'text-amber-400' : ''}`} />
              <div>
                <p className="text-xs font-bold text-left">Night Comfort</p>
                <p className="text-[10px] text-slate-400">{settings.nightLight ? 'Warm Tint' : 'Standard'}</p>
              </div>
            </button>

            {/* Screen Cast */}
            <button
              onClick={() => {
                tvSounds.playNotification();
              }}
              className="p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition-all flex flex-col items-start justify-between h-24"
            >
              <Cast className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-xs font-bold text-left">Screen Cast</p>
                <p className="text-[10px] text-slate-400">Discovering Devices</p>
              </div>
            </button>

            {/* Sound Effects Toggle */}
            <button
              onClick={() => {
                const next = !settings.soundFxEnabled;
                tvSounds.enabled = next;
                if (next) tvSounds.playSelect();
                onUpdateSettings({ soundFxEnabled: next });
              }}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col items-start justify-between h-24 ${
                settings.soundFxEnabled
                  ? 'bg-purple-600/30 border-purple-400/50 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${settings.soundFxEnabled ? 'text-purple-400' : ''}`} />
              <div>
                <p className="text-xs font-bold text-left">TV Sound FX</p>
                <p className="text-[10px] text-slate-400">{settings.soundFxEnabled ? 'Active' : 'Muted'}</p>
              </div>
            </button>
          </div>

          {/* Volume Slider */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                {settings.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
                TV Volume
              </span>
              <span className="text-xs font-bold text-white">{settings.isMuted ? 'Muted' : `${settings.volume}%`}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.isMuted ? 0 : settings.volume}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateSettings({ volume: val, isMuted: false });
                tvSounds.playVolumeTick(val);
              }}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-white/10 rounded-lg"
            />
          </div>

          {/* Ambient & Screensaver Triggers */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => {
                onClose();
                onTriggerScreensaver();
              }}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Ambient Mode
            </button>
            <button
              onClick={() => {
                onClose();
                onTriggerSleep();
              }}
              className="p-3 rounded-xl bg-rose-600/10 hover:bg-rose-600/25 border border-rose-500/20 text-xs font-semibold text-rose-400 flex items-center justify-center gap-2 transition"
            >
              <Power className="w-4 h-4 text-rose-400" />
              Sleep Mode
            </button>
          </div>
        </div>

        {/* Bottom Full Settings Launcher */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => {
              onClose();
              onOpenFullSettings();
            }}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Open All Settings
          </button>
        </div>
      </div>
    </div>
  );
};
