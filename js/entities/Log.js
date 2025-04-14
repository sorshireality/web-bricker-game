export class Log {
    constructor() {
        this.messages = [];
        this.maxMessages = 50; // We can show more messages since they're in a scrollable area

        // Get DOM element
        this.logMessagesElement = document.getElementById('logMessages');
    }

    /**
     * Adds a new message to the log
     * @param {string} text - The message text
     * @param {string} color - The color of the message (CSS color)
     */
    addMessage(text, color = "#FFF") {
        // Create message object
        const message = {
            text,
            color,
            timestamp: new Date().toLocaleTimeString()
        };

        // Add to message array
        this.messages.unshift(message);

        // Trim log if too many messages
        if (this.messages.length > this.maxMessages) {
            this.messages = this.messages.slice(0, this.maxMessages);
        }

        // Create and add DOM element
        this.addMessageElement(message);
    }

    /**
     * Creates and adds a message element to the DOM
     */
    addMessageElement(message) {
        if (!this.logMessagesElement) return;

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = 'log-message';
        messageEl.style.color = message.color;
        messageEl.innerHTML = `<span style="color:#777">[${message.timestamp}]</span> ${message.text}`;

        // Add to container (at the beginning)
        this.logMessagesElement.prepend(messageEl);

        // Apply fade-in effect
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.style.opacity = '1';
        }, 10);
    }

    /**
     * Log a score update
     * @param {Object} scoreInfo - Score update information
     */
    logScore(scoreInfo) {
        const { count, multiplier, points } = scoreInfo;

        let message;
        let color;

        if (multiplier > 1) {
            message = `${count} brick${count > 1 ? 's' : ''} x${multiplier} COMBO! +${points} points!!!`;
            color = "#ffcc00";  // Gold for combos
        } else if (count > 1) {
            message = `${count} bricks! +${points} points!!`;
            color = "#00ffff";  // Cyan for multiple bricks
        } else {
            message = `+${points} points`;
            color = "#ffffff";  // White for single brick
        }

        this.addMessage(message, color);
    }

    /**
     * Clears all messages
     */
    clear() {
        this.messages = [];
        if (this.logMessagesElement) {
            this.logMessagesElement.innerHTML = '';
        }
    }
}
