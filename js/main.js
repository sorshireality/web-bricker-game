// ==== GAME SETUP ====
import { SpriteManager } from './core/SpriteManager.js';
import { Ball } from './entities/Ball.js';
import { Paddle } from './entities/Paddle.js';
import {CollisionDetector} from "./core/CollisionDetector.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

if (!canvas) {
    throw new Error("Fatal Error: Canvas element not found!");
}

const spriteManager = new SpriteManager();

let paddle;
let ball;
let gameRunning = false;

function initializeGame() {
    const paddleWidth = 100;
    const paddleHeight = 20;
    const paddleX = (canvas.width - paddleWidth) / 2;
    const paddleY = canvas.height - paddleHeight - 20;
    paddle = new Paddle(paddleX, paddleY, paddleWidth, paddleHeight, spriteManager);

    const ballRadius = 10;
    const ballX = canvas.width / 2;
    const ballY = paddleY - ballRadius - 10;
    ball = new Ball(ballX, ballY, ballRadius, spriteManager);

    document.addEventListener('mousemove', mouseMoveHandler);

    gameRunning = true;
    gameLoop();
}

function mouseMoveHandler(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    let mouseX = (e.clientX - rect.left) * scaleX;

    if (paddle) {
        paddle.x = mouseX - paddle.width / 2;

        if (paddle.x < 0) {
            paddle.x = 0;
        }
        if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    }
}

// ==== GAME LOOP ====
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (paddle) paddle.update(canvas);
    if (ball) ball.update(canvas);

    if (ball && paddle) {
        CollisionDetector.checkPaddle(ball, paddle);
    }

    if (paddle) paddle.draw(ctx);
    if (ball) ball.draw(ctx);

    requestAnimationFrame(gameLoop);
}

// ==== LOAD ASSETS AND START ====
const SPRITESHEET_PATH = './assets/spritesheet.png';
const hasSpriteSheet = false;

if (hasSpriteSheet) {
    spriteManager.load(SPRITESHEET_PATH, (error) => {
        if (error) {
            console.error("Spritesheet failed to load. Proceeding without sprites.");
        }
        initializeGame();
    });
} else {
    initializeGame();
}
