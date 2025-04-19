import { GameConfig } from '../core/GameConfig.js';
import { AbstractEntity } from '../core/AbstractEntity.js';
import { GlassBrickSkin } from '../skins/GlassBrickSkin.js';
import { WoodBrickSkin } from '../skins/WoodBrickSkin.js';

export class Brick extends AbstractEntity {
    constructor(x, y, type, spriteManager) {
        super(x, y);
        this.type = type; // type can be 'glass' or 'wooden'
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
        
        console.log('Brick hit:', { type: this.type, hp: this.hp });
        
        if (this.type === 'wooden') {
            this.hp--;
            if (this.hp <= 0) {
                console.log('Wooden brick destroyed');
                this.active = false;
                return true;
            }
            console.log('Wooden brick damaged, remaining hp:', this.hp);
            return false;
        } else {
            // Glass bricks are destroyed in one hit
            console.log('Glass brick destroyed');
            const shouldDropBooster = this.shouldDropBooster();
            this.active = false;
            return true;
        }
    }

    draw(ctx) {
        if (!this.active) return;
        this.skin.draw(ctx);
    }

    shouldDropBooster() {
        console.log('Checking shouldDropBooster for brick:', { type: this.type, active: this.active });
        
        if (!this.active) {
            console.log('Brick not active, no booster');
            return false;
        }
        
        // Only glass bricks can drop boosters
        if (this.type === 'wooden') {
            console.log('Wooden brick, no booster');
            return false;
        }
        
        const config = GameConfig.boosterConfig;
        console.log('Booster config:', config);
        const shouldDrop = Math.random() < config.dropChance.glass;
        console.log('Checking booster drop for glass brick:', shouldDrop);
        return shouldDrop;
    }

    getBoosterType() {
        return 'splitter'; // Always return splitter type
    }
} 