/**
 * Main Module
 * Application entry point that orchestrates all game components.
 * Handles game flow, user interactions, and coordinates between modules.
 */

const App = (function() {
    'use strict';

    // Application state
    let scores = { wins: 0, losses: 0, draws: 0 };
    let soundEnabled = true;
    let isProcessingMove = false;

    // AI thinking delay (ms) for natural feel
    const AI_DELAY = 400;

    /**
     * Initializes the application
     */
    async function init() {
        // Initialize UI first
        UI.init();

        // Load saved preferences
        scores = Storage.loadScores();
        soundEnabled = Storage.loadSoundEnabled();

        // Initialize sound system
        await Sound.init(soundEnabled);

        // Update UI with loaded state
        UI.updateScores(scores);
        UI.updateSoundButton(soundEnabled);

        // Setup event handlers
        UI.setupEventListeners({
            onCellClick: handleCellClick,
            onNewGame: handleNewGame,
            onResetScoresClick: handleResetScoresClick,
            onSoundToggle: handleSoundToggle,
            onModalClose: handleModalClose,
            onResetConfirm: handleResetConfirm,
            onResetCancel: handleResetCancel
        });

        // Set up game callbacks
        Game.setOnStateChange(handleGameStateChange);
        Game.setOnGameEnd(handleGameEnd);

        // Start the first game
        startNewGame();
    }

    /**
     * Starts a new game with random first player
     */
    function startNewGame() {
        // Randomly decide who goes first (true = AI first)
        const aiFirst = Math.random() < 0.5;

        // Reset board display
        UI.resetBoard();

        // Initialize game state
        Game.init(aiFirst);

        // If AI goes first, trigger AI move
        if (aiFirst) {
            triggerAIMove();
        }
    }

    /**
     * Handles cell click events
     * @param {number} index - Cell index (0-8)
     */
    function handleCellClick(index) {
        // Ignore clicks during AI turn or if processing
        if (isProcessingMove || !Game.isPlayerTurn()) {
            return;
        }

        // Attempt the move
        if (Game.isValidMove(index)) {
            isProcessingMove = true;

            // Play sound
            Sound.play('placeX');

            // Make the move
            Game.makeMove(index);

            isProcessingMove = false;

            // If game continues and it's AI's turn, trigger AI
            if (!Game.isGameOver() && Game.isAITurn()) {
                triggerAIMove();
            }
        }
    }

    /**
     * Triggers the AI to make a move
     */
    async function triggerAIMove() {
        isProcessingMove = true;

        // Show thinking indicator
        UI.showAIThinking();
        UI.disableBoard();

        // Get AI move with delay
        const board = Game.getBoard();
        const move = await AI.getMoveWithDelay(board, AI_DELAY);

        // Play sound
        Sound.play('placeO');

        // Make the move
        if (move !== null) {
            Game.makeMove(move);
        }

        isProcessingMove = false;

        // Re-enable board if game continues
        if (!Game.isGameOver()) {
            UI.enableBoard(Game.getBoard());
        }
    }

    /**
     * Handles game state changes
     * @param {Object} state - Current game state
     */
    function handleGameStateChange(state) {
        // Update cell display
        UI.renderBoard(state.board);

        // Update turn indicator
        if (!state.gameOver) {
            UI.updateTurnIndicator(state.currentPlayer);
        }
    }

    /**
     * Handles game end events
     * @param {Object} state - Final game state
     */
    function handleGameEnd(state) {
        const { winner, winningLine } = state;

        // Disable board
        UI.disableBoard();

        // Update scores
        if (winner === 'X') {
            scores.wins++;
            Sound.play('victory');
        } else if (winner === 'O') {
            scores.losses++;
            Sound.play('defeat');
        } else {
            scores.draws++;
            Sound.play('draw');
        }

        // Save and display scores
        Storage.saveScores(scores);
        UI.updateScores(scores);

        // Show winning line animation
        if (winningLine) {
            UI.highlightWinningCells(winningLine);
            UI.drawWinningLine(winningLine);
        }

        // Show result modal after animation
        setTimeout(() => {
            UI.showResultModal(winner);
        }, 600);
    }

    /**
     * Handles new game button click
     */
    function handleNewGame() {
        Sound.play('click');
        UI.hideResultModal();
        startNewGame();
    }

    /**
     * Handles reset scores button click
     */
    function handleResetScoresClick() {
        Sound.play('click');
        UI.showResetModal();
    }

    /**
     * Handles reset confirmation
     */
    function handleResetConfirm() {
        Sound.play('click');
        scores = Storage.resetScores();
        UI.updateScores(scores);
        UI.hideResetModal();
    }

    /**
     * Handles reset cancellation
     */
    function handleResetCancel() {
        Sound.play('click');
        UI.hideResetModal();
    }

    /**
     * Handles sound toggle
     */
    function handleSoundToggle() {
        soundEnabled = Sound.toggle();
        Storage.saveSoundEnabled(soundEnabled);
        UI.updateSoundButton(soundEnabled);

        // Play click sound if sound was just enabled
        if (soundEnabled) {
            Sound.play('click');
        }
    }

    /**
     * Handles result modal close
     */
    function handleModalClose() {
        Sound.play('click');
        UI.hideResultModal();
        startNewGame();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API (mostly for testing/debugging)
    return {
        startNewGame,
        getScores: () => ({ ...scores }),
        isSoundEnabled: () => soundEnabled
    };
})();

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
