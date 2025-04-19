// ==== SPRITE REGISTRY ====
// Define sprites here or load from a config file later
const SPRITES = {
    paddle: { x: 17, y: 29, w: 70, h: 9 },
    ball: { x: 17, y: 63, w: 23, h: 23 },
    
    // Brick sprites - assuming different colored bricks are in the spritesheet
    
    brick_blue: { x: 18, y: 161, w: 43, h: 22 },
    brick_green: { x: 50, y: 8, w: 32, h: 16 },
    brick_red: { x: 83, y: 8, w: 32, h: 16 },
    
    // Powerup sprites
    power_fire: { x: 17, y: 45, w: 16, h: 16 },
    power_splitter: { x: 34, y: 45, w: 16, h: 16 }
};

// ==== SPRITE MANAGER ====
export class SpriteManager {
    constructor() {
        this.image = new Image();
        this.ready = false;
        this.spriteData = SPRITES;
        
        // Load the spritesheet automatically
        this.load('assets/spritesheet.png', (err) => {
            if (err) {
                console.error('Failed to load spritesheet');
            } else {
                console.log('Spritesheet loaded successfully');
            }
        });
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
