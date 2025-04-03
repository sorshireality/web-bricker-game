// ==== GAME SETUP ====
import { SpriteManager } from './core/SpriteManager.js';
import { Ball } from './entities/Ball.js';
import { Paddle } from './entities/Paddle.js';
import {CollisionDetector} from "./core/CollisionDetector.js";
import {StarBrick} from "./entities/StarBrick.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

if (!canvas) {
    throw new Error("Fatal Error: Canvas element not found!");
}

const spriteManager = new SpriteManager();

let paddle;
let ball;
let bricks = [];
let gameRunning = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 90; // Should match or be passed to StarBrick constructor
const brickHeight = 20; // Should match or be passed to StarBrick constructor
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

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

    // Create Bricks
    bricks = []; // Clear existing bricks if re-initializing
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            // Add new brick instance to the array
            bricks.push(new StarBrick(brickX, brickY, brickWidth, brickHeight, 1, spriteManager)); // Health = 1
        }
    }
    console.log(`Created ${bricks.length} bricks.`);

    document.removeEventListener('mousemove', mouseMoveHandler); // Remove previous listener if any
    document.addEventListener('mousemove', mouseMoveHandler);

    if (!gameRunning) { // Prevent multiple loops if re-initializing
        gameRunning = true;
        gameLoop();
    }
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

    if (ball && bricks) {
        bricks = CollisionDetector.checkBricks(ball, bricks);
    }

    if (paddle) paddle.draw(ctx);
    bricks.forEach(brick => {
        if (brick) brick.draw(ctx);
    });
    if (ball) ball.draw(ctx);
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
