import { AbstractSkin } from '../core/AbstractSkin.js';

export class WoodBrickSkin extends AbstractSkin {
    constructor(brick, spriteManager) {
        super(brick, spriteManager);
    }

    draw(ctx) {
        ctx.save();
        
        // Base wood color
        const healthPercentage = this.entity.getHealthPercentage();
        const baseColor = healthPercentage === 1 ? '#8B4513' : '#A0522D'; // Darker when damaged
        
        // Draw wood brick
        ctx.fillStyle = baseColor;
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        
        ctx.fillRect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);
        ctx.strokeRect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);
        
        // Add wood grain effect
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        
        // Draw vertical grain lines
        for (let i = 0; i < 3; i++) {
            const x = this.entity.x + (this.entity.width / 3) * (i + 1);
            ctx.beginPath();
            ctx.moveTo(x, this.entity.y);
            ctx.lineTo(x, this.entity.y + this.entity.height);
            ctx.stroke();
        }
        
        // Add damage cracks if health is less than 100%
        if (healthPercentage < 1) {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            
            // Draw diagonal crack
            ctx.beginPath();
            ctx.moveTo(
                this.entity.x + this.entity.width * 0.3,
                this.entity.y + this.entity.height * 0.3
            );
            ctx.lineTo(
                this.entity.x + this.entity.width * 0.7,
                this.entity.y + this.entity.height * 0.7
            );
            ctx.stroke();
        }
        
        ctx.restore();
    }
} 