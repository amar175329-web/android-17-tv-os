export type GamepadDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'SELECT' | 'BACK' | 'HOME' | 'MENU';

class GamepadService {
  private active = false;
  private animId: number | null = null;
  private listener: ((dir: GamepadDirection) => void) | null = null;
  private lastTrigger = 0;
  private debounceMs = 180;

  start(onAction: (dir: GamepadDirection) => void) {
    this.listener = onAction;
    this.active = true;
    this.poll();
  }

  stop() {
    this.active = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.listener = null;
  }

  private poll = () => {
    if (!this.active) return;
    
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const now = Date.now();

    if (now - this.lastTrigger > this.debounceMs) {
      for (const gp of gamepads) {
        if (!gp) continue;

        // D-pad buttons: 12 (Up), 13 (Down), 14 (Left), 15 (Right)
        // Action buttons: 0 (A / Cross), 1 (B / Circle), 9 (Start / Menu), 16 (Home / Guide)
        if (gp.buttons[12]?.pressed || (gp.axes[1] && gp.axes[1] < -0.5)) {
          this.trigger('UP');
          break;
        } else if (gp.buttons[13]?.pressed || (gp.axes[1] && gp.axes[1] > 0.5)) {
          this.trigger('DOWN');
          break;
        } else if (gp.buttons[14]?.pressed || (gp.axes[0] && gp.axes[0] < -0.5)) {
          this.trigger('LEFT');
          break;
        } else if (gp.buttons[15]?.pressed || (gp.axes[0] && gp.axes[0] > 0.5)) {
          this.trigger('RIGHT');
          break;
        } else if (gp.buttons[0]?.pressed) {
          this.trigger('SELECT');
          break;
        } else if (gp.buttons[1]?.pressed) {
          this.trigger('BACK');
          break;
        } else if (gp.buttons[9]?.pressed) {
          this.trigger('MENU');
          break;
        } else if (gp.buttons[16]?.pressed) {
          this.trigger('HOME');
          break;
        }
      }
    }

    this.animId = requestAnimationFrame(this.poll);
  };

  private trigger(dir: GamepadDirection) {
    this.lastTrigger = Date.now();
    if (this.listener) {
      this.listener(dir);
    }
  }
}

export const gamepadService = new GamepadService();
