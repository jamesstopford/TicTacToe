/**
 * UI Module
 * Handles all DOM manipulation and rendering for the TicTacToe game.
 * Manages board display, modals, score updates, and visual feedback.
 */

const UI = (function() {
    'use strict';

    // DOM element references (cached on init)
    let elements = {};

    // Board geometry for winning line calculation
    const CELL_POSITIONS = {
        // Center points of each cell (relative to board, as percentages)
        0: { x: 16.67, y: 16.67 },
        1: { x: 50.00, y: 16.67 },
        2: { x: 83.33, y: 16.67 },
        3: { x: 16.67, y: 50.00 },
        4: { x: 50.00, y: 50.00 },
        5: { x: 83.33, y: 50.00 },
        6: { x: 16.67, y: 83.33 },
        7: { x: 50.00, y: 83.33 },
        8: { x: 83.33, y: 83.33 }
    };

    /**
     * Caches DOM element references for performance
     */
    function cacheElements() {
        elements = {
            // Board
            gameBoard: document.getElementById('game-board'),
            cells: document.querySelectorAll('.cell'),
            winningLine: document.getElementById('winning-line'),

            // Turn indicator
            turnText: document.getElementById('turn-text'),
            turnIndicator: document.querySelector('.turn-indicator'),
            thinkingDots: document.getElementById('thinking-dots'),

            // Scores
            winsCount: document.getElementById('wins-count'),
            lossesCount: document.getElementById('losses-count'),
            drawsCount: document.getElementById('draws-count'),

            // Controls
            newGameBtn: document.getElementById('new-game-btn'),
            resetScoresBtn: document.getElementById('reset-scores-btn'),
            soundToggleBtn: document.getElementById('sound-toggle-btn'),

            // Result Modal
            modalOverlay: document.getElementById('modal-overlay'),
            modalTitle: document.getElementById('modal-title'),
            modalMessage: document.getElementById('modal-message'),
            modalCloseBtn: document.getElementById('modal-close-btn'),

            // Reset Modal
            resetModalOverlay: document.getElementById('reset-modal-overlay'),
            resetConfirmBtn: document.getElementById('reset-confirm-btn'),
            resetCancelBtn: document.getElementById('reset-cancel-btn'),

            // Difficulty Selector
            difficultyEasyBtn: document.getElementById('difficulty-easy'),
            difficultyHardBtn: document.getElementById('difficulty-hard')
        };
    }

    /**
     * Initializes the UI module
     */
    function init() {
        cacheElements();
    }

    /**
     * Renders the game board based on current state
     * @param {Array} board - Array of 9 cells ('', 'X', or 'O')
     */
    function renderBoard(board) {
        elements.cells.forEach((cell, index) => {
            const mark = board[index];

            // Clear previous state
            cell.classList.remove('cell-x', 'cell-o', 'winning-cell');
            cell.removeAttribute('data-mark');

            if (mark === 'X') {
                cell.classList.add('cell-x');
                cell.setAttribute('data-mark', 'X');
                cell.setAttribute('aria-label', `Cell ${index + 1}, X`);
                cell.disabled = true;
            } else if (mark === 'O') {
                cell.classList.add('cell-o');
                cell.setAttribute('data-mark', 'O');
                cell.setAttribute('aria-label', `Cell ${index + 1}, O`);
                cell.disabled = true;
            } else {
                cell.setAttribute('aria-label', `Cell ${index + 1}, empty`);
                cell.disabled = false;
            }
        });
    }

    /**
     * Updates a single cell with a new mark (with animation)
     * @param {number} index - Cell index (0-8)
     * @param {string} mark - 'X' or 'O'
     */
    function updateCell(index, mark) {
        const cell = elements.cells[index];
        if (!cell) return;

        if (mark === 'X') {
            cell.classList.add('cell-x');
            cell.setAttribute('data-mark', 'X');
            cell.setAttribute('aria-label', `Cell ${index + 1}, X`);
        } else if (mark === 'O') {
            cell.classList.add('cell-o');
            cell.setAttribute('data-mark', 'O');
            cell.setAttribute('aria-label', `Cell ${index + 1}, O`);
        }

        cell.disabled = true;
    }

    /**
     * Disables all cells (during AI turn or game over)
     */
    function disableBoard() {
        elements.cells.forEach(cell => {
            cell.disabled = true;
        });
    }

    /**
     * Enables empty cells (player's turn)
     * @param {Array} board - Current board state
     */
    function enableBoard(board) {
        elements.cells.forEach((cell, index) => {
            cell.disabled = board[index] !== '';
        });
    }

    /**
     * Updates the turn indicator
     * @param {string} currentPlayer - 'X' or 'O'
     * @param {boolean} isThinking - Whether AI is thinking
     */
    function updateTurnIndicator(currentPlayer, isThinking = false) {
        elements.turnIndicator.classList.remove('player-turn', 'ai-turn');

        if (currentPlayer === 'X') {
            elements.turnIndicator.classList.add('player-turn');
            elements.turnText.textContent = 'YOUR TURN';
            elements.thinkingDots.hidden = true;
        } else {
            elements.turnIndicator.classList.add('ai-turn');
            elements.turnText.textContent = isThinking ? 'AI THINKING' : 'AI TURN';
            elements.thinkingDots.hidden = !isThinking;
        }
    }

    /**
     * Shows the AI thinking indicator
     */
    function showAIThinking() {
        updateTurnIndicator('O', true);
    }

    /**
     * Updates the score display
     * @param {Object} scores - Object with wins, losses, draws
     */
    function updateScores(scores) {
        elements.winsCount.textContent = scores.wins;
        elements.lossesCount.textContent = scores.losses;
        elements.drawsCount.textContent = scores.draws;
    }

    /**
     * Updates the sound toggle button state
     * @param {boolean} enabled - Whether sound is enabled
     */
    function updateSoundButton(enabled) {
        elements.soundToggleBtn.setAttribute('aria-pressed', enabled.toString());
        elements.soundToggleBtn.setAttribute(
            'aria-label',
            enabled ? 'Mute sound' : 'Unmute sound'
        );
    }

    /**
     * Updates the difficulty selector buttons to reflect current difficulty
     * @param {string} difficulty - Current difficulty ('easy' or 'hard')
     */
    function updateDifficultyButtons(difficulty) {
        // Update easy button
        if (difficulty === 'easy') {
            elements.difficultyEasyBtn.classList.add('active');
            elements.difficultyEasyBtn.setAttribute('aria-checked', 'true');
            elements.difficultyHardBtn.classList.remove('active');
            elements.difficultyHardBtn.setAttribute('aria-checked', 'false');
        } else {
            elements.difficultyEasyBtn.classList.remove('active');
            elements.difficultyEasyBtn.setAttribute('aria-checked', 'false');
            elements.difficultyHardBtn.classList.add('active');
            elements.difficultyHardBtn.setAttribute('aria-checked', 'true');
        }
    }

    /**
     * Highlights the winning cells
     * @param {Array<number>} winningLine - Array of 3 cell indices
     */
    function highlightWinningCells(winningLine) {
        if (!winningLine) return;

        winningLine.forEach(index => {
            elements.cells[index].classList.add('winning-cell');
        });
    }

    /**
     * Draws the winning line SVG
     * @param {Array<number>} winningLine - Array of 3 cell indices
     */
    function drawWinningLine(winningLine) {
        if (!winningLine) return;

        const line = elements.winningLine.querySelector('line');
        const start = CELL_POSITIONS[winningLine[0]];
        const end = CELL_POSITIONS[winningLine[2]];

        // Set line coordinates as percentages
        line.setAttribute('x1', `${start.x}%`);
        line.setAttribute('y1', `${start.y}%`);
        line.setAttribute('x2', `${end.x}%`);
        line.setAttribute('y2', `${end.y}%`);

        // Trigger animation
        elements.winningLine.classList.add('animate');
    }

    /**
     * Clears the winning line
     */
    function clearWinningLine() {
        const line = elements.winningLine.querySelector('line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', '0');
        line.setAttribute('x2', '0');
        line.setAttribute('y2', '0');
        elements.winningLine.classList.remove('animate');
    }

    /**
     * Shows the result modal
     * @param {string} winner - 'X', 'O', or 'draw'
     */
    function showResultModal(winner) {
        // Remove previous result classes
        elements.modalOverlay.classList.remove('result-win', 'result-lose', 'result-draw');

        if (winner === 'X') {
            // Player wins (rare, shouldn't happen with perfect AI)
            elements.modalOverlay.classList.add('result-win');
            elements.modalTitle.textContent = 'VICTORY!';
            elements.modalMessage.textContent = 'Impressive! You managed to beat the AI!';
        } else if (winner === 'O') {
            // AI wins
            elements.modalOverlay.classList.add('result-lose');
            elements.modalTitle.textContent = 'DEFEAT';
            elements.modalMessage.textContent = 'The AI wins this round. Can you find a way to beat it?';
        } else {
            // Draw
            elements.modalOverlay.classList.add('result-draw');
            elements.modalTitle.textContent = 'DRAW';
            elements.modalMessage.textContent = 'A perfect stalemate. The only winning move is not to play... or is it?';
        }

        elements.modalOverlay.hidden = false;

        // Focus the close button for accessibility
        setTimeout(() => {
            elements.modalCloseBtn.focus();
        }, 100);
    }

    /**
     * Hides the result modal
     */
    function hideResultModal() {
        elements.modalOverlay.hidden = true;
    }

    /**
     * Shows the reset confirmation modal
     */
    function showResetModal() {
        elements.resetModalOverlay.hidden = false;

        // Focus the cancel button for accessibility (safer default)
        setTimeout(() => {
            elements.resetCancelBtn.focus();
        }, 100);
    }

    /**
     * Hides the reset confirmation modal
     */
    function hideResetModal() {
        elements.resetModalOverlay.hidden = true;
    }

    /**
     * Resets the board display for a new game
     */
    function resetBoard() {
        elements.cells.forEach((cell, index) => {
            cell.classList.remove('cell-x', 'cell-o', 'winning-cell');
            cell.removeAttribute('data-mark');
            cell.setAttribute('aria-label', `Cell ${index + 1}, empty`);
            cell.disabled = false;
        });

        clearWinningLine();
    }

    /**
     * Gets the cell index from a click event
     * @param {Event} event - Click event
     * @returns {number|null} Cell index or null if not a cell
     */
    function getCellIndexFromEvent(event) {
        const cell = event.target.closest('.cell');
        if (!cell) return null;

        const index = parseInt(cell.dataset.index, 10);
        return isNaN(index) ? null : index;
    }

    /**
     * Sets up event listeners
     * @param {Object} handlers - Object with event handler functions
     */
    function setupEventListeners(handlers) {
        // Cell clicks
        elements.gameBoard.addEventListener('click', (event) => {
            const index = getCellIndexFromEvent(event);
            if (index !== null && handlers.onCellClick) {
                handlers.onCellClick(index);
            }
        });

        // Keyboard navigation for cells
        elements.gameBoard.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                const index = getCellIndexFromEvent(event);
                if (index !== null && handlers.onCellClick) {
                    event.preventDefault();
                    handlers.onCellClick(index);
                }
            }
        });

        // New Game button
        elements.newGameBtn.addEventListener('click', () => {
            if (handlers.onNewGame) {
                handlers.onNewGame();
            }
        });

        // Reset Scores button
        elements.resetScoresBtn.addEventListener('click', () => {
            if (handlers.onResetScoresClick) {
                handlers.onResetScoresClick();
            }
        });

        // Sound toggle button
        elements.soundToggleBtn.addEventListener('click', () => {
            if (handlers.onSoundToggle) {
                handlers.onSoundToggle();
            }
        });

        // Result modal close button
        elements.modalCloseBtn.addEventListener('click', () => {
            if (handlers.onModalClose) {
                handlers.onModalClose();
            }
        });

        // Reset modal buttons
        elements.resetConfirmBtn.addEventListener('click', () => {
            if (handlers.onResetConfirm) {
                handlers.onResetConfirm();
            }
        });

        elements.resetCancelBtn.addEventListener('click', () => {
            if (handlers.onResetCancel) {
                handlers.onResetCancel();
            }
        });

        // Close modals on escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (!elements.modalOverlay.hidden && handlers.onModalClose) {
                    handlers.onModalClose();
                }
                if (!elements.resetModalOverlay.hidden && handlers.onResetCancel) {
                    handlers.onResetCancel();
                }
            }
        });

        // Close modals on overlay click
        elements.modalOverlay.addEventListener('click', (event) => {
            if (event.target === elements.modalOverlay && handlers.onModalClose) {
                handlers.onModalClose();
            }
        });

        elements.resetModalOverlay.addEventListener('click', (event) => {
            if (event.target === elements.resetModalOverlay && handlers.onResetCancel) {
                handlers.onResetCancel();
            }
        });

        // Difficulty selector buttons
        elements.difficultyEasyBtn.addEventListener('click', () => {
            if (handlers.onDifficultyChange) {
                handlers.onDifficultyChange('easy');
            }
        });

        elements.difficultyHardBtn.addEventListener('click', () => {
            if (handlers.onDifficultyChange) {
                handlers.onDifficultyChange('hard');
            }
        });
    }

    /**
     * Gets cached DOM elements
     * @returns {Object} Cached element references
     */
    function getElements() {
        return elements;
    }

    // Public API
    return {
        init,
        renderBoard,
        updateCell,
        disableBoard,
        enableBoard,
        updateTurnIndicator,
        showAIThinking,
        updateScores,
        updateSoundButton,
        updateDifficultyButtons,
        highlightWinningCells,
        drawWinningLine,
        clearWinningLine,
        showResultModal,
        hideResultModal,
        showResetModal,
        hideResetModal,
        resetBoard,
        setupEventListeners,
        getElements
    };
})();

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
