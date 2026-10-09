# KAIJU Game - Refactoring Implementation Guide

## Overview

This guide outlines the strategy for eliminating code duplication by using shared utility functions. The refactoring is designed to:
- Reduce ~345 lines of duplicate code
- Improve maintainability
- Make the codebase more modular
- Preserve all existing functionality

## Status

✅ **Utilities Created** - All utility files are in `js/utils/`
✅ **Scripts Loaded** - Added to `index.html` before other scripts
⏳ **Implementation** - Ready to refactor existing code
⏳ **Testing** - After refactoring is complete

## Refactoring Strategy

### Phase 1: Low-Risk Utilities (RECOMMENDED TO START)

These can be implemented immediately with minimal risk:

#### 1.1 Array Utilities (10 lines saved)
**Files to update:**
- `js/features/game-modes.js` - Lines 535-542 (QuizMode.shuffleArray)
- `js/features/game-modes.js` - Lines 535-542 (ChallengeMode - same method)
- `js/features/game-modes.js` - Lines 789-795 (PracticeMode.shuffleArray)

**Replace with:**
```javascript
// OLD:
shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// NEW:
shuffleArray(array) {
    return ArrayUtils.shuffle(array);
}

// OR remove method entirely and call ArrayUtils.shuffle() directly
```

### Phase 2: Question Generation (CRITICAL - 115 lines saved)

#### 2.1 Addition Question Generation
**Files to update:**
- `js/features/game-modes.js` - ChallengeMode.generateQuestions() lines 69-165
- `js/features/game-modes.js` - PracticeMode.startPractice() lines 709-766

**Before (duplicated in both):**
```javascript
const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
const num3 = Math.floor(Math.random() * (max - min + 1)) + min;

const useThreePart = this.includeThreePart && Math.random() < 0.5;
const useSubtraction = this.includeSubtraction && Math.random() < 0.5;
// ... 80+ more lines ...
```

**After:**
```javascript
const question = QuestionGenerator.generateAdditionQuestion(
    min, max,
    this.includeThreePart,
    this.includeSubtraction,
    this.allowOverhang
);
questions.push(question);
```

#### 2.2 Question Display Formatting
**Files to update:**
- `js/ui/challenge-ui.js` - Lines 339-353
- `js/ui/practice-ui.js` - Lines 279-291

**Before:**
```javascript
if (q.isThreePart && q.num3 !== undefined) {
    let operator1 = q.isSubtraction ? '-' : '+';
    questionEl.textContent = `${q.num1} ${operator1} ${q.num2} + ${q.num3} = ?`;
} else {
    let operator = '×';
    if (q.operation === 'add') operator = '+';
    else if (q.operation === 'subtract') operator = '-';
    questionEl.textContent = `${q.num1} ${operator} ${q.num2} = ?`;
}
```

**After:**
```javascript
questionEl.textContent = QuestionGenerator.formatQuestion(q);
```

### Phase 3: UI Components (80 lines saved)

#### 3.1 Number Pad Creation
**Files to update:**
- `js/ui/challenge-ui.js` - Lines 170-210
- `js/ui/practice-ui.js` - Lines 130-169

**Before:**
```javascript
const numberPad = document.createElement('div');
numberPad.className = 'answer-grid';
// ... 30+ lines creating buttons ...
```

**After:**
```javascript
const { numberPad, clearBtn, submitBtn, numberButtons } =
    UIComponents.createNumberPad('challenge', 'SUBMIT!');

// Attach event listeners
clearBtn.addEventListener('click', () => { /* ... */ });
submitBtn.addEventListener('click', () => { /* ... */ });
numberButtons.forEach(btn => {
    btn.addEventListener('click', () => { /* ... */ });
});
```

#### 3.2 Stat Cards Rendering
**Files to update:**
- `js/ui/challenge-ui.js` - Lines 457-481
- `js/ui/practice-ui.js` - Lines 425-449
- `js/ui/stats-screen.js` - Similar pattern in multiple places

**Before:**
```javascript
statCards.forEach(stat => {
    const card = document.createElement('div');
    card.style.cssText = `...`;
    card.innerHTML = `...`;
    container.appendChild(card);
});
```

