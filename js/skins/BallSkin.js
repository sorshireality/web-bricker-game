import { AbstractSkin } from '../core/AbstractSkin.js';

export class BallSkin extends AbstractSkin {
    constructor(entity, spriteManager, color = '#FFF') {
        super(entity, spriteManager);
        this.color = color;
        this.ballSpriteKey = 'ball'; // Key for the ball sprite (if defined in SPRITES)
    }

    draw(ctx) {
        let drawnWithSprite = false;
        // Check if spriteManager exists, is ready, and the sprite key is defined
        if (this.spriteManager && this.spriteManager.ready && this.spriteManager.spriteData[this.ballSpriteKey]) {
            try {
                const drawX = this.entity.x - this.entity.radius;
                const drawY = this.entity.y - this.entity.radius;
                const diameter = this.entity.radius * 2;
                this.spriteManager.draw(ctx, this.ballSpriteKey, drawX, drawY, diameter, diameter);
                drawnWithSprite = true;
            } catch (e) {
                console.error("Error drawing ball sprite:", e);
            }
        }

        // Fallback to drawing a shape
        if (!drawnWithSprite) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.entity.x, this.entity.y, this.entity.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }
}
