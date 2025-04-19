import { GameConfig } from '../core/GameConfig.js';
import { AbstractEntity } from '../core/AbstractEntity.js';

export class Booster extends AbstractEntity {
    constructor(x, y, type, spriteManager) {
        super(x, y);
        this.type = type;
        this.width = GameConfig.boosterConfig.width;
        this.height = GameConfig.boosterConfig.height;
        this.speed = GameConfig.boosterConfig.speed;
        this.active = true;
        this.spriteManager = spriteManager;
        this.spriteKey = type === 'fire' ? 'power_fire' : 'power_splitter';
    }

    update() {
        this.y += this.speed;
        console.log('Booster position:', { x: this.x, y: this.y, speed: this.speed });
    }

    draw(ctx) {
        if (!this.active) return;

        // Try to draw using sprite first
        if (this.spriteManager && this.spriteManager.draw(ctx, 'booster_splitter', this.x, this.y, this.width, this.height)) {
            return;
        }

        // Fallback to shape drawing
        ctx.save();
        
        // Draw rounded rectangle background
        ctx.fillStyle = 'rgba(0, 150, 255, 0.8)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 2;
        
        const radius = 5;
        ctx.beginPath();
        ctx.moveTo(this.x + radius, this.y);
        ctx.lineTo(this.x + this.width - radius, this.y);
        ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + radius);
        ctx.lineTo(this.x + this.width, this.y + this.height - radius);
        ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - radius, this.y + this.height);
        ctx.lineTo(this.x + radius, this.y + this.height);
        ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - radius);
        ctx.lineTo(this.x, this.y + radius);
        ctx.quadraticCurveTo(this.x, this.y, this.x + radius, this.y);
        ctx.closePath();
        ctx.fill();

        // Draw splitter icon
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', this.x + this.width/2, this.y + this.height/2);
        
        ctx.restore();
    }

    isOffScreen(canvas) {
        return this.y > canvas.height;
    }

    collidesWith(paddle) {
        return (
            this.x < paddle.x + paddle.width &&
            this.x + this.width > paddle.x &&
            this.y < paddle.y + paddle.height &&
            this.y + this.height > paddle.y
        );
    }
} 