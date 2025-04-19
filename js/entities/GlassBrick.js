import { AbstractBrick } from './AbstractBrick.js';
import { GlassBrickSkin } from '../skins/GlassBrickSkin.js';

export class GlassBrick extends AbstractBrick {
    constructor(x, y, width, height, spriteManager = null) {
        super(x, y, width, height, 1, spriteManager); // Glass bricks have 1 health
        this.skin = new GlassBrickSkin(this, this.spriteManager);
    }
} 