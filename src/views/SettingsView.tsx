import React, { useState } from 'react';
import { 
  Wifi, 
  Bluetooth, 
  Tv, 
  Volume2, 
  Grid, 
  HardDrive, 
  Users, 
  Info, 
  RotateCcw, 
  Moon, 
  Sparkles, 
  Sliders, 
  Check, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Smartphone, 
  Laptop, 
  Gamepad2, 
  Speaker,
  Image,
  Power
} from 'lucide-react';
import { SystemSettings, UserProfile } from '../types/os';
import { storageService } from '../services/storage';
import { soundEffects } from '../services/sound';

interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onTriggerEasterEgg: () => void;
  onTriggerRestart: () => void;
  onTriggerSleep: () => void;
  onTriggerScreensaver: () => void;
  onOpenProfiles: () => void;
  currentProfile: UserProfile;
}

type SettingsCategory = 
  | 'network' 
  | 'bluetooth' 
  | 'display' 
  | 'sound' 
  | 'apps' 
  | 'storage' 
  | 'accounts' 
  | 'system';

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onTriggerEasterEgg,
  onTriggerRestart,
  onTriggerSleep,
  onTriggerScreensaver,
  onOpenProfiles,
  currentProfile,
}) => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('system');
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [wifiScanning, setWifiScanning] = useState(false);
  const [bluetoothScanning, setBluetoothScanning] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Simulated Networks
  const [networks, setNetworks] = useState([
    { ssid: 'GoogleFiber_LivingRoom_5G', strength: 95, secure: true, connected: true },
    { ssid: 'Pixel_Hotspot_Pro', strength: 80, secure: true, connected: false },
    { ssid: 'SkyNet_Smart_Mesh', strength: 65, secure: true, connected: false },
    { ssid: 'Guest_WiFi_Free', strength: 40, secure: false, connected: false },
  ]);

  // Simulated Bluetooth Devices
  const [btDevices, setBtDevices] = useState([
    { id: '1', name: 'Sony WH-1000XM5 (Audio)', type: 'audio', connected: true },
    { id: '2', name: 'Xbox Wireless Controller', type: 'controller', connected: true },
    { id: '3', name: 'Sonos Beam Soundbar', type: 'speaker', connected: false },
    { id: '4', name: 'Logitech K400+ TV Keyboard', type: 'input', connected: false },
  ]);

  const WALLPAPERS = [
    { id: 'dark-nebula', name: 'Deep Nebula', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80' },
    { id: 'cyber-mesh', name: 'Cyber Horizon', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80' },
    { id: 'material-flow', name: 'Material Flow 17', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80' },
    { id: 'mountain-night', name: 'Alpine Midnight', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80' },
  ];

  const handleVersionClick = () => {
    soundEffects.playSelect();
    const newCount = easterEggClicks + 1;
    setEasterEggClicks(newCount);
    if (newCount >= 3) {
      setEasterEggClicks(0);
      onTriggerEasterEgg();
    }
  };

  const handleToggleWifi = () => {
    soundEffects.playSelect();
    onUpdateSettings({ wifiEnabled: !settings.wifiEnabled });
  };

  const handleToggleBluetooth = () => {
    soundEffects.playSelect();
    onUpdateSettings({ bluetoothEnabled: !settings.bluetoothEnabled });
  };

  const handleScanWifi = () => {
    soundEffects.playNavigate();
    setWifiScanning(true);
    setTimeout(() => {
      setWifiScanning(false);
    }, 1200);
  };

  const handleConnectWifi = (ssid: string) => {
    soundEffects.playSelect();
    setNetworks((prev) =>
      prev.map((net) => ({
        ...net,
        connected: net.ssid === ssid,
      }))
    );
  };

  const handleToggleBtDevice = (id: string) => {
    soundEffects.playSelect();
    setBtDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, connected: !d.connected } : d))
    );
  };

  const handleResetOS = () => {
    soundEffects.playSelect();
    storageService.resetToDefaults();
    setResetConfirmOpen(false);
    onTriggerRestart();
  };

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[600px] w-full px-6 py-4 animate-fade-in gap-6">
      {/* Left Navigation Sidebar */}
      <div className="w-72 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-3 flex flex-col gap-1.5 shadow-2xl">
        <div className="px-4 py-3 border-b border-slate-800/80 mb-2">
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-blue-400" />
            <span>Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Android 17 TV OS Concept</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {[
            { id: 'network', label: 'Network & Internet', icon: Wifi, badge: settings.wifiEnabled ? 'Online' : 'Off' },
            { id: 'bluetooth', label: 'Bluetooth & Remotes', icon: Bluetooth, badge: settings.bluetoothEnabled ? '2 Active' : 'Off' },
            { id: 'display', label: 'Display & Sound Ambient', icon: Tv, badge: '4K HDR' },
            { id: 'sound', label: 'Sound & Audio Outputs', icon: Volume2, badge: `${settings.volume}%` },
            { id: 'apps', label: 'Apps & Permissions', icon: Grid, badge: '16 Installed' },
            { id: 'storage', label: 'Storage & Memory', icon: HardDrive, badge: '18.4 GB Free' },
            { id: 'accounts', label: 'Accounts & Profiles', icon: Users, badge: currentProfile.name },
            { id: 'system', label: 'System & About', icon: Info, badge: 'Android 17' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEffects.playNavigate();
                  setActiveCategory(item.id as SettingsCategory);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all text-left group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      isActive ? 'bg-blue-800/80 text-blue-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Restart/Power Row at bottom of Sidebar */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playSelect();
              onTriggerSleep();
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>Sleep</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playSelect();
              onTriggerRestart();
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-y-auto">
        {/* Network & Internet */}
        {activeCategory === 'network' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-2xl font-bold text-white">Network & Internet</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Virtual Wi-Fi connection and simulated network connectivity
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.wifiEnabled}
                  onChange={handleToggleWifi}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.wifiEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Available Wi-Fi Networks
                  </span>
                  <button
                    onClick={handleScanWifi}
                    disabled={wifiScanning}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${wifiScanning ? 'animate-spin' : ''}`} />
                    <span>{wifiScanning ? 'Scanning...' : 'Scan Networks'}</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {networks.map((net) => (
                    <div
                      key={net.ssid}
                      onClick={() => handleConnectWifi(net.ssid)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        net.connected
                          ? 'bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/5'
                          : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            net.connected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Wifi className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm flex items-center gap-2">
                            <span>{net.ssid}</span>
                            {net.connected && (
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                Connected
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Signal: {net.strength}% • {net.secure ? 'WPA3 Personal (Encrypted)' : 'Open'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {net.connected ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 hover:text-blue-400">
                            Connect
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Network diagnostics specs */}
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="font-semibold text-slate-300">Simulated IP & Hardware Config</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-400">
                    <div>
                      <span className="text-slate-500">IPv4:</span> 192.168.1.117
                    </div>
                    <div>
                      <span className="text-slate-500">Gateway:</span> 192.168.1.1
                    </div>
                    <div>
                      <span className="text-slate-500">Subnet:</span> 255.255.255.0
                    </div>
                    <div>
                      <span className="text-slate-500">DNS:</span> 8.8.8.8, 1.1.1.1
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80">
                <Wifi className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white">Wi-Fi is Turned Off</h4>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
                  Turn on Wi-Fi above to connect to wireless routers and stream live media.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bluetooth & Remotes */}
        {activeCategory === 'bluetooth' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-2xl font-bold text-white">Bluetooth & Remotes</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Pair gamepads, audio headphones, keyboards, and Smart TV remotes
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.bluetoothEnabled}
                  onChange={handleToggleBluetooth}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.bluetoothEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Paired Devices
                  </span>
                  <button
                    onClick={() => {
                      soundEffects.playNavigate();
                      setBluetoothScanning(true);
                      setTimeout(() => setBluetoothScanning(false), 1500);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${bluetoothScanning ? 'animate-spin' : ''}`} />
                    <span>{bluetoothScanning ? 'Searching Accessories...' : 'Pair New Accessory'}</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {btDevices.map((dev) => (
                    <div
                      key={dev.id}
                      onClick={() => handleToggleBtDevice(dev.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        dev.connected
                          ? 'bg-blue-600/15 border-blue-500/60'
                          : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            dev.connected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {dev.type === 'controller' ? (
                            <Gamepad2 className="w-5 h-5" />
                          ) : dev.type === 'speaker' || dev.type === 'audio' ? (
                            <Speaker className="w-5 h-5" />
                          ) : (
                            <Bluetooth className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm flex items-center gap-2">
                            <span>{dev.name}</span>
                            {dev.connected && (
                              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                Connected
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Bluetooth 5.4 Low Latency Audio Profile
                          </div>
                        </div>
                      </div>
                      <div>
                        {dev.connected ? (
                          <span className="text-xs text-red-400 hover:underline">Disconnect</span>
                        ) : (
                          <span className="text-xs text-blue-400 hover:underline">Connect</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80">
                <Bluetooth className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white">Bluetooth is Disabled</h4>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
                  Enable Bluetooth to connect wireless remotes and wireless controllers.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Display & Sound Ambient */}
        {activeCategory === 'display' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-2xl font-bold text-white">Display & Personalization</h3>
              <p className="text-sm text-slate-400 mt-1">
                Resolution, scaling, dynamic wallpapers, and screensaver timeout
              </p>
            </div>

            {/* Display resolution & Scaling */}
            <div className="space-y-4">
              <div className="font-semibold text-white text-sm">Screen Resolution & HDR</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { title: '4K Ultra HD', desc: '3840 x 2160 @ 120Hz', hdr: 'Dolby Vision' },
                  { title: '1440p QHD', desc: '2560 x 1440 @ 120Hz', hdr: 'HDR10+' },
                  { title: '1080p FHD', desc: '1920 x 1080 @ 60Hz', hdr: 'SDR' },
                ].map((mode, i) => (
                  <div
                    key={mode.title}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      i === 0
                        ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-white text-sm">{mode.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{mode.desc}</div>
                    <span className="inline-block mt-2 bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      {mode.hdr}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Wallpapers */}
            <div className="space-y-3">
              <div className="font-semibold text-white text-sm flex items-center justify-between">
                <span>OS Backdrop Artwork</span>
                <span className="text-xs text-slate-400">Applies across Home & Menus</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {WALLPAPERS.map((wp) => (
                  <div
                    key={wp.id}
                    onClick={() => {
                      soundEffects.playSelect();
                      onUpdateSettings({ wallpaper: wp.url });
                    }}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer aspect-video shadow-lg transition-all active:scale-95 ${
                      settings.wallpaper === wp.url ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-transparent hover:border-slate-600'
                    }`}
                  >
                    <img src={wp.url} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-xs font-semibold text-white truncate">{wp.name}</span>
                    </div>
                    {settings.wallpaper === wp.url && (
                      <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1 text-white shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Screensaver trigger & timeout */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-sm">Ambient Mode Screensaver</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Activates after {settings.screensaverTimeout} minutes of TV inactivity
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    soundEffects.playSelect();
                    onTriggerScreensaver();
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all border border-slate-700"
                >
                  Preview Ambient Mode
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sound & Audio */}
        {activeCategory === 'sound' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-2xl font-bold text-white">Sound & Audio Outputs</h3>
              <p className="text-sm text-slate-400 mt-1">
                System synthesizer effects, master volume, and audio spatialization
              </p>
            </div>

            {/* Master Volume */}
            <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white text-sm flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <span>Master Volume</span>
                </div>
                <span className="font-mono text-sm font-bold text-blue-400">{settings.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateSettings({ volume: val });
                  soundEffects.playVolumeTick();
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div>
                <div className="font-semibold text-white text-sm">TV Sound Feedback Effects</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Play subtle Web Audio synthesizer clicks on navigation, back, and selects
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundFxEnabled}
                  onChange={(e) => {
                    soundEffects.playSelect();
                    onUpdateSettings({ soundFxEnabled: e.target.checked });
                  }}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Audio Passthrough */}
            <div className="space-y-3">
              <div className="font-semibold text-white text-sm">Surround Audio Format</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Dolby Atmos / Digital Plus', desc: 'Spatial 7.1.4 3D audio object stream' },
                  { name: 'DTS:X Ultra', desc: 'Dynamic theater-grade multichannel audio' },
                  { name: 'PCM Stereo', desc: 'Uncompressed high-fidelity stereo output' },
                  { name: 'Auto Passthrough (eARC)', desc: 'Direct bitstream to external soundbar' },
                ].map((item, idx) => (
                  <div
                    key={item.name}
                    className={`p-3.5 rounded-2xl border cursor-pointer ${
                      idx === 0
                        ? 'bg-blue-600/15 border-blue-500/60'
                        : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-semibold text-white text-xs">{item.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Apps & Permissions */}
        {activeCategory === 'apps' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-2xl font-bold text-white">Apps & Permissions</h3>
              <p className="text-sm text-slate-400 mt-1">
                Virtual storage allocation and individual application permissions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase">Installed Catalog</div>
                <div className="text-2xl font-bold text-white mt-1">16 TV Apps</div>
                <div className="text-xs text-blue-400 mt-1">All up to date (Android 17 API 36)</div>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase">App Cache Size</div>
                <div className="text-2xl font-bold text-white mt-1">248 MB</div>
                <button
                  onClick={() => soundEffects.playSelect()}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold mt-1"
                >
                  Clear All App Caches
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-white text-sm">System App Permissions</div>
              {[
                { name: 'Microphone & Voice Search', status: 'Allowed for TV Remote Assistant', allowed: true },
                { name: 'Storage & Media Library', status: 'Full Read/Write via IndexedDB', allowed: true },
                { name: 'Picture-in-Picture (PiP)', status: 'Allowed for Video Player', allowed: true },
                { name: 'Gamepad Controller Input', status: 'Allowed for Playable Mini-Games', allowed: true },
              ].map((perm) => (
                <div
                  key={perm.name}
                  className="flex items-center justify-between p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50"
                >
                  <div>
                    <div className="font-semibold text-white text-xs">{perm.name}</div>
                    <div className="text-[11px] text-slate-400">{perm.status}</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Granted
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storage & Memory */}
        {activeCategory === 'storage' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-2xl font-bold text-white">Storage & Memory</h3>
              <p className="text-sm text-slate-400 mt-1">
                Internal flash storage, IndexedDB media cache, and memory stats
              </p>
            </div>

            {/* Storage Progress */}
            <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-300">Internal Virtual Storage</div>
                  <div className="text-2xl font-bold text-white mt-0.5">
                    13.6 GB <span className="text-sm font-normal text-slate-400">used of 32.0 GB</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-emerald-400 font-bold">18.4 GB Free</div>
                  <div className="text-[11px] text-slate-400">High-speed UFS 4.0</div>
                </div>
              </div>

              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: '25%' }} className="bg-blue-500 h-full" title="OS & System: 8 GB" />
                <div style={{ width: '10%' }} className="bg-purple-500 h-full" title="Apps: 3.2 GB" />
                <div style={{ width: '5%' }} className="bg-emerald-500 h-full" title="Media & Files: 1.6 GB" />
                <div style={{ width: '3%' }} className="bg-amber-500 h-full" title="Cache: 0.8 GB" />
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs pt-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>System (8.0 GB)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Apps (3.2 GB)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Media (1.6 GB)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Cache (0.8 GB)</span>
                </div>
              </div>
            </div>

            {/* RAM stats */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white text-sm">System Unified Memory (RAM)</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  2.4 GB used of 6.0 GB LPDDR5X • Zero memory pressure
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                Optimal Performance
              </span>
            </div>
          </div>
        )}

        {/* Accounts & Profiles */}
        {activeCategory === 'accounts' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-2xl font-bold text-white">Accounts & Profiles</h3>
              <p className="text-sm text-slate-400 mt-1">
                Manage user profiles, personal watchlists, and kids restrictions
              </p>
            </div>

            <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={currentProfile.avatar}
                  alt={currentProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-xl"
                />
                <div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{currentProfile.name}</span>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                      Primary
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Google TV Linked Account: {currentProfile.name.toLowerCase().replace(/\s+/g, '')}@gmail.com
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  soundEffects.playSelect();
                  onOpenProfiles();
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                Switch / Manage Profiles
              </button>
            </div>
          </div>
        )}

        {/* System & About (With Easter Egg Trigger!) */}
        {activeCategory === 'system' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-2xl font-bold text-white">System & About</h3>
              <p className="text-sm text-slate-400 mt-1">
                Virtual Smart TV build specifications, firmware version, and diagnostics
              </p>
            </div>

            {/* Clickable Android Version Card for Easter Egg */}
            <div
              onClick={handleVersionClick}
              className="p-5 bg-gradient-to-r from-blue-900/30 via-slate-900/80 to-indigo-900/30 rounded-2xl border border-blue-500/40 hover:border-blue-400 transition-all cursor-pointer shadow-xl group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Virtual Firmware Version
                  </span>
                  <div className="text-xl font-bold text-white mt-1 group-hover:text-blue-300 transition-colors flex items-center gap-2">
                    <span>Android 17 TV OS Concept</span>
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Codename: <strong className="text-slate-200">Baklava TV</strong> • Kernel 6.12.0-virtual-a17
                  </div>
                  <div className="text-[11px] text-blue-400/90 mt-2 font-medium">
                    💡 Click here 3 times rapidly to launch the Android 17 Easter Egg!
                  </div>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/30">
                  17
                </div>
              </div>
            </div>

            {/* System Info Table */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="font-semibold text-slate-300 text-sm">Hardware & Virtual Host Specifications</div>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-slate-400">
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>Device Model:</span>
                  <strong className="text-white">Google TV Streamer Ultra (2026)</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>Security Patch:</span>
                  <strong className="text-white">November 1, 2026</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>Build Number:</span>
                  <strong className="text-white font-mono">AP3A.261101.001.A1</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>Renderer Stack:</span>
                  <strong className="text-white">React 19 + Vite + Tailwind v4</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>Persistent Storage:</span>
                  <strong className="text-white">IndexedDB + LocalStorage</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span>Audio Engine:</span>
                  <strong className="text-white">Web Audio Synthesizer</strong>
                </div>
              </div>
            </div>

            {/* Simulated System Actions */}
            <div className="space-y-3 pt-2">
              <div className="font-semibold text-white text-sm">System Operations</div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    soundEffects.playSelect();
                    onTriggerRestart();
                  }}
                  className="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all active:scale-95 group"
                >
                  <RotateCcw className="w-5 h-5 text-blue-400 mb-2 group-hover:rotate-180 transition-transform duration-500" />
                  <div className="font-bold text-white text-xs">Restart Virtual OS</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Replays boot animation</div>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playSelect();
                    onTriggerSleep();
                  }}
                  className="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all active:scale-95 group"
                >
                  <Moon className="w-5 h-5 text-amber-400 mb-2" />
                  <div className="font-bold text-white text-xs">Standby Sleep Mode</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Virtual TV standby LED</div>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playSelect();
                    setResetConfirmOpen(true);
                  }}
                  className="p-4 rounded-2xl bg-red-950/30 hover:bg-red-900/40 border border-red-800/50 text-left transition-all active:scale-95 group"
                >
                  <ShieldAlert className="w-5 h-5 text-red-400 mb-2" />
                  <div className="font-bold text-red-300 text-xs">Factory Reset</div>
                  <div className="text-[11px] text-red-400/80 mt-0.5">Clears custom storage</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Factory Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-900 border border-red-800/60 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <ShieldAlert className="w-7 h-7" />
              <h3 className="text-xl font-bold text-white">Reset Android 17 TV OS?</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              This will restore all virtual operating system preferences, wallpaper, sound toggles, and pinned apps to factory defaults. Your uploaded IndexedDB files will be preserved.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleResetOS}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30"
              >
                Confirm Factory Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
