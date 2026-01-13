# Project Specifications: TicTacToe

## Executive Summary

A web-based TicTacToe game featuring an unbeatable AI opponent powered by the minimax algorithm. The game showcases a modern dark "hacker" aesthetic with neon accents, smooth animations, and immersive sound effects. Designed as a portfolio/demo project demonstrating front-end development skills, algorithm implementation, and polished user experience design.

**Project Type:** Client-side web application
**Target Audience:** Portfolio viewers, recruiters, and casual players
**Primary Goal:** Demonstrate technical competency through a polished, complete game implementation

---

## Project Goals and Success Criteria

### Goals
1. Create an engaging, visually impressive TicTacToe game
2. Implement an unbeatable AI using the minimax algorithm
3. Deliver a responsive experience that works flawlessly on all device sizes
4. Showcase modern front-end development practices
5. Provide satisfying audio-visual feedback throughout gameplay

### Success Criteria
- [ ] AI never loses (always wins or draws)
- [ ] Game is fully playable on desktop, tablet, and mobile devices
- [ ] All animations run smoothly at 60fps
- [ ] Sound effects play correctly with user-controllable mute option
- [ ] Score persistence works across browser sessions
- [ ] No external dependencies required (pure client-side)
- [ ] Works correctly on all modern browsers (Chrome, Firefox, Safari, Edge)

---

## User Personas and Use Cases

### Primary Persona: Portfolio Viewer
- **Who:** Technical recruiters, hiring managers, fellow developers
- **Goal:** Evaluate the developer's technical skills and attention to detail
- **Behavior:** Will play a few games, test the AI, check responsiveness, inspect code quality

### Secondary Persona: Casual Player
- **Who:** Anyone who encounters the game
- **Goal:** Have fun trying to beat the AI, enjoy the visual/audio experience
- **Behavior:** Will play multiple rounds, try different strategies, appreciate the polish

### Use Cases

**UC-1: Start New Game**
1. User loads the application
2. System randomly determines who goes first (player or AI)
3. System displays the game board with turn indicator
4. If AI goes first, AI makes opening move

**UC-2: Make a Move**
1. User clicks/taps an empty cell
2. System plays placement sound and shows X animation
3. System checks for win/draw condition
4. If game continues, AI makes its move with O animation and sound
5. System updates turn indicator

**UC-3: Win/Lose/Draw**
1. Game reaches end state
2. System plays appropriate sound (victory/defeat/draw)
3. System animates winning line (if applicable)
4. System displays modal with result
5. System updates score display
6. User dismisses modal to continue

**UC-4: Start Another Game**
1. User clicks "New Game" button or dismisses end-game modal
2. System resets board
3. System randomly determines first player
4. New game begins

**UC-5: Reset Scores**
1. User clicks "Reset Scores" button
2. System clears all score data
3. System updates display to show 0-0-0

**UC-6: Toggle Sound**
1. User clicks mute/unmute button
2. System toggles sound state
3. System updates button icon to reflect state
4. Sound preference persists across sessions

**UC-7: Set Player Name**
1. User enters their name in the name input field
2. System saves name to localStorage
3. System updates greeting display to show "Hello {Name}"
4. Name persists across sessions
5. User can change name at any time by editing the field

**UC-8: Change Theme**
1. User opens preferences/settings
2. User selects a different theme from available options
3. System applies theme immediately with smooth transition
4. All UI elements update to use new color scheme
5. Theme preference saves to localStorage
6. Theme persists across sessions

---

## Functional Requirements

### FR-1: Game Board
- **FR-1.1:** Display a 3x3 grid of clickable cells
- **FR-1.2:** Each cell can be empty, contain X (player), or contain O (AI)
- **FR-1.3:** Empty cells are clickable; occupied cells are not
- **FR-1.4:** Visual hover state on empty cells (desktop)
- **FR-1.5:** Touch-friendly tap targets (minimum 44x44px effective area)

