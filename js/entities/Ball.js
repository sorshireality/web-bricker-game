import { AbstractEntity } from '../core/AbstractEntity.js';
import { BallSkin } from '../skins/BallSkin.js';

export class Ball extends AbstractEntity {
    constructor(x, y, radius, spriteManager = null) {
        super(x, y);
        this.radius = radius;
        this.dx = 5; // Increased from 3 to 5
        this.dy = -5; // Increased from -3 to -5
        this.spriteManager = spriteManager;
        this.skin = new BallSkin(this, this.spriteManager); // Pass instance and manager
    }

    update(canvas) {
        this.x += this.dx;
        this.y += this.dy;


        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
            this.x = (this.x + this.radius > canvas.width) ? canvas.width - this.radius : this.radius;
        }
        if (this.y - this.radius < 0) {
            this.dy = -this.dy;
            this.y = this.radius;
        }
        // Bounce off bottom for now
        if (this.y + this.radius > canvas.height) {
            this.dy = -this.dy;
            return true;
        }
    }
    // draw() is inherited
}
