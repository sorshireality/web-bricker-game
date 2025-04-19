export class EventSystem {
    constructor() {
        this.listeners = new Map();
    }
    
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    emit(event, data = {}) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
}

// Game event types
export const GameEvents = {
    // Game state events
    GAME_START: 'game:start',
    GAME_OVER: 'game:over',
    GAME_COMPLETED: 'game:completed',
    LEVEL_START: 'level:start',
    LEVEL_COMPLETE: 'level:complete',
    
    // Gameplay events
    BRICK_DESTROYED: 'brick:destroyed',
    BALL_LOST: 'ball:lost',
    BALL_PADDLE_COLLISION: 'ball:paddle:collision',
    BOOSTER_COLLECTED: 'booster:collected',
    BOOSTER_ACTIVATED: 'booster:activated',
    BOOSTER_DEACTIVATED: 'booster:deactivated',
    
    // Score events
    SCORE_CHANGED: 'score:changed',
    COMBO_CHANGED: 'combo:changed',
    
    // Input events
    BALL_LAUNCHED: 'ball:launched',
    PADDLE_MOVE: 'paddle:move'
}; 