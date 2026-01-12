/**
 * AI Module
 * Implements the minimax algorithm for unbeatable TicTacToe AI.
 * The AI plays as 'O' and will always win or draw - never lose.
 */

const AI = (function() {
    'use strict';

    // Constants (same as Game module)
    const PLAYER_X = 'X';  // Human (minimizing player)
    const PLAYER_O = 'O';  // AI (maximizing player)
    const EMPTY = '';

    // Scoring constants
    const SCORE_WIN = 10;
    const SCORE_LOSE = -10;
    const SCORE_DRAW = 0;

    // Winning combinations
    const WINNING_COMBINATIONS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]               // Diagonals
    ];

    /**
     * Checks the board for a winner
     * @param {Array} board - Current board state
     * @returns {string|null} Winner ('X', 'O') or null if no winner
     */
    function checkWinner(board) {
        for (const combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            if (board[a] !== EMPTY &&
                board[a] === board[b] &&
                board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    /**
     * Checks if the board is full
     * @param {Array} board - Current board state
     * @returns {boolean} True if no empty cells remain
     */
    function isBoardFull(board) {
        return board.every(cell => cell !== EMPTY);
    }

    /**
     * Gets all empty cell indices
     * @param {Array} board - Current board state
     * @returns {Array<number>} Indices of empty cells
     */
    function getEmptyCells(board) {
        const empty = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === EMPTY) {
                empty.push(i);
            }
        }
        return empty;
    }

    /**
     * Minimax algorithm with alpha-beta pruning
     * Recursively evaluates all possible game states to find the optimal move.
     *
     * @param {Array} board - Current board state
     * @param {number} depth - Current recursion depth (used for preferring faster wins)
     * @param {boolean} isMaximizing - True if maximizing player's turn (AI)
     * @param {number} alpha - Best score for maximizing player
     * @param {number} beta - Best score for minimizing player
     * @returns {number} The score of the board state
     */
    function minimax(board, depth, isMaximizing, alpha, beta) {
        // Check terminal states
        const winner = checkWinner(board);

        if (winner === PLAYER_O) {
            // AI wins - prefer faster wins (subtract depth)
            return SCORE_WIN - depth;
        }
        if (winner === PLAYER_X) {
            // Human wins - prefer slower losses (add depth)
            return SCORE_LOSE + depth;
        }
        if (isBoardFull(board)) {
            // Draw
            return SCORE_DRAW;
        }

        const emptyCells = getEmptyCells(board);

        if (isMaximizing) {
            // AI's turn (O) - maximize score
            let bestScore = -Infinity;

            for (const index of emptyCells) {
                // Try the move
                board[index] = PLAYER_O;
                const score = minimax(board, depth + 1, false, alpha, beta);
                // Undo the move
                board[index] = EMPTY;

                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score);

                // Alpha-beta pruning
                if (beta <= alpha) {
                    break;
                }
            }

            return bestScore;
        } else {
            // Human's turn (X) - minimize score (assume optimal play)
            let bestScore = Infinity;

            for (const index of emptyCells) {
                // Try the move
                board[index] = PLAYER_X;
                const score = minimax(board, depth + 1, true, alpha, beta);
                // Undo the move
                board[index] = EMPTY;

                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score);

                // Alpha-beta pruning
                if (beta <= alpha) {
                    break;
                }
            }

            return bestScore;
        }
    }

    /**
     * Finds the best move for the AI using minimax
     * @param {Array} board - Current board state
     * @returns {number|null} Index of the best move, or null if no moves available
     */
    function findBestMove(board) {
        // Create a copy to avoid mutating the original
        const boardCopy = [...board];
        const emptyCells = getEmptyCells(boardCopy);

        if (emptyCells.length === 0) {
            return null;
        }

        // Optimization: If AI goes first, choose center or corner randomly
        // This speeds up the first move since all corners/center are equally optimal
        if (emptyCells.length === 9) {
            const firstMoves = [0, 2, 4, 6, 8]; // Corners and center
            return firstMoves[Math.floor(Math.random() * firstMoves.length)];
        }

        // Optimization: If board has 8 empty cells and center is taken, choose corner
        if (emptyCells.length === 8 && boardCopy[4] !== EMPTY) {
            const corners = [0, 2, 6, 8];
            return corners[Math.floor(Math.random() * corners.length)];
        }

        let bestScore = -Infinity;
        let bestMove = null;

        for (const index of emptyCells) {
            // Try the move
            boardCopy[index] = PLAYER_O;

            // Evaluate this move with minimax
            const score = minimax(boardCopy, 0, false, -Infinity, Infinity);

            // Undo the move
            boardCopy[index] = EMPTY;

            // Update best if this move is better
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }

        return bestMove;
    }

    /**
     * Gets the AI's move with optional artificial delay
     * @param {Array} board - Current board state
     * @param {number} delay - Delay in milliseconds before returning move
     * @returns {Promise<number|null>} Promise resolving to the best move index
     */
    function getMoveWithDelay(board, delay = 400) {
        return new Promise((resolve) => {
            // Calculate the move immediately (minimax is fast for 3x3)
            const move = findBestMove(board);

            // Add artificial delay for natural feel
            setTimeout(() => {
                resolve(move);
            }, delay);
        });
    }

    /**
     * Synchronously gets the AI's best move
     * @param {Array} board - Current board state
     * @returns {number|null} Index of the best move
     */
    function getMove(board) {
        return findBestMove(board);
    }

    /**
     * Finds a random valid move for the easy AI
     * This allows players to actually win against the AI
     * @param {Array} board - Current board state
     * @returns {number|null} Index of a random valid move, or null if no moves available
     */
    function findRandomMove(board) {
        const emptyCells = getEmptyCells(board);

        if (emptyCells.length === 0) {
            return null;
        }

        // Pick a random empty cell
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }

    /**
     * Gets an easy AI move (random selection)
     * @param {Array} board - Current board state
     * @returns {number|null} Index of a random valid move
     */
    function getEasyMove(board) {
        return findRandomMove(board);
    }

    /**
     * Gets the AI's move with optional artificial delay, respecting difficulty level
     * @param {Array} board - Current board state
     * @param {number} delay - Delay in milliseconds before returning move
     * @param {string} difficulty - Difficulty level ('easy' or 'hard')
     * @returns {Promise<number|null>} Promise resolving to the move index
     */
    function getMoveWithDifficultyAndDelay(board, delay = 400, difficulty = 'hard') {
        return new Promise((resolve) => {
            // Calculate the move based on difficulty
            const move = difficulty === 'easy' ? findRandomMove(board) : findBestMove(board);

            // Add artificial delay for natural feel
            setTimeout(() => {
                resolve(move);
            }, delay);
        });
    }

    // Public API
    return {
        getMove,
        getMoveWithDelay,
        getMoveWithDifficultyAndDelay,
        findBestMove,
        findRandomMove,
        getEasyMove,
        minimax,
        checkWinner,
        isBoardFull,
        getEmptyCells
    };
})();

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI;
}
