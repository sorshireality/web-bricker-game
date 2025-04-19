export class UIManager {
    constructor(gameStateManager) {
        this.gameStateManager = gameStateManager;
        this.scoreElement = document.getElementById('scoreValue');
        this.levelElement = document.getElementById('levelValue');
        this.logContainer = document.getElementById('logMessages');
        this.startButton = this.createStartButton();
        
        this.setupEventListeners();
    }

    createStartButton() {
        const button = document.createElement('button');
        button.textContent = 'Start Game';
        button.className = 'start-button';
        button.style.display = 'block';
        document.querySelector('.sidebar').appendChild(button);
        return button;
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => {
            this.gameStateManager.setState('RUNNING');
            this.startButton.style.display = 'none';
        });

        this.gameStateManager.addListener('stateChange', (state) => {
            if (state === 'GAME_OVER') {
                this.startButton.style.display = 'block';
                this.startButton.textContent = 'Restart Game';
            }
        });

        this.gameStateManager.addListener('scoreChange', (score) => {
            this.updateScore(score);
        });

        this.gameStateManager.addListener('levelChange', (level) => {
            this.updateLevel(level);
        });
    }

    updateScore(score) {
        this.scoreElement.textContent = score;
    }

    updateLevel(level) {
        this.levelElement.textContent = level;
    }

    addLogMessage(message, color = '#fff') {
        const messageElement = document.createElement('div');
        messageElement.className = 'log-message';
        messageElement.style.color = color;
        messageElement.textContent = message;
        
        this.logContainer.insertBefore(messageElement, this.logContainer.firstChild);
        
        // Limit log messages to 10
        while (this.logContainer.children.length > 10) {
            this.logContainer.removeChild(this.logContainer.lastChild);
        }
    }
} 