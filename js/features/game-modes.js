// KAIJU - Additional Game Modes
// Challenge, Campaign, and Practice modes

// ===================================
// TIMED CHALLENGE MODE
// ===================================

class ChallengeMode {
    constructor() {
        this.active = false;
        this.timeLimit = 120; // 2 minutes in seconds
        this.targetQuestions = 20;
        this.startTime = null;
        this.questions = [];
        this.currentIndex = 0;
        this.currentQuestion = null;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.operation = 'multiply';
        this.answerLog = []; // Track all questions and answers
    }

    // Start timed challenge
    startChallenge(tables, timeLimit = 120, operation = 'multiply', includeSubtraction = false, allowOverhang = false, includeThreePart = false) {
        if (!Array.isArray(tables) || !tables.length) throw new Error('Choose at least one table or range.');
        this.tables = tables;
        this.active = true;
        this.timeLimit = timeLimit;
        this.startTime = Date.now();
        this.currentIndex = 0;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.operation = operation;
        this.includeSubtraction = includeSubtraction;
        this.allowOverhang = allowOverhang;
        this.includeThreePart = includeThreePart;
        this.answerLog = []; // Reset answer log

        // Generate shuffled questions
        this.questions = this.generateQuestions(tables, this.targetQuestions * 2, operation);

        // Set first question
        this.currentQuestion = this.getCurrentQuestion();

        return {
            timeLimit: this.timeLimit,
            startTime: this.startTime
        };
    }

    // Generate questions
    generateQuestions(tables, count, operation) {
        const questions = [];

        while (questions.length < count) {
            // For mixed mode, randomly choose between addition and multiplication
            let currentOp = operation;
            if (operation === 'mixed') {
                // Randomly pick a table/range from the mixed list
                const item = tables[Math.floor(Math.random() * tables.length)];
                // If it's a range object (has min/max), use addition; otherwise use multiplication
                currentOp = (typeof item === 'object' && item.min !== undefined) ? 'add' : 'multiply';
            }

            if (currentOp === 'add') {
                // For addition, find a range object from tables
                let range;
                if (operation === 'mixed') {
                    // In mixed mode, filter for range objects only
                    const ranges = tables.filter(t => typeof t === 'object' && t.min !== undefined);
                    range = ranges[Math.floor(Math.random() * ranges.length)];
                } else {
                    // In pure add mode, any item should be a range
                    range = tables[Math.floor(Math.random() * tables.length)];
                }

                const { min, max } = QuestionGenerator.parseRange(range);

                const question = QuestionGenerator.generateAdditionQuestion(
                    min, max,
                    this.includeThreePart,
                    this.includeSubtraction,
                    this.allowOverhang
                );

                questions.push(question);
            } else {
                // For multiplication, find a number from tables
                let table;
                if (operation === 'mixed') {
                    // In mixed mode, filter for plain numbers only
                    const numberTables = tables.filter(t => typeof t === 'number');
                    table = numberTables[Math.floor(Math.random() * numberTables.length)];
                } else {
                    // In pure multiply mode, any item should be a number
                    table = tables[Math.floor(Math.random() * tables.length)];
                }

                // Multiplier range is fixed for standard times-table practice and is
                // independent of WHICH tables are selected (selecting the 20× table must
                // not push multipliers up to 20×20=400).
                const maxMultiplier = 12;
                const num2 = Math.floor(Math.random() * maxMultiplier) + 1;

                questions.push({
                    num1: table,
                    num2: num2,
                    operation: 'multiply',
                    answer: table * num2,
                    fact: `${table}×${num2}`
                });
            }
        }

        return questions;
    }

    // Get current question
    getCurrentQuestion() {
        if (this.currentIndex >= this.questions.length) {
            this.questions = this.generateQuestions(this.tables, this.targetQuestions * 2, this.operation);
            this.currentIndex = 0;
        }
        return this.questions[this.currentIndex];
    }

