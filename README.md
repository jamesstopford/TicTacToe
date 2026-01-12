# TicTacToe - Unbeatable AI

A web-based TicTacToe game featuring an unbeatable AI opponent powered by the minimax algorithm. Built with a sleek dark "hacker" aesthetic, smooth animations, and immersive sound effects.

## Features

- **Unbeatable AI**: The AI uses the minimax algorithm with alpha-beta pruning - it will always win or draw, never lose
- **Hacker Aesthetic**: Dark theme with neon cyan, magenta, and green accents
- **Smooth Animations**: Mark placement, winning line, and modal transitions
- **Sound Effects**: Synthesized audio feedback for moves, wins, losses, and draws
- **Score Tracking**: Persistent win/loss/draw tracking across browser sessions
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessible**: Keyboard navigation, screen reader support, reduced motion support

## Quick Start

1. Open `index.html` in a modern web browser
2. Click any cell to make your move (you play as X)
3. Try to beat the AI (spoiler: you cannot!)

## Running Locally

No build step required. Simply serve the files with any static file server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

Then visit `http://localhost:8000`

## Running Tests

Open `tests/game.test.html` in a browser to run the test suite.

The test suite includes:
- Game initialization and state management tests
- Move handling and validation tests
- Win/draw detection for all combinations
- AI unbeatable verification (200 simulated games)
- Storage persistence tests

## Project Structure

```
TicTacToe/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All styles including animations
├── js/
│   ├── main.js         # Application entry point
│   ├── game.js         # Game state and logic
│   ├── ai.js           # Minimax AI implementation
│   ├── ui.js           # DOM manipulation and rendering
│   ├── sound.js        # Web Audio API sound management
│   └── storage.js      # localStorage operations
├── audio/              # Optional audio files (synth fallback available)
├── tests/
│   └── game.test.html  # Browser-based test suite
└── specs/
    └── specs.md        # Project specifications
```

## Technical Details

### AI Algorithm

The AI uses the **minimax algorithm** with **alpha-beta pruning** for optimal performance:

- Evaluates all possible game states recursively
- Maximizes AI score, minimizes human score
- Prefers faster wins (subtracts depth from score)
- Alpha-beta pruning eliminates unnecessary branches
- First move optimizations for instant response

### Sound System

Uses the **Web Audio API** with synthesized fallback:

- Oscillator-based sounds when audio files unavailable
- Different tones for X placement (880Hz) and O placement (440Hz)
- Victory: ascending tone sequence
- Defeat: descending sawtooth tones
- Mute preference persisted to localStorage

### Accessibility

- Full keyboard navigation (Tab, Enter, Space, Escape)
- ARIA labels on all interactive elements
- Live regions for dynamic content
- Respects `prefers-reduced-motion` media query
- High contrast neon-on-dark color scheme

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

This project is a portfolio demonstration piece.
