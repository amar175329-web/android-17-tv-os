import React, { useState, useMemo } from 'react';
import { Search, Mic, X, Film, Grid, Gamepad2, Settings, ArrowRight } from 'lucide-react';
import { TVApp, MediaItem, GameItem } from '../../types/os';
import { tvSounds } from '../../services/sound';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  apps: TVApp[];
  movies: MediaItem[];
  games: GameItem[];
  onOpenApp: (app: TVApp) => void;
  onOpenMedia: (media: MediaItem) => void;
  onOpenGame: (game: GameItem) => void;
  onOpenSettings: () => void;
}

const TV_KEYBOARD = [
  ['A', 'B', 'C', 'D', 'E', 'F'],
  ['G', 'H', 'I', 'J', 'K', 'L'],
  ['M', 'N', 'O', 'P', 'Q', 'R'],
  ['S', 'T', 'U', 'V', 'W', 'X'],
  ['Y', 'Z', '1', '2', '3', '4'],
  ['5', '6', '7', '8', '9', '0'],
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  apps,
  movies,
  games,
  onOpenApp,
  onOpenMedia,
  onOpenGame,
  onOpenSettings,
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    return {
      apps: apps.filter((a) => a.name.toLowerCase().includes(q) || a.category.includes(q as any)),
      movies: movies.filter((m) => m.title.toLowerCase().includes(q) || m.genre.some((g) => g.toLowerCase().includes(q))),
      games: games.filter((g) => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)),
      settings: [
        'Wi-Fi & Network',
        'Bluetooth & Accessories',
        'Display & Scaling',
        'Sound & Volumes',
        'Storage & Apps',
        'About Android 17 TV'
      ].filter((s) => s.toLowerCase().includes(q)),
    };
  }, [query, apps, movies, games]);

  if (!isOpen) return null;

  const handleVoiceSearch = () => {
    setIsListening(true);
    tvSounds.playSelect();
    const demoPhrases = ['Tears of Steel', 'Retro Snake', 'YouTube', 'Settings', 'Cyberpunk', 'Netflix'];
    const phrase = demoPhrases[Math.floor(Math.random() * demoPhrases.length)];
    
    setTimeout(() => {
      setQuery(phrase);
      setIsListening(false);
      tvSounds.playNotification();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060913]/95 backdrop-blur-2xl flex flex-col p-6 sm:p-10 select-none animate-in fade-in duration-200">
      {/* Top Search Input Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center gap-4 mb-8">
        <div className="flex-1 relative flex items-center bg-white/10 border border-white/20 rounded-2xl px-5 py-3.5 shadow-2xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/30">
          <Search className="w-6 h-6 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Search movies, TV shows, apps, games, settings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-lg sm:text-xl font-medium placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Voice Search Button */}
        <button
          onClick={handleVoiceSearch}
          className={`p-4 rounded-2xl transition border flex items-center gap-2 ${
            isListening
              ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
              : 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border-white/10'
          }`}
          title="Voice Search"
        >
          <Mic className="w-6 h-6" />
          <span className="hidden sm:inline text-sm font-semibold">
            {isListening ? 'Listening...' : 'Voice Search'}
          </span>
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area: TV Virtual Keyboard & Results */}
      <div className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto no-scrollbar">
        {/* Left Column: On-Screen TV Remote Keyboard */}
        <div className="lg:col-span-4 bg-[#0c1222] border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 w-full text-center">
            TV Remote On-Screen Keyboard
          </h3>

          <div className="grid grid-cols-6 gap-2 w-full max-w-xs mb-3">
            {TV_KEYBOARD.flat().map((char) => (
              <button
                key={char}
                onClick={() => {
                  tvSounds.playNavigate();
                  setQuery((q) => q + char);
                }}
                className="h-10 rounded-xl bg-white/5 hover:bg-blue-600 text-white font-bold text-sm border border-white/10 hover:border-blue-400 transition active:scale-95 flex items-center justify-center focus:ring-2 focus:ring-blue-400"
              >
                {char}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full max-w-xs">
            <button
              onClick={() => {
                tvSounds.playNavigate();
                setQuery((q) => q + ' ');
              }}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 text-xs font-bold border border-white/10 transition"
            >
              SPACE
            </button>
            <button
              onClick={() => {
                tvSounds.playNavigate();
                setQuery((q) => q.slice(0, -1));
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition"
            >
              DEL
            </button>
            <button
              onClick={() => {
                tvSounds.playNavigate();
                setQuery('');
              }}
              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 text-xs font-bold border border-white/10 transition"
            >
              CLEAR
            </button>
          </div>
        </div>

        {/* Right Column: Search Results */}
        <div className="lg:col-span-8 overflow-y-auto no-scrollbar space-y-6">
          {!results ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">Type on the virtual keyboard or use voice search to find content.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Tears of Steel', 'YouTube', '2048', 'Wi-Fi', 'Netflix'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      tvSounds.playSelect();
                      setQuery(tag);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-blue-400 border border-white/10 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Movies & Shows Results */}
              {results.movies.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Film className="w-4 h-4 text-blue-400" /> Movies & TV Shows ({results.movies.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {results.movies.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          tvSounds.playSelect();
                          onOpenMedia(m);
                          onClose();
                        }}
                        className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-400 cursor-pointer transition-all duration-200 hover:scale-105"
                      >
                        <img src={m.backdropUrl} alt={m.title} className="w-full h-24 object-cover" />
                        <div className="p-2.5">
                          <p className="text-xs font-bold text-white truncate">{m.title}</p>
                          <p className="text-[10px] text-slate-400">{m.genre.join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apps Results */}
              {results.apps.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Grid className="w-4 h-4 text-emerald-400" /> Applications ({results.apps.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {results.apps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          tvSounds.playSelect();
                          onOpenApp(app);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400 cursor-pointer transition hover:scale-105 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center text-white font-bold text-sm">
                          {app.name[0]}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{app.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{app.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Games Results */}
              {results.games.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-purple-400" /> Games ({results.games.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {results.games.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => {
                          tvSounds.playSelect();
                          onOpenGame(g);
                          onClose();
                        }}
                        className="group p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400 cursor-pointer transition hover:scale-105 flex items-center gap-3"
                      >
                        <img src={g.thumbnail} alt={g.title} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="text-xs font-bold text-white truncate">{g.title}</p>
                          <p className="text-[10px] text-purple-400">{g.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Results */}
              {results.settings.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-400" /> Settings Matches ({results.settings.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.settings.map((s) => (
                      <div
                        key={s}
                        onClick={() => {
                          tvSounds.playSelect();
                          onOpenSettings();
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition flex items-center justify-between"
                      >
                        <span className="text-xs font-medium text-slate-200">{s}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
