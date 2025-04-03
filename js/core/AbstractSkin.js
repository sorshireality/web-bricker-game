// Base class for visual representations
export class AbstractSkin {
    constructor(entity, spriteManager = null) {
        if (new.target === AbstractSkin) {
            throw new TypeError("Cannot construct AbstractSkin instances directly");
        }
        this.entity = entity; // Reference to the game object (Ball, Paddle, etc.)
        this.spriteManager = spriteManager; // Reference to the sprite manager
    }

    // Skins usually don't need update, but keep for consistency
    update() {}

    // Draw method must be implemented by subclasses
    draw(ctx) {
        throw new Error("Method 'draw(ctx)' must be implemented.");
    }
}
