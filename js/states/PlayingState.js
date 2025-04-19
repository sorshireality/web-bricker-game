import { GameState } from '../core/GameState.js';
import { GameConfig } from '../core/GameConfig.js';
import { GameEvents } from '../core/EventSystem.js';

export class PlayingState extends GameState {
    constructor(game) {
        super(game);
        this.waitingForLaunch = true;
        this.debugMode = false;
    }
    
    enter() {
        this.game.setupLevel();
        this.waitingForLaunch = true;
    }
    
    update(deltaTime) {
        if (this.game.gameOver || this.game.gameCompleted) {
            this.game.stateManager.changeState('gameOver');
            return;
        }
        
        // Update paddle
        this.game.paddle.update(this.game.canvas);

        // Update balls
        this.game.balls.forEach(ball => {
            ball.update(deltaTime, this.game);
        });

        // Game over if no balls left
        if (this.game.balls.length === 0) {
            this.game.gameOver = true;
            return;
        }

        // Update boosters
        this.game.boosters = this.game.boosters.filter(booster => {
            booster.update();
            if (booster.isOffScreen(this.game.canvas)) {
                return false;
            }
            if (booster.collidesWith(this.game.paddle)) {
                this.game.activateBooster(booster.type);
                return false;
            }
            return true;
        });

        // Check level completion - only emit event if all bricks are destroyed
        if (this.game.bricks.length === 0 && !this.game.levelCompleted) {
            this.game.levelCompleted = true;
            if (this.game.level < GameConfig.levels.length) {
                this.game.events.emit(GameEvents.LEVEL_COMPLETED);
                this.game.setupLevel();
                this.waitingForLaunch = true;
            } else {
                this.game.gameCompleted = true;
                this.game.events.emit(GameEvents.GAME_COMPLETED);
            }
        }
    }
    
    draw() {
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        // Draw bricks
        this.game.bricks.forEach(brick => brick.draw(this.game.ctx));
        
        // Draw balls
        this.game.balls.forEach(ball => ball.draw(this.game.ctx));
        
        // Draw paddle
        this.game.paddle.draw(this.game.ctx);
        
        // Draw boosters
        this.game.boosters.forEach(booster => booster.draw(this.game.ctx));

        // Draw launch message if waiting for launch
        if (this.waitingForLaunch) {
            this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
            
            this.game.ctx.fillStyle = '#ffffff';
            this.game.ctx.font = '24px Arial';
            this.game.ctx.textAlign = 'center';
            this.game.ctx.fillText('Press SPACE to launch the ball', this.game.canvas.width / 2, this.game.canvas.height / 2);
        }

        // Draw debug visualization
        this.game.spatialGrid.drawDebug(this.game.ctx);
    }
    
    handleInput(key) {
        switch(key) {
            case 'd':
                this.debugMode = !this.debugMode;
                break;
            case ' ':
                if (this.waitingForLaunch) {
                    this.game.balls.forEach(ball => ball.launch());
                    this.waitingForLaunch = false;
                }
                break;
            case 'ArrowLeft':
                this.game.paddle.setMovingLeft(true);
                break;
            case 'ArrowRight':
                this.game.paddle.setMovingRight(true);
                break;
        }
    }

    exit() {
        // Clean up any state-specific resources
    }
} 