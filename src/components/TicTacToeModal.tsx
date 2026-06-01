import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Bot, User } from 'lucide-react';

type Player = 'X' | 'O' | null;

export const TicTacToeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true); // User is X
  const [isAiThinking, setIsAiThinking] = useState(false);

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    return null;
  };

  const getWinnerNode = checkWinner(board);
  const winner = getWinnerNode?.winner;
  const winningLine = getWinnerNode?.line || [];
  const isDraw = !winner && !board.includes(null);

  useEffect(() => {
    if (!isXNext && !winner && board.includes(null) && isOpen) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        makeAiMove();
        setIsAiThinking(false);
      }, 500); // slight delay for realism
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, isOpen, winner]);

  const minimax = (newBoard: Player[], depth: number, isMaximizing: boolean): number => {
    const winState = checkWinner(newBoard)?.winner;
    if (winState === 'O') return 10 - depth;
    if (winState === 'X') return depth - 10;
    if (!newBoard.includes(null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = 'O';
          const score = minimax(newBoard, depth + 1, false);
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = 'X';
          const score = minimax(newBoard, depth + 1, true);
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const makeAiMove = () => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    if (move !== -1) {
      const newBoard = [...board];
      newBoard[move] = 'O';
      setBoard(newBoard);
      setIsXNext(true);
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !isXNext || isAiThinking) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  // Reset game on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
         resetGame();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-slate-900 dark:text-white">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3 }}
           className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
           onClick={onClose}
        />
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           transition={{ type: "spring", duration: 0.5, bounce: 0 }}
           className="relative w-full max-w-[320px] md:max-w-sm glass-card flex flex-col rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-slate-900/90 p-5 md:p-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-3 sm:mb-4 mt-1">
             <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">Tic Tac Toe</h3>
             <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Human vs I Robot</p>
          </div>

          <div className="flex items-center justify-between mb-4 sm:mb-5 px-1 sm:px-2 md:px-4">
             <div className={`flex flex-col items-center p-2 sm:p-3 rounded-xl transition-colors ${isXNext && !winner && !isDraw ? 'bg-brand-blue/20 text-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-400 dark:text-slate-500'}`}>
                <User className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                <span className="text-[10px] sm:text-xs font-bold uppercase">You (X)</span>
             </div>
             <div className="text-xs sm:text-sm font-bold text-slate-400">VS</div>
             <div className={`flex flex-col items-center p-2 sm:p-3 rounded-xl transition-colors ${!isXNext && !winner && !isDraw ? 'bg-rose-500/20 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'text-slate-400 dark:text-slate-500'}`}>
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                <span className="text-[10px] sm:text-xs font-bold uppercase">AI (O)</span>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-2 md:gap-3 mb-4 sm:mb-5">
            {board.map((cell, idx) => {
               const isWinningCell = winningLine.includes(idx);
               return (
                  <button
                     key={idx}
                     onClick={() => handleClick(idx)}
                     disabled={!!cell || !!winner || !isXNext || isAiThinking}
                     className={`h-16 w-16 md:h-20 md:w-20 mx-auto rounded-2xl text-2xl md:text-3xl font-black flex items-center justify-center transition-all duration-300 ${
                       cell === null ? 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-inner' :
                       isWinningCell ? (cell === 'X' ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105 z-10' : 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-105 z-10') :
                       cell === 'X' ? 'bg-white dark:bg-slate-800 text-brand-blue' :
                       'bg-white dark:bg-slate-800 text-rose-500'
                     } ${!cell && isXNext && !winner ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                  >
                     <motion.div
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ scale: cell ? 1 : 0, opacity: cell ? 1 : 0 }}
                       transition={{ type: "spring", bounce: 0.5 }}
                     >
                       {cell}
                     </motion.div>
                  </button>
               );
            })}
          </div>

          <div className="text-center h-10 flex items-center justify-center mb-1">
             {winner ? (
                <div className={`text-xl font-bold ${winner === 'X' ? 'text-brand-blue' : 'text-rose-500'}`}>
                   {winner === 'X' ? 'You won!' : 'AI wins!'}
                </div>
             ) : isDraw ? (
                <div className="text-xl font-bold text-slate-500 dark:text-slate-400">It's a draw!</div>
             ) : isAiThinking ? (
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                   AI is calculating...
                </div>
             ) : (
                <div className="text-sm font-medium text-brand-blue dark:text-brand-cyan">Your move</div>
             )}
          </div>

          <button
             onClick={resetGame}
             className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-lg mt-1"
          >
             <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
             Reset Game
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
