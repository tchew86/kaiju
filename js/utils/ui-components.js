// KAIJU - UI Components Utilities
// Shared UI component creation to avoid duplication

const UIComponents = {
    /**
     * Escape a string for safe interpolation into innerHTML.
     * Use for any user-controlled value (e.g. profile names) rendered via innerHTML.
     * @param {*} value - Value to escape (coerced to string)
     * @returns {string} HTML-escaped string
     */
    escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    /**
     * Create a number pad grid (0-9, clear, submit)
     * @param {string} idPrefix - Prefix for element IDs (e.g., 'challenge', 'practice')
     * @param {string} submitText - Text for submit button
     * @returns {Object} Object containing { numberPad, clearBtn, submitBtn, numberButtons }
     */
    createNumberPad(idPrefix = 'game', submitText = 'SUBMIT!') {
        const numberPad = document.createElement('div');
        numberPad.className = 'answer-grid';
        numberPad.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            max-width: 350px;
            margin: 0 auto 20px auto;
        `;

        const numberButtons = [];

        // Create number buttons 1-9
        for (let i = 1; i <= 9; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = 'answer-btn';
            btn.dataset.number = i;
            numberButtons.push(btn);
            numberPad.appendChild(btn);
        }

        // Clear button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '⌫';
        clearBtn.setAttribute('aria-label', 'Delete last digit');
        clearBtn.id = `${idPrefix}-clear-btn`;
        clearBtn.className = 'answer-btn clear-btn';
        numberPad.appendChild(clearBtn);

        // Zero button
        const zeroBtn = document.createElement('button');
        zeroBtn.textContent = '0';
        zeroBtn.className = 'answer-btn';
        zeroBtn.dataset.number = 0;
        numberButtons.push(zeroBtn);
        numberPad.appendChild(zeroBtn);

        // Submit button
        const submitBtn = document.createElement('button');
        submitBtn.id = `${idPrefix}-submit-btn`;
        submitBtn.className = 'answer-btn submit-btn';
        submitBtn.textContent = submitText;
        numberPad.appendChild(submitBtn);

        return {
            numberPad,
            clearBtn,
            submitBtn,
            numberButtons
        };
    },

    /**
     * Render stat cards in a grid
     * @param {HTMLElement} containerElement - Container to append cards to
     * @param {Array} statCards - Array of stat objects with { label, value, icon, color }
     * @param {Object} options - Optional styling options
     */
    renderStatCards(containerElement, statCards, options = {}) {
        const {
            borderWidth = '2px',
            borderRadius = '12px',
            padding = '20px',
            iconSize = '2rem',
            valueSize = '2rem',
            labelSize = '0.9rem'
        } = options;

        statCards.forEach(stat => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(0, 0, 0, 0.5);
                border: ${borderWidth} solid ${stat.color};
                border-radius: ${borderRadius};
                padding: ${padding};
                text-align: center;
            `;

            card.innerHTML = `
                <div style="font-size: ${iconSize};">${stat.icon}</div>
                <div style="font-size: ${valueSize}; font-weight: bold; color: ${stat.color}; margin: 10px 0;">
                    ${stat.value}
                </div>
                <div style="color: #aaa; font-size: ${labelSize}; text-transform: uppercase;">
                    ${stat.label}
                </div>
            `;

            containerElement.appendChild(card);
        });
    },

    /**
     * Create a modal overlay
     * @param {string} contentHTML - HTML content for the modal
     * @param {Object} options - Optional styling options
     * @returns {HTMLElement} Modal element
     */
    createModal(contentHTML, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        const container = document.createElement('div');
        container.className = 'modal-panel';
        container.style.setProperty('--modal-width', options.maxWidth || '700px');
        container.style.setProperty('--modal-height', options.maxHeight || '90vh');
        container.style.setProperty('--modal-color', options.borderColor || '#00ff00');
        container.innerHTML = contentHTML;
        modal.appendChild(container);
        modal.onclick = event => { if (event.target === modal) modal.remove(); };
        return modal;
    },

    openModal(modal) {
        document.querySelector('.game-dialog')?.remove();
        const previousFocus = document.activeElement;
        const panel = modal.firstElementChild;
        modal.classList.add('game-dialog');
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.tabIndex = -1;
        const heading = panel.querySelector('h1, h2');
        if (heading) {
            heading.id ||= `dialog-title-${++this.dialogId}`;
            panel.setAttribute('aria-labelledby', heading.id);
        }
        const handler = event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                modal.remove();
            } else if (event.key === 'Tab') {
                const controls = [...panel.querySelectorAll('button, input, select, a[href], [tabindex="0"]')]
                    .filter(element => !element.disabled && element.getClientRects().length);
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (!first) event.preventDefault();
                else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
                    event.preventDefault(); last.focus();
                } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel)) {
                    event.preventDefault(); first.focus();
                }
            }
            // Game-wide number/Enter handlers must not run behind a dialog.
            event.stopImmediatePropagation();
        };
        const remove = modal.remove.bind(modal);
        modal.remove = () => {
            document.removeEventListener('keydown', handler, true);
            remove();
            if (previousFocus?.isConnected) previousFocus.focus();
        };
        document.body.appendChild(modal);
        document.addEventListener('keydown', handler, true);
        panel.focus();
        return modal;
    },
    dialogId: 0,

    confirm(message, onConfirm) {
        const modal = this.createModal(`
            <h2>${this.escapeHtml(t('confirmQuitTitle'))}</h2>
            <p>${this.escapeHtml(message)}</p>
            <div class="dialog-actions">
                <button data-confirm>${this.escapeHtml(t('quit'))}</button>
                <button data-cancel>${this.escapeHtml(t('keepPlaying'))}</button>
            </div>
        `, { maxWidth: '450px' });
        modal.querySelector('[data-confirm]').onclick = () => { modal.remove(); onConfirm(); };
        modal.querySelector('[data-cancel]').onclick = () => modal.remove();
        this.openModal(modal);
    },

    /**
     * Create a progress bar
     * @param {number} percentage - Progress percentage (0-100)
     * @param {Object} options - Optional styling options
     * @returns {HTMLElement} Progress bar element
     */
    createProgressBar(percentage, options = {}) {
        const {
            height = '20px',
            fillColor = '#00ff00',
            backgroundColor = 'rgba(0, 0, 0, 0.5)',
            borderRadius = '10px',
            showText = true
        } = options;

        const container = document.createElement('div');
        container.style.cssText = `
            background: ${backgroundColor};
            border-radius: ${borderRadius};
            height: ${height};
            position: relative;
            overflow: hidden;
        `;

        const fill = document.createElement('div');
        fill.style.cssText = `
            background: linear-gradient(90deg, ${fillColor}, ${fillColor}cc);
            height: 100%;
            width: ${Math.min(100, percentage)}%;
            transition: width 0.3s ease;
        `;

        if (showText) {
            const text = document.createElement('div');
            text.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 0.75rem;
                font-weight: bold;
                text-shadow: 0 0 3px #000;
            `;
            text.textContent = `${Math.floor(percentage)}%`;
            container.appendChild(fill);
            container.appendChild(text);
        } else {
            container.appendChild(fill);
        }

        return container;
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.UIComponents = UIComponents;
}
