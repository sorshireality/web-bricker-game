import { GameConfig } from '../core/GameConfig.js';

export class Booster {
    constructor(x, y, type, spriteManager) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = GameConfig.boosterConfig.width;
        this.height = GameConfig.boosterConfig.height;
        this.speed = GameConfig.boosterConfig.speed;
        this.active = true;
        this.spriteManager = spriteManager;
        this.icon = GameConfig.boosterConfig.effects[type].icon;
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx) {
        ctx.font = '20px Arial';
        ctx.fillStyle = this.type === 'fire' ? '#ff4444' : '#44ff44';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, this.x, this.y);
    }

    isOffScreen(canvas) {
        return this.y > canvas.height;
    }

    collidesWith(paddle) {
        return (
            this.x + this.width/2 > paddle.x &&
            this.x - this.width/2 < paddle.x + paddle.width &&
            this.y + this.height > paddle.y &&
            this.y < paddle.y + paddle.height
        );
    }
} 