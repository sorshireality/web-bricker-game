import { AbstractEntity } from '../core/AbstractEntity.js';

export class AbstractBrick extends AbstractEntity {
    constructor(x, y, width, height, health, spriteManager = null) {
        // Prevent direct instantiation of AbstractBrick
        if (new.target === AbstractBrick) {
            throw new TypeError("Cannot construct AbstractBrick instances directly");
        }
        super(x, y);
        this.width = width;
        this.height = height;
        this.maxHealth = health;
        this.health = health;
        this.spriteManager = spriteManager;
    }

    hit() {
        this.health--;
        return this.health <= 0;
    }

    getHealthPercentage() {
        return this.health / this.maxHealth;
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
