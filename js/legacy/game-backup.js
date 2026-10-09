// Current Profile
let currentProfileName = null;

// Player Profile Template
const createNewProfile = (name) => ({
    name: name,
    level: 1,
    totalPower: 0,
    xp: 0,
    gamesPlayed: 0,
    evolutionStage: 0,
    battleHistory: []
});

let playerProfile = createNewProfile('Player');

// Evolution stages - 17 total levels (slower, more challenging progression)
const evolutionStages = [
    { name: 'EGG', xpNeeded: 0, size: 0.8 },
    { name: 'HATCHING', xpNeeded: 80, size: 0.85 },
    { name: 'NEWBORN', xpNeeded: 180, size: 0.9 },
    { name: 'BABY GODZILLA', xpNeeded: 320, size: 1 },
    { name: 'YOUNG GODZILLA', xpNeeded: 500, size: 1.05 },
    { name: 'JUVENILE', xpNeeded: 750, size: 1.1 },
    { name: 'TEENAGE GODZILLA', xpNeeded: 1100, size: 1.2 },
    { name: 'ADULT GODZILLA', xpNeeded: 1600, size: 1.3 },
    { name: 'PRIME GODZILLA', xpNeeded: 2300, size: 1.4 },
    { name: 'BURNING GODZILLA', xpNeeded: 3300, size: 1.5 },
    { name: 'INFERNO GODZILLA', xpNeeded: 4700, size: 1.55 },
    { name: 'FIRE KING', xpNeeded: 6500, size: 1.6 },
    { name: 'ICE GODZILLA', xpNeeded: 9000, size: 1.65 },
    { name: 'FROST TITAN', xpNeeded: 12500, size: 1.7 },
    { name: 'KING GODZILLA', xpNeeded: 17000, size: 1.75 },
    { name: 'COSMIC EMPEROR', xpNeeded: 23000, size: 1.8 },
    { name: 'GOD GODZILLA', xpNeeded: 30000, size: 2.0 }
];

// Game State
const gameState = {
    selectedTables: [],
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    currentAnswer: '',
    startTime: null,
    answerTimes: [],
    timerInterval: null,
    timeLeft: 10,
    currentCorrectAnswer: null,
    currentQuestionDifficulty: 1,
    // Battle system
    playerHP: 100,
    playerMaxHP: 100,
    enemyHP: 100,
    enemyMaxHP: 100,
    currentEnemy: null,
    battleActive: false,
    totalDamageDealt: 0,
    // Combo system
    comboCount: 0,
    superchargeActive: false,
    // Battle log
    battleStartTime: null,
    questionLog: []
};

// Enemy Kaiju templates (for random generation)
const enemyTemplates = [
    { name: 'RODAN', emoji: '🦅' },
    { name: 'MOTHRA', emoji: '🦋' },
    { name: 'ANGUIRUS', emoji: '🦔' },
    { name: 'KING GHIDORAH', emoji: '🐲' },
    { name: 'MECHAGODZILLA', emoji: '🤖' },
    { name: 'DESTROYAH', emoji: '👹' },
    { name: 'BIOLLANTE', emoji: '🌿' },
    { name: 'GIGAN', emoji: '⚔️' },
    { name: 'BARAGON', emoji: '🦖' },
    { name: 'HEDORAH', emoji: '☠️' },
    { name: 'TITANOSAURUS', emoji: '🦕' },
    { name: 'SPACE GODZILLA', emoji: '💎' }
];

// Generate enemy based on player level
function generateEnemy(playerLevel) {
    const template = enemyTemplates[Math.floor(Math.random() * enemyTemplates.length)];
    const levelVariance = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
    const enemyLevel = Math.max(1, playerLevel + levelVariance);

    return {
        name: template.name,
        emoji: template.emoji,
        level: enemyLevel,
        hp: 60 + (enemyLevel * 15) + Math.floor(Math.random() * 20),
        damageMultiplier: 0.8 + (enemyLevel * 0.1)
    };
}

// DOM Elements
const screens = {
    profile: document.getElementById('profile-screen'),
    start: document.getElementById('start-screen'),
    battleIntro: document.getElementById('battle-intro-screen'),
    battle: document.getElementById('battle-screen'),
    results: document.getElementById('results-screen'),
    history: document.getElementById('history-screen'),
    battleDetail: document.getElementById('battle-detail-screen')
};

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    initProfileScreen();
    initStartScreen();
    initBattleIntroScreen();
    initBattleScreen();
    initResultsScreen();
    initHistoryScreen();

    // Load last used profile or show profile selection
    const lastProfile = localStorage.getItem('lastProfile');
    const profiles = getAllProfileNames();

    if (lastProfile && profiles.includes(lastProfile)) {
        loadProfile(lastProfile);
        updateProfileDisplay();
        switchScreen('start');
    } else if (profiles.length > 0) {
        renderProfileList();
        switchScreen('profile');
    } else {
        switchScreen('profile');
    }
});

