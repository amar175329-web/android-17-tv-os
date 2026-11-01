import React, { useState } from 'react';
import { 
  Grid, Search, Star, Pin, Trash2, 
  Download, ExternalLink, Check, ShoppingBag, 
  Sparkles, Filter, Info, ArrowUpRight 
} from 'lucide-react';
import { TVApp, AppCategory } from '../types/os';
import { tvSounds } from '../services/sound';

interface AppsViewProps {
  apps: TVApp[];
  onOpenApp: (app: TVApp) => void;
  onTogglePin: (id: string) => void;
  onToggleFavourite: (id: string) => void;
  onUninstallApp: (id: string) => void;
  onOpenAppStore: () => void;
}

export const AppsView: React.FC<AppsViewProps> = ({
  apps,
  onOpenApp,
  onTogglePin,
  onToggleFavourite,
  onUninstallApp,
  onOpenAppStore,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectApp, setInspectApp] = useState<TVApp | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Apps' },
    { id: 'installed', label: 'Installed' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'games', label: 'Games' },
    { id: 'music', label: 'Music' },
    { id: 'utilities', label: 'Utilities' },
  ];

  const filteredApps = apps.filter((app) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'installed'
        ? app.isInstalled
        : app.category === selectedCategory;

    const matchesQuery =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full px-6 sm:px-12 py-6 select-none overflow-x-hidden animate-in fade-in duration-300">
      {/* Top Banner & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-3">
            <Grid className="w-7 h-7 text-blue-400" />
            Applications & Channels
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage virtual applications, pin to home screen, or install new services
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Filter apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none w-32 sm:w-48"
            />
          </div>

          {/* App Store Shortcut */}
          <button
            onClick={() => {
              tvSounds.playSelect();
              onOpenAppStore();
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            Get More Apps
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              tvSounds.playNavigate();
              setSelectedCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="group relative bg-[#0c1324] border border-white/10 hover:border-blue-400/60 rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]"
          >
            <div>
              {/* App Icon & Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-blue-400/30 flex items-center justify-center text-white font-black text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {app.name[0]}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase bg-white/5 px-2 py-0.5 rounded-full">
                    {app.category}
                  </span>
                  {app.isPinned && (
                    <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5 fill-blue-400" /> Pinned
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                {app.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {app.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  tvSounds.playSelect();
                  onOpenApp(app);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <span>Open</span>
                {app.launchUrl && <ArrowUpRight className="w-3.5 h-3.5" />}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    tvSounds.playNavigate();
                    onTogglePin(app.id);
                  }}
                  className={`p-1.5 rounded-lg transition ${
                    app.isPinned ? 'text-blue-400 hover:text-blue-300' : 'text-slate-500 hover:text-white'
                  }`}
                  title={app.isPinned ? 'Unpin from Home' : 'Pin to Home'}
                >
                  <Pin className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    tvSounds.playNavigate();
                    setInspectApp(app);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
                  title="App Details & Manage"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* App Details / Uninstall Modal */}
      {inspectApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 select-none animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0d1424] border border-blue-500/30 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-white font-black text-3xl">
                {inspectApp.name[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{inspectApp.name}</h3>
                <p className="text-xs font-mono text-slate-400">{inspectApp.packageName}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span>Rating: {inspectApp.rating} ★</span>
                  <span>•</span>
                  <span>Size: {inspectApp.sizeMb} MB</span>
                  <span>•</span>
                  <span>Downloads: {inspectApp.downloads}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {inspectApp.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {!inspectApp.isSystem ? (
                <button
                  onClick={() => {
                    tvSounds.playBack();
                    onUninstallApp(inspectApp.id);
                    setInspectApp(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 font-semibold text-xs border border-rose-500/30 transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Uninstall Application
                </button>
              ) : (
                <span className="text-xs text-slate-500">Android System Application (Protected)</span>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setInspectApp(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const a = inspectApp;
                    setInspectApp(null);
                    onOpenApp(a);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Launch App
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
