# 📁 KAIJU Project Structure

## Root Directory (Clean!)

```
kaiju/
├── 📄 index.html                    # Main game (PLAY THIS!)
├── 📄 test-load.html               # System diagnostics
├── 📄 README.md                    # Project documentation
│
├── 📁 css/ (2 files)
│   ├── styles.css                  # Core game styles
│   └── enhancements.css            # Animations & visual effects
│
├── 📁 js/ (18 files)
│   ├── 📁 core/ (3 files)
│   │   ├── game.js                 # 🎮 Main game engine (50KB)
│   │   ├── translations.js         # 🌍 Multi-language (EN/NL/DE/VI)
│   │   └── sounds.js               # 🔊 Sound effects
│   │
│   ├── 📁 features/ (5 files)
│   │   ├── achievements.js         # 🏆 Achievement system
│   │   ├── analytics.js            # 📊 Performance tracking
│   │   ├── game-modes.js           # 🎯 Quiz/Campaign/Challenge
│   │   ├── hints.js                # 💡 Learning hints
│   │   └── powerups.js             # ⚡ Power-up system
│   │
│   ├── 📁 ui/ (7 files)
│   │   ├── game-integration.js     # 🔗 Integration layer
│   │   ├── stats-screen.js         # 📈 Statistics dashboard
│   │   ├── enemy-pokedex.js        # 👾 Enemy collection
│   │   ├── recommendations-widget.js # 🎯 Smart recommendations
│   │   ├── visual-aids.js          # 📐 Visual learning tools
│   │   ├── practice-ui.js          # 📚 Practice mode UI
│   │   └── challenge-ui.js         # ⚡ Challenge mode UI
│   │
│   └── 📁 legacy/ (3 archived files)
│       ├── game-backup.js          # Old backup
│       ├── game-enhanced.js        # Old enhanced version
│       └── practice-mode.js        # Superseded by practice-ui.js
│
├── 📁 images/ (22 files)
│   └── godzilla-stage-0.png to godzilla-stage-21.png
│
├── 📁 docs/
│   ├── README.md                   # User guide
│   ├── QUICK_START_GUIDE.md        # Getting started
│   ├── QUICK_REFERENCE.md          # Feature reference
│   │
│   └── 📁 development/
│       ├── IMPLEMENTATION_PLAN.md
│       ├── IMPLEMENTATION_COMPLETE.md
│       ├── INTEGRATION_GUIDE.md
│       ├── BALANCE_GUIDE.md
│       ├── EVOLUTION_STAGES.md
│       ├── EVOLUTION_UPDATE.md
│       ├── DELIVERABLES.md
│       ├── PHASE_2_COMPLETE.md
│       ├── PHASE_3_COMPLETE.md
│       ├── PROJECT_STATUS.md
│       ├── COMPLETE_FEATURE_LIST.md
│       ├── MODES_STATUS.md
│       ├── QUICK_START_PHASE2.md
│       │
│       └── 📁 bugfixes/
│           ├── BUGFIX_BUTTONS.md
│           └── BUGFIX_ADDITION_MODE.md
│
└── 📁 backup/ (3 files)
    ├── game.js.tmp.14720.1769701930164
    ├── CHANGES.md
    └── UPDATE_LOG.md
```

## Quick Navigation

### 🎮 To Play the Game
→ Open `index.html`

### 🛠️ To Modify Core Game Logic
→ `js/core/game.js`

### 🎨 To Change Styles
→ `css/styles.css`

### ✨ To Add New Features
→ `js/features/` (add new file here)

### 📱 To Add New UI Components
→ `js/ui/` (add new file here)

### 📚 To Read Documentation
→ `docs/README.md`

### 🐛 To Debug Issues
→ Open `test-load.html`

### 🔍 To Find Development Docs
→ `docs/development/`

## File Loading Order

The game loads scripts in this order (see `index.html`):

1. **Core Systems** (must load first)
   - translations.js
   - sounds.js

2. **Game Features** (can load in any order)
   - achievements.js
   - analytics.js
   - hints.js
   - game-modes.js
   - powerups.js

3. **UI Components** (need features loaded first)
   - visual-aids.js
   - stats-screen.js
   - recommendations-widget.js
   - enemy-pokedex.js
   - practice-ui.js
   - challenge-ui.js

4. **Core Game Engine** (needs everything above)
   - game.js

5. **Integration Layer** (must load last)
   - game-integration.js

## Size Analysis

```
Total Project Size: ~600KB

Breakdown:
- JavaScript:  ~200KB (18 files)
- CSS:         ~50KB (2 files)
- Images:      ~350KB (22 PNG files)
- HTML:        ~15KB (2 files)
- Docs:        ~100KB (20+ markdown files)
```

## Dependencies

✅ **Zero external dependencies!**
- No npm packages
- No frameworks (React, Vue, etc.)
- No libraries (jQuery, etc.)
- Pure vanilla JavaScript

## Browser Support

✅ Modern browsers (2020+)
- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Opera ✅

## Key Files to Know

| File | Purpose | Size | Importance |
|------|---------|------|------------|
| `js/core/game.js` | Main game engine | 50KB | ⭐⭐⭐⭐⭐ Critical |
| `js/ui/game-integration.js` | Connects all systems | 16KB | ⭐⭐⭐⭐⭐ Critical |
| `css/styles.css` | All game styling | 35KB | ⭐⭐⭐⭐ Important |
| `js/features/analytics.js` | Performance tracking | 10KB | ⭐⭐⭐ Nice to have |
| `js/ui/practice-ui.js` | Practice mode UI | 16KB | ⭐⭐⭐ Nice to have |

## What's Where?

### Want to change...

**Battle mechanics?** → `js/core/game.js`

**How questions are generated?** → `js/core/game.js` (generateQuestions function)

**Evolution stages?** → `js/core/game.js` (evolutionStages array)

**Visual appearance?** → `css/styles.css`

**Animations?** → `css/enhancements.css`

**Sound effects?** → `js/core/sounds.js`

**Language translations?** → `js/core/translations.js`

**Achievements?** → `js/features/achievements.js`

**Power-ups?** → `js/features/powerups.js`

**Hints?** → `js/features/hints.js`

**Practice mode?** → `js/ui/practice-ui.js`

**Challenge mode?** → `js/ui/challenge-ui.js`

**Stats dashboard?** → `js/ui/stats-screen.js`

**Enemy collection?** → `js/ui/enemy-pokedex.js`

## Organization Principles

1. **Core** = Essential game engine functionality
2. **Features** = Optional game mechanics that can be disabled
3. **UI** = User interface components and screens
4. **Legacy** = Old code kept for reference
5. **Docs** = All documentation

---

**Last Updated**: February 1, 2026
**Structure Version**: 3.0 (Clean & Organized)
