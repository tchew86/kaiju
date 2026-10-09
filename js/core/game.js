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
    battleHistory: [],
    // Upgradeable stats
    upgrades: {
        maxHP: 0,      // Each upgrade adds +20 max HP
        power: 0       // Each upgrade adds +15% damage
    },
    availableUpgradePoints: 0,  // Earned from XP milestones
    // Phase 2: Analytics
    analytics: {
        facts: {},        // Per-fact performance tracking
        tables: {},       // Per-table statistics
        mistakes: [],     // Last 100 mistakes
        sessions: []      // Session history (last 30)
    },
    // Phase 2: Achievements
    achievements: {
        unlocked: [],     // Array of unlocked achievement IDs
        progress: {}      // Progress tracking for each achievement
    },
    // Phase 2: Streaks
    streaks: {
        currentWinStreak: 0,
        longestWinStreak: 0,
        daily: 0,
        lastPlayDate: null
    },
    // Phase 2: Enemy Collection
    enemiesDefeated: {},  // Track defeated enemies for Pokedex
    // Phase 2: Campaign Progress
    campaignProgress: {
        completedChapters: [],
        currentChapter: 1
    },
    // Phase 2: Settings
    settings: {
        language: 'en',      // en, nl, de, vi
        operation: 'multiply', // multiply, add
        soundEnabled: true,
        showHints: true,
        // Addition mode settings
        includeSubtraction: false,
        allowOverhang: false,
        // Last selected tables/ranges
        lastSelectedTables: []
    }
});

let playerProfile = createNewProfile('Player');

// Evolution stages - 22 total levels matching image files (0-21)
const evolutionStages = [
    { name: 'EGG', xpNeeded: 0, size: 0.6 },                        // 0
    { name: 'BABY', xpNeeded: 100, size: 0.7 },                     // 1
    { name: 'TODDLER', xpNeeded: 250, size: 0.8 },                  // 2
    { name: 'KIDDO', xpNeeded: 450, size: 0.85 },                   // 3
    { name: 'TEEN', xpNeeded: 700, size: 0.9 },                     // 4
    { name: 'YOUNG GIGAREX', xpNeeded: 1000, size: 0.95 },         // 5 - close to adolescence
    { name: 'JUNIOR GIGAREX', xpNeeded: 1400, size: 1.0 },         // 6 - tweens
    { name: 'GIGAREX', xpNeeded: 1900, size: 1.1 },                // 7
    { name: 'ATOMIC GIGAREX', xpNeeded: 2600, size: 1.2 },         // 8
    { name: 'FIRE GIGAREX', xpNeeded: 3500, size: 1.25 },          // 9
    { name: 'WATER GIGAREX', xpNeeded: 4600, size: 1.3 },          // 10
    { name: 'EARTH GIGAREX', xpNeeded: 6000, size: 1.35 },         // 11
    { name: 'MECH GIGAREX I', xpNeeded: 7800, size: 1.4 },         // 12
    { name: 'MECH GIGAREX II', xpNeeded: 10000, size: 1.45 },      // 13
    { name: 'MECH GIGAREX III', xpNeeded: 12800, size: 1.5 },      // 14
    { name: 'MEGA MECH GIGAREX', xpNeeded: 16300, size: 1.55 },    // 15
    { name: 'ULTRA MECH GIGAREX', xpNeeded: 20800, size: 1.6 },    // 16
    { name: 'ATOMIC MECH GIGAREX', xpNeeded: 26500, size: 1.65 },  // 17
    { name: 'MEGA ATOMIC MECH', xpNeeded: 33800, size: 1.7 },       // 18
    { name: 'ULTRA ATOMIC MECH', xpNeeded: 43000, size: 1.75 },     // 19
    { name: 'ULTRA-MEGA ATOMIC MECH', xpNeeded: 55000, size: 1.8 }, // 20
    { name: 'GIGAR3X', xpNeeded: 70000, size: 2.0 }                // 21 - ULTIMATE
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
    acceptingAnswer: false,
    totalDamageDealt: 0,
    // Combo system
    comboCount: 0,
    superchargeActive: false,
    superFastCount: 0, // Track super-fast answers specifically for atomic breath
    // Battle log
    battleStartTime: null,
    questionLog: []
};

// Enemy Kaiju templates (for random generation)
// All enemies have corresponding images in images/enemies/ folder
const enemyTemplates = [
    // Common enemies (easier battles)
    { name: 'SPIKEBACK', emoji: '🦔', tier: 1 },
    { name: 'ROCKHORN', emoji: '🦖', tier: 1 },
    { name: 'SKYTALON', emoji: '🦅', tier: 1 },
    { name: 'GRUBLING', emoji: '🐛', tier: 1 },
    { name: 'BOLTBOT', emoji: '🤖', tier: 1 },

    // Mid-tier enemies
    { name: 'LUNAWING', emoji: '🦋', tier: 2 },
    { name: 'RAZORBEAK', emoji: '⚔️', tier: 2 },
    { name: 'SLUDGEMAW', emoji: '☠️', tier: 2 },
    { name: 'FINBACK', emoji: '🦕', tier: 2 },
    { name: 'DRILLHORN', emoji: '🪲', tier: 2 },
    { name: 'STONELION', emoji: '🦁', tier: 2 },
    { name: 'VINEMAW', emoji: '🌿', tier: 2 },

    // Advanced enemies
    { name: 'GRIMAPE', emoji: '🦍', tier: 3 },
    { name: 'TRISTORM', emoji: '🐲', tier: 3 },
    { name: 'DOOMCLAW', emoji: '👹', tier: 3 },
    { name: 'RAZORBEAK X', emoji: '⚔️', tier: 3 },
    { name: 'SCARLORD', emoji: '👑', tier: 3 },

    // Boss tier enemies
    { name: 'MECHATITAN', emoji: '🤖', tier: 4 },
    { name: 'MECHA TRISTORM', emoji: '🐉', tier: 4 },
    { name: 'OMEGA MECHATITAN', emoji: '🦾', tier: 4 },
    { name: 'DOOMCLAW PRIME', emoji: '💀', tier: 4 },
    { name: 'GIGAFIST', emoji: '💥', tier: 4 },
    { name: 'MUTAGEN', emoji: '🧪', tier: 4 },
    { name: 'MUTAGEN II', emoji: '🧬', tier: 4 }
];

// Generate enemy based on player level
function generateEnemy(playerLevel) {
    // Determine appropriate tier based on player level
    let targetTier = 1;
    if (playerLevel >= 15) targetTier = 4; // Boss tier for high levels
    else if (playerLevel >= 10) targetTier = 3; // Advanced
    else if (playerLevel >= 5) targetTier = 2; // Mid-tier
    else targetTier = 1; // Common

    // Filter enemies by tier (with small chance for tier variance)
    const tierVariance = Math.random() < 0.2 ? (Math.random() < 0.5 ? -1 : 1) : 0;
    const actualTier = Math.max(1, Math.min(4, targetTier + tierVariance));

    const availableEnemies = enemyTemplates.filter(e => e.tier === actualTier);
    const template = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];

    const levelVariance = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
    const enemyLevel = Math.max(1, playerLevel + levelVariance);

    // Generate image filename from enemy name
    const imageFilename = template.name.replace(/\s+/g, '_').toUpperCase() + '.png';

    return {
        name: template.name,
        emoji: template.emoji,
        tier: template.tier,
        level: enemyLevel,
        hp: 60 + (enemyLevel * 15) + Math.floor(Math.random() * 20),
        damageMultiplier: 0.8 + (enemyLevel * 0.1),
        image: imageFilename
    };
}