// Profile Management
function loadProfiles() {
    const saved = localStorage.getItem('kaijuProfiles');
    if (saved) {
        return JSON.parse(saved);
    }
    return {};
}

function saveProfiles(profiles) {
    localStorage.setItem('kaijuProfiles', JSON.stringify(profiles));
}

function loadProfile(profileName) {
    const profiles = loadProfiles();
    if (profiles[profileName]) {
        playerProfile = profiles[profileName];
        currentProfileName = profileName;
    } else {
        playerProfile = createNewProfile(profileName);
        currentProfileName = profileName;
        saveCurrentProfile();
    }
    // Remember last profile
    localStorage.setItem('lastProfile', profileName);
}

function saveCurrentProfile() {
    const profiles = loadProfiles();
    profiles[currentProfileName] = playerProfile;
    saveProfiles(profiles);
}

function getAllProfileNames() {
    const profiles = loadProfiles();
    return Object.keys(profiles);
}

function updateProfileDisplay() {
    // Update level and power
    document.getElementById('player-level').textContent = playerProfile.level;
    document.getElementById('total-power').textContent = playerProfile.totalPower;

    // Get current evolution stage
    let currentStage = 0;
    for (let i = evolutionStages.length - 1; i >= 0; i--) {
        if (playerProfile.xp >= evolutionStages[i].xpNeeded) {
            currentStage = i;
            break;
        }
    }
    playerProfile.evolutionStage = currentStage;

    // Update evolution display
    const stage = evolutionStages[currentStage];
    document.getElementById('evolution-stage').textContent = stage.name;

    // Update Godzilla size and visual stage based on evolution
    const godzillaSprite = document.getElementById('start-godzilla');
    godzillaSprite.style.transform = `scale(${stage.size})`;

    // Remove old stage classes and add new one
    godzillaSprite.className = 'godzilla-sprite';
    godzillaSprite.classList.add(`stage-${currentStage}`);

    // Update XP bar
    const nextStageIndex = Math.min(currentStage + 1, evolutionStages.length - 1);
    const currentXP = playerProfile.xp;
    const currentStageXP = evolutionStages[currentStage].xpNeeded;
    const nextStageXP = evolutionStages[nextStageIndex].xpNeeded;
    const xpProgress = currentXP - currentStageXP;
    const xpNeeded = nextStageXP - currentStageXP;

    document.getElementById('current-xp').textContent = xpProgress;
    document.getElementById('needed-xp').textContent = xpNeeded;

    const percentage = (xpProgress / xpNeeded) * 100;
    document.getElementById('level-fill').style.width = Math.min(100, percentage) + '%';
}

// Profile Screen Logic
function initProfileScreen() {
    renderProfileList();

    document.getElementById('create-profile-btn').addEventListener('click', () => {
        const nameInput = document.getElementById('new-profile-name');
        const name = nameInput.value.trim();

        if (name && name.length > 0) {
            loadProfile(name);
            updateProfileDisplay();
            nameInput.value = '';
            switchScreen('start');
        } else {
            alert('Please enter a profile name');
        }
    });

    // Allow Enter key to create profile
    document.getElementById('new-profile-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('create-profile-btn').click();
        }
    });
}

function renderProfileList() {
    const profileList = document.getElementById('profile-list');
    const profiles = getAllProfileNames();

    profileList.innerHTML = '';

    if (profiles.length === 0) {
        profileList.innerHTML = '<p class="no-profiles">No profiles yet. Create one below!</p>';
        return;
    }

    profiles.forEach(name => {
        const btn = document.createElement('button');
        btn.className = 'profile-btn';
        btn.textContent = name;

        // Touch and mouse support
        btn.addEventListener('click', () => {
            loadProfile(name);
            updateProfileDisplay();
            switchScreen('start');
        });

        profileList.appendChild(btn);
    });
}

