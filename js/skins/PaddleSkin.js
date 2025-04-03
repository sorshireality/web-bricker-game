import { AbstractSkin } from '../core/AbstractSkin.js';

export class PaddleSkin extends AbstractSkin {
    constructor(entity, spriteManager, color = '#FFF') {
        super(entity, spriteManager);
        this.color = color;
        this.paddleSpriteKey = 'paddle'; // Key for the paddle sprite (if defined in SPRITES)
    }

    draw(ctx) {
        let drawnWithSprite = false;
        // Check if spriteManager exists, is ready, and the sprite key is defined
        if (this.spriteManager && this.spriteManager.ready && this.spriteManager.spriteData[this.paddleSpriteKey]) {
            try {
                // Use entity's x, y, width, height directly for paddle
                this.spriteManager.draw(ctx, this.paddleSpriteKey, this.entity.x, this.entity.y, this.entity.width, this.entity.height);
                drawnWithSprite = true;
            } catch (e) {
                console.error("Error drawing paddle sprite:", e);
            }
        }

        // Fallback to drawing a shape
        if (!drawnWithSprite) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.entity.x, this.entity.y, this.entity.width, this.entity.height);
        }
    }
}
