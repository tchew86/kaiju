// KAIJU - Hint & Strategy System
// Teaching multiplication strategies and tricks

class HintSystem {
    constructor() {
        this.strategies = this.initializeStrategies();
        this.mnemonics = this.initializeMnemonics();
    }

    // Initialize multiplication strategies
    initializeStrategies() {
        return {
            // Times 0
            0: {
                rule: "Anything times 0 equals 0",
                explanation: "When you multiply by 0, you have 0 groups, so the answer is always 0.",
                examples: ["5 × 0 = 0", "100 × 0 = 0", "0 × 7 = 0"]
            },

            // Times 1
            1: {
                rule: "Anything times 1 equals itself",
                explanation: "When you multiply by 1, you have 1 group of that number.",
                examples: ["7 × 1 = 7", "12 × 1 = 12", "1 × 9 = 9"]
            },

            // Times 2
            2: {
                rule: "Double the number (add it to itself)",
                explanation: "Multiplying by 2 is the same as adding the number twice.",
                examples: ["6 × 2 = 6 + 6 = 12", "8 × 2 = 8 + 8 = 16"],
                trick: "Just double it!"
            },

            // Times 5
            5: {
                rule: "Count by 5s (always ends in 0 or 5)",
                explanation: "When you multiply by 5, the answer always ends in 0 or 5.",
                examples: ["3 × 5 = 15", "6 × 5 = 30", "7 × 5 = 35"],
                trick: "Multiply by 10, then divide by 2: 7 × 5 = (7 × 10) ÷ 2 = 70 ÷ 2 = 35"
            },

            // Times 9
            9: {
                rule: "The 9 times trick",
                explanation: "Multiply by 10, then subtract the number once.",
                examples: ["7 × 9 = (7 × 10) - 7 = 70 - 7 = 63", "8 × 9 = 80 - 8 = 72"],
                trick: "Finger trick: Hold up 10 fingers. For 9 × 4, put down the 4th finger. Left of finger = tens (3), right of finger = ones (6). Answer: 36!"
            },

            // Times 10
            10: {
                rule: "Just add a 0 to the end",
                explanation: "Multiplying by 10 shifts the number one place to the left.",
                examples: ["6 × 10 = 60", "13 × 10 = 130"],
                trick: "Super easy - just add a zero!"
            },

            // Times 11 (up to 9)
            11: {
                rule: "Repeat the digit (for single digits)",
                explanation: "For numbers 1-9, multiplying by 11 repeats the digit.",
                examples: ["3 × 11 = 33", "7 × 11 = 77", "9 × 11 = 99"],
                trick: "For larger numbers: 12 × 11 = (1+2) in the middle = 132"
            },

            // Doubles (6×6, 7×7, 8×8, 9×9)
            doubles: {
                rule: "Memorize the square numbers",
                explanation: "These are numbers multiplied by themselves.",
                examples: ["6 × 6 = 36", "7 × 7 = 49", "8 × 8 = 64", "9 × 9 = 81"],
                trick: "Remember: 6×6=36, 7×7=49, 8×8=64, 9×9=81"
            },

            // Commutative property
            commutative: {
                rule: "Order doesn't matter",
                explanation: "3 × 7 is the same as 7 × 3. If you know one, you know both!",
                examples: ["4 × 9 = 9 × 4 = 36"],
                trick: "You only need to learn half the facts!"
            },

            // Breaking apart
            distributive: {
                rule: "Break into easier parts",
                explanation: "Split a hard problem into two easy ones.",
                examples: [
                    "7 × 8 = (7 × 5) + (7 × 3) = 35 + 21 = 56",
                    "6 × 7 = (6 × 5) + (6 × 2) = 30 + 12 = 42"
                ],
                trick: "Break the bigger number into pieces you know"
            }
        };
    }

    // Initialize memory tricks and mnemonics
    initializeMnemonics() {
        return {
            "6×6": "Six times six is thirty-SIX",
            "6×7": "Six and seven, Went to heaven, Forty-two they did score (42)",
            "6×8": "I ate (8) and ate (8) until I was sick (6) on the floor (48)",
            "7×7": "Seven sevens FOUR-ty NINE (7+7=14, split as 4 and 9, but backwards: 49)",
            "7×8": "Five, Six, Seven, Eight — Fifty-SIX = 7 × 8",
            "7×9": "Seven nines are sixty-THREE",
            "8×8": "I ate and ate until I was SIXTY-FOUR (64)",
            "8×9": "I ate (8) nine (9) chicken SEVENTY-TWO (72)",
            "9×9": "A cat has nine lives and EIGHTY-ONE whiskers"
        };
    }

