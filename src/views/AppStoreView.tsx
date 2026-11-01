import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Download, Trash2, 
  Check, Star, ShieldCheck, ArrowLeft, Sparkles, Filter 
} from 'lucide-react';
import { TVApp } from '../types/os';
import { tvSounds } from '../services/sound';

interface AppStoreViewProps {
  apps: TVApp[];
  onInstallApp: (id: string) => void;
  onUninstallApp: (id: string) => void;
  onBack: () => void;
}

export const AppStoreView: React.FC<AppStoreViewProps> = ({
  apps,
  onInstallApp,
  onUninstallApp,
  onBack,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const filters = [
    { id: 'all', label: 'All Catalog' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'games', label: 'Games' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'media', label: 'Media & Players' },
  ];

  const handleInstallClick = (app: TVApp) => {
    if (app.isInstalled) {
      if (!app.isSystem) {
        tvSounds.playBack();
        onUninstallApp(app.id);
      }
    } else {
      tvSounds.playSelect();
      setInstallingId(app.id);
      setTimeout(() => {
        onInstallApp(app.id);
        setInstallingId(null);
        tvSounds.playNotification();
      }, 1600);
    }
  };

  const filtered = apps.filter((app) => {
    const matchCategory = selectedFilter === 'all' || app.category === selectedFilter;
    const matchSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="w-full px-6 sm:px-12 py-6 select-none overflow-x-hidden animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-emerald-400" />
              Google Play Store for TV
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Browse, install, and manage virtual applications optimized for living room screens
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
          <Search className="w-4 h-4 text-slate-400 mr-2.5" />
          <input
            type="text"
            placeholder="Search TV Store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none w-40 sm:w-56"
          />
        </div>
      </div>

      {/* Featured Store Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-8 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-[#0a1224] p-6 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            EDITORS’ CHOICE TV APP
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Twitch TV Live Gaming</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            Watch the world's premier esports, live tournaments, speedruns, and community broadcasts on your large screen display.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Star className="w-4 h-4 fill-amber-300" /> 4.8 Rating
            </span>
            <span>•</span>
            <span>100M+ Downloads</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Play Protect Verified
            </span>
          </div>
        </div>

        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-4xl shadow-2xl">
          T
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              tvSounds.playNavigate();
              setSelectedFilter(f.id);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedFilter === f.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-3xl bg-[#0c1424] border border-white/10 hover:border-emerald-400/50 transition-all flex flex-col justify-between hover:scale-[1.02] shadow-xl group"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-blue-600/20 border border-emerald-400/30 flex items-center justify-center text-white font-black text-2xl shadow-inner">
                  {app.name[0]}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                    {app.category}
                  </span>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-300" /> {app.rating}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {app.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {app.description}
              </p>
            </div>

            {/* Install Button & Status */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {app.sizeMb} MB
              </span>

              {installingId === app.id ? (
                <div className="px-5 py-2 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-400/40 text-xs font-bold flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  Installing...
                </div>
              ) : app.isInstalled ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Installed
                  </span>
                  {!app.isSystem && (
                    <button
                      onClick={() => handleInstallClick(app)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 transition"
                      title="Uninstall"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleInstallClick(app)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/30"
                >
                  <Download className="w-4 h-4" />
                  Install
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
