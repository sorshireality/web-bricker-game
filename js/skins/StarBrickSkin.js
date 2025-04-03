import { AbstractSkin } from '../core/AbstractSkin.js';

export class StarBrickSkin extends AbstractSkin {
    // Define colors based on health, or use a default
    // Example: More damaged bricks could change color (implement later if desired)
    constructor(entity, spriteManager, color = '#0095DD') { // Default blue color
        super(entity, spriteManager); // Pass entity and spriteManager to base class
        this.baseColor = color;
    }

    draw(ctx) {
        // For now, just draw a solid rectangle
        // Later, this could check health this.entity.health and change color/use sprites

        if (this.entity.isDestroyed()) {
            return; // Don't draw destroyed bricks (they should be filtered out anyway)
        }

        // TODO: Add sprite drawing logic here later if needed
        // if (this.spriteManager && this.spriteManager.ready) { ... }

        // Fallback basic shape drawing
        ctx.fillStyle = this.baseColor;
        ctx.fillRect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);

        // Optional: Add a simple border
        ctx.strokeStyle = '#333'; // Dark border
        ctx.lineWidth = 1;
        ctx.strokeRect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);
    }
}
