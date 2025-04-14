export class Score {
    constructor() {
        this.value = 0;
        this.combo = 0;
        this.comboTimeout = null;
        this.basePoints = 100; // Base points for breaking a brick
        this.comboDuration = 500; // Time window in ms for combo to count

        // Get DOM elements
        this.scoreValueElement = document.getElementById('scoreValue');
        this.comboDisplayElement = document.getElementById('comboDisplay');

        // Initialize display
        this.updateDisplay();
    }

    /**
     * Adds points to the score
     * @param {number} count - Number of bricks broken at once
     * @param {boolean} isCombo - Whether this is part of a combo
     * @returns {Object} Score update info for logging
     */
    addPoints(count = 1, isCombo = false) {
        // Clear existing combo timeout
        if (this.comboTimeout) {
            clearTimeout(this.comboTimeout);
        }

        // Update combo count
        if (isCombo) {
            this.combo++;
        } else {
            this.combo = 1;
        }

        // Calculate points with multiplier
        const multiplier = Math.min(this.combo, 5); // Cap multiplier at 5x
        const points = count * this.basePoints * multiplier;

        // Add to total score
        this.value += points;

        // Update display
        this.updateDisplay();

        // Set combo timeout
        this.comboTimeout = setTimeout(() => {
            this.combo = 0;
            this.updateDisplay();
        }, this.comboDuration);

        // Return info for logging
        return {
            count,
            multiplier,
            points,
            total: this.value
        };
    }

    /**
     * Updates the score display in the DOM
     */
    updateDisplay() {
        if (this.scoreValueElement) {
            this.scoreValueElement.textContent = this.value;
        }

        if (this.comboDisplayElement) {
            if (this.combo > 1) {
                this.comboDisplayElement.textContent = `COMBO: ${this.combo}x`;
                this.comboDisplayElement.style.color = '#ff0';
            } else {
                this.comboDisplayElement.textContent = '';
            }
        }
    }

    /**
     * Resets the score to zero
     */
    reset() {
        this.value = 0;
        this.combo = 0;
        if (this.comboTimeout) {
            clearTimeout(this.comboTimeout);
            this.comboTimeout = null;
        }
        this.updateDisplay();
    }
}