    // Check answer
    checkAnswer(userAnswer, timeSpent) {
        const question = this.currentQuestion;
        const correct = userAnswer === question.answer;

        // Track stats
        this.questionsAnswered++;
        let earnedPoints = 0;

        // Calculate difficulty multiplier (used for both correct and incorrect answers)
        let difficultyMultiplier = 1.0;
        if (question.operation === 'multiply') {
            // Tables 1-5: 1x, 6-10: 1.2x, 11-15: 1.5x, 16-20: 2x
            if (question.num1 >= 16) difficultyMultiplier = 2.0;
            else if (question.num1 >= 11) difficultyMultiplier = 1.5;
            else if (question.num1 >= 6) difficultyMultiplier = 1.2;
        } else {
            // Larger numbers = harder
            const maxNum = Math.max(question.num1, question.num2, question.num3 || 0);
            if (maxNum >= 51) difficultyMultiplier = 2.0;
            else if (maxNum >= 21) difficultyMultiplier = 1.5;
            else if (maxNum >= 11) difficultyMultiplier = 1.2;
        }

        if (correct) {
            this.correctAnswers++;
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);

            // Score: Base + difficulty bonus + time bonus + combo bonus
            const basePoints = 100 * difficultyMultiplier;
            const timeBonus = Math.max(0, Math.floor((5 - timeSpent) * 10 * difficultyMultiplier));
            const comboBonus = this.combo * 5;

            // Per-question bonuses for subtraction, overhang, and 3-part
            let featureBonus = 0;
            if (question.isThreePart) {
                featureBonus += basePoints * 0.4; // +40% for 3-part questions
            }
            if (question.isSubtraction) {
                featureBonus += basePoints * 0.2; // +20% for subtraction
            }
            if (question.hasOverhang) {
                featureBonus += basePoints * 0.3; // +30% for overhang
            }

            earnedPoints = Math.floor(basePoints + timeBonus + comboBonus + featureBonus);
            this.score += earnedPoints;
        } else {
            // Wrong answer: penalty inversely proportional to difficulty
            // Easier questions (lower multiplier) subtract MORE points to encourage challenge
            // Tables 1-5 (1.0x): -100 points
            // Tables 6-10 (1.2x): -83 points
            // Tables 11-15 (1.5x): -67 points
            // Tables 16-20 (2.0x): -50 points
            this.combo = 0;
            earnedPoints = Math.floor(-100 / difficultyMultiplier);
            this.score = Math.max(0, this.score + earnedPoints); // Don't go below 0
        }

        // Log this answer for question breakdown
        this.answerLog.push({
            question: question,
            userAnswer: userAnswer,
            correct: correct,
            timeSpent: timeSpent,
            pointsEarned: earnedPoints
        });

        // Move to next question
        this.currentIndex++;
        this.currentQuestion = this.getCurrentQuestion();

        return {
            correct,
            points: earnedPoints,
            score: this.score,
            combo: this.combo,
            questionsAnswered: this.questionsAnswered,
            timeRemaining: this.getTimeRemaining()
        };
    }

    // Get time remaining
    getTimeRemaining() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        return Math.max(0, this.timeLimit - elapsed);
    }

    // Check if time is up
    isTimeUp() {
        return this.getTimeRemaining() <= 0;
    }

    // Get final results
    getResults() {
        const accuracy = this.questionsAnswered > 0 ? Math.round((this.correctAnswers / this.questionsAnswered) * 100) : 0;

        // Calculate grade based on accuracy and speed
        let grade = 'F';
        if (accuracy >= 95 && this.questionsAnswered >= 30) grade = 'S';
        else if (accuracy >= 90 && this.questionsAnswered >= 25) grade = 'A';
        else if (accuracy >= 80 && this.questionsAnswered >= 20) grade = 'B';
        else if (accuracy >= 70 && this.questionsAnswered >= 15) grade = 'C';
        else if (accuracy >= 60 && this.questionsAnswered >= 10) grade = 'D';

        return {
            questionsAnswered: this.questionsAnswered,
            correctAnswers: this.correctAnswers,
            score: this.score,
            accuracy: accuracy,
            grade: grade,
            maxCombo: this.maxCombo,
            timeUsed: this.timeLimit - this.getTimeRemaining(),
            questionsPerMinute: (() => {
                const minutes = (this.timeLimit - this.getTimeRemaining()) / 60;
                return minutes > 0 ? (this.questionsAnswered / minutes).toFixed(1) : '0.0';
            })(),
            answerLog: this.answerLog // Include question breakdown
        };
    }

    // End challenge
    endChallenge() {
        const results = this.getResults();
        this.active = false;
        return results;
    }
}

