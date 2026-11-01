import React, { useState } from 'react';
import { User, Plus, Check, X, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../../types/os';
import { tvSounds } from '../../services/sound';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (newProfile: UserProfile) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: newName.trim(),
      avatar: selectedAvatar,
      themeAccent: '#3b82f6',
      watchlist: [],
      favouriteAppIds: ['youtube', 'browser'],
      recentAppIds: [],
    };
    onAddProfile(newProfile);
    onSelectProfile(newProfile.id);
    setIsCreating(false);
    setNewName('');
    tvSounds.playSelect();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0d1424] border border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black text-white tracking-wide mb-1 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-400" />
          Who's Watching TV?
        </h2>
        <p className="text-xs text-slate-400 mb-8">Select or create your personalized Android 17 TV profile</p>

        {!isCreating ? (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {profiles.map((p) => {
                const isActive = p.id === activeProfileId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      tvSounds.playSelect();
                      onSelectProfile(p.id);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 relative group ${
                      isActive
                        ? 'bg-blue-600/20 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.3)] scale-105'
                        : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/20 group-hover:scale-105 transition-transform"
                    />
                    <div className="text-center">
                      <p className="text-sm font-bold text-white truncate max-w-[120px]">{p.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {p.id === 'user-kids' ? 'Restricted Access' : 'Full OS Access'}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Add Profile Button */}
              <button
                onClick={() => {
                  tvSounds.playNavigate();
                  setIsCreating(true);
                }}
                className="p-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-blue-400/50 bg-white/5 hover:bg-blue-500/10 transition flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold">Add Profile</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Profile Name
              </label>
              <input
                type="text"
                placeholder="e.g. Living Room, Guest, Movie Night"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Choose Avatar
              </label>
              <div className="flex items-center gap-3">
                {AVATAR_PRESETS.map((av, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      tvSounds.playNavigate();
                      setSelectedAvatar(av);
                    }}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition ${
                      selectedAvatar === av ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold tracking-wide transition shadow-lg shadow-blue-600/30"
              >
                Create Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
