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

        // Calculate next position
        const speedFactor = 10;
        const nextX = this.x + this.dx * speedFactor * deltaTime;
        const nextY = this.y + this.dy * speedFactor * deltaTime;

        // Check paddle collision with next position
        const nextBall = {
            x: nextX,
            y: nextY,
            radius: this.radius
        };

        if (this.checkCollisionWithPaddle(nextBall, game.paddle)) {
            // Only process top surface collision if ball is moving downward
            if (this.dy > 0) {
                // Calculate hit position relative to paddle center (-0.5 to 0.5)
                const hitPosition = (nextX - game.paddle.x) / game.paddle.width - 0.5;
                
                // Calculate reflection angle based on hit position
                // Max angle is 60 degrees (PI/3) from vertical
                const maxAngle = Math.PI / 3;
                const angle = hitPosition * maxAngle;
                
                // Calculate new velocity components
                const speed = GameConfig.ballConfig.baseSpeed;
                this.dx = Math.sin(angle) * speed;
                this.dy = -Math.abs(Math.cos(angle) * speed);
                
                // Ensure minimum vertical speed to prevent slow bounces
                const minVerticalSpeed = speed * 0.5;
                if (Math.abs(this.dy) < minVerticalSpeed) {
                    this.dy = -minVerticalSpeed;
                }
                
                // Position ball above paddle with exact collision point
                this.y = game.paddle.y - this.radius;
                this.x = nextX; // Keep the x position where collision happened
                
                // Emit collision event
                game.events.emit(GameEvents.BALL_PADDLE_COLLISION);
            } else {
                // Handle side collision - just bounce horizontally
                this.dx = -this.dx;
                if (nextX < game.paddle.x) {
                    this.x = game.paddle.x - this.radius;
                } else {
                    this.x = game.paddle.x + game.paddle.width + this.radius;
                }
            }
            return; // Skip other collisions for this frame
        }

        // Update position if no collision
        this.x = nextX;
        this.y = nextY;

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

        // Get potential collision candidates from spatial grid
        const candidates = game.spatialGrid.getCollisionCandidates(this);

        // Check collisions with bricks
        for (const candidate of candidates) {
            if (candidate instanceof Brick) {
                if (this.checkCollision(candidate)) {
                    // Determine which side of the brick was hit
                    const ballLeft = this.x - this.radius;
                    const ballRight = this.x + this.radius;
                    const ballTop = this.y - this.radius;
                    const ballBottom = this.y + this.radius;

                    const brickLeft = candidate.x;
                    const brickRight = candidate.x + candidate.width;
                    const brickTop = candidate.y;
                    const brickBottom = candidate.y + candidate.height;

                    // Calculate overlap on each axis
                    const overlapX = Math.min(ballRight - brickLeft, brickRight - ballLeft);
                    const overlapY = Math.min(ballBottom - brickTop, brickBottom - ballTop);

                    // Resolve collision based on minimum overlap
                    if (overlapX < overlapY) {
                        // Horizontal collision
                        if (this.x < candidate.x + candidate.width / 2) {
                            this.x = candidate.x - this.radius;
                        } else {
                            this.x = candidate.x + candidate.width + this.radius;
                        }
                        this.dx = -this.dx;
                    } else {
                        // Vertical collision
                        if (this.y < candidate.y + candidate.height / 2) {
                            this.y = candidate.y - this.radius;
                        } else {
                            this.y = candidate.y + candidate.height + this.radius;
                        }
                        this.dy = -this.dy;
                    }

                    if (candidate.hit()) {
                        const index = game.bricks.indexOf(candidate);
                        if (index !== -1) {
                            console.log('Emitting BRICK_DESTROYED event with brick:', candidate);
                            game.events.emit(GameEvents.BRICK_DESTROYED, candidate);
                            game.bricks.splice(index, 1);
                        }
                    }
                    return; // Skip other collisions for this frame
                }
            }
        }
    }

    checkCollision(entity) {
        // For circular entities (like ball), use radius
        if (entity.radius) {
            const distance = Math.sqrt(
                Math.pow(this.x - entity.x, 2) + 
                Math.pow(this.y - entity.y, 2)
            );
            return distance <= (this.radius + entity.radius);
        }

        // For rectangular entities (like paddle and bricks)
        // Check if ball's edge touches or overlaps with the rectangle
        const ballLeft = this.x - this.radius;
        const ballRight = this.x + this.radius;
        const ballTop = this.y - this.radius;
        const ballBottom = this.y + this.radius;

        const rectLeft = entity.x;
        const rectRight = entity.x + entity.width;
        const rectTop = entity.y;
        const rectBottom = entity.y + entity.height;

        // Check if ball's edge touches or overlaps with the rectangle
        return ballRight >= rectLeft && 
               ballLeft <= rectRight && 
               ballBottom >= rectTop && 
               ballTop <= rectBottom;
    }

    checkCollisionWithPaddle(ball, paddle) {
        // Check if ball's next position would collide with paddle
        const ballBottom = ball.y + ball.radius;
        const ballTop = ball.y - ball.radius;
        const ballLeft = ball.x - ball.radius;
        const ballRight = ball.x + ball.radius;

        const paddleTop = paddle.y;
        const paddleBottom = paddle.y + paddle.height;
        const paddleLeft = paddle.x;
        const paddleRight = paddle.x + paddle.width;

        // Check if ball is moving downward (dy > 0)
        const isMovingDownward = this.dy > 0;

        // For downward movement, only check collision with paddle's top surface
        if (isMovingDownward) {
            return ballBottom >= paddleTop &&
                   ballBottom <= paddleBottom &&
                   ballLeft <= paddleRight &&
                   ballRight >= paddleLeft;
        }

        // For upward movement, check side collisions
        return (ballRight >= paddleLeft && ballLeft <= paddleRight) &&
               (ballBottom >= paddleTop && ballTop <= paddleBottom);
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

    split() {
        console.log('Splitting ball');
        const game = this.game;
        const config = GameConfig.boosterConfig.effects.splitter;
        
        // Create two new balls with adjusted speed and spread angle
        const newSpeed = this.speed * config.speedMultiplier;
        const angle1 = this.angle - config.spreadAngle;
        const angle2 = this.angle + config.spreadAngle;
        
        const ball1 = new Ball(
            this.x,
            this.y,
            newSpeed,
            angle1,
            game,
            this.spriteManager
        );
        
        const ball2 = new Ball(
            this.x,
            this.y,
            newSpeed,
            angle2,
            game,
            this.spriteManager
        );
        
        game.balls.push(ball1, ball2);
        console.log('Created two new balls with speed:', newSpeed, 'and angles:', angle1, angle2);
    }
}
