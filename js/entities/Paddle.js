import { AbstractEntity } from '../core/AbstractEntity.js';
import { PaddleSkin } from '../skins/PaddleSkin.js';

export class Paddle extends AbstractEntity {
    constructor(x, y, width, height, spriteManager = null) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.spriteManager = spriteManager;
        this.skin = new PaddleSkin(this, this.spriteManager); // Pass instance and manager
    }

    update(canvas) {
        // TODO: Implement paddle movement (e.g., follow mouse)
        // Example: Keep paddle within bounds
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }
    // draw() is inherited
}
