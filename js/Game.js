import { GameConfig } from './core/GameConfig.js';
import { Booster } from './entities/Booster.js';
import { Brick } from './entities/Brick.js';
import { Ball } from './entities/Ball.js';
import { Paddle } from './entities/Paddle.js';
import { SpriteManager } from './core/SpriteManager.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.boosters = [];
        this.activeBoosters = {
            splitter: false,
            fire: false
        };
        this.score = 0;
        this.level = 1;
        this.bricks = [];
        this.balls = [];
        this.spriteManager = new SpriteManager();
        this.gameOver = false;
        this.gameCompleted = false;
        
        // Initialize paddle with proper dimensions
        const paddleWidth = GameConfig.paddleConfig.width;
        const paddleHeight = GameConfig.paddleConfig.height;
        const paddleX = (canvas.width - paddleWidth) / 2;
        const paddleY = canvas.height - paddleHeight - 20;
        this.paddle = new Paddle(paddleX, paddleY, paddleWidth, paddleHeight, this.spriteManager);
        
        this.setupLevel();
    }

    setupLevel() {
        this.bricks = [];
        const levelConfig = GameConfig.levels[this.level - 1];
        const brickWidth = GameConfig.brickConfig.width;
        const brickHeight = GameConfig.brickConfig.height;
        const padding = GameConfig.brickConfig.padding;
        const offsetTop = GameConfig.brickConfig.offsetTop;

        // Calculate total width of the brick grid
        const totalWidth = levelConfig.brickColumns * (brickWidth + padding) - padding;
        // Calculate starting x position to center the grid
        const startX = (this.canvas.width - totalWidth) / 2;

        for (let row = 0; row < levelConfig.brickRows; row++) {
            for (let col = 0; col < levelConfig.brickColumns; col++) {
                const x = startX + col * (brickWidth + padding);
                const y = row * (brickHeight + padding) + offsetTop;
                const type = Math.random() < levelConfig.brickDistribution.glass ? 'glass' : 'wooden';
                this.bricks.push(new Brick(x, y, type, this.spriteManager));
            }
        }

        // Reset balls with proper radius
        const ballRadius = GameConfig.ballConfig.radius;
        const ballX = this.canvas.width / 2;
        const ballY = this.paddle.y - ballRadius - 10;
        this.balls = [new Ball(ballX, ballY, ballRadius, this.spriteManager)];
    }

    update() {
        if (this.gameOver || this.gameCompleted) {
            return;
        }

        // Update paddle
        this.paddle.update(this.canvas);

        // Update balls and check for game over
        this.balls = this.balls.filter(ball => {
            const isGameOver = ball.update(this.canvas, this.paddle);
            if (isGameOver) {
                return false;
            }
            
            // Check brick collisions
            this.bricks.forEach(brick => {
                if (brick.active && ball.collidesWith(brick)) {
                    ball.bounceOffBrick(brick);
                    if (brick.takeDamage()) {
                        this.score += 100;
                        if (brick.shouldDropBooster()) {
                            const boosterType = brick.getBoosterType();
                            const booster = new Booster(
                                brick.x + brick.width/2,
                                brick.y + brick.height,
                                boosterType,
                                this.spriteManager
                            );
                            this.boosters.push(booster);
                        }
                    }
                }
            });
            
            return true;
        });

        // Game over if no balls left
        if (this.balls.length === 0) {
            this.gameOver = true;
            return;
        }

        // Update boosters
        this.boosters = this.boosters.filter(booster => {
            booster.update();
            if (booster.isOffScreen(this.canvas)) {
                return false;
            }
            if (booster.collidesWith(this.paddle)) {
                this.activateBooster(booster.type);
                return false;
            }
            return true;
        });

        // Check level completion
        if (this.bricks.every(brick => !brick.active)) {
            this.level++;
            if (this.level <= GameConfig.levels.length) {
                this.setupLevel();
            } else {
                this.gameCompleted = true;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw bricks
        this.bricks.forEach(brick => brick.draw(this.ctx));
        
        // Draw balls
        this.balls.forEach(ball => ball.draw(this.ctx));
        
        // Draw paddle
        this.paddle.draw(this.ctx);
        
        // Draw boosters
        this.boosters.forEach(booster => booster.draw(this.ctx));

        // Draw game over or game completed message
        if (this.gameOver) {
            this.drawMessage('GAME OVER');
        } else if (this.gameCompleted) {
            this.drawMessage('GAME COMPLETED!');
        }
    }

    drawMessage(message) {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw message
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
        
        // Draw score
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);

        // Draw restart button
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = (this.canvas.width - buttonWidth) / 2;
        const buttonY = this.canvas.height / 2 + 80;

        // Button background
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // Button text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('RESTART', this.canvas.width / 2, buttonY + 35);

        // Store button coordinates for click detection
        this.restartButton = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };
    }

    handleClick(x, y) {
        if (this.gameOver || this.gameCompleted) {
            // Check if click is within restart button bounds
            if (this.restartButton && 
                x >= this.restartButton.x && 
                x <= this.restartButton.x + this.restartButton.width &&
                y >= this.restartButton.y && 
                y <= this.restartButton.y + this.restartButton.height) {
                this.reset();
            }
        }
    }

    activateBooster(type) {
        if (this.activeBoosters[type]) {
            return; // Booster already active
        }

        this.activeBoosters[type] = true;
        const effect = GameConfig.boosterConfig.effects[type];
        
        if (type === 'splitter') {
            // Split all balls
            const newBalls = [];
            this.balls.forEach(ball => {
                const ball1 = new Ball(ball.x, ball.y, ball.radius, this.spriteManager);
                const ball2 = new Ball(ball.x, ball.y, ball.radius, this.spriteManager);
                ball1.dx = -ball.dx;
                ball2.dx = ball.dx;
                newBalls.push(ball1, ball2);
            });
            this.balls = newBalls;
        } else if (type === 'fire') {
            // Activate fire mode for all balls
            this.balls.forEach(ball => {
                ball.setFireMode(true);
            });
            
            // Deactivate after duration
            setTimeout(() => {
                if (this.activeBoosters[type]) { // Check if still active
                    this.activeBoosters[type] = false;
                    this.balls.forEach(ball => {
                        ball.setFireMode(false);
                    });
                }
            }, effect.duration);
        }
    }

    reset() {
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.gameCompleted = false;
        this.boosters = [];
        this.activeBoosters = {
            splitter: false,
            fire: false
        };
        this.setupLevel();
    }
} 