// DOM Elements
const screens = {
    profile: document.getElementById('profile-screen'),
    start: document.getElementById('start-screen'),
    battleIntro: document.getElementById('battle-intro-screen'),
    battle: document.getElementById('battle-screen'),
    'results-screen': document.getElementById('results-screen'),
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
    const lastProfile = StorageUtils.readText('lastProfile');
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

    // Apply language to static UI even when no profile is loaded yet
    if (typeof updateUILanguage === 'function') {
        updateUILanguage();
    }
});

// Profile Management
function loadProfiles() {
    const profiles = StorageUtils.read('kaijuProfiles', () => ({}), value =>
        StorageUtils.isRecord(value) && Object.values(value).every(profile => StorageUtils.isRecord(profile))
    );
    // A null prototype makes names such as "constructor" ordinary profile keys.
    return Object.assign(Object.create(null), profiles);
}

function saveProfiles(profiles) {
    return StorageUtils.write('kaijuProfiles', profiles);
}

function loadProfile(profileName) {
    const profiles = loadProfiles();
    if (Object.hasOwn(profiles, profileName)) {
        playerProfile = migrateProfile(profiles[profileName]);
        currentProfileName = profileName;
    } else {
        playerProfile = createNewProfile(profileName);
        currentProfileName = profileName;
        saveCurrentProfile();
    }
    // Remember last profile
    StorageUtils.writeText('lastProfile', profileName);
}

// Migrate old profiles to new structure
function migrateProfile(oldProfile) {
    const profile = StorageUtils.mergeDefaults(createNewProfile('Player'), oldProfile);
    profile.settings.language = ['en', 'nl', 'de', 'vi'].includes(profile.settings.language) ? profile.settings.language : 'en';
    profile.settings.operation = ['multiply', 'add'].includes(profile.settings.operation) ? profile.settings.operation : 'multiply';
    profile.level = Math.floor(profile.xp / 100) + 1;
    profile.campaign = StorageUtils.mergeDefaults({ currentChapter: 1, completedChapters: [] }, profile.campaign);
    profile.challengeScores = Array.isArray(profile.challengeScores) ? profile.challengeScores.filter(entry => StorageUtils.isRecord(entry) && Number.isFinite(entry.score)) : [];
    profile.battleHistory = profile.battleHistory.filter(StorageUtils.isRecord);
    return profile;
}

function saveCurrentProfile() {
    if (!currentProfileName || !playerProfile) return false;
    const profiles = loadProfiles();
    profiles[currentProfileName] = playerProfile;
    return saveProfiles(profiles);
}

function getAllProfileNames() {
    const profiles = loadProfiles();
    return Object.keys(profiles);
}

