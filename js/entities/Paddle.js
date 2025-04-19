import { AbstractEntity } from '../core/AbstractEntity.js';
import { PaddleSkin } from '../skins/PaddleSkin.js';

export class Paddle extends AbstractEntity {
    constructor(x, y, width, height, spriteManager = null) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.spriteManager = spriteManager;
        this.skin = new PaddleSkin(this, this.spriteManager); // Pass instance and manager
        this.speed = 7; // Movement speed for keyboard controls
        this.movingLeft = false;
        this.movingRight = false;
    }

    update(canvas) {
        if (this.movingLeft) {
            this.x = Math.max(0, this.x - this.speed);
        }
        if (this.movingRight) {
            this.x = Math.min(canvas.width - this.width, this.x + this.speed);
        }
    }

    setMovingLeft(moving) {
        this.movingLeft = moving;
    }

    setMovingRight(moving) {
        this.movingRight = moving;
    }

    // draw() is inherited
}

