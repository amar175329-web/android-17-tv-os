import React, { useState } from 'react';
import { 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  ExternalLink, 
  Bookmark, 
  Search, 
  ShieldCheck, 
  Plus, 
  History,
  X,
  Compass
} from 'lucide-react';
import { soundEffects } from '../services/sound';

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  embeddable: boolean;
}

const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  { id: '1', title: 'Wikipedia', url: 'https://en.m.wikipedia.org/wiki/Main_Page', icon: 'W', embeddable: true },
  { id: '2', title: 'Internet Archive', url: 'https://archive.org', icon: '🏛️', embeddable: true },
  { id: '3', title: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '🦆', embeddable: false },
  { id: '4', title: 'Hacker News', url: 'https://news.ycombinator.com', icon: 'Y', embeddable: true },
  { id: '5', title: 'GitHub', url: 'https://github.com', icon: '🐙', embeddable: false },
  { id: '6', title: 'YouTube Web', url: 'https://youtube.com', icon: '▶️', embeddable: false },
  { id: '7', title: 'Reddit', url: 'https://reddit.com', icon: '🤖', embeddable: false },
  { id: '8', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📚', embeddable: false },
];

export const BrowserView: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://en.m.wikipedia.org/wiki/Smart_TV');
  const [activeUrl, setActiveUrl] = useState('https://en.m.wikipedia.org/wiki/Smart_TV');
  const [activeTitle, setActiveTitle] = useState('Smart TV - Wikipedia');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(DEFAULT_BOOKMARKS);
  const [recentHistory, setRecentHistory] = useState<string[]>([
    'https://en.m.wikipedia.org/wiki/Smart_TV',
    'https://archive.org',
    'https://news.ycombinator.com',
  ]);
  const [isIframeBlockedNotice, setIsIframeBlockedNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const navigateTo = (url: string, title?: string) => {
    soundEffects.playSelect();
    let normalized = url.trim();
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      if (normalized.includes('.') && !normalized.includes(' ')) {
        normalized = 'https://' + normalized;
      } else {
        // Treat as web search
        normalized = `https://duckduckgo.com/?q=${encodeURIComponent(normalized)}`;
      }
    }

    setUrlInput(normalized);
    setActiveUrl(normalized);
    setActiveTitle(title || normalized.replace(/^https?:\/\/(www\.)?/, ''));
    setIsLoading(true);

    // Update history
    setRecentHistory((prev) => {
      const filtered = prev.filter((item) => item !== normalized);
      return [normalized, ...filtered].slice(0, 15);
    });

    // Check if domain is known to block iframes via X-Frame-Options
    const blockedDomains = ['google.com', 'youtube.com', 'github.com', 'reddit.com', 'twitter.com', 'x.com', 'facebook.com', 'netflix.com', 'duckduckgo.com', 'mozilla.org'];
    const isBlocked = blockedDomains.some((d) => normalized.toLowerCase().includes(d));
    setIsIframeBlockedNotice(isBlocked);

    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      navigateTo(urlInput);
    }
  };

  const handleOpenExternal = () => {
    soundEffects.playSelect();
    window.open(activeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddBookmark = () => {
    soundEffects.playSelect();
    const newBm: BookmarkItem = {
      id: Date.now().toString(),
      title: activeTitle.slice(0, 15),
      url: activeUrl,
      icon: '🌐',
      embeddable: !isIframeBlockedNotice,
    };
    setBookmarks((prev) => [...prev, newBm]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] w-full px-6 py-4 animate-fade-in">
      {/* Top Browser Chrome Bar */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-3 shadow-2xl flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          {/* Back/Forward/Reload Navigation */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundEffects.playBack();
                if (recentHistory.length > 1) {
                  navigateTo(recentHistory[1]);
                }
              }}
              title="Back"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => soundEffects.playNavigate()}
              title="Forward"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 transition-all text-slate-400 hover:text-white"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo(activeUrl)}
              title="Reload Page"
              className={`p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 hover:text-white ${
                isLoading ? 'animate-spin text-blue-400' : ''
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('https://en.m.wikipedia.org/wiki/Smart_TV', 'Smart TV - Wikipedia')}
              title="Browser Home"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 hover:text-white"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* Omnibox / URL Address Bar */}
          <form onSubmit={handleSubmit} className="flex-1 flex items-center relative">
            <div className="absolute left-3.5 flex items-center gap-2 pointer-events-none text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search Google or enter TV website URL (https://...)"
              className="w-full pl-10 pr-24 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all font-mono"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 shadow-md shadow-blue-600/30"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Go</span>
              </button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddBookmark}
              title="Add to Bookmarks"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 hover:text-amber-400"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowHistoryModal(true)}
              title="Browsing History"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 hover:text-white"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenExternal}
              title="Open in Native Browser Tab"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Tab</span>
            </button>
          </div>
        </div>

        {/* Bookmarks Shelf */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] pl-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-blue-400" />
            Favorites:
          </span>
          {bookmarks.map((bm) => (
            <button
              key={bm.id}
              onClick={() => navigateTo(bm.url, bm.title)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                activeUrl === bm.url
                  ? 'bg-blue-600/20 border-blue-500/60 text-blue-300'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              <span>{bm.icon}</span>
              <span>{bm.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Browser Viewport */}
      <div className="relative flex-1 mt-3 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
        {/* Loading progress bar */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden z-20">
            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 w-full animate-pulse" />
          </div>
        )}

        {/* If domain blocks iframe, show helpful Smart TV bridge banner */}
        {isIframeBlockedNotice ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/10">
              <ShieldCheck className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Website Protection: Direct TV Launch
            </h2>
            <p className="text-slate-400 max-w-xl text-sm mb-6 leading-relaxed">
              <span className="font-semibold text-slate-200">{activeUrl}</span> specifies{' '}
              <code className="bg-slate-800 px-2 py-0.5 rounded text-xs text-amber-300">
                X-Frame-Options: SAMEORIGIN
              </code>{' '}
              to safeguard user cookies & security. In accordance with Smart TV standards, you can launch its full interactive web experience in a secure standalone window.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleOpenExternal}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-semibold rounded-xl flex items-center gap-2 shadow-xl shadow-blue-600/30"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch {activeTitle || 'Website'}</span>
              </button>
              <button
                onClick={() => navigateTo('https://en.m.wikipedia.org/wiki/Smart_TV', 'Smart TV - Wikipedia')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 font-semibold rounded-xl flex items-center gap-2 border border-slate-700"
              >
                <Globe className="w-4 h-4" />
                <span>Return to Embeddable Site</span>
              </button>
            </div>

            {/* Quick Suggestions for TV */}
            <div className="mt-12 border-t border-slate-800/80 pt-6 max-w-2xl w-full">
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-3">
                Try these TV-friendly embedded portals:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                {[
                  { name: 'Wikipedia', desc: 'World Encyclopedia', url: 'https://en.m.wikipedia.org' },
                  { name: 'Internet Archive', desc: 'Classic Media & Software', url: 'https://archive.org' },
                  { name: 'Hacker News', desc: 'Tech & Startup News', url: 'https://news.ycombinator.com' },
                  { name: 'W3C Specs', desc: 'Web Standards', url: 'https://www.w3.org' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigateTo(item.url, item.name)}
                    className="p-3 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl transition-all text-left"
                  >
                    <div className="font-semibold text-white text-xs">{item.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={activeUrl}
            title="Android 17 TV Virtual Browser"
            className="w-full h-full border-0 bg-white"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onError={() => setIsIframeBlockedNotice(true)}
          />
        )}
      </div>

      {/* History Drawer Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Browsing History</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2">
              {recentHistory.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    navigateTo(item);
                    setShowHistoryModal(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 cursor-pointer border border-slate-700/40 transition-all text-left"
                >
                  <div className="truncate flex-1 pr-3">
                    <div className="text-sm font-medium text-white truncate">{item}</div>
                    <div className="text-xs text-slate-500 truncate">{new URL(item).hostname}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => {
                  soundEffects.playSelect();
                  setRecentHistory([]);
                }}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                Clear History
              </button>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
