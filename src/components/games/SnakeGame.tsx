import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Trophy, ArrowLeft, Play } from 'lucide-react';
import { tvSounds } from '../../services/sound';

interface SnakeGameProps {
  onExit: () => void;
}

const GRID_SIZE = 20;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('tv_game_snake_highscore') || '0', 10);
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const snakeRef = useRef([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const dirRef = useRef({ x: 0, y: -1 });
  const foodRef = useRef({ x: 5, y: 5 });

  const spawnFood = () => {
    const maxX = CANVAS_WIDTH / GRID_SIZE;
    const maxY = CANVAS_HEIGHT / GRID_SIZE;
    foodRef.current = {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    dirRef.current = { x: 0, y: -1 };
    spawnFood();
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          resetGame();
        } else if (e.key === 'Escape' || e.key === 'Backspace') {
          onExit();
        }
        return;
      }

      const { x, y } = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (y === 0) dirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (y === 0) dirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (x === 0) dirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (x === 0) dirRef.current = { x: 1, y: 0 };
          break;
        case 'Escape':
        case 'Backspace':
          onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameOver, onExit]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      const snake = [...snakeRef.current];
      const head = {
        x: snake[0].x + dirRef.current.x,
        y: snake[0].y + dirRef.current.y,
      };

      const maxX = CANVAS_WIDTH / GRID_SIZE;
      const maxY = CANVAS_HEIGHT / GRID_SIZE;

      // Wall collision
      if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) {
        setGameOver(true);
        setIsPlaying(false);
        tvSounds.playBack();
        return;
      }

      // Self collision
      if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        tvSounds.playBack();
        return;
      }

      snake.unshift(head);

      // Eat food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        tvSounds.playSelect();
        setScore((prev) => {
          const next = prev + 10;
          if (next > highScore) {
            setHighScore(next);
            localStorage.setItem('tv_game_snake_highscore', next.toString());
          }
          return next;
        });
        spawnFood();
      } else {
        snake.pop();
      }

      snakeRef.current = snake;

      // Draw
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear with dark TV gradient
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * GRID_SIZE + GRID_SIZE / 2,
        foodRef.current.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2.4,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw Snake
      ctx.shadowBlur = 10;
      snake.forEach((seg, idx) => {
        if (idx === 0) {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
        } else {
          ctx.fillStyle = '#0284c7';
          ctx.shadowColor = '#0284c7';
        }
        ctx.beginPath();
        ctx.roundRect(
          seg.x * GRID_SIZE + 1,
          seg.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2,
          4
        );
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    }, 110);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, highScore]);

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
              <span className="text-sm font-medium">Exit Game</span>
            </button>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              Retro Snake 4K TV
            </h2>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Trophy className="w-4 h-4" />
              <span>High: {highScore}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
              Score: {score}
            </div>
          </div>
        </div>

        {/* Canvas Stage */}
        <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block"
          />

          {gameOver && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-3xl font-black text-rose-500 tracking-wider mb-2">GAME OVER</h3>
              <p className="text-slate-300 mb-6">Final Score: <span className="font-bold text-white text-lg">{score}</span></p>
              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center gap-2 shadow-lg shadow-blue-600/30 focus:ring-2 focus:ring-white"
                >
                  <RotateCcw className="w-4 h-4" />
                  Play Again (Enter)
                </button>
                <button
                  onClick={onExit}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition font-medium focus:ring-2 focus:ring-white"
                >
                  Exit (Back)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls legend */}
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
          <span>🎮 D-Pad / Arrow Keys: Move</span>
          <span>•</span>
          <span>OK / Enter: Restart</span>
          <span>•</span>
          <span>Back / Esc: Exit</span>
        </div>
      </div>
    </div>
  );
};
