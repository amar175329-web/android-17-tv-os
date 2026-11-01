import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, Bell, Search, Settings, 
  Tv, BatteryCharging, User 
} from 'lucide-react';
import { UserProfile, OSNotification } from '../../types/os';
import { tvSounds } from '../../services/sound';

interface StatusBarProps {
  activeProfile: UserProfile;
  notifications: OSNotification[];
  wifiConnected: boolean;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenQuickSettings: () => void;
  onOpenProfileModal: () => void;
  onToggleRemote: () => void;
  isRemoteOpen: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeProfile,
  notifications,
  wifiConnected,
  onOpenSearch,
  onOpenNotifications,
  onOpenQuickSettings,
  onOpenProfileModal,
  onToggleRemote,
  isRemoteOpen,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setDateStr(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Battery Status API where supported
    if ('getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number; addEventListener: (t: string, f: () => void) => void }> })
        .getBattery()
        .then((battery) => {
          setBatteryLevel(Math.round(battery.level * 100));
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        })
        .catch(() => {});
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="w-full flex items-center justify-between px-6 sm:px-10 py-4 select-none z-30">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600/30 p-1.5 border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <img src="/tv-logo.svg" alt="Android 17 TV" className="w-full h-full" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
            Android TV <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">17</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Smart Entertainment OS</span>
        </div>
      </div>

      {/* Right System Tray & Shortcuts */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Universal Search Button */}
        <button
          onClick={() => {
            tvSounds.playSelect();
            onOpenSearch();
          }}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition border border-white/10 hover:border-blue-400/40 focus:ring-4 focus:ring-blue-400 flex items-center gap-2 group"
          title="Search (S)"
        >
          <Search className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
          <span className="hidden md:inline text-xs font-medium text-slate-300">Search</span>
        </button>

        {/* Remote Control Trigger */}
        <button
          onClick={() => {
            tvSounds.playSelect();
            onToggleRemote();
          }}
          className={`p-2.5 rounded-full transition border focus:ring-4 focus:ring-blue-400 flex items-center gap-1.5 ${
            isRemoteOpen
              ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/40'
              : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border-white/10'
          }`}
          title="TV Remote Overlay (R)"
        >
          <Tv className="w-4 h-4" />
          <span className="hidden lg:inline text-xs font-semibold">Remote</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => {
            tvSounds.playSelect();
            onOpenNotifications();
          }}
          className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition border border-white/10 focus:ring-4 focus:ring-blue-400"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Quick Settings Gear */}
        <button
          onClick={() => {
            tvSounds.playSelect();
            onOpenQuickSettings();
          }}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition border border-white/10 focus:ring-4 focus:ring-blue-400"
          title="Quick Settings (Q)"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Status Indicators: Wi-Fi, Battery, Clock */}
        <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-white/10">
          {wifiConnected ? (
            <span title="Wi-Fi 6 Connected (5GHz)">
              <Wifi className="w-4 h-4 text-sky-400" />
            </span>
          ) : (
            <span title="Offline">
              <WifiOff className="w-4 h-4 text-rose-400" />
            </span>
          )}

          {batteryLevel !== null && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{batteryLevel}%</span>
            </div>
          )}

          {/* Clock & Date */}
          <div className="text-right flex flex-col justify-center">
            <span className="text-sm font-bold text-white tracking-tight">{timeStr}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">{dateStr}</span>
          </div>
        </div>

        {/* Profile Pill */}
        <button
          onClick={() => {
            tvSounds.playSelect();
            onOpenProfileModal();
          }}
          className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition focus:ring-4 focus:ring-blue-400"
        >
          <span className="text-xs font-semibold text-slate-200 hidden md:inline">
            {activeProfile.name}
          </span>
          <div className="w-7 h-7 rounded-full overflow-hidden border border-blue-400/40 shadow-sm">
            {activeProfile.avatar ? (
              <img src={activeProfile.avatar} alt={activeProfile.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-full h-full p-1 text-slate-300" />
            )}
          </div>
        </button>
      </div>
    </header>
  );
};
