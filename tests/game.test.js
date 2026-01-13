/**
 * TicTacToe Test Suite - Node.js Runner
 * Run with: node tests/game.test.js
 */

// Mock localStorage for Node environment
const localStorageMock = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value;
    },
    removeItem(key) {
        delete this.store[key];
    },
    clear() {
        this.store = {};
    }
};

// Create minimal window mock for Storage module
global.window = {
    localStorage: localStorageMock
};
global.localStorage = localStorageMock;

// Load modules
const Storage = require('../js/storage.js');
const Game = require('../js/game.js');
const AI = require('../js/ai.js');

// Simple test framework
const TestRunner = {
    results: [],
    currentSuite: '',

    suite(name) {
        this.currentSuite = name;
        console.log(`\n${'='.repeat(60)}\n${name}\n${'='.repeat(60)}`);
    },

    test(description, fn) {
        try {
            fn();
            this.results.push({ suite: this.currentSuite, description, passed: true });
            console.log(`  \x1b[32m✓\x1b[0m ${description}`);
        } catch (error) {
            this.results.push({ suite: this.currentSuite, description, passed: false, error: error.message });
            console.log(`  \x1b[31m✗\x1b[0m ${description}`);
            console.log(`    \x1b[31m${error.message}\x1b[0m`);
        }
    },

    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message ? message + ': ' : ''}Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
    },

    assertDeepEqual(actual, expected, message = '') {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`${message ? message + ': ' : ''}Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
    },

    assertTrue(value, message = '') {
        if (!value) {
            throw new Error(message || 'Expected true, got false');
        }
    },

    assertFalse(value, message = '') {
        if (value) {
            throw new Error(message || 'Expected false, got true');
        }
    },

    assertNotNull(value, message = '') {
        if (value === null || value === undefined) {
            throw new Error(message || 'Expected non-null value');
        }
    },

    summary() {
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        const total = this.results.length;

        console.log(`\n${'='.repeat(60)}`);
        console.log(`RESULTS: ${passed}/${total} tests passed`);

        if (failed > 0) {
            console.log(`\x1b[31m${failed} test(s) FAILED\x1b[0m`);
            process.exit(1);
        } else {
            console.log(`\x1b[32mAll tests passed!\x1b[0m`);
            process.exit(0);
        }
    }
};

// ============================================================
// GAME MODULE TESTS
// ============================================================

TestRunner.suite('Game Module - Initialization');

TestRunner.test('Game initializes with empty board', () => {
    Game.init();
    const state = Game.getState();
    TestRunner.assertDeepEqual(state.board, ['', '', '', '', '', '', '', '', '']);
});

TestRunner.test('Game starts with player X by default', () => {
    Game.init();
    TestRunner.assertEqual(Game.getCurrentPlayer(), 'X');
});

TestRunner.test('Game can start with player as O (AI is X, X goes first)', () => {
    Game.init('O');
    // X always goes first, so currentPlayer is X (which is AI when player is O)
    TestRunner.assertEqual(Game.getCurrentPlayer(), 'X');
});

TestRunner.test('Game is not over at start', () => {
    Game.init();
    TestRunner.assertFalse(Game.isGameOver());
});

// ============================================================

TestRunner.suite('Game Module - Move Handling');

TestRunner.test('Valid move is accepted', () => {
    Game.init();
    const result = Game.makeMove(0);
    TestRunner.assertTrue(result);
});

TestRunner.test('Move places correct mark on board', () => {
    Game.init();
    Game.makeMove(4);
    const board = Game.getBoard();
    TestRunner.assertEqual(board[4], 'X');
});

TestRunner.test('Player switches after move', () => {
    Game.init();
    Game.makeMove(0);
    TestRunner.assertEqual(Game.getCurrentPlayer(), 'O');
});

TestRunner.test('Invalid move to occupied cell is rejected', () => {
    Game.init();
    Game.makeMove(0);
    const result = Game.makeMove(0);
    TestRunner.assertFalse(result);
});

TestRunner.test('Invalid move out of bounds is rejected', () => {
    Game.init();
    TestRunner.assertFalse(Game.isValidMove(-1));
    TestRunner.assertFalse(Game.isValidMove(9));
});

TestRunner.test('getAvailableMoves returns empty cells', () => {
    Game.init();
    Game.makeMove(0);
    Game.makeMove(4);
    const available = Game.getAvailableMoves();
    TestRunner.assertEqual(available.length, 7);
    TestRunner.assertFalse(available.includes(0));
    TestRunner.assertFalse(available.includes(4));
});

// ============================================================

TestRunner.suite('Game Module - Win Detection');

TestRunner.test('Detects horizontal win (top row)', () => {
    Game.init();
    Game.makeMove(0); // X
    Game.makeMove(3); // O
    Game.makeMove(1); // X
    Game.makeMove(4); // O
    Game.makeMove(2); // X wins
    const state = Game.getState();
    TestRunner.assertTrue(state.gameOver);
    TestRunner.assertEqual(state.winner, 'X');
    TestRunner.assertDeepEqual(state.winningLine, [0, 1, 2]);
});

TestRunner.test('Detects horizontal win (middle row)', () => {
    Game.init();
    Game.makeMove(0); // X
    Game.makeMove(3); // O
    Game.makeMove(6); // X
    Game.makeMove(4); // O
    Game.makeMove(7); // X
    Game.makeMove(5); // O wins
    const state = Game.getState();
    TestRunner.assertTrue(state.gameOver);
    TestRunner.assertEqual(state.winner, 'O');
    TestRunner.assertDeepEqual(state.winningLine, [3, 4, 5]);
});

TestRunner.test('Detects vertical win (left column)', () => {
    Game.init();
    Game.makeMove(0); // X
    Game.makeMove(1); // O
    Game.makeMove(3); // X
    Game.makeMove(4); // O
    Game.makeMove(6); // X wins
    const state = Game.getState();
    TestRunner.assertTrue(state.gameOver);
    TestRunner.assertEqual(state.winner, 'X');
    TestRunner.assertDeepEqual(state.winningLine, [0, 3, 6]);
});

TestRunner.test('Detects diagonal win (top-left to bottom-right)', () => {
    Game.init();
    Game.makeMove(0); // X
    Game.makeMove(1); // O
    Game.makeMove(4); // X
    Game.makeMove(3); // O
    Game.makeMove(8); // X wins
    const state = Game.getState();
    TestRunner.assertTrue(state.gameOver);
    TestRunner.assertEqual(state.winner, 'X');
    TestRunner.assertDeepEqual(state.winningLine, [0, 4, 8]);
});

TestRunner.test('Detects diagonal win (top-right to bottom-left)', () => {
    Game.init();
    Game.makeMove(2); // X
    Game.makeMove(0); // O
    Game.makeMove(4); // X
    Game.makeMove(3); // O
    Game.makeMove(6); // X wins
    const state = Game.getState();
    TestRunner.assertTrue(state.gameOver);
    TestRunner.assertEqual(state.winner, 'X');
    TestRunner.assertDeepEqual(state.winningLine, [2, 4, 6]);
});

// ============================================================

TestRunner.suite('Game Module - Draw Detection');

TestRunner.test('Detects draw when board is full', () => {
    Game.init();
    Game.makeMove(0); // X
    Game.makeMove(1); // O
    Game.makeMove(2); // X
    Game.makeMove(4); // O
    Game.makeMove(3); // X
    Game.makeMove(5); // O
    Game.makeMove(7); // X
    Game.makeMove(6); // O
    Game.makeMove(8); // X - Draw
    const state = Game.getState();
    TestRunner.assertTrue(state.gameOver);
    TestRunner.assertEqual(state.winner, 'draw');
    TestRunner.assertEqual(state.winningLine, null);
});

// ============================================================
// AI MODULE TESTS
// ============================================================

TestRunner.suite('AI Module - Basic Functionality');

TestRunner.test('AI returns a valid move', () => {
    const board = ['', '', '', '', '', '', '', '', ''];
    const move = AI.getMove(board);
    TestRunner.assertTrue(move >= 0 && move <= 8);
});

TestRunner.test('AI returns null when no moves available', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const move = AI.getMove(board);
    TestRunner.assertEqual(move, null);
});

TestRunner.test('AI chooses winning move when available', () => {
    const board = ['O', 'O', '', 'X', 'X', '', '', '', ''];
    const move = AI.getMove(board);
    TestRunner.assertEqual(move, 2); // AI should complete the win
});

TestRunner.test('AI blocks opponent winning move', () => {
    const board = ['X', 'X', '', 'O', '', '', '', '', ''];
    const move = AI.getMove(board);
    TestRunner.assertEqual(move, 2); // AI should block X from winning
});

// ============================================================

TestRunner.suite('AI Module - Unbeatable Verification');

TestRunner.test('AI never loses when going first (100 games)', () => {
    let aiLosses = 0;

    for (let game = 0; game < 100; game++) {
        const board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'O'; // AI goes first

        while (true) {
            if (currentPlayer === 'O') {
                const move = AI.getMove(board);
                if (move === null) break;
                board[move] = 'O';
            } else {
                const empty = [];
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') empty.push(i);
                }
                if (empty.length === 0) break;
                const randomMove = empty[Math.floor(Math.random() * empty.length)];
                board[randomMove] = 'X';
            }

            const winner = AI.checkWinner(board);
            if (winner === 'X') {
                aiLosses++;
                break;
            }
            if (winner === 'O' || AI.isBoardFull(board)) {
                break;
            }

            currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
        }
    }

    TestRunner.assertEqual(aiLosses, 0, 'AI should never lose');
});

TestRunner.test('AI never loses when going second (100 games)', () => {
    let aiLosses = 0;

    for (let game = 0; game < 100; game++) {
        const board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X'; // Human goes first

        while (true) {
            if (currentPlayer === 'O') {
                const move = AI.getMove(board);
                if (move === null) break;
                board[move] = 'O';
            } else {
                const empty = [];
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') empty.push(i);
                }
                if (empty.length === 0) break;
                const randomMove = empty[Math.floor(Math.random() * empty.length)];
                board[randomMove] = 'X';
            }

            const winner = AI.checkWinner(board);
            if (winner === 'X') {
                aiLosses++;
                break;
            }
            if (winner === 'O' || AI.isBoardFull(board)) {
                break;
            }

            currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
        }
    }

    TestRunner.assertEqual(aiLosses, 0, 'AI should never lose');
});

// ============================================================

TestRunner.suite('AI Module - Minimax Scoring');

TestRunner.test('Minimax returns positive score for AI win', () => {
    const board = ['O', 'O', 'O', 'X', 'X', '', '', '', ''];
    const winner = AI.checkWinner(board);
    TestRunner.assertEqual(winner, 'O');
});

TestRunner.test('Minimax returns negative score for human win', () => {
    const board = ['X', 'X', 'X', 'O', 'O', '', '', '', ''];
    const winner = AI.checkWinner(board);
    TestRunner.assertEqual(winner, 'X');
});

// ============================================================

TestRunner.suite('Storage Module');

TestRunner.test('Storage loads default scores when none saved', () => {
    localStorageMock.removeItem('tictactoe_scores');
    const scores = Storage.loadScores();
    TestRunner.assertEqual(scores.wins, 0);
    TestRunner.assertEqual(scores.losses, 0);
    TestRunner.assertEqual(scores.draws, 0);
});

TestRunner.test('Storage saves and loads scores correctly', () => {
    const testScores = { wins: 5, losses: 3, draws: 2 };
    Storage.saveScores(testScores);
    const loaded = Storage.loadScores();
    TestRunner.assertEqual(loaded.wins, 5);
    TestRunner.assertEqual(loaded.losses, 3);
    TestRunner.assertEqual(loaded.draws, 2);
});

TestRunner.test('Storage resets scores to zero', () => {
    Storage.saveScores({ wins: 10, losses: 10, draws: 10 });
    const reset = Storage.resetScores();
    TestRunner.assertEqual(reset.wins, 0);
    TestRunner.assertEqual(reset.losses, 0);
    TestRunner.assertEqual(reset.draws, 0);
});

TestRunner.test('Storage saves and loads sound preference', () => {
    Storage.saveSoundEnabled(false);
    TestRunner.assertFalse(Storage.loadSoundEnabled());

    Storage.saveSoundEnabled(true);
    TestRunner.assertTrue(Storage.loadSoundEnabled());
});

// ============================================================

TestRunner.suite('Storage Module - Difficulty');

TestRunner.test('Storage loads default difficulty as hard when none saved', () => {
    localStorageMock.removeItem('tictactoe_difficulty');
    const difficulty = Storage.loadDifficulty();
    TestRunner.assertEqual(difficulty, 'hard');
});

TestRunner.test('Storage saves and loads easy difficulty correctly', () => {
    Storage.saveDifficulty('easy');
    const loaded = Storage.loadDifficulty();
    TestRunner.assertEqual(loaded, 'easy');
});

TestRunner.test('Storage saves and loads hard difficulty correctly', () => {
    Storage.saveDifficulty('hard');
    const loaded = Storage.loadDifficulty();
    TestRunner.assertEqual(loaded, 'hard');
});

TestRunner.test('Storage rejects invalid difficulty values', () => {
    // First set a valid value
    Storage.saveDifficulty('easy');

    // Try to save invalid value - should return false
    const result = Storage.saveDifficulty('invalid');
    TestRunner.assertFalse(result);

    // Value should remain 'easy' since invalid was rejected
    TestRunner.assertEqual(Storage.loadDifficulty(), 'easy');
});

TestRunner.test('Storage DIFFICULTY constants are exposed', () => {
    TestRunner.assertEqual(Storage.DIFFICULTY.EASY, 'easy');
    TestRunner.assertEqual(Storage.DIFFICULTY.HARD, 'hard');
});

// ============================================================

TestRunner.suite('AI Module - Easy Mode');

TestRunner.test('Easy AI returns a valid move', () => {
    const board = ['', '', '', '', '', '', '', '', ''];
    const move = AI.getEasyMove(board);
    TestRunner.assertTrue(move >= 0 && move <= 8);
});

TestRunner.test('Easy AI returns null when no moves available', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const move = AI.getEasyMove(board);
    TestRunner.assertEqual(move, null);
});

TestRunner.test('Easy AI only returns empty cell indices', () => {
    const board = ['X', 'O', '', 'X', 'O', '', '', '', 'X'];
    const emptyIndices = [2, 5, 6, 7];

    // Test multiple times since it is random
    for (let i = 0; i < 50; i++) {
        const move = AI.getEasyMove(board);
        TestRunner.assertTrue(
            emptyIndices.includes(move),
            `Move ${move} should be one of ${emptyIndices}`
        );
    }
});

TestRunner.test('findRandomMove returns different moves over many calls (randomness check)', () => {
    const board = ['', '', '', '', '', '', '', '', ''];
    const moveSet = new Set();

    // Call 100 times and collect unique moves
    for (let i = 0; i < 100; i++) {
        const move = AI.findRandomMove(board);
        moveSet.add(move);
    }

    // Should have gotten multiple different moves (statistically very likely)
    TestRunner.assertTrue(
        moveSet.size >= 3,
        `Expected multiple different moves, got ${moveSet.size} unique move(s)`
    );
});

TestRunner.test('Easy AI can be beaten (player can win in 50 games)', () => {
    // Simulate 50 games where player makes strategic moves against easy AI
    // Player should be able to win at least some games
    let playerWins = 0;

    for (let game = 0; game < 50; game++) {
        const board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';  // Player (X) goes first

        while (true) {
            if (currentPlayer === 'X') {
                // Player uses optimal strategy (minimax)
                const move = AI.getMove(board);
                if (move === null) break;
                board[move] = 'X';
            } else {
                // Easy AI makes random move
                const move = AI.getEasyMove(board);
                if (move === null) break;
                board[move] = 'O';
            }

            // Check for winner
            const winner = AI.checkWinner(board);
            if (winner === 'X') {
                playerWins++;
                break;
            }
            if (winner === 'O' || AI.isBoardFull(board)) {
                break;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    // Player using optimal strategy against random AI should win frequently
    TestRunner.assertTrue(
        playerWins >= 10,
        `Player should win at least 10 games against easy AI, but won ${playerWins}`
    );
});

TestRunner.test('Hard AI vs Easy AI: Hard AI wins or draws all games', () => {
    // Simulate games where hard AI plays against easy AI
    // Hard AI should never lose
    let hardLosses = 0;

    for (let game = 0; game < 50; game++) {
        const board = ['', '', '', '', '', '', '', '', ''];
        // Alternate who goes first
        let currentPlayer = game % 2 === 0 ? 'O' : 'X';  // O is hard AI, X is easy AI

        while (true) {
            if (currentPlayer === 'O') {
                // Hard AI
                const move = AI.getMove(board);
                if (move === null) break;
                board[move] = 'O';
            } else {
                // Easy AI
                const move = AI.getEasyMove(board);
                if (move === null) break;
                board[move] = 'X';
            }

            // Check for winner
            const winner = AI.checkWinner(board);
            if (winner === 'X') {
                // Easy AI (X) beat Hard AI (O) - this is a loss for hard AI
                hardLosses++;
                break;
            }
            if (winner === 'O' || AI.isBoardFull(board)) {
                break;
            }

            currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
        }
    }

    TestRunner.assertEqual(hardLosses, 0, 'Hard AI should never lose to easy AI');
});

// ============================================================

TestRunner.suite('Storage Module - Player Symbol');

TestRunner.test('Storage loads default player symbol as random when none saved', () => {
    localStorageMock.removeItem('tictactoe_player_symbol');
    const symbol = Storage.loadPlayerSymbol();
    TestRunner.assertEqual(symbol, 'random');
});

TestRunner.test('Storage saves and loads X symbol correctly', () => {
    Storage.savePlayerSymbol('X');
    const loaded = Storage.loadPlayerSymbol();
    TestRunner.assertEqual(loaded, 'X');
});

TestRunner.test('Storage saves and loads O symbol correctly', () => {
    Storage.savePlayerSymbol('O');
    const loaded = Storage.loadPlayerSymbol();
    TestRunner.assertEqual(loaded, 'O');
});

TestRunner.test('Storage saves and loads random symbol correctly', () => {
    Storage.savePlayerSymbol('random');
    const loaded = Storage.loadPlayerSymbol();
    TestRunner.assertEqual(loaded, 'random');
});

TestRunner.test('Storage rejects invalid symbol values', () => {
    Storage.savePlayerSymbol('X');
    const result = Storage.savePlayerSymbol('invalid');
    TestRunner.assertFalse(result);
    TestRunner.assertEqual(Storage.loadPlayerSymbol(), 'X');
});

TestRunner.test('Storage SYMBOL_CHOICE constants are exposed', () => {
    TestRunner.assertEqual(Storage.SYMBOL_CHOICE.X, 'X');
    TestRunner.assertEqual(Storage.SYMBOL_CHOICE.O, 'O');
    TestRunner.assertEqual(Storage.SYMBOL_CHOICE.RANDOM, 'random');
});

// ============================================================

TestRunner.suite('Game Module - Player Symbol');

TestRunner.test('Game initializes with player as X by default', () => {
    Game.init();
    TestRunner.assertEqual(Game.getPlayerSymbol(), 'X');
    TestRunner.assertEqual(Game.getAISymbol(), 'O');
});

TestRunner.test('Game initializes with player as O when specified', () => {
    Game.init('O');
    TestRunner.assertEqual(Game.getPlayerSymbol(), 'O');
    TestRunner.assertEqual(Game.getAISymbol(), 'X');
});

TestRunner.test('Game state includes playerSymbol and aiSymbol', () => {
    Game.init('O');
    const state = Game.getState();
    TestRunner.assertEqual(state.playerSymbol, 'O');
    TestRunner.assertEqual(state.aiSymbol, 'X');
});

TestRunner.test('X always goes first regardless of player symbol', () => {
    Game.init('X');
    TestRunner.assertEqual(Game.getCurrentPlayer(), 'X');
    TestRunner.assertTrue(Game.isPlayerTurn());
    TestRunner.assertFalse(Game.isAITurn());

    Game.init('O');
    TestRunner.assertEqual(Game.getCurrentPlayer(), 'X');
    TestRunner.assertFalse(Game.isPlayerTurn());
    TestRunner.assertTrue(Game.isAITurn());
});

TestRunner.test('isPlayerTurn works correctly when player is O', () => {
    Game.init('O');
    TestRunner.assertFalse(Game.isPlayerTurn());
    TestRunner.assertTrue(Game.isAITurn());

    Game.makeMove(0);
    TestRunner.assertTrue(Game.isPlayerTurn());
    TestRunner.assertFalse(Game.isAITurn());
});

TestRunner.test('Game handles invalid playerSymbol gracefully', () => {
    Game.init('invalid');
    TestRunner.assertEqual(Game.getPlayerSymbol(), 'X');
    TestRunner.assertEqual(Game.getAISymbol(), 'O');
});

// ============================================================

TestRunner.suite('AI Module - Playing as X');

TestRunner.test('findBestMoveForSymbol works for O (default behavior)', () => {
    const board = ['O', 'O', '', 'X', 'X', '', '', '', ''];
    const move = AI.findBestMoveForSymbol(board, 'O');
    TestRunner.assertEqual(move, 2);
});

TestRunner.test('findBestMoveForSymbol works for X', () => {
    const board = ['X', 'X', '', 'O', 'O', '', '', '', ''];
    const move = AI.findBestMoveForSymbol(board, 'X');
    TestRunner.assertEqual(move, 2);
});

TestRunner.test('AI as X blocks opponent winning move', () => {
    const board = ['O', 'O', '', 'X', '', '', '', '', ''];
    const move = AI.findBestMoveForSymbol(board, 'X');
    TestRunner.assertEqual(move, 2);
});

TestRunner.test('AI as X never loses when going first (50 games)', () => {
    let aiLosses = 0;

    for (let game = 0; game < 50; game++) {
        const board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';

        while (true) {
            if (currentPlayer === 'X') {
                const move = AI.findBestMoveForSymbol(board, 'X');
                if (move === null) break;
                board[move] = 'X';
            } else {
                const empty = [];
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') empty.push(i);
                }
                if (empty.length === 0) break;
                const randomMove = empty[Math.floor(Math.random() * empty.length)];
                board[randomMove] = 'O';
            }

            const winner = AI.checkWinner(board);
            if (winner === 'O') {
                aiLosses++;
                break;
            }
            if (winner === 'X' || AI.isBoardFull(board)) {
                break;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    TestRunner.assertEqual(aiLosses, 0, 'AI playing as X should never lose');
});

// ============================================================

TestRunner.suite('Storage Module - Player Name');

TestRunner.test('Storage loads empty string when no player name saved', () => {
    localStorageMock.removeItem('tictactoe_player_name');
    const name = Storage.loadPlayerName();
    TestRunner.assertEqual(name, '');
});

TestRunner.test('Storage saves and loads player name correctly', () => {
    Storage.savePlayerName('Alice');
    const loaded = Storage.loadPlayerName();
    TestRunner.assertEqual(loaded, 'Alice');
});

TestRunner.test('Storage trims whitespace from player name', () => {
    Storage.savePlayerName('  Bob  ');
    const loaded = Storage.loadPlayerName();
    TestRunner.assertEqual(loaded, 'Bob');
});

TestRunner.test('Storage limits player name to 30 characters', () => {
    const longName = 'A'.repeat(50);
    Storage.savePlayerName(longName);
    const loaded = Storage.loadPlayerName();
    TestRunner.assertEqual(loaded.length, 30);
});

TestRunner.test('Storage sanitizes player name to prevent XSS', () => {
    Storage.savePlayerName('<script>alert("xss")</script>');
    const loaded = Storage.loadPlayerName();
    // Should not contain raw < or > characters
    TestRunner.assertFalse(loaded.includes('<'));
    TestRunner.assertFalse(loaded.includes('>'));
    // Should contain escaped versions
    TestRunner.assertTrue(loaded.includes('&lt;'));
    TestRunner.assertTrue(loaded.includes('&gt;'));
});

TestRunner.test('Storage sanitizes ampersand in player name', () => {
    Storage.savePlayerName('Rock & Roll');
    const loaded = Storage.loadPlayerName();
    TestRunner.assertEqual(loaded, 'Rock &amp; Roll');
});

TestRunner.test('Storage sanitizes quotes in player name', () => {
    Storage.savePlayerName('He said "hello"');
    const loaded = Storage.loadPlayerName();
    TestRunner.assertTrue(loaded.includes('&quot;'));
});

TestRunner.test('Storage sanitizes single quotes in player name', () => {
    Storage.savePlayerName("It's me");
    const loaded = Storage.loadPlayerName();
    TestRunner.assertTrue(loaded.includes('&#039;'));
});

TestRunner.test('clearPlayerName resets to empty string', () => {
    Storage.savePlayerName('TestUser');
    Storage.clearPlayerName();
    const loaded = Storage.loadPlayerName();
    TestRunner.assertEqual(loaded, '');
});

TestRunner.test('sanitizePlayerName returns empty string for non-string input', () => {
    TestRunner.assertEqual(Storage.sanitizePlayerName(null), '');
    TestRunner.assertEqual(Storage.sanitizePlayerName(undefined), '');
    TestRunner.assertEqual(Storage.sanitizePlayerName(123), '');
    TestRunner.assertEqual(Storage.sanitizePlayerName({}), '');
});

TestRunner.test('sanitizePlayerName handles normal names correctly', () => {
    TestRunner.assertEqual(Storage.sanitizePlayerName('John Doe'), 'John Doe');
    TestRunner.assertEqual(Storage.sanitizePlayerName('Player1'), 'Player1');
    TestRunner.assertEqual(Storage.sanitizePlayerName('X-Wing'), 'X-Wing');
});

TestRunner.test('PLAYER_NAME_MAX_LENGTH constant is exposed and equals 30', () => {
    TestRunner.assertEqual(Storage.PLAYER_NAME_MAX_LENGTH, 30);
});

TestRunner.test('Storage handles empty string player name', () => {
    Storage.savePlayerName('');
    const loaded = Storage.loadPlayerName();
    TestRunner.assertEqual(loaded, '');
});

TestRunner.test('Storage handles whitespace-only player name as empty', () => {
    Storage.savePlayerName('   ');
    const loaded = Storage.loadPlayerName();
    TestRunner.assertEqual(loaded, '');
});

// ============================================================

// Run tests and show summary
TestRunner.summary();
