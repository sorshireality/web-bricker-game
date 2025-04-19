import { AbstractSkin } from '../core/AbstractSkin.js';

export class GlassBrickSkin extends AbstractSkin {
    constructor(brick, spriteManager) {
        super(brick, spriteManager);
        this.spriteKey = 'brick_blue'; // Use the blue brick sprite for glass bricks
    }

    draw(ctx) {
        let drawnWithSprite = false;
        
        // Try to draw with sprite first
        if (this.spriteManager && this.spriteManager.ready && this.spriteManager.spriteData[this.spriteKey]) {
            try {
                this.spriteManager.draw(
                    ctx, 
                    this.spriteKey, 
                    this.entity.x, 
                    this.entity.y, 
                    this.entity.width, 
                    this.entity.height
                );
                drawnWithSprite = true;
            } catch (e) {
                console.error("Error drawing glass brick sprite:", e);
            }
        }
        
        // Fallback to drawing shapes if sprite drawing failed
        if (!drawnWithSprite) {
            ctx.save();
            
            // Draw glass brick
            ctx.fillStyle = 'rgba(100, 200, 255, 0.7)';
            ctx.strokeStyle = 'rgba(150, 220, 255, 0.9)';
            ctx.lineWidth = 2;
            
            ctx.fillRect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);
            ctx.strokeRect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);
            
            // Add glass effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(
                this.entity.x + 5,
                this.entity.y + 5,
                this.entity.width - 10,
                this.entity.height - 10
            );
            
            ctx.restore();
        }
    }
} 