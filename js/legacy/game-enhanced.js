// KAIJU - Enhanced Educational Math Game
// Version 2.0 - Comprehensive Learning System

// ===================================
// CONFIGURATION & CONSTANTS
// ===================================

const GAME_CONFIG = {
    version: '2.0',
    defaultLanguage: 'en',
    soundEnabled: true,
    musicEnabled: true,
    particlesEnabled: true
};

// ===================================
// MULTI-LANGUAGE SUPPORT
// ===================================

const TRANSLATIONS = {
    en: {
        gameTitle: 'KAIJU',
        subtitle: 'MULTIPLICATION MASTER',
        battle: 'BATTLE',
        practice: 'PRACTICE',
        challenge: 'CHALLENGE',
        campaign: 'CAMPAIGN',
        correct: 'CORRECT!',
        wrong: 'WRONG!',
        victory: 'VICTORY!',
        defeat: 'DEFEATED!',
        evolution: 'EVOLUTION!',
        achievements: 'ACHIEVEMENTS',
        stats: 'STATISTICS',
        mastery: 'MASTERY',
        weak: 'Needs Work',
        strong: 'Mastered'
    },
    nl: {  // Dutch
        gameTitle: 'KAIJU',
        subtitle: 'VERMENIGVULDIGING MEESTER',
        battle: 'GEVECHT',
        practice: 'OEFENEN',
        challenge: 'UITDAGING',
        campaign: 'CAMPAGNE',
        correct: 'GOED!',
        wrong: 'FOUT!',
        victory: 'OVERWINNING!',
        defeat: 'VERSLAGEN!',
        evolution: 'EVOLUTIE!',
        achievements: 'PRESTATIES',
        stats: 'STATISTIEKEN',
        mastery: 'BEHEERSING',
        weak: 'Moet Oefenen',
        strong: 'Beheerst'
    },
    de: {  // German
        gameTitle: 'KAIJU',
        subtitle: 'MULTIPLIKATION MEISTER',
        battle: 'KAMPF',
        practice: 'ÜBEN',
        challenge: 'HERAUSFORDERUNG',
        campaign: 'KAMPAGNE',
        correct: 'RICHTIG!',
        wrong: 'FALSCH!',
        victory: 'SIEG!',
        defeat: 'BESIEGT!',
        evolution: 'EVOLUTION!',
        achievements: 'ERFOLGE',
        stats: 'STATISTIKEN',
        mastery: 'BEHERRSCHUNG',
        weak: 'Üben Nötig',
        strong: 'Gemeistert'
    },
    vi: {  // Vietnamese
        gameTitle: 'KAIJU',
        subtitle: 'BẬC THẦY NHÂN',
        battle: 'TRẬN CHIẾN',
        practice: 'LUYỆN TẬP',
        challenge: 'THÁCH THỨC',
        campaign: 'CHIẾN DỊCH',
        correct: 'ĐÚNG!',
        wrong: 'SAI!',
        victory: 'CHIẾN THẮNG!',
        defeat: 'THUA TRẬN!',
        evolution: 'TIẾN HÓA!',
        achievements: 'THÀNH TÍCH',
        stats: 'THỐNG KÊ',
        mastery: 'THÀNH THẠO',
        weak: 'Cần Luyện',
        strong: 'Thành Thạo'
    }
};

function t(key) {
    const lang = playerProfile.settings?.language || 'en';
    return TRANSLATIONS[lang][key] || TRANSLATIONS.en[key] || key;
}

// ===================================
// OPERATION TYPES
// ===================================

const OPERATIONS = {
    MULTIPLY: { symbol: '×', name: 'multiplication', verb: 'times' },
    ADD: { symbol: '+', name: 'addition', verb: 'plus' }
};

// ===================================
// GAME MODES
// ===================================

const GAME_MODES = {
    BATTLE: 'battle',           // Normal battle mode with HP
    PRACTICE: 'practice',       // No HP, focused learning
    CHALLENGE: 'challenge',     // Timed mode
    QUIZ: 'quiz',              // Assessment mode
    CAMPAIGN: 'campaign'        // Story mode
};

