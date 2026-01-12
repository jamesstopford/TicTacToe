# AGENT.md - Build/Test Procedures

## Project Type
Static web application (HTML/CSS/JavaScript) - no build step required.

## Running the Application
Open `index.html` in a web browser, or use a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js (if npx available)
npx serve .
```
Then visit http://localhost:8000

## Testing
Open `tests/game.test.html` in a browser to run tests.

For command-line testing with Node.js (if available):
```bash
node tests/game.test.js
```

## Key Files
- `js/game.js` - Core game logic
- `js/ai.js` - Minimax AI implementation
- `js/ui.js` - DOM manipulation
- `js/sound.js` - Audio management
- `js/storage.js` - localStorage operations
- `js/main.js` - Application entry point

## Conventions
- ES6+ JavaScript (no transpilation)
- CSS custom properties for theming
- Event listeners only (no inline handlers)
- textContent preferred over innerHTML

## Verified Working
(Will be updated as features are implemented and tested)
