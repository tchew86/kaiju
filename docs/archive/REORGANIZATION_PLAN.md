# 📁 Project Reorganization Plan

## Current Issues
- **49 files** in root directory (chaos!)
- **17 JavaScript files** (many redundant/backup files)
- **16 Markdown documentation files** (scattered everywhere)
- Temporary and backup files mixed with production code
- No clear separation between core game, features, and UI components

## New Structure

```
kaiju/
├── index.html                 # Main entry point
├── test-load.html            # Test page
│
├── css/                       # All styles
│   ├── styles.css            # Main game styles
│   └── enhancements.css      # UI enhancements
│
├── js/                        # All JavaScript
│   ├── core/                 # Core game logic
│   │   ├── game.js           # Main game engine
│   │   ├── translations.js   # Multi-language support
│   │   └── sounds.js         # Sound system
│   │
│   ├── features/             # Game features
│   │   ├── achievements.js   # Achievement system
│   │   ├── analytics.js      # Player analytics
│   │   ├── powerups.js       # Power-up system
│   │   ├── hints.js          # Hint system
│   │   └── game-modes.js     # Quiz/Campaign/Practice modes logic
│   │
│   ├── ui/                   # UI components
│   │   ├── game-integration.js      # Integration helpers
│   │   ├── stats-screen.js          # Statistics dashboard
│   │   ├── enemy-pokedex.js         # Enemy collection
│   │   ├── recommendations-widget.js # Smart recommendations
│   │   ├── visual-aids.js           # Visual learning aids
│   │   ├── practice-ui.js           # Practice mode UI
│   │   └── challenge-ui.js          # Challenge mode UI
│   │
│   └── legacy/               # Old/backup files (for reference)
│       ├── game-backup.js
│       ├── game-enhanced.js
│       └── practice-mode.js
│
├── images/                    # All game images
│   └── godzilla-stage-*.png
│
├── docs/                      # All documentation
│   ├── README.md             # Main project readme
│   ├── QUICK_START_GUIDE.md  # How to play
│   ├── FEATURES.md           # Feature documentation
│   ├── CHANGELOG.md          # Version history
│   └── development/          # Development docs
│       ├── IMPLEMENTATION_PLAN.md
│       ├── INTEGRATION_GUIDE.md
│       ├── BALANCE_GUIDE.md
│       ├── EVOLUTION_STAGES.md
│       └── bugfixes/
│           ├── BUGFIX_BUTTONS.md
│           └── BUGFIX_ADDITION_MODE.md
│
└── backup/                    # Temporary/old files
    └── *.tmp.*
```

## File Actions

### MOVE to js/core/
- game.js ✅
- translations.js ✅
- sounds.js ✅

### MOVE to js/features/
- achievements.js ✅
- analytics.js ✅
- powerups.js ✅
- hints.js ✅
- game-modes.js ✅

### MOVE to js/ui/
- game-integration.js ✅
- stats-screen.js ✅
- enemy-pokedex.js ✅
- recommendations-widget.js ✅
- visual-aids.js ✅
- practice-ui.js ✅
- challenge-ui.js ✅

### MOVE to js/legacy/
- game-backup.js ✅
- game-enhanced.js ✅
- practice-mode.js ✅ (replaced by practice-ui.js)

### MOVE to css/
- styles.css ✅
- enhancements.css ✅

### MOVE to docs/
- README.md ✅
- QUICK_START_GUIDE.md ✅
- QUICK_REFERENCE.md ✅

### MOVE to docs/development/
- IMPLEMENTATION_PLAN.md ✅
- IMPLEMENTATION_COMPLETE.md ✅
- INTEGRATION_GUIDE.md ✅
- BALANCE_GUIDE.md ✅
- EVOLUTION_STAGES.md ✅
- EVOLUTION_UPDATE.md ✅
- DELIVERABLES.md ✅
- PHASE_2_COMPLETE.md ✅
- PHASE_3_COMPLETE.md ✅
- PROJECT_STATUS.md ✅
- COMPLETE_FEATURE_LIST.md ✅
- MODES_STATUS.md ✅
- QUICK_START_PHASE2.md ✅

### MOVE to docs/development/bugfixes/
- BUGFIX_BUTTONS.md ✅
- BUGFIX_ADDITION_MODE.md ✅

### MOVE to backup/
- game.js.tmp.* ✅
- CHANGES.md ✅ (superseded by better docs)
- UPDATE_LOG.md ✅ (superseded by better docs)

### DELETE (redundant)
- None for now - keep in backup folder

## Files to Update

After moving files, these need path updates:

### index.html
Update all `<script src="...">` and `<link href="...">` paths

### test-load.html
Update all `<script src="...">` paths

## Benefits

✅ **Clear organization** - Easy to find files by purpose
✅ **Separation of concerns** - Core / Features / UI separated
✅ **Cleaner root** - Only 2 HTML files in root
✅ **Better documentation** - All docs in one place
✅ **Easier maintenance** - Know where to look for specific code
✅ **Version control ready** - Proper folder structure for Git
✅ **Legacy preserved** - Old files kept for reference but separated

## Next Steps

1. Create folder structure ✅
2. Move files to new locations
3. Update index.html paths
4. Update test-load.html paths
5. Test that everything still works
6. Create new consolidated README.md