// ===================================
// ACHIEVEMENTS SYSTEM
// ===================================

const ACHIEVEMENTS = [
    {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Answer 100 questions under 2 seconds',
        icon: '⚡',
        requirement: { type: 'fast_answers', count: 100 },
        reward: { xp: 500 }
    },
    {
        id: 'perfect_strike',
        name: 'Perfect Strike',
        description: 'Win a battle with 100% accuracy',
        icon: '🎯',
        requirement: { type: 'perfect_battle', count: 1 },
        reward: { xp: 300 }
    },
    {
        id: 'endurance_king',
        name: 'Endurance King',
        description: 'Win 5 battles in a row',
        icon: '👑',
        requirement: { type: 'win_streak', count: 5 },
        reward: { xp: 800 }
    },
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Answer 10 questions correctly',
        icon: '👣',
        requirement: { type: 'correct_answers', count: 10 },
        reward: { xp: 100 }
    },
    {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Play 5 days in a row',
        icon: '📅',
        requirement: { type: 'daily_streak', count: 5 },
        reward: { xp: 600 }
    },
    {
        id: 'comeback_kid',
        name: 'Comeback Kid',
        description: 'Win a battle after being below 20% HP',
        icon: '💪',
        requirement: { type: 'comeback_victory', count: 1 },
        reward: { xp: 400 }
    },
    {
        id: 'master_of_sevens',
        name: 'Master of 7s',
        description: 'Achieve 100% mastery on 7× table',
        icon: '7️⃣',
        requirement: { type: 'table_mastery', table: 7 },
        reward: { xp: 1000 }
    },
    {
        id: 'combo_master',
        name: 'Combo Master',
        description: 'Achieve a 15+ combo',
        icon: '🔥',
        requirement: { type: 'max_combo', count: 15 },
        reward: { xp: 700 }
    },
    {
        id: 'boss_slayer',
        name: 'Boss Slayer',
        description: 'Defeat your first boss',
        icon: '🐉',
        requirement: { type: 'boss_defeats', count: 1 },
        reward: { xp: 1500 }
    },
    {
        id: 'evolution_master',
        name: 'Evolution Master',
        description: 'Reach God Godzilla form',
        icon: '🌟',
        requirement: { type: 'evolution_stage', stage: 16 },
        reward: { xp: 5000 }
    }
];

// ===================================
// BOSS KAIJU
// ===================================

const BOSS_KAIJU = [
    {
        name: 'MECHA-KING GHIDORAH',
        emoji: '🤖🐲',
        description: 'A mechanized terror',
        hpMultiplier: 2.5,
        damageMultiplier: 1.3,
        special: 'triple_head'  // Attacks 3 times on wrong answer
    },
    {
        name: 'DESTROYAH PRIME',
        emoji: '👹💀',
        description: 'The ultimate destroyer',
        hpMultiplier: 3,
        damageMultiplier: 1.5,
        special: 'evolve'  // Gets stronger when low HP
    },
    {
        name: 'SUPER MECHAGODZILLA',
        emoji: '🤖⚡',
        description: 'Advanced battle machine',
        hpMultiplier: 2.8,
        damageMultiplier: 1.4,
        special: 'shield'  // Blocks some damage
    }
];

// ===================================
// ENEMY TYPES
// ===================================

const ENEMY_TYPES = {
    NORMAL: { speed: 1, defense: 1, description: 'Standard enemy' },
    FLYING: { speed: 0.8, defense: 1, description: 'Faster timer, harder to hit' },
    ARMORED: { speed: 1, defense: 1.5, description: 'High defense, needs combos' },
    FAST: { speed: 0.6, defense: 0.8, description: 'Very quick attacks' }
};

// ===================================
// POWER-UPS
// ===================================

