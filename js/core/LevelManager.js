import { GameConfig } from './GameConfig.js';
import { GlassBrick } from '../entities/GlassBrick.js';
import { WoodBrick } from '../entities/WoodBrick.js';

export class LevelManager {
    constructor(gameStateManager) {
        this.gameStateManager = gameStateManager;
        this.currentLevel = 1;
    }

    getCurrentLevelConfig() {
        return GameConfig.levels[this.currentLevel - 1];
    }

    createBricks(canvas, spriteManager) {
        const config = this.getCurrentLevelConfig();
        const bricks = [];
        
        const gridWidth = config.brickColumns * (GameConfig.brickConfig.width + GameConfig.brickConfig.padding) - GameConfig.brickConfig.padding;
        const brickOffsetLeft = (canvas.width - gridWidth) / 2;

        for (let c = 0; c < config.brickColumns; c++) {
            for (let r = 0; r < config.brickRows; r++) {
                const brickX = c * (GameConfig.brickConfig.width + GameConfig.brickConfig.padding) + brickOffsetLeft;
                const brickY = r * (GameConfig.brickConfig.height + GameConfig.brickConfig.padding) + GameConfig.brickConfig.offsetTop;
                
                const isGlass = Math.random() < config.brickDistribution.glass;
                if (isGlass) {
                    bricks.push(new GlassBrick(brickX, brickY, GameConfig.brickConfig.width, GameConfig.brickConfig.height, spriteManager));
                } else {
                    bricks.push(new WoodBrick(brickX, brickY, GameConfig.brickConfig.width, GameConfig.brickConfig.height, spriteManager));
                }
            }
        }

        return bricks;
    }

    nextLevel() {
        if (this.currentLevel < GameConfig.levels.length) {
            this.currentLevel++;
            this.gameStateManager.setLevel(this.currentLevel);
            return true;
        }
        return false;
    }

    reset() {
        this.currentLevel = 1;
        this.gameStateManager.setLevel(1);
    }
} 