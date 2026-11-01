import { useEffect } from 'react';
import { gamepadService, GamepadDirection } from '../services/gamepad';
import { tvSounds } from '../services/sound';

interface NavigationHandlers {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onSelect?: () => void;
  onBack?: () => void;
  onHome?: () => void;
  onMenu?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  onMute?: () => void;
  onToggleRemote?: () => void;
  onToggleSearch?: () => void;
  onToggleQuickSettings?: () => void;
}

export function useTVNavigation(handlers: NavigationHandlers, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      switch (e.key) {
        case 'ArrowUp':
          if (!isInput) {
            e.preventDefault();
            tvSounds.playNavigate();
            handlers.onUp?.();
          }
          break;
        case 'ArrowDown':
          if (!isInput) {
            e.preventDefault();
            tvSounds.playNavigate();
            handlers.onDown?.();
          }
          break;
        case 'ArrowLeft':
          if (!isInput) {
            e.preventDefault();
            tvSounds.playNavigate();
            handlers.onLeft?.();
          }
          break;
        case 'ArrowRight':
          if (!isInput) {
            e.preventDefault();
            tvSounds.playNavigate();
            handlers.onRight?.();
          }
          break;
        case 'Enter':
          if (!isInput) {
            e.preventDefault();
            tvSounds.playSelect();
            handlers.onSelect?.();
          }
          break;
        case 'Escape':
        case 'Backspace':
          if (!isInput || e.key === 'Escape') {
            e.preventDefault();
            tvSounds.playBack();
            handlers.onBack?.();
          }
          break;
        case 'h':
        case 'H':
          if (!isInput) {
            handlers.onHome?.();
          }
          break;
        case 'r':
        case 'R':
          if (!isInput) {
            handlers.onToggleRemote?.();
          }
          break;
        case 's':
        case 'S':
          if (!isInput && !e.ctrlKey && !e.metaKey) {
            handlers.onToggleSearch?.();
          }
          break;
        case 'q':
        case 'Q':
          if (!isInput) {
            handlers.onToggleQuickSettings?.();
          }
          break;
        case '+':
        case '=':
          if (!isInput) {
            handlers.onVolumeUp?.();
          }
          break;
        case '-':
        case '_':
          if (!isInput) {
            handlers.onVolumeDown?.();
          }
          break;
        case 'm':
        case 'M':
          if (!isInput) {
            handlers.onMute?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Gamepad controller listener
    gamepadService.start((dir: GamepadDirection) => {
      switch (dir) {
        case 'UP':
          tvSounds.playNavigate();
          handlers.onUp?.();
          break;
        case 'DOWN':
          tvSounds.playNavigate();
          handlers.onDown?.();
          break;
        case 'LEFT':
          tvSounds.playNavigate();
          handlers.onLeft?.();
          break;
        case 'RIGHT':
          tvSounds.playNavigate();
          handlers.onRight?.();
          break;
        case 'SELECT':
          tvSounds.playSelect();
          handlers.onSelect?.();
          break;
        case 'BACK':
          tvSounds.playBack();
          handlers.onBack?.();
          break;
        case 'HOME':
          handlers.onHome?.();
          break;
        case 'MENU':
          handlers.onMenu?.();
          break;
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      gamepadService.stop();
    };
  }, [handlers, enabled]);
}
