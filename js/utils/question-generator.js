// KAIJU - Question Generation Utilities
// Shared question generation logic to avoid duplication across game modes

const QuestionGenerator = {
    /**
     * Generate an addition question with support for 3-part, subtraction, and overhang
     * @param {number} min - Minimum number value
     * @param {number} max - Maximum number value
     * @param {boolean} includeThreePart - Allow 3-part questions (x + y + z)
     * @param {boolean} includeSubtraction - Allow subtraction questions
     * @param {boolean} allowOverhang - Allow overhang (carrying) in addition
     * @returns {Object} Question object
     */
    generateAdditionQuestion(min, max, includeThreePart = false, includeSubtraction = false, allowOverhang = false) {
        this.validateRange(min, max);
        const pick = values => values[Math.floor(Math.random() * values.length)];
        const randomOperand = () => Math.floor(Math.random() * (max - min + 1)) + min;
        const isThreePart = includeThreePart && Math.random() < 0.5;
        const isSubtraction = includeSubtraction && Math.random() < 0.5;
        let operands;

        if (isSubtraction) {
            const a = randomOperand();
            const b = randomOperand();
            operands = [Math.max(a, b), Math.min(a, b)];
            if (isThreePart) {
                let choices = allowOverhang ? null : this.noCarryChoices(min, max, operands[0] - operands[1], 1);
                if (choices && !choices.length) {
                    // Equal operands guarantee a nonnegative, carry-free final addition.
                    operands[1] = operands[0];
                    choices = this.noCarryChoices(min, max, 0, 1);
                }
                operands.push(choices ? pick(choices) : randomOperand());
            }
        } else if (allowOverhang) {
            operands = Array.from({ length: isThreePart ? 3 : 2 }, randomOperand);
        } else {
            operands = [];
            let total = 0;
            for (let remaining = isThreePart ? 3 : 2; remaining > 0; remaining--) {
                const choices = this.noCarryChoices(min, max, total, remaining);
                if (!choices.length) {
                    throw new RangeError('This range needs carrying. Enable carrying or choose a different range.');
                }
                const value = pick(choices);
                operands.push(value);
                total += value;
            }
        }

        const [num1, num2, num3] = operands;
        const subtotal = isSubtraction ? num1 - num2 : num1 + num2;
        const hasOverhang = (!isSubtraction && this.requiresCarry(num1, num2)) ||
            (isThreePart && this.requiresCarry(subtotal, num3));
        return this.withFact({
            num1, num2,
            ...(isThreePart ? { num3 } : {}),
            answer: subtotal + (num3 || 0),
            operation: isSubtraction ? 'subtract' : 'add',
            isThreePart, isSubtraction, hasOverhang,
            difficulty: this.getQuestionDifficulty(num1, num2)
        });
    },

    validateRange(min, max) {
        if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max < min || max > 250) {
            throw new RangeError('Choose a valid number range between 1 and 250.');
        }
    },

    parseRange(range) {
        const [min, max] = typeof range === 'string' ? range.split('-').map(Number) : [range?.min, range?.max];
        this.validateRange(min, max);
        return { min, max };
    },

    // Cache feasible next operands. Checking the remaining operands avoids dead ends
    // in narrow ranges and preserves the chosen bounds without inserting zeroes.
    noCarryCache: new Map(),
    noCarryChoices(min, max, total, remaining) {
        const key = `${min}:${max}:${total}:${remaining}`;
        if (this.noCarryCache.has(key)) return this.noCarryCache.get(key);
        const choices = [];
        for (let value = min; value <= max; value++) {
            if (this.requiresCarry(total, value)) continue;
            if (remaining === 1 || this.noCarryChoices(min, max, total + value, remaining - 1).length) {
                choices.push(value);
            }
        }
        this.noCarryCache.set(key, choices);
        return choices;
    },

    withFact(question) {
        question.fact = this.formatQuestion(question).replace(' = ?', '').replaceAll(' ', '');
        return question;
    },

    /**
     * Generate a multiplication question
     * @param {number} table - The multiplication table (e.g., 7 for 7× table)
     * @param {number} maxFactor - Maximum factor (e.g., 12 for up to 7×12)
     * @returns {Object} Question object
     */
    generateMultiplicationQuestion(table, maxFactor = null) {
        // If no maxFactor specified, use the table number itself (e.g., 7× table goes up to 7×7)
        const max = maxFactor || table;
        const factor = Math.floor(Math.random() * max) + 1;

        return {
            num1: table,
            num2: factor,
            answer: table * factor,
            operation: 'multiply',
            difficulty: this.getQuestionDifficulty(table, factor)
        };
    },

    /**
     * Does adding a + b require carrying in any digit column?
     * @param {number} a
     * @param {number} b
     * @returns {boolean}
     */
    requiresCarry(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (a > 0 || b > 0) {
            if ((a % 10) + (b % 10) >= 10) return true;
            a = Math.floor(a / 10);
            b = Math.floor(b / 10);
        }
        return false;
    },

    /**
     * Calculate question difficulty based on numbers involved
     * @param {number} num1 - First number
     * @param {number} num2 - Second number
     * @returns {number} Difficulty score (1-3)
     */
    getQuestionDifficulty(num1, num2) {
        const maxNum = Math.max(num1, num2);
        const product = num1 * num2;

        if (maxNum <= 5 || product <= 25) return 1;
        if (maxNum <= 10 || product <= 100) return 2;
        return 3;
    },

    /**
     * Format question for display
     * @param {Object} question - Question object
     * @returns {string} Formatted question string
     */
    formatQuestion(question) {
        if (question.isThreePart && question.num3 !== undefined) {
            const operator1 = question.isSubtraction ? '-' : '+';
            return `${question.num1} ${operator1} ${question.num2} + ${question.num3} = ?`;
        } else {
            let operator = '×';
            if (question.operation === 'add') operator = '+';
            else if (question.operation === 'subtract') operator = '-';
            return `${question.num1} ${operator} ${question.num2} = ?`;
        }
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.QuestionGenerator = QuestionGenerator;
}