// Start Screen Logic
function initStartScreen() {
    const tableBtns = document.querySelectorAll('.table-btn');
    const selectAllBtn = document.querySelector('.select-all-btn');
    const startBtn = document.getElementById('start-battle-btn');

    tableBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
            updateSelectedTables();
        });
    });

    selectAllBtn.addEventListener('click', () => {
        const allSelected = gameState.selectedTables.length === 20;
        tableBtns.forEach(btn => {
            if (allSelected) {
                btn.classList.remove('selected');
            } else {
                btn.classList.add('selected');
            }
        });
        updateSelectedTables();
    });

    startBtn.addEventListener('click', () => {
        if (gameState.selectedTables.length > 0) {
            startGame();
        }
    });

    document.getElementById('view-history-btn').addEventListener('click', () => {
        showBattleHistory();
    });

    document.getElementById('change-profile-btn').addEventListener('click', () => {
        renderProfileList();
        switchScreen('profile');
    });
}

function updateSelectedTables() {
    const selectedBtns = document.querySelectorAll('.table-btn.selected');
    gameState.selectedTables = Array.from(selectedBtns).map(btn => parseInt(btn.dataset.table));

    const selectAllBtn = document.querySelector('.select-all-btn');
    if (gameState.selectedTables.length === 20) {
        selectAllBtn.textContent = 'DESELECT ALL';
    } else {
        selectAllBtn.textContent = 'SELECT ALL TABLES';
    }

    const startBtn = document.getElementById('start-battle-btn');
    if (gameState.selectedTables.length > 0) {
        startBtn.classList.remove('disabled');
    } else {
        startBtn.classList.add('disabled');
    }
}

// Calculate question difficulty (0x and 1x are easy, 7x-9x are hard)
function getQuestionDifficulty(num1, num2) {
    const table = Math.max(num1, num2);
    const multiplier = Math.min(num1, num2);

    let difficulty = 1.0;

    // Easy multipliers (0, 1, 10)
    if (multiplier === 0 || multiplier === 1 || multiplier === 10) {
        difficulty *= 0.5;
    }
    // Medium multipliers (2, 5)
    else if (multiplier === 2 || multiplier === 5) {
        difficulty *= 0.8;
    }
    // Hard multipliers (7, 8, 9)
    else if (multiplier >= 7) {
        difficulty *= 1.3;
    }

    // Table difficulty
    if (table <= 3) difficulty *= 0.8;
    else if (table >= 7) difficulty *= 1.2;

    return difficulty;
}

function generateQuestions() {
    const questions = [];

    // Generate 20 questions per table (double pass through 1-10)
    gameState.selectedTables.forEach(table => {
        for (let pass = 0; pass < 2; pass++) {
            for (let i = 1; i <= 10; i++) {
                questions.push({
                    num1: table,
                    num2: i,
                    answer: table * i,
                    difficulty: getQuestionDifficulty(table, i)
                });
            }
        }
    });

    // Shuffle questions
    return questions.sort(() => Math.random() - 0.5);
}

// Battle Screen Logic
function initBattleScreen() {
    const answerBtns = document.querySelectorAll('.answer-btn[data-answer]');
    const clearBtn = document.getElementById('clear-btn');
    const submitBtn = document.getElementById('submit-btn');
    const specialBtn = document.getElementById('special-attack-btn');

    answerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleNumberInput(btn.dataset.answer);
        });
    });

    clearBtn.addEventListener('click', () => {
        // Delete last digit only
        gameState.currentAnswer = gameState.currentAnswer.slice(0, -1);
        updateAnswerDisplay();
    });

    submitBtn.addEventListener('click', () => {
        if (gameState.currentAnswer && gameState.battleActive) {
            checkAnswer();
        }
    });

    specialBtn.addEventListener('click', () => {
        if (gameState.superchargeActive && gameState.battleActive) {
            executeSpecialAttack();
        }
    });

    // Keyboard support (numpad and regular numbers)
    document.addEventListener('keydown', (e) => {
        if (!gameState.battleActive) return;

        // Number keys (both top row and numpad)
        if ((e.key >= '0' && e.key <= '9') || (e.keyCode >= 96 && e.keyCode <= 105)) {
            e.preventDefault();
            const num = e.key;
            handleNumberInput(num);
        }
        // Enter to submit
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (gameState.currentAnswer) {
                checkAnswer();
            }
        }
        // Backspace to delete last digit
        else if (e.key === 'Backspace') {
            e.preventDefault();
            gameState.currentAnswer = gameState.currentAnswer.slice(0, -1);
            updateAnswerDisplay();
        }
        // Delete to clear all
        else if (e.key === 'Delete' || e.key === 'Escape') {
            e.preventDefault();
            gameState.currentAnswer = '';
            updateAnswerDisplay();
        }
    });
}

