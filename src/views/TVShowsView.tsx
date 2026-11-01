import React from 'react';
import { Tv2, Play, Plus, Check, Star } from 'lucide-react';
import { MediaItem } from '../types/os';
import { tvSounds } from '../services/sound';

interface TVShowsViewProps {
  shows: MediaItem[];
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  onPlayShow: (show: MediaItem) => void;
}

export const TVShowsView: React.FC<TVShowsViewProps> = ({
  shows,
  watchlist,
  onToggleWatchlist,
  onPlayShow,
}) => {
  const showItems = shows.filter((s) => s.type === 'show');

  return (
    <div className="w-full px-6 sm:px-12 py-6 select-none overflow-x-hidden animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-2.5">
          <Tv2 className="w-7 h-7 text-indigo-400" />
          Television Series & Seasons
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Binge your favorite multi-episode drama series, sci-fi sagas, and documentaries
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {showItems.map((show) => {
          const inWatchlist = watchlist.includes(show.id);

          return (
            <div
              key={show.id}
              className="group bg-[#0c1324] border border-white/10 hover:border-indigo-400/60 rounded-3xl overflow-hidden shadow-xl transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => {
                    tvSounds.playSelect();
                    onPlayShow(show);
                  }}
                  className="relative h-48 cursor-pointer overflow-hidden"
                >
                  <img
                    src={show.backdropUrl}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-7 h-7 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white text-[11px] font-extrabold uppercase shadow">
                    SERIES
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {show.title}
                    </h3>
                    <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      {show.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {show.synopsis}
                  </p>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="p-5 pt-0 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">{show.subtitle}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      tvSounds.playSelect();
                      onToggleWatchlist(show.id);
                    }}
                    className={`p-2 rounded-xl border transition ${
                      inWatchlist ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      tvSounds.playSelect();
                      onPlayShow(show);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30"
                  >
                    Watch S1:E1
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
