# 🦖 KAIJU - Math Battle Arena

An epic Godzilla-themed RPG multiplication game for iPad! Watch your Godzilla grow stronger as you master multiplication tables through intense kaiju battles.

## 🎮 Features

### Multi-Profile System
- **Create Multiple Profiles**: Each player gets their own profile with persistent progress
- **Profile Selection**: Easy profile switching on startup
- **Persistent Storage**: All progress saved locally in browser

### Dynamic RPG Battle System
- **HP-Based Combat**: Both you and enemy have health bars
- **Adaptive Enemies**: Enemy strength scales with your level
- **12 Unique Kaiju**: Random enemy selection from roster including Rodan, Mothra, King Ghidorah, and more
- **Battle Until Victory/Defeat**: Fight continues until someone's HP reaches zero

### Smart Difficulty Scaling
- **Question Difficulty**: Easy questions (0x, 1x, 10x) deal less damage
- **Hard Questions**: Difficult tables (7x, 8x, 9x) deal bonus damage
- **Speed Bonuses**: Answer faster for more damage (up to 20 bonus damage)
- **Balanced Gameplay**: Rewards both accuracy and speed

### Combo & Supercharge System
- **Combo Tracking**: Build combos with correct, fast answers (under 5 seconds)
- **Visual Feedback**: Combo counter shows your streak
- **Supercharge Attack**: After 10 fast correct answers, unleash ATOMIC BREATH!
- **Massive Damage**: Special attack deals 40% of enemy's max HP

### Progression System
- **5 Evolution Stages**: Baby Godzilla → Young Godzilla → Godzilla → Burning Godzilla → King Godzilla
- **Level System**: Gain levels every 100 XP
- **XP Rewards**: Based on damage dealt, accuracy, speed, and victory
- **Visual Growth**: Your Godzilla sprite grows bigger as you evolve

### Battle History & Analytics
- **Detailed Battle Logs**: Every battle is recorded with full statistics
- **Question-by-Question Breakdown**: See exactly which questions you answered and how fast
- **Performance Tracking**: Review accuracy, average speed, and total duration
- **Last 50 Battles**: Complete history with filters

### iPad Optimized
- **Touch Controls**: Large, responsive buttons
- **No Scrolling Issues**: Fixed viewport for smooth gameplay
- **Smooth Animations**: Attack effects, damage numbers, and transitions
- **Fast Performance**: Optimized for mobile devices

## 🎯 How to Play

### Setup
1. Open `index.html` in a browser on your iPad
2. Create a profile (or select existing one)
3. Select multiplication tables to practice (1x through 12x)
4. Press "START BATTLE!"

### Battle Flow
1. **Intro Screen**: See your enemy's stats (HP, Level)
2. **Answer Questions**: Type answer and press "ATTACK!" button
3. **Build Combos**: Answer correctly and fast (under 5 seconds)
4. **Special Attack**: After 10-combo, unleash ATOMIC BREATH!
5. **Win or Lose**: Battle ends when HP reaches zero

### Scoring
- **Base Damage**: 15-30 per correct answer
- **Speed Bonus**: Up to +20 for fast answers
- **Difficulty Bonus**: Extra damage for hard questions
- **Combo Bonus**: +2 damage per combo level
- **Special Attack**: 40% of enemy's max HP

### XP & Leveling
- **Victory Bonus**: +50 XP
- **Base XP**: Equal to total damage dealt
- **Accuracy Bonus**: +5 XP per 10% accuracy
- **Speed Bonus**: +20 XP if avg under 5s, +10 if under 7s
- **Level Up**: Every 100 XP
- **Evolution**: At 100, 300, 600, 1000 XP

## 📊 Battle History

Access your complete battle history from the main menu:
- **Battle Cards**: Quick overview of each battle
- **Detailed View**: Click any battle to see full breakdown
- **Question Analysis**: Review every question and your performance
- **Stats Tracking**: Accuracy, speed, damage, duration

## 🎨 Visual Features

### Battle Effects
- ⚡ **Damage Numbers**: Float up showing damage dealt
- 💥 **Attack Animations**: Sprite shake when attacking
- 🔥 **Combo Display**: Dynamic combo counter
- ✨ **Special Effects**: Supercharge activation glow
- 📊 **HP Bars**: Real-time health visualization

### Themes
- 🌃 **Dark Battle Arena**: Immersive combat environment
- 🟢 **Glowing UI**: Neon green Godzilla theme
- 🔴 **Enemy Colors**: Red accents for enemies
- 💜 **Special Attack**: Purple glow for supercharge

## 🛠️ Technical Details

### Files
- `index.html` - Game structure
- `game.js` - All game logic
- `styles.css` - Visual styling

### Storage
- Uses localStorage for persistence
- Profiles stored as JSON objects
- Battle history limited to last 50 battles

### Browser Compatibility
- Works on all modern browsers
- Optimized for Safari on iPad
- Touch and mouse support

## 🎓 Educational Value

- **Multiplication Practice**: All tables 1-12
- **Speed Training**: Encourages quick mental math
- **Pattern Recognition**: Easier vs harder questions
- **Progress Tracking**: See improvement over time
- **Motivational**: RPG elements keep kids engaged

## 🚀 Future Ideas

- More enemy kaiju types
- Boss battles with unique mechanics
- Achievements system
- Daily challenges
- Co-op multiplayer mode
- Division, addition, subtraction modes

---

**Made for awesome math practice! 🦖⚡**
