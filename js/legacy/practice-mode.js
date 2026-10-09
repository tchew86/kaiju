// KAIJU - Practice/Drill Mode
// No HP, focused learning, immediate feedback

class PracticeMode {
    constructor() {
        this.active = false;
        this.currentTable = null;
        this.questions = [];
        this.currentIndex = 0;
        this.stats = {
            correct: 0,
            total: 0,
            times: []
        };
    }

    // Start practice session for a specific table
    startPractice(table, operation = 'multiply') {
        this.active = true;
        this.currentTable = table;
        this.currentIndex = 0;
        this.stats = { correct: 0, total: 0, times: [] };

        // Generate all facts for this table
        this.questions = this.generateTableQuestions(table, operation);

        console.log(`🎓 Practice Mode: ${table}× table (${this.questions.length} questions)`);

        return {
            table: table,
            totalQuestions: this.questions.length,
            operation: operation
        };
    }

    // Generate questions for practice
    generateTableQuestions(table, operation) {
        const questions = [];

        // Check if table is a range (e.g., "11-20" for addition)
        if (typeof table === 'string' && table.includes('-')) {
            const [min, max] = table.split('-').map(Number);

            // Generate 40 random addition questions within this range (reasonable practice size)
            for (let i = 0; i < 40; i++) {
                const a = Math.floor(Math.random() * (max - min + 1)) + min;
                const b = Math.floor(Math.random() * (max - min + 1)) + min;

                if (operation === 'add' || operation === 'subtract') {
                    const isAdd = operation === 'add';
                    questions.push({
                        num1: isAdd ? a : Math.max(a, b),  // For subtraction, ensure positive result
                        num2: isAdd ? b : Math.min(a, b),
                        operation: operation,
                        answer: isAdd ? a + b : Math.max(a, b) - Math.min(a, b),
                        fact: isAdd ? `${a}+${b}` : `${Math.max(a, b)}-${Math.min(a, b)}`
                    });
                }
            }
        } else {
            // Single table for multiplication
            const tableNum = parseInt(table);

            // Include 0 through 12 for thorough practice
            for (let i = 0; i <= 12; i++) {
                // Add each fact twice for repetition
                for (let rep = 0; rep < 2; rep++) {
                    questions.push({
                        num1: tableNum,
                        num2: i,
                        operation: operation,
                        answer: operation === 'multiply' ? tableNum * i : tableNum + i,
                        fact: operation === 'multiply' ? `${tableNum}×${i}` : `${tableNum}+${i}`
                    });
                }
            }
        }

        // Shuffle for variety
        return this.shuffleArray(questions);
    }

    // Get current question
    getCurrentQuestion() {
        if (this.currentIndex >= this.questions.length) {
            return null; // Practice complete
        }
        return this.questions[this.currentIndex];
    }

    // Check answer and get feedback
    checkAnswer(userAnswer, timeSpent) {
        const question = this.getCurrentQuestion();
        if (!question) return null;

        const correct = userAnswer === question.answer;
        this.stats.total++;
        if (correct) this.stats.correct++;
        this.stats.times.push(timeSpent);

        // Track in analytics
        if (window.analytics && window.playerProfile) {
            analytics.trackQuestion(question.fact, correct, timeSpent, playerProfile);
            analytics.trackTable(this.currentTable, correct, timeSpent, playerProfile);

            if (!correct) {
                analytics.trackMistake(question.fact, question.answer, userAnswer, playerProfile);
            }
        }

        // Prepare feedback
        const feedback = {
            correct: correct,
            question: question,
            userAnswer: userAnswer,
            correctAnswer: question.answer,
            timeSpent: timeSpent,
            encouragement: this.getEncouragement(correct, timeSpent),
            hint: correct ? null : this.getHint(question),
            progress: {
                current: this.currentIndex + 1,
                total: this.questions.length,
                accuracy: Math.round((this.stats.correct / this.stats.total) * 100)
            }
        };

        this.currentIndex++;
        return feedback;
    }

    // Get encouraging message
    getEncouragement(correct, timeSpent) {
        if (correct) {
            if (timeSpent < 2) return '⚡ Lightning fast!';
            if (timeSpent < 4) return '✨ Great job!';
            return '✓ Correct!';
        } else {
            return '💡 Let\'s try that again';
        }
    }