const POWERUPS = {
    RAGE: { name: 'Rage Mode', duration: 3, effect: 'double_damage', icon: '😤' },
    SHIELD: { name: 'Shield', duration: 3, effect: 'block_wrong', icon: '🛡️' },
    TIME_FREEZE: { name: 'Time Freeze', duration: 3, effect: 'freeze_timer', icon: '❄️' }
};

// Current Profile
let currentProfileName = null;

// ===================================
// ENHANCED PROFILE STRUCTURE
// ===================================

const createNewProfile = (name) => ({
    name: name,
    level: 1,
    totalPower: 0,
    xp: 0,
    gamesPlayed: 0,
    evolutionStage: 0,
    battleHistory: [],

    // Settings
    settings: {
        language: 'en',
        soundEnabled: true,
        musicEnabled: true,
        particlesEnabled: true,
        operation: 'multiply'  // 'multiply' or 'add'
    },

    // Learning Analytics
    analytics: {
        // Per fact tracking (e.g., "7×8": {...})
        facts: {},

        // Per table stats (e.g., table1: {...})
        tables: initTableStats(),

        // Mistake patterns
        mistakes: [],  // {fact, incorrectAnswer, timestamp}

        // Session history
        sessions: []  // {date, duration, questionsAnswered, accuracy}
    },

    // Achievements
    achievements: {
        unlocked: [],
        progress: {}
    },

    // Streaks
    streaks: {
        daily: 0,
        lastPlayedDate: null,
        currentWinStreak: 0,
        bestWinStreak: 0
    },

    // Mastery tracking
    mastery: {
        // Per fact: { level: 0-4, attempts: 0, correct: 0, lastSeen: timestamp }
    },

    // Enemy collection
    enemiesDefeated: {},
    bossesDefeated: {},

    // Power-ups
    activePowerups: [],

    // Campaign progress
    campaign: {
        currentChapter: 1,
        completedChapters: []
    },

    // Prestige
    prestigeLevel: 0,
    prestigeBonus: 0
});

function initTableStats() {
    const stats = {};
    for (let i = 0; i <= 20; i++) {
        stats[`table${i}`] = {
            attempts: 0,
            correct: 0,
            avgTime: 0,
            mastery: 0  // 0-100%
        };
    }
    return stats;
}

let playerProfile = createNewProfile('Player');

// Evolution stages remain the same
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

// Enhanced Game State
const gameState = {
    mode: GAME_MODES.BATTLE,
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
    lowestHP: 100,  // For comeback achievement
    isBoss: false,

    // Combo system
    comboCount: 0,
    maxCombo: 0,
    superchargeActive: false,

    // Power-ups
    activePowerup: null,
    powerupDuration: 0,

    // Battle log
    battleStartTime: null,
    questionLog: [],

    // Adaptive learning
    weakFacts: [],  // Facts the player struggles with
    recentMistakes: []
};

// Enemy templates with types
const enemyTemplates = [
    { name: 'RODAN', emoji: '🦅', type: 'FLYING' },
    { name: 'MOTHRA', emoji: '🦋', type: 'NORMAL' },
    { name: 'ANGUIRUS', emoji: '🦔', type: 'ARMORED' },
    { name: 'KING GHIDORAH', emoji: '🐲', type: 'FLYING' },
    { name: 'MECHAGODZILLA', emoji: '🤖', type: 'ARMORED' },
    { name: 'DESTROYAH', emoji: '👹', type: 'FAST' },
    { name: 'BIOLLANTE', emoji: '🌿', type: 'NORMAL' },
    { name: 'GIGAN', emoji: '⚔️', type: 'FAST' },
    { name: 'BARAGON', emoji: '🦖', type: 'NORMAL' },
    { name: 'HEDORAH', emoji: '☠️', type: 'NORMAL' },
    { name: 'TITANOSAURUS', emoji: '🦕', type: 'ARMORED' },
    { name: 'SPACE GODZILLA', emoji: '💎', type: 'FLYING' }
];

console.log('✅ KAIJU Enhanced v2.0 - Data structures loaded');
