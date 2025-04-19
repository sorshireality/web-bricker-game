import { GameState } from '../core/GameState.js';

export class GameOverState extends GameState {
    constructor(game) {
        super(game);
    }
    
    draw() {
        // Draw semi-transparent overlay
        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        // Draw message
        this.game.ctx.fillStyle = '#ffffff';
        this.game.ctx.font = '48px Arial';
        this.game.ctx.textAlign = 'center';
        this.game.ctx.fillText(
            this.game.gameCompleted ? 'GAME COMPLETED!' : 'GAME OVER',
            this.game.canvas.width / 2,
            this.game.canvas.height / 2
        );
        
        // Draw score
        this.game.ctx.font = '24px Arial';
        this.game.ctx.fillText(
            `Final Score: ${this.game.score}`,
            this.game.canvas.width / 2,
            this.game.canvas.height / 2 + 40
        );

        // Draw restart instruction
        this.game.ctx.font = '24px Arial';
        this.game.ctx.fillText(
            'Press SPACE to restart',
            this.game.canvas.width / 2,
            this.game.canvas.height / 2 + 80
        );
    }
    
    handleInput(key) {
        if (key === ' ') {
            this.game.reset();
            this.game.stateManager.changeState('playing');
            this.game.stateManager.currentState.waitingForLaunch = true;
        }
    }
} 