function executeSpecialAttack() {
    clearInterval(gameState.timerInterval);
    gameState.superchargeActive = false;
    gameState.comboCount = 0;

    // Massive damage!
    const specialDamage = Math.floor(gameState.enemyMaxHP * 0.4); // 40% of enemy max HP
    gameState.enemyHP = Math.max(0, gameState.enemyHP - specialDamage);
    gameState.totalDamageDealt += specialDamage;
    gameState.score += specialDamage;

    showBattleMessage(`⚡ ATOMIC BREATH! ⚡`, 'supercharge');
    showDamageNumber(specialDamage, 'player');
    playAttackAnimation('player');

    updateHPDisplay();
    updateComboDisplay();

    setTimeout(() => {
        if (gameState.enemyHP <= 0) {
            gameState.battleActive = false;
            endGame();
        } else {
            gameState.currentQuestionIndex++;
            showQuestion();
        }
    }, 2000);
}

function handleNumberInput(num) {
    if (gameState.currentAnswer.length < 3) {
        gameState.currentAnswer += num;
        updateAnswerDisplay();
    }
}

function updateAnswerDisplay() {
    document.getElementById('current-answer').textContent = gameState.currentAnswer || '?';
}

function startGame() {
    // Reset game state
    gameState.questions = generateQuestions();
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.correctAnswers = 0;
    gameState.totalAnswers = 0;
    gameState.answerTimes = [];
    gameState.totalDamageDealt = 0;
    gameState.battleActive = true;
    gameState.comboCount = 0;
    gameState.superchargeActive = false;
    gameState.questionLog = [];
    gameState.battleStartTime = Date.now();

    // Generate enemy based on player level
    gameState.currentEnemy = generateEnemy(playerProfile.level);

    // Set HP based on player level and enemy
    gameState.playerMaxHP = 100 + (playerProfile.level * 10);
    gameState.playerHP = gameState.playerMaxHP;
    gameState.enemyMaxHP = gameState.currentEnemy.hp;
    gameState.enemyHP = gameState.enemyMaxHP;

    // Show battle intro
    showBattleIntro();
}

function showBattleIntro() {
    const enemy = gameState.currentEnemy;

    document.getElementById('intro-enemy-name').textContent = enemy.name;
    document.getElementById('intro-enemy-hp').textContent = gameState.enemyMaxHP;
    document.getElementById('intro-enemy-level').textContent = enemy.level;

    // Set enemy sprite
    const spriteEl = document.getElementById('intro-enemy-sprite');
    spriteEl.innerHTML = '';
    const emojiEl = document.createElement('div');
    emojiEl.className = 'enemy-emoji';
    emojiEl.textContent = enemy.emoji;
    spriteEl.appendChild(emojiEl);

    switchScreen('battleIntro');
}

function initBattleIntroScreen() {
    document.getElementById('begin-battle-btn').addEventListener('click', () => {
        switchScreen('battle');
        setTimeout(() => showQuestion(), 500);
    });
}

function showQuestion() {
    // Check if battle is over
    if (gameState.playerHP <= 0 || gameState.enemyHP <= 0) {
        endGame();
        return;
    }

    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        // If we run out of questions, generate more
        const newQuestions = generateQuestions();
        gameState.questions.push(...newQuestions);
    }

    const question = gameState.questions[gameState.currentQuestionIndex];
    gameState.currentCorrectAnswer = question.answer;
    gameState.currentQuestionDifficulty = question.difficulty;
    gameState.currentAnswer = '';
    gameState.timeLeft = 10;
    gameState.startTime = Date.now();

    // Update UI
    document.getElementById('question').textContent = `${question.num1} × ${question.num2} = ?`;
    updateAnswerDisplay();
    updateHPDisplay();
    updateComboDisplay();

    // Set enemy name and sprite
    const enemy = gameState.currentEnemy;
    document.getElementById('enemy-name').textContent = enemy.name;

    const enemySpriteEl = document.getElementById('enemy-sprite');
    enemySpriteEl.innerHTML = '';
    const emojiEl = document.createElement('div');
    emojiEl.className = 'battle-emoji';
    emojiEl.textContent = enemy.emoji;
    enemySpriteEl.appendChild(emojiEl);

    // Update player sprite with evolution stage
    const playerSprite = document.getElementById('player-sprite');
    playerSprite.className = 'kaiju-sprite godzilla battle-sprite';
    playerSprite.classList.add(`stage-${playerProfile.evolutionStage}`);

    // Start timer
    startTimer();
}

