import React from 'react';
import { Bookmark, Play, Trash2, Film, Star, Clock } from 'lucide-react';
import { MediaItem, TVApp } from '../types/os';
import { tvSounds } from '../services/sound';

interface LibraryViewProps {
  watchlistIds: string[];
  allMovies: MediaItem[];
  installedApps: TVApp[];
  onPlayMedia: (item: MediaItem) => void;
  onRemoveFromWatchlist: (id: string) => void;
  onOpenApp: (app: TVApp) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  watchlistIds,
  allMovies,
  installedApps,
  onPlayMedia,
  onRemoveFromWatchlist,
  onOpenApp,
}) => {
  const watchlistItems = allMovies.filter((m) => watchlistIds.includes(m.id));

  return (
    <div className="w-full px-6 sm:px-12 py-6 select-none overflow-x-hidden animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-2.5">
          <Bookmark className="w-7 h-7 text-amber-400" />
          My TV Library & Watchlist
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Your saved cinema, bookmarked series, and installed software library
        </p>
      </div>

      {/* Watchlist Section */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Film className="w-5 h-5 text-blue-400" />
          Saved to Watchlist ({watchlistItems.length})
        </h2>

        {watchlistItems.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
            <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Your watchlist is currently empty.</p>
            <p className="text-xs text-slate-500 mt-1">Browse movies or TV shows and tap '+' to bookmark them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {watchlistItems.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-3xl bg-[#0c1324] border border-white/10 hover:border-blue-400/60 transition-all flex items-center justify-between shadow-lg hover:scale-[1.02]"
              >
                <div
                  onClick={() => {
                    tvSounds.playSelect();
                    onPlayMedia(item);
                  }}
                  className="flex items-center gap-3.5 cursor-pointer flex-1 overflow-hidden"
                >
                  <img src={item.backdropUrl} alt={item.title} className="w-20 h-14 rounded-xl object-cover" />
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{item.genre.join(', ')}</p>
                    <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-300" /> {item.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-3 border-l border-white/10 ml-2">
                  <button
                    onClick={() => {
                      tvSounds.playSelect();
                      onPlayMedia(item);
                    }}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
                    title="Play"
                  >
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </button>
                  <button
                    onClick={() => {
                      tvSounds.playBack();
                      onRemoveFromWatchlist(item.id);
                    }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Installed Applications Hub */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Installed TV Applications ({installedApps.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {installedApps.map((app) => (
            <div
              key={app.id}
              onClick={() => {
                tvSounds.playSelect();
                onOpenApp(app);
              }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400 hover:bg-white/10 transition cursor-pointer flex flex-col items-center text-center gap-2 hover:scale-105"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold text-lg">
                {app.name[0]}
              </div>
              <p className="text-xs font-bold text-white truncate w-full">{app.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