function updateProfileDisplay() {
    try {
        // Ensure profile has all required fields
        if (!playerProfile.settings) {
            playerProfile.settings = { language: 'en', operation: 'multiply', soundEnabled: true, showHints: true };
        }

        // Apply the profile's language to all static UI (data-i18n sweep)
        if (typeof updateUILanguage === 'function') {
            updateUILanguage();
        }

        // Update level and power
        document.getElementById('player-level').textContent = playerProfile.level;

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

    // Update Gigarex size and visual stage based on evolution
    const gigarexSprite = document.getElementById('start-gigarex');
    gigarexSprite.style.transform = `scale(${stage.size})`;

    // Remove old stage classes and add new one
    gigarexSprite.className = 'gigarex-sprite';
    gigarexSprite.classList.add(`stage-${currentStage}`);

    // Update XP bar
    const nextStageIndex = Math.min(currentStage + 1, evolutionStages.length - 1);
    const currentXP = playerProfile.xp;
    const currentStageXP = evolutionStages[currentStage].xpNeeded;
    const nextStageXP = evolutionStages[nextStageIndex].xpNeeded;
    const xpProgress = currentXP - currentStageXP;
    const xpNeeded = nextStageXP - currentStageXP;
    // At the final evolution stage there is no "next stage", so xpNeeded is 0.
    const atMaxStage = nextStageIndex === currentStage;

    document.getElementById('current-xp').textContent = xpProgress;
    document.getElementById('needed-xp').textContent = atMaxStage ? 'MAX' : xpNeeded;

    // Update total XP display
    const totalXpEl = document.getElementById('total-xp');
    if (totalXpEl) {
        totalXpEl.textContent = currentXP;
    }

    // Avoid division by zero at max stage (xpNeeded === 0 → Infinity/NaN)
    const percentage = atMaxStage || xpNeeded <= 0 ? 100 : (xpProgress / xpNeeded) * 100;
    document.getElementById('level-fill').style.width = Math.min(100, percentage) + '%';

    // Update Power and HP display on start screen
    if (!playerProfile.upgrades) {
        playerProfile.upgrades = { maxHP: 0, power: 0 };
    }

    // Calculate max potential damage (instant answer, max base damage, avg difficulty)
    const maxBaseDamage = 30; // 15 + max random 15
    const instantSpeedBonus = 20; // 10 - 0 seconds * 2
    const avgDifficultyBonus = 15; // approximate for difficulty 1.5
    const maxDamageBeforePower = maxBaseDamage + instantSpeedBonus + avgDifficultyBonus; // ~65
    const powerMultiplier = 1 + (playerProfile.upgrades.power * 0.15);
    const maxPotentialDamage = Math.floor(maxDamageBeforePower * powerMultiplier);

    // HP only comes from upgrades now (no auto level increase)
    const baseHP = 100;  // Base HP always 100
    const hpBonus = playerProfile.upgrades.maxHP * 20;  // +20 HP per upgrade
    const totalHP = baseHP + hpBonus;

    const powerEl = document.getElementById('player-power');
    const hpEl = document.getElementById('player-hp-display');

    if (powerEl) {
        powerEl.textContent = maxPotentialDamage;
    } else {
        console.error('❌ Could not find player-power element!');
    }

    if (hpEl) {
        hpEl.textContent = totalHP;
    } else {
        console.error('❌ Could not find player-hp-display element!');
    }

    // Update upgrade system
    if (!playerProfile.upgrades) {
        playerProfile.upgrades = { maxHP: 0, power: 0 };
    }
    if (playerProfile.availableUpgradePoints === undefined) {
        playerProfile.availableUpgradePoints = 0;
    }

    const upgradeSection = document.getElementById('upgrade-section');
    if (upgradeSection) {
        // Show upgrade section if player has any points
        upgradeSection.style.display = playerProfile.availableUpgradePoints > 0 ? 'block' : 'none';

        // Update display
        document.getElementById('upgrade-points').textContent = playerProfile.availableUpgradePoints;
        document.getElementById('hp-level').textContent = playerProfile.upgrades.maxHP;
        document.getElementById('hp-bonus').textContent = playerProfile.upgrades.maxHP * 20;
        document.getElementById('power-level').textContent = playerProfile.upgrades.power;
        document.getElementById('power-bonus').textContent = playerProfile.upgrades.power * 15;

        // Enable/disable upgrade buttons
        const hpBtn = document.getElementById('upgrade-hp-btn');
        const powerBtn = document.getElementById('upgrade-power-btn');
        if (hpBtn && powerBtn) {
            hpBtn.disabled = playerProfile.availableUpgradePoints <= 0;
            powerBtn.disabled = playerProfile.availableUpgradePoints <= 0;
        }
    }

    // Phase 2: Update language and operation selectors
    const langSelect = document.getElementById('language-select');
    if (langSelect && playerProfile.settings) {
        langSelect.value = playerProfile.settings.language || 'en';
    }

    // Phase 2: Show recommendations widget
    if (typeof recommendationsWidget !== 'undefined' && playerProfile.settings) {
        const recContainer = document.getElementById('recommendations-container');
        if (recContainer) {
            recContainer.innerHTML = ''; // Clear previous
            const lang = playerProfile.settings.language || 'en';
            recContainer.appendChild(recommendationsWidget.show(playerProfile, lang));
        }
    }

    // Phase 2: Update daily streak
    if (typeof updateDailyStreak === 'function') {
        updateDailyStreak();
    }

    // Phase 2: Check for achievements
    try {
        if (typeof achievementManager !== 'undefined' && typeof achievementManager.updateProgress === 'function') {
            achievementManager.updateProgress('evolution', playerProfile.evolutionStage, playerProfile);
        }
    } catch (error) {
        console.error('Error checking achievements:', error);
    }

    } catch (error) {
        console.error('Error in updateProfileDisplay:', error);
        // Ensure settings exist even if there was an error
        if (!playerProfile.settings) {
            playerProfile.settings = { language: 'en', operation: 'multiply', soundEnabled: true, showHints: true };
        }
    }
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
            alert(t('enterProfileName'));
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
    const allProfiles = loadProfiles();
    const profiles = Object.keys(allProfiles);

    profileList.innerHTML = '';

    if (profiles.length === 0) {
        profileList.innerHTML = '<p class="no-profiles">No profiles yet. Create one below!</p>';
        return;
    }

    profiles.forEach(name => {
        const profileItem = document.createElement('div');
        profileItem.className = 'profile-item';

        // Load profile data to get stats
        const profile = migrateProfile(allProfiles[name]);

        // Get evolution stage
        let evolutionStage = 0;
        if (profile) {
            for (let i = evolutionStages.length - 1; i >= 0; i--) {
                if (profile.xp >= evolutionStages[i].xpNeeded) {
                    evolutionStage = i;
                    break;
                }
            }
        }

        const btn = document.createElement('button');
        btn.className = 'profile-btn';
        btn.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 20px;
        `;

        // Calculate stats
        const level = profile ? Math.floor(profile.xp / 100) + 1 : 1;
        const maxHP = profile ? 100 + ((profile.upgrades?.maxHP || 0) * 20) : 100;  // Base 100 + upgrades only
        const powerUpgrades = profile ? (profile.upgrades?.power || 0) : 0;
        const maxDamage = Math.floor((30 + 20 + 15) * (1 + (powerUpgrades * 0.15)));

        btn.innerHTML = `
            <div class="gigarex-sprite stage-${evolutionStage}" style="
                width: 60px;
                height: 60px;
                flex-shrink: 0;
            "></div>
            <div style="flex: 1; text-align: left;">
                <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 5px; color: #000;">${UIComponents.escapeHtml(name)}</div>
                <div style="font-size: 0.9rem; color: #000; font-weight: 900;">
                    Lvl ${level} • ${evolutionStages[evolutionStage].name}
                </div>
                <div style="font-size: 0.85rem; color: #000; display: flex; gap: 10px; margin-top: 3px; font-weight: 900;">
                    <span>❤️ ${maxHP} HP</span>
                    <span>⚔️ ${maxDamage} DMG</span>
                </div>
            </div>
        `;

        // Touch and mouse support
        btn.addEventListener('click', () => {
            loadProfile(name);
            updateProfileDisplay();
            switchScreen('start');
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'profile-delete-btn';
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Delete profile';

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Show confirmation dialog
            const confirmDelete = confirm(`⚠️ DELETE PROFILE?\n\nAre you sure you want to delete "${name}"?\n\nThis action cannot be undone!\n\nAll progress, XP, and achievements will be lost.`);

            if (confirmDelete) {
                deleteProfile(name);
                renderProfileList();
            }
        });

        profileItem.appendChild(btn);
        profileItem.appendChild(deleteBtn);
        profileList.appendChild(profileItem);
    });
}

function deleteProfile(name) {
    const allProfiles = loadProfiles();
    delete allProfiles[name];
    saveProfiles(allProfiles);

    // If we just deleted the current profile, clear it
    if (currentProfileName === name) {
        currentProfileName = null;
        playerProfile = null;
        StorageUtils.remove('lastProfile');
    }
}

// Start Screen Logic
function initStartScreen() {
    const startBtn = document.getElementById('start-battle-btn');

    startBtn.addEventListener('click', () => {
        // Show battle setup modal instead of starting directly
        if (typeof showBattleSetup === 'function') {
            showBattleSetup();
        } else {
            // Fallback if function not loaded
            if (gameState.selectedTables.length > 0) {
                startGame();
            }
        }
    });

    // Phase 2: Menu buttons
    const statsBtn = document.getElementById('stats-btn');
    if (statsBtn) {
        statsBtn.addEventListener('click', () => {
            if (typeof statsScreen !== 'undefined') {
                statsScreen.show(playerProfile, playerProfile.settings.language);
            }
        });
    }

    const pokedexBtn = document.getElementById('pokedex-btn');
    if (pokedexBtn) {
        pokedexBtn.addEventListener('click', () => {
            if (typeof enemyPokedex !== 'undefined') {
                enemyPokedex.show(playerProfile, playerProfile.settings.language);
            }
        });
    }

    // Upgrade buttons
    document.getElementById('upgrade-hp-btn').addEventListener('click', () => {
        if (playerProfile.availableUpgradePoints > 0) {
            playerProfile.availableUpgradePoints--;
            playerProfile.upgrades.maxHP++;
            saveCurrentProfile();
            updateProfileDisplay();
        }
    });

    document.getElementById('upgrade-power-btn').addEventListener('click', () => {
        if (playerProfile.availableUpgradePoints > 0) {
            playerProfile.availableUpgradePoints--;
            playerProfile.upgrades.power++;
            saveCurrentProfile();
            updateProfileDisplay();
        }
    });

    const modesBtn = document.getElementById('modes-btn');
    if (modesBtn) {
        modesBtn.addEventListener('click', () => {
            if (typeof showGameModesSelector === 'function') {
                showGameModesSelector();
            } else {
                console.error('❌ showGameModesSelector is not a function!');
            }
        });
    }

    const manualBtn = document.getElementById('manual-btn');
    if (manualBtn) {
        manualBtn.addEventListener('click', () => {
            if (typeof showManual === 'function') {
                showManual();
            } else {
                console.error('❌ showManual is not a function!');
            }
        });
    }

    // Change Profile button
    const changeProfileBtn = document.getElementById('change-profile-btn');
    if (changeProfileBtn) {
        changeProfileBtn.addEventListener('click', () => {
            switchScreen('profile');
        });
    }

    // Phase 2: Language selector - event listener only (value set in updateProfileDisplay)
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            if (!playerProfile.settings) {
                playerProfile.settings = { language: 'en', operation: 'multiply', soundEnabled: true, showHints: true };
            }
            playerProfile.settings.language = e.target.value;
            saveCurrentProfile();
            updateProfileDisplay(); // Refresh widgets with new language
        });
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
    const operation = playerProfile.settings.operation || 'multiply';
    const settings = playerProfile.battleSettings || playerProfile.settings;

    gameState.selectedTables.forEach(item => {
        const table = typeof item === 'number' ? item : item?.table;
        if (operation !== 'add' && table !== undefined) {
            // Keep the existing battle distribution: ten ordered, ten varied factors.
            for (let i = 1; i <= 20; i++) {
                const factor = i <= 10 ? i : Math.floor(Math.random() * table) + 1;
                questions.push(QuestionGenerator.withFact({
                    num1: table, num2: factor, answer: table * factor,
                    operation: 'multiply', difficulty: getQuestionDifficulty(table, factor)
                }));
            }
        } else {
            const { min, max } = QuestionGenerator.parseRange(item);
            for (let i = 0; i < 20; i++) {
                const question = QuestionGenerator.generateAdditionQuestion(
                    min, max, !!settings.includeThreePart, !!settings.includeSubtraction, !!settings.allowOverhang
                );
                question.difficulty = getQuestionDifficulty(question.num1, question.num2);
                questions.push(question);
            }
        }
    });

    ArrayUtils.shuffle(questions);
    const multiply = questions.filter(question => question.operation === 'multiply');
    const addition = questions.filter(question => question.operation !== 'multiply');
    if (multiply.length && addition.length) {
        const balanced = [];
        for (let i = 0; i < Math.max(multiply.length, addition.length); i++) {
            if (multiply[i]) balanced.push(multiply[i]);
            if (addition[i]) balanced.push(addition[i]);
        }
        return balanced;
    }
    return questions;
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
        if (!gameState.acceptingAnswer) return;
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

    KeyboardHandler.addHandler(KeyboardHandler.createHandler(
        gameState,
        'current-answer',
        checkAnswer,
        () => gameState.battleActive && gameState.acceptingAnswer
    ));
}

function executeSpecialAttack() {
    if (!gameState.battleActive || !gameState.acceptingAnswer || !gameState.superchargeActive) return;
    setBattleInputEnabled(false);
    clearInterval(gameState.timerInterval);
    gameState.superchargeActive = false;
    gameState.comboCount = 0;
    gameState.superFastCount = 0; // Reset super-fast counter after using atomic breath

    // Track atomic breath usage for achievements
    if (!playerProfile.stats) {
        playerProfile.stats = {};
    }
    playerProfile.stats.atomicBreathUsed = (playerProfile.stats.atomicBreathUsed || 0) + 1;

    // Massive damage!
    const specialDamage = Math.floor(gameState.enemyMaxHP * 0.4); // 40% of enemy max HP
    gameState.enemyHP = Math.max(0, gameState.enemyHP - specialDamage);
    gameState.totalDamageDealt += specialDamage;
    gameState.score += specialDamage;

    // Log atomic breath usage in question log
    gameState.questionLog.push({
        question: '⚡ ATOMIC BREATH ⚡',
        userAnswer: null,
        correctAnswer: null,
        correct: true,
        damage: specialDamage,
        timeSpent: 0,
        isSpecialAttack: true
    });

    showBattleMessage(t('atomicBreathFired'), 'supercharge');
    showDamageNumber(specialDamage, 'player');
    playAttackAnimation('player');

    updateHPDisplay();
    updateComboDisplay();

    setTimeout(() => {
        // Phase 2: Use power-up charge
        if (typeof usePowerUpCharge === 'function') {
            try {
                usePowerUpCharge();
            } catch (error) {
                console.error('Error using power-up charge:', error);
            }
        }

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
    if (!gameState.battleActive || !gameState.acceptingAnswer) return;
    if (gameState.currentAnswer.length < 3) {
        gameState.currentAnswer += num;
        updateAnswerDisplay();
    }
}

function updateAnswerDisplay() {
    document.getElementById('current-answer').textContent = gameState.currentAnswer || '?';
}

function startGame() {
    // Save selected tables to profile
    if (!playerProfile.settings) {
        playerProfile.settings = { language: 'en', operation: 'multiply', soundEnabled: true, showHints: true };
    }
    playerProfile.settings.lastSelectedTables = JSON.parse(JSON.stringify(gameState.selectedTables));
    saveCurrentProfile();

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
    gameState.superFastCount = 0; // Reset super-fast answer counter
    gameState.questionLog = [];
    gameState.battleStartTime = Date.now();
    gameState.gameEnded = false; // Reset the endGame guard flag
    gameState.wasLowHP = false; // Track if player was ever below 20% HP for comeback achievement
    gameState.maxCombo = 0; // Track max combo for achievement

    // Generate enemy based on player level (if not already set by campaign/battle setup)
    // Only generate if no enemy exists, or if skipIntro is explicitly false (not just missing)
    if (!gameState.currentEnemy) {
        gameState.currentEnemy = generateEnemy(playerProfile.level);
    }
    // Don't regenerate if enemy is already set (campaign mode, custom battles, etc.)

    // Set HP based only on upgrades (no auto level increase)
    const hpUpgrades = playerProfile.upgrades?.maxHP || 0;
    gameState.playerMaxHP = 100 + (hpUpgrades * 20);  // Base 100 + upgrades only
    gameState.playerHP = gameState.playerMaxHP;
    gameState.enemyMaxHP = gameState.currentEnemy.hp;
    gameState.enemyHP = gameState.enemyMaxHP;

    // Skip intro if enemy was set by battle setup
    if (gameState.currentEnemy.skipIntro) {
        // Go directly to battle screen
        const maxBaseDamage = 30;
        const instantSpeedBonus = 20;
        const avgDifficultyBonus = 15;
        const maxDamageBeforePower = maxBaseDamage + instantSpeedBonus + avgDifficultyBonus;
        const powerMultiplier = 1 + ((playerProfile.upgrades?.power || 0) * 0.15);
        const maxPotentialDamage = Math.floor(maxDamageBeforePower * powerMultiplier);

        document.getElementById('battle-player-power').textContent = maxPotentialDamage;
        document.getElementById('battle-player-level').textContent = playerProfile.level;

        const enemyMaxAttack = Math.floor(30 * gameState.currentEnemy.damageMultiplier);
        document.getElementById('battle-enemy-power').textContent = enemyMaxAttack;
        document.getElementById('battle-enemy-level').textContent = gameState.currentEnemy.level;

        // Set enemy sprite with image
        const enemySpriteEl = document.getElementById('enemy-sprite');
        if (enemySpriteEl && gameState.currentEnemy.image) {
            enemySpriteEl.className = 'kaiju-sprite enemy battle-sprite';
            enemySpriteEl.style.backgroundImage = `url('images/enemies/${gameState.currentEnemy.image}')`;
            enemySpriteEl.style.backgroundSize = 'contain';
            enemySpriteEl.style.backgroundRepeat = 'no-repeat';
            enemySpriteEl.style.backgroundPosition = 'center';
        }

        switchScreen('battle');
        setTimeout(() => showQuestion(), 500);
    } else {
        // Show battle intro
        showBattleIntro();
    }
}

function showBattleIntro() {
    const enemy = gameState.currentEnemy;

    document.getElementById('intro-enemy-name').textContent = enemy.name;
    document.getElementById('intro-enemy-hp').textContent = gameState.enemyMaxHP;
    document.getElementById('intro-enemy-level').textContent = enemy.level;

    // Calculate and display enemy max attack damage
    const enemyMaxAttack = Math.floor(30 * enemy.damageMultiplier);
    document.getElementById('intro-enemy-attack').textContent = enemyMaxAttack;

    // Set enemy sprite with image
    const spriteEl = document.getElementById('intro-enemy-sprite');
    spriteEl.className = 'kaiju-sprite enemy large';
    spriteEl.style.backgroundImage = `url('images/enemies/${enemy.image}')`;
    spriteEl.style.backgroundSize = 'contain';
    spriteEl.style.backgroundRepeat = 'no-repeat';
    spriteEl.style.backgroundPosition = 'center';

    // Show campaign info if this is a campaign battle
    const campaignInfo = document.getElementById('campaign-question-info');
    if (gameState.campaignChapter && campaignInfo) {
        campaignInfo.style.display = 'block';

        // Display operation
        const operationText = gameState.selectedOperation === 'multiply' ? t('opMultiplication') :
                              gameState.selectedOperation === 'add' ? t('opAddition') : t('opDivision');
        document.getElementById('campaign-operation').textContent = operationText;

        // Display tables
        const tablesText = gameState.selectedTables.map(t => `${t}×`).join(', ');
        document.getElementById('campaign-tables').textContent = tablesText;
    } else if (campaignInfo) {
        campaignInfo.style.display = 'none';
    }

    switchScreen('battleIntro');
}

function initBattleIntroScreen() {
    document.getElementById('begin-battle-btn').addEventListener('click', () => {
        // Update battle screen stats - calculate max damage
        const maxBaseDamage = 30;
        const instantSpeedBonus = 20;
        const avgDifficultyBonus = 15;
        const maxDamageBeforePower = maxBaseDamage + instantSpeedBonus + avgDifficultyBonus;
        const powerMultiplier = 1 + ((playerProfile.upgrades?.power || 0) * 0.15);
        const maxPotentialDamage = Math.floor(maxDamageBeforePower * powerMultiplier);

        document.getElementById('battle-player-power').textContent = maxPotentialDamage;
        document.getElementById('battle-player-level').textContent = playerProfile.level;

        // Calculate enemy max attack damage (same as timeout damage: 15-30 base × multiplier)
        const enemyMaxAttack = Math.floor(30 * gameState.currentEnemy.damageMultiplier);
        document.getElementById('battle-enemy-power').textContent = enemyMaxAttack;
        document.getElementById('battle-enemy-level').textContent = gameState.currentEnemy.level;

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

    // Update UI - check if it's a 3-part question
    if (question.isThreePart && question.num3 !== undefined) {
        // 3-part question: x + y + z or x - y + z
        let operator1 = question.operation === 'subtract' ? '-' : '+';
        document.getElementById('question').textContent = `${question.num1} ${operator1} ${question.num2} + ${question.num3} = ?`;
    } else {
        // Regular 2-part question - use the question's operation field
        let operator = '×';
        if (question.operation === 'add') operator = '+';
        else if (question.operation === 'subtract') operator = '-';
        else if (question.operation === 'multiply') operator = '×';

        document.getElementById('question').textContent = `${question.num1} ${operator} ${question.num2} = ?`;
    }
    updateAnswerDisplay();
    updateHPDisplay();
    updateComboDisplay();

    // Set enemy name and sprite
    const enemy = gameState.currentEnemy;
    document.getElementById('enemy-name').textContent = enemy.name;

    const enemySpriteEl = document.getElementById('enemy-sprite');
    enemySpriteEl.className = 'kaiju-sprite enemy battle-sprite';
    enemySpriteEl.style.backgroundImage = `url('images/enemies/${enemy.image}')`;
    enemySpriteEl.style.backgroundSize = 'contain';
    enemySpriteEl.style.backgroundRepeat = 'no-repeat';
    enemySpriteEl.style.backgroundPosition = 'center';

    // Update player sprite with evolution stage
    const playerSprite = document.getElementById('player-sprite');
    playerSprite.className = 'kaiju-sprite gigarex battle-sprite';
    playerSprite.classList.add(`stage-${playerProfile.evolutionStage}`);

    // Start timer
    setBattleInputEnabled(true);
    startTimer();
}

function setBattleInputEnabled(enabled) {
    gameState.acceptingAnswer = enabled;
    document.querySelectorAll('#battle-screen .answer-btn').forEach(button => {
        button.disabled = !enabled;
    });
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
    if (!gameState.battleActive || !gameState.acceptingAnswer || !gameState.currentAnswer) return;
    setBattleInputEnabled(false);

    clearInterval(gameState.timerInterval);

    const userAnswer = parseInt(gameState.currentAnswer);
    const timeSpent = (Date.now() - gameState.startTime) / 1000;
    const isCorrect = userAnswer === gameState.currentCorrectAnswer;
    const question = gameState.questions[gameState.currentQuestionIndex];

    gameState.totalAnswers++;
    gameState.answerTimes.push(timeSpent);

    // Log question (damage will be added after calculation)
    // Format question string based on operation type
    let questionString;
    if (question.isThreePart) {
        questionString = `${question.num1} + ${question.num2} + ${question.num3}`;
    } else {
        const operationSymbol = question.operation === 'add' ? '+' :
                               question.operation === 'subtract' ? '-' : '×';
        questionString = `${question.num1} ${operationSymbol} ${question.num2}`;
    }

    const questionLogEntry = {
        question: questionString,
        correctAnswer: gameState.currentCorrectAnswer,
        userAnswer: userAnswer,
        timeSpent: timeSpent,
        correct: isCorrect,
        damageDealt: 0,
        hpLost: 0
    };
    gameState.questionLog.push(questionLogEntry);

    // Phase 2: Track analytics
    if (typeof trackQuestionAnalytics === 'function') {
        try {
            trackQuestionAnalytics(question, isCorrect, timeSpent);
        } catch (error) {
            console.error('Error tracking analytics:', error);
        }
    }

    if (isCorrect) {
        // Phase 2: Play correct sound
        try {
            if (typeof playSound === 'function') playSound('correct');
        } catch (e) { console.error('Sound error:', e); }
        gameState.correctAnswers++;

        // Check answer speed for different systems
        const isSuperFast = timeSpent < 2; // Atomic breath requires under 2 seconds

        // Update combo - now tracks ALL correct answers regardless of speed
        gameState.comboCount++;
        // Track max combo for achievements
        if (gameState.comboCount > gameState.maxCombo) {
            gameState.maxCombo = gameState.comboCount;
        }

        // Track super-fast answers for atomic breath separately
        if (isSuperFast) {
            gameState.superFastCount++;
        } else {
            // Reset super-fast counter if answer wasn't super-fast
            gameState.superFastCount = 0;
        }

        // Atomic breath activates after 5 consecutive super fast answers (under 2 seconds each)
        if (gameState.superFastCount >= 5 && !gameState.superchargeActive) {
            gameState.superchargeActive = true;
            showBattleMessage(t('atomicBreathReady'), 'supercharge');
            updateComboDisplay(); // Show the atomic breath button immediately
            setTimeout(() => {
                showBattleMessage(t('pressSpecialAttack'), 'supercharge');
            }, 1000);
            return; // Wait for special attack
        }

        // Calculate damage with difficulty multiplier and time reduction
        const baseDamage = 15 + Math.floor(Math.random() * 16);

        // Faster exponential time multiplier: Rewards fast answers, punishes slow ones more severely
        // At 0s: 1.0, at 2s: ~0.85, at 4s: ~0.60, at 6s: ~0.35, at 8s+: ~0.20
        const timeRatio = Math.min(timeSpent / 8, 1); // 0 to 1 (now based on 8 seconds instead of 10)
        const timeMultiplier = Math.pow(1 - timeRatio, 3.5) * 0.80 + 0.20; // Steeper exponential decay (3.5 instead of 2.5)

        const speedBonus = Math.floor(Math.max(0, (10 - timeSpent) * 2));
        const difficultyBonus = Math.floor(baseDamage * (gameState.currentQuestionDifficulty - 1));
        const comboBonus = Math.floor(gameState.comboCount * 2);

        // Apply time multiplier to total damage
        let totalDamage = Math.floor((baseDamage + speedBonus + difficultyBonus + comboBonus) * timeMultiplier);

        // Apply power upgrade bonus (each power upgrade = +15% damage)
        const powerUpgrades = playerProfile.upgrades?.power || 0;
        const powerMultiplier = 1 + (powerUpgrades * 0.15);
        totalDamage = Math.floor(totalDamage * powerMultiplier);

        // Phase 2: Apply power-up effects
        if (typeof applyPowerUpEffects === 'function') {
            try {
                const result = applyPowerUpEffects(totalDamage, true);
                totalDamage = result.damage;
            } catch (error) {
                console.error('Error applying power-up effects:', error);
            }
        }

        // Phase 2: Check for power-up awards
        if (typeof checkPowerUpAwards === 'function') {
            try {
                checkPowerUpAwards();
            } catch (error) {
                console.error('Error checking power-up awards:', error);
            }
        }

        // Deal damage to enemy
        gameState.enemyHP = Math.max(0, gameState.enemyHP - totalDamage);
        gameState.totalDamageDealt += totalDamage;
        gameState.score += totalDamage;

        // Record damage dealt in question log
        questionLogEntry.damageDealt = totalDamage;
        questionLogEntry.hpLost = 0;

        let message = t('gigarexAttacks');
        if (gameState.comboCount > 1) {
            message = tFormat('comboGigarexAttacks', null, gameState.comboCount);
            // Phase 2: Play combo sound
            try {
                if (typeof playSound === 'function') playSound('combo');
            } catch (e) { console.error('Sound error:', e); }
        }

        showBattleMessage(message, 'success');
        showDamageNumber(totalDamage, 'player');
        playAttackAnimation('player');

        // Phase 2: Play attack sounds
        if (typeof playSound === 'function') {
            playSound('attack');
            setTimeout(() => playSound('hit'), 200);
        }
    } else {
        // Phase 2: Play wrong answer sound
        if (typeof playSound === 'function') playSound('wrong');

        // Reset combo and super-fast counter
        gameState.comboCount = 0;
        gameState.superFastCount = 0;

        // Phase 2: Check if power-up blocks damage
        let blockHPLoss = false;
        if (typeof applyPowerUpEffects === 'function') {
            try {
                const result = applyPowerUpEffects(0, false);
                blockHPLoss = result.blockHPLoss;
            } catch (error) {
                console.error('Error checking power-up block:', error);
            }
        }

        // Enemy attacks player
        const enemyDamage = Math.floor(10 + Math.random() * 10) * gameState.currentEnemy.damageMultiplier;

        if (!blockHPLoss) {
            gameState.playerHP = Math.max(0, gameState.playerHP - enemyDamage);
            // Check if player is now at low HP (for comeback achievement)
            if (gameState.playerHP < gameState.playerMaxHP * 0.2) {
                gameState.wasLowHP = true;
            }
            // Record HP lost in question log
            questionLogEntry.damageDealt = 0;
            questionLogEntry.hpLost = Math.floor(enemyDamage);
        } else {
            // Shield blocked the damage
            showBattleMessage(t('shieldBlocked'), 'shield');
            questionLogEntry.damageDealt = 0;
            questionLogEntry.hpLost = 0;
        }

        showBattleMessage(tFormat('enemyAttacksAnswer', null, gameState.currentEnemy.name, gameState.currentCorrectAnswer), 'error');
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
    if (!gameState.battleActive || !gameState.acceptingAnswer) return;
    setBattleInputEnabled(false);

    const question = gameState.questions[gameState.currentQuestionIndex];

    gameState.totalAnswers++;
    gameState.answerTimes.push(10);
    gameState.comboCount = 0; // Reset combo
    gameState.superFastCount = 0; // A timeout breaks the consecutive super-fast streak too

    // Enemy attacks when time runs out
    const enemyDamage = Math.floor(15 + Math.random() * 15) * gameState.currentEnemy.damageMultiplier;
    gameState.playerHP = Math.max(0, gameState.playerHP - enemyDamage);

    // Log question
    // Format question string based on operation type
    let questionString;
    if (question.isThreePart) {
        questionString = `${question.num1} + ${question.num2} + ${question.num3}`;
    } else {
        const operationSymbol = question.operation === 'add' ? '+' :
                               question.operation === 'subtract' ? '-' : '×';
        questionString = `${question.num1} ${operationSymbol} ${question.num2}`;
    }

    gameState.questionLog.push({
        question: questionString,
        correctAnswer: gameState.currentCorrectAnswer,
        userAnswer: null,
        timeSpent: 10,
        correct: false,
        damageDealt: 0,
        hpLost: Math.floor(enemyDamage)
    });

    showBattleMessage(tFormat('tooSlowEnemyAttacks', null, gameState.currentEnemy.name, gameState.currentCorrectAnswer), 'timeout');
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

// Helper function: Check if all facts from a table have been attempted at least once
function checkAllTableFactsAttempted(table, profile) {
    if (!profile.analytics?.facts) return false;

    // For multiplication tables, check all facts from table × 1 to table × 12
    const expectedFacts = [];
    for (let i = 1; i <= 12; i++) {
        expectedFacts.push(`${table}×${i}`);
    }

    // Check if all expected facts have been attempted at least once
    for (const fact of expectedFacts) {
        const factData = profile.analytics.facts[fact];
        if (!factData || factData.attempts === 0) {
            return false; // Missing or never attempted
        }
    }

    return true; // All facts have been attempted
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

    // Show combo display starting from 2x
    if (gameState.comboCount >= 2) {
        comboEl.textContent = tFormat('comboLabel', null, gameState.comboCount);
        comboEl.style.display = 'block';

        // Different visual styles based on combo level
        if (gameState.comboCount >= 10) {
            comboEl.className = 'combo-display epic';
        } else if (gameState.comboCount >= 5) {
            comboEl.className = 'combo-display high';
        } else {
            comboEl.className = 'combo-display';
        }
    } else {
        comboEl.style.display = 'none';
    }

    // Update atomic breath charging bar
    const atomicBar = document.getElementById('atomic-breath-bar');
    const atomicFill = document.getElementById('atomic-breath-fill');
    const atomicCount = document.getElementById('atomic-breath-count');

    if (atomicBar && atomicFill && atomicCount) {
        // Show bar if super-fast answers are being tracked but atomic breath not yet charged
        if (gameState.superFastCount > 0 && !gameState.superchargeActive && gameState.battleActive) {
            atomicBar.style.display = 'block';
            const progress = Math.min(gameState.superFastCount, 5);
            atomicFill.style.width = (progress / 5 * 100) + '%';
            atomicCount.textContent = progress;
        } else {
            atomicBar.style.display = 'none';
        }
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
    const target = screens[screenName];
    if (!target) {
        console.error(`Unknown screen: ${screenName}`);
        return;
    }
    Object.values(screens).forEach(screen => screen?.classList.remove('active'));
    target.classList.add('active');
    target.scrollTop = 0;
    window.scrollTo(0, 0);
}

// Results Screen Logic
function initResultsScreen() {
    document.getElementById('play-again-btn').addEventListener('click', () => {
        updateProfileDisplay(); // Refresh profile display after game

        // If we just finished a campaign battle, return to campaign selector
        if (gameState.campaignChapter) {
            gameState.campaignChapter = null; // Clear campaign state
            if (typeof showCampaignMode === 'function') {
                showCampaignMode();
            } else {
                switchScreen('start');
            }
        } else {
            switchScreen('start');
        }
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
                <div class="battle-enemy">${battle.enemy || battle.enemyName || 'Unknown'} (Lv ${battle.enemyLevel || 1})</div>
                <div class="battle-stats">
                    <span>Questions: ${battle.correctQuestions || battle.correctAnswers || 0}/${battle.totalQuestions || 0}</span>
                    <span>Accuracy: ${battle.accuracy || 0}%</span>
                    <span>Avg: ${battle.avgSpeed || 0}s</span>
                </div>
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
        // Handle old records that don't have damageDealt/hpLost
        const damageDealt = q.damageDealt || 0;
        const hpLost = q.hpLost || 0;
        const damageDisplay = damageDealt > 0 ? `⚔️ ${damageDealt}` : (hpLost > 0 ? `❤️ -${hpLost}` : '-');
        questionsHTML += `
            <div class="question-row ${resultClass}">
                <span class="q-number">${i + 1}.</span>
                <span class="q-text">${q.question} = ${q.correctAnswer}</span>
                <span class="q-answer">Your: ${q.userAnswer ?? 'Timeout'}</span>
                <span class="q-time">${q.timeSpent.toFixed(1)}s</span>
                <span class="q-damage">${damageDisplay}</span>
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
                <span class="summary-value">${battle.enemy || battle.enemyName || 'Unknown Enemy'} (Level ${battle.enemyLevel || 1})</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Enemy HP:</span>
                <span class="summary-value">${battle.enemyHP || 'N/A'}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Enemy Max Damage:</span>
                <span class="summary-value">${battle.enemyMaxDamage || 'N/A'}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Questions:</span>
                <span class="summary-value">${battle.correctQuestions || battle.correctAnswers || 0} / ${battle.totalQuestions || 0}</span>
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
                <span class="summary-value">${battle.duration} seconds</span>
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

    // Prevent endGame from being called multiple times
    if (gameState.gameEnded) {
        return;
    }
    gameState.gameEnded = true;

    try {
        clearInterval(gameState.timerInterval);
        gameState.battleActive = false;

        // Determine victory or defeat
        const victory = gameState.enemyHP <= 0;

        // Calculate stats
    const accuracy = gameState.totalAnswers > 0 ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100) : 0;
    const hasAnswers = gameState.answerTimes.length > 0;
    // Keep a numeric average for math, and a formatted string for display/storage.
    const avgSpeedNum = hasAnswers ? (gameState.answerTimes.reduce((a, b) => a + b, 0) / gameState.answerTimes.length) : 0;
    const avgSpeed = hasAnswers ? avgSpeedNum.toFixed(1) : '0';
    const battleDuration = ((Date.now() - gameState.battleStartTime) / 1000).toFixed(0);

    // No rank calculation - removed per user request

    // Calculate XP based on enemy strength (level)
    // Stronger enemies give more XP
    const enemyLevel = gameState.currentEnemy.level;
    let baseXP = victory ? enemyLevel * 3 : Math.floor(enemyLevel * 1.5);  // 3 XP per enemy level on victory, 1.5 on defeat
    const accuracyBonus = Math.floor(accuracy / 10);  // +1 XP per 10% accuracy

    // Layered speed bonus - reward faster answers (only when questions were answered,
    // so an empty battle doesn't earn a "lightning fast" bonus from avgSpeed === 0).
    let speedBonus = 0;
    if (hasAnswers) {
        if (avgSpeedNum < 3) speedBonus = 5;        // Lightning fast: +5 XP
        else if (avgSpeedNum < 5) speedBonus = 3;    // Very fast: +3 XP
        else if (avgSpeedNum < 7) speedBonus = 2;    // Fast: +2 XP
        else if (avgSpeedNum < 10) speedBonus = 1;   // Quick: +1 XP
    }

    const xpGained = Math.max(baseXP + accuracyBonus + speedBonus, victory ? 10 : 5);  // Minimum 10 XP for victory, 5 for defeat

    // Store old level/stage for comparison
    const oldLevel = playerProfile.level;
    const oldStage = playerProfile.evolutionStage;
    const oldXP = playerProfile.xp;

    // Update profile
    playerProfile.totalPower += gameState.totalDamageDealt;
    playerProfile.xp += xpGained;
    playerProfile.gamesPlayed++;

    // Award upgrade points (1 point per 400 XP milestone)
    const oldMilestone = Math.floor(oldXP / 400);
    const newMilestone = Math.floor(playerProfile.xp / 400);
    const upgradePointsEarned = newMilestone - oldMilestone;
    if (upgradePointsEarned > 0) {
        if (!playerProfile.availableUpgradePoints) playerProfile.availableUpgradePoints = 0;
        playerProfile.availableUpgradePoints += upgradePointsEarned;
    }

    // Save battle to history
    const battleRecord = {
        timestamp: Date.now(),
        date: new Date().toISOString(),
        enemy: gameState.currentEnemy?.name || 'Unknown Enemy',
        enemyLevel: gameState.currentEnemy?.level || 1,
        enemyHP: gameState.enemyMaxHP,
        enemyMaxDamage: Math.floor(30 * (gameState.currentEnemy?.damageMultiplier || 1)),
        victory: victory,
        accuracy: accuracy,
        avgSpeed: avgSpeed,
        duration: battleDuration,
        questions: gameState.questionLog,
        totalQuestions: gameState.totalAnswers,
        correctQuestions: gameState.correctAnswers,
        xpGained: xpGained
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

    // Campaign mode: Mark chapter as complete if victory
    if (victory && gameState.campaignChapter) {
        if (typeof campaignMode !== 'undefined') {
            const chapterNum = gameState.campaignChapter;
            campaignMode.completeChapter(chapterNum, playerProfile);
        }
    }

    // Save profile
    saveCurrentProfile();

    // Update results display
    document.getElementById('victory-title').textContent = victory ? t('victory') : t('defeat');
    document.getElementById('victory-title').className = 'results-title ' + (victory ? 'victory' : 'defeat');

    document.getElementById('result-message').textContent = victory ?
        tFormat('youDefeatedEnemy', null, gameState.currentEnemy.name, gameState.currentEnemy.level) :
        tFormat('enemyDefeatedYou', null, gameState.currentEnemy.name, gameState.currentEnemy.level);

    const resultSprite = document.getElementById('result-sprite');
    resultSprite.className = 'kaiju-sprite gigarex ' + (victory ? 'victory' : 'defeat-sprite');
    resultSprite.classList.add(`stage-${playerProfile.evolutionStage}`);

    // Adjust sprite sizes based on victory/defeat
    // Winner is larger (1.2x), loser is smaller (0.8x)
    if (victory) {
        resultSprite.style.transform = 'scale(1.2)';
    } else {
        resultSprite.style.transform = 'scale(0.8)';
    }

    // Show enemy sprite and name
    const resultEnemySprite = document.getElementById('result-enemy-sprite');
    const resultEnemyName = document.getElementById('result-enemy-name');
    if (resultEnemySprite && gameState.currentEnemy) {
        resultEnemySprite.className = 'kaiju-sprite enemy';
        // Convert enemy name to filename format (replace spaces with underscores)
        const enemyFileName = (gameState.currentEnemy.id || gameState.currentEnemy.name).replace(/ /g, '_');
        resultEnemySprite.style.backgroundImage = `url('images/enemies/${enemyFileName}.png')`;
        resultEnemySprite.style.backgroundSize = 'contain';
        resultEnemySprite.style.backgroundPosition = 'center';
        resultEnemySprite.style.backgroundRepeat = 'no-repeat';

        // Adjust enemy sprite size based on victory/defeat
        // Winner is larger (1.2x), loser is smaller (0.8x)
        if (victory) {
            resultEnemySprite.style.transform = 'scale(0.8)';
        } else {
            resultEnemySprite.style.transform = 'scale(1.2)';
        }
    }
    if (resultEnemyName && gameState.currentEnemy) {
        resultEnemyName.textContent = gameState.currentEnemy.name;
    }

    document.getElementById('final-score').textContent = gameState.totalDamageDealt;
    document.getElementById('correct-attacks').textContent = gameState.correctAnswers;
    document.getElementById('total-attacks').textContent = gameState.totalAnswers;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('avg-speed').textContent = avgSpeed + 's';
    document.getElementById('xp-gained').textContent = '+' + xpGained + ' XP';

    // Show level up message
    const levelUpMsg = document.getElementById('level-up-message');
    if (evolved) {
        levelUpMsg.textContent = tFormat('evolvedTo', null, evolutionStages[newStage].name);
        levelUpMsg.style.display = 'block';
    } else if (leveledUp) {
        levelUpMsg.textContent = tFormat('levelUpNow', null, playerProfile.level);
        levelUpMsg.style.display = 'block';
    } else {
        levelUpMsg.style.display = 'none';
    }

    // Phase 2: Track enemy defeat in Pokedex
    try {
        if (typeof enemyPokedex !== 'undefined' && gameState.currentEnemy) {
            const enemyId = gameState.currentEnemy.name.toLowerCase().replace(/\s+/g, '_');
            enemyPokedex.trackDefeat(playerProfile, enemyId, victory);
        }
    } catch (error) {
        console.error('Error tracking enemy defeat:', error);
    }

    // Phase 2: Track analytics session
    try {
        if (typeof analytics !== 'undefined' && typeof analytics.endSession === 'function') {
            analytics.endSession(playerProfile);
        }
    } catch (error) {
        console.error('Error tracking analytics session:', error);
    }

    // Battle history already saved above with full details including questions

    // Phase 2: Update streaks
    try {
        if (victory) {
            playerProfile.streaks.currentWinStreak = (playerProfile.streaks.currentWinStreak || 0) + 1;
            if (playerProfile.streaks.currentWinStreak > playerProfile.streaks.longestWinStreak) {
                playerProfile.streaks.longestWinStreak = playerProfile.streaks.currentWinStreak;
            }
        } else {
            playerProfile.streaks.currentWinStreak = 0;
        }
    } catch (error) {
        console.error('Error updating streaks:', error);
    }

    // Phase 2: Check achievements after battle
    try {
        if (typeof achievementManager !== 'undefined' && typeof achievementManager.updateProgress === 'function') {
            // Track correct answers
            if (!playerProfile.achievements.totalCorrectAnswers) {
                playerProfile.achievements.totalCorrectAnswers = 0;
            }
            playerProfile.achievements.totalCorrectAnswers += gameState.correctAnswers;
            achievementManager.updateProgress('correct_answers', playerProfile.achievements.totalCorrectAnswers, playerProfile);

            // Track fast answers (under 2 seconds)
            if (!playerProfile.achievements.fastAnswers) {
                playerProfile.achievements.fastAnswers = 0;
            }
            const fastAnswersThisBattle = gameState.answerTimes.filter(time => time < 2).length;
            playerProfile.achievements.fastAnswers += fastAnswersThisBattle;
            achievementManager.updateProgress('fast_answers', playerProfile.achievements.fastAnswers, playerProfile);

            // Track perfect battles (100% accuracy)
            if (victory && accuracy === 100) {
                achievementManager.updateProgress('perfect_battle', 1, playerProfile);
            }

            // Track win streaks
            if (victory) {
                achievementManager.updateProgress('win_streak', playerProfile.streaks.currentWinStreak || 1, playerProfile);
            }

            // Track comeback victories (won after being below 20% HP)
            if (victory && gameState.wasLowHP) {
                achievementManager.updateProgress('comeback_victory', 1, playerProfile);
            }

            // Track max combo
            if (gameState.maxCombo) {
                achievementManager.updateProgress('max_combo', gameState.maxCombo, playerProfile);
            }

            // Track boss defeats (enemies level 10+)
            if (victory && enemyLevel >= 10) {
                if (!playerProfile.achievements.bossDefeats) {
                    playerProfile.achievements.bossDefeats = 0;
                }
                playerProfile.achievements.bossDefeats++;
                achievementManager.updateProgress('boss_defeats', playerProfile.achievements.bossDefeats, playerProfile);
            }

            // Track evolution stage
            achievementManager.updateProgress('evolution_stage', playerProfile.evolutionStage, playerProfile);

            // Track table mastery (check 7× table specifically)
            if (typeof analytics !== 'undefined' && playerProfile.analytics?.tables?.table7) {
                const table7Data = playerProfile.analytics.tables.table7;
                if (table7Data.attempts > 0) {
                    const table7Accuracy = Math.round((table7Data.correct / table7Data.attempts) * 100);

                    // Check if all facts from the 7× table have been answered at least once
                    const allFactsAttempted = checkAllTableFactsAttempted(7, playerProfile);

                    // Only update achievement if all facts have been attempted
                    if (allFactsAttempted) {
                        achievementManager.updateProgress('table_mastery', { table: 7, accuracy: table7Accuracy }, playerProfile);
                    }
                }
            }

            // Track daily streaks (handled elsewhere, but update here too)
            if (playerProfile.streaks?.daily) {
                achievementManager.updateProgress('daily_streak', playerProfile.streaks.daily, playerProfile);
            }

            // Track atomic breath usage
            if (playerProfile.stats?.atomicBreathUsed) {
                achievementManager.updateProgress('atomic_breath_used', playerProfile.stats.atomicBreathUsed, playerProfile);
            }

            // Save profile after achievement updates
            saveCurrentProfile();
        }
    } catch (error) {
        console.error('Error checking achievements:', error);
    }

    // Phase 2: Play sound
    try {
        if (typeof soundSystem !== 'undefined' && playerProfile.settings && playerProfile.settings.soundEnabled) {
            if (victory) {
                soundSystem.playVictory();
            } else {
                soundSystem.playDefeat();
            }
            if (evolved) {
                setTimeout(() => soundSystem.playEvolution(), 500);
            }
        }
    } catch (error) {
        console.error('Error playing sounds:', error);
    }

        // Switch to results
        setTimeout(() => {
            switchScreen('results-screen');
        }, 1500);

    } catch (error) {
        console.error('❌ ERROR in endGame():', error);
        console.error('Error stack:', error.stack);
        // Try to show results anyway
        setTimeout(() => {
            switchScreen('results-screen');
        }, 1000);
    }
}