    // Get hint for wrong answer
    getHint(question) {
        const { num1, num2, operation } = question;

        if (operation === 'multiply') {
            // Multiplication hints
            if (num2 === 0) return `Anything times 0 equals 0`;
            if (num2 === 1) return `Anything times 1 equals itself: ${num1} × 1 = ${num1}`;
            if (num2 === 2) return `Double ${num1}: ${num1} + ${num1} = ${num1 * 2}`;
            if (num2 === 5) return `Count by 5s: 5, 10, 15... The ${num1}th number is ${num1 * 5}`;
            if (num2 === 10) return `Add a 0: ${num1} × 10 = ${num1}0`;
            if (num2 === 9) return `Try this: (${num1} × 10) - ${num1} = ${num1 * 10} - ${num1} = ${num1 * 9}`;

            // General hint
            return `Think: ${num1} groups of ${num2}, or ${num2} groups of ${num1}`;
        } else {
            // Addition hints
            if (num1 + num2 <= 10) return `Use your fingers: ${num1} + ${num2}`;
            if (num2 === 10) return `${num1} + 10 = ${num1 + 10}`;
            if ((num1 + num2) % 10 === 0) return `Makes a nice round number!`;

            return `Start at ${num1}, count up ${num2} more`;
        }
    }

    // Get final report
    getReport() {
        const avgTime = this.stats.times.reduce((a, b) => a + b, 0) / this.stats.times.length;
        const accuracy = (this.stats.correct / this.stats.total) * 100;

        // Determine mastery level
        let mastery = 'Keep Practicing';
        if (accuracy >= 90 && avgTime < 5) mastery = 'Mastered! 🌟';
        else if (accuracy >= 80 && avgTime < 6) mastery = 'Almost There! 🎯';
        else if (accuracy >= 70) mastery = 'Good Progress 👍';
        else if (accuracy >= 50) mastery = 'Getting Better 📈';

        return {
            table: this.currentTable,
            correct: this.stats.correct,
            total: this.stats.total,
            accuracy: Math.round(accuracy),
            avgTime: Math.round(avgTime * 10) / 10,
            mastery: mastery,
            weakFacts: this.getWeakFacts(),
            recommendation: this.getRecommendation(accuracy, avgTime)
        };
    }

    // Identify weak facts from this session
    getWeakFacts() {
        const factPerformance = {};

        this.questions.forEach((q, i) => {
            if (i >= this.currentIndex) return; // Not answered yet

            const fact = q.fact;
            if (!factPerformance[fact]) {
                factPerformance[fact] = { correct: 0, total: 0 };
            }
            factPerformance[fact].total++;

            // Check if this question was answered correctly
            // (This is simplified - in real implementation, track per attempt)
        });

        return Object.entries(factPerformance)
            .filter(([fact, perf]) => perf.total > 0 && (perf.correct / perf.total) < 0.7)
            .map(([fact]) => fact);
    }

    // Get practice recommendation
    getRecommendation(accuracy, avgTime) {
        if (accuracy >= 90 && avgTime < 5) {
            return `Excellent! Try a harder table or increase your speed.`;
        } else if (accuracy < 70) {
            return `Practice this table more. Focus on the facts you missed.`;
        } else if (avgTime > 7) {
            return `Good accuracy! Now work on your speed - try to answer faster.`;
        } else {
            return `Great progress! Keep practicing to maintain your skills.`;
        }
    }

    // End practice session
    endPractice() {
        const report = this.getReport();
        this.active = false;
        this.currentTable = null;
        this.questions = [];
        this.currentIndex = 0;

        return report;
    }

    // Utility: Shuffle array
    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Check if practice is complete
    isComplete() {
        return this.currentIndex >= this.questions.length;
    }

    // Get progress percentage
    getProgress() {
        return Math.round((this.currentIndex / this.questions.length) * 100);
    }
}

// Create global practice mode instance
const practiceMode = new PracticeMode();

console.log('✅ Practice Mode loaded - Focused learning ready');
