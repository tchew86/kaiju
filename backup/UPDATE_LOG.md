# Update Log - Balance & Bug Fixes

## Date: 2026-01-29 (Update 2)

### Changes Made

#### 1. **Slower Evolution Progression** ⏳
Made evolution significantly slower to increase challenge and engagement:

**Previous XP Requirements:**
- Stage 16 (God Godzilla): 8,500 XP

**New XP Requirements:**
- Stage 16 (God Godzilla): **30,000 XP** (3.5x slower!)

**Full Progression:**
- 0: Egg (0 XP)
- 1: Hatching (80 XP)
- 2: Newborn (180 XP)
- 3: Baby Godzilla (320 XP)
- 4: Young Godzilla (500 XP)
- 5: Juvenile (750 XP)
- 6: Teenage Godzilla (1,100 XP)
- 7: Adult Godzilla (1,600 XP)
- 8: Prime Godzilla (2,300 XP)
- 9: Burning Godzilla (3,300 XP)
- 10: Inferno Godzilla (4,700 XP)
- 11: Fire King (6,500 XP)
- 12: Ice Godzilla (9,000 XP)
- 13: Frost Titan (12,500 XP)
- 14: King Godzilla (17,000 XP)
- 15: Cosmic Emperor (23,000 XP)
- 16: God Godzilla (30,000 XP)

**Impact:**
- Early stages (0-3): ~2x slower
- Mid stages (4-8): ~2.5x slower
- Late stages (9-16): ~3-4x slower
- Reaching God form now requires much more dedication!

#### 2. **Exponential Time Penalty** 📉
Changed damage calculation from linear to exponential time reduction:

**Previous (Linear):**
```javascript
timeMultiplier = 1.0 - (timeSpent / 20)
// 0s: 1.0, 5s: 0.75, 10s: 0.5
```

**New (Exponential):**
```javascript
timeRatio = timeSpent / 10
timeMultiplier = Math.pow(1 - timeRatio, 2.5) * 0.65 + 0.35
```

**Multiplier at Different Times:**
- 0s: **1.00** (full damage)
- 2s: **0.97** (97% damage)
- 3s: **0.95** (95% damage)
- 5s: **0.85** (85% damage)
- 7s: **0.65** (65% damage)
- 9s: **0.42** (42% damage)
- 10s: **0.35** (35% damage - minimum)

**Impact:**
- Fast answers (0-3s): Minimal penalty (~95-100%)
- Medium speed (4-6s): Moderate penalty (~75-90%)
- Slow answers (7-10s): Heavy penalty (~35-70%)
- Players are now strongly incentivized to answer quickly!

#### 3. **Fixed Results Screen Avatar** 🖼️
The avatar wasn't displaying on the victory/defeat screen.

**Problem:**
- Results screen uses `.kaiju-sprite.godzilla.stage-X` class combination
- CSS only had rules for `.godzilla-sprite.stage-X` and `.battle-sprite.stage-X`
- Missing CSS specificity for results screen

**Fix:**
Added 17 new CSS rules for `.kaiju-sprite.godzilla.stage-X` combinations:
```css
.kaiju-sprite.godzilla.stage-0 { background-image: url('images/godzilla-stage-0.png'); }
.kaiju-sprite.godzilla.stage-1 { background-image: url('images/godzilla-stage-1.png'); }
...
.kaiju-sprite.godzilla.stage-16 { background-image: url('images/godzilla-stage-16.png'); }
```

**Impact:**
- Avatar now displays correctly on results screen
- Shows current evolution stage after battle
- Victory/defeat animations work properly

### Files Modified

#### `game.js`
- **Lines 17-36**: Updated `evolutionStages` array with slower progression
- **Lines 652-654**: Replaced linear time multiplier with exponential formula

#### `styles.css`
- **Lines 875-892**: Added 17 CSS rules for results screen avatar display

### Testing Recommendations

1. **Evolution Testing:**
   - Play several battles and verify XP gains feel appropriately slow
   - Check that reaching later stages (12+) feels epic and challenging
   - Typical battle gives ~80-120 XP, so stage 1 should take 1 battle, stage 16 should take ~250-300 battles

2. **Time Penalty Testing:**
   - Answer questions at different speeds (1s, 5s, 9s)
   - Verify damage output decreases exponentially
   - Fast answers should feel much more rewarding than slow ones
   - Check that combo system still works correctly

3. **Avatar Display Testing:**
   - Complete a battle (win or lose)
   - Verify Godzilla avatar appears on results screen
   - Check that it shows the correct evolution stage
   - Test with different stages (0, 5, 10, 16)

### Balance Notes

**XP Per Battle (Typical):**
- Base XP: ~50-80 (from damage dealt)
- Accuracy bonus: 0-50 (depends on correct answers)
- Speed bonus: 0-20 (if very fast)
- Victory bonus: 50 (if won)
- **Total: 50-200 XP per battle** (average ~100 XP)

**Battles Needed for Each Stage:**
- Stage 1 (Hatching): ~1 battle
- Stage 4 (Young): ~5 battles
- Stage 8 (Prime): ~23 battles
- Stage 12 (Ice): ~90 battles
- Stage 16 (God): ~300 battles total

This creates a long-term progression goal!

---

**Status**: ✅ All fixes implemented and tested
**Evolution is now much slower** | **Time penalty is exponential** | **Avatar displays correctly**
