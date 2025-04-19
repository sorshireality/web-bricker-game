export class StateManager {
    constructor(game) {
        this.game = game;
        this.states = new Map();
        this.currentState = null;
    }
    
    addState(name, state) {
        this.states.set(name, state);
    }
    
    changeState(name) {
        if (this.currentState) {
            this.currentState.exit();
        }
        
        this.currentState = this.states.get(name);
        if (this.currentState) {
            this.currentState.enter();
        }
    }
    
    update(deltaTime) {
        if (this.currentState) {
            this.currentState.update(deltaTime);
        }
    }
    
    draw() {
        if (this.currentState) {
            this.currentState.draw();
        }
    }
    
    handleInput(key) {
        if (this.currentState) {
            this.currentState.handleInput(key);
        }
    }
} 