function startTimer() {
    clearInterval(gameState.timerInterval);

    const timerFill = document.getElementById('timer-fill');
    const timerSeconds = document.getElementById('timer-seconds');
    timerFill.style.width = '100%';
    timerFill.classList.remove('warning', 'danger');

    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft -= 0.1;
        const percentage = (gameState.timeLeft / 10) * 100;
        timerFill.style.width = percentage + '%';
        timerSeconds.textContent = Math.ceil(gameState.timeLeft);

        if (percentage < 30) {
            timerFill.classList.add('danger');
        } else if (percentage < 60) {
            timerFill.classList.add('warning');
        }

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            handleTimeout();
        }
    }, 100);
}

function checkAnswer() {
    if (!gameState.battleActive) return;

    clearInterval(gameState.timerInterval);

    const userAnswer = parseInt(gameState.currentAnswer);
    const timeSpent = (Date.now() - gameState.startTime) / 1000;
    const isCorrect = userAnswer === gameState.currentCorrectAnswer;
    const question = gameState.questions[gameState.currentQuestionIndex];

    gameState.totalAnswers++;
    gameState.answerTimes.push(timeSpent);

    // Log question
    gameState.questionLog.push({
        question: `${question.num1} × ${question.num2}`,
        correctAnswer: gameState.currentCorrectAnswer,
        userAnswer: userAnswer,
        timeSpent: timeSpent,
        correct: isCorrect
    });

    if (isCorrect) {
        gameState.correctAnswers++;

        // Check if answer was fast (under 5 seconds)
        const isFast = timeSpent < 5;

        // Update combo
        if (isFast) {
            gameState.comboCount++;
            if (gameState.comboCount >= 10 && !gameState.superchargeActive) {
                gameState.superchargeActive = true;
                showBattleMessage(`⚡ SUPERCHARGE ACTIVATED! ⚡`, 'supercharge');
                setTimeout(() => {
                    showBattleMessage(`PRESS SPECIAL ATTACK!`, 'supercharge');
                }, 1000);
                return; // Wait for special attack
            }
        } else {
            gameState.comboCount = 0;
        }

        // Calculate damage with difficulty multiplier and time reduction
        const baseDamage = 15 + Math.floor(Math.random() * 16);

        // Exponential time multiplier: Full damage for fast answers, exponentially decreasing for slow ones
        // At 0s: 1.0, at 3s: ~0.95, at 5s: ~0.85, at 7s: ~0.65, at 10s: ~0.35
        const timeRatio = Math.min(timeSpent / 10, 1); // 0 to 1
        const timeMultiplier = Math.pow(1 - timeRatio, 2.5) * 0.65 + 0.35; // Exponential decay with minimum 0.35

        const speedBonus = Math.floor(Math.max(0, (10 - timeSpent) * 2));
        const difficultyBonus = Math.floor(baseDamage * (gameState.currentQuestionDifficulty - 1));
        const comboBonus = Math.floor(gameState.comboCount * 2);

        // Apply time multiplier to total damage
        let totalDamage = Math.floor((baseDamage + speedBonus + difficultyBonus + comboBonus) * timeMultiplier);

        // Deal damage to enemy
        gameState.enemyHP = Math.max(0, gameState.enemyHP - totalDamage);
        gameState.totalDamageDealt += totalDamage;
        gameState.score += totalDamage;

        let message = `GODZILLA ATTACKS!`;
        if (gameState.comboCount > 1) {
            message = `${gameState.comboCount}x COMBO! GODZILLA ATTACKS!`;
        }

        showBattleMessage(message, 'success');
        showDamageNumber(totalDamage, 'player');
        playAttackAnimation('player');
    } else {
        // Reset combo
        gameState.comboCount = 0;

        // Enemy attacks player
        const enemyDamage = Math.floor(10 + Math.random() * 10) * gameState.currentEnemy.damageMultiplier;
        gameState.playerHP = Math.max(0, gameState.playerHP - enemyDamage);

        showBattleMessage(`${gameState.currentEnemy.name} ATTACKS! (Answer: ${gameState.currentCorrectAnswer})`, 'error');
        showDamageNumber(Math.floor(enemyDamage), 'enemy');
        playAttackAnimation('enemy');
    }

    updateHPDisplay();
    updateComboDisplay();

    setTimeout(() => {
        // Check if battle is over
        if (gameState.playerHP <= 0 || gameState.enemyHP <= 0) {
            gameState.battleActive = false;
            endGame();
        } else {
            gameState.currentQuestionIndex++;
            showQuestion();
        }
    }, 1800);
}

