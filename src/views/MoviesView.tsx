import React, { useState } from 'react';
import { Film, Play, Plus, Check, Star } from 'lucide-react';
import { MediaItem } from '../types/os';
import { tvSounds } from '../services/sound';

interface MoviesViewProps {
  movies: MediaItem[];
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  onPlayMovie: (movie: MediaItem) => void;
}

export const MoviesView: React.FC<MoviesViewProps> = ({
  movies,
  watchlist,
  onToggleWatchlist,
  onPlayMovie,
}) => {
  const [selectedGenre, setSelectedGenre] = useState('All');

  const movieItems = movies.filter((m) => m.type === 'movie');
  const genres = ['All', 'Sci-Fi', 'Animation', 'Fantasy', 'Documentary', 'Action'];

  const filtered = selectedGenre === 'All'
    ? movieItems
    : movieItems.filter((m) => m.genre.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase())));

  return (
    <div className="w-full px-6 sm:px-12 py-6 select-none overflow-x-hidden animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-2.5">
          <Film className="w-7 h-7 text-blue-400" />
          Feature Movies
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Stream movies in 4K UHD, HDR10+, and Dolby Atmos spatial audio
        </p>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => {
              tvSounds.playNavigate();
              setSelectedGenre(g);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedGenre === g
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
        {filtered.map((movie) => {
          const inWatchlist = watchlist.includes(movie.id);

          return (
            <div
              key={movie.id}
              className="group relative bg-[#0c1324] border border-white/10 hover:border-blue-400 rounded-3xl overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex flex-col justify-between"
            >
              <div
                onClick={() => {
                  tvSounds.playSelect();
                  onPlayMovie(movie);
                }}
                className="cursor-pointer"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 fill-amber-300" />
                    {movie.rating}
                  </div>
                </div>

                <div className="p-3.5">
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                    {movie.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {movie.genre.join(' · ')}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Bar */}
              <div className="px-3.5 pb-3.5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {movie.matchScore}% Match
                </span>
                <button
                  onClick={() => {
                    tvSounds.playSelect();
                    onToggleWatchlist(movie.id);
                  }}
                  className={`p-1.5 rounded-lg border transition ${
                    inWatchlist
                      ? 'bg-blue-600/30 border-blue-400 text-blue-300'
                      : 'bg-white/5 hover:bg-white/15 border-white/10 text-slate-400 hover:text-white'
                  }`}
                  title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
