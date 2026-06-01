import { Chess, Move } from 'chess.js';

const pieceValues: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece Square Tables to give AI some positional understanding
const pawnEvalWhite = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];
const pawnEvalBlack = pawnEvalWhite.slice().reverse();

const knightEval = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];

const bishopEvalWhite = [
    [ -20,-10,-10,-10,-10,-10,-10,-20],
    [ -10,  0,  0,  0,  0,  0,  0,-10],
    [ -10,  0,  5, 10, 10,  5,  0,-10],
    [ -10,  5,  5, 10, 10,  5,  5,-10],
    [ -10,  0, 10, 10, 10, 10,  0,-10],
    [ -10, 10, 10, 10, 10, 10, 10,-10],
    [ -10,  5,  0,  0,  0,  0,  5,-10],
    [ -20,-10,-10,-10,-10,-10,-10,-20]
];
const bishopEvalBlack = bishopEvalWhite.slice().reverse();

const rookEvalWhite = [
    [  0,  0,  0,  0,  0,  0,  0,  0],
    [  5, 10, 10, 10, 10, 10, 10,  5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [  0,  0,  0,  5,  5,  0,  0,  0]
];
const rookEvalBlack = rookEvalWhite.slice().reverse();

const evalQuen = [
    [ -20,-10,-10, -5, -5,-10,-10,-20],
    [ -10,  0,  0,  0,  0,  0,  0,-10],
    [ -10,  0,  5,  5,  5,  5,  0,-10],
    [  -5,  0,  5,  5,  5,  5,  0, -5],
    [   0,  0,  5,  5,  5,  5,  0, -5],
    [ -10,  5,  5,  5,  5,  5,  0,-10],
    [ -10,  0,  5,  0,  0,  0,  0,-10],
    [ -20,-10,-10, -5, -5,-10,-10,-20]
];

const kingEvalWhite = [
    [ -30,-40,-40,-50,-50,-40,-40,-30],
    [ -30,-40,-40,-50,-50,-40,-40,-30],
    [ -30,-40,-40,-50,-50,-40,-40,-30],
    [ -30,-40,-40,-50,-50,-40,-40,-30],
    [ -20,-30,-30,-40,-40,-30,-30,-20],
    [ -10,-20,-20,-20,-20,-20,-20,-10],
    [  20, 20,  0,  0,  0,  0, 20, 20],
    [  20, 30, 10,  0,  0, 10, 30, 20]
];
const kingEvalBlack = kingEvalWhite.slice().reverse();

const evaluateBoard = (game: Chess) => {
    let totalEvaluation = 0;
    const board = game.board();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            totalEvaluation += getPieceValue(board[i][j], i, j);
        }
    }
    return totalEvaluation;
};

const getPieceValue = (piece: { type: string, color: string } | null, x: number, y: number) => {
    if (piece === null) return 0;
    
    let val = 0;
    const isWhite = piece.color === 'w';
    
    switch (piece.type) {
        case 'p':
            val = pieceValues.p + (isWhite ? pawnEvalWhite[x][y] : pawnEvalBlack[x][y]);
            break;
        case 'n':
            val = pieceValues.n + knightEval[x][y];
            break;
        case 'b':
            val = pieceValues.b + (isWhite ? bishopEvalWhite[x][y] : bishopEvalBlack[x][y]);
            break;
        case 'r':
            val = pieceValues.r + (isWhite ? rookEvalWhite[x][y] : rookEvalBlack[x][y]);
            break;
        case 'q':
            val = pieceValues.q + evalQuen[x][y];
            break;
        case 'k':
            val = pieceValues.k + (isWhite ? kingEvalWhite[x][y] : kingEvalBlack[x][y]);
            break;
    }
    return isWhite ? val : -val;
};

const minimax = (game: Chess, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean): number => {
    if (depth === 0 || game.isGameOver()) {
        return evaluateBoard(game);
    }

    const moves = game.moves();

    if (isMaximizingPlayer) {
        let bestVal = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            bestVal = Math.max(bestVal, minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    } else {
        let bestVal = Infinity;
        for (let i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            bestVal = Math.min(bestVal, minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
            game.undo();
            beta = Math.min(beta, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    }
};

export const findBestMove = (game: Chess): string | null => {
    const depth = 3; // 3 is usually under 500ms in basic JS
    const moves = game.moves();
    if (moves.length === 0) return null;
    
    let bestMove = null;
    let bestValue = game.turn() === 'w' ? -Infinity : Infinity;

    for (let i = 0; i < moves.length; i++) {
        game.move(moves[i]);
        const boardValue = minimax(game, depth - 1, -Infinity, Infinity, game.turn() === 'w');
        game.undo();

        if (game.turn() === 'w') {
            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = moves[i];
            }
        } else {
            if (boardValue < bestValue) {
                bestValue = boardValue;
                bestMove = moves[i];
            }
        }
    }
    
    return bestMove || moves[Math.floor(Math.random() * moves.length)];
};
