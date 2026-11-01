import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { tvSounds } from '../../services/sound';

interface Game2048Props {
  onExit: () => void;
}

type Board = number[][];

export const Game2048: React.FC<Game2048Props> = ({ onExit }) => {
  const [board, setBoard] = useState<Board>(() => getInitialBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('tv_game_2048_best') || '0', 10);
  });
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  function getInitialBoard(): Board {
    const b: Board = Array(4).fill(0).map(() => Array(4).fill(0));
    addRandom(b);
    addRandom(b);
    return b;
  }

  function addRandom(b: Board): boolean {
    const empty: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length === 0) return false;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    b[r][c] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  const resetGame = () => {
    setBoard(getInitialBoard());
    setScore(0);
    setWon(false);
    setGameOver(false);
  };

  const move = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameOver) return;

    let hasMoved = false;
    let earnedPoints = 0;
    const newBoard: Board = JSON.parse(JSON.stringify(board));

    const slideRow = (row: number[]) => {
      let filtered = row.filter((val) => val !== 0);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          earnedPoints += filtered[i];
          if (filtered[i] === 2048 && !won) {
            setWon(true);
            confetti({ particleCount: 150, spread: 80 });
          }
          filtered.splice(i + 1, 1);
        }
      }
      while (filtered.length < 4) filtered.push(0);
      return filtered;
    };

    if (direction === 'LEFT') {
      for (let r = 0; r < 4; r++) {
        const next = slideRow(newBoard[r]);
        if (JSON.stringify(next) !== JSON.stringify(newBoard[r])) hasMoved = true;
        newBoard[r] = next;
      }
    } else if (direction === 'RIGHT') {
      for (let r = 0; r < 4; r++) {
        const next = slideRow(newBoard[r].slice().reverse()).reverse();
        if (JSON.stringify(next) !== JSON.stringify(newBoard[r])) hasMoved = true;
        newBoard[r] = next;
      }
    } else if (direction === 'UP') {
      for (let c = 0; c < 4; c++) {
        const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
        const next = slideRow(col);
        for (let r = 0; r < 4; r++) {
          if (newBoard[r][c] !== next[r]) hasMoved = true;
          newBoard[r][c] = next[r];
        }
      }
    } else if (direction === 'DOWN') {
      for (let c = 0; c < 4; c++) {
        const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]].reverse();
        const next = slideRow(col).reverse();
        for (let r = 0; r < 4; r++) {
          if (newBoard[r][c] !== next[r]) hasMoved = true;
          newBoard[r][c] = next[r];
        }
      }
    }

    if (hasMoved) {
      addRandom(newBoard);
      setBoard(newBoard);
      tvSounds.playNavigate();
      setScore((prev) => {
        const next = prev + earnedPoints;
        if (next > bestScore) {
          setBestScore(next);
          localStorage.setItem('tv_game_2048_best', next.toString());
        }
        return next;
      });

      // Check game over
      let canMove = false;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (newBoard[r][c] === 0) canMove = true;
          if (r < 3 && newBoard[r][c] === newBoard[r + 1][c]) canMove = true;
          if (c < 3 && newBoard[r][c] === newBoard[r][c + 1]) canMove = true;
        }
      }
      if (!canMove) {
        setGameOver(true);
        tvSounds.playBack();
      }
    }
  }, [board, gameOver, won, bestScore]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); move('UP'); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); move('DOWN'); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); move('LEFT'); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); move('RIGHT'); }
      else if (e.key === 'Escape' || e.key === 'Backspace') { onExit(); }
      else if (e.key === 'Enter' && gameOver) { resetGame(); }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move, onExit, gameOver]);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-slate-800 text-slate-100 border border-slate-700';
      case 4: return 'bg-sky-900 text-sky-100 border border-sky-700';
      case 8: return 'bg-blue-600 text-white shadow-md shadow-blue-600/40';
      case 16: return 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40';
      case 32: return 'bg-violet-600 text-white shadow-md shadow-violet-600/40';
      case 64: return 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/40';
      case 128: return 'bg-rose-600 text-white shadow-lg shadow-rose-600/50';
      case 256: return 'bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/50';
      case 512: return 'bg-emerald-500 text-black font-black shadow-lg shadow-emerald-500/50';
      case 1024: return 'bg-teal-400 text-black font-black shadow-xl shadow-teal-400/60';
      case 2048: return 'bg-yellow-400 text-black font-black shadow-2xl shadow-yellow-400/80 animate-pulse';
      default: return 'bg-white/5 border border-white/5';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060913]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-lg bg-[#0d1424] border border-blue-500/20 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center gap-2 border border-white/10 focus:ring-2 focus:ring-blue-400"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Exit</span>
            </button>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
              2048 TV Edition
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Trophy className="w-4 h-4" />
              <span>{bestScore}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
              {score}
            </div>
          </div>
        </div>

        {/* 4x4 Board */}
        <div className="relative p-3 bg-black/40 border border-white/10 rounded-2xl shadow-inner grid grid-cols-4 gap-3 w-80 h-80 sm:w-96 sm:h-96">
          {board.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`rounded-xl flex items-center justify-center font-bold text-2xl sm:text-3xl transition-all duration-100 ${getTileColor(
                  val
                )}`}
              >
                {val > 0 ? val : ''}
              </div>
            ))
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4">
              <h3 className="text-2xl font-black text-rose-500 mb-1">NO MORE MOVES</h3>
              <p className="text-slate-300 text-sm mb-4">Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            </div>
          )}
        </div>

        {/* Controls legend */}
        <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
          <span>🎮 D-Pad / Arrows: Slide Tiles</span>
          <span>•</span>
          <span>Back: Exit</span>
        </div>
      </div>
    </div>
  );
};
