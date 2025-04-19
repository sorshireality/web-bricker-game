import { AbstractBrick } from './AbstractBrick.js';
import { WoodBrickSkin } from '../skins/WoodBrickSkin.js';

export class WoodBrick extends AbstractBrick {
    constructor(x, y, width, height, spriteManager = null) {
        super(x, y, width, height, 2, spriteManager); // Wood bricks have 2 health
        this.skin = new WoodBrickSkin(this, this.spriteManager);
    }
} 