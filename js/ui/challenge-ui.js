// KAIJU - Challenge Mode UI
// 1-minute speed challenge

class ChallengeUI {
    constructor() {
        this.container = null;
        this.mode = null;
        this.timeLeft = 60;
        this.timerInterval = null;
        this.startTime = null;
        this.currentEnemy = null;
        this.enemyList = [
            'SPIKEBACK', 'ROCKHORN', 'SKYTALON', 'GRUBLING', 'BOLTBOT',
            'LUNAWING', 'RAZORBEAK', 'SLUDGEMAW', 'FINBACK', 'DRILLHORN',
            'STONELION', 'VINEMAW', 'GRIMAPE', 'TRISTORM',
            'DOOMCLAW', 'RAZORBEAK_X', 'SCARLORD'
        ];
    }

    // Start challenge
    start(tables, timeLimit = 60, operation = 'multiply', includeSubtraction = false, allowOverhang = false, includeThreePart = false) {
        if (typeof challengeMode === 'undefined') {
            alert('Challenge mode not loaded!');
            return;
        }

        this.mode = challengeMode;
        clearInterval(this.timerInterval);
        KeyboardHandler.removeHandler(this.keyboardHandler);
        this.timeLeft = timeLimit;
        this.mode.startChallenge(tables, timeLimit, operation, includeSubtraction, allowOverhang, includeThreePart);

        this.createUI(operation);
        this.showQuestion();
        this.startTimer();
        this.startTime = Date.now();
    }

