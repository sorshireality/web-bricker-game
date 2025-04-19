import { GameConfig } from '../core/GameConfig.js';

export class Brick {
    constructor(x, y, type, spriteManager) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = GameConfig.brickConfig.width;
        this.height = GameConfig.brickConfig.height;
        this.hp = this.getInitialHP();
        this.active = true;
        this.spriteManager = spriteManager;
    }

    getInitialHP() {
        return this.type === 'wooden' ? 2 : 1;
    }

    hit() {
        if (!this.active) return false;
        
        if (this.type === 'wooden') {
            this.hp--;
            if (this.hp <= 0) {
                this.active = false;
                return true;
            }
            return false;
        } else {
            // Glass bricks are destroyed in one hit
            this.active = false;
            return true;
        }
    }

    draw(ctx) {
        if (!this.active) return;
        
        ctx.fillStyle = this.type === 'wooden' ? '#8B4513' : '#87CEEB';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw border
        ctx.strokeStyle = '#000';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Draw HP for wooden bricks
        if (this.type === 'wooden') {
            ctx.fillStyle = '#FFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.hp.toString(), this.x + this.width/2, this.y + this.height/2);
        }
    }

    shouldDropBooster() {
        if (!this.active) return false;
        
        const config = GameConfig.boosterConfig;
        const dropChance = config.dropChance[this.type];
        
        if (dropChance && Math.random() < dropChance) {
            return true;
        }
        return false;
    }

    getBoosterType() {
        return this.type === 'wooden' ? 'splitter' : 'fire';
    }
} 