### FR-2: Player Moves
- **FR-2.1:** Player always plays as X
- **FR-2.2:** Clicking an empty cell places X in that cell
- **FR-2.3:** Move is accompanied by placement animation
- **FR-2.4:** Move triggers X-specific sound effect
- **FR-2.5:** Invalid moves (occupied cells) are ignored

### FR-3: AI Opponent
- **FR-3.1:** AI always plays as O
- **FR-3.2:** AI uses minimax algorithm for move selection
- **FR-3.3:** AI is unbeatable (will always win or draw)
- **FR-3.4:** AI move includes brief delay (300-500ms) for natural feel
- **FR-3.5:** AI move accompanied by O-specific sound effect
- **FR-3.6:** AI move shows placement animation

### FR-4: Game Flow
- **FR-4.1:** First player is randomly selected each game
- **FR-4.2:** If AI is selected first, AI makes opening move automatically
- **FR-4.3:** Turn indicator shows whose turn it is
- **FR-4.4:** Game detects win condition (3 in a row: horizontal, vertical, diagonal)
- **FR-4.5:** Game detects draw condition (board full, no winner)
- **FR-4.6:** Game ends immediately upon win/draw detection

### FR-5: End Game
- **FR-5.1:** Winning line is highlighted with animation
- **FR-5.2:** Appropriate sound plays (victory/defeat/draw)
- **FR-5.3:** Modal overlay displays result message
- **FR-5.4:** Modal includes option to start new game
- **FR-5.5:** Game waits for user action (no auto-restart)
- **FR-5.6:** Score is updated and saved

### FR-6: Score Tracking
- **FR-6.1:** Track wins, losses, and draws separately
- **FR-6.2:** Display format: "Wins: X | Losses: X | Draws: X"
- **FR-6.3:** Scores persist across browser sessions (localStorage)
- **FR-6.4:** "Reset Scores" button clears all scores to 0
- **FR-6.5:** Score updates immediately after each game

### FR-7: Game Controls
- **FR-7.1:** "New Game" button resets board and starts fresh game
- **FR-7.2:** "Reset Scores" button with confirmation (prevents accidental reset)
- **FR-7.3:** Sound mute/unmute toggle button
- **FR-7.4:** All buttons have click sound (when sound enabled)

### FR-8: Sound System
- **FR-8.1:** X placement sound (distinct tone)
- **FR-8.2:** O placement sound (different distinct tone)
- **FR-8.3:** Victory sound (celebratory)
- **FR-8.4:** Defeat sound (somber/dramatic)
- **FR-8.5:** Draw sound (neutral)
- **FR-8.6:** Button click sound (UI feedback)
- **FR-8.7:** Global mute toggle
- **FR-8.8:** Mute state persists across sessions (localStorage)

### FR-9: Player Name and Personalization
- **FR-9.1:** Input field for player to set their name
- **FR-9.2:** Name persists across browser sessions (localStorage)
- **FR-9.3:** Display "Hello {Name}" greeting when name is set
- **FR-9.4:** Display generic greeting ("Hello Player" or similar) when no name is set
- **FR-9.5:** Allow player to change their name at any time
- **FR-9.6:** Name appears in greeting area (header or near title)
- **FR-9.7:** Name is sanitized for display (prevent XSS)

### FR-10: Theme Selection
- **FR-10.1:** Preferences control to select between multiple visual themes
- **FR-10.2:** At minimum, support two themes:
  - Default: Hacker aesthetic (neon cyan/magenta/green on dark background)
  - Alternate: Different color scheme (e.g., blue/orange, retro green terminal, etc.)
- **FR-10.3:** Theme selection persists across browser sessions (localStorage)
- **FR-10.4:** Theme changes apply immediately without page reload
- **FR-10.5:** All UI elements (board, buttons, modals) respect selected theme
- **FR-10.6:** Smooth transition when switching themes (CSS transitions)
- **FR-10.7:** Theme preference accessible via settings/preferences UI
- **FR-10.8:** Default theme loads if no preference is saved

