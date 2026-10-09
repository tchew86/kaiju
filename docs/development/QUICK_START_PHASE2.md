# KAIJU v2.0 - Phase 2 Quick Start Guide

## 🎯 Testing the New Systems

All Phase 2 systems are ready to use! Here's how to test each one.

---

## 1. Practice Mode 📚

**Start Practice:**
```javascript
// Practice the 7× table with multiplication
practiceMode.startPractice(7, 'multiply');

// Practice the 5× table with addition
practiceMode.startPractice(5, 'add');
```

**Check Answer:**
```javascript
const result = practiceMode.checkAnswer(userAnswer, timeSpent);
// Returns: { correct, message, showHint, fact, ... }
```

**Get Final Report:**
```javascript
const report = practiceMode.getFinalReport(playerProfile);
// Returns: { totalQuestions, correct, accuracy, avgTime, weakFacts, recommendations }
```

---

## 2. Hint System 💡

**Show Hint Modal:**
```javascript
// Show hint for 7 × 8
hintSystem.showHint(7, 8, 'multiply', 'en');

// Show hint for addition
hintSystem.showHint(9, 7, 'add', 'en');
```

**Get Hint Data (Without Modal):**
```javascript
const hint = hintSystem.getHint(7, 8, 'multiply');
// Returns: { strategy, explanation, trick, example }
```

**Example Hint Output:**
```
Strategy: Pattern (7×8)
Explanation: Think "Five, Six, Seven, Eight"
Trick: 7×8 = 56 (5,6,7,8 in order!)
Example: 7 groups of 8 = 56
```

---

## 3. Game Modes 🎮

### Challenge Mode (2-minute speed run):
```javascript
// Start challenge with tables 5 and 7
challengeMode.startChallenge([5, 7], 120, 'multiply');

// Check answer
const result = challengeMode.checkAnswer(userAnswer, timeSpent);

// End challenge
const finalScore = challengeMode.endChallenge();
// Returns: { score, questionsAnswered, correctAnswers, accuracy, grade }
```

### Quiz Mode (20-question assessment):
```javascript
// Start quiz with tables 1-10
quizMode.startQuiz([1,2,3,4,5,6,7,8,9,10], 'multiply');

// Check answer
quizMode.checkAnswer(userAnswer, timeSpent);

// Get report card
const report = quizMode.generateReportCard(playerProfile);
// Returns: { grade, accuracy, avgTime, perTable, weakTables, recommendations }
```

### Campaign Mode (story progression):
```javascript
// Get all chapters
const chapters = campaignMode.chapters;

// Start chapter
campaignMode.startChapter(chapterNumber, playerProfile);

// Check if unlocked
const unlocked = campaignMode.isChapterUnlocked(chapterNumber, playerProfile);

// Complete chapter
campaignMode.completeChapter(chapterNumber, playerProfile, accuracy);
```

---

## 4. Power-ups System ⚡

**Activate Power-up:**
```javascript
// Activate Rage Mode (2× damage)
powerupManager.activate('RAGE', 'en');

// Other power-ups: SHIELD, TIME_FREEZE, FOCUS, COMBO_BOOST
```

**Check Active Effects:**
```javascript
// Check if specific effect is active
if (powerupManager.shouldBlockDamage()) {
    // Shield is active - don't reduce HP
}

if (powerupManager.shouldFreezeTimer()) {
    // Time Freeze is active - pause timer
}

if (powerupManager.shouldShowHint()) {
    // Focus is active - show hints
}
```

**Apply Effects:**
```javascript
// Apply damage boost
const boostedDamage = powerupManager.applyDamageEffect(baseDamage);

// Apply combo boost
const boostedCombo = powerupManager.applyComboEffect(comboIncrement);

// Use one charge (call after each question)
powerupManager.useCharge();
```

**Check Available Power-ups:**
```javascript
// Get power-ups unlocked at player's level
const available = powerupManager.getAvailable(playerLevel);

// Check if specific power-up is unlocked
const unlocked = powerupManager.isUnlocked('RAGE', playerLevel);
```

---

## 5. Visual Learning Aids 🎨

**Show Visual Aid Modal:**
```javascript
// Automatically picks best visualization for 5 × 6
visualAids.showModal(5, 6, 'multiply', 'en');

// Show for addition
visualAids.showModal(7, 8, 'add', 'en');
```

**Show Specific Visualizations:**
```javascript
// Array model (dots in grid)
const arrayDiv = visualAids.showArrayModel(4, 5, 'en');

// Number line (skip counting)
const numberLine = visualAids.showNumberLine(3, 4, 'en', 'multiply');

// Skip counting (bubbles)
const skipCount = visualAids.showSkipCounting(5, 6, 'en');

// Counting blocks (for addition)
const blocks = visualAids.showCountingBlocks(7, 8, 'en');

// Pattern discovery (full table)
const pattern = visualAids.showPattern(7, 'en');
```

---

## 6. Stats Screen 📊

**Show Stats Modal:**
```javascript
// Show full stats screen
statsScreen.show(playerProfile, 'en');
```

