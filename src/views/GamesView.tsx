import React, { useState } from 'react';
import { Gamepad2, Play, Trophy, Users, Star, Sparkles } from 'lucide-react';
import { GameItem } from '../types/os';
import { tvSounds } from '../services/sound';

interface GamesViewProps {
  games: GameItem[];
  onLaunchGame: (game: GameItem) => void;
}

export const GamesView: React.FC<GamesViewProps> = ({ games, onLaunchGame }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Arcade Classic', 'Puzzle Strategy', 'Retro Shoot-em-up', 'Sports Arcade'];

  const filtered = activeCategory === 'All'
    ? games
    : games.filter((g) => g.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="w-full px-6 sm:px-12 py-6 select-none overflow-x-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-2.5">
            <Gamepad2 className="w-7 h-7 text-purple-400" />
            Arcade & TV Games Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Genuinely playable retro and casual games ready for D-pad remote, keyboard, or wireless gamepad
          </p>
        </div>

        {/* Gamepad Connection Badge */}
        <div className="px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-2 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gamepad & D-Pad Ready</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              tvSounds.playNavigate();
              setActiveCategory(c);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === c
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Games Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((game) => (
          <div
            key={game.id}
            onClick={() => {
              tvSounds.playSelect();
              onLaunchGame(game);
            }}
            className="group bg-[#0d1326] border border-purple-500/20 hover:border-purple-400/80 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/50">
                    <Play className="w-7 h-7 fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase shadow">
                  PLAYABLE TV MINI-GAME
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 fill-amber-300" />
                  {game.rating}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-[11px] text-purple-400 font-semibold mb-2">{game.category}</p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-white/5 mt-3 pt-3">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3" /> {game.players}
              </span>
              <button className="px-4 py-1.5 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm">
                Launch
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