---

## Non-Functional Requirements

### Performance
- **NFR-P1:** Initial page load under 2 seconds on 3G connection
- **NFR-P2:** Animations maintain 60fps on mid-range devices
- **NFR-P3:** AI move calculation under 100ms
- **NFR-P4:** No perceptible lag on user interactions
- **NFR-P5:** Total application size under 500KB (including sounds)

### Security
- **NFR-S1:** No sensitive data collection or transmission
- **NFR-S2:** localStorage used only for scores and sound preference
- **NFR-S3:** No external API calls or dependencies
- **NFR-S4:** Content Security Policy compatible

### Scalability
- **NFR-SC1:** N/A - Single-user client-side application

### Reliability
- **NFR-R1:** Graceful handling of localStorage unavailability
- **NFR-R2:** Game remains playable if sounds fail to load
- **NFR-R3:** No JavaScript errors during normal operation
- **NFR-R4:** Consistent behavior across supported browsers

### Maintainability
- **NFR-M1:** Clean, well-commented code
- **NFR-M2:** Separation of concerns (game logic, UI, sound management)
- **NFR-M3:** CSS custom properties for easy theming adjustments
- **NFR-M4:** Modular JavaScript structure

### Accessibility
- **NFR-A1:** Keyboard navigable (tab through cells, enter to select)
- **NFR-A2:** Sufficient color contrast ratios (WCAG AA minimum)
- **NFR-A3:** Screen reader compatible (ARIA labels on interactive elements)
- **NFR-A4:** Reduced motion support (respect prefers-reduced-motion)

---

## Technical Architecture

### Technology Stack
| Layer | Technology |
|-------|------------|
| Structure | HTML5 |
| Styling | CSS3 (with custom properties) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | localStorage API |
| Audio | Web Audio API or HTML5 Audio |

