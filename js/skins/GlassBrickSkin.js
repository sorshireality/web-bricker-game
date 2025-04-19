import { AbstractSkin } from '../core/AbstractSkin.js';

export class GlassBrickSkin extends AbstractSkin {
    constructor(brick, spriteManager) {
        super(brick, spriteManager);
    }

    draw(ctx) {
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