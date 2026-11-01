import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Zap } from 'lucide-react';
import { tvSounds } from '../../services/sound';

interface SpaceShooterGameProps {
  onExit: () => void;
}

const WIDTH = 560;
const HEIGHT = 420;

export const SpaceShooterGame: React.FC<SpaceShooterGameProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('tv_game_shooter_highscore') || '0', 10);
  });
  const [health, setHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);

  const playerRef = useRef({ x: WIDTH / 2 - 20, y: HEIGHT - 55, width: 40, height: 35, speed: 7 });
  const keysRef = useRef<{ left: boolean; right: boolean; shoot: boolean }>({ left: false, right: false, shoot: false });
  const bulletsRef = useRef<{ x: number; y: number }[]>([]);
  const enemiesRef = useRef<{ x: number; y: number; speed: number; size: number }[]>([]);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string }[]>([]);
  const lastShotRef = useRef(0);

  const resetGame = () => {
    playerRef.current.x = WIDTH / 2 - 20;
    bulletsRef.current = [];
    enemiesRef.current = [];
    particlesRef.current = [];
    setScore(0);
    setHealth(100);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        else if (e.key === 'Escape' || e.key === 'Backspace') onExit();
        return;
      }

      if (e.key === 'ArrowLeft') keysRef.current.left = true;
      else if (e.key === 'ArrowRight') keysRef.current.right = true;
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp') keysRef.current.shoot = true;
      else if (e.key === 'Escape' || e.key === 'Backspace') onExit();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysRef.current.left = false;
      else if (e.key === 'ArrowRight') keysRef.current.right = false;
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp') keysRef.current.shoot = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, onExit]);

  useEffect(() => {
    let animId: number;

    const gameLoop = () => {
      if (gameOver) return;

      const player = playerRef.current;

      // Move player
      if (keysRef.current.left && player.x > 10) player.x -= player.speed;
      if (keysRef.current.right && player.x < WIDTH - player.width - 10) player.x += player.speed;

      // Shooting
      const now = Date.now();
      if (keysRef.current.shoot && now - lastShotRef.current > 160) {
        bulletsRef.current.push({ x: player.x + player.width / 2 - 2, y: player.y });
        lastShotRef.current = now;
        tvSounds.playVolumeTick(90);
      }

      // Update bullets
      bulletsRef.current.forEach((b) => (b.y -= 9));
      bulletsRef.current = bulletsRef.current.filter((b) => b.y > -10);

      // Spawn enemies
      if (Math.random() < 0.035) {
        enemiesRef.current.push({
          x: Math.random() * (WIDTH - 40) + 10,
          y: -30,
          speed: Math.random() * 2 + 2,
          size: 26,
        });
      }

      // Update enemies
      enemiesRef.current.forEach((enemy) => (enemy.y += enemy.speed));

      // Bullet - Enemy collisions
      bulletsRef.current.forEach((bullet, bIdx) => {
        enemiesRef.current.forEach((enemy, eIdx) => {
          if (
            bullet.x > enemy.x &&
            bullet.x < enemy.x + enemy.size &&
            bullet.y > enemy.y &&
            bullet.y < enemy.y + enemy.size
          ) {
            // Hit!
            bulletsRef.current.splice(bIdx, 1);
            enemiesRef.current.splice(eIdx, 1);
            tvSounds.playSelect();

            // Spawn particles
            for (let i = 0; i < 10; i++) {
              particlesRef.current.push({
                x: enemy.x + enemy.size / 2,
                y: enemy.y + enemy.size / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 25,
                color: Math.random() < 0.5 ? '#f43f5e' : '#fbbf24',
              });
            }

            setScore((prev) => {
              const next = prev + 50;
              if (next > highScore) {
                setHighScore(next);
                localStorage.setItem('tv_game_shooter_highscore', next.toString());
              }
              return next;
            });
          }
        });
      });

      // Enemy - Player collision or reach bottom
      enemiesRef.current.forEach((enemy, eIdx) => {
        if (enemy.y > HEIGHT) {
          enemiesRef.current.splice(eIdx, 1);
          setHealth((h) => {
            const next = Math.max(0, h - 15);
            if (next <= 0) {
              setGameOver(true);
              tvSounds.playBack();
            }
            return next;
          });
        } else if (
          enemy.x < player.x + player.width &&
          enemy.x + enemy.size > player.x &&
          enemy.y < player.y + player.height &&
          enemy.y + enemy.size > player.y
        ) {
          enemiesRef.current.splice(eIdx, 1);
          setHealth((h) => {
            const next = Math.max(0, h - 25);
            if (next <= 0) {
              setGameOver(true);
              tvSounds.playBack();
            }
            return next;
          });
        }
      });

      // Update particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      // Render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Backdrop
          ctx.fillStyle = '#060a16';
          ctx.fillRect(0, 0, WIDTH, HEIGHT);

          // Stars
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          for (let i = 0; i < 30; i++) {
            ctx.fillRect(
              (i * 97) % WIDTH,
              (i * 123 + (Date.now() / 40) * (i % 3 + 1)) % HEIGHT,
              1.5,
              1.5
            );
          }

          // Draw Player Ship (Stylized Arrow Craft)
          ctx.save();
          ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.moveTo(0, -player.height / 2);
          ctx.lineTo(player.width / 2, player.height / 2);
          ctx.lineTo(0, player.height / 3);
          ctx.lineTo(-player.width / 2, player.height / 2);
          ctx.closePath();
          ctx.fill();

          // Engine glow
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, player.height / 2 + 2, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Draw Bullets
          ctx.fillStyle = '#60a5fa';
          ctx.shadowColor = '#60a5fa';
          ctx.shadowBlur = 10;
          bulletsRef.current.forEach((b) => {
            ctx.fillRect(b.x, b.y, 4, 12);
          });

          // Draw Enemies
          enemiesRef.current.forEach((enemy) => {
            ctx.fillStyle = '#f43f5e';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(enemy.x + enemy.size / 2, enemy.y + enemy.size);
            ctx.lineTo(enemy.x + enemy.size, enemy.y);
            ctx.lineTo(enemy.x, enemy.y);
            ctx.closePath();
            ctx.fill();
          });

          // Draw Particles
          particlesRef.current.forEach((p) => {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameOver, highScore]);

  return (
    <div className="fixed inset-0 z-50 bg-[#060913]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-2xl bg-[#0d1424] border border-blue-500/20 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center gap-2 border border-white/10 focus:ring-2 focus:ring-blue-400"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Exit</span>
            </button>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-sky-400 fill-sky-400" />
              Galaxy Invaders 4K
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Trophy className="w-4 h-4" />
              <span>High: {highScore}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
              Score: {score}
            </div>
          </div>
        </div>

        {/* Shield / Health bar */}
        <div className="w-full max-w-[560px] flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shield:</span>
          <div className="flex-1 h-3 rounded-full bg-black/60 overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-200 ${
                health > 50 ? 'bg-emerald-500' : health > 25 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${health}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-200">{health}%</span>
        </div>

        {/* Canvas Screen */}
        <div className="relative rounded-2xl overflow-hidden border border-sky-500/30 shadow-[0_0_40px_rgba(56,189,248,0.15)]">
          <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="block" />

          {gameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-3xl font-black text-rose-500 mb-2">SHIELD DEPLETED</h3>
              <p className="text-slate-300 text-sm mb-6">Final Score: <span className="text-white font-bold text-lg">{score}</span></p>
              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <RotateCcw className="w-4 h-4" /> Retry (Enter)
                </button>
                <button
                  onClick={onExit}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition font-medium"
                >
                  Exit (Back)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
          <span>🎮 Left / Right: Move</span>
          <span>•</span>
          <span>Space / Enter / Up: Fire Lasers</span>
          <span>•</span>
          <span>Back / Esc: Exit</span>
        </div>
      </div>
    </div>
  );
};
