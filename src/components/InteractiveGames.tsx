import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  RotateCcw, 
  Trophy,
  Grid3X3,
  Ghost,
  Loader2,
  Volume2,
  VolumeX,
  Crown,
  Crosshair,
  Clock, // adding clock for sudoku
  Spade,
  Blocks
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { saveScore, getHighScores } from '../firebase';
import { ChessGame } from './ChessGame';
import { getSudoku } from 'sudoku-gen';

import { CardGame29 } from './CardGame29';
import { TetrisGame } from './TetrisGame';

// --- Audio Engine ---
export const playSound = (type: 'click' | 'win' | 'start' | 'eat' | 'die', enabled: boolean) => {
  if (!enabled) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
      
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.3);
    } else if (type === 'start') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'eat') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'die') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Ignore audio errors
  }
};

// --- Leaderboard Components ---
export const Leaderboard = ({ game }: { game: string }) => {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    const data = await getHighScores(game, 5);
    if (data) setScores(data);
    setLoading(false);
  }, [game]);

  useEffect(() => {
    fetchScores();
    const handleRefresh = () => fetchScores();
    window.addEventListener('refresh-leaderboard', handleRefresh);
    return () => window.removeEventListener('refresh-leaderboard', handleRefresh);
  }, [fetchScores]);

  return (
    <div className="mt-8 border-t border-slate-200 dark:border-white/10 pt-6 w-full max-w-sm mx-auto">
      <h3 className="text-lg font-semibold font-display mb-4 text-center">Top Players</h3>
      {loading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-brand-blue" /></div>
      ) : scores.length === 0 ? (
        <p className="text-center text-sm text-slate-500">No scores yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {scores.map((s, i) => (
             <div key={s.id || i} className="flex justify-between items-center bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-lg">
                <span className="font-medium text-sm flex items-center gap-2 truncate">
                  <span className="text-slate-400 w-4">{i + 1}.</span> 
                  <span className="truncate max-w-[120px]">{s.playerName || 'Anonymous'}</span>
                </span>
                <span className="font-bold text-brand-blue dark:text-brand-cyan whitespace-nowrap">
                  {game === 'sudoku' 
                    ? `${Math.floor(s.score / 60)}:${(s.score % 60).toString().padStart(2, '0')}`
                    : `${s.score} ${game === 'memory' ? 'moves' : 'pts'}`
                  }
                </span>
             </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const ScoreSubmitter = ({ game, score, onSubmitted }: { game: string, score: number, onSubmitted: () => void }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await saveScore(game, name.trim(), score);
    setIsSubmitting(false);
    onSubmitted();
    window.dispatchEvent(new Event('refresh-leaderboard'));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 w-full mx-auto" onClick={(e) => e.stopPropagation()}>
      <input 
        type="text" 
        value={name}
        onChange={e => setName(e.target.value.slice(0, 30))}
        placeholder="Enter your name" 
        maxLength={30}
        required
        className="px-3 py-2 rounded-lg bg-white dark:bg-black/20 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-brand-blue outline-none w-full"
      />
      <button 
        type="submit" 
        disabled={isSubmitting || !name.trim()}
        className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-blue/90 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? 'Saving...' : 'Save Score'}
      </button>
    </form>
  )
}

// --- Sudoku Game ---
const SudokuGame = ({ soundEnabled }: { soundEnabled: boolean }) => {
  const [board, setBoard] = useState<string[]>(Array(81).fill(''));
  const [original, setOriginal] = useState<boolean[]>(Array(81).fill(false));
  const [solution, setSolution] = useState<string>('');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);

  // Timer
  useEffect(() => {
    let interval: any;
    if (isPlaying && !isWon) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  const startGame = () => {
    const p = getSudoku('easy');
    const b = p.puzzle.split('').map(c => c === '-' ? '' : c);
    const orig = p.puzzle.split('').map(c => c !== '-');
    setBoard(b);
    setOriginal(orig);
    setSolution(p.solution);
    setSelectedIdx(null);
    setTimer(0);
    setIsWon(false);
    setHasSubmittedScore(false);
    setIsPlaying(true);
    playSound('start', soundEnabled);
  };

  const handleInput = (val: string) => {
    if (!isPlaying || isWon || selectedIdx === null || original[selectedIdx]) return;
    
    const newBoard = [...board];
    newBoard[selectedIdx] = val;
    setBoard(newBoard);
    playSound('click', soundEnabled);

    // Check win
    if (newBoard.join('') === solution) {
      setIsWon(true);
      setIsPlaying(false);
      playSound('win', soundEnabled);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isWon || selectedIdx === null) return;
      if (e.key >= '1' && e.key <= '9') {
        handleInput(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleInput('');
      } else if (e.key === 'ArrowUp' && selectedIdx >= 9) setSelectedIdx(selectedIdx - 9);
      else if (e.key === 'ArrowDown' && selectedIdx < 72) setSelectedIdx(selectedIdx + 9);
      else if (e.key === 'ArrowLeft' && selectedIdx % 9 > 0) setSelectedIdx(selectedIdx - 1);
      else if (e.key === 'ArrowRight' && selectedIdx % 9 < 8) setSelectedIdx(selectedIdx + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isWon, selectedIdx, board]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none">
      {!isPlaying && !isWon ? (
         <div className="w-full flex-col min-h-[300px] flex items-center justify-center p-6 bg-slate-900 border-2 border-slate-700/50 rounded-lg shadow-inner mb-4 relative z-10 text-center">
            <Grid3X3 className="w-8 h-8 text-brand-blue mb-4" />
            <h3 className="text-xl font-bold font-display text-white mb-2">9x9 Sudoku</h3>
            <button onClick={startGame} className="bg-brand-blue text-white px-6 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
               Start Game
            </button>
         </div>
      ) : (
        <>
          <div className="flex justify-between w-full mb-3 px-2 items-center">
            <span className="text-sm font-medium flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4" /> {formatTime(timer)}
            </span>
            <button onClick={startGame} className="text-brand-blue hover:text-brand-cyan flex items-center gap-1 text-sm bg-brand-blue/10 px-3 py-1 rounded-full">
              <RotateCcw className="w-3 h-3" /> Retry
            </button>
          </div>

          <div className="bg-slate-300 dark:bg-slate-700 p-0.5 rounded shadow-lg">
            <div className="grid grid-cols-9 gap-px bg-slate-400 dark:bg-slate-800 border-2 border-slate-500 dark:border-slate-900">
              {board.map((cell, i) => {
                const row = Math.floor(i / 9);
                const col = i % 9;
                const isThickBottom = row === 2 || row === 5;
                const isThickRight = col === 2 || col === 5;
                const isSelected = selectedIdx === i;
                const isOrig = original[i];
                
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedIdx(i)}
                    className={`
                      w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-lg sm:text-xl font-semibold cursor-pointer
                      ${isThickBottom ? 'border-b-2 border-b-slate-500 dark:border-b-slate-900 mb-0.5' : ''}
                      ${isThickRight ? 'border-r-2 border-r-slate-500 dark:border-r-slate-900 mr-0.5' : ''}
                      ${isSelected ? 'bg-brand-blue/30 dark:bg-brand-cyan/30' : 'bg-slate-100 dark:bg-[#1a2333] hover:bg-slate-200 dark:hover:bg-white/5'}
                      ${isOrig ? 'text-slate-800 dark:text-slate-200' : 'text-brand-blue dark:text-brand-cyan'}
                    `}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Number Pad for Mobile */}
          <div className="grid grid-cols-5 gap-2 mt-4 w-full">
             {[1,2,3,4,5,6,7,8,9].map(n => (
               <button key={n} onClick={() => handleInput(String(n))} className="bg-slate-200 dark:bg-white/10 py-2 rounded font-bold hover:bg-slate-300 dark:hover:bg-white/20">
                 {n}
               </button>
             ))}
             <button onClick={() => handleInput('')} className="bg-red-200 text-red-700 dark:bg-red-500/20 dark:text-red-400 py-2 rounded font-bold hover:bg-red-300 dark:hover:bg-red-500/30">
               DEL
             </button>
          </div>

          {isWon && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-col items-center w-full">
              <div className="text-green-500 font-bold flex items-center gap-2 mb-2 text-lg">
                <Trophy className="w-5 h-5" /> Solved in {formatTime(timer)}!
              </div>
              {!hasSubmittedScore ? (
                <ScoreSubmitter 
                  game="sudoku" 
                  score={timer} 
                  onSubmitted={() => setHasSubmittedScore(true)} 
                />
              ) : (
                <div className="text-sm text-brand-blue mt-2 font-medium">Score saved to leaderboard!</div>
              )}
            </motion.div>
          )}

          <Leaderboard game="sudoku" />
        </>
      )}
    </div>
  );
};

// --- Snake Game ---
const GRID_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_FOOD = { x: 3, y: 3 };
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

const SnakeGame = ({ soundEnabled }: { soundEnabled: boolean }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);

  const moveSnake = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y
      };

      // Check collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE || 
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsPlaying(false);
        playSound('die', soundEnabled);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        playSound('eat', soundEnabled);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPlaying, isGameOver]);

  const handleDirection = (newDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    switch (newDir) {
      case 'UP':
        if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'DOWN':
        if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'LEFT':
        if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'RIGHT':
        if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowUp': handleDirection('UP'); break;
        case 'ArrowDown': handleDirection('DOWN'); break;
        case 'ArrowLeft': handleDirection('LEFT'); break;
        case 'ArrowRight': handleDirection('RIGHT'); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [moveSnake]);

  const resetGame = () => {
    playSound('start', soundEnabled);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setHasSubmittedScore(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[240px] mx-auto">
        <div className="flex justify-between w-full mb-4 px-2">
          <span className="text-sm font-medium flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" /> {score}
          </span>
          <button 
            onClick={isPlaying ? () => setIsPlaying(false) : resetGame} 
            className="text-brand-blue hover:text-brand-cyan flex items-center gap-1 text-sm bg-brand-blue/10 px-3 py-1 rounded-full"
          >
            {isPlaying ? 'Pause' : isGameOver ? 'Play Again' : 'Play'}
          </button>
        </div>

        <div 
          className="bg-slate-200 dark:bg-slate-800 rounded-lg p-1 relative overflow-hidden"
          style={{ width: 240, height: 240 }}
        >
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-lg">
               <button onClick={() => { setIsPlaying(true); playSound('start', soundEnabled); }} className="bg-brand-blue text-white px-4 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-transform">
                 Start Game
               </button>
            </div>
          )}
          {isGameOver && (
            <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center z-10 rounded-lg text-white p-4">
               <span className="font-bold text-xl mb-1">Game Over!</span>
               <span className="mb-2 text-sm font-medium">Score: {score}</span>
               
               {score > 0 && !hasSubmittedScore && (
                 <ScoreSubmitter
                   game="snake"
                   score={score}
                   onSubmitted={() => setHasSubmittedScore(true)}
                 />
               )}
               {hasSubmittedScore && (
                 <div className="text-xs text-brand-cyan mb-3">Score saved!</div>
               )}
               
               <button onClick={resetGame} className="mt-2 bg-white text-red-900 px-4 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-transform text-sm">
                 Play Again
               </button>
            </div>
          )}

          <div className="relative w-full h-full">
            {/* Food */}
            <div 
              className="absolute bg-red-500 rounded-full"
              style={{
                width: `${100/GRID_SIZE}%`,
                height: `${100/GRID_SIZE}%`,
                left: `${food.x * (100/GRID_SIZE)}%`,
                top: `${food.y * (100/GRID_SIZE)}%`
              }}
            />
            {/* Snake */}
            {snake.map((segment, i) => (
              <div 
                key={`${segment.x}-${segment.y}-${i}`}
                className={`absolute rounded-sm ${i === 0 ? 'bg-brand-blue dark:bg-brand-cyan z-10' : 'bg-brand-blue/60 dark:bg-brand-cyan/60'}`}
                style={{
                  width: `${100/GRID_SIZE}%`,
                  height: `${100/GRID_SIZE}%`,
                  left: `${segment.x * (100/GRID_SIZE)}%`,
                  top: `${segment.y * (100/GRID_SIZE)}%`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Mobile D-Pad Controls */}
        <div className="grid grid-cols-3 gap-2 mt-6 max-w-[150px] mx-auto sm:hidden">
          <div />
          <button onClick={() => handleDirection('UP')} className="bg-slate-200 dark:bg-slate-700 p-3 rounded-lg active:bg-slate-300 flex items-center justify-center">▲</button>
          <div />
          <button onClick={() => handleDirection('LEFT')} className="bg-slate-200 dark:bg-slate-700 p-3 rounded-lg active:bg-slate-300 flex items-center justify-center">◀</button>
          <button onClick={() => handleDirection('DOWN')} className="bg-slate-200 dark:bg-slate-700 p-3 rounded-lg active:bg-slate-300 flex items-center justify-center">▼</button>
          <button onClick={() => handleDirection('RIGHT')} className="bg-slate-200 dark:bg-slate-700 p-3 rounded-lg active:bg-slate-300 flex items-center justify-center">▶</button>
        </div>

        <p className="hidden sm:block text-[10px] text-slate-500 mt-2 text-center">Use Arrow Keys to play</p>
      </div>
      <Leaderboard game="snake" />
    </div>
  );
};

// --- Chess Puzzle completely removed. It is now handled by ChessGame.tsx ---

const TANK_GRID_SIZE = 12;

type Entity = { x: number, y: number, id?: number };

const TankSprite = () => (
  <svg viewBox="0 0 11 8" className="w-[85%] h-[85%] fill-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]">
    <path d="M5 0h1v1H5z M4 1h3v1H4z M3 2h5v1H3z M2 3h7v1H2z M2 4h2v1H2zm5 0h2v1H7z M2 5h7v1H2z M1 6h9v1H1z M1 7h9v1H1z" fillRule="evenodd" clipRule="evenodd"/>
  </svg>
);

const BugSprite = () => (
  <svg viewBox="0 0 11 8" className="w-[85%] h-[85%] fill-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]">
    <path d="M2 0h1v1H2zm6 0h1v1H8z M3 1h1v1H3zm4 0h1v1H7z M2 2h7v1H2z M1 3h2v1H1zm3 0h1v1H4zm2 0h1v1H6zm2 0h2v1H8z M1 4h9v1H1z M1 5h1v1H1zm2 0h5v1H3zm6 0h1v1H9z M1 6h1v1H1zm8 0h1v1H9z M2 7h1v1H2zm5 0h1v1H7z" fillRule="evenodd" clipRule="evenodd"/>
  </svg>
);

const TankGame = ({ soundEnabled }: { soundEnabled: boolean }) => {
  const [player, setPlayer] = useState({ x: 5, y: 11 });
  const [enemies, setEnemies] = useState<Entity[]>([{x: 2, y: 0, id: 1}, {x: 8, y: 0, id: 2}]);
  const [bullets, setBullets] = useState<{x:number, y:number, dy:number, id:number}[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [waveSize, setWaveSize] = useState(2);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);

  const stateRef = useRef({ player, enemies, bullets, isPlaying, isGameOver, score, waveSize });
  useEffect(() => {
    stateRef.current = { player, enemies, bullets, isPlaying, isGameOver, score, waveSize };
  }, [player, enemies, bullets, isPlaying, isGameOver, score, waveSize]);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.isPlaying || s.isGameOver) return;

    // Bullet physics
    let newScore = s.score;
    let newEnemies = [...s.enemies];
    let gameOver = false;
    let playEat = false;

    const newBullets = s.bullets.map(b => ({...b, y: b.y + b.dy})).filter(b => {
      if (b.y < 0 || b.y >= TANK_GRID_SIZE) return false;
      
      // Collision with enemies
      if (b.dy < 0) {
        let hitIdx = newEnemies.findIndex(e => e.x === b.x && e.y === b.y);
        if (hitIdx !== -1) {
          newEnemies.splice(hitIdx, 1);
          newScore += 10;
          playEat = true;
          return false;
        }
      }
      // Collision with player
      if (b.dy > 0 && b.x === s.player.x && b.y === s.player.y) {
         gameOver = true;
      }
      return true;
    });

    if (gameOver) {
      playSound('die', soundEnabled);
      setIsPlaying(false);
      setIsGameOver(true);
      return;
    }

    if (playEat) {
      playSound('eat', soundEnabled);
    }

    // Update state
    if (newScore !== s.score) setScore(newScore);
    if (newEnemies.length !== s.enemies.length) setEnemies(newEnemies);
    setBullets(newBullets);
  }, [soundEnabled]);

  const enemyTick = useCallback(() => {
      const s = stateRef.current;
      if (!s.isPlaying || s.isGameOver) return;

      let newEnemies = [...s.enemies];
      let newBullets = [...s.bullets];

      if (newEnemies.length === 0) {
        const nextWaveSize = s.waveSize + 1;
        setWaveSize(nextWaveSize);
        for (let i = 0; i < nextWaveSize; i++) {
           newEnemies.push({x: Math.floor(Math.random()*TANK_GRID_SIZE), y: 0, id: Date.now() + i});
        }
      } else {
        newEnemies = newEnemies.map(e => {
            if (Math.random() < 0.2) {
               newBullets.push({x: e.x, y: e.y + 1, dy: 1, id: Math.random()});
            }
            let nx = e.x + (Math.random() > 0.5 ? 1 : -1);
            if (nx < 0) nx = 0;
            if (nx >= TANK_GRID_SIZE) nx = TANK_GRID_SIZE - 1;
            return { ...e, x: nx, y: Math.random() < 0.1 ? Math.min(e.y + 1, TANK_GRID_SIZE - 2) : e.y };
        });
      }
      
      setEnemies(newEnemies);
      if (newBullets.length !== s.bullets.length) setBullets(newBullets);
  }, []);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const intervalId = setInterval(tick, 100);
    const enemyIntervalId = setInterval(enemyTick, 800);
    return () => { clearInterval(intervalId); clearInterval(enemyIntervalId); };
  }, [isPlaying, isGameOver, tick, enemyTick]);

  const move = (dx: number, dy: number) => {
    if (!isPlaying || isGameOver) return;
    setPlayer(p => {
       const nx = p.x + dx;
       const ny = p.y + dy;
       if (nx < 0 || nx >= TANK_GRID_SIZE || ny < 0 || ny >= TANK_GRID_SIZE) return p;
       return {x: nx, y: ny};
    });
  };

  const shoot = () => {
    if (!isPlaying || isGameOver) return;
    playSound('click', soundEnabled);
    setBullets(prev => [...prev, {x: player.x, y: player.y - 1, dy: -1, id: Date.now()}]);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': move(0, -1); break;
        case 'ArrowDown': move(0, 1); break;
        case 'ArrowLeft': move(-1, 0); break;
        case 'ArrowRight': move(1, 0); break;
        case ' ': shoot(); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isGameOver, player]);

  const resetGame = () => {
    playSound('start', soundEnabled);
    setPlayer({ x: 5, y: 11 });
    setEnemies([{x: 2, y: 0, id: 1}, {x: 8, y: 0, id: 2}]);
    setBullets([]);
    setScore(0);
    setWaveSize(2);
    setHasSubmittedScore(false);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <div className="flex justify-between w-full mb-4 px-2">
        <span className="text-sm font-medium flex items-center gap-1">
          <Trophy className="w-4 h-4 text-yellow-500" /> {score}
        </span>
        <button 
          onClick={isPlaying ? () => setIsPlaying(false) : resetGame} 
          className="text-brand-blue hover:text-brand-cyan flex items-center gap-1 text-sm bg-brand-blue/10 px-3 py-1 rounded-full"
        >
          {isPlaying ? 'Pause' : isGameOver ? 'Play Again' : 'Play'}
        </button>
      </div>

      <div className="bg-slate-900 border-2 border-slate-700/50 rounded-lg p-1 relative w-full aspect-square max-w-[320px] shadow-inner font-mono text-sm overflow-hidden select-none touch-none">
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm">
             <button onClick={() => { setIsPlaying(true); playSound('start', soundEnabled); }} className="bg-green-500 text-black px-6 py-2 rounded font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:bg-green-400 transition-colors uppercase tracking-wider text-sm">
               Run game.sh
             </button>
          </div>
        )}
        {isGameOver && (
          <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm p-4 w-full">
             <span className="font-bold text-xl mb-1 text-red-500">SEGFAULT</span>
             <span className="mb-4 text-sm text-red-400/80">Kernel Panic - Bugs unfixed: {score}</span>
             {score > 0 && !hasSubmittedScore && (
               <div className="w-[80%] mb-4 max-w-[200px]">
                 <ScoreSubmitter
                   game="bughunter"
                   score={score}
                   onSubmitted={() => setHasSubmittedScore(true)}
                 />
               </div>
             )}
             <button onClick={resetGame} className="bg-red-500 text-white px-6 py-2 rounded font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:bg-red-400 transition-colors text-sm uppercase">
               Restart
             </button>
          </div>
        )}

        <div className="relative w-full h-full">
           {/* Grid lines purely for aesthetic */}
           <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${TANK_GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${TANK_GRID_SIZE}, 1fr)` }}>
              {Array(TANK_GRID_SIZE * TANK_GRID_SIZE).fill(0).map((_, i) => (
                 <div key={i} className="border-[0.5px] border-white/5 w-full h-full" />
              ))}
           </div>
           
           {/* Player */}
           <div className="absolute flex items-center justify-center text-xl transition-transform" 
                style={{
                  width: `${100/TANK_GRID_SIZE}%`, height: `${100/TANK_GRID_SIZE}%`,
                  left: `${player.x * (100/TANK_GRID_SIZE)}%`, top: `${player.y * (100/TANK_GRID_SIZE)}%`
                }}>
             <TankSprite />
           </div>

           {/* Enemies */}
           {enemies.map(e => (
             <div key={e.id} className="absolute flex items-center justify-center text-xl transition-all"
                  style={{
                    width: `${100/TANK_GRID_SIZE}%`, height: `${100/TANK_GRID_SIZE}%`,
                    left: `${e.x * (100/TANK_GRID_SIZE)}%`, top: `${e.y * (100/TANK_GRID_SIZE)}%`
                  }}>
               <BugSprite />
             </div>
           ))}

           {/* Bullets */}
           {bullets.map(b => (
             <div key={b.id} className="absolute flex items-center justify-center z-10"
                  style={{
                    width: `${100/TANK_GRID_SIZE}%`, height: `${100/TANK_GRID_SIZE}%`,
                    left: `${b.x * (100/TANK_GRID_SIZE)}%`, top: `${b.y * (100/TANK_GRID_SIZE)}%`
                  }}>
               <div className={`w-1.5 h-3 rounded-full ${b.dy < 0 ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
             </div>
           ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-[240px] md:hidden">
         <div />
         <button className="bg-slate-200 dark:bg-white/10 aspect-square rounded-lg flex items-center justify-center active:bg-slate-300 dark:active:bg-white/20 select-none"
             onPointerDown={(e)=>{e.preventDefault(); move(0, -1);}}><span className="rotate-[-90deg]">➔</span></button>
         <div />
         <button className="bg-slate-200 dark:bg-white/10 aspect-square rounded-lg flex items-center justify-center active:bg-slate-300 dark:active:bg-white/20 select-none"
             onPointerDown={(e)=>{e.preventDefault(); move(-1, 0);}}><span className="rotate-180">➔</span></button>
         <button className="bg-brand-blue text-white aspect-square rounded-lg flex items-center justify-center shadow-lg active:scale-95 select-none font-bold"
             onPointerDown={(e)=>{e.preventDefault(); shoot();}}>FIRE</button>
         <button className="bg-slate-200 dark:bg-white/10 aspect-square rounded-lg flex items-center justify-center active:bg-slate-300 dark:active:bg-white/20 select-none"
             onPointerDown={(e)=>{e.preventDefault(); move(1, 0);}}><span>➔</span></button>
         <div />
         <button className="bg-slate-200 dark:bg-white/10 aspect-square rounded-lg flex items-center justify-center active:bg-slate-300 dark:active:bg-white/20 select-none"
             onPointerDown={(e)=>{e.preventDefault(); move(0, 1);}}><span className="rotate-90">➔</span></button>
         <div />
      </div>
      <p className="hidden md:block text-[11px] text-slate-500 mt-3 text-center uppercase tracking-widest">Arrows to move • Space to fire</p>
    </div>
  );
};


