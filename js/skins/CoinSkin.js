import { AbstractSkin } from '../core/AbstractSkin.js';

export class CoinSkin extends AbstractSkin {
    constructor(coin, spriteManager) {
        super(coin, spriteManager);
    }

    draw(ctx) {
        if (this.entity.isCollected()) return;

        ctx.save();
        
        // Draw coin with emoji style
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('💰', this.entity.x, this.entity.y);
        
        // Add shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.entity.x - 5, this.entity.y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
} 