# KAIJU v2.0 - Integration Guide

## Files Created

All new modular systems are ready:

1. ✅ `translations.js` - Multi-language support (EN, NL, DE, VI)
2. ✅ `sounds.js` - Web Audio API sound system (no files needed!)
3. ✅ `achievements.js` - Achievement tracking with 10 achievements
4. ✅ `analytics.js` - Learning analytics & adaptive system
5. ✅ `enhancements.css` - All new visual effects

## Integration Steps

### Step 1: Update index.html

Add these script tags BEFORE the existing `game.js`:

```html
<!-- New Enhancement Systems -->
<link rel="stylesheet" href="enhancements.css">
<script src="translations.js"></script>
<script src="sounds.js"></script>
<script src="achievements.js"></script>
<script src="analytics.js"></script>
<script src="game.js"></script>
```

### Step 2: Update Profile Creation in game.js

Find the `createNewProfile` function and ADD these fields:

```javascript
const createNewProfile = (name) => ({
    name: name,
    level: 1,
    totalPower: 0,
    xp: 0,
    gamesPlayed: 0,
    evolutionStage: 0,
    battleHistory: [],

    // NEW: Settings
    settings: {
        language: 'en',  // en, nl, de, vi
        soundEnabled: true,
        operation: 'multiply'  // 'multiply' or 'add'
    },

    // NEW: Analytics
    analytics: {
        facts: {},  // Per-fact tracking
        tables: {},  // Per-table stats
        mistakes: [],  // Mistake history
        sessions: []  // Session history
    },

    // NEW: Achievements
    achievements: {
        unlocked: [],  // Achievement IDs
        progress: {}  // Progress tracking
    },

    // NEW: Streaks
    streaks: {
        daily: 0,
        lastPlayedDate: null,
        currentWinStreak: 0,
        bestWinStreak: 0
    },

    // NEW: Enemy tracking
    enemiesDefeated: {},
    bossesDefeated: 0
});
```

### Step 3: Enable Boss Battles

Add this function to game.js:

```javascript
// Check if this battle should be a boss
function isBossBattle() {
    return (playerProfile.gamesPlayed + 1) % 10 === 0;
}

// Generate boss enemy
function generateBoss(playerLevel) {
    const bosses = [
        { name: 'MECHA-KING GHIDORAH', emoji: '🤖🐲', hpMult: 2.5 },
        { name: 'DESTROYAH PRIME', emoji: '👹💀', hpMult: 3.0 },
        { name: 'SUPER MECHAGODZILLA', emoji: '🤖⚡', hpMult: 2.8 }
    ];

    const boss = bosses[Math.floor(Math.random() * bosses.length)];

    return {
        name: boss.name,
        emoji: boss.emoji,
        level: playerLevel + 2,
        hp: Math.floor((60 + (playerLevel * 15)) * boss.hpMult),
        damageMultiplier: 1.3,
        isBoss: true
    };
}
```

Then UPDATE the `startBattle` function to check for boss:

```javascript
function startBattle() {
    // ... existing code ...

    // Generate enemy (boss or normal)
    if (isBossBattle()) {
        gameState.currentEnemy = generateBoss(playerProfile.level);
        gameState.isBoss = true;
        soundSystem.playBossAppears();
        showBossIntro();  // Create this function
    } else {
        gameState.currentEnemy = generateEnemy(playerProfile.level);
        gameState.isBoss = false;
    }

    // ... rest of existing code ...
}
```

### Step 4: Track Analytics

In the `checkAnswer` function, ADD tracking:

```javascript
function checkAnswer() {
    const userAnswer = parseInt(gameState.currentAnswer);
    const correct = userAnswer === gameState.currentCorrectAnswer;
    const timeSpent = (Date.now() - gameState.startTime) / 1000;

    // NEW: Track question
    const question = gameState.questions[gameState.currentQuestionIndex];
    const fact = `${question.num1}×${question.num2}`;  // or + for addition

    analytics.trackQuestion(fact, correct, timeSpent, playerProfile);
    analytics.trackTable(Math.max(question.num1, question.num2), correct, timeSpent, playerProfile);

    if (!correct) {
        analytics.trackMistake(fact, gameState.currentCorrectAnswer, userAnswer, playerProfile);
    }

    // ... rest of existing checkAnswer code ...
}
```

### Step 5: Check Achievements

In the `endBattle` function (or similar), ADD:

