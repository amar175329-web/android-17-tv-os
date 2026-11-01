import React, { useState, useEffect, useRef } from 'react';
import { NavTab, TVApp, MediaItem, GameItem, SystemSettings, UserProfile, OSNotification } from './types/os';
import { storageService } from './services/storage';
import { tvSounds } from './services/sound';
import { useTVNavigation } from './hooks/useTVNavigation';
import { initialApps } from './data/defaultApps';
import { catalogMovies } from './data/catalogMovies';
import { catalogGames } from './data/catalogGames';

// Overlays & Components
import { BootSequence } from './components/os/BootSequence';
import { StatusBar } from './components/os/StatusBar';
import { TopNav } from './components/os/TopNav';
import { RemoteOverlay } from './components/os/RemoteOverlay';
import { SearchOverlay } from './components/os/SearchOverlay';
import { QuickSettingsModal } from './components/os/QuickSettingsModal';
import { NotificationCenter } from './components/os/NotificationCenter';
import { Screensaver } from './components/os/Screensaver';
import { SleepMode } from './components/os/SleepMode';
import { ProfileModal } from './components/os/ProfileModal';
import { AndroidEasterEgg } from './components/os/AndroidEasterEgg';
import { OrientationPrompt } from './components/os/OrientationPrompt';
import { VideoPlayerModal } from './components/media/VideoPlayerModal';

// Mini-Games
import { SnakeGame } from './components/games/SnakeGame';
import { Game2048 } from './components/games/Game2048';
import { SpaceShooterGame } from './components/games/SpaceShooterGame';

// Views
import { HomeView } from './views/HomeView';
import { AppsView } from './views/AppsView';
import { AppStoreView } from './views/AppStoreView';
import { MoviesView } from './views/MoviesView';
import { TVShowsView } from './views/TVShowsView';
import { GamesView } from './views/GamesView';
import { MusicView } from './views/MusicView';
import { LibraryView } from './views/LibraryView';
import { FileManagerView } from './views/FileManagerView';
import { BrowserView } from './views/BrowserView';
import { SettingsView } from './views/SettingsView';

