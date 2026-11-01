import { SystemSettings, UserProfile, TVApp, OSNotification, StoredMediaFile } from '../types/os';
import { initialApps } from '../data/defaultApps';

const SETTINGS_KEY = 'android17_tv_settings';
const PROFILES_KEY = 'android17_tv_profiles';
const ACTIVE_PROFILE_KEY = 'android17_tv_active_profile';
const APPS_KEY = 'android17_tv_apps';
const NOTIFICATIONS_KEY = 'android17_tv_notifications';
const RECENT_APPS_KEY = 'android17_tv_recent_apps';
const WATCHLIST_KEY = 'android17_tv_watchlist';
const FIRST_BOOT_KEY = 'android17_tv_booted';

// Default initial settings
export const defaultSettings: SystemSettings = {
  wifiEnabled: true,
  connectedSsid: 'Pixel-Mesh-5GHz',
  availableNetworks: [
    { ssid: 'Pixel-Mesh-5GHz', signal: 95, secured: true },
    { ssid: 'LivingRoom-Fiber-Wi-Fi6', signal: 82, secured: true },
    { ssid: 'SmartHome-IoT', signal: 65, secured: true },
    { ssid: 'AndroidTV-Guest', signal: 45, secured: false },
  ],
  bluetoothEnabled: true,
  pairedDevices: [
    { name: 'Android TV Remote Voice G20', type: 'remote', connected: true },
    { name: 'Sony WH-1000XM5', type: 'audio', connected: false },
    { name: 'Xbox Wireless Controller', type: 'controller', connected: false },
  ],
  displayScaling: 100,
  wallpaper: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop',
  screensaverTimeout: 180, // 3 minutes
  volume: 75,
  isMuted: false,
  soundFxEnabled: true,
  dnd: false,
  airplaneMode: false,
  nightLight: false,
  audioOutput: 'Internal Speakers',
  resolution: '3840 x 2160 (4K UHD 60Hz HDR10+)',
};

// Default User Profiles
export const defaultProfiles: UserProfile[] = [
  {
    id: 'user-primary',
    name: 'Owner Profile',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    themeAccent: '#3b82f6',
    watchlist: ['movie-1', 'movie-3', 'show-1'],
    favouriteAppIds: ['youtube', 'netflix', 'spotify', 'games'],
    recentAppIds: ['youtube', 'browser', 'games'],
  },
  {
    id: 'user-kids',
    name: 'Kids Mode',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    themeAccent: '#10b981',
    watchlist: ['movie-2', 'movie-5'],
    favouriteAppIds: ['disney', 'games', 'photos'],
    recentAppIds: ['disney', 'games'],
  },
];

export const defaultNotifications: OSNotification[] = [
  {
    id: 'notif-1',
    title: 'Android 17 TV OS Ready',
    message: 'Welcome to your next-generation virtual Smart TV experience.',
    time: 'Just now',
    icon: 'Sparkles',
    isRead: false,
    type: 'system',
  },
  {
    id: 'notif-2',
    title: 'New Episode Available',
    message: 'Tears of Steel: Ep 4 is now available in 4K Dolby Atmos.',
    time: '2 hours ago',
    icon: 'Tv',
    isRead: false,
    type: 'media',
  },
  {
    id: 'notif-3',
    title: 'Wi-Fi 6 Connected',
    message: 'Connected to Pixel-Mesh-5GHz with 950 Mbps link speed.',
    time: '5 hours ago',
    icon: 'Wifi',
    isRead: true,
    type: 'system',
  },
];

class StorageService {
  getSettings(): SystemSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  saveSettings(settings: SystemSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }

  getProfiles(): UserProfile[] {
    try {
      const data = localStorage.getItem(PROFILES_KEY);
      return data ? JSON.parse(data) : defaultProfiles;
    } catch {
      return defaultProfiles;
    }
  }

  saveProfiles(profiles: UserProfile[]) {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch {}
  }

  getActiveProfileId(): string {
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || 'user-primary';
  }

  setActiveProfileId(id: string) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  }

  getActiveProfile(): UserProfile {
    const id = this.getActiveProfileId();
    const profiles = this.getProfiles();
    return profiles.find((p) => p.id === id) || profiles[0] || defaultProfiles[0];
  }

  saveActiveProfile(profile: UserProfile) {
    this.setActiveProfileId(profile.id);
  }

  getApps(): TVApp[] {
    try {
      const data = localStorage.getItem(APPS_KEY);
      return data ? JSON.parse(data) : initialApps;
    } catch {
      return initialApps;
    }
  }

  saveApps(apps: TVApp[]) {
    try {
      localStorage.setItem(APPS_KEY, JSON.stringify(apps));
    } catch {}
  }

  getNotifications(): OSNotification[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_KEY);
      return data ? JSON.parse(data) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  }

  saveNotifications(notifs: OSNotification[]) {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
    } catch {}
  }

  getWatchlist(): string[] {
    try {
      const data = localStorage.getItem(WATCHLIST_KEY);
      return data ? JSON.parse(data) : ['movie-1', 'movie-3', 'show-1'];
    } catch {
      return ['movie-1', 'movie-3', 'show-1'];
    }
  }

  saveWatchlist(watchlist: string[]) {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch {}
  }

  isFirstBoot(): boolean {
    return !localStorage.getItem(FIRST_BOOT_KEY);
  }

  setBooted() {
    localStorage.setItem(FIRST_BOOT_KEY, 'true');
  }

  resetToDefaults() {
    try {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(PROFILES_KEY);
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
      localStorage.removeItem(APPS_KEY);
      localStorage.removeItem(NOTIFICATIONS_KEY);
      localStorage.removeItem(WATCHLIST_KEY);
    } catch {}
  }

  // --- IndexedDB for File Manager ---
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open('android17_tv_files', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return this.dbPromise;
  }

  async getAllFiles(): Promise<StoredMediaFile[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction('files', 'readonly');
        const store = tx.objectStore('files');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async addFile(file: StoredMediaFile): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      const req = store.put(file);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async deleteFile(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const storageService = new StorageService();