// ===================================
// CAMPAIGN/STORY MODE
// ===================================

class CampaignMode {
    constructor() {
        this.chapters = this.initializeChapters();
    }

    // Initialize campaign chapters (each table is a chapter)
    initializeChapters() {
        return [
            { id: 1, table: 1, name: 'The Beginning', enemy: 'Baby Kaiju', unlocked: true },
            { id: 2, table: 2, name: 'Double Trouble', enemy: 'Twin Kaiju', unlocked: false },
            { id: 3, table: 3, name: 'Triple Threat', enemy: 'Tri-Beast', unlocked: false },
            { id: 4, table: 4, name: 'Four Corners', enemy: 'Quad Monster', unlocked: false },
            { id: 5, table: 5, name: 'High Five', enemy: 'Pentagon Beast', unlocked: false },
            { id: 6, table: 6, name: 'Six Shooter', enemy: 'Hexa-Kaiju', unlocked: false },
            { id: 7, table: 7, name: 'Lucky Seven', enemy: 'Fortune Dragon', unlocked: false },
            { id: 8, table: 8, name: 'Infinity Gate', enemy: 'Octo-Terror', unlocked: false },
            { id: 9, table: 9, name: 'Cloud Nine', enemy: 'Sky Serpent', unlocked: false },
            { id: 10, table: 10, name: 'Perfect Ten', enemy: 'Deca-Beast', unlocked: false },
            { id: 11, table: 11, name: 'Double Digits', enemy: 'Twin Titans', unlocked: false },
            { id: 12, table: 12, name: 'The Dozen', enemy: 'Ultimate Kaiju', unlocked: false, isBoss: true }
        ];
    }

    // Get current chapter
    getCurrentChapter(profile) {
        const completedChapters = profile.campaign?.completedChapters || [];
        const currentChapterId = completedChapters.length + 1;

        return this.chapters.find(c => c.id === currentChapterId) || this.chapters[this.chapters.length - 1];
    }

    // Check if chapter is unlocked
    isChapterUnlocked(chapterId, profile) {
        const completedChapters = profile.campaign?.completedChapters || [];

        // Chapter 1 always unlocked
        if (chapterId === 1) return true;

        // Chapter unlocked if previous chapter completed
        return completedChapters.includes(chapterId - 1);
    }

    // Complete chapter
    completeChapter(chapterId, profile) {
        if (!profile.campaign) {
            profile.campaign = { currentChapter: 1, completedChapters: [] };
        }

        if (!profile.campaign.completedChapters.includes(chapterId)) {
            profile.campaign.completedChapters.push(chapterId);
            profile.campaign.currentChapter = chapterId + 1;

            // Award bonus XP
            const bonusXP = chapterId * 100;
            profile.xp += bonusXP;

            // Check campaign achievement
            if (typeof achievementManager !== 'undefined') {
                achievementManager.updateProgress('campaign_chapters', profile.campaign.completedChapters.length, profile);
            }

            return {
                completed: true,
                bonusXP: bonusXP,
                nextChapter: this.chapters.find(c => c.id === chapterId + 1)
            };
        }

        return { completed: false };
    }

    // Get chapter requirements for mastery
    getChapterRequirements(chapterId) {
        const chapter = this.chapters.find(c => c.id === chapterId);

        return {
            table: chapter.table,
            minimumAccuracy: 80, // Must get 80% or better
            battles: chapter.isBoss ? 3 : 5, // Boss chapters require 3 victories, others 5
            description: chapter.isBoss ?
                `Defeat the ${chapter.enemy} in 3 epic battles!` :
                `Master the ${chapter.table}× table by winning 5 battles!`
        };
    }

    // Get campaign progress
    getProgress(profile) {
        const completedChapters = profile.campaign?.completedChapters || [];

        return {
            currentChapter: this.getCurrentChapter(profile),
            completedCount: completedChapters.length,
            totalChapters: this.chapters.length,
            percentComplete: Math.round((completedChapters.length / this.chapters.length) * 100),
            chapters: this.chapters.map(chapter => ({
                ...chapter,
                completed: completedChapters.includes(chapter.id),
                unlocked: this.isChapterUnlocked(chapter.id, profile)
            }))
        };
    }
}

// ===================================
// PRACTICE/DRILL MODE
// ===================================

