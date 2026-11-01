import React from 'react';
import { Bell, CheckCheck, Trash2, X, Sparkles, Tv, Wifi, Info } from 'lucide-react';
import { OSNotification } from '../../types/os';
import { tvSounds } from '../../services/sound';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: OSNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onDismiss: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onDismiss,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'media':
        return <Tv className="w-5 h-5 text-blue-400" />;
      case 'system':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-end animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md h-full bg-[#0a0f21] border-l border-blue-500/20 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Notifications</h2>
                <p className="text-xs text-slate-400">Android 17 System Alerts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar: Mark read & Clear */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  tvSounds.playNavigate();
                  onMarkAllAsRead();
                }}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition"
              >
                <CheckCheck className="w-4 h-4" /> Mark all read
              </button>
              <button
                onClick={() => {
                  tvSounds.playBack();
                  onClearAll();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" /> Clear all
              </button>
            </div>
          )}

          {/* List of Notifications */}
          <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[calc(100vh-220px)]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mb-4">
                  <Bell className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-slate-300">All caught up!</p>
                <p className="text-xs text-slate-500 mt-1">No pending notifications on your Android TV.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 relative group ${
                    n.isRead
                      ? 'bg-white/5 border-white/5 opacity-70'
                      : 'bg-white/10 border-blue-500/30 shadow-lg'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{n.title}</span>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-500 mt-2 block font-medium">{n.time}</span>
                  </div>
                  <button
                    onClick={() => {
                      tvSounds.playBack();
                      onDismiss(n.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-500">
            Press <span className="font-mono text-slate-400">Esc</span> or <span className="font-mono text-slate-400">Back</span> to dismiss
          </p>
        </div>
      </div>
    </div>
  );
};