function handleTimeout() {
    if (!gameState.battleActive) return;

    const question = gameState.questions[gameState.currentQuestionIndex];

    gameState.totalAnswers++;
    gameState.answerTimes.push(10);
    gameState.comboCount = 0; // Reset combo

    // Log question
    gameState.questionLog.push({
        question: `${question.num1} × ${question.num2}`,
        correctAnswer: gameState.currentCorrectAnswer,
        userAnswer: null,
        timeSpent: 10,
        correct: false
    });

    // Enemy attacks when time runs out
    const enemyDamage = Math.floor(15 + Math.random() * 15) * gameState.currentEnemy.damageMultiplier;
    gameState.playerHP = Math.max(0, gameState.playerHP - enemyDamage);

    showBattleMessage(`TOO SLOW! ${gameState.currentEnemy.name} ATTACKS! (Answer: ${gameState.currentCorrectAnswer})`, 'timeout');
    showDamageNumber(Math.floor(enemyDamage), 'enemy');
    playAttackAnimation('enemy');

    updateHPDisplay();
    updateComboDisplay();

    setTimeout(() => {
        if (gameState.playerHP <= 0 || gameState.enemyHP <= 0) {
            gameState.battleActive = false;
            endGame();
        } else {
            gameState.currentQuestionIndex++;
            showQuestion();
        }
    }, 1800);
}

function showBattleMessage(message, type) {
    const msgEl = document.getElementById('battle-message');
    msgEl.textContent = message;
    msgEl.className = 'battle-message ' + type;
    msgEl.classList.add('show');

    setTimeout(() => {
        msgEl.classList.remove('show');
    }, 1400);
}

function playAttackAnimation(attacker) {
    const sprite = document.getElementById(attacker === 'player' ? 'player-sprite' : 'enemy-sprite');
    sprite.classList.add('attack');

    setTimeout(() => {
        sprite.classList.remove('attack');
    }, 500);
}

function showDamageNumber(damage, attacker) {
    const damageEl = document.getElementById('damage-number');
    damageEl.textContent = '-' + damage;
    damageEl.className = 'damage-number ' + (attacker === 'player' ? 'player-damage' : 'enemy-damage');
    damageEl.classList.add('show');

    setTimeout(() => {
        damageEl.classList.remove('show');
    }, 1200);
}

function updateHPDisplay() {
    // Player HP
    const playerPercentage = (gameState.playerHP / gameState.playerMaxHP) * 100;
    document.getElementById('player-hp-fill').style.width = playerPercentage + '%';
    document.getElementById('player-hp').textContent = Math.max(0, Math.floor(gameState.playerHP));
    document.getElementById('player-max-hp').textContent = gameState.playerMaxHP;

    // Enemy HP
    const enemyPercentage = (gameState.enemyHP / gameState.enemyMaxHP) * 100;
    document.getElementById('enemy-hp-fill').style.width = enemyPercentage + '%';
    document.getElementById('enemy-hp').textContent = Math.max(0, Math.floor(gameState.enemyHP));
    document.getElementById('enemy-max-hp').textContent = gameState.enemyMaxHP;
}

function updateComboDisplay() {
    const comboEl = document.getElementById('combo-display');
    if (!comboEl) return;

    if (gameState.comboCount > 0) {
        comboEl.textContent = `${gameState.comboCount}x COMBO!`;
        comboEl.style.display = 'block';

        if (gameState.comboCount >= 7) {
            comboEl.className = 'combo-display epic';
        } else if (gameState.comboCount >= 4) {
            comboEl.className = 'combo-display high';
        } else {
            comboEl.className = 'combo-display';
        }
    } else {
        comboEl.style.display = 'none';
    }

    // Update supercharge button
    const specialBtn = document.getElementById('special-attack-btn');
    if (specialBtn) {
        if (gameState.superchargeActive) {
            specialBtn.style.display = 'block';
            specialBtn.classList.add('pulse');
        } else {
            specialBtn.style.display = 'none';
        }
    }
}

function switchScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Results Screen Logic
function initResultsScreen() {
    document.getElementById('play-again-btn').addEventListener('click', () => {
        updateProfileDisplay(); // Refresh profile display after game
        switchScreen('start');
    });
}