class PracticeMode {
    constructor() {
        this.active = false;
        this.currentTable = null;
        this.operation = 'multiply';
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.results = [];
        this.includeSubtraction = false;
        this.allowOverhang = false;
        this.includeThreePart = false;
    }

    // Start practice session for a specific table or range
    startPractice(tableOrRange, operation = 'multiply', options = {}) {
        this.active = true;
        this.currentTable = tableOrRange;
        this.operation = operation;
        this.currentQuestionIndex = 0;
        this.results = [];
        this.includeSubtraction = options.includeSubtraction || false;
        this.allowOverhang = options.allowOverhang || false;
        this.includeThreePart = options.includeThreePart || false;

        this.questions = [];

        if (operation === 'multiply') {
            // Generate all combinations for this table (1-20)
            for (let i = 1; i <= 20; i++) {
                this.questions.push({
                    num1: tableOrRange,
                    num2: i,
                    operation: operation,
                    answer: tableOrRange * i,
                    fact: `${tableOrRange}×${i}`
                });
            }
        } else if (operation === 'add') {
            // Parse range (e.g., "1-10" -> min: 1, max: 10)
            let min, max;
            if (typeof tableOrRange === 'string') {
                const parts = tableOrRange.split('-');
                min = parseInt(parts[0]);
                max = parseInt(parts[1]);
            } else if (typeof tableOrRange === 'object') {
                min = tableOrRange.min;
                max = tableOrRange.max;
            } else {
                min = 1;
                max = 10;
            }

            // Generate 30 random questions within the range
            for (let i = 0; i < 30; i++) {
                const question = QuestionGenerator.generateAdditionQuestion(
                    min, max,
                    this.includeThreePart,
                    this.includeSubtraction,
                    this.allowOverhang
                );

                this.questions.push(question);
            }
        }

        // Shuffle for variety
        this.questions = ArrayUtils.shuffle(this.questions);

        return this.questions;
    }

    // Check answer for current question
    checkAnswer(userAnswer, timeSpent) {
        if (!this.active || this.currentQuestionIndex >= this.questions.length) {
            return { correct: false, message: 'No active question' };
        }

        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = userAnswer === question.answer;

        // Record the result so getFinalReport can compute real accuracy / weak facts
        this.results.push({
            question: question,
            userAnswer: userAnswer,
            correct: isCorrect,
            timeSpent: timeSpent
        });

        this.currentQuestionIndex++;

        if (isCorrect) {
            if (timeSpent < 3) {
                return { correct: true, message: '⚡ Lightning Fast!' };
            } else if (timeSpent < 5) {
                return { correct: true, message: '✓ Correct!' };
            } else {
                return { correct: true, message: '✓ Correct!' };
            }
        } else {
            return {
                correct: false,
                message: `✗ Wrong! Answer: ${question.answer}`,
                showHint: true
            };
        }
    }

    // Get final report for practice session
    getFinalReport(profile) {
        const results = this.results || [];
        const answered = results.length;
        const correctCount = results.filter(r => r.correct).length;
        // Base accuracy on questions actually answered, not the full generated set
        const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;
        const avgTime = answered > 0
            ? Math.round((results.reduce((sum, r) => sum + (r.timeSpent || 0), 0) / answered) * 10) / 10
            : 0;

        // Facts the player got wrong this session
        const weakFacts = results
            .filter(r => !r.correct)
            .map(r => r.question.fact)
            .filter((fact, i, arr) => fact && arr.indexOf(fact) === i);

        const recommendations = [];
        if (answered > 0 && accuracy < 80) {
            recommendations.push(t('keepPracticing'));
        }
        if (weakFacts.length > 0) {
            recommendations.push(tFormat('reviewFacts', null, weakFacts.slice(0, 5).join(', ')));
        }

        return {
            table: this.currentTable,
            totalQuestions: this.questions.length,
            answered: answered,
            correct: correctCount,
            accuracy: accuracy,
            avgTime: avgTime,
            weakFacts: weakFacts,
            recommendations: recommendations
        };
    }

    endPractice() {
        this.active = false;
        return {
            table: this.currentTable,
            totalQuestions: this.questions.length
        };
    }
}

// Create global instances
const challengeMode = new ChallengeMode();
const campaignMode = new CampaignMode();
const practiceMode = new PracticeMode();
