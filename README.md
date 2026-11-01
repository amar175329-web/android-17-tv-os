# Android 17 TV OS — Interactive Smart TV Experience

[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4.5-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Installable-ff007a)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An ultra-modern, cinematic, web-based Smart TV operating system simulator running entirely inside the browser. Built from the ground up to embody the visual language, physics, navigation model, and interactive fidelity of Google TV and the Android 17 ("Baklava TV") concept.

---

## 📺 Live Demo & Deployment

- **Production URL**: [Deployed on Vercel](https://android-17-tv-os.vercel.app)
- **GitHub Repository**: [https://github.com/amar175329-web/android-17-tv-os](https://github.com/amar175329-web/android-17-tv-os)

---

## 🌟 Key Product Features

### 1. Main TV Home Screen
- **Cinematic Hero Shelf**: Featured title (*Tears of Steel: Cyber Rebirth*), 4K Dolby Atmos badges, synopsis, carousel indicators, and direct Play / More Info actions.
- **Horizontal Content Shelves**: Continue Watching, Popular Movies, Trending TV Shows, Pinned Home Apps, and Featured Games with focus glow transitions and smooth horizontal scrolling.

### 2. Complete Apps System & Google Play TV Store
- **16 Pre-Configured TV Applications**: YouTube, Netflix, Prime Video, Disney+, Spotify, Chrome TV, Retro Games Hub, Media Center, TV File Manager, VLC, Twitch, Plex, and Google Photos.
- **App Management**: Install, uninstall, pin to home, mark favourite, and inspect package metadata.
- **App Store Marketplace**: Filter by Entertainment, Productivity, Games, Music, and Utilities with realistic installation progress meters.

### 3. Entertainment Hub (Movies & TV Series)
- **4K HDR Video Player**: Full OSD controls, seekbar scrub, 10s skip forward/backward, Picture-in-Picture (PiP), subtitles toggle, and full-screen support using high-bitrate Creative Commons sample streams.
- **Genre Filters**: Filter catalog movies and multi-season TV shows.
- **Personal Watchlist**: Bookmark movies or episodes to your personal Library with LocalStorage persistence.

### 4. Playable TV Mini-Games
- **Retro Snake 4K**: 60fps retro arcade grid game with D-pad & keyboard arrow controls and high-score memory.
- **2048 TV Edition**: Smooth sliding number tile puzzle with TV sound cues and victory confetti.
- **Space Interceptor**: 2D arcade shooter with laser particle physics, hostile drone waves, shields, and health meters.

### 5. Media Center & Music Player
- **Music Player**: Built-in synthwave audio player featuring animated equalizer frequency bars, album artwork, track queue, and playback controls.
- **File Manager with IndexedDB**: Import and store local videos, images, and audio directly inside browser IndexedDB storage without external server uploads.

### 6. Built-in Web Browser (Chrome TV Concept)
- **Omnibox & Bookmarks Bar**: Fast search, Wikipedia, Internet Archive, Hacker News, and GitHub shortcuts.
- **Smart TV Iframe Bridge**: Seamlessly detects domains protected by `X-Frame-Options` and provides 1-tap direct window launching.

### 7. TV Settings Application
- **Network & Internet**: Simulated Wi-Fi 6 toggle, active signal strength, network scanner, and IP configuration.
- **Bluetooth & Remotes**: Simulated discovery and pairing with wireless controllers, Sony WH-1000XM5 headphones, and soundbars.
- **Display & Wallpapers**: Switch dynamic backdrops (Deep Nebula, Cyber Horizon, Material Flow, Alpine Midnight) and customize screen scaling.
- **Audio Synthesizer**: Web Audio API synthesizer for native TV sounds (navigation clicks, chimes, back sound, volume ticks, and power sweeps).
- **System & About**: Android 17 TV OS build specifications and an interactive **Android 17 Easter Egg** (triple-click firmware version to trigger).
- **Factory Reset**: Restore virtual OS preferences to defaults with safety confirmation.

### 8. System Overlays & Ambient Experience
- **Interactive Floating Remote Control**: Realistic Android TV remote overlay with D-pad, OK, Back, Home, Menu, Volume +/-, Mute, Power, and dedicated app shortcuts.
- **Universal Search**: On-screen TV keyboard, voice search simulation, and multi-category instant search.
- **Control Center (Quick Settings)**: Fast toggles for Wi-Fi, Bluetooth, DND, Night Light, Screen Cast, Sound FX, Volume, Ambient Mode, and Sleep.
- **Notification Center**: Interactive notifications with unread badges, mark all as read, and dismiss.
- **Ambient Screensaver**: Activates on user idle with rotating nature backdrops, clock, date, and live weather widget.
- **Standby Sleep Mode**: Virtual TV standby with pulsating red LED and wake-on-power.
- **Multi-Profile Manager**: Switch between Owner and Kids profiles or create custom family profiles.

---

## 🎮 Navigation & Keyboard Controls

Android 17 TV OS is built to be navigated via **Keyboard**, **Gamepad Controller**, **Mouse/Touch**, or the **Virtual Remote Overlay**:

| Key | TV Remote Action | Function |
|---|---|---|
| **Arrow Up / Down / Left / Right** | D-Pad Navigation | Move focus across cards and shelves |
| **Enter** | OK / Select | Open selected item, play video, launch app |
| **Escape / Backspace** | Back Button | Return to previous view or close active overlay |
| **H** | Home Button | Return immediately to Home Screen |
| **R** | Remote Overlay | Toggle floating virtual TV remote control |
| **S** | Search | Open Universal Search overlay |
| **Q** | Quick Settings | Open Android 17 Control Center |
| **+ / =** | Volume Up | Increase master volume |
| **- / _** | Volume Down | Decrease master volume |
| **M** | Mute | Toggle audio mute |

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects & Confetti**: `canvas-confetti`
- **Audio Engine**: Web Audio API Synthesizer (Zero external audio asset dependencies)
- **Local Storage**: HTML5 LocalStorage (Settings, profiles, watchlist) + IndexedDB (Local media files)
- **PWA**: Web App Manifest (`manifest.json`) with mobile landscape prompt

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/amar175329-web/android-17-tv-os.git

# Enter the project directory
cd android-17-tv-os

# Install dependencies
npm install

# Start the Vite development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📱 Mobile & PWA Usage

1. Open the deployed website on your smartphone.
2. If opened in portrait orientation, an **Orientation Prompt** will advise rotating to landscape for the authentic TV experience.
3. Tap **"Add to Home Screen"** or **"Install App"** in your browser menu to run in borderless standalone full-screen TV mode.

---

## 📄 License & Disclaimer

This project is an independent conceptual design study and interactive simulator inspired by Android TV and Google TV. It is not an official Google product and does not download or execute native Android APK binaries.
