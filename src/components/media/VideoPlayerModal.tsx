import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, 
  RotateCcw, RotateCw, ArrowLeft, SkipForward, PictureInPicture, 
  Subtitles, Sparkles 
} from 'lucide-react';
import { MediaItem } from '../../types/os';
import { tvSounds } from '../../services/sound';

interface VideoPlayerModalProps {
  media: MediaItem;
  onClose: () => void;
  onNextEpisode?: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ media, onClose, onNextEpisode }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const hideTimeoutRef = useRef<number | null>(null);

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3500);
  };

  useEffect(() => {
    resetHideTimer();
    const handleMouseMove = () => resetHideTimer();
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      tvSounds.playSelect();
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      tvSounds.playBack();
    }
    resetHideTimer();
  };

  const seek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    tvSounds.playNavigate();
    resetHideTimer();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    tvSounds.playNavigate();
    resetHideTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
    resetHideTimer();
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch {}
    resetHideTimer();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetHideTimer();
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.min(1, v + 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            tvSounds.playVolumeTick(next * 100);
            return next;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.max(0, v - 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            tvSounds.playVolumeTick(next * 100);
            return next;
          });
          break;
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          tvSounds.playBack();
          onClose();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, duration, onClose]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* HTML5 Video */}
      <video
        ref={videoRef}
        src={media.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
        className="w-full h-full object-contain cursor-pointer"
        autoPlay
        playsInline
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            videoRef.current.volume = volume;
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true);
        }}
      />

      {/* Mock Subtitle Track */}
      {showSubtitles && isPlaying && currentTime > 3 && currentTime < 9 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-lg bg-black/75 text-yellow-300 font-medium text-lg sm:text-xl shadow-lg border border-white/10 pointer-events-none animate-in fade-in duration-200">
          "Initiating quantum defense grid... systems nominal."
        </div>
      )}

      {/* Top Gradient & Info Bar */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-300 flex items-center justify-between ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              tvSounds.playBack();
              onClose();
            }}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md border border-white/10 focus:ring-4 focus:ring-blue-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/30 text-blue-300 border border-blue-400/30">
                4K UHD
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Dolby Vision · Atmos
              </span>
              <span className="text-xs text-slate-400">{media.rating}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">{media.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-1">{media.subtitle || media.synopsis}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={togglePiP}
            title="Picture in Picture"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition backdrop-blur-md border border-white/10 focus:ring-4 focus:ring-blue-400"
          >
            <PictureInPicture className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSubtitles(!showSubtitles)}
            title="Subtitles"
            className={`p-3 rounded-2xl transition backdrop-blur-md border border-white/10 focus:ring-4 focus:ring-blue-400 ${
              showSubtitles ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Subtitles className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Gradient & OSD Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-6 sm:p-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Seek Bar */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs sm:text-sm font-mono text-slate-300 w-12 text-right">
            {formatTime(currentTime)}
          </span>
          <div
            className="flex-1 h-3 rounded-full bg-white/20 cursor-pointer relative overflow-hidden group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              if (videoRef.current) {
                videoRef.current.currentTime = pos * duration;
              }
            }}
          >
            <div
              className="h-full bg-blue-500 rounded-full relative transition-all duration-75 group-hover:bg-blue-400"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg scale-0 group-hover:scale-100 transition-transform" />
            </div>
          </div>
          <span className="text-xs sm:text-sm font-mono text-slate-400 w-12">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => seek(-10)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 transition focus:ring-4 focus:ring-blue-400"
              title="Rewind 10s"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/40 transition scale-100 hover:scale-105 focus:ring-4 focus:ring-white"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => seek(10)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 transition focus:ring-4 focus:ring-blue-400"
              title="Forward 10s"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {onNextEpisode && (
              <button
                onClick={onNextEpisode}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 transition flex items-center gap-2 focus:ring-4 focus:ring-blue-400 text-sm font-semibold"
              >
                <SkipForward className="w-5 h-5" />
                <span className="hidden sm:inline">Next Episode</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Volume Control */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl border border-white/10">
              <button onClick={toggleMute} className="text-slate-200 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setIsMuted(false);
                  if (videoRef.current) videoRef.current.volume = val;
                }}
                className="w-16 sm:w-24 accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition focus:ring-4 focus:ring-blue-400"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
