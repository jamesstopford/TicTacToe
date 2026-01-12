/**
 * Storage Module
 * Handles localStorage operations for game scores and preferences.
 * Includes graceful fallback when localStorage is unavailable.
 */

const Storage = (function() {
    'use strict';

    // Storage keys
    const KEYS = {
        SCORES: 'tictactoe_scores',
        SOUND_ENABLED: 'tictactoe_sound_enabled',
        DIFFICULTY: 'tictactoe_difficulty',
        PLAYER_SYMBOL: 'tictactoe_player_symbol'
    };

    // Difficulty levels
    const DIFFICULTY = {
        EASY: 'easy',
        HARD: 'hard'
    };

    const DEFAULT_DIFFICULTY = DIFFICULTY.HARD;

    // Player symbol choices
    const SYMBOL_CHOICE = {
        X: 'X',
        O: 'O',
        RANDOM: 'random'
    };

    const DEFAULT_SYMBOL_CHOICE = SYMBOL_CHOICE.RANDOM;

    // Default values
    const DEFAULT_SCORES = {
        wins: 0,
        losses: 0,
        draws: 0
    };

    const DEFAULT_SOUND_ENABLED = true;

    // Check if localStorage is available
    let storageAvailable = false;

    /**
     * Tests whether localStorage is available and functional
     * @returns {boolean} True if localStorage can be used
     */
    function testLocalStorage() {
        try {
            const testKey = '__storage_test__';
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Initializes the storage module by testing localStorage availability
     */
    function init() {
        storageAvailable = testLocalStorage();
        if (!storageAvailable) {
            console.warn('localStorage is not available. Scores and preferences will not persist.');
        }
    }

    /**
     * Safely retrieves and parses JSON from localStorage
     * @param {string} key - The storage key
     * @param {*} defaultValue - Default value if key doesn't exist or parse fails
     * @returns {*} The parsed value or default
     */
    function getItem(key, defaultValue) {
        if (!storageAvailable) {
            return defaultValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (e) {
            console.warn(`Failed to parse stored value for key "${key}":`, e);
            return defaultValue;
        }
    }

    /**
     * Safely stringifies and stores a value in localStorage
     * @param {string} key - The storage key
     * @param {*} value - The value to store
     * @returns {boolean} True if storage was successful
     */
    function setItem(key, value) {
        if (!storageAvailable) {
            return false;
        }

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn(`Failed to store value for key "${key}":`, e);
            return false;
        }
    }

    /**
     * Loads scores from localStorage
     * @returns {Object} Scores object with wins, losses, draws
     */
    function loadScores() {
        const scores = getItem(KEYS.SCORES, null);

        // Validate scores structure
        if (scores !== null &&
            typeof scores === 'object' &&
            typeof scores.wins === 'number' &&
            typeof scores.losses === 'number' &&
            typeof scores.draws === 'number') {
            return {
                wins: Math.max(0, Math.floor(scores.wins)),
                losses: Math.max(0, Math.floor(scores.losses)),
                draws: Math.max(0, Math.floor(scores.draws))
            };
        }

        return { ...DEFAULT_SCORES };
    }

    /**
     * Saves scores to localStorage
     * @param {Object} scores - Scores object with wins, losses, draws
     * @returns {boolean} True if save was successful
     */
    function saveScores(scores) {
        if (!scores || typeof scores !== 'object') {
            return false;
        }

        return setItem(KEYS.SCORES, {
            wins: Math.max(0, Math.floor(scores.wins || 0)),
            losses: Math.max(0, Math.floor(scores.losses || 0)),
            draws: Math.max(0, Math.floor(scores.draws || 0))
        });
    }

    /**
     * Resets scores to zero
     * @returns {Object} The reset scores object
     */
    function resetScores() {
        const scores = { ...DEFAULT_SCORES };
        saveScores(scores);
        return scores;
    }

    /**
     * Loads sound enabled preference from localStorage
     * @returns {boolean} True if sound is enabled
     */
    function loadSoundEnabled() {
        const value = getItem(KEYS.SOUND_ENABLED, null);

        if (typeof value === 'boolean') {
            return value;
        }

        return DEFAULT_SOUND_ENABLED;
    }

    /**
     * Saves sound enabled preference to localStorage
     * @param {boolean} enabled - Whether sound is enabled
     * @returns {boolean} True if save was successful
     */
    function saveSoundEnabled(enabled) {
        return setItem(KEYS.SOUND_ENABLED, Boolean(enabled));
    }

    /**
     * Loads difficulty setting from localStorage
     * @returns {string} Difficulty level ('easy' or 'hard')
     */
    function loadDifficulty() {
        const value = getItem(KEYS.DIFFICULTY, null);

        // Validate that the value is a valid difficulty level
        if (value === DIFFICULTY.EASY || value === DIFFICULTY.HARD) {
            return value;
        }

        return DEFAULT_DIFFICULTY;
    }

    /**
     * Saves difficulty setting to localStorage
     * @param {string} difficulty - Difficulty level ('easy' or 'hard')
     * @returns {boolean} True if save was successful
     */
    function saveDifficulty(difficulty) {
        // Validate input - only accept valid difficulty values
        if (difficulty !== DIFFICULTY.EASY && difficulty !== DIFFICULTY.HARD) {
            return false;
        }
        return setItem(KEYS.DIFFICULTY, difficulty);
    }

    /**
     * Loads player symbol choice from localStorage
     * @returns {string} Symbol choice ('X', 'O', or 'random')
     */
    function loadPlayerSymbol() {
        const value = getItem(KEYS.PLAYER_SYMBOL, null);

        // Validate that the value is a valid symbol choice
        if (value === SYMBOL_CHOICE.X ||
            value === SYMBOL_CHOICE.O ||
            value === SYMBOL_CHOICE.RANDOM) {
            return value;
        }

        return DEFAULT_SYMBOL_CHOICE;
    }

    /**
     * Saves player symbol choice to localStorage
     * @param {string} symbol - Symbol choice ('X', 'O', or 'random')
     * @returns {boolean} True if save was successful
     */
    function savePlayerSymbol(symbol) {
        // Validate input - only accept valid symbol choice values
        if (symbol !== SYMBOL_CHOICE.X &&
            symbol !== SYMBOL_CHOICE.O &&
            symbol !== SYMBOL_CHOICE.RANDOM) {
            return false;
        }
        return setItem(KEYS.PLAYER_SYMBOL, symbol);
    }

    /**
     * Checks if storage is available
     * @returns {boolean} True if localStorage is functional
     */
    function isAvailable() {
        return storageAvailable;
    }

    // Initialize on load
    init();

    // Public API
    return {
        loadScores,
        saveScores,
        resetScores,
        loadSoundEnabled,
        saveSoundEnabled,
        loadDifficulty,
        saveDifficulty,
        loadPlayerSymbol,
        savePlayerSymbol,
        isAvailable,
        DIFFICULTY,
        SYMBOL_CHOICE
    };
})();

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
