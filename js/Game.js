import { GameConfig } from './core/GameConfig.js';
import { Booster } from './entities/Booster.js';
import { Brick } from './entities/Brick.js';
import { Ball } from './entities/Ball.js';
import { Paddle } from './entities/Paddle.js';
import { SpriteManager } from './core/SpriteManager.js';
import { StateManager } from './core/StateManager.js';
import { PlayingState } from './states/PlayingState.js';
import { GameOverState } from './states/GameOverState.js';
import { EventSystem, GameEvents } from './core/EventSystem.js';
import { SpatialGrid } from './core/SpatialGrid.js';

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
        this.levelCompleted = false;
        
        // Initialize spatial grid for collision detection
        this.spatialGrid = new SpatialGrid(
            GameConfig.collisionConfig.cellSize,
            canvas.width,
            canvas.height
        );
        
        // Combo system
        this.currentCombo = 0;
        this.bricksDestroyedThisShot = 0;
        this.lastBrickDestroyed = false;
        
        // Initialize event system
        this.events = new EventSystem();
        
        // Initialize paddle with proper dimensions
        const paddleWidth = GameConfig.paddleConfig.width;
        const paddleHeight = GameConfig.paddleConfig.height;
        const paddleX = (canvas.width - paddleWidth) / 2;
        const paddleY = canvas.height - paddleHeight - 20;
        this.paddle = new Paddle(paddleX, paddleY, paddleWidth, paddleHeight, this.spriteManager);
        
        // Initialize state manager
        this.stateManager = new StateManager(this);
        this.stateManager.addState('playing', new PlayingState(this));
        this.stateManager.addState('gameOver', new GameOverState(this));
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start with playing state
        this.stateManager.changeState('playing');
    }

    setupEventListeners() {
        // Remove any existing listeners first
        this.events.off(GameEvents.BRICK_DESTROYED);
        this.events.off(GameEvents.BALL_PADDLE_COLLISION);
        this.events.off(GameEvents.GAME_OVER);
        this.events.off(GameEvents.GAME_COMPLETED);
        this.events.off(GameEvents.LEVEL_COMPLETED);
        this.events.off(GameEvents.BOOSTER_ACTIVATED);

        // Score updates with combo system
        this.events.on(GameEvents.BRICK_DESTROYED, () => {
            this.bricksDestroyedThisShot++;
            this.lastBrickDestroyed = true;

            // Calculate score with combo multiplier
            const baseScore = 100;
            const comboMultiplier = Math.min(5, 1 + (this.bricksDestroyedThisShot - 1) * 0.5);
            const scoreGain = Math.floor(baseScore * comboMultiplier);
            
            this.score += scoreGain;

            // Update score display
            const scoreValue = document.getElementById('scoreValue');
            if (scoreValue) {
                scoreValue.textContent = this.score;
            }

            // Log combo message if multiple bricks destroyed
            if (this.bricksDestroyedThisShot > 1) {
                const message = `Combo x${this.bricksDestroyedThisShot}! +${scoreGain} points`;
                const color = '#ffcc00';
                const logMessages = document.getElementById('logMessages');
                if (logMessages) {
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
            }
        });

        // Reset combo when ball hits paddle
        this.events.on(GameEvents.BALL_PADDLE_COLLISION, () => {
            this.bricksDestroyedThisShot = 0;
            this.lastBrickDestroyed = false;
        });

        // Game state changes
        this.events.on(GameEvents.GAME_OVER, () => {
            this.gameOver = true;
            this.stateManager.changeState('gameOver');
        });

        this.events.on(GameEvents.GAME_COMPLETED, () => {
            this.gameCompleted = true;
            this.stateManager.changeState('gameOver');
        });

        // Level progression
        this.events.on(GameEvents.LEVEL_COMPLETED, () => {
            this.level++;
            const levelValue = document.getElementById('levelValue');
            if (levelValue) {
                levelValue.textContent = this.level;
            }
            
            const logMessages = document.getElementById('logMessages');
            if (logMessages) {
                const messageElement = document.createElement('div');
                messageElement.className = 'log-message';
                messageElement.textContent = `Level ${this.level - 1} completed!`;
                messageElement.style.color = '#ffcc00';
                logMessages.insertBefore(messageElement, logMessages.firstChild);
                
                // Limit log messages to 10
                while (logMessages.children.length > 10) {
                    logMessages.removeChild(logMessages.lastChild);
                }
            }
        });

        // Booster handling
        this.events.on(GameEvents.BOOSTER_ACTIVATED, ({ type }) => {
            this.activateBooster(type);
        });
    }

    setupLevel() {
        this.bricks = [];
        this.levelCompleted = false;  // Reset the level completed flag
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

        // Reset balls with proper radius and position
        const ballRadius = GameConfig.ballConfig.radius;
        const ballX = this.paddle.x + this.paddle.width / 2;
        const ballY = this.paddle.y - ballRadius - 10;
        this.balls = [new Ball(ballX, ballY, ballRadius, this.spriteManager)];
        
        this.events.emit(GameEvents.LEVEL_START, { level: this.level });
    }

    update(deltaTime) {
        if (this.gameOver) {
            this.stateManager.changeState('gameOver');
            return;
        }
        
        if (this.balls.length === 0) {
            this.gameOver = true;
            this.stateManager.changeState('gameOver');
            return;
        }
        
        // Update spatial grid
        this.spatialGrid.clear();
        this.bricks.forEach(brick => this.spatialGrid.add(brick));
        this.balls.forEach(ball => this.spatialGrid.add(ball));
        this.spatialGrid.add(this.paddle);
        
        // Check level completion only when all bricks are destroyed and we're not at the last level
        if (this.bricks.length === 0 && !this.gameOver && !this.levelCompleted) {
            if (this.level < GameConfig.levels.length) {
                this.levelCompleted = true;
                this.events.emit(GameEvents.LEVEL_COMPLETED);
                this.setupLevel();
            } else {
                this.gameCompleted = true;
                this.events.emit(GameEvents.GAME_COMPLETED);
            }
        }
        
        this.stateManager.update(deltaTime);
    }

    draw() {
        if (this.gameOver) {
            this.stateManager.draw();
            return;
        }
        
        if (this.balls.length === 0) {
            this.gameOver = true;
            this.stateManager.draw();
            return;
        }
        
        this.stateManager.draw();
    }

    handleInput(key) {
        this.stateManager.handleInput(key);
    }

    activateBooster(type) {
        if (this.activeBoosters[type]) {
            return; // Booster already active
        }

        this.activeBoosters[type] = true;
        
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
                    this.events.emit(GameEvents.BOOSTER_DEACTIVATED, { type });
                }
            }, GameConfig.boosterConfig.effects.fire.duration);
        }
    }

    reset() {
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.gameCompleted = false;
        this.levelCompleted = false;
        this.boosters = [];
        this.activeBoosters = {
            splitter: false,
            fire: false
        };
        this.bricksDestroyedThisShot = 0;
        this.lastBrickDestroyed = false;
        this.setupLevel();
        this.events.emit(GameEvents.GAME_START);
    }
} 