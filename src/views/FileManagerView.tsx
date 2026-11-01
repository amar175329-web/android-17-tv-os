import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, Upload, Trash2, Film, Music, 
  Image as ImageIcon, FileText, Play, HardDrive, Eye, X 
} from 'lucide-react';
import { StoredMediaFile, MediaItem } from '../types/os';
import { storageService } from '../services/storage';
import { tvSounds } from '../services/sound';

interface FileManagerViewProps {
  onPlayMedia: (item: MediaItem) => void;
}

export const FileManagerView: React.FC<FileManagerViewProps> = ({ onPlayMedia }) => {
  const [files, setFiles] = useState<StoredMediaFile[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const loadFiles = async () => {
    const list = await storageService.getAllFiles();
    setFiles(list);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    Array.from(fileList).forEach((file) => {
      let type: StoredMediaFile['type'] = 'doc';
      if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else if (file.type.startsWith('image/')) type = 'image';

      const reader = new FileReader();
      reader.onload = async () => {
        const stored: StoredMediaFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: file.size,
          type,
          dateAdded: Date.now(),
          dataUrl: reader.result as string,
        };
        await storageService.addFile(stored);
        tvSounds.playNotification();
        loadFiles();
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleDelete = async (id: string) => {
    tvSounds.playBack();
    await storageService.deleteFile(id);
    loadFiles();
  };

  const handleOpenFile = (file: StoredMediaFile) => {
    tvSounds.playSelect();
    if (file.type === 'video') {
      const mediaItem: MediaItem = {
        id: file.id,
        title: file.name,
        subtitle: `Local File · ${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        genre: ['Local Media'],
        rating: 'USER',
        year: new Date().getFullYear(),
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&auto=format&fit=crop&q=80',
        videoUrl: file.dataUrl,
        type: 'movie',
        synopsis: `User-imported local media file: ${file.name}`,
      };
      onPlayMedia(mediaItem);
    } else if (file.type === 'image') {
      setPreviewImage(file.dataUrl || null);
    }
  };

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
  const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);

  const filtered = filterType === 'all'
    ? files
    : files.filter((f) => f.type === filterType);

  const getFileIcon = (t: string) => {
    switch (t) {
      case 'video': return <Film className="w-5 h-5 text-blue-400" />;
      case 'audio': return <Music className="w-5 h-5 text-emerald-400" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-amber-400" />;
      default: return <FileText className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full px-6 sm:px-12 py-6 select-none overflow-x-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-2.5">
            <FolderKanban className="w-7 h-7 text-indigo-400" />
            TV File Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse virtual local storage, import videos, images, and audio via IndexedDB
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition hover:scale-105 active:scale-95">
          <Upload className="w-4 h-4" />
          <span>Import Local Files</span>
          <input
            type="file"
            multiple
            accept="video/*,audio/*,image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Storage Meter Bar */}
      <div className="bg-[#0c1324] border border-white/10 rounded-3xl p-5 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-sky-400" />
            Internal Virtual Storage
          </span>
          <span className="text-xs text-slate-300 font-mono">
            {totalMb} MB used / 128 GB Total
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            style={{ width: `${Math.max(2, Math.min(100, (parseFloat(totalMb) / 128000) * 100))}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6">
        {[
          { id: 'all', label: 'All Files' },
          { id: 'video', label: 'Videos' },
          { id: 'audio', label: 'Audio Tracks' },
          { id: 'image', label: 'Pictures' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              tvSounds.playNavigate();
              setFilterType(tab.id);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Files List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No imported media yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click "Import Local Files" above to add videos, MP3s, or pictures to play on your Smart TV.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((file) => (
            <div
              key={file.id}
              onClick={() => handleOpenFile(file)}
              className="group p-4 rounded-2xl bg-[#0c1324] border border-white/10 hover:border-indigo-400 transition-all flex items-center justify-between cursor-pointer hover:scale-[1.02] shadow-lg"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-indigo-600/20 transition">
                  {getFileIcon(file.type)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                    {file.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · {new Date(file.dateAdded).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file.id);
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 transition"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
