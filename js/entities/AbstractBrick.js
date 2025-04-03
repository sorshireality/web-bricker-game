import { AbstractEntity } from '../core/AbstractEntity.js';

export class AbstractBrick extends AbstractEntity {
    constructor(x, y, width, height, maxHealth = 1) {
        // Prevent direct instantiation of AbstractBrick
        if (new.target === AbstractBrick) {
            throw new TypeError("Cannot construct AbstractBrick instances directly");
        }
        super(x, y);
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        // Skin must be assigned by the concrete subclass (e.g., StarBrick)
    }

    hit() {
        if (this.health > 0) {
            this.health--;
            console.log(`Brick hit! Health: ${this.health}/${this.maxHealth}`); // Debug log
        }
    }

    isDestroyed() {
        return this.health <= 0;
    }

    reset() {
        this.health = this.maxHealth;
    }

    // update() method is inherited from AbstractEntity - override if needed
    // draw() method is inherited from AbstractEntity - delegates to skin
}
