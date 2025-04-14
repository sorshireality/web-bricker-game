// ==== GAME SETUP ====
import { Game } from './Game.js';
import { Log } from './entities/Log.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

if (!canvas) {
    throw new Error("Fatal Error: Canvas element not found!");
}

// Game state management
const GameState = {
    MENU: 'menu',
    RUNNING: 'running',
    PAUSED: 'paused',
    GAME_OVER: 'game_over',
    LEVEL_COMPLETE: 'level_complete'
};

let gameState = GameState.MENU;
let game;
let log;

// Performance optimization
let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

// Create start button
const startButton = document.createElement('button');
startButton.textContent = 'Start Game';
startButton.style.position = 'fixed';
startButton.style.top = '50%';
startButton.style.left = '42%';
startButton.style.transform = 'translate(-50%, -50%)';
startButton.style.padding = '15px 30px';
startButton.style.fontSize = '20px';
startButton.style.cursor = 'pointer';
startButton.style.backgroundColor = '#4CAF50';
startButton.style.color = 'white';
startButton.style.border = 'none';
startButton.style.borderRadius = '5px';
startButton.style.zIndex = '1000';
startButton.style.display = 'block';
document.body.appendChild(startButton);

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    initializeGame();
});

function initializeGame() {
    log = new Log();
    log.addMessage("Game started! Break those bricks!", "#00ff00");
    game = new Game(canvas);
    setupEventListeners();
    gameState = GameState.RUNNING;
    requestAnimationFrame(gameLoop);
}

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

    // Click handling for restart button
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        game.handleClick(x, y);
    });
}

function handleKeyDown(e) {
    if (gameState !== GameState.RUNNING) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            game.paddle.setMovingLeft(true);
            break;
        case 'ArrowRight':
            game.paddle.setMovingRight(true);
            break;
    }
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
    const scaleX = canvas.width / rect.width;
    let mouseX = (e.clientX - rect.left) * scaleX;

    if (game.paddle) {
        game.paddle.x = Math.max(0, Math.min(mouseX - game.paddle.width / 2, canvas.width - game.paddle.width));
    }
}

function togglePause() {
    if (gameState === GameState.RUNNING) {
        gameState = GameState.PAUSED;
        log.addMessage("Game Paused", "#ffff00");
    } else if (gameState === GameState.PAUSED) {
        gameState = GameState.RUNNING;
        log.addMessage("Game Resumed", "#00ff00");
        requestAnimationFrame(gameLoop);
    }
}

// ==== GAME LOOP ====
function gameLoop(timestamp) {
    if (gameState !== GameState.RUNNING) return;

    // Frame rate limiting
    const elapsed = timestamp - lastFrameTime;
    if (elapsed < frameInterval) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastFrameTime = timestamp;

    // Update and draw game
    game.update();
    game.draw();

    // Update score display
    document.getElementById('scoreValue').textContent = game.score;
    document.getElementById('levelValue').textContent = game.level;

    requestAnimationFrame(gameLoop);
}
