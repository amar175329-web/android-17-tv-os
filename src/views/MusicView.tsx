import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Disc, Heart, Sparkles } from 'lucide-react';
import { tvSounds } from '../services/sound';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  audioUrl?: string;
}

const DEFAULT_SONGS: Song[] = [
  {
    id: 's-1',
    title: 'Neon Skyline Horizon',
    artist: 'Cyberwave Collective',
    album: 'Android 17 Synthscapes',
    duration: '3:45',
    cover: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 's-2',
    title: 'Midnight Quantum Drift',
    artist: 'Aura Polaris',
    album: 'Deep Living Room Ambience',
    duration: '4:20',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 's-3',
    title: 'Cosmic Rain on Glass',
    artist: 'Retro Nebula',
    album: 'Lofi TV Chills',
    duration: '3:15',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 's-4',
    title: 'Electric Dreamer 2088',
    artist: 'Kavinsky Tribute Band',
    album: 'Outrun Highway',
    duration: '4:50',
    cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
  },
];

export const MusicView: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState<string[]>(['s-1']);

  const currentSong = DEFAULT_SONGS[currentSongIndex];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    tvSounds.playSelect();
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % DEFAULT_SONGS.length);
    tvSounds.playNavigate();
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + DEFAULT_SONGS.length) % DEFAULT_SONGS.length);
    tvSounds.playNavigate();
  };

  const toggleLike = (id: string) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    tvSounds.playNotification();
  };

  return (
    <div className="w-full px-6 sm:px-12 py-6 select-none overflow-x-hidden animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-2.5">
          <Music className="w-7 h-7 text-emerald-400" />
          Music & Soundscapes
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          High-fidelity stereo audio, album art visualizers, and curated TV playlists
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Big Screen Music Player */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0f172a] to-[#080d19] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-2 border-white/10 mb-6 group">
            <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-black/30 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
              <Disc className={`w-16 h-16 text-white/40 ${isPlaying ? 'animate-spin [animation-duration:8s]' : ''}`} />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide mb-1">{currentSong.title}</h2>
          <p className="text-sm font-semibold text-emerald-400 mb-0.5">{currentSong.artist}</p>
          <p className="text-xs text-slate-400 mb-6">{currentSong.album}</p>

          {/* Dancing Audio Equalizer Bars */}
          <div className="flex items-center gap-1.5 h-8 mb-6">
            {[40, 70, 90, 50, 80, 100, 60, 30, 85, 95, 45, 65].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 bg-gradient-to-t from-emerald-500 to-sky-400 rounded-full transition-all duration-150 ${
                  isPlaying ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (h * (i % 2 === 0 ? 0.9 : 1.1)))}%` : '15%',
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={prevSong}
              className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/40 transition scale-100 hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-black" /> : <Play className="w-7 h-7 fill-black ml-1" />}
            </button>

            <button
              onClick={nextSong}
              className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Playlist Tracks */}
        <div className="lg:col-span-7 bg-[#0b101f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-base font-bold text-white tracking-wide mb-4 flex items-center justify-between">
            <span>Now Playing Queue</span>
            <span className="text-xs text-slate-400">{DEFAULT_SONGS.length} Tracks</span>
          </h3>

          <div className="space-y-2">
            {DEFAULT_SONGS.map((song, idx) => {
              const isCurrent = currentSongIndex === idx;
              const isFav = liked.includes(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => {
                    setCurrentSongIndex(idx);
                    setIsPlaying(true);
                    tvSounds.playSelect();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-600/20 border-emerald-400 text-white shadow-md'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-5 text-center text-xs font-mono text-slate-500">
                      {isCurrent && isPlaying ? '▶' : idx + 1}
                    </span>
                    <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-sm font-bold truncate">{song.title}</h4>
                      <p className="text-xs text-slate-400">{song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-400">{song.duration}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(song.id);
                      }}
                      className={`p-1.5 rounded-lg transition ${
                        isFav ? 'text-rose-500' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
