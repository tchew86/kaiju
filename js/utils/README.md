# KAIJU Game - Utilities Library

This directory contains shared utility functions to eliminate code duplication across the game.

## Files

### question-generator.js
Shared question generation logic for all game modes.

**Usage:**
```javascript
// Generate addition question
const question = QuestionGenerator.generateAdditionQuestion(
    1, 10,              // min, max range
    true,               // includeThreePart
    true,               // includeSubtraction
    false               // allowOverhang
);

// Generate multiplication question
const question = QuestionGenerator.generateMultiplicationQuestion(
    7,                  // table number
    12                  // maxFactor (optional, defaults to table number)
);

// Format question for display
const displayText = QuestionGenerator.formatQuestion(question);
// Returns: "7 × 8 = ?"
```

### ui-components.js
Shared UI component creation.

**Usage:**
```javascript
// Create number pad
const { numberPad, clearBtn, submitBtn } = UIComponents.createNumberPad(
    'challenge',        // idPrefix
    'SUBMIT!'          // submitText
);
container.appendChild(numberPad);

// Render stat cards
UIComponents.renderStatCards(container, [
    { label: 'Score', value: 1500, icon: '🎯', color: '#00ff00' },
    { label: 'Accuracy', value: '95%', icon: '📊', color: '#ffaa00' }
]);

// Create progress bar
const progressBar = UIComponents.createProgressBar(75, {
    fillColor: '#00ff00',
    showText: true
});

// Create modal
const modal = UIComponents.createModal('<h1>Hello</h1>', {
    maxWidth: '600px',
    borderColor: '#ffaa00'
});
```

### keyboard-handler.js
Shared keyboard event handling.

**Usage:**
```javascript
// Create handler
this.keyboardHandler = KeyboardHandler.createHandler(
    this,                           // context with currentAnswer property
    'answer-display-id',           // element ID to update
    () => this.checkAnswer()       // callback when Enter pressed
);

// Add handler
KeyboardHandler.addHandler(this.keyboardHandler);

// Remove handler
KeyboardHandler.removeHandler(this.keyboardHandler);
```

### array-utils.js
Array manipulation utilities.

**Usage:**
```javascript
// Shuffle array
const shuffled = ArrayUtils.shuffle([1, 2, 3, 4, 5]);

// Get random element
const random = ArrayUtils.randomElement(['A', 'B', 'C']);

// Get multiple random elements
const randoms = ArrayUtils.randomElements([1, 2, 3, 4, 5], 3);

// Group by key
const grouped = ArrayUtils.groupBy(items, item => item.category);
```

## Loading Order

These utilities must be loaded BEFORE the files that use them. Add to `index.html`:

```html
<!-- Utilities (load first) -->
<script src="js/utils/array-utils.js"></script>
<script src="js/utils/question-generator.js"></script>
<script src="js/utils/keyboard-handler.js"></script>
<script src="js/utils/ui-components.js"></script>

<!-- Then load other game files -->
<script src="js/core/game.js"></script>
<!-- etc -->
```

## Refactoring Guide

When you find duplicate code:

1. **Identify the pattern** - What's being duplicated?
2. **Extract to utility** - Create a function in the appropriate utils file
3. **Replace duplicates** - Update all locations to use the utility
4. **Test thoroughly** - Ensure behavior hasn't changed

## Future Utilities

Consider adding:
- `enemy-utils.js` - Enemy selection and generation helpers
- `scoring-utils.js` - Score calculation utilities
- `date-utils.js` - Date/time formatting helpers
- `storage-utils.js` - LocalStorage wrapper functions
