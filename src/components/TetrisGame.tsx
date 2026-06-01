import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Trophy, ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { Leaderboard, ScoreSubmitter, playSound } from './InteractiveGames';

const COLS = 10;
const ROWS = 20;

const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-400' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-400' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' }
};

type TetrominoType = keyof typeof TETROMINOES;
const SHAPES = Object.keys(TETROMINOES) as TetrominoType[];

export const TetrisGame = ({ soundEnabled }: { soundEnabled: boolean }) => {
  const [board, setBoard] = useState<(string | 0)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    color: string;
    pos: { x: number; y: number };
  } | null>(null);
  
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  
  const dropTime = useRef<number>(1000);
  const gameOverRef = useRef<boolean>(false);
  
  const randomPiece = () => {
    const type = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const { shape, color } = TETROMINOES[type];
    return { shape, color, pos: { x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0 } };
  };

  const startGame = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setCurrentPiece(randomPiece());
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setHasSubmittedScore(false);
    dropTime.current = 1000;
    gameOverRef.current = false;
    playSound('start', soundEnabled);
  };

  const checkCollision = (piece: { shape: number[][], pos: { x: number, y: number } }, targetBoard: (string | 0)[][]) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = y + piece.pos.y;
          const boardX = x + piece.pos.x;
          if (
            boardY >= ROWS ||
            boardX < 0 ||
            boardX >= COLS ||
            (boardY >= 0 && targetBoard[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const mergePiece = () => {
    if (!currentPiece) return;
    const newBoard = board.map(row => [...row]);
    let end = false;

    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          if (currentPiece.pos.y + y < 0) {
            end = true;
          } else {
             newBoard[currentPiece.pos.y + y][currentPiece.pos.x + x] = currentPiece.color;
          }
        }
      });
    });

    if (end) {
      setGameOver(true);
      setIsPlaying(false);
      gameOverRef.current = true;
      playSound('die', soundEnabled);
      return;
    }

    let linesCleared = 0;
    const sweepBoard = newBoard.reduce((acc, row) => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        acc.unshift(Array(COLS).fill(0));
      } else {
        acc.push(row);
      }
      return acc;
    }, [] as (string | 0)[][]);

    if (linesCleared > 0) {
        const points = linesCleared === 1 ? 100 : linesCleared === 2 ? 300 : linesCleared === 3 ? 500 : 800;
        setScore(prev => {
            const newScore = prev + points;
            dropTime.current = Math.max(200, 1000 - Math.floor(newScore / 500) * 50);
            return newScore;
        });
        playSound('win', soundEnabled);
    }

    setBoard(sweepBoard);
    const nextPiece = randomPiece();
    if (checkCollision(nextPiece, sweepBoard)) {
        setGameOver(true);
        setIsPlaying(false);
        gameOverRef.current = true;
        playSound('die', soundEnabled);
    } else {
        setCurrentPiece(nextPiece);
    }
  };

  const drop = useCallback(() => {
    if (!currentPiece || !isPlaying || gameOverRef.current) return;
    
    // Check if moving piece down causes collision
    if (!checkCollision({ ...currentPiece, pos: { ...currentPiece.pos, y: currentPiece.pos.y + 1 } }, board)) {
      setCurrentPiece({ ...currentPiece, pos: { ...currentPiece.pos, y: currentPiece.pos.y + 1 } });
    } else {
      mergePiece();
      playSound('eat', soundEnabled);
    }
  }, [currentPiece, board, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(drop, dropTime.current);
    return () => clearInterval(interval);
  }, [drop, isPlaying]);

  const movePlayer = (dir: number) => {
    if (!currentPiece || !isPlaying) return;
    if (!checkCollision({ ...currentPiece, pos: { ...currentPiece.pos, x: currentPiece.pos.x + dir } }, board)) {
      setCurrentPiece({ ...currentPiece, pos: { ...currentPiece.pos, x: currentPiece.pos.x + dir } });
      playSound('click', soundEnabled);
    }
  };

  const rotatePlayer = () => {
    if (!currentPiece || !isPlaying) return;
    const shape = currentPiece.shape;
    const rotated = shape[0].map((_, index) => shape.map(row => row[index]).reverse());
    
    let offset = 1;
    let pos = currentPiece.pos;
    
    if (!checkCollision({ ...currentPiece, shape: rotated, pos }, board)) {
      setCurrentPiece({ ...currentPiece, shape: rotated, pos });
      playSound('click', soundEnabled);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowLeft': movePlayer(-1); break;
        case 'ArrowRight': movePlayer(1); break;
        case 'ArrowDown': drop(); break;
        case 'ArrowUp': rotatePlayer(); break;
        case ' ': // hard drop
          if (!currentPiece) return;
          let tempY = currentPiece.pos.y;
          while (!checkCollision({ ...currentPiece, pos: { ...currentPiece.pos, y: tempY + 1 } }, board)) {
             tempY++;
          }
          setCurrentPiece({ ...currentPiece, pos: { ...currentPiece.pos, y: tempY } });
          // merge will happen on next tick, but let's do it faster
          setTimeout(drop, 10);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPiece, isPlaying, board]);

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center">
         <div className="flex justify-between w-full mb-4 px-2 items-center bg-slate-100 dark:bg-[#1a2333] p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
            <div>
               <p className="text-sm text-slate-500 uppercase tracking-widest font-black">Score</p>
               <p className="text-2xl font-bold font-mono text-brand-blue dark:text-brand-cyan">{score}</p>
            </div>
            {!isPlaying && (
               <button onClick={startGame} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-medium shadow hover:scale-105 transition-transform flex items-center gap-2">
                 <RotateCcw className="w-4 h-4" /> Start
               </button>
            )}
         </div>

         <div className="bg-slate-900 border-4 border-slate-800 rounded-xl p-1 shadow-2xl relative w-fit mx-auto">
            <div 
               className="grid bg-[#0f172a] gap-px border border-white/5" 
               style={{ 
                 gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                 width: '240px', // 24px per logical cell
                 height: '480px' // 24px per logical cell
               }}
            >
              {board.map((row, y) => 
                row.map((cell, x) => {
                  const isPiece = currentPiece?.shape[y - currentPiece.pos.y]?.[x - currentPiece.pos.x];
                  const colorClass = isPiece && isPiece !== 0 ? currentPiece.color : cell !== 0 ? cell : '';
                  return (
                    <div 
                      key={`${x}-${y}`} 
                      className={`w-full h-full rounded-[1px] ${colorClass ? `${colorClass} border border-black/20 shadow-inner` : 'border border-white/[0.02]'}`}
                    />
                  );
                })
              )}
            </div>

            {/* Mobile Controls */}
            {isPlaying && (
              <div className="mt-6 md:hidden grid grid-cols-3 gap-2 p-2 bg-slate-800 rounded-xl w-full">
                 <div />
                 <button onClick={rotatePlayer} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-lg p-4 flex items-center justify-center transition-colors"><ArrowUp className="w-6 h-6" /></button>
                 <div />
                 <button onClick={() => movePlayer(-1)} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-lg p-4 flex items-center justify-center transition-colors"><ArrowLeft className="w-6 h-6" /></button>
                 <button onClick={drop} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-lg p-4 flex items-center justify-center transition-colors"><ArrowDown className="w-6 h-6" /></button>
                 <button onClick={() => movePlayer(1)} className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-lg p-4 flex items-center justify-center transition-colors"><ArrowRight className="w-6 h-6" /></button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-6 text-center">
                 <h4 className="text-3xl font-black text-red-500 mb-2 uppercase tracking-widest max-w-full truncate">Game Over</h4>
                 <p className="text-slate-300 mb-6 flex items-center gap-2 text-xl font-medium justify-center"><Trophy className="text-yellow-400" /> {score}</p>
                 
                 {!hasSubmittedScore ? (
                   <div className="w-full">
                     <ScoreSubmitter game="tetris" score={score} onSubmitted={() => setHasSubmittedScore(true)} />
                   </div>
                 ) : (
                   <p className="text-brand-cyan mb-4 font-bold text-lg drop-shadow">Score saved!</p>
                 )}
              </div>
            )}
         </div>
         
         <div className="hidden md:block mt-6 text-sm text-slate-500 text-center mx-auto">
           <p className="font-bold text-slate-700 dark:text-slate-300 mb-2">Controls</p>
           <div className="flex flex-col gap-2 bg-slate-100 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-4 justify-between font-mono">
                <span>Move / Rotate</span>
                <kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded shadow-sm text-slate-900 dark:text-white">← ↑ → ↓</kbd>
              </div>
              <div className="flex items-center gap-4 justify-between font-mono">
                <span>Hard Drop</span>
                <kbd className="px-5 py-1 bg-white dark:bg-slate-800 rounded shadow-sm text-slate-900 dark:text-white">Space</kbd>
              </div>
           </div>
         </div>
      </div>
      
      <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 md:pl-8 pt-8 md:pt-0 shrink-0">
        <Leaderboard game="tetris" />
      </div>
    </div>
  );
};