### System Components

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
│   ├── sound.js        # Sound management
│   └── storage.js      # localStorage operations
├── audio/
│   ├── place-x.mp3     # X placement sound
│   ├── place-o.mp3     # O placement sound
│   ├── victory.mp3     # Player wins
│   ├── defeat.mp3      # AI wins
│   ├── draw.mp3        # Draw game
│   └── click.mp3       # Button click
├── specs/
│   └── specs.md        # This specification document
└── README.md           # Project documentation
```

### Data Model

**Game State Object:**
```javascript
{
  board: ['', '', '', '', '', '', '', '', ''],  // 9 cells, '' | 'X' | 'O'
  currentPlayer: 'X',                            // 'X' (human) | 'O' (AI)
  gameOver: false,
  winner: null,                                  // null | 'X' | 'O' | 'draw'
  winningLine: null                              // null | [index, index, index]
}
```

**Persistent Storage Schema:**
```javascript
// localStorage keys
'tictactoe_scores': {
  wins: 0,
  losses: 0,
  draws: 0
}
'tictactoe_sound_enabled': true  // boolean
'tictactoe_player_name': ''      // string (empty if not set)
'tictactoe_theme': 'default'     // string ('default', 'alternate', etc.)
```

### Minimax Algorithm

The AI uses the minimax algorithm with the following characteristics:
- **Maximizing player:** AI (O) - tries to maximize score
- **Minimizing player:** Human (X) - AI assumes optimal play
- **Terminal states:**
  - AI wins: +10
  - Human wins: -10
  - Draw: 0
- **Depth consideration:** Prefer faster wins (subtract depth from score)

---

## User Interface and Experience

### Layout Structure

```
+------------------------------------------+
|           TICTACTOE                      |  <- Title with glow effect
|          Hello {Name}                    |  <- Personalized greeting
+------------------------------------------+
|    Wins: 0  |  Losses: 0  |  Draws: 0   |  <- Score display
+------------------------------------------+
|                                          |
|         +-----+-----+-----+              |
|         |     |     |     |              |
|         +-----+-----+-----+              |
|         |     |     |     |              |  <- Game board
|         +-----+-----+-----+              |
|         |     |     |     |              |
|         +-----+-----+-----+              |
|                                          |
+------------------------------------------+
|           YOUR TURN / AI THINKING        |  <- Turn indicator
+------------------------------------------+
| [NEW GAME] [RESET] [SOUND] [SETTINGS]   |  <- Control buttons
+------------------------------------------+
```

### Visual Design Specifications

**Color Palette:**
| Element | Color | Hex |
|---------|-------|-----|
| Background | Near black | #0a0a0f |
| Primary accent | Neon cyan | #00ffff |
| Secondary accent | Neon magenta | #ff00ff |
| Tertiary accent | Neon green | #00ff00 |
| Text primary | Light gray | #e0e0e0 |
| Text secondary | Medium gray | #808080 |
| Grid lines | Dark cyan | #004444 |
| X marks | Neon cyan | #00ffff |
| O marks | Neon magenta | #ff00ff |
| Win highlight | Neon green | #00ff00 |

**Typography:**
- Primary font: 'Orbitron', 'Rajdhani', or similar modern geometric sans-serif
- Fallback: system sans-serif
- Title: 2-3rem, bold, letter-spacing
- Score/status: 1rem
- Marks (X/O): 3-4rem, bold

**Visual Effects:**
- Subtle scan line overlay (CSS pseudo-element)
- Glow effects on interactive elements (box-shadow, text-shadow)
- Slight CRT screen curvature effect (optional, subtle)
- Neon flicker animation on title (subtle, not distracting)

### Animations

| Animation | Duration | Easing | Description |
|-----------|----------|--------|-------------|
| Mark placement | 200ms | ease-out | Scale from 0 to 1 with slight bounce |
| Winning line | 500ms | ease-in-out | Pulse glow effect, line strikethrough |
| Modal appear | 300ms | ease-out | Fade in + scale up |
| Button hover | 150ms | ease | Glow intensity increase |
| Cell hover | 100ms | ease | Subtle border glow |

### Responsive Breakpoints

| Breakpoint | Target | Board Size | Layout |
|------------|--------|------------|--------|
| < 480px | Mobile portrait | 280px | Stacked, compact |
| 480-768px | Mobile landscape/tablet | 360px | Stacked |
| 768-1024px | Tablet/small desktop | 400px | Centered |
| > 1024px | Desktop | 450px | Centered with padding |

---

## Security and Access Control

### Data Protection
- No personal data collected
- No authentication required
- No server communication
- Local storage contains only game scores and preferences

### Client-Side Security
- No eval() or dynamic code execution
- No inline event handlers (event listeners only)
- Sanitized DOM updates (textContent over innerHTML where possible)

---

## Deployment and Operations

### Hosting Requirements
- Static file hosting only
- No server-side processing required
- Compatible with: GitHub Pages, Netlify, Vercel, any static host

### Files to Deploy
- index.html
- css/styles.css
- js/*.js (all JavaScript modules)
- audio/*.mp3 (all sound files)

### Browser Support
| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

### Monitoring and Logging
- Console errors logged in development
- No production analytics required
- No error reporting service needed

---

## Development Approach

### Phase 1: Core Game (MVP)
1. HTML structure and basic CSS layout
2. Game state management
3. Player move handling
4. Win/draw detection
5. Basic UI updates

### Phase 2: AI Implementation
1. Minimax algorithm implementation
2. AI move integration
3. Random first-player selection
4. AI thinking delay

### Phase 3: Visual Polish
1. Hacker aesthetic styling
2. Neon color scheme
3. Scan line and glow effects
4. Responsive design implementation

### Phase 4: Animations
1. Mark placement animations
2. Winning line animation
3. Modal transitions
4. Button hover effects

### Phase 5: Sound and Persistence
1. Sound effect integration
2. Mute toggle functionality
3. Score tracking implementation
4. localStorage integration

### Phase 6: Final Polish
1. Accessibility improvements
2. Cross-browser testing
3. Performance optimization
4. Code cleanup and documentation

### Testing Strategy

**Manual Testing:**
- All game scenarios (win, lose, draw)
- AI never loses verification
- Responsive design on multiple devices
- Sound playback on all browsers
- localStorage persistence verification
- Keyboard navigation testing

**Test Cases:**
1. Player wins (all 8 winning combinations)
2. AI wins (verify it can win when possible)
3. Draw game (board fills with no winner)
4. AI goes first scenario
5. Player goes first scenario
6. Score increments correctly
7. Score persists after page refresh
8. Score reset works
9. Sound mute/unmute toggles
10. Sound preference persists
11. New game resets board but keeps scores
12. Modal displays correct result
13. Winning line highlights correctly

---

## Constraints and Assumptions

### Constraints
- Pure client-side implementation (no backend)
- No external JavaScript libraries/frameworks
- No build tools required (vanilla development)
- Must work offline after initial load

### Assumptions
- Users have JavaScript enabled
- Users have a modern browser (see support table)
- Sound files will be small enough for quick loading
- localStorage is available (with graceful fallback)

### Dependencies
- Google Fonts (for custom typography) - optional, can use system fonts
- No other external dependencies

---

## Risks and Mitigation Strategies

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Sound files increase load time | Medium | Medium | Compress audio, lazy load sounds |
| localStorage unavailable | Low | Low | Graceful degradation, session-only scores |
| CSS effects hurt performance | Medium | Medium | Use GPU-accelerated properties, test on low-end devices |
| Minimax too slow | Low | Very Low | Algorithm is O(9!) worst case but board is tiny |
| Cross-browser CSS issues | Medium | Medium | Test early, use prefixes where needed |

---

## Out of Scope

The following features are explicitly NOT included in this project:

- Online multiplayer functionality
- User accounts or authentication
- Undo/redo functionality
- Move history or game replay
- Alternative board sizes (e.g., 4x4, 5x5)
- Alternative game modes
- Leaderboards
- Social sharing
- Backend server or database
- Progressive Web App features
- Internationalization/localization
- Player avatars or profile pictures

---

## Open Questions and Future Considerations

### Resolved
- First move selection: Random (decided)
- AI difficulty: Unbeatable only (decided)
- Score persistence: Yes, with localStorage (decided)

### Future Enhancements (Post-MVP)
These could be considered for future versions but are not part of initial scope:
- PWA support for offline play
- Human vs Human local mode
- Game statistics (average game length, etc.)
- Additional themes beyond the initial two
- Tutorial mode for new players
- Animated player avatars
- Sound effect customization

---

## Appendix A: Minimax Algorithm Reference

```javascript
function minimax(board, depth, isMaximizing) {
  const winner = checkWinner(board);

  // Terminal states
  if (winner === 'O') return 10 - depth;  // AI wins (prefer faster wins)
  if (winner === 'X') return depth - 10;  // Human wins
  if (isBoardFull(board)) return 0;        // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
```

---

## Appendix B: Winning Combinations Reference

```javascript
const WINNING_COMBINATIONS = [
  [0, 1, 2],  // Top row
  [3, 4, 5],  // Middle row
  [6, 7, 8],  // Bottom row
  [0, 3, 6],  // Left column
  [1, 4, 7],  // Middle column
  [2, 5, 8],  // Right column
  [0, 4, 8],  // Diagonal top-left to bottom-right
  [2, 4, 6]   // Diagonal top-right to bottom-left
];
```

---

*Document Version: 1.0*
*Created: 2026-01-12*
*Status: Approved for Implementation*