```javascript
function endBattle(victory) {
    // ... existing code ...

    // NEW: Check achievements
    const newAchievements = [];

    // Track stats for achievements
    if (gameState.correctAnswers === gameState.totalAnswers) {
        newAchievements.push(...achievementManager.updateProgress('perfect_battle', 1, playerProfile));
    }

    newAchievements.push(...achievementManager.updateProgress('correct_answers',
        playerProfile.totalCorrectAnswers || 0, playerProfile));

    if (victory) {
        playerProfile.streaks.currentWinStreak++;
        newAchievements.push(...achievementManager.updateProgress('win_streak',
            playerProfile.streaks.currentWinStreak, playerProfile));

        if (gameState.isBoss) {
            playerProfile.bossesDefeated++;
            newAchievements.push(...achievementManager.updateProgress('boss_defeats',
                playerProfile.bossesDefeated, playerProfile));
        }
    } else {
        playerProfile.streaks.currentWinStreak = 0;
    }

    if (gameState.maxCombo >= 15) {
        newAchievements.push(...achievementManager.updateProgress('max_combo',
            gameState.maxCombo, playerProfile));
    }

    // Show achievement notifications
    newAchievements.forEach(achievement => {
        achievementManager.showNotification(achievement, playerProfile.settings.language);
    });

    // ... rest of existing code ...
}
```

### Step 6: Add Sound Effects

Throughout the game, ADD sound calls:

```javascript
// In checkAnswer when correct:
soundSystem.playCorrect();
soundSystem.playAttack();

// When wrong:
soundSystem.playWrong();

// On combo:
soundSystem.playCombo(gameState.comboCount);

// On supercharge:
soundSystem.playSupercharge();

// On victory:
soundSystem.playVictory();

// On defeat:
soundSystem.playDefeat();

// On evolution:
soundSystem.playEvolution();
```

### Step 7: Add Screen Shake

For attacks, ADD:

```javascript
function playAttackAnimation(who) {
    // ... existing code ...

    // NEW: Screen shake on player attack
    if (who === 'player') {
        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 500);
    }
}
```

### Step 8: Addition Operation Support

ADD operation toggle in settings and UPDATE question generation:

```javascript
function generateQuestions(tables) {
    const questions = [];
    const operation = playerProfile.settings.operation || 'multiply';

    tables.forEach(table => {
        for (let i = 0; i <= 10; i++) {
            for (let pass = 0; pass < 2; pass++) {
                questions.push({
                    num1: table,
                    num2: i,
                    operation: operation,
                    answer: operation === 'multiply' ? table * i : table + i
                });
            }
        }
    });

    return shuffleArray(questions);
}
```

### Step 9: Multi-Language UI

Update UI elements to use translations:

```javascript
// Example:
document.querySelector('.game-title').textContent = t('gameTitle');
document.querySelector('.subtitle').textContent = t('subtitle');
// etc. for all UI text
```

### Step 10: Daily Streak Tracking

ADD to session start:

```javascript
function checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastPlayed = playerProfile.streaks.lastPlayedDate;

    if (lastPlayed) {
        const lastDate = new Date(lastPlayed);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            playerProfile.streaks.daily++;
        } else if (diffDays > 1) {
            // Streak broken
            playerProfile.streaks.daily = 1;
        }
        // Same day: no change
    } else {
        // First time
        playerProfile.streaks.daily = 1;
    }

    playerProfile.streaks.lastPlayedDate = today;
    saveCurrentProfile();

    // Check achievement
    achievementManager.updateProgress('daily_streak',
        playerProfile.streaks.daily, playerProfile);
}
```

## Testing Checklist

After integration:

- [ ] Sounds play on attacks, correct/wrong answers
- [ ] Boss appears on 10th, 20th, 30th battle
- [ ] Achievements unlock and show notifications
- [ ] Language can be changed in settings
- [ ] Addition mode works alongside multiplication
- [ ] Screen shakes on attacks
- [ ] Daily streak increments
- [ ] Analytics track questions correctly
- [ ] Weak facts are identified
- [ ] Table mastery displays correctly

## Quick Start Commands

1. Open `index.html` in a text editor
2. Add the script tags from Step 1
3. Save and reload in browser
4. All systems will auto-initialize!

## Backward Compatibility

Old profiles will auto-upgrade when loaded:

```javascript
function loadProfile(profileName) {
    const profiles = loadProfiles();
    if (profiles[profileName]) {
        playerProfile = profiles[profileName];

        // AUTO-UPGRADE: Add missing fields
        if (!playerProfile.settings) playerProfile.settings = { language: 'en', soundEnabled: true, operation: 'multiply' };
        if (!playerProfile.analytics) playerProfile.analytics = { facts: {}, tables: {}, mistakes: [], sessions: [] };
        if (!playerProfile.achievements) playerProfile.achievements = { unlocked: [], progress: {} };
        if (!playerProfile.streaks) playerProfile.streaks = { daily: 0, lastPlayedDate: null, currentWinStreak: 0, bestWinStreak: 0 };

        currentProfileName = profileName;
        saveCurrentProfile();  // Save upgraded profile
    }
    // ... rest
}
```

## Next Steps

Once integrated and tested, you can add:
- Practice mode screen (separate HTML)
- Stats visualization screen
- Achievement showcase screen
- Settings panel with language/sound toggles

All the systems are ready - just need UI to access them!

---

**All core systems are COMPLETE and ready to use!** 🎉