// History Screen Logic
function initHistoryScreen() {
    document.getElementById('back-from-history-btn').addEventListener('click', () => {
        switchScreen('start');
    });

    document.getElementById('back-to-history-btn').addEventListener('click', () => {
        showBattleHistory();
    });
}

function showBattleHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (!playerProfile.battleHistory || playerProfile.battleHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No battles yet. Start your first battle!</p>';
        switchScreen('history');
        return;
    }

    // Show battles in reverse order (most recent first)
    const battles = [...playerProfile.battleHistory].reverse();

    battles.forEach((battle, index) => {
        const battleCard = document.createElement('div');
        battleCard.className = 'battle-card ' + (battle.victory ? 'victory-card' : 'defeat-card');

        const date = new Date(battle.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        battleCard.innerHTML = `
            <div class="battle-card-header">
                <span class="battle-result">${battle.victory ? '✅ VICTORY' : '❌ DEFEAT'}</span>
                <span class="battle-date">${dateStr}</span>
            </div>
            <div class="battle-card-body">
                <div class="battle-enemy">${battle.enemy} (Lv ${battle.enemyLevel})</div>
                <div class="battle-stats">
                    <span>Damage: ${battle.damageDealt}</span>
                    <span>Accuracy: ${battle.accuracy}%</span>
                    <span>Avg: ${battle.avgSpeed}s</span>
                </div>
                <div class="battle-rank">${battle.rank}</div>
            </div>
        `;

        battleCard.addEventListener('click', () => {
            showBattleDetail(playerProfile.battleHistory.length - 1 - index);
        });

        historyList.appendChild(battleCard);
    });

    switchScreen('history');
}

function showBattleDetail(battleIndex) {
    const battle = playerProfile.battleHistory[battleIndex];
    const detailContent = document.getElementById('battle-detail-content');

    const date = new Date(battle.date);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    let questionsHTML = '';
    battle.questions.forEach((q, i) => {
        const resultClass = q.correct ? 'correct-q' : 'incorrect-q';
        const resultIcon = q.correct ? '✅' : '❌';
        questionsHTML += `
            <div class="question-row ${resultClass}">
                <span class="q-number">${i + 1}.</span>
                <span class="q-text">${q.question} = ${q.correctAnswer}</span>
                <span class="q-answer">Your: ${q.userAnswer ?? 'Timeout'}</span>
                <span class="q-time">${q.timeSpent.toFixed(1)}s</span>
                <span class="q-result">${resultIcon}</span>
            </div>
        `;
    });

    detailContent.innerHTML = `
        <div class="detail-header">
            <h2 class="${battle.victory ? 'victory' : 'defeat'}">${battle.victory ? 'VICTORY!' : 'DEFEATED'}</h2>
            <p class="detail-date">${dateStr}</p>
        </div>

        <div class="detail-summary">
            <div class="summary-row">
                <span class="summary-label">Enemy:</span>
                <span class="summary-value">${battle.enemy} (Level ${battle.enemyLevel})</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Damage Dealt:</span>
                <span class="summary-value">${battle.damageDealt}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Questions:</span>
                <span class="summary-value">${battle.correctQuestions} / ${battle.totalQuestions}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Accuracy:</span>
                <span class="summary-value">${battle.accuracy}%</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Average Speed:</span>
                <span class="summary-value">${battle.avgSpeed}s</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Duration:</span>
                <span class="summary-value">${battle.duration}s</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Rank:</span>
                <span class="summary-value rank-display">${battle.rank}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">XP Gained:</span>
                <span class="summary-value xp-display">+${battle.xpGained}</span>
            </div>
        </div>

        <div class="questions-detail">
            <h3>Question Breakdown</h3>
            ${questionsHTML}
        </div>
    `;

    switchScreen('battleDetail');
}

