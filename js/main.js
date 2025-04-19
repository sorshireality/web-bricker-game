// ==== GAME SETUP ====
import { Game } from './Game.js';
import { Log } from './entities/Log.js';
import { GameEvents } from './core/EventSystem.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreValue = document.getElementById('scoreValue');
const levelValue = document.getElementById('levelValue');
const logMessages = document.getElementById('logMessages');

if (!canvas) {
    throw new Error("Fatal Error: Canvas element not found!");
}

// Game state management
const GameState = {
    RUNNING: 'running',
    PAUSED: 'paused'
};

let gameState = GameState.RUNNING;
let game;

// Performance optimization
let lastFrameTime = performance.now();
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

// Initialize game
game = new Game(canvas);
setupEventListeners();
requestAnimationFrame(gameLoop);

function setupEventListeners() {
    // Mouse controls
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Pause game
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            togglePause();
        }
    });

    // Game events
    game.events.on(GameEvents.SCORE_CHANGED, ({ score, combo, scoreGain }) => {
        scoreValue.textContent = score;
    });

    game.events.on(GameEvents.LEVEL_CHANGED, ({ level }) => {
        levelValue.textContent = level;
    });

    game.events.on(GameEvents.LOG_MESSAGE, ({ message, color = '#ffffff' }) => {
        addLogMessage(message, color);
    });

    game.events.on(GameEvents.GAME_OVER, () => {
        addLogMessage('Game Over!', '#ff0000');
    });

    game.events.on(GameEvents.GAME_COMPLETED, () => {
        addLogMessage('Congratulations! You completed all levels!', '#00ff00');
    });
}

function addLogMessage(message, color = '#ffffff') {
    const messageElement = document.createElement('div');
    messageElement.className = 'log-message';
    messageElement.textContent = message;
    messageElement.style.color = color;
    logMessages.insertBefore(messageElement, logMessages.firstChild);
    
    // Limit log messages to 10
    while (logMessages.children.length > 10) {
        logMessages.removeChild(logMessages.lastChild);
    }
}

function handleKeyDown(e) {
    if (gameState !== GameState.RUNNING) return;
    game.handleInput(e.key);
}

function handleKeyUp(e) {
    switch(e.key) {
        case 'ArrowLeft':
            game.paddle.setMovingLeft(false);
            break;
        case 'ArrowRight':
            game.paddle.setMovingRight(false);
            break;
    }
}

function mouseMoveHandler(e) {
    if (gameState !== GameState.RUNNING) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const paddleX = mouseX - game.paddle.width / 2;
    
    // Keep paddle within canvas bounds
    const maxPaddleX = canvas.width - game.paddle.width;
    game.paddle.x = Math.max(0, Math.min(paddleX, maxPaddleX));
}

function togglePause() {
    if (gameState === GameState.RUNNING) {
        gameState = GameState.PAUSED;
        addLogMessage("Game paused", "#ffcc00");
    } else {
        gameState = GameState.RUNNING;
        addLogMessage("Game resumed", "#00ff00");
    }
}

function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastFrameTime) / 1000; // Convert to seconds
    lastFrameTime = timestamp;

    if (gameState === GameState.RUNNING) {
        game.update(deltaTime);
        game.draw();
    }
    
    requestAnimationFrame(gameLoop);
}
