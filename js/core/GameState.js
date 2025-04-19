export class GameState {
    constructor(game) {
        this.game = game;
    }
    
    enter() {
        // Override in child classes
    }
    
    exit() {
        // Override in child classes
    }
    
    update(deltaTime) {
        // Override in child classes
    }
    
    draw() {
        // Override in child classes
    }
    
    handleInput(key) {
        // Override in child classes
    }
} 