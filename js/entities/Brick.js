import { GameConfig } from '../core/GameConfig.js';
import { AbstractEntity } from '../core/AbstractEntity.js';
import { GlassBrickSkin } from '../skins/GlassBrickSkin.js';
import { WoodBrickSkin } from '../skins/WoodBrickSkin.js';

export class Brick extends AbstractEntity {
    constructor(x, y, type, spriteManager) {
        super(x, y);
        this.type = type;
        this.width = GameConfig.brickConfig.width;
        this.height = GameConfig.brickConfig.height;
        this.hp = this.getInitialHP();
        this.active = true;
        this.spriteManager = spriteManager;
        
        // Initialize the appropriate skin based on brick type
        this.skin = type === 'wooden' ? 
            new WoodBrickSkin(this, spriteManager) : 
            new GlassBrickSkin(this, spriteManager);
    }

    getInitialHP() {
        return this.type === 'wooden' ? 2 : 1;
    }

    getHealthPercentage() {
        return this.hp / this.getInitialHP();
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
        this.skin.draw(ctx);
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