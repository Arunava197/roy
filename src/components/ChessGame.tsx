import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { motion } from 'motion/react';
import { RotateCcw, Clock, Target } from 'lucide-react';
import { findBestMove } from './ChessAI';

export const ChessGame = ({ soundEnabled, playSound }: { soundEnabled: boolean, playSound: (type: any, en: boolean) => void }) => {
  const [game, setGame] = useState(new Chess());
  const [playerTime, setPlayerTime] = useState(60);
  const [aiTime, setAiTime] = useState(60);
  const [gameStatus, setGameStatus] = useState<string | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  // Use refs for timer to avoid interval stale closures
  const playerTimeRef = useRef(playerTime);
  const aiTimeRef = useRef(aiTime);
  const isPlayingRef = useRef(isPlaying);
  const isPlayerTurnRef = useRef(isPlayerTurn);

  useEffect(() => { playerTimeRef.current = playerTime; }, [playerTime]);
  useEffect(() => { aiTimeRef.current = aiTime; }, [aiTime]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { isPlayerTurnRef.current = isPlayerTurn; }, [isPlayerTurn]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPlayingRef.current || gameStatus !== null) return;
      if (isPlayerTurnRef.current) {
        if (playerTimeRef.current <= 0) {
          setGameStatus('Black Wins on Time!');
          playSound('die', soundEnabled);
        } else {
          setPlayerTime(p => p - 1);
        }
      } else {
        if (aiTimeRef.current <= 0) {
          setGameStatus('White Wins on Time!');
          playSound('win', soundEnabled);
        } else {
          setAiTime(a => a - 1);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStatus, soundEnabled, playSound]);

  // AI Move
  useEffect(() => {
    if (isPlaying && !isPlayerTurn && !gameStatus) {
      setTimeout(() => {
        const aiMove = findBestMove(game);
        if (aiMove) {
          const gameCopy = new Chess(game.fen());
          gameCopy.move(aiMove);
          setGame(gameCopy);
          playSound('click', soundEnabled);
          setIsPlayerTurn(true);
          checkStatus(gameCopy);
        }
      }, 100);
    }
  }, [isPlayerTurn, isPlaying, game, gameStatus]);

  const checkStatus = (currentGame: Chess) => {
    if (currentGame.isCheckmate()) {
      const winner = currentGame.turn() === 'w' ? 'Black Wins!' : 'White Wins!';
      setGameStatus(winner);
      playSound(currentGame.turn() === 'w' ? 'die' : 'win', soundEnabled);
    } else if (currentGame.isDraw() || currentGame.isStalemate() || currentGame.isThreefoldRepetition() || currentGame.isInsufficientMaterial()) {
      setGameStatus('Draw');
    } else if (currentGame.isCheck()) {
      playSound('eat', soundEnabled); // using 'eat' sound for check
    }
  };

  const handleSquareClick = (square: Square) => {
    if (!isPlaying || !isPlayerTurn || gameStatus) return;

    if (selectedSquare) {
      // attempt to move
      try {
        const gameCopy = new Chess(game.fen());
        const move = gameCopy.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        });
        
        setGame(gameCopy);
        setSelectedSquare(null);
        setPossibleMoves([]);
        setIsPlayerTurn(false);
        playSound('click', soundEnabled);
        checkStatus(gameCopy);
      } catch (e) {
        // invalid move, reset selection or select new
        const piece = game.get(square);
        if (piece && piece.color === 'w') {
          setSelectedSquare(square);
          setPossibleMoves(game.moves({ square, verbose: true }).map(m => (m as any).to));
          playSound('click', soundEnabled);
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      const piece = game.get(square);
      if (piece && piece.color === 'w') {
        setSelectedSquare(square);
        setPossibleMoves(game.moves({ square, verbose: true }).map(m => (m as any).to));
        playSound('click', soundEnabled);
      }
    }
  };

  const startGame = () => {
    setGame(new Chess());
    setPlayerTime(60);
    setAiTime(60);
    setGameStatus(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setIsPlaying(true);
    setIsPlayerTurn(true);
    playSound('start', soundEnabled);
  };

  const formatTime = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const board = game.board();

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none touch-none">
      
      {!isPlaying && !gameStatus ? (
         <div className="w-full flex-col min-h-[300px] flex items-center justify-center p-6 bg-slate-900 border-2 border-slate-700/50 rounded-lg shadow-inner mb-4 relative z-10 text-center">
            <h3 className="text-xl font-bold font-display text-white mb-2">Bullet Chess</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-[200px]">1-minute game against a super hard AI</p>
            <button onClick={startGame} className="bg-brand-blue text-white px-6 py-2 rounded-full font-medium shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
               <Target className="w-4 h-4" /> Start Match
            </button>
         </div>
      ) : (
         <>
         <div className="w-full flex justify-between items-center mb-3 bg-slate-100 dark:bg-white/5 py-2 px-4 rounded-lg">
           <div className={`flex items-center gap-2 font-mono text-lg font-bold ${!isPlayerTurn ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 opacity-50'}`}>
             <Clock className="w-4 h-4" />
             {formatTime(aiTime)}
           </div>
           <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">AI Bot</div>
         </div>

         <div className="relative w-full aspect-square border-[6px] border-slate-700/50 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xl">
            {gameStatus && (
               <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                 <span className="font-bold text-2xl mb-1 text-white">{gameStatus}</span>
                 <button onClick={startGame} className="mt-4 bg-brand-blue text-white px-6 py-2 rounded font-bold shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:bg-brand-cyan transition-colors text-sm uppercase">
                   Play Again
                 </button>
               </div>
            )}
            
            <div className="w-full h-full grid grid-cols-8 grid-rows-8">
               {board.map((row, i) => 
                  row.map((piece, j) => {
                     const isDark = (i + j) % 2 === 1;
                     const squareName = String.fromCharCode(97 + j) + (8 - i) as Square;
                     const isSelected = selectedSquare === squareName;
                     const isPossible = possibleMoves.includes(squareName);
                     const isCheck = game.inCheck() && piece?.type === 'k' && piece?.color === game.turn();
                     
                     return (
                        <div 
                           key={`${i}-${j}`} 
                           onClick={() => handleSquareClick(squareName)}
                           className={`relative flex items-center justify-center cursor-pointer transition-colors
                             ${isDark ? 'bg-[#739552]' : 'bg-[#ebecd0]'} 
                             ${isSelected ? 'after:absolute after:inset-0 after:bg-yellow-400/50' : ''}
                             ${isCheck ? 'bg-red-500/80 after:absolute after:inset-0 after:bg-red-500/50' : ''}
                           `}
                        >
                           {isPossible && !piece && (
                              <div className="w-1/4 h-1/4 rounded-full bg-black/20 z-10" />
                           )}
                           {isPossible && piece && (
                              <div className="absolute inset-0 border-[4px] border-black/20 rounded-full z-10 scale-90" />
                           )}
                           {piece && (
                              <img 
                                 src={`https://www.chess.com/chess-themes/pieces/neo/150/${piece.color}${piece.type}.png`} 
                                 className="relative z-10 w-[80%] h-[80%] drop-shadow-sm pointer-events-none select-none" 
                                 alt={`${piece.color}${piece.type}`} 
                              />
                           )}
                        </div>
                     )
                  })
               )}
            </div>
         </div>

         <div className="w-full flex justify-between items-center mt-3 bg-slate-100 dark:bg-brand-blue/10 border border-transparent dark:border-brand-blue/20 py-2 px-4 rounded-lg">
           <div className="text-xs uppercase font-bold text-slate-400 dark:text-brand-cyan/70 tracking-wider">You</div>
           <div className={`flex items-center gap-2 font-mono text-lg font-bold ${isPlayerTurn && playerTime <= 10 ? 'text-red-500 animate-pulse' : isPlayerTurn ? 'text-brand-blue dark:text-brand-cyan' : 'text-slate-500 dark:text-slate-400 opacity-50'}`}>
             <Clock className="w-4 h-4" />
             {formatTime(playerTime)}
           </div>
         </div>
         
         <div className="w-full flex justify-center mt-4">
             <button onClick={() => { setIsPlaying(false); setGameStatus(null); setGame(new Chess()); playSound('click', soundEnabled); }} className="text-slate-500 hover:text-slate-700 dark:hover:text-white flex items-center gap-1 text-sm font-medium">
               <RotateCcw className="w-4 h-4" /> Quit Match
             </button>
         </div>
         </>
      )}
    </div>
  );
};