    // Get hint for a specific fact
    getHint(num1, num2, operation = 'multiply') {
        if (operation === 'add') {
            return this.getAdditionHint(num1, num2);
        }

        // Ensure smaller number first for lookup
        const [smaller, larger] = num1 <= num2 ? [num1, num2] : [num2, num1];
        const fact = `${larger}×${smaller}`;

        // Check for specific mnemonic
        if (this.mnemonics[fact]) {
            return {
                type: 'mnemonic',
                hint: this.mnemonics[fact],
                answer: larger * smaller
            };
        }

        // Check for strategy based on multiplier
        if (this.strategies[smaller]) {
            const strategy = this.strategies[smaller];
            return {
                type: 'strategy',
                rule: strategy.rule,
                explanation: strategy.explanation,
                trick: strategy.trick,
                example: `${larger} × ${smaller} = ${this.applyStrategy(larger, smaller)}`,
                answer: larger * smaller
            };
        }

        // Check for doubles
        if (num1 === num2 && this.strategies.doubles) {
            return {
                type: 'strategy',
                rule: this.strategies.doubles.rule,
                hint: `${num1} × ${num1} = ${num1 * num1}`,
                answer: num1 * num1
            };
        }

        // Use distributive property for harder facts
        if (larger >= 6 && smaller >= 6) {
            return this.getDistributiveHint(larger, smaller);
        }

        // Generic hint
        return {
            type: 'generic',
            hint: `Think of ${larger} groups of ${smaller}, or ${smaller} groups of ${larger}`,
            visual: `${'◼'.repeat(Math.min(smaller, 5))} × ${larger} rows`,
            answer: larger * smaller
        };
    }

    // Apply strategy to calculate
    applyStrategy(num1, num2) {
        const [smaller, larger] = num1 <= num2 ? [num1, num2] : [num2, num1];

        if (smaller === 0) return 0;
        if (smaller === 1) return larger;
        if (smaller === 2) return larger * 2;
        if (smaller === 5) return larger * 5;
        if (smaller === 9) return (larger * 10) - larger;
        if (smaller === 10) return larger * 10;
        if (smaller === 11 && larger <= 9) return parseInt(`${larger}${larger}`);

        return larger * smaller;
    }

    // Get distributive property hint
    getDistributiveHint(num1, num2) {
        // Break num2 into 5 + remainder
        const remainder = num2 - 5;
        const part1 = num1 * 5;
        const part2 = num1 * remainder;

        return {
            type: 'distributive',
            rule: 'Break it into easier parts',
            explanation: `${num1} × ${num2} = (${num1} × 5) + (${num1} × ${remainder})`,
            calculation: `= ${part1} + ${part2} = ${part1 + part2}`,
            answer: num1 * num2
        };
    }

    // Get addition hint
    getAdditionHint(num1, num2) {
        const sum = num1 + num2;

        // Make 10 strategy
        if (num1 + num2 > 10) {
            const toMake10 = 10 - num1;
            const remaining = num2 - toMake10;

            if (toMake10 > 0 && toMake10 <= num2) {
                return {
                    type: 'make_ten',
                    hint: 'Make 10 first',
                    explanation: `${num1} + ${toMake10} = 10, then add ${remaining} more`,
                    calculation: `10 + ${remaining} = ${sum}`,
                    answer: sum
                };
            }
        }

        // Doubles
        if (num1 === num2) {
            return {
                type: 'doubles',
                hint: `Double ${num1}`,
                explanation: `${num1} + ${num1} = ${sum}`,
                answer: sum
            };
        }

        // Near doubles
        if (Math.abs(num1 - num2) === 1) {
            const double = Math.min(num1, num2) * 2;
            return {
                type: 'near_doubles',
                hint: `Almost doubles`,
                explanation: `Double ${Math.min(num1, num2)} = ${double}, then add 1 more`,
                calculation: `${double} + 1 = ${sum}`,
                answer: sum
            };
        }

        // Generic
        return {
            type: 'generic',
            hint: `Start at ${num1}, count up ${num2}`,
            answer: sum
        };
    }

    // Get all strategies for reference
    getAllStrategies() {
        return this.strategies;
    }

    // Get strategy list for a specific table
    getTableStrategies(table) {
        const strategies = [];

        if (this.strategies[table]) {
            strategies.push(this.strategies[table]);
        }

        // Add relevant mnemonics
        Object.entries(this.mnemonics).forEach(([fact, mnemonic]) => {
            if (fact.startsWith(`${table}×`)) {
                strategies.push({ fact, mnemonic });
            }
        });

        return strategies;
    }

    // Show hint modal (for UI integration)
    showHintModal(num1, num2, operation = 'multiply') {
        const hint = this.getHint(num1, num2, operation);

        // Create modal (will be styled by CSS)
        const modal = document.createElement('div');
        modal.className = 'hint-modal';
        modal.innerHTML = `
            <div class="hint-modal-content">
                <div class="hint-header">
                    <span class="hint-icon">💡</span>
                    <h2>Hint</h2>
                    <button class="hint-close" onclick="this.closest('.hint-modal').remove()">×</button>
                </div>
                <div class="hint-body">
                    ${hint.rule ? `<div class="hint-rule"><strong>${hint.rule}</strong></div>` : ''}
                    ${hint.explanation ? `<div class="hint-explanation">${hint.explanation}</div>` : ''}
                    ${hint.hint ? `<div class="hint-text">${hint.hint}</div>` : ''}
                    ${hint.trick ? `<div class="hint-trick">💡 Trick: ${hint.trick}</div>` : ''}
                    ${hint.example ? `<div class="hint-example">Example: ${hint.example}</div>` : ''}
                    ${hint.calculation ? `<div class="hint-calculation">${hint.calculation}</div>` : ''}
                </div>
                <div class="hint-footer">
                    <button class="action-btn" onclick="this.closest('.hint-modal').remove()">Got it!</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        return modal;
    }
}

// Create global hint system instance
const hintSystem = new HintSystem();
