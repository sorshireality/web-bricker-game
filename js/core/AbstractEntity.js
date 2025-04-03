// Base class for game objects like Ball, Paddle, Brick
export class AbstractEntity {
    constructor(x, y) {
        if (new.target === AbstractEntity) {
            throw new TypeError("Cannot construct AbstractEntity instances directly");
        }
        this.x = x;
        this.y = y;
        this.skin = null; // Skin will be assigned by subclasses
    }

    update(context) {
        // Base update logic (can be overridden by subclasses)
        // The 'context' parameter could be canvas, deltaTime, etc.
    }

    draw(ctx) {
        // Delegate drawing to the skin if it exists
        if (this.skin) {
            this.skin.draw(ctx);
        } else {
            console.warn("Entity has no skin to draw with.", this);
        }
    }
}
