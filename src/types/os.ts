export type NavTab = 
  | 'home' 
  | 'apps' 
  | 'movies' 
  | 'shows' 
  | 'games' 
  | 'music' 
  | 'library' 
  | 'settings' 
  | 'files' 
  | 'browser';

export type AppCategory = 
  | 'entertainment' 
  | 'productivity' 
  | 'games' 
  | 'music' 
  | 'utilities' 
  | 'media';

export interface TVApp {
  id: string;
  name: string;
  packageName: string;
  icon: string; // Lucide icon name or image url
  category: AppCategory;
  isInstalled: boolean;
  isSystem: boolean;
  isPinned: boolean;
  isFavourite: boolean;
  rating: number;
  downloads: string;
  description: string;
  screenshots: string[];
  bannerUrl?: string;
  launchUrl?: string; // For external apps like YouTube/Netflix web
  internalView?: NavTab | 'mediacenter' | 'calculator' | 'weather';
  sizeMb: number;
}

export interface MediaItem {
  id: string;
  title: string;
  subtitle?: string;
  duration?: string;
  genre: string[];
  rating: string;
  year: number;
  posterUrl: string;
  backdropUrl: string;
  videoUrl?: string;
  audioUrl?: string;
  type: 'movie' | 'show' | 'music' | 'photo';
  progress?: number; // 0 to 100 percentage
  synopsis: string;
  cast?: string[];
  director?: string;
  matchScore?: number; // e.g. 98% Match
  seasons?: {
    seasonNumber: number;
    episodes: {
      episodeNumber: number;
      title: string;
      duration: string;
      thumbnail: string;
      videoUrl: string;
    }[];
  }[];
}

export interface GameItem {
  id: string;
  title: string;
  category: string;
  rating: string;
  thumbnail: string;
  backdrop: string;
  description: string;
  gameType: 'snake' | '2048' | 'shooter' | 'pong';
  players: string;
}

export interface OSNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  isRead: boolean;
  type: 'system' | 'media' | 'app';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  themeAccent: string;
  watchlist: string[];
  favouriteAppIds: string[];
  recentAppIds: string[];
}

export interface SystemSettings {
  wifiEnabled: boolean;
  connectedSsid: string;
  availableNetworks: { ssid: string; signal: number; secured: boolean }[];
  bluetoothEnabled: boolean;
  pairedDevices: { name: string; type: 'remote' | 'audio' | 'controller'; connected: boolean }[];
  displayScaling: number; // 90 to 110%
  wallpaper: string;
  screensaverTimeout: number; // in seconds (0 = never, 60, 180, 300)
  volume: number; // 0 to 100
  isMuted: boolean;
  soundFxEnabled: boolean;
  dnd: boolean;
  airplaneMode: boolean;
  nightLight: boolean;
  audioOutput: 'Internal Speakers' | 'HDMI eARC Soundbar' | 'Bluetooth Headphones';
  resolution: string;
}

export interface StoredMediaFile {
  id: string;
  name: string;
  size: number;
  type: 'video' | 'audio' | 'image' | 'doc';
  dateAdded: number;
  dataUrl?: string;
  blob?: Blob;
}
