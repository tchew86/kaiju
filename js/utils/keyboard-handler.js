// KAIJU - Keyboard Handler Utilities
// Shared keyboard event handling to avoid duplication

const KeyboardHandler = {
    /**
     * Create a keyboard event handler for number input, backspace, and enter
     * @param {Object} context - Context object containing currentAnswer and methods
     * @param {string} answerDisplayElementId - ID of element to update with current answer
     * @param {Function} checkAnswerCallback - Function to call when Enter is pressed
     * @returns {Function} Event handler function
     */
    createHandler(context, answerDisplayElementId, checkAnswerCallback, isActive = () => true) {
        return (e) => {
            const answerEl = document.getElementById(answerDisplayElementId);
            if (!answerEl || !isActive() || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
            if (e.target?.matches('input, textarea, select, [contenteditable="true"]')) return;

            // Number keys (both top row and numpad)
            if (/^[0-9]$/.test(e.key)) {
                e.preventDefault();
                if (context.currentAnswer.length < 3) context.currentAnswer += e.key;
                if (answerEl) answerEl.textContent = context.currentAnswer || '?';
                return;
            }

            // Numpad keys (for older browsers)
            if (/^Numpad[0-9]$/.test(e.code)) {
                e.preventDefault();
                const num = e.code.replace('Numpad', '');
                if (context.currentAnswer.length < 3) {
                    context.currentAnswer += num;
                    if (answerEl) answerEl.textContent = context.currentAnswer || '?';
                }
                return;
            }

            // Enter to submit (includes numpad Enter)
            if (e.key === 'Enter' || e.code === 'NumpadEnter') {
                e.preventDefault();
                if (context.currentAnswer && !e.repeat) {
                    checkAnswerCallback();
                }
                return;
            }

            // Backspace
            if (e.key === 'Backspace') {
                e.preventDefault();
                context.currentAnswer = context.currentAnswer.slice(0, -1);
                if (answerEl) answerEl.textContent = context.currentAnswer || '?';
                return;
            }

            // Delete/Escape to clear
            if (e.key === 'Delete' || e.key === 'Escape') {
                e.preventDefault();
                context.currentAnswer = '';
                if (answerEl) answerEl.textContent = '?';
                return;
            }
        };
    },

    /**
     * Safely remove a keyboard event handler
     * @param {Function} handler - The event handler function to remove
     */
    removeHandler(handler) {
        if (handler) {
            document.removeEventListener('keydown', handler);
        }
    },

    /**
     * Add a keyboard event handler
     * @param {Function} handler - The event handler function to add
     */
    addHandler(handler) {
        if (handler) {
            document.addEventListener('keydown', handler);
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.KeyboardHandler = KeyboardHandler;
}
