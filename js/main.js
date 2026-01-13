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
    let difficulty = 'hard';  // 'easy' or 'hard'
    let symbolChoice = 'random';  // 'X', 'O', or 'random'
    let currentPlayerSymbol = 'X';  // The actual symbol for current game (resolved from symbolChoice)
    let playerName = '';  // Player's display name
    let theme = 'default';  // 'default' or 'terminal'
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
        difficulty = Storage.loadDifficulty();
        symbolChoice = Storage.loadPlayerSymbol();
        playerName = Storage.loadPlayerName();
        theme = Storage.loadTheme();

        // Initialize sound system
        await Sound.init(soundEnabled);

        // Apply theme immediately (before other UI updates for visual consistency)
        UI.applyTheme(theme);

        // Update UI with loaded state
        UI.updateScores(scores);
        UI.updateSoundButton(soundEnabled);
        UI.updateDifficultyButtons(difficulty);
        UI.updateSymbolButtons(symbolChoice);
        UI.updateGreeting(playerName);
        UI.updateThemeButtons(theme);

        // Setup event handlers
        UI.setupEventListeners({
            onCellClick: handleCellClick,
            onNewGame: handleNewGame,
            onResetScoresClick: handleResetScoresClick,
            onSoundToggle: handleSoundToggle,
            onModalClose: handleModalClose,
            onResetConfirm: handleResetConfirm,
            onResetCancel: handleResetCancel,
            onDifficultyChange: handleDifficultyChange,
            onSymbolChange: handleSymbolChange,
            onEditNameClick: handleEditNameClick,
            onNameSave: handleNameSave,
            onNameCancel: handleNameCancel,
            onThemeChange: handleThemeChange
        });

        // Set up game callbacks
        Game.setOnStateChange(handleGameStateChange);
        Game.setOnGameEnd(handleGameEnd);

        // Start the first game
        startNewGame();
    }

    /**
     * Determines the player's symbol for the current game based on their choice
     * @returns {string} 'X' or 'O'
     */
    function resolvePlayerSymbol() {
        if (symbolChoice === 'random') {
            // 50/50 chance for X or O
            return Math.random() < 0.5 ? 'X' : 'O';
        }
        return symbolChoice;
    }

    /**
     * Starts a new game with the player's chosen (or randomly assigned) symbol
     */
    function startNewGame() {
        // Determine the player's symbol for this game
        currentPlayerSymbol = resolvePlayerSymbol();

        // Reset board display
        UI.resetBoard();

        // Initialize game state with the player's symbol
        // Game.init now takes playerSymbol ('X' or 'O') instead of aiFirst boolean
        Game.init(currentPlayerSymbol);

        // Update hint to show which symbol was assigned
        UI.updateSymbolHintForGame(currentPlayerSymbol, symbolChoice);

        // X always goes first. If player is O, that means AI (X) goes first.
        if (currentPlayerSymbol === 'O') {
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

            // Play sound based on player's symbol
            Sound.play(currentPlayerSymbol === 'X' ? 'placeX' : 'placeO');

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
     * Uses the current difficulty setting to determine move strategy
     */
    async function triggerAIMove() {
        isProcessingMove = true;

        // Show thinking indicator
        UI.showAIThinking(currentPlayerSymbol);
        UI.disableBoard();

        // Get AI move with delay, respecting difficulty setting
        // The AI module needs to know which symbol it's playing as
        const board = Game.getBoard();
        const aiSymbol = Game.getAISymbol();
        const move = await AI.getMoveWithDifficultyAndDelay(board, AI_DELAY, difficulty, aiSymbol);

        // Play sound based on AI's symbol
        Sound.play(aiSymbol === 'X' ? 'placeX' : 'placeO');

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

        // Update turn indicator with player's symbol context
        if (!state.gameOver) {
            UI.updateTurnIndicator(state.currentPlayer, false, state.playerSymbol);
        }
    }

    /**
     * Handles game end events
     * @param {Object} state - Final game state
     */
    function handleGameEnd(state) {
        const { winner, winningLine, playerSymbol } = state;

        // Disable board
        UI.disableBoard();

        // Update scores based on who won relative to player's symbol
        if (winner === playerSymbol) {
            // Player won
            scores.wins++;
            Sound.play('victory');
        } else if (winner === 'draw') {
            scores.draws++;
            Sound.play('draw');
        } else {
            // AI won
            scores.losses++;
            Sound.play('defeat');
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
            UI.showResultModal(winner, playerSymbol);
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
     * Handles difficulty change
     * @param {string} newDifficulty - The new difficulty level ('easy' or 'hard')
     */
    function handleDifficultyChange(newDifficulty) {
        // Only process if difficulty is actually changing
        if (newDifficulty === difficulty) {
            return;
        }

        Sound.play('click');

        // Update difficulty state
        difficulty = newDifficulty;

        // Save preference
        Storage.saveDifficulty(difficulty);

        // Update UI
        UI.updateDifficultyButtons(difficulty);

        // Start a new game with the new difficulty
        startNewGame();
    }

    /**
     * Handles symbol choice change
     * @param {string} newSymbolChoice - The new symbol choice ('X', 'O', or 'random')
     */
    function handleSymbolChange(newSymbolChoice) {
        // Only process if symbol choice is actually changing
        if (newSymbolChoice === symbolChoice) {
            return;
        }

        Sound.play('click');

        // Update symbol choice state
        symbolChoice = newSymbolChoice;

        // Save preference
        Storage.savePlayerSymbol(symbolChoice);

        // Update UI
        UI.updateSymbolButtons(symbolChoice);

        // Start a new game with the new symbol
        startNewGame();
    }

    /**
     * Handles theme change
     * @param {string} newTheme - The new theme ('default' or 'terminal')
     */
    function handleThemeChange(newTheme) {
        // Only process if theme is actually changing
        if (newTheme === theme) {
            return;
        }

        Sound.play('click');

        // Update theme state
        theme = newTheme;

        // Save preference
        Storage.saveTheme(theme);

        // Apply theme to document (CSS custom properties change)
        UI.applyTheme(theme);

        // Update UI buttons
        UI.updateThemeButtons(theme);
    }

    /**
     * Handles result modal close
     */
    function handleModalClose() {
        Sound.play('click');
        UI.hideResultModal();
        startNewGame();
    }

    /**
     * Handles edit name button click - opens the name modal
     */
    function handleEditNameClick() {
        Sound.play('click');
        // Show modal with current name pre-filled (unescaped for editing)
        // Note: We need to unescape the stored name for editing
        const unescapedName = playerName
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");
        UI.showNameModal(unescapedName);
    }

    /**
     * Handles saving the player name from the modal
     */
    function handleNameSave() {
        Sound.play('click');

        // Get the raw input value
        const rawName = UI.getNameInputValue();

        // Save to storage (sanitization happens in Storage module)
        Storage.savePlayerName(rawName);

        // Reload the sanitized name
        playerName = Storage.loadPlayerName();

        // Update the greeting display
        UI.updateGreeting(playerName);

        // Close the modal
        UI.hideNameModal();
    }

    /**
     * Handles canceling the name modal
     */
    function handleNameCancel() {
        Sound.play('click');
        UI.hideNameModal();
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
        isSoundEnabled: () => soundEnabled,
        getDifficulty: () => difficulty,
        getSymbolChoice: () => symbolChoice,
        getCurrentPlayerSymbol: () => currentPlayerSymbol,
        getPlayerName: () => playerName,
        getTheme: () => theme
    };
})();

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
