import { AbstractBrick } from './AbstractBrick.js';
import { StarBrickSkin } from '../skins/StarBrickSkin.js';

// Default dimensions and health for StarBricks if not provided
const DEFAULT_BRICK_WIDTH = 75;
const DEFAULT_BRICK_HEIGHT = 20;
const DEFAULT_BRICK_HEALTH = 1; // Start with 1 hit bricks

export class StarBrick extends AbstractBrick {
    constructor(x, y, width = DEFAULT_BRICK_WIDTH, height = DEFAULT_BRICK_HEIGHT, health = DEFAULT_BRICK_HEALTH, spriteManager = null) {
        super(x, y, width, height, health);
        this.spriteManager = spriteManager; // Pass spriteManager if needed by skin later
        // Create and assign the specific skin for this brick type
        this.skin = new StarBrickSkin(this, this.spriteManager);
    }

    // Inherits hit(), isDestroyed(), reset(), update(), draw()
    // Add StarBrick-specific methods here later if needed (e.g., special behavior on destroy)
}
