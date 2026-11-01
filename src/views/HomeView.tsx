import React, { useState } from 'react';
import { 
  Play, Info, Plus, Check, Star, 
  Sparkles, ChevronRight, Gamepad2, Film, Clock 
} from 'lucide-react';
import { MediaItem, TVApp, GameItem } from '../types/os';
import { tvSounds } from '../services/sound';

interface HomeViewProps {
  movies: MediaItem[];
  apps: TVApp[];
  games: GameItem[];
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  onPlayMedia: (media: MediaItem) => void;
  onOpenApp: (app: TVApp) => void;
  onOpenGame: (game: GameItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  movies,
  apps,
  games,
  watchlist,
  onToggleWatchlist,
  onPlayMedia,
  onOpenApp,
  onOpenGame,
}) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [selectedMediaInfo, setSelectedMediaInfo] = useState<MediaItem | null>(null);

  const featured = movies.slice(0, 3);
  const currentHero = featured[heroIndex] || movies[0];

  const inWatchlist = currentHero && watchlist.includes(currentHero.id);

  const favouriteApps = apps.filter((a) => a.isFavourite);
  const continueWatching = movies.filter((m) => (m.progress || 0) > 0);
  const trendingMovies = movies.filter((m) => m.type === 'movie');
  const tvSeries = movies.filter((m) => m.type === 'show');

  return (
    <div className="w-full pb-20 select-none overflow-x-hidden">
      {/* Featured Cinematic Hero Section */}
      <section className="relative w-full h-[62vh] min-h-[420px] max-h-[640px] flex items-end px-6 sm:px-12 pb-12 overflow-hidden">
        {/* Dynamic Background Image with Vignette Gradients */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform scale-105"
          style={{ backgroundImage: `url(${currentHero.backdropUrl})` }}
        >
          {/* Top, Bottom, Left Gradients to integrate seamlessly into dark TV OS */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060913] via-[#060913]/70 to-transparent w-full md:w-3/4" />
        </div>

        {/* Hero Metadata & Actions */}
        <div className="relative z-10 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              FEATURED PREMIERE
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              {currentHero.matchScore}% Match
            </span>
            <span className="text-xs text-slate-300 font-medium">{currentHero.year}</span>
            <span className="text-xs px-1.5 py-0.2 rounded border border-white/20 text-slate-300 font-mono">
              {currentHero.rating}
            </span>
            {currentHero.duration && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {currentHero.duration}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2.5 drop-shadow-xl">
            {currentHero.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-6 leading-relaxed max-w-xl drop-shadow-md">
            {currentHero.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                tvSounds.playSelect();
                onPlayMedia(currentHero);
              }}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-200 text-black font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all focus:ring-4 focus:ring-blue-400"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => {
                tvSounds.playNavigate();
                setSelectedMediaInfo(currentHero);
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 focus:ring-4 focus:ring-blue-400"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>

            <button
              onClick={() => {
                tvSounds.playSelect();
                onToggleWatchlist(currentHero.id);
              }}
              className={`p-3.5 rounded-2xl backdrop-blur-md border transition-all focus:ring-4 focus:ring-blue-400 ${
                inWatchlist
                  ? 'bg-blue-600/40 border-blue-400 text-blue-300'
                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
              }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Carousel Indicators on Right */}
        <div className="absolute right-8 bottom-12 z-10 hidden sm:flex items-center gap-2">
          {featured.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                tvSounds.playNavigate();
                setHeroIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                heroIndex === idx ? 'w-8 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Content Rows / Shelves */}
      <div className="px-6 sm:px-12 space-y-9 -mt-4 relative z-20">
        {/* Row 1: Continue Watching (if any progress) */}
        {continueWatching.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Continue Watching
              </h3>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
              {continueWatching.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    tvSounds.playSelect();
                    onPlayMedia(item);
                  }}
                  className="flex-shrink-0 w-64 sm:w-72 group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  <div className="relative h-36">
                    <img src={item.backdropUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60">
                      <div className="h-full bg-blue-500" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-white truncate">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.duration || 'Feature Film'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Row 2: Your Favourite Apps */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
              Your Favourite Apps
            </h3>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {favouriteApps.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  tvSounds.playSelect();
                  onOpenApp(app);
                }}
                className="flex-shrink-0 w-44 sm:w-52 h-28 rounded-3xl bg-gradient-to-br from-[#121a30] to-[#0c1224] border border-white/10 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-105 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                    <span className="font-black text-lg">{app.name[0]}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                    {app.category}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                    {app.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">Open App</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Trending Movies */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
              <Film className="w-5 h-5 text-indigo-400" /> Trending Movies
            </h3>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {trendingMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => {
                  tvSounds.playSelect();
                  onPlayMedia(movie);
                }}
                className="flex-shrink-0 w-40 sm:w-48 group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <div className="relative aspect-[2/3]">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 fill-amber-300" />
                    {movie.rating}
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-white truncate">{movie.title}</p>
                  <p className="text-[10px] text-slate-400">{movie.genre.slice(0, 2).join(' · ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Playable Arcade Games */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" /> Playable Arcade Games
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => {
                  tvSounds.playSelect();
                  onOpenGame(game);
                }}
                className="group relative rounded-2xl overflow-hidden bg-[#0e162b] border border-purple-500/20 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.35)] cursor-pointer transition-all duration-200 hover:scale-105 p-3 flex flex-col justify-between"
              >
                <div className="relative h-28 rounded-xl overflow-hidden mb-2.5">
                  <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-md">
                    PLAY NOW
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300">{game.title}</h4>
                  <p className="text-[10px] text-slate-400">{game.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 5: TV Series & Binge-Worthy Shows */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
              Binge-Worthy TV Shows
            </h3>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {tvSeries.map((show) => (
              <div
                key={show.id}
                onClick={() => {
                  tvSounds.playSelect();
                  onPlayMedia(show);
                }}
                className="flex-shrink-0 w-64 sm:w-72 group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <div className="relative h-36">
                  <img src={show.backdropUrl} alt={show.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600/90 text-[10px] font-bold text-white shadow">
                    SERIES
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-white truncate">{show.title}</p>
                  <p className="text-[11px] text-slate-400">{show.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* More Info Details Modal */}
      {selectedMediaInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 select-none animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0c1224] border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="relative h-60">
              <img src={selectedMediaInfo.backdropUrl} alt={selectedMediaInfo.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1224] via-transparent to-transparent" />
              <button
                onClick={() => setSelectedMediaInfo(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6 -mt-8 relative z-10">
              <h2 className="text-2xl font-black text-white mb-2">{selectedMediaInfo.title}</h2>
              <div className="flex items-center gap-2 mb-4 text-xs">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                  {selectedMediaInfo.matchScore}% Match
                </span>
                <span className="text-slate-300">{selectedMediaInfo.year}</span>
                <span className="text-slate-400">{selectedMediaInfo.genre.join(', ')}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">{selectedMediaInfo.synopsis}</p>
              {selectedMediaInfo.cast && (
                <p className="text-xs text-slate-400 mb-6">
                  <strong className="text-slate-200">Cast:</strong> {selectedMediaInfo.cast.join(', ')}
                </p>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const m = selectedMediaInfo;
                    setSelectedMediaInfo(null);
                    onPlayMedia(m);
                  }}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/40"
                >
                  <Play className="w-4 h-4 fill-white" /> Play Video
                </button>
                <button
                  onClick={() => {
                    onToggleWatchlist(selectedMediaInfo.id);
                  }}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm"
                >
                  {watchlist.includes(selectedMediaInfo.id) ? '✓ In Watchlist' : '+ Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