**After:**
```javascript
UIComponents.renderStatCards(container, [
    { label: 'Score', value: score, icon: '🎯', color: '#00ff00' },
    { label: 'Accuracy', value: `${accuracy}%`, icon: '📊', color: '#ffaa00' }
]);
```

### Phase 4: Keyboard Handlers (30 lines saved)

**Files to update:**
- `js/ui/challenge-ui.js` - Lines 284-306
- `js/ui/practice-ui.js` - Lines 242-263

**Before:**
```javascript
this.keyboardHandler = (e) => {
    if ((e.key >= '0' && e.key <= '9') || (e.keyCode >= 96 && e.keyCode <= 105)) {
        const num = e.key >= '0' && e.key <= '9' ? e.key : String.fromCharCode(e.keyCode - 48);
        this.currentAnswer += num;
        document.getElementById('challenge-current-answer').textContent = this.currentAnswer || '?';
        e.preventDefault();
    }
    // ... more code ...
};
document.addEventListener('keydown', this.keyboardHandler);
```

**After:**
```javascript
this.keyboardHandler = KeyboardHandler.createHandler(
    this,                           // context
    'challenge-current-answer',    // answer display element ID
    () => this.checkAnswer()       // callback
);
KeyboardHandler.addHandler(this.keyboardHandler);
```

**Cleanup:**
```javascript
// Before:
if (this.keyboardHandler) {
    document.removeEventListener('keydown', this.keyboardHandler);
}

// After:
KeyboardHandler.removeHandler(this.keyboardHandler);
```

## Implementation Steps

### Step 1: Verify Utilities Loaded
Open the game in browser and check console for:
```
✅ Array utilities loaded
✅ Question Generator utilities loaded
✅ Keyboard Handler utilities loaded
✅ UI Components utilities loaded
```

### Step 2: Start with Low-Risk Changes
Begin with ArrayUtils (shuffle) since it's the simplest:

1. Update one file at a time
2. Test after each change
3. Commit if using version control

### Step 3: Progressive Implementation
Work through phases in order:
1. Phase 1 (Array Utils) - Test
2. Phase 2 (Question Gen) - Test
3. Phase 3 (UI Components) - Test
4. Phase 4 (Keyboard) - Test

### Step 4: Testing Checklist

After each phase, verify:
- [ ] Normal battle mode works
- [ ] Campaign mode works
- [ ] Challenge mode works
- [ ] Practice mode works
- [ ] Number pad input works
- [ ] Keyboard input works (regular + numpad)
- [ ] Questions display correctly
- [ ] Stats display correctly
- [ ] No console errors

## Campaign vs Normal Battle - Already Optimized ✅

**Finding:** Campaign and normal battle modes already share code efficiently.

Both modes use the same `startGame()` function from `js/core/game.js`. Campaign mode just:
1. Sets `gameState.currentEnemy` to a specific enemy
2. Sets `gameState.selectedTables` based on chapter
3. Calls `startGame()`

This is good design - no refactoring needed here.

## Benefits After Refactoring

1. **Maintainability**: Bug fixes only need to be made in one place
2. **Consistency**: All modes use the same logic, ensuring uniform behavior
3. **Code Size**: ~345 fewer lines to maintain
4. **Testing**: Easier to test utilities in isolation
5. **Future Features**: New game modes can reuse existing utilities

## Rollback Plan

If issues arise:
1. Keep old code commented out during refactoring
2. Can quickly revert by uncommenting old code
3. Utilities don't modify existing files until you update them
4. Can refactor one file at a time

## Notes

- **Utilities are standalone** - They don't depend on game state
- **Backwards compatible** - Old code continues to work until updated
- **Optional refactoring** - Not required for game to function
- **Best done incrementally** - Don't refactor everything at once

## Next Steps

1. **Review this guide** and decide which phases to implement
2. **Test utilities** work correctly (open game, check console)
3. **Start with Phase 1** (low risk, easy to test)
4. **Progress gradually** through phases
5. **Test thoroughly** after each phase

Would you like me to implement any specific phase of this refactoring?