    createUI(operation) {
        const existing = document.querySelector('.challenge-ui-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'challenge-ui-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #0f0f1e, #1a1a2e);
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
            border-bottom: 3px solid #ffaa00;
        `;
        header.innerHTML = `
            <h1 style="color: #ffaa00; margin: 0; font-size: 2rem;">${t('challengeTitle')}</h1>
            <p style="color: #fff; margin: 5px 0;">${t('challengeDescription')}</p>
        `;

        // Timer display (moved below header to avoid quit button overlap)
        const timerDisplay = document.createElement('div');
        timerDisplay.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
        `;
        timerDisplay.innerHTML = `
            <div style="font-size: 3rem; font-weight: bold; color: #ff6600;" id="challenge-timer">${Math.floor(this.timeLeft / 60)}:${(this.timeLeft % 60).toString().padStart(2, '0')}</div>
            <div style="color: #aaa;">${t('timeLeft')}</div>
        `;

        // Score display
        const scoreDisplay = document.createElement('div');
        scoreDisplay.style.cssText = `
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-bottom: 20px;
        `;
        scoreDisplay.innerHTML = `
            <div style="background: rgba(0, 255, 0, 0.2); border: 2px solid #00ff00; border-radius: 10px; padding: 15px 30px;">
                <div style="font-size: 2rem; font-weight: bold; color: #00ff00;" id="challenge-score">0</div>
                <div style="color: #aaa; font-size: 0.9rem;">${t('score')}</div>
            </div>
            <div style="background: rgba(255, 170, 0, 0.2); border: 2px solid #ffaa00; border-radius: 10px; padding: 15px 30px;">
                <div style="font-size: 2rem; font-weight: bold; color: #ffaa00;" id="challenge-answered">0</div>
                <div style="color: #aaa; font-size: 0.9rem;">${t('answered')}</div>
            </div>
        `;

        // Pick a random enemy for this challenge
        this.currentEnemy = this.enemyList[Math.floor(Math.random() * this.enemyList.length)];
        const enemyImage = this.currentEnemy.replace(/\s+/g, '_').toUpperCase() + '.png';

        // Monster display
        const monsterDisplay = document.createElement('div');
        monsterDisplay.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0;
        `;
        monsterDisplay.innerHTML = `
            <div id="challenge-monster" style="
                width: 200px;
                height: 200px;
                background-image: url('images/enemies/${enemyImage}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                animation: float 3s ease-in-out infinite;
                filter: drop-shadow(0 0 30px rgba(255, 170, 0, 0.6));
            "></div>
            <style>
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            </style>
        `;

        // Question
        const questionContainer = document.createElement('div');
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

        const question = document.createElement('div');
        question.id = 'challenge-question';
        question.style.cssText = `
            font-size: 3.5rem;
            font-weight: bold;
            color: #fff;
            text-align: center;
            margin-bottom: 30px;
            text-shadow: 0 0 20px rgba(255, 170, 0, 0.5);
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            border-radius: 15px;
            border: 3px solid #ffaa00;
        `;
        question.textContent = '? × ? = ?';

        // Current answer display
        const currentAnswerDisplay = document.createElement('div');
        currentAnswerDisplay.style.cssText = `
            margin-bottom: 20px;
            text-align: center;
        `;
        currentAnswerDisplay.innerHTML = `
            <span style="color: #ffaa00; font-size: 1.2rem; font-weight: bold;">${t('yourAnswer')}</span>
            <span id="challenge-current-answer" style="color: #fff; font-size: 2.5rem; font-weight: bold; margin-left: 10px;">?</span>
        `;

        // Number pad grid (battle-style) - using UIComponents utility
        const { numberPad, clearBtn, submitBtn, numberButtons } = UIComponents.createNumberPad('challenge', t('check'));

        const feedback = document.createElement('div');
        feedback.id = 'challenge-feedback';
        feedback.style.cssText = `
            margin-top: 20px;
            font-size: 1.3rem;
            text-align: center;
            min-height: 40px;
        `;

        // Quit button
        const quitBtn = document.createElement('button');
        quitBtn.textContent = t('quit');
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
            z-index: 10001;
        `;

        questionContainer.appendChild(question);
        questionContainer.appendChild(currentAnswerDisplay);
        questionContainer.appendChild(numberPad);
        questionContainer.appendChild(feedback);

        overlay.appendChild(quitBtn);
        overlay.appendChild(header);
        overlay.appendChild(timerDisplay);
        overlay.appendChild(scoreDisplay);
        overlay.appendChild(monsterDisplay);
        overlay.appendChild(questionContainer);

        document.body.appendChild(overlay);
        this.container = overlay;

        // Initialize current answer storage
        this.currentAnswer = '';

        // Event listeners for number pad
        numberButtons.forEach(btn => {
            btn.onclick = () => {
                if (!this.mode.active || this.currentAnswer.length >= 3) return;
                const num = btn.dataset.number;
                this.currentAnswer += num;
                document.getElementById('challenge-current-answer').textContent = this.currentAnswer || '?';
            };
        });

        clearBtn.onclick = () => {
            this.currentAnswer = this.currentAnswer.slice(0, -1);
            document.getElementById('challenge-current-answer').textContent = this.currentAnswer || '?';
        };

        submitBtn.onclick = () => this.checkAnswer();

        // Quit button
        quitBtn.onclick = () => {
            UIComponents.confirm(t('quitChallengePrompt'), () => {
                clearInterval(this.timerInterval);
                this.mode.active = false;
                if (this.keyboardHandler) {
                    KeyboardHandler.removeHandler(this.keyboardHandler);
                }
                this.container.remove();
            });
        };

        // Keyboard support (numpad and regular numbers) - using KeyboardHandler utility
        this.keyboardHandler = KeyboardHandler.createHandler(
            this,
            'challenge-current-answer',
            () => this.checkAnswer(),
            () => this.mode.active
        );
        KeyboardHandler.addHandler(this.keyboardHandler);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft = Math.ceil(this.mode.getTimeRemaining());
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            const timerEl = document.getElementById('challenge-timer');
            if (timerEl) {
                timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                if (this.timeLeft <= 10) {
                    timerEl.style.color = '#ff0000';
                }
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.endChallenge();
            }
        }, 1000);
    }

