import { AbstractSkin } from '../core/AbstractSkin.js';

export class WoodBrickSkin extends AbstractSkin {
    constructor(brick, spriteManager) {
        super(brick, spriteManager);
        this.spriteKey = 'brick_blue'; // Temporary use blue brick sprite with tint
    }

    draw(ctx) {
        const healthPercentage = this.entity.getHealthPercentage();
        let drawnWithSprite = false;
        
        // Try to draw with sprite first
        if (this.spriteManager && this.spriteManager.ready && this.spriteManager.spriteData[this.spriteKey]) {
            try {
                ctx.save();
                
                // Apply brown tint to make it look like wood
                ctx.fillStyle = 'rgba(139, 69, 19, 0.5)'; // Brown tint
                ctx.globalCompositeOperation = 'overlay';
                
                // Apply slight tinting based on health
                if (healthPercentage < 1) {
                    ctx.globalAlpha = 0.7; // Slightly transparent when damaged
                }
                
                this.spriteManager.draw(
                    ctx, 
                    this.spriteKey, 
                    this.entity.x, 
                    this.entity.y, 
                    this.entity.width, 
                    this.entity.height
                );
                
                // Add wood grain effect
                ctx.strokeStyle = 'rgba(101, 67, 33, 0.8)'; // Dark brown
                ctx.lineWidth = 1;
                
                // Draw vertical grain lines
                for (let i = 0; i < 3; i++) {
                    const x = this.entity.x + (this.entity.width / 3) * (i + 1);
                    ctx.beginPath();
                    ctx.moveTo(x, this.entity.y);
                    ctx.lineTo(x, this.entity.y + this.entity.height);
                    ctx.stroke();
                }
                
                // Add damage overlay if health is less than 100%
                if (healthPercentage < 1) {
                    // Draw a crack pattern over the brick
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 1;
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
                drawnWithSprite = true;
            } catch (e) {
                console.error("Error drawing wood brick sprite:", e);
            }
        }
        
        // Fallback to drawing shapes if sprite drawing failed
        if (!drawnWithSprite) {
            ctx.save();
            
            // Base wood color
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
} 