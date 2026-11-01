import React from 'react';
import { 
  Home, Grid, Film, Tv2, Gamepad2, 
  Music, Bookmark, FolderKanban, Globe, Settings 
} from 'lucide-react';
import { NavTab } from '../../types/os';
import { tvSounds } from '../../services/sound';

interface TopNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'apps', label: 'Apps', icon: Grid },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'shows', label: 'TV Shows', icon: Tv2 },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'library', label: 'Library', icon: Bookmark },
    { id: 'files', label: 'Files', icon: FolderKanban },
    { id: 'browser', label: 'Browser', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-full px-6 sm:px-10 py-1.5 overflow-x-auto no-scrollbar z-20">
      <div className="flex items-center gap-1.5 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                tvSounds.playNavigate();
                onSelectTab(tab.id);
              }}
              className={`relative px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center gap-2 select-none outline-none focus:ring-4 focus:ring-blue-400 ${
                isActive
                  ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
