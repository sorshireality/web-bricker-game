export class GameStateManager {
    constructor() {
        this.state = 'MENU';
        this.currentLevel = 1;
        this.score = 0;
        this.listeners = new Map();
    }

    setState(newState) {
        this.state = newState;
        this.notifyListeners('stateChange', newState);
    }

    setLevel(level) {
        this.currentLevel = level;
        this.notifyListeners('levelChange', level);
    }

    addScore(points) {
        this.score += points;
        this.notifyListeners('scoreChange', this.score);
    }

    addListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    removeListener(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    reset() {
        this.score = 0;
        this.currentLevel = 1;
        this.setState('MENU');
    }
} 