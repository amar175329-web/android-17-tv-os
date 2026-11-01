import { GameItem } from '../types/os';

export const catalogGames: GameItem[] = [
  {
    id: 'game-snake',
    title: 'Retro Snake 4K TV',
    category: 'Arcade Classic',
    rating: '4.9 ★',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&auto=format&fit=crop&q=80',
    description: 'The definitive retro arcade snake game re-engineered for the living room. Navigate the grid, feast on quantum fruit, and avoid your growing neon tail using TV D-pad or keyboard arrows.',
    gameType: 'snake',
    players: '1 Player · D-Pad / Controller / Keyboard',
  },
  {
    id: 'game-2048',
    title: '2048: TV Edition',
    category: 'Puzzle Strategy',
    rating: '4.8 ★',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&auto=format&fit=crop&q=80',
    description: 'Slide, combine numbers, and strategize your way to the elusive 2048 tile with smooth TV remote transitions, soothing synth cues, and undo support.',
    gameType: '2048',
    players: '1 Player · D-Pad / Controller',
  },
  {
    id: 'game-shooter',
    title: 'Galaxy Invaders: Cyber Shield',
    category: 'Retro Shoot-em-up',
    rating: '4.9 ★',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=80',
    description: 'Defend planet Earth from waves of descending alien combat drones. Move left and right with D-pad, fire photon torpedoes with OK/Enter, and dodge incoming cluster bombs.',
    gameType: 'shooter',
    players: '1 Player · High Action',
  },
  {
    id: 'game-pong',
    title: 'Cyber Pong: Virtual Duel',
    category: 'Sports Arcade',
    rating: '4.7 ★',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&auto=format&fit=crop&q=80',
    description: 'Fast-paced table tennis battle against the smart virtual TV AI opponent. Perfect your spin angles and speed-up volleys to win the match to 7 points.',
    gameType: 'pong',
    players: '1 vs AI · Responsive',
  }
];