export default function InteractiveGames() {
  const [activeTab, setActiveTab] = useState<'sudoku' | 'snake' | 'chess' | 'tank' | '29' | 'tetris'>('sudoku');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { t } = useTranslation();

  return (
    <section id="games" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col relative z-10">
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white mb-4">
             Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Playground</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
             Take a break and try out these mini-games. Built directly into the portfolio.
          </p>
          <div className="absolute top-0 right-0">
             <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) playSound('click', true);
                }}
                className={`p-2 rounded-full transition-colors flex items-center gap-2 text-sm font-medium ${
                  soundEnabled 
                    ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-cyan/10 dark:text-brand-cyan' 
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
                aria-label="Toggle Sound"
             >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
             </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 dark:border-white/10 p-2 sm:p-6 mb-8 mx-auto w-full max-w-2xl shadow-xl">
           <div className="flex flex-wrap bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-8 overflow-x-auto gap-1">
              <button
                onClick={() => setActiveTab('sudoku')}
                className={`flex-1 min-w-[30%] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'sudoku' 
                    ? 'bg-white dark:bg-[#1a2333] text-brand-blue dark:text-brand-cyan shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" /> Sudoku
              </button>
              <button
                onClick={() => setActiveTab('snake')}
                className={`flex-1 min-w-[30%] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'snake' 
                    ? 'bg-white dark:bg-[#1a2333] text-brand-blue dark:text-brand-cyan shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Ghost className="w-4 h-4" /> Snake
              </button>
              <button
                onClick={() => setActiveTab('chess')}
                className={`flex-1 min-w-[30%] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'chess' 
                    ? 'bg-white dark:bg-[#1a2333] text-brand-blue dark:text-brand-cyan shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4" /> Chess
              </button>
              <button
                onClick={() => setActiveTab('tank')}
                className={`flex-1 min-w-[30%] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'tank' 
                    ? 'bg-white dark:bg-[#1a2333] text-brand-blue dark:text-brand-cyan shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Crosshair className="w-4 h-4" /> Bug Hunter
              </button>
              <button
                onClick={() => setActiveTab('29')}
                className={`flex-1 min-w-[30%] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === '29' 
                    ? 'bg-white dark:bg-[#1a2333] text-brand-blue dark:text-brand-cyan shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Spade className="w-4 h-4" /> 29 card
              </button>
              <button
                onClick={() => setActiveTab('tetris')}
                className={`flex-1 min-w-[30%] flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'tetris' 
                    ? 'bg-white dark:bg-[#1a2333] text-brand-blue dark:text-brand-cyan shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Blocks className="w-4 h-4" /> Tetris
              </button>
           </div>

           <div className="min-h-[300px] flex items-center justify-center p-4">
              <AnimatePresence mode='wait'>
                 {activeTab === 'sudoku' && (
                    <motion.div 
                      key="sudoku"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full"
                    >
                      <SudokuGame soundEnabled={soundEnabled} />
                    </motion.div>
                 )}
                 {activeTab === 'snake' && (
                    <motion.div 
                      key="snake"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full"
                    >
                      <SnakeGame soundEnabled={soundEnabled} />
                    </motion.div>
                 )}
                 {activeTab === 'chess' && (
                    <motion.div 
                      key="chess"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full"
                    >
                      <ChessGame soundEnabled={soundEnabled} playSound={playSound} />
                    </motion.div>
                 )}
                 {activeTab === 'tank' && (
                    <motion.div 
                      key="tank"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full"
                    >
                      <TankGame soundEnabled={soundEnabled} />
                      <div className="mt-8">
                        <Leaderboard game="bughunter" />
                      </div>
                    </motion.div>
                 )}
                 {activeTab === '29' && (
                    <motion.div 
                      key="29"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full"
                    >
                      <CardGame29 soundEnabled={soundEnabled} playSound={playSound} />
                    </motion.div>
                 )}
                 {activeTab === 'tetris' && (
                    <motion.div 
                      key="tetris"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full"
                    >
                      <TetrisGame soundEnabled={soundEnabled} />
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </section>
  );
}
