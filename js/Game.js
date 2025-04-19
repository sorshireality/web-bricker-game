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
        this.events.off(GameEvents.LEVEL_COMPLETE);
        this.events.off(GameEvents.BOOSTER_ACTIVATED);

        // Score updates with combo system
        this.events.on(GameEvents.BRICK_DESTROYED, (brick) => {
            console.log('BRICK_DESTROYED event received with brick:', brick);
            this.bricksDestroyedThisShot++;
            this.lastBrickDestroyed = true;

            // Create booster if brick should drop one
            if (brick.type === 'glass') {
                console.log('Glass brick destroyed, checking for booster drop');
                const shouldDrop = Math.random() < GameConfig.boosterConfig.dropChance.glass;
                if (shouldDrop) {
                    console.log('Creating booster from brick');
                    const booster = new Booster(
                        brick.x + brick.width/2,
                        brick.y + brick.height/2,
                        'splitter',
                        this.spriteManager
                    );
                    this.boosters.push(booster);
                    console.log('Booster created:', booster);
                }
            }

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

        // Reset combo when ball hits paddle - no logging needed
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
        this.events.on(GameEvents.LEVEL_COMPLETE, () => {
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
            console.log('Booster activated:', type);
            this.activateBooster(type);
        });
    }

    setupLevel() {
        // Reset level completion state
        this.levelCompleted = false;
        this.bricks = [];
        
        // Setup bricks for current level
        const levelConfig = GameConfig.levels[this.level - 1];
        const brickWidth = GameConfig.brickConfig.width;
        const brickHeight = GameConfig.brickConfig.height;
        const padding = GameConfig.brickConfig.padding;
        const offsetTop = GameConfig.brickConfig.offsetTop;
        
        console.log('Setting up level:', this.level);
        console.log('Level config:', levelConfig);
        
        // Calculate total width of brick grid including padding
        const totalWidth = (levelConfig.brickColumns * brickWidth) + 
                          ((levelConfig.brickColumns - 1) * padding);
        
        // Calculate starting x position to center the grid
        const startX = (this.canvas.width - totalWidth) / 2;
        
        // Create bricks with proper spacing
        for (let row = 0; row < levelConfig.brickRows; row++) {
            for (let col = 0; col < levelConfig.brickColumns; col++) {
                const x = startX + (col * (brickWidth + padding));
                const y = offsetTop + (row * (brickHeight + padding));
                const isGlass = Math.random() < levelConfig.brickDistribution.glass;
                const type = isGlass ? 'glass' : 'wooden';
                console.log('Creating brick:', { row, col, type, isGlass });
                const brick = new Brick(x, y, type, this.spriteManager);
                this.bricks.push(brick);
            }
        }
        
        // Reset balls
        this.balls = [];
        const ballX = this.paddle.x + this.paddle.width / 2;
        const ballY = this.paddle.y - GameConfig.ballConfig.radius - 10;
        this.balls.push(new Ball(ballX, ballY, GameConfig.ballConfig.radius, this.spriteManager));
        
        // Emit level start event
        this.events.emit(GameEvents.LEVEL_START, { level: this.level });
    }

    update(deltaTime) {
        if (this.gameOver) {
            this.stateManager.changeState('gameOver');
            return;
        }
        
        // Filter out balls that are below the paddle
        this.balls = this.balls.filter(ball => {
            if (ball.y + ball.radius >= this.canvas.height) {
                console.log('Ball lost, remaining balls:', this.balls.length - 1);
                return false;
            }
            return true;
        });
        
        // Game over only if all balls are lost
        if (this.balls.length === 0) {
            console.log('All balls lost, game over');
            this.gameOver = true;
            this.stateManager.changeState('gameOver');
            return;
        }
        
        // Update spatial grid for collision detection
        this.spatialGrid.clear();
        
        // Add bricks to spatial grid
        this.bricks.forEach(brick => {
            this.spatialGrid.add(brick);
        });
        
        // Add balls to spatial grid - ensure they have proper dimensions
        this.balls.forEach(ball => {
            this.spatialGrid.add(ball);
        });
        
        // Add paddle to spatial grid
        this.spatialGrid.add(this.paddle);
        
        // Update and add boosters to spatial grid
        this.boosters = this.boosters.filter(booster => {
            booster.update();
            if (booster.isOffScreen(this.canvas)) {
                console.log('Booster off screen');
                return false;
            }
            
            // Check for booster-paddle collision
            if (booster.collidesWith(this.paddle)) {
                console.log('Booster collided with paddle');
                this.events.emit(GameEvents.BOOSTER_ACTIVATED, { type: booster.type });
                return false;
            }
            
            this.spatialGrid.add(booster);
            return true;
        });
        
        // Let the current state handle the game logic (including level completion)
        this.stateManager.update(deltaTime);
    }

    draw() {
        if (this.gameOver) {
            this.stateManager.draw();
            return;
        }
        
        // Draw all game objects
        this.bricks.forEach(brick => brick.draw(this.ctx));
        this.balls.forEach(ball => ball.draw(this.ctx));
        this.paddle.draw(this.ctx);
        this.boosters.forEach(booster => booster.draw(this.ctx));
        
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
            // Split all existing balls
            const newBalls = [];
            this.balls.forEach(ball => {
                // Create two new balls at the same position as the original
                const ball1 = new Ball(ball.x, ball.y, ball.radius, this.spriteManager);
                const ball2 = new Ball(ball.x, ball.y, ball.radius, this.spriteManager);
                
                // Set velocities for new balls
                const angle = Math.atan2(ball.dy, ball.dx);
                const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                
                // First ball goes slightly left
                ball1.dx = speed * Math.cos(angle - Math.PI/6);
                ball1.dy = speed * Math.sin(angle - Math.PI/6);
                ball1.launched = true;
                
                // Second ball goes slightly right
                ball2.dx = speed * Math.cos(angle + Math.PI/6);
                ball2.dy = speed * Math.sin(angle + Math.PI/6);
                ball2.launched = true;
                
                newBalls.push(ball1, ball2);
            });
            
            // Add new balls to existing ones
            this.balls.push(...newBalls);
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