// ==== SPRITE REGISTRY ====
// Define sprites here or load from a config file later
const SPRITES = {
    // paddle: { x: 0, y: 0, w: 80, h: 15 }, // Example
    // ball: { x: 0, y: 20, w: 10, h: 10 }    // Example
};

// ==== SPRITE MANAGER ====
export class SpriteManager {
    constructor() {
        this.image = new Image();
        this.ready = false;
        this.spriteData = SPRITES;
    }

    load(src, callback) {
        this.image.onerror = () => {
            console.error(`Failed to load sprite sheet from: ${src}`);
            if (callback) callback(new Error('Image load failed')); // Pass error to callback
        };
        this.image.onload = () => {
            console.log(`Sprite sheet loaded successfully from: ${src}`);
            this.ready = true;
            if (callback) callback(null); // Pass null error on success
        };
        this.image.src = src;
    }

    draw(ctx, spriteKey, dx, dy, dw, dh) {
        const s = this.spriteData[spriteKey];
        if (!this.ready || !s) return;
        if (s.w <= 0 || s.h <= 0) {
            console.warn(`Invalid dimensions for sprite: ${spriteKey}`);
            return;
        }
        try {
            ctx.drawImage(this.image, s.x, s.y, s.w, s.h, dx, dy, dw, dh);
        } catch (e) {
            console.error(`Error drawing sprite ${spriteKey}:`, e);
        }
    }

    registerSprite(key, data) {
        this.spriteData[key] = data;
    }
}
