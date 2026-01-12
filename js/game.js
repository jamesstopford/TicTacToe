/**
 * Game Module
 * Handles core game state and logic for TicTacToe.
 * Includes board management, move validation, and win/draw detection.
 */

const Game = (function() {
    'use strict';

    // Constants
    const PLAYER_X = 'X';  // Human player
    const PLAYER_O = 'O';  // AI player
    const EMPTY = '';

    // All possible winning combinations (indices into the board array)
    const WINNING_COMBINATIONS = [
        [0, 1, 2],  // Top row
        [3, 4, 5],  // Middle row
        [6, 7, 8],  // Bottom row
        [0, 3, 6],  // Left column
        [1, 4, 7],  // Middle column
        [2, 5, 8],  // Right column
        [0, 4, 8],  // Diagonal: top-left to bottom-right
        [2, 4, 6]   // Diagonal: top-right to bottom-left
    ];

    // Game state
    let state = {
        board: [],
        currentPlayer: PLAYER_X,
        gameOver: false,
        winner: null,  // null, 'X', 'O', or 'draw'
        winningLine: null,  // null or [index, index, index]
        playerSymbol: PLAYER_X,  // Which symbol the human player is using
        aiSymbol: PLAYER_O       // Which symbol the AI is using
    };

    // Event callbacks
    let onStateChange = null;
    let onGameEnd = null;

    /**
     * Creates a fresh game state
     * @param {string} playerSymbol - The symbol the human player uses ('X' or 'O')
     * @returns {Object} New game state object
     */
    function createInitialState(playerSymbol = PLAYER_X) {
        const aiSymbol = playerSymbol === PLAYER_X ? PLAYER_O : PLAYER_X;
        return {
            board: Array(9).fill(EMPTY),
            currentPlayer: PLAYER_X,  // X always goes first in tic-tac-toe
            gameOver: false,
            winner: null,
            winningLine: null,
            playerSymbol: playerSymbol,
            aiSymbol: aiSymbol
        };
    }

    /**
     * Initializes or resets the game
     * @param {string} playerSymbol - The symbol the human player uses ('X' or 'O'). Defaults to 'X'.
     *                                When player is X, player goes first. When player is O, AI goes first.
     */
    function init(playerSymbol = PLAYER_X) {
        // Validate playerSymbol
        if (playerSymbol !== PLAYER_X && playerSymbol !== PLAYER_O) {
            playerSymbol = PLAYER_X;
        }

        state = createInitialState(playerSymbol);
        // X always goes first in tic-tac-toe, so currentPlayer is always X
        // Whether that's the human or AI depends on playerSymbol
        state.currentPlayer = PLAYER_X;

        notifyStateChange();
    }

    /**
     * Checks if a move is valid
     * @param {number} index - Board position (0-8)
     * @returns {boolean} True if the move is valid
     */
    function isValidMove(index) {
        return (
            !state.gameOver &&
            index >= 0 &&
            index < 9 &&
            state.board[index] === EMPTY
        );
    }

    /**
     * Makes a move at the specified position
     * @param {number} index - Board position (0-8)
     * @returns {boolean} True if move was made successfully
     */
    function makeMove(index) {
        if (!isValidMove(index)) {
            return false;
        }

        // Place the mark
        state.board[index] = state.currentPlayer;

        // Check for game end
        const result = checkGameEnd(state.board);

        if (result.ended) {
            state.gameOver = true;
            state.winner = result.winner;
            state.winningLine = result.winningLine;

            notifyStateChange();
            notifyGameEnd();
            return true;
        }

        // Switch player
        state.currentPlayer = state.currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;

        notifyStateChange();
        return true;
    }

    /**
     * Checks if the game has ended (win or draw)
     * @param {Array} board - The board state to check
     * @returns {Object} Result with ended, winner, and winningLine properties
     */
    function checkGameEnd(board) {
        // Check for a winner
        for (const combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            if (board[a] !== EMPTY &&
                board[a] === board[b] &&
                board[a] === board[c]) {
                return {
                    ended: true,
                    winner: board[a],
                    winningLine: combo
                };
            }
        }

        // Check for draw (board full, no winner)
        if (board.every(cell => cell !== EMPTY)) {
            return {
                ended: true,
                winner: 'draw',
                winningLine: null
            };
        }

        // Game continues
        return {
            ended: false,
            winner: null,
            winningLine: null
        };
    }

    /**
     * Gets the current game state
     * @returns {Object} Copy of the current state
     */
    function getState() {
        return {
            board: [...state.board],
            currentPlayer: state.currentPlayer,
            gameOver: state.gameOver,
            winner: state.winner,
            winningLine: state.winningLine ? [...state.winningLine] : null,
            playerSymbol: state.playerSymbol,
            aiSymbol: state.aiSymbol
        };
    }

    /**
     * Gets the board array
     * @returns {Array} Copy of the board
     */
    function getBoard() {
        return [...state.board];
    }

    /**
     * Gets the current player
     * @returns {string} 'X' or 'O'
     */
    function getCurrentPlayer() {
        return state.currentPlayer;
    }

    /**
     * Checks if it's currently the human player's turn
     * @returns {boolean} True if it's the human player's turn
     */
    function isPlayerTurn() {
        return state.currentPlayer === state.playerSymbol && !state.gameOver;
    }

    /**
     * Checks if it's currently the AI's turn
     * @returns {boolean} True if it's the AI's turn
     */
    function isAITurn() {
        return state.currentPlayer === state.aiSymbol && !state.gameOver;
    }

    /**
     * Gets the symbol the human player is using
     * @returns {string} 'X' or 'O'
     */
    function getPlayerSymbol() {
        return state.playerSymbol;
    }

    /**
     * Gets the symbol the AI is using
     * @returns {string} 'X' or 'O'
     */
    function getAISymbol() {
        return state.aiSymbol;
    }

    /**
     * Checks if the game is over
     * @returns {boolean} True if game has ended
     */
    function isGameOver() {
        return state.gameOver;
    }

    /**
     * Gets available (empty) positions on the board
     * @returns {Array<number>} Array of empty cell indices
     */
    function getAvailableMoves() {
        const moves = [];
        for (let i = 0; i < state.board.length; i++) {
            if (state.board[i] === EMPTY) {
                moves.push(i);
            }
        }
        return moves;
    }

    /**
     * Sets the callback for state changes
     * @param {Function} callback - Function to call on state change
     */
    function setOnStateChange(callback) {
        onStateChange = callback;
    }

    /**
     * Sets the callback for game end
     * @param {Function} callback - Function to call when game ends
     */
    function setOnGameEnd(callback) {
        onGameEnd = callback;
    }

    /**
     * Notifies listeners of state change
     */
    function notifyStateChange() {
        if (typeof onStateChange === 'function') {
            onStateChange(getState());
        }
    }

    /**
     * Notifies listeners of game end
     */
    function notifyGameEnd() {
        if (typeof onGameEnd === 'function') {
            onGameEnd(getState());
        }
    }

    // Expose constants for other modules
    const constants = {
        PLAYER_X,
        PLAYER_O,
        EMPTY,
        WINNING_COMBINATIONS
    };

    // Public API
    return {
        init,
        makeMove,
        isValidMove,
        getState,
        getBoard,
        getCurrentPlayer,
        isPlayerTurn,
        isAITurn,
        getPlayerSymbol,
        getAISymbol,
        isGameOver,
        getAvailableMoves,
        checkGameEnd,
        setOnStateChange,
        setOnGameEnd,
        constants
    };
})();

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}