**What It Shows:**
- Player overview (level, XP, battles, streaks, achievements)
- Table mastery grid with badges (Bronze/Silver/Gold/Platinum)
- Weak facts to practice
- Recent progress chart (last 7 sessions)
- AI recommendations

---

## 7. Recommendations Widget 🎯

**Show on Start Screen:**
```javascript
// Show top recommendation
const widget = recommendationsWidget.show(playerProfile, 'en');
document.getElementById('recommendations-container').appendChild(widget);
```

**Show Quick Stats:**
```javascript
const quickStats = recommendationsWidget.showQuickStats(playerProfile, 'en');
```

**Show Daily Streak:**
```javascript
const streakWidget = recommendationsWidget.showDailyStreak(playerProfile, 'en');
```

**Show Achievement Progress:**
```javascript
const achievementProgress = recommendationsWidget.showAchievementProgress(playerProfile, 'en');
```

---

## 8. Enemy Pokedex 🦖

**Show Collection:**
```javascript
enemyPokedex.show(playerProfile, 'en');
```

**Track Enemy Defeat:**
```javascript
// Call this when player defeats an enemy
enemyPokedex.trackDefeat(playerProfile, 'rodan', true); // won = true
enemyPokedex.trackDefeat(playerProfile, 'king_ghidorah', false); // won = false
```

**Check if Enemy Discovered:**
```javascript
const discovered = enemyPokedex.isDefeated(playerProfile, 'mothra');
```

**Get Enemy Stats:**
```javascript
const stats = enemyPokedex.getEnemyStats(profile, 'gigan');
// Returns: { defeated, winRate }
```

**Available Enemies:**
- Basic: mothra_larva, baby_godzilla
- Flying: rodan, mothra
- Armored: anguirus, baragon, mechagodzilla
- Fast: gigan, megalon
- Elite: king_caesar
- Bosses: king_ghidorah, destroyah, space_godzilla, biollante

---

## 🎮 Complete Integration Example

Here's how to add everything to your game:

```javascript
// ========================================
// ON GAME LOAD
// ========================================

// Show recommendations on start screen
const recContainer = document.getElementById('recommendations-container');
if (recContainer) {
    recContainer.appendChild(
        recommendationsWidget.show(playerProfile, 'en')
    );
}

// ========================================
// MENU BUTTONS
// ========================================

// Stats button
document.getElementById('stats-btn').onclick = () => {
    statsScreen.show(playerProfile, 'en');
};

// Pokedex button
document.getElementById('pokedex-btn').onclick = () => {
    enemyPokedex.show(playerProfile, 'en');
};

// Practice button
document.getElementById('practice-btn').onclick = () => {
    const table = parseInt(prompt('Which table? (1-12)'));
    practiceMode.startPractice(table, 'multiply');
    // Then show practice UI
};

// ========================================
// IN BATTLE
// ========================================

// Hint button
document.getElementById('hint-btn').onclick = () => {
    hintSystem.showHint(
        currentQuestion.num1,
        currentQuestion.num2,
        'multiply',
        'en'
    );
};

// Visual aid button
document.getElementById('visual-btn').onclick = () => {
    visualAids.showModal(
        currentQuestion.num1,
        currentQuestion.num2,
        'multiply',
        'en'
    );
};

// Power-up activation (when earned)
if (correctStreak === 10) {
    powerupManager.activate('RAGE', 'en');
}

// Apply power-up effects
if (powerupManager.hasEffect('double_damage')) {
    damage = damage * 2;
}

if (powerupManager.hasEffect('block_wrong') && !correct) {
    // Don't reduce player HP
}

// Use power-up charge after each question
powerupManager.useCharge();

// ========================================
// AFTER BATTLE
// ========================================

// Track enemy defeat in Pokedex
enemyPokedex.trackDefeat(playerProfile, currentEnemy.id, victory);

// Save profile with updated stats
saveCurrentProfile();
```

---

## 🧪 Browser Console Testing

Open browser console (F12) and try:

```javascript
// Test each system
soundSystem.playVictory();
hintSystem.showHint(7, 8, 'multiply', 'en');
visualAids.showModal(5, 6, 'multiply', 'en');
powerupManager.activate('RAGE', 'en');
statsScreen.show(playerProfile, 'en');
enemyPokedex.show(playerProfile, 'en');

// Start different modes
practiceMode.startPractice(7, 'multiply');
challengeMode.startChallenge([5,7], 120, 'multiply');
quizMode.startQuiz([1,2,3,4,5], 'multiply');
```

---

## 📝 Notes

1. **All systems auto-initialize** when page loads
2. **Profile structure** must include analytics/achievements/streaks (see INTEGRATION_GUIDE.md)
3. **Language parameter** defaults to 'en' if not provided
4. **All modals** can be closed by clicking background or close button

---

## 🎉 You're All Set!

All Phase 2 systems are ready to use. Start integrating them into your game for a complete educational experience!

For full integration instructions, see `INTEGRATION_GUIDE.md`
For detailed feature list, see `PHASE_2_COMPLETE.md`
