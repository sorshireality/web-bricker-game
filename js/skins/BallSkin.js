import { AbstractSkin } from '../core/AbstractSkin.js';

export class BallSkin extends AbstractSkin {
    constructor(entity, spriteManager, color = '#FFF') {
        super(entity, spriteManager);
        this.color = color;
        this.ballSpriteKey = 'ball'; // Key for the ball sprite (if defined in SPRITES)
        this.fireMode = false;
    }

    setFireMode(enabled) {
        this.fireMode = enabled;
        if (this.fireMode) {
            this.color = '#FF4500'; // Orange-red color for fire mode
        } else {
            this.color = '#FFF'; // White color for normal mode
        }
    }

    draw(ctx) {
        let drawnWithSprite = false;

        // Try to draw with sprite if available
        if (this.spriteManager && this.spriteManager.ready && this.spriteManager.spriteData[this.ballSpriteKey]) {
            try {
                // Center the sprite on the ball's position
                const sprite = this.spriteManager.spriteData[this.ballSpriteKey];
                const drawX = this.entity.x - this.entity.radius;
                const drawY = this.entity.y - this.entity.radius;
                const diameter = this.entity.radius * 2;
                
                this.spriteManager.draw(
                    ctx, 
                    this.ballSpriteKey, 
                    drawX, 
                    drawY, 
                    diameter, 
                    diameter
                );
                
                drawnWithSprite = true;
                
                // Draw fire effect if in fire mode
                if (this.fireMode) {
                    ctx.fillStyle = 'rgba(255, 69, 0, 0.3)';
                    ctx.beginPath();
                    ctx.arc(this.entity.x, this.entity.y, this.entity.radius * 1.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.closePath();
                }
            } catch (e) {
                console.error("Error drawing ball sprite:", e);
                drawnWithSprite = false;
            }
        }
        
        // Fallback to drawing a solid color ball if sprite drawing failed
        if (!drawnWithSprite) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.entity.x, this.entity.y, this.entity.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            // Draw fire effect if in fire mode
            if (this.fireMode) {
                ctx.fillStyle = 'rgba(255, 69, 0, 0.3)';
                ctx.beginPath();
                ctx.arc(this.entity.x, this.entity.y, this.entity.radius * 1.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
