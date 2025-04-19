import { AbstractEntity } from '../core/AbstractEntity.js';
import { BallSkin } from '../skins/BallSkin.js';
import { GameConfig } from '../core/GameConfig.js';
import { GameEvents } from '../core/EventSystem.js';
import { Booster } from './Booster.js';
import { Paddle } from './Paddle.js';
import { Brick } from './Brick.js';

export class Ball extends AbstractEntity {
    constructor(x, y, radius, spriteManager = null) {
        super(x, y);
        this.radius = radius;
        this.dx = 0;
        this.dy = 0;
        this.spriteManager = spriteManager;
        this.skin = new BallSkin(this, this.spriteManager);
        this.fireMode = false;
        this.launched = false;
        this.debugCollision = false;
        console.log('Ball created:', { x, y, radius });
    }

    launch() {
        if (!this.launched) {
            const speed = GameConfig.ballConfig.baseSpeed;
            this.dx = speed;
            this.dy = -speed;
            this.launched = true;
            console.log('Ball launched:', { dx: this.dx, dy: this.dy });
        }
    }

    update(deltaTime, game) {
        if (!game) {
            return;
        }

        if (!this.launched) {
            // Follow paddle
            this.x = game.paddle.x + game.paddle.width / 2;
            return;
        }

        // Update position with fixed speed
        const speedFactor = 10;
        this.x += this.dx * speedFactor * deltaTime;
        this.y += this.dy * speedFactor * deltaTime;

        // Wall collision
        if (this.x - this.radius <= 0) {
            this.x = this.radius;
            this.dx = Math.abs(this.dx);
        } else if (this.x + this.radius >= game.canvas.width) {
            this.x = game.canvas.width - this.radius;
            this.dx = -Math.abs(this.dx);
        }

        // Ceiling collision
        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.dy = Math.abs(this.dy);
        }

        // Check paddle collision first
        if (this.checkCollision(game.paddle)) {
            const hitPosition = (this.x - game.paddle.x) / game.paddle.width;
            const angle = (hitPosition - 0.5) * Math.PI;
            
            const speed = GameConfig.ballConfig.baseSpeed;
            this.dx = Math.sin(angle) * speed;
            this.dy = -Math.abs(Math.cos(angle) * speed);
            
            this.y = game.paddle.y - this.radius - 1;
            
            // Only emit collision event if the ball was moving downward
            if (this.dy > 0) {
                game.events.emit(GameEvents.BALL_PADDLE_COLLISION);
            }
            return; // Skip other collisions for this frame
        }

        // Get potential collision candidates from spatial grid
        const candidates = game.spatialGrid.getCollisionCandidates(this);

        // Check collisions with bricks
        for (const candidate of candidates) {
            if (candidate instanceof Brick) {
                const distanceX = Math.abs(this.x - (candidate.x + candidate.width / 2));
                const distanceY = Math.abs(this.y - (candidate.y + candidate.height / 2));
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                if (distance < this.radius) {
                    const overlapX = this.radius - Math.abs(distanceX);
                    const overlapY = this.radius - Math.abs(distanceY);

                    if (overlapX < overlapY) {
                        this.dx = -this.dx;
                    } else {
                        this.dy = -this.dy;
                    }

                    if (candidate.hit()) {
                        const index = game.bricks.indexOf(candidate);
                        if (index !== -1) {
                            game.bricks.splice(index, 1);
                            game.events.emit(GameEvents.BRICK_DESTROYED, { type: candidate.type });

                            if (Math.random() < GameConfig.boosterConfig.dropChance) {
                                const booster = new Booster(
                                    candidate.x + candidate.width / 2,
                                    candidate.y + candidate.height / 2,
                                    Math.random() < 0.5 ? 'splitter' : 'fire',
                                    game.spriteManager
                                );
                                game.boosters.push(booster);
                            }
                        }
                    }
                    return; // Skip other collisions for this frame
                }
            }
        }

        // Bottom collision (game over)
        if (this.y + this.radius >= game.canvas.height) {
            game.events.emit(GameEvents.GAME_OVER);
        }
    }

    checkCollision(entity) {
        const collision = this.x + this.radius > entity.x &&
               this.x - this.radius < entity.x + (entity.width || entity.radius * 2) &&
               this.y + this.radius > entity.y &&
               this.y - this.radius < entity.y + (entity.height || entity.radius * 2);
        
        console.log('Collision check:', {
            ball: { x: this.x, y: this.y, radius: this.radius },
            entity: { 
                x: entity.x, 
                y: entity.y, 
                width: entity.width || entity.radius * 2, 
                height: entity.height || entity.radius * 2 
            },
            result: collision
        });
        
        return collision;
    }

    setFireMode(enabled) {
        this.fireMode = enabled;
        this.skin.setFireMode(enabled);
    }

    isFireMode() {
        return this.fireMode;
    }

    draw(ctx) {
        // First, draw the ball using its skin
        this.skin.draw(ctx);
        
        // For debugging collision box visualization
        if (this.debugCollision) {
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.strokeRect(
                this.x - this.radius, 
                this.y - this.radius, 
                this.radius * 2, 
                this.radius * 2
            );
        }
    }
}