function endGame() {
    clearInterval(gameState.timerInterval);
    gameState.battleActive = false;

    // Determine victory or defeat
    const victory = gameState.enemyHP <= 0;

    // Calculate stats
    const accuracy = gameState.totalAnswers > 0 ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100) : 0;
    const avgSpeed = gameState.answerTimes.length > 0 ? (gameState.answerTimes.reduce((a, b) => a + b, 0) / gameState.answerTimes.length).toFixed(1) : 0;
    const battleDuration = ((Date.now() - gameState.battleStartTime) / 1000).toFixed(0);

    // Determine rank
    let rank = 'ROOKIE';
    if (victory) {
        if (accuracy >= 90 && avgSpeed < 5) rank = 'S-RANK DESTROYER';
        else if (accuracy >= 80 && avgSpeed < 6) rank = 'A-RANK WARRIOR';
        else if (accuracy >= 70) rank = 'B-RANK FIGHTER';
        else if (accuracy >= 50) rank = 'C-RANK BRAWLER';
    } else {
        rank = 'DEFEATED';
    }

    // Calculate XP gained based on performance
    let baseXP = victory ? gameState.totalDamageDealt : Math.floor(gameState.totalDamageDealt * 0.5);
    const accuracyBonus = Math.floor(accuracy / 10) * 5;
    const speedBonus = avgSpeed < 5 ? 20 : avgSpeed < 7 ? 10 : 0;
    const victoryBonus = victory ? 50 : 0;
    const xpGained = baseXP + accuracyBonus + speedBonus + victoryBonus;

    // Store old level/stage for comparison
    const oldLevel = playerProfile.level;
    const oldStage = playerProfile.evolutionStage;

    // Update profile
    playerProfile.totalPower += gameState.totalDamageDealt;
    playerProfile.xp += xpGained;
    playerProfile.gamesPlayed++;

    // Save battle to history
    const battleRecord = {
        date: new Date().toISOString(),
        enemy: gameState.currentEnemy.name,
        enemyLevel: gameState.currentEnemy.level,
        victory: victory,
        damageDealt: gameState.totalDamageDealt,
        accuracy: accuracy,
        avgSpeed: avgSpeed,
        duration: battleDuration,
        questions: gameState.questionLog,
        totalQuestions: gameState.totalAnswers,
        correctQuestions: gameState.correctAnswers,
        xpGained: xpGained,
        rank: rank
    };

    if (!playerProfile.battleHistory) {
        playerProfile.battleHistory = [];
    }
    playerProfile.battleHistory.push(battleRecord);

    // Keep only last 50 battles
    if (playerProfile.battleHistory.length > 50) {
        playerProfile.battleHistory = playerProfile.battleHistory.slice(-50);
    }

    // Calculate new level (every 100 XP)
    playerProfile.level = Math.floor(playerProfile.xp / 100) + 1;

    // Check for evolution
    let newStage = 0;
    for (let i = evolutionStages.length - 1; i >= 0; i--) {
        if (playerProfile.xp >= evolutionStages[i].xpNeeded) {
            newStage = i;
            break;
        }
    }

    const leveledUp = playerProfile.level > oldLevel;
    const evolved = newStage > oldStage;

    // Save profile
    saveCurrentProfile();

    // Update results display
    document.getElementById('victory-title').textContent = victory ? 'VICTORY!' : 'DEFEATED!';
    document.getElementById('victory-title').className = 'results-title ' + (victory ? 'victory' : 'defeat');

    document.getElementById('result-message').textContent = victory ?
        `You defeated ${gameState.currentEnemy.name} (Level ${gameState.currentEnemy.level})!` :
        `${gameState.currentEnemy.name} (Level ${gameState.currentEnemy.level}) has defeated you!`;

    const resultSprite = document.getElementById('result-sprite');
    resultSprite.className = 'kaiju-sprite godzilla ' + (victory ? 'victory' : 'defeat-sprite');
    resultSprite.classList.add(`stage-${playerProfile.evolutionStage}`);

    document.getElementById('final-score').textContent = gameState.totalDamageDealt;
    document.getElementById('correct-attacks').textContent = gameState.correctAnswers;
    document.getElementById('total-attacks').textContent = gameState.totalAnswers;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('avg-speed').textContent = avgSpeed + 's';
    document.getElementById('rank-badge').textContent = rank;
    document.getElementById('rank-badge').className = 'rank-badge ' + (victory ? 'victory-rank' : 'defeat-rank');
    document.getElementById('xp-gained').textContent = '+' + xpGained + ' XP';

    // Show level up message
    const levelUpMsg = document.getElementById('level-up-message');
    if (evolved) {
        levelUpMsg.textContent = `🎉 EVOLVED TO ${evolutionStages[newStage].name}! 🎉`;
        levelUpMsg.style.display = 'block';
    } else if (leveledUp) {
        levelUpMsg.textContent = `⬆️ LEVEL UP! Now Level ${playerProfile.level}! ⬆️`;
        levelUpMsg.style.display = 'block';
    } else {
        levelUpMsg.style.display = 'none';
    }

    // Switch to results
    setTimeout(() => {
        switchScreen('results');
    }, 1500);
}
