// KAIJU - Practice Mode UI
// Full UI implementation for practice/drill mode

class PracticeUI {
    constructor() {
        this.container = null;
        this.currentTable = null;
        this.currentOperation = 'multiply';
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.results = [];
        this.startTime = null;
        this.active = false;
        this.waitingForNext = false;
        this.pendingTimers = [];
        this.options = {};
    }

    stop() {
        this.active = false;
        this.pendingTimers.forEach(clearTimeout);
        this.pendingTimers = [];
        KeyboardHandler.removeHandler(this.keyboardHandler);
        practiceMode.endPractice();
    }

    setWaiting(waiting) {
        this.waitingForNext = waiting;
        this.container.querySelectorAll('.answer-btn')
            .forEach(button => { button.disabled = waiting; });
    }

    // Start practice session
    start(table, operation = 'multiply', options = {}) {
        this.stop();
        this.active = true;
        this.options = { ...options };
        this.currentTable = table;
        this.currentOperation = operation;
        this.currentQuestionIndex = 0;
        this.results = [];

        // Generate questions
        this.questions = practiceMode.startPractice(table, operation, options);

        // Create UI
        this.createUI();
        this.showQuestion();
        this.startTime = Date.now();
    }

    // Create practice UI overlay
    createUI() {
        // Remove any existing practice UI
        const existing = document.querySelector('.practice-ui-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'practice-ui-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            padding: 20px;
            overflow-y: auto;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid #00ff00;
        `;
        const displayTitle = this.currentOperation === 'add'
            ? tFormat('rangePractice', null, this.currentTable)
            : tFormat('tablePractice', null, this.currentTable);

        header.innerHTML = `
            <h1 style="color: #00ff00; margin: 0; font-size: 2rem;">${t('practiceTitle')}</h1>
            <p style="color: #ffaa00; margin: 10px 0; font-size: 1.2rem;">
                ${displayTitle}
            </p>
        `;

        // Progress bar
        const progressBar = document.createElement('div');
        progressBar.id = 'practice-progress';
        progressBar.style.cssText = `
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 20px;
        `;
        progressBar.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #fff;">${t('questionLabel')} <span id="practice-current">1</span> / <span id="practice-total">26</span></span>
                <span style="color: #00ff00; font-weight: bold;"><span id="practice-correct">0</span> ${t('correctCount')}</span>
            </div>
            <div style="background: rgba(0, 0, 0, 0.7); border-radius: 5px; height: 10px; overflow: hidden;">
                <div id="practice-progress-bar" style="background: linear-gradient(90deg, #00ff00, #00aa00); height: 100%; width: 0%; transition: width 0.3s;"></div>
            </div>
        `;

        // Question container
        const questionContainer = document.createElement('div');
        questionContainer.id = 'practice-question-container';
        questionContainer.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            max-width: 600px;
            margin: 0 auto;
            width: 100%;
        `;

        // Question display
        const questionDisplay = document.createElement('div');
        questionDisplay.id = 'practice-question';
        questionDisplay.style.cssText = `
            font-size: 4rem;
            font-weight: bold;
            color: #fff;
            text-align: center;
            margin-bottom: 30px;
            text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        `;
        questionDisplay.textContent = '? × ? = ?';

        // Current answer display
        const currentAnswerDisplay = document.createElement('div');
        currentAnswerDisplay.style.cssText = `
            margin-bottom: 20px;
            text-align: center;
        `;
        currentAnswerDisplay.innerHTML = `
            <span style="color: #00ff00; font-size: 1.2rem; font-weight: bold;">${t('yourAnswer')}</span>
            <span id="practice-current-answer" style="color: #fff; font-size: 2.5rem; font-weight: bold; margin-left: 10px;">?</span>
        `;

        // Number pad grid (battle-style) - using UIComponents utility
        const { numberPad, clearBtn, submitBtn, numberButtons } = UIComponents.createNumberPad('practice', t('check'));

        // Feedback area
        const feedback = document.createElement('div');
        feedback.id = 'practice-feedback';
        feedback.style.cssText = `
            margin-top: 20px;
            font-size: 1.3rem;
            text-align: center;
            min-height: 60px;
            padding: 15px;
            border-radius: 10px;
        `;

        // Quit button
        const quitBtn = document.createElement('button');
        quitBtn.textContent = t('quitPractice');
        quitBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: #ff0000;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
        `;
        quitBtn.onclick = () => {
            UIComponents.confirm(t('quitPracticePrompt'), () => {
                this.stop();
                overlay.remove();
            });
        };

        // Assemble
        questionContainer.appendChild(questionDisplay);
        questionContainer.appendChild(currentAnswerDisplay);
        questionContainer.appendChild(numberPad);
        questionContainer.appendChild(feedback);

        overlay.appendChild(quitBtn);
        overlay.appendChild(header);
        overlay.appendChild(progressBar);
        overlay.appendChild(questionContainer);

        document.body.appendChild(overlay);
        this.container = overlay;

        // Initialize current answer storage
        this.currentAnswer = '';

        // Event listeners for number pad
        numberButtons.forEach(btn => {
            btn.onclick = () => {
                if (this.waitingForNext || !this.active || this.currentAnswer.length >= 3) return;
                const num = btn.dataset.number;
                this.currentAnswer += num;
                document.getElementById('practice-current-answer').textContent = this.currentAnswer || '?';
            };
        });

        clearBtn.onclick = () => {
            if (this.waitingForNext || !this.active) return;
            this.currentAnswer = this.currentAnswer.slice(0, -1);
            document.getElementById('practice-current-answer').textContent = this.currentAnswer || '?';
        };

        submitBtn.onclick = () => this.checkAnswer();

        // Keyboard support (numpad and regular numbers) - using KeyboardHandler utility
        this.keyboardHandler = KeyboardHandler.createHandler(
            this,
            'practice-current-answer',
            () => this.checkAnswer(),
            () => this.active && !this.waitingForNext
        );
        KeyboardHandler.addHandler(this.keyboardHandler);
    }

    // Show current question
    showQuestion() {
        if (!this.active) return;
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const q = this.questions[this.currentQuestionIndex];
        const questionEl = document.getElementById('practice-question');
        const currentAnswerEl = document.getElementById('practice-current-answer');
        const feedback = document.getElementById('practice-feedback');

        questionEl.textContent = QuestionGenerator.formatQuestion(q);
        this.setWaiting(false);
        this.startTime = Date.now();

        this.currentAnswer = '';
        if (currentAnswerEl) currentAnswerEl.textContent = '?';
        if (feedback) feedback.innerHTML = '';

        // Update progress
        const currentEl = document.getElementById('practice-current');
        const totalEl = document.getElementById('practice-total');
        const correctEl = document.getElementById('practice-correct');
        const progressBarEl = document.getElementById('practice-progress-bar');

        if (currentEl) currentEl.textContent = this.currentQuestionIndex + 1;
        if (totalEl) totalEl.textContent = this.questions.length;

        const correctCount = this.results.filter(r => r.correct).length;
        if (correctEl) correctEl.textContent = correctCount;

        const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
        if (progressBarEl) progressBarEl.style.width = progress + '%';
    }

    // Check answer
    checkAnswer() {
        if (!this.active || this.waitingForNext) return;
        const userAnswer = parseInt(this.currentAnswer);

        if (isNaN(userAnswer) || this.currentAnswer === '') {
            this.showFeedback(t('enterNumber'), 'warning');
            return;
        }

        const q = this.questions[this.currentQuestionIndex];
        const timeSpent = (Date.now() - this.startTime) / 1000;

        const result = practiceMode.checkAnswer(userAnswer, timeSpent);
        this.setWaiting(true);

        // Store result
        this.results.push({
            question: q,
            userAnswer: userAnswer,
            correct: result.correct,
            timeSpent: timeSpent
        });

        // Show feedback
        if (result.correct) {
            this.showFeedback(t('correctFeedback'), 'correct');
            this.pendingTimers.push(setTimeout(() => {
                this.currentQuestionIndex++;
                this.showQuestion();
            }, 1000));
        } else {
            this.showFeedback(tFormat('wrongFeedback', null, q.answer), 'wrong');

            // Show hint if available
            if (result.showHint && typeof hintSystem !== 'undefined') {
                this.pendingTimers.push(setTimeout(() => {
                    const feedback = document.getElementById('practice-feedback');
                    if (feedback) {
                        const hint = hintSystem.getHint(q.num1, q.num2, this.currentOperation);
                        feedback.innerHTML += `<div style="margin-top: 10px; color: #ffaa00; font-size: 1rem;">
                            💡 ${t('hintLabel')}: ${hint.explanation || hint.strategy}
                        </div>`;
                    }
                }, 800));
            }

            // Move to next after delay
            this.pendingTimers.push(setTimeout(() => {
                this.currentQuestionIndex++;
                this.showQuestion();
            }, 3000));
        }
    }

    // Show feedback message
    showFeedback(message, type) {
        const feedback = document.getElementById('practice-feedback');

        let color, bgColor, border;
        if (type === 'correct') {
            color = '#00ff00';
            bgColor = 'rgba(0, 255, 0, 0.2)';
            border = '2px solid #00ff00';
        } else if (type === 'wrong') {
            color = '#ff0000';
            bgColor = 'rgba(255, 0, 0, 0.2)';
            border = '2px solid #ff0000';
        } else {
            color = '#ffaa00';
            bgColor = 'rgba(255, 170, 0, 0.2)';
            border = '2px solid #ffaa00';
        }

        feedback.style.color = color;
        feedback.style.background = bgColor;
        feedback.style.border = border;
        feedback.innerHTML = `<strong>${message}</strong>`;
    }

    // Show final results
    showResults() {
        this.stop();
        const report = practiceMode.getFinalReport(playerProfile);

        this.container.innerHTML = '';

        const resultsContainer = document.createElement('div');
        resultsContainer.style.cssText = `
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
        `;

        // Title
        const title = document.createElement('h1');
        title.style.cssText = `
            color: #00ff00;
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 20px;
        `;
        title.textContent = t('practiceComplete');

        // Stats
        const stats = document.createElement('div');
        stats.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 30px 0;
        `;

        const statCards = [
            { label: t('questions'), value: report.totalQuestions, icon: '📝', color: '#00ccff' },
            { label: t('correctCount'), value: report.correct, icon: '✓', color: '#00ff00' },
            { label: t('accuracy'), value: report.accuracy + '%', icon: '🎯', color: '#ffaa00' },
            { label: t('avgTime'), value: report.avgTime + 's', icon: '⏱️', color: '#ff00ff' }
        ];

        UIComponents.renderStatCards(stats, statCards);

        // Weak facts
        if (report.weakFacts && report.weakFacts.length > 0) {
            const weakSection = document.createElement('div');
            weakSection.style.cssText = `
                background: rgba(255, 102, 0, 0.2);
                border: 2px solid #ff6600;
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
            `;
            weakSection.innerHTML = `
                <h3 style="color: #ff6600; margin-bottom: 10px;">${t('practiceThese')}</h3>
                <div style="color: #fff; font-size: 1.2rem;">
                    ${report.weakFacts.join(', ')}
                </div>
            `;
            resultsContainer.appendChild(weakSection);
        }

        // Recommendations
        if (report.recommendations && report.recommendations.length > 0) {
            const recSection = document.createElement('div');
            recSection.style.cssText = `
                background: rgba(0, 255, 0, 0.2);
                border: 2px solid #00ff00;
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
            `;
            recSection.innerHTML = `
                <h3 style="color: #00ff00; margin-bottom: 10px;">${t('recommendations')}</h3>
                <ul style="color: #fff; font-size: 1.1rem; line-height: 1.6;">
                    ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            `;
            resultsContainer.appendChild(recSection);
        }

        // Buttons
        const buttons = document.createElement('div');
        buttons.style.cssText = `
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        `;

        const tryAgainBtn = document.createElement('button');
        tryAgainBtn.textContent = t('practiceAgain');
        tryAgainBtn.style.cssText = `
            padding: 15px 30px;
            font-size: 1.2rem;
            background: linear-gradient(135deg, #00ff00, #00aa00);
            color: #000;
            border: none;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
        `;
        tryAgainBtn.onclick = () => {
            if (this.keyboardHandler) {
                KeyboardHandler.removeHandler(this.keyboardHandler);
            }
            this.container.remove();
            this.start(this.currentTable, this.currentOperation, this.options);
        };

        const doneBtn = document.createElement('button');
        doneBtn.textContent = t('done');
        doneBtn.style.cssText = `
            padding: 15px 30px;
            font-size: 1.2rem;
            background: #00ccff;
            color: #000;
            border: none;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
        `;
        doneBtn.onclick = () => {
            if (this.keyboardHandler) {
                KeyboardHandler.removeHandler(this.keyboardHandler);
            }
            this.container.remove();
        };

        buttons.appendChild(tryAgainBtn);
        buttons.appendChild(doneBtn);

        resultsContainer.appendChild(title);
        resultsContainer.appendChild(stats);
        resultsContainer.appendChild(buttons);

        this.container.appendChild(resultsContainer);
    }
}

// Create global instance
const practiceUI = new PracticeUI();