    showQuestion() {
        const q = this.mode.currentQuestion;
        if (!q) {
            console.error('No current question available');
            return;
        }

        const questionEl = document.getElementById('challenge-question');
        const currentAnswerEl = document.getElementById('challenge-current-answer');

        // Update question - check if it's a 3-part question
        if (q.isThreePart && q.num3 !== undefined) {
            // 3-part question: x + y + z or x - y + z
            let operator1 = q.isSubtraction ? '-' : '+';
            questionEl.textContent = `${q.num1} ${operator1} ${q.num2} + ${q.num3} = ?`;
        } else {
            // Regular 2-part question
            let operator = '×';
            if (q.operation === 'add') operator = '+';
            else if (q.operation === 'subtract') operator = '-';
            else if (q.operation === 'multiply') operator = '×';
            else if (this.mode.operation === 'add') operator = '+';

            questionEl.textContent = `${q.num1} ${operator} ${q.num2} = ?`;
        }

        this.currentAnswer = '';
        if (currentAnswerEl) currentAnswerEl.textContent = '?';
    }

    checkAnswer() {
        if (!this.mode.active) return;
        if (this.mode.isTimeUp()) {
            this.endChallenge();
            return;
        }
        const userAnswer = parseInt(this.currentAnswer);

        if (isNaN(userAnswer)) return;

        const timeSpent = (Date.now() - this.startTime) / 1000;
        // Capture the question being answered BEFORE checkAnswer advances currentQuestion
        // to the next one — otherwise the "correct answer" shown on a miss is wrong.
        const answeredQuestion = this.mode.currentQuestion;
        const result = this.mode.checkAnswer(userAnswer, timeSpent);

        // Update score
        document.getElementById('challenge-score').textContent = this.mode.score;
        document.getElementById('challenge-answered').textContent = this.mode.questionsAnswered;

        // Show feedback
        const feedback = document.getElementById('challenge-feedback');
        const monsterEl = document.getElementById('challenge-monster');

        if (result.correct) {
            feedback.style.color = '#00ff00';
            feedback.textContent = t('correctFeedback') + ' +' + result.points;
            feedback.style.fontSize = '1.5rem';

            // Monster celebrates
            if (monsterEl) {
                monsterEl.style.transform = 'scale(1.2) rotate(10deg)';
                setTimeout(() => {
                    monsterEl.style.transform = 'scale(1)';
                }, 300);
            }
        } else {
            feedback.style.color = '#ff0000';
            feedback.textContent = tFormat('wrongFeedback', null, answeredQuestion.answer) + ' (' + result.points + ')';
            feedback.style.fontSize = '1.3rem';

            // Monster gets angry
            if (monsterEl) {
                monsterEl.style.transform = 'scale(0.9) rotate(-10deg)';
                setTimeout(() => {
                    monsterEl.style.transform = 'scale(1)';
                }, 300);
            }
        }

        setTimeout(() => {
            if (feedback) {
                feedback.textContent = '';
                feedback.style.fontSize = '1.3rem';
            }
        }, 800);

        this.showQuestion();
        this.startTime = Date.now();
    }