export const App: React.FC = () => {
  // OS State
  const [isBooting, setIsBooting] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [settings, setSettings] = useState<SystemSettings>(() => storageService.getSettings());
  const [profiles, setProfiles] = useState<UserProfile[]>(() => storageService.getProfiles());
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(() => storageService.getActiveProfile());
  const [apps, setApps] = useState<TVApp[]>(() => storageService.getApps());
  const [watchlist, setWatchlist] = useState<string[]>(() => storageService.getWatchlist());
  const [notifications, setNotifications] = useState<OSNotification[]>(() => storageService.getNotifications());

  // Overlays State
  const [remoteOpen, setRemoteOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profilesOpen, setProfilesOpen] = useState(false);
  const [screensaverActive, setScreensaverActive] = useState(false);
  const [sleepModeActive, setSleepModeActive] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);

  // Active Media & Game state
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // App Store sub-view toggle inside Apps tab
  const [showAppStoreDirect, setShowAppStoreDirect] = useState(false);

  // Idle timer for automatic screensaver
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = () => {
    if (screensaverActive) return;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    const timeoutSeconds = settings.screensaverTimeout || 180;
    if (timeoutSeconds === 0) return; // Never screensaver

    idleTimerRef.current = setTimeout(() => {
      if (!activeVideo && !activeGameId && !isBooting && !sleepModeActive) {
        setScreensaverActive(true);
      }
    }, timeoutSeconds * 1000);
  };

  useEffect(() => {
    const handleActivity = () => resetIdleTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [settings.screensaverTimeout, activeVideo, activeGameId, isBooting, sleepModeActive, screensaverActive]);

  // Synchronize sound effects enabled state
  useEffect(() => {
    tvSounds.setEnabled(settings.soundFxEnabled);
  }, [settings.soundFxEnabled]);

  // Hardware TV Navigation Handlers
  useTVNavigation({
    onUp: () => tvSounds.playNavigate(),
    onDown: () => tvSounds.playNavigate(),
    onLeft: () => tvSounds.playNavigate(),
    onRight: () => tvSounds.playNavigate(),
    onSelect: () => tvSounds.playSelect(),
    onBack: () => {
      tvSounds.playBack();
      if (activeVideo) {
        setActiveVideo(null);
      } else if (activeGameId) {
        setActiveGameId(null);
      } else if (searchOpen) {
        setSearchOpen(false);
      } else if (quickSettingsOpen) {
        setQuickSettingsOpen(false);
      } else if (notificationsOpen) {
        setNotificationsOpen(false);
      } else if (profilesOpen) {
        setProfilesOpen(false);
      } else if (remoteOpen) {
        setRemoteOpen(false);
      } else if (easterEggActive) {
        setEasterEggActive(false);
      } else if (showAppStoreDirect) {
        setShowAppStoreDirect(false);
      } else if (activeTab !== 'home') {
        setActiveTab('home');
      }
    },
    onHome: () => {
      tvSounds.playSelect();
      setActiveVideo(null);
      setActiveGameId(null);
      setSearchOpen(false);
      setQuickSettingsOpen(false);
      setNotificationsOpen(false);
      setProfilesOpen(false);
      setEasterEggActive(false);
      setShowAppStoreDirect(false);
      setActiveTab('home');
    },
    onToggleSearch: () => setSearchOpen(true),
    onToggleRemote: () => setRemoteOpen((prev) => !prev),
    onToggleQuickSettings: () => setQuickSettingsOpen((prev) => !prev),
    onVolumeUp: () => {
      const nextVol = Math.min(100, settings.volume + 5);
      handleUpdateSettings({ volume: nextVol, isMuted: false });
      tvSounds.playVolumeTick(nextVol);
    },
    onVolumeDown: () => {
      const nextVol = Math.max(0, settings.volume - 5);
      handleUpdateSettings({ volume: nextVol, isMuted: nextVol === 0 });
      tvSounds.playVolumeTick(nextVol);
    },
    onMute: () => {
      const nextVol = settings.volume === 0 ? 50 : 0;
      handleUpdateSettings({ volume: nextVol, isMuted: nextVol === 0 });
      tvSounds.playVolumeTick(nextVol);
    },
  });

  // Settings update handler
  const handleUpdateSettings = (newPartial: Partial<SystemSettings>) => {
    const updated = { ...settings, ...newPartial };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  // Watchlist toggle handler
  const handleToggleWatchlist = (mediaId: string) => {
    tvSounds.playSelect();
    let updated: string[];
    if (watchlist.includes(mediaId)) {
      updated = watchlist.filter((id) => id !== mediaId);
    } else {
      updated = [mediaId, ...watchlist];
    }
    setWatchlist(updated);
    storageService.saveWatchlist(updated);
  };

  // Pin/Unpin App Handler
  const handleTogglePin = (appId: string) => {
    tvSounds.playSelect();
    const updated = apps.map((a) => (a.id === appId ? { ...a, isPinned: !a.isPinned } : a));
    setApps(updated);
    storageService.saveApps(updated);
  };

  // Favourite App Handler
  const handleToggleFavourite = (appId: string) => {
    tvSounds.playSelect();
    const updated = apps.map((a) => (a.id === appId ? { ...a, isFavourite: !a.isFavourite } : a));
    setApps(updated);
    storageService.saveApps(updated);
  };

  // Install App Handler
  const handleInstallApp = (appId: string) => {
    tvSounds.playSelect();
    const updated = apps.map((a) => (a.id === appId ? { ...a, isInstalled: true } : a));
    setApps(updated);
    storageService.saveApps(updated);

    // Push notification
    const installedApp = apps.find((a) => a.id === appId);
    if (installedApp) {
      const newNotif: OSNotification = {
        id: Date.now().toString(),
        title: 'App Installed Successfully',
        message: `${installedApp.name} is now available on your Android 17 TV.`,
        time: 'Just now',
        icon: 'Download',
        isRead: false,
        type: 'app',
      };
      const notifs = [newNotif, ...notifications];
      setNotifications(notifs);
      storageService.saveNotifications(notifs);
    }
  };

  // Uninstall App Handler
  const handleUninstallApp = (appId: string) => {
    tvSounds.playSelect();
    const updated = apps.map((a) => (a.id === appId ? { ...a, isInstalled: false, isPinned: false } : a));
    setApps(updated);
    storageService.saveApps(updated);
  };

  // Open App Handler
  const handleOpenApp = (app: TVApp) => {
    tvSounds.playSelect();

    if (app.id === 'games' || app.category === 'games') {
      setActiveTab('games');
      return;
    }

    if (app.internalView) {
      switch (app.internalView) {
        case 'files':
          setActiveTab('files');
          return;
        case 'browser':
          setActiveTab('browser');
          return;
        case 'settings':
          setActiveTab('settings');
          return;
        case 'music':
          setActiveTab('music');
          return;
        case 'games':
          setActiveTab('games');
          return;
        case 'movies':
          setActiveTab('movies');
          return;
        case 'shows':
          setActiveTab('shows');
          return;
        default:
          break;
      }
    }

    if (app.id === 'playstore') {
      setShowAppStoreDirect(true);
      setActiveTab('apps');
      return;
    }

    if (app.launchUrl) {
      window.open(app.launchUrl, '_blank', 'noopener,noreferrer');
      return;
    }
  };

  // Media Playback handler
  const handlePlayMedia = (item: MediaItem) => {
    tvSounds.playSelect();
    setActiveVideo(item);
  };

  // Game Launcher handler
  const handleLaunchGame = (game: GameItem) => {
    tvSounds.playSelect();
    setActiveGameId(game.gameType);
  };

  // Boot sequence complete
  const handleBootComplete = () => {
    setIsBooting(false);
  };

  // Restart virtual OS
  const handleRestart = () => {
    tvSounds.playPower();
    setIsBooting(true);
    setActiveTab('home');
    setActiveVideo(null);
    setActiveGameId(null);
    setScreensaverActive(false);
    setSleepModeActive(false);
  };

  // Sleep mode wake
  const handleWakeFromSleep = () => {
    tvSounds.playPower();
    setSleepModeActive(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans select-none overflow-x-hidden flex flex-col">
      {/* Dynamic Background Wallpaper with Blur & Cinematic Vignette */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 -z-10 scale-105"
        style={{
          backgroundImage: `url(${settings.wallpaper || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop'})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70 backdrop-blur-md" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-black/80" />
      </div>

      {/* Mobile Orientation Helper Banner */}
      <OrientationPrompt />

      {/* Top TV Bar: Nav Tabs + Status Tray */}
      <header className="sticky top-0 z-30 px-6 pt-4 pb-2 flex flex-col md:flex-row items-center justify-between gap-3 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent backdrop-blur-sm">
        <TopNav currentTab={activeTab} onSelectTab={(tab) => {
          setShowAppStoreDirect(false);
          setActiveTab(tab);
        }} />

        <StatusBar
          activeProfile={currentProfile}
          notifications={notifications}
          wifiConnected={settings.wifiEnabled}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenQuickSettings={() => setQuickSettingsOpen(true)}
          onOpenProfileModal={() => setProfilesOpen(true)}
          onToggleRemote={() => setRemoteOpen((prev) => !prev)}
          isRemoteOpen={remoteOpen}
        />
      </header>

      {/* Main View Display */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto pb-8">
        {/* Home Screen View */}
        {activeTab === 'home' && (
          <HomeView
            movies={catalogMovies}
            apps={apps}
            games={catalogGames}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onPlayMedia={handlePlayMedia}
            onOpenApp={handleOpenApp}
            onOpenGame={handleLaunchGame}
          />
        )}

        {/* Apps Screen View */}
        {activeTab === 'apps' && (
          showAppStoreDirect ? (
            <AppStoreView
              apps={apps}
              onInstallApp={handleInstallApp}
              onUninstallApp={handleUninstallApp}
              onBack={() => setShowAppStoreDirect(false)}
            />
          ) : (
            <AppsView
              apps={apps}
              onOpenApp={handleOpenApp}
              onTogglePin={handleTogglePin}
              onToggleFavourite={handleToggleFavourite}
              onUninstallApp={handleUninstallApp}
              onOpenAppStore={() => setShowAppStoreDirect(true)}
            />
          )
        )}

        {/* Movies Screen View */}
        {activeTab === 'movies' && (
          <MoviesView
            movies={catalogMovies}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onPlayMovie={handlePlayMedia}
          />
        )}

        {/* TV Series Screen View */}
        {activeTab === 'shows' && (
          <TVShowsView
            shows={catalogMovies}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onPlayShow={handlePlayMedia}
          />
        )}

        {/* Games Screen View */}
        {activeTab === 'games' && (
          <GamesView
            games={catalogGames}
            onLaunchGame={handleLaunchGame}
          />
        )}

        {/* Music Player View */}
        {activeTab === 'music' && (
          <MusicView />
        )}

        {/* Library & Watchlist View */}
        {activeTab === 'library' && (
          <LibraryView
            watchlistIds={watchlist}
            allMovies={catalogMovies}
            installedApps={apps.filter((a) => a.isInstalled)}
            onPlayMedia={handlePlayMedia}
            onRemoveFromWatchlist={handleToggleWatchlist}
            onOpenApp={handleOpenApp}
          />
        )}

        {/* File Manager View */}
        {activeTab === 'files' && (
          <FileManagerView
            onPlayMedia={handlePlayMedia}
          />
        )}

        {/* Web Browser View */}
        {activeTab === 'browser' && (
          <BrowserView />
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onTriggerEasterEgg={() => setEasterEggActive(true)}
            onTriggerRestart={handleRestart}
            onTriggerSleep={() => setSleepModeActive(true)}
            onTriggerScreensaver={() => setScreensaverActive(true)}
            onOpenProfiles={() => setProfilesOpen(true)}
            currentProfile={currentProfile}
          />
        )}
      </main>

      {/* Floating Interactive TV Remote Control */}
      <RemoteOverlay
        isOpen={remoteOpen}
        onClose={() => setRemoteOpen(false)}
        onUp={() => tvSounds.playNavigate()}
        onDown={() => tvSounds.playNavigate()}
        onLeft={() => tvSounds.playNavigate()}
        onRight={() => tvSounds.playNavigate()}
        onSelect={() => tvSounds.playSelect()}
        onBack={() => {
          tvSounds.playBack();
          if (activeVideo) setActiveVideo(null);
          else if (activeGameId) setActiveGameId(null);
          else if (activeTab !== 'home') setActiveTab('home');
        }}
        onHome={() => {
          tvSounds.playSelect();
          setActiveVideo(null);
          setActiveGameId(null);
          setActiveTab('home');
        }}
        onMenu={() => setQuickSettingsOpen((prev) => !prev)}
        onVolumeUp={() => {
          const nextVol = Math.min(100, settings.volume + 5);
          handleUpdateSettings({ volume: nextVol, isMuted: false });
          tvSounds.playVolumeTick(nextVol);
        }}
        onVolumeDown={() => {
          const nextVol = Math.max(0, settings.volume - 5);
          handleUpdateSettings({ volume: nextVol, isMuted: nextVol === 0 });
          tvSounds.playVolumeTick(nextVol);
        }}
        onMute={() => {
          const nextVol = settings.volume === 0 ? 50 : 0;
          handleUpdateSettings({ volume: nextVol, isMuted: nextVol === 0 });
          tvSounds.playVolumeTick(nextVol);
        }}
        onPower={() => {
          tvSounds.playPower();
          setSleepModeActive(true);
          setRemoteOpen(false);
        }}
        onLaunchApp={(appId) => {
          const target = apps.find((a) => a.id === appId);
          if (target) handleOpenApp(target);
        }}
      />

      {/* Universal Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        apps={apps}
        movies={catalogMovies}
        games={catalogGames}
        onOpenApp={handleOpenApp}
        onOpenMedia={handlePlayMedia}
        onOpenGame={handleLaunchGame}
        onOpenSettings={() => {
          setSearchOpen(false);
          setActiveTab('settings');
        }}
      />

      {/* Quick Settings (Control Center) Modal */}
      <QuickSettingsModal
        isOpen={quickSettingsOpen}
        onClose={() => setQuickSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenFullSettings={() => {
          setQuickSettingsOpen(false);
          setActiveTab('settings');
        }}
        onTriggerSleep={() => {
          setQuickSettingsOpen(false);
          setSleepModeActive(true);
        }}
        onTriggerScreensaver={() => {
          setQuickSettingsOpen(false);
          setScreensaverActive(true);
        }}
      />

      {/* Notification Center Drawer */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          tvSounds.playSelect();
          const updated = notifications.map((n) => ({ ...n, isRead: true }));
          setNotifications(updated);
          storageService.saveNotifications(updated);
        }}
        onClearAll={() => {
          tvSounds.playSelect();
          setNotifications([]);
          storageService.saveNotifications([]);
        }}
        onDismiss={(id) => {
          const updated = notifications.filter((n) => n.id !== id);
          setNotifications(updated);
          storageService.saveNotifications(updated);
        }}
      />

      {/* Profile Management Modal */}
      <ProfileModal
        isOpen={profilesOpen}
        onClose={() => setProfilesOpen(false)}
        profiles={profiles}
        activeProfileId={currentProfile.id}
        onSelectProfile={(id) => {
          tvSounds.playSelect();
          const found = profiles.find((p) => p.id === id);
          if (found) {
            setCurrentProfile(found);
            storageService.saveActiveProfile(found);
          }
          setProfilesOpen(false);
        }}
        onAddProfile={(newP) => {
          tvSounds.playSelect();
          const updated = [...profiles, newP];
          setProfiles(updated);
          storageService.saveProfiles(updated);
        }}
      />

      {/* Fullscreen Video Player Modal */}
      {activeVideo && (
        <VideoPlayerModal
          media={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {/* Playable Mini-Game Modals */}
      {activeGameId === 'snake' && (
        <SnakeGame onExit={() => setActiveGameId(null)} />
      )}
      {activeGameId === '2048' && (
        <Game2048 onExit={() => setActiveGameId(null)} />
      )}
      {activeGameId === 'shooter' && (
        <SpaceShooterGame onExit={() => setActiveGameId(null)} />
      )}

      {/* Android 17 Easter Egg */}
      <AndroidEasterEgg
        isOpen={easterEggActive}
        onClose={() => setEasterEggActive(false)}
      />

      {/* Ambient Mode Screensaver */}
      {screensaverActive && (
        <Screensaver onWake={() => setScreensaverActive(false)} />
      )}

      {/* TV Sleep Mode (Standby with Pulsing LED) */}
      {sleepModeActive && (
        <SleepMode onWake={handleWakeFromSleep} />
      )}

      {/* Android Boot Animation Sequence */}
      {isBooting && (
        <BootSequence onComplete={handleBootComplete} />
      )}
    </div>
  );
};

export default App;
