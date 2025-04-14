import { AbstractEntity } from '../core/AbstractEntity.js';
import { BallSkin } from '../skins/BallSkin.js';
import { GameConfig } from '../core/GameConfig.js';

export class Ball extends AbstractEntity {
    constructor(x, y, radius, spriteManager = null) {
        super(x, y);
        this.radius = radius;
        this.dx = 0;
        this.dy = -GameConfig.ballConfig.baseSpeed;
        this.spriteManager = spriteManager;
        this.skin = new BallSkin(this, this.spriteManager);
        this.fireMode = false;
    }

    update(canvas, paddle) {
        // Update position
        this.x += this.dx;
        this.y += this.dy;

        // Wall collisions
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
            this.dx = -this.dx;
            // Ensure ball stays within bounds
            this.x = Math.max(this.radius, Math.min(this.x, canvas.width - this.radius));
        }
        if (this.y - this.radius <= 0) {
            this.dy = -this.dy;
            this.y = this.radius;
        }

        // Paddle collision
        if (this.y + this.radius >= paddle.y && 
            this.y - this.radius <= paddle.y + paddle.height &&
            this.x + this.radius >= paddle.x && 
            this.x - this.radius <= paddle.x + paddle.width) {
            
            // Calculate where on the paddle the ball hit (0 to 1)
            const hitPosition = (this.x - paddle.x) / paddle.width;
            
            // Adjust angle based on where the ball hit the paddle
            const angle = (hitPosition - 0.5) * Math.PI / 3; // 60 degrees max angle
            
            // Normalize speed to base speed
            const speed = GameConfig.ballConfig.baseSpeed;
            this.dx = Math.sin(angle) * speed;
            this.dy = -Math.cos(angle) * speed;
            
            // Ensure ball doesn't get stuck in paddle
            this.y = paddle.y - this.radius;
        }

        // Game over if ball hits bottom
        if (this.y + this.radius >= canvas.height) {
            return true;
        }

        return false;
    }

    setFireMode(enabled) {
        this.fireMode = enabled;
        this.skin.setFireMode(enabled);
    }

    isFireMode() {
        return this.fireMode;
    }

    collidesWith(brick) {
        // Find closest point on brick to ball
        const closestX = Math.max(brick.x, Math.min(this.x, brick.x + brick.width));
        const closestY = Math.max(brick.y, Math.min(this.y, brick.y + brick.height));

        // Calculate distance between closest point and ball center
        const distanceX = this.x - closestX;
        const distanceY = this.y - closestY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        return distance <= this.radius;
    }

    bounceOffBrick(brick) {
        // Find closest point on brick to ball
        const closestX = Math.max(brick.x, Math.min(this.x, brick.x + brick.width));
        const closestY = Math.max(brick.y, Math.min(this.y, brick.y + brick.height));

        // Calculate distance between closest point and ball center
        const distanceX = this.x - closestX;
        const distanceY = this.y - closestY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance <= this.radius) {
            // Determine which side was hit with a small tolerance
            const tolerance = 2;
            const hitLeft = Math.abs(closestX - brick.x) < tolerance;
            const hitRight = Math.abs(closestX - (brick.x + brick.width)) < tolerance;
            const hitTop = Math.abs(closestY - brick.y) < tolerance;
            const hitBottom = Math.abs(closestY - (brick.y + brick.height)) < tolerance;

            // Bounce based on which side was hit
            if (hitLeft || hitRight) {
                this.dx = -this.dx;
                // Adjust position to prevent sticking
                this.x = hitLeft ? brick.x - this.radius : brick.x + brick.width + this.radius;
            }
            if (hitTop || hitBottom) {
                this.dy = -this.dy;
                // Adjust position to prevent sticking
                this.y = hitTop ? brick.y - this.radius : brick.y + brick.height + this.radius;
            }
        }
    }

    draw(ctx) {
        this.skin.draw(ctx);
    }
}