    endChallenge() {
        if (!this.mode.active) return;
        clearInterval(this.timerInterval);

        // Remove keyboard event listener
        if (this.keyboardHandler) {
            KeyboardHandler.removeHandler(this.keyboardHandler);
        }

        const finalScore = this.mode.endChallenge();

        // Save to local highscores and get the entry that was just added
        const saveResult = this.saveHighscore(finalScore);
        const isNewHighscore = saveResult.isNewRecord;
        this.lastAddedTimestamp = saveResult.timestamp;

        this.container.innerHTML = '';

        const results = document.createElement('div');
        results.style.cssText = `
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
        `;

        results.innerHTML = `
            <h1 style="color: #ffaa00; text-align: center; font-size: 2.5rem; margin-bottom: 30px;">
                ${t('challengeComplete')} ${isNewHighscore ? t('newRecord') : ''}
            </h1>
            ${isNewHighscore ? `<div style="text-align: center; color: #ffd700; font-size: 1.5rem; margin-bottom: 20px; animation: pulse 1s infinite;">⭐ ${t('personalBest')} ⭐</div>` : ''}
            <style>
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
            </style>
        `;

        const stats = document.createElement('div');
        stats.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 30px 0;
        `;

        const statCards = [
            { label: t('score'), value: finalScore.score, icon: '🏆', color: '#ffd700' },
            { label: t('answered'), value: finalScore.questionsAnswered, icon: '📝', color: '#00ccff' },
            { label: t('correctCount'), value: finalScore.correctAnswers, icon: '✓', color: '#00ff00' },
            { label: t('accuracy'), value: finalScore.accuracy + '%', icon: '🎯', color: '#ffaa00' }
        ];

        UIComponents.renderStatCards(stats, statCards);

        const buttons = document.createElement('div');
        buttons.style.cssText = `
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        `;

        const tryAgainBtn = document.createElement('button');
        tryAgainBtn.textContent = t('tryAgain');
        tryAgainBtn.style.cssText = `
            padding: 15px 30px;
            font-size: 1.2rem;
            background: linear-gradient(135deg, #ffaa00, #ff6600);
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
            // Restart with same tables
            showGameModesSelector();
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

        results.appendChild(stats);

        // Add highscore leaderboard with toggle
        const leaderboard = this.createLeaderboard();
        if (leaderboard) {
            results.appendChild(leaderboard);
        }

        // Add question breakdown
        if (finalScore.answerLog && finalScore.answerLog.length > 0) {
            const questionBreakdown = this.createQuestionBreakdown(finalScore.answerLog);
            results.appendChild(questionBreakdown);
        }

        // Add buttons at the bottom
        results.appendChild(buttons);

        this.container.appendChild(results);
    }

    // Save highscore and return if it's a new record
    saveHighscore(score) {
        const highscores = this.getHighscores();
        const playerName = typeof playerProfile !== 'undefined' ? playerProfile.name : 'Player';

        const timestamp = Date.now();
        const newEntry = {
            name: playerName,
            score: score.score,
            accuracy: score.accuracy,
            answered: score.questionsAnswered,
            timestamp: timestamp,
            date: new Date().toISOString()
        };

        // Check if this is a new personal record BEFORE adding the new score
        let isNewRecord = false;
        if (typeof playerProfile !== 'undefined') {
            if (!playerProfile.challengeScores) {
                playerProfile.challengeScores = [];
            }
            const previousBest = playerProfile.challengeScores.length > 0 ? playerProfile.challengeScores[0].score : 0;
            isNewRecord = playerProfile.challengeScores.length === 0 || score.score > previousBest;
        }

        highscores.push(newEntry);
        highscores.sort((a, b) => b.score - a.score);
        highscores.splice(10); // Keep top 10

        StorageUtils.write('challengeHighscores', highscores);

        // Save to player profile
        if (typeof playerProfile !== 'undefined') {
            playerProfile.challengeScores.push(newEntry);
            playerProfile.challengeScores.sort((a, b) => b.score - a.score);
            // Keep top 20 personal scores
            if (playerProfile.challengeScores.length > 20) {
                playerProfile.challengeScores = playerProfile.challengeScores.slice(0, 20);
            }
            if (typeof saveCurrentProfile === 'function') {
                saveCurrentProfile();
            } else {
                console.error('❌ saveCurrentProfile function not available!');
            }
        } else {
            console.error('❌ playerProfile not defined when saving challenge score!');
        }

        return { isNewRecord, timestamp };
    }

    getHighscores() {
        return StorageUtils.read('challengeHighscores', () => [], value =>
            Array.isArray(value) && value.every(entry => StorageUtils.isRecord(entry) && Number.isFinite(entry.score))
        );
    }

    createLeaderboard() {
        const globalHighscores = this.getHighscores();
        const personalHighscores = typeof playerProfile !== 'undefined' && playerProfile.challengeScores ?
                                    playerProfile.challengeScores.slice(0, 10) : [];

        if (globalHighscores.length === 0 && personalHighscores.length === 0) return null;

        // Use the timestamp we saved when adding the score
        const justAddedTimestamp = this.lastAddedTimestamp;

        const leaderboard = document.createElement('div');
        leaderboard.style.cssText = `
            margin-top: 30px;
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #ffd700;
            border-radius: 15px;
            padding: 20px;
        `;

        const toggleBtns = document.createElement('div');
        toggleBtns.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-bottom: 15px;
        `;

        const personalBtn = document.createElement('button');
        personalBtn.textContent = '👤 Personal';
        personalBtn.style.cssText = `
            padding: 10px 20px;
            background: #ffaa00;
            color: #000;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
        `;

        const globalBtn = document.createElement('button');
        globalBtn.textContent = '🌍 Global';
        globalBtn.style.cssText = `
            padding: 10px 20px;
            background: rgba(255, 170, 0, 0.3);
            color: #fff;
            border: 2px solid #ffaa00;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
        `;

        const title = document.createElement('h2');
        title.style.cssText = 'color: #ffd700; text-align: center; margin-bottom: 15px;';
        title.textContent = '🏆 Top 10 Highscores (Personal)';

        const scoreList = document.createElement('div');
        scoreList.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

        const renderScores = (scores, isPersonal) => {
            title.textContent = `🏆 Top 10 Highscores (${isPersonal ? 'Personal' : 'Global'})`;

            // Find player's position if outside top 10
            const playerPosition = scores.findIndex(entry => entry.timestamp === justAddedTimestamp);
            const playerEntry = playerPosition >= 0 ? scores[playerPosition] : null;
            const showPlayerPosition = playerEntry && playerPosition >= 10;

            // Generate top 10
            const top10HTML = scores.slice(0, 10).map((entry, index) => {
                const isCurrentRun = entry.timestamp === justAddedTimestamp;
                return `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    background: ${isCurrentRun ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 215, 0, 0.05)'};
                    border-radius: 8px;
                    border-left: 3px solid ${isCurrentRun ? '#ffaa00' : index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#666'};
                    border: ${isCurrentRun ? '2px solid #ffaa00' : 'none'};
                ">
                    <span style="color: ${index === 0 ? '#ffd700' : '#fff'}; font-weight: bold; width: 30px;">
                        ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <span style="color: #fff; flex: 1;">${UIComponents.escapeHtml(entry.name)}${isCurrentRun ? ' ⬅️' : ''}</span>
                    <span style="color: #ffd700; font-weight: bold; margin-right: 10px;">${entry.score}</span>
                </div>
                `;
            }).join('');

            // Add player's position if outside top 10
            let playerPositionHTML = '';
            if (showPlayerPosition) {
                playerPositionHTML = `
                <div style="color: #666; text-align: center; margin: 10px 0; font-size: 0.9rem;">...</div>
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    background: rgba(255, 215, 0, 0.3);
                    border-radius: 8px;
                    border: 2px solid #ffaa00;
                ">
                    <span style="color: #fff; font-weight: bold; width: 30px;">#${playerPosition + 1}</span>
                    <span style="color: #fff; flex: 1;">${UIComponents.escapeHtml(playerEntry.name)} ⬅️</span>
                    <span style="color: #ffd700; font-weight: bold; margin-right: 10px;">${playerEntry.score}</span>
                </div>
                `;
            }

            scoreList.innerHTML = top10HTML + playerPositionHTML;

            personalBtn.style.background = isPersonal ? '#ffaa00' : 'rgba(255, 170, 0, 0.3)';
            personalBtn.style.color = isPersonal ? '#000' : '#fff';
            personalBtn.style.border = isPersonal ? 'none' : '2px solid #ffaa00';

            globalBtn.style.background = !isPersonal ? '#ffaa00' : 'rgba(255, 170, 0, 0.3)';
            globalBtn.style.color = !isPersonal ? '#000' : '#fff';
            globalBtn.style.border = !isPersonal ? 'none' : '2px solid #ffaa00';
        };

        personalBtn.onclick = () => renderScores(personalHighscores, true);
        globalBtn.onclick = () => renderScores(globalHighscores, false);

        toggleBtns.appendChild(personalBtn);
        toggleBtns.appendChild(globalBtn);

        leaderboard.appendChild(toggleBtns);
        leaderboard.appendChild(title);
        leaderboard.appendChild(scoreList);

        // Start with personal view
        renderScores(personalHighscores, true);

        return leaderboard;
    }

    createQuestionBreakdown(answerLog) {
        const breakdown = document.createElement('div');
        breakdown.style.cssText = `
            margin-top: 30px;
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #00ff00;
            border-radius: 15px;
            padding: 20px;
        `;

        breakdown.innerHTML = `
            <h2 style="color: #00ff00; text-align: center; margin-bottom: 15px;">${t('questionBreakdown')}</h2>
        `;

        const questionList = document.createElement('div');
        questionList.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        answerLog.forEach((entry, index) => {
            const q = entry.question;
            let questionText;

            // Format question based on operation type
            if (q.isThreePart) {
                const operator1 = q.isSubtraction ? '-' : '+';
                questionText = `${q.num1} ${operator1} ${q.num2} + ${q.num3}`;
            } else {
                let operator = '×';
                if (q.operation === 'add') operator = '+';
                else if (q.operation === 'subtract') operator = '-';
                questionText = `${q.num1} ${operator} ${q.num2}`;
            }

            const questionItem = document.createElement('div');
            questionItem.style.cssText = `
                background: ${entry.correct ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 0, 0, 0.05)'};
                border-left: 3px solid ${entry.correct ? '#00ff00' : '#ff0000'};
                padding: 10px;
                border-radius: 5px;
            `;

            questionItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div style="flex: 1;">
                        <span style="color: #666; font-size: 0.9rem;">#${index + 1}</span>
                        <span style="color: #fff; font-size: 1.1rem; margin-left: 10px;">${questionText} = ?</span>
                    </div>
                    <div style="display: flex; gap: 15px; font-size: 0.9rem; align-items: center;">
                        <div>
                            <span style="color: #aaa;">${t('yourAnswer')}</span>
                            <span style="color: ${entry.correct ? '#00ff00' : '#ff0000'}; font-weight: bold; margin-left: 5px;">${entry.userAnswer}</span>
                        </div>
                        ${!entry.correct ? `<div>
                            <span style="color: #aaa;">${t('correctCount')}</span>
                            <span style="color: #00ff00; font-weight: bold; margin-left: 5px;">${q.answer}</span>
                        </div>` : ''}
                        <div>
                            <span style="color: #aaa;">${t('timeLabel')}</span>
                            <span style="color: #ffaa00; font-weight: bold; margin-left: 5px;">${entry.timeSpent.toFixed(1)}s</span>
                        </div>
                        ${entry.pointsEarned !== 0 ? `<div>
                            <span style="color: #aaa;">${t('pointsLabel')}</span>
                            <span style="color: ${entry.pointsEarned > 0 ? '#ffd700' : '#ff0000'}; font-weight: bold; margin-left: 5px;">${entry.pointsEarned > 0 ? '+' : ''}${entry.pointsEarned}</span>
                        </div>` : ''}
                    </div>
                </div>
            `;

            questionList.appendChild(questionItem);
        });

        breakdown.appendChild(questionList);
        return breakdown;
    }
}

const challengeUI = new ChallengeUI();
