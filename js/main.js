// ==== GAME SETUP ====
import { SpriteManager } from './core/SpriteManager.js';
import { Ball } from './entities/Ball.js';
import { Paddle } from './entities/Paddle.js';
import {CollisionDetector} from "./core/CollisionDetector.js";
import {StarBrick} from "./entities/StarBrick.js";
import { Score } from './entities/Score.js';
import { Log } from './entities/Log.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

if (!canvas) {
    throw new Error("Fatal Error: Canvas element not found!");
}

const spriteManager = new SpriteManager();

// Game state management
const GameState = {
    INITIALIZING: 'initializing',
    RUNNING: 'running',
    PAUSED: 'paused',
    GAME_OVER: 'game_over',
    LEVEL_COMPLETE: 'level_complete'
};

let gameState = GameState.INITIALIZING;
let paddle;
let ball;
let bricks = [];
let score;
let log;
let lastBrickHitTime = 0;
const comboTimeWindow = 500;

const brickRowCount = 3;
const brickColumnCount = 8;
const brickWidth = 48;
const brickHeight = 20;
const brickPadding = 5;
const brickOffsetTop = 30;
const gridWidth = brickColumnCount * (brickWidth + brickPadding) - brickPadding;
const brickOffsetLeft = (canvas.width - gridWidth) / 2;

// Performance optimization
let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

function initializeGame() {
    score = new Score();
    log = new Log();
    log.addMessage("Game started! Break those bricks!", "#00ff00");

    const paddleWidth = 100;
    const paddleHeight = 20;
    const paddleX = (canvas.width - paddleWidth) / 2;
    const paddleY = canvas.height - paddleHeight - 20;
    paddle = new Paddle(paddleX, paddleY, paddleWidth, paddleHeight, spriteManager);

    const ballRadius = 10;
    const ballX = canvas.width / 2;
    const ballY = paddleY - ballRadius - 10;
    ball = new Ball(ballX, ballY, ballRadius, spriteManager);

    createBricks();
    setupEventListeners();
    
    gameState = GameState.RUNNING;
    requestAnimationFrame(gameLoop);
}

function createBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks.push(new StarBrick(brickX, brickY, brickWidth, brickHeight, 1, spriteManager));
        }
    }
}

function setupEventListeners() {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    
    // Add keyboard controls for pause/resume
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            togglePause();
        }
    });
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

function mouseMoveHandler(e) {
    if (gameState !== GameState.RUNNING) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    let mouseX = (e.clientX - rect.left) * scaleX;

    if (paddle) {
        paddle.x = Math.max(0, Math.min(mouseX - paddle.width / 2, canvas.width - paddle.width));
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update game objects
    paddle.update(canvas);
    ball.update(canvas);

    // Check collisions
    CollisionDetector.checkPaddle(ball, paddle);
    const result = CollisionDetector.checkBricks(ball, bricks);

    if (result.bricksHit > 0) {
        const now = Date.now();
        const isCombo = (now - lastBrickHitTime) < comboTimeWindow;
        lastBrickHitTime = now;

        const scoreInfo = score.addPoints(result.bricksHit, isCombo);
        log.logScore(scoreInfo);
    }

    bricks = result.bricks;

    // Check game state
    if (bricks.length === 0) {
        gameState = GameState.LEVEL_COMPLETE;
        log.addMessage("LEVEL COMPLETE!", "#0F0");
        // Add level progression logic here
    }

    if (CollisionDetector.checkWalls(ball, canvas)) {
        gameState = GameState.GAME_OVER;
        log.addMessage("Game Over!", "#ff0000");
        return;
    }

    // Draw game objects
    paddle.draw(ctx);
    bricks.forEach(brick => brick.draw(ctx));
    ball.draw(ctx);

    requestAnimationFrame(gameLoop);
}

// ==== LOAD ASSETS AND START ====
const SPRITESHEET_PATH = './assets/spritesheet.png';
const hasSpriteSheet = false;

if (hasSpriteSheet) {
    console.log("Loading spritesheet...");
    spriteManager.load(SPRITESHEET_PATH, (error) => {
        if (error) {
            console.error("Spritesheet failed to load. Proceeding without sprites.");
        } else {
            console.log("Spritesheet loaded.");
        }
        initializeGame();
    });
} else {
    initializeGame();
}
