// KAIJU - Achievement System

const ACHIEVEMENTS = [
    {
        id: 'speed_demon',
        name: {
            en: 'Speed Demon',
            nl: 'Snelheids Duivel',
            de: 'Geschwindigkeits-Dämon',
            vi: 'Ác Quỷ Tốc Độ'
        },
        description: {
            en: 'Answer questions under 2 seconds',
            nl: 'Beantwoord vragen onder 2 seconden',
            de: 'Beantworte Fragen unter 2 Sekunden',
            vi: 'Trả lời câu hỏi dưới 2 giây'
        },
        icon: '⚡',
        multiLevel: true,
        levels: [
            { target: 50, xp: 300 },
            { target: 100, xp: 500 },
            { target: 250, xp: 1000 },
            { target: 500, xp: 2000 },
            { target: 1000, xp: 5000 }
        ],
        requirement: { type: 'fast_answers' }
    },
    {
        id: 'perfect_strike',
        name: {
            en: 'Perfect Strike',
            nl: 'Perfecte Aanval',
            de: 'Perfekter Schlag',
            vi: 'Đòn Hoàn Hảo'
        },
        description: {
            en: 'Win battles with 100% accuracy',
            nl: 'Win gevechten met 100% nauwkeurigheid',
            de: 'Gewinne Kämpfe mit 100% Genauigkeit',
            vi: 'Thắng trận với độ chính xác 100%'
        },
        icon: '🎯',
        multiLevel: true,
        levels: [
            { target: 1, xp: 300 },
            { target: 5, xp: 800 },
            { target: 10, xp: 1500 },
            { target: 25, xp: 3000 },
            { target: 50, xp: 6000 }
        ],
        requirement: { type: 'perfect_battle' }
    },
    {
        id: 'endurance_king',
        name: {
            en: 'Endurance King',
            nl: 'Uithoudingskoning',
            de: 'Ausdauerkönig',
            vi: 'Vua Sức Bền'
        },
        description: {
            en: 'Win battles in a row',
            nl: 'Win gevechten op rij',
            de: 'Gewinne Kämpfe hintereinander',
            vi: 'Thắng trận liên tiếp'
        },
        icon: '👑',
        multiLevel: true,
        levels: [
            { target: 3, xp: 300 },
            { target: 5, xp: 800 },
            { target: 10, xp: 1500 },
            { target: 20, xp: 3000 },
            { target: 50, xp: 7500 }
        ],
        requirement: { type: 'win_streak' }
    },
    {
        id: 'first_steps',
        name: {
            en: 'First Steps',
            nl: 'Eerste Stappen',
            de: 'Erste Schritte',
            vi: 'Bước Đầu Tiên'
        },
        description: {
            en: 'Answer 10 questions correctly',
            nl: 'Beantwoord 10 vragen correct',
            de: 'Beantworte 10 Fragen richtig',
            vi: 'Trả lời đúng 10 câu'
        },
        icon: '👣',
        requirement: { type: 'correct_answers', target: 10 },
        reward: { xp: 100 }
    },
    {
        id: 'streak_master',
        name: {
            en: 'Streak Master',
            nl: 'Streak Meester',
            de: 'Streak-Meister',
            vi: 'Bậc Thầy Chuỗi'
        },
        description: {
            en: 'Play consecutive days in a row',
            nl: 'Speel opeenvolgende dagen op rij',
            de: 'Spiele aufeinanderfolgende Tage',
            vi: 'Chơi nhiều ngày liên tiếp'
        },
        icon: '📅',
        multiLevel: true,
        levels: [
            { target: 2, xp: 200 },   // 2 days
            { target: 7, xp: 600 },   // 1 week
            { target: 10, xp: 1000 }, // 10 days
            { target: 20, xp: 2500 }, // 20 days
            { target: 30, xp: 5000 }  // 30 days
        ],
        requirement: { type: 'daily_streak' }
    },
    {
        id: 'comeback_kid',
        name: {
            en: 'Comeback Kid',
            nl: 'Comeback Kind',
            de: 'Comeback-Held',
            vi: 'Người Hồi Sinh'
        },
        description: {
            en: 'Win after being below 20% HP',
            nl: 'Win na onder 20% HP te zijn geweest',
            de: 'Gewinne nach unter 20% HP',
            vi: 'Thắng sau khi dưới 20% HP'
        },
        icon: '💪',
        multiLevel: true,
        levels: [
            { target: 1, xp: 400 },
            { target: 5, xp: 1000 },
            { target: 10, xp: 2000 },
            { target: 25, xp: 4000 },
            { target: 50, xp: 8000 }
        ],
        requirement: { type: 'comeback_victory' }
    },
    {
        id: 'master_of_sevens',
        name: {
            en: 'Master of 7s',
            nl: 'Meester van 7',
            de: 'Meister der 7er',
            vi: 'Bậc Thầy Bảng 7'
        },
        description: {
            en: 'Master the 7× table (90%+ accuracy)',
            nl: 'Beheers de 7× tafel (90%+ nauwkeurigheid)',
            de: 'Meistere die 7er-Tafel (90%+ Genauigkeit)',
            vi: 'Thành thạo bảng 7 (90%+ chính xác)'
        },
        icon: '7️⃣',
        requirement: { type: 'table_mastery', table: 7, target: 90 },
        reward: { xp: 1000 }
    },
    {
        id: 'combo_master',
        name: {
            en: 'Combo Master',
            nl: 'Combo Meester',
            de: 'Combo-Meister',
            vi: 'Bậc Thầy Combo'
        },
        description: {
            en: 'Achieve high combos',
            nl: 'Behaal hoge combos',
            de: 'Erreiche hohe Combos',
            vi: 'Đạt combo cao'
        },
        icon: '🔥',
        multiLevel: true,
        levels: [
            { target: 5, xp: 200 },
            { target: 10, xp: 500 },
            { target: 15, xp: 1000 },
            { target: 25, xp: 2500 },
            { target: 50, xp: 5000 }
        ],
        requirement: { type: 'max_combo' }
    },
    {
        id: 'atomic_master',
        name: {
            en: 'Atomic Master',
            nl: 'Atomische Meester',
            de: 'Atom-Meister',
            vi: 'Bậc Thầy Nguyên Tử'
        },
        description: {
            en: 'Use Atomic Breath attacks',
            nl: 'Gebruik Atomische Adem aanvallen',
            de: 'Verwende Atematem-Angriffe',
            vi: 'Sử dụng tấn công Hơi Thở Nguyên Tử'
        },
        icon: '⚡',
        multiLevel: true,
        levels: [
            { target: 1, xp: 500 },
            { target: 5, xp: 1000 },
            { target: 10, xp: 2000 },
            { target: 25, xp: 4000 },
            { target: 50, xp: 8000 }
        ],
        requirement: { type: 'atomic_breath_used' }
    },
    {
        id: 'boss_slayer',
        name: {
            en: 'Boss Slayer',
            nl: 'Baas Verslaan',
            de: 'Boss-Bezwinger',
            vi: 'Sát Thủ Boss'
        },
        description: {
            en: 'Defeat bosses',
            nl: 'Versla bazen',
            de: 'Besiege Bosse',
            vi: 'Đánh bại boss'
        },
        icon: '🐉',
        multiLevel: true,
        levels: [
            { target: 1, xp: 1500 },
            { target: 5, xp: 3000 },
            { target: 10, xp: 5000 },
            { target: 25, xp: 10000 }
        ],
        requirement: { type: 'boss_defeats' }
    },
    {
        id: 'evolution_master',
        name: {
            en: 'Evolution Master',
            nl: 'Evolutie Meester',
            de: 'Evolutions-Meister',
            vi: 'Bậc Thầy Tiến Hóa'
        },
        description: {
            en: 'Reach GODz!LL4 form (Stage 21)',
            nl: 'Bereik GODz!LL4 vorm (Stadium 21)',
            de: 'Erreiche GODz!LL4 Form (Stufe 21)',
            vi: 'Đạt dạng GODz!LL4 (Giai đoạn 21)'
        },
        icon: '🌟',
        requirement: { type: 'evolution_stage', target: 21 },
        reward: { xp: 10000 }
    },
    {
        id: 'campaign_hero',
        name: {
            en: 'Campaign Hero',
            nl: 'Campagne Held',
            de: 'Kampagnen-Held',
            vi: 'Anh Hùng Chiến Dịch'
        },
        description: {
            en: 'Complete all 12 campaign chapters',
            nl: 'Voltooi alle 12 campagne hoofdstukken',
            de: 'Schließe alle 12 Kampagnenkapitel ab',
            vi: 'Hoàn thành tất cả 12 chương chiến dịch'
        },
        icon: '🗺️',
        requirement: { type: 'campaign_chapters', target: 12 },
        reward: { xp: 5000 }
    }
];

class AchievementManager {
    constructor() {
        this.achievements = ACHIEVEMENTS;
    }

    // Get current level for a multi-level achievement
    getCurrentLevel(achievementId, profile) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || !achievement.multiLevel) return 0;

        const progress = profile.achievements.progress[achievementId] || 0;

        // Find highest completed level
        let currentLevel = 0;
        for (let i = 0; i < achievement.levels.length; i++) {
            if (progress >= achievement.levels[i].target) {
                currentLevel = i + 1;
            } else {
                break;
            }
        }
        return currentLevel;
    }

    // Check if achievement is unlocked (for single-level) or has any level (for multi-level)
    isUnlocked(achievementId, profile) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return false;

        if (achievement.multiLevel) {
            return this.getCurrentLevel(achievementId, profile) > 0;
        }
        return profile.achievements.unlocked.includes(achievementId);
    }

    // Get achievement progress (percentage towards NEXT level)
    getProgress(achievementId, profile) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return 0;

        const progress = profile.achievements.progress[achievementId] || 0;

        if (achievement.multiLevel) {
            const currentLevel = this.getCurrentLevel(achievementId, profile);

            // If max level reached, return 100%
            if (currentLevel >= achievement.levels.length) return 100;

            // Calculate progress towards next level
            const nextLevel = achievement.levels[currentLevel];
            const prevTarget = currentLevel > 0 ? achievement.levels[currentLevel - 1].target : 0;
            const progressInLevel = progress - prevTarget;
            const levelRange = nextLevel.target - prevTarget;

            return Math.min(100, (progressInLevel / levelRange) * 100);
        }

        // Single-level achievement
        return Math.min(100, (progress / achievement.requirement.target) * 100);
    }

    // Update progress for an achievement
    updateProgress(type, value, profile) {
        const relevantAchievements = this.achievements.filter(
            a => a.requirement.type === type
        );

        const newlyUnlocked = [];

        relevantAchievements.forEach(achievement => {
            // Initialize progress if not exists
            if (!profile.achievements.progress[achievement.id]) {
                profile.achievements.progress[achievement.id] = 0;
            }

            const oldProgress = profile.achievements.progress[achievement.id];

            // Update progress
            if (type === 'table_mastery' && achievement.requirement.table !== undefined) {
                // Special case for table-specific achievements
                // Check both accuracy AND that all 12 facts have been attempted
                if (value.table === achievement.requirement.table &&
                    value.accuracy >= achievement.requirement.target &&
                    this.checkAllTableFactsAttempted(value.table, profile)) {
                    profile.achievements.progress[achievement.id] = achievement.requirement.target;
                }
            } else {
                profile.achievements.progress[achievement.id] = Math.max(
                    profile.achievements.progress[achievement.id],
                    value
                );
            }

            const newProgress = profile.achievements.progress[achievement.id];

            // Check for level ups in multi-level achievements
            if (achievement.multiLevel) {
                const oldLevel = this.getLevelFromProgress(achievement, oldProgress);
                const newLevel = this.getLevelFromProgress(achievement, newProgress);

                // If leveled up, grant XP and show notification
                if (newLevel > oldLevel) {
                    for (let i = oldLevel; i < newLevel; i++) {
                        const levelData = achievement.levels[i];
                        profile.xp += levelData.xp;

                        // Create achievement object for notification
                        const levelAchievement = {
                            ...achievement,
                            name: this.getLocalizedName(achievement, i + 1),
                            reward: { xp: levelData.xp },
                            level: i + 1
                        };
                        newlyUnlocked.push(levelAchievement);
                    }
                }
            } else {
                // Single-level achievement
                if (newProgress >= achievement.requirement.target) {
                    if (!this.isUnlocked(achievement.id, profile)) {
                        profile.achievements.unlocked.push(achievement.id);
                        profile.xp += achievement.reward.xp;
                        newlyUnlocked.push(achievement);
                    }
                }
            }
        });

        return newlyUnlocked;
    }

    // Helper: Get level from progress value
    getLevelFromProgress(achievement, progress) {
        if (!achievement.multiLevel) return 0;

        let level = 0;
        for (let i = 0; i < achievement.levels.length; i++) {
            if (progress >= achievement.levels[i].target) {
                level = i + 1;
            } else {
                break;
            }
        }
        return level;
    }

    // Helper: Get localized name with level suffix for multi-level achievements
    getLocalizedName(achievement, level) {
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        const suffix = romanNumerals[level - 1] || level.toString();

        const names = {};
        for (const lang in achievement.name) {
            names[lang] = `${achievement.name[lang]} ${suffix}`;
        }
        return names;
    }

    // Helper: Check if all 12 facts from a table have been attempted
    checkAllTableFactsAttempted(table, profile) {
        if (!profile.analytics?.facts) return false;

        // Generate all expected facts for this table
        const expectedFacts = [];
        for (let i = 1; i <= 12; i++) {
            expectedFacts.push(`${table}×${i}`);
        }

        // Check if all facts have been attempted at least once
        for (const fact of expectedFacts) {
            const factData = profile.analytics.facts[fact];
            if (!factData || factData.attempts === 0) {
                return false;
            }
        }

        return true;
    }

    // Get all unlocked achievements
    getUnlocked(profile) {
        return this.achievements.filter(a => this.isUnlocked(a.id, profile));
    }

    // Get all locked achievements with progress
    getLocked(profile) {
        return this.achievements
            .filter(a => !this.isUnlocked(a.id, profile))
            .map(a => ({
                ...a,
                progress: this.getProgress(a.id, profile)
            }));
    }

    // Show achievement notification
    showNotification(achievement, lang = 'en') {
        if (typeof soundSystem !== 'undefined') {
            soundSystem.playAchievement();
        }

        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <div class="achievement-unlocked">${typeof t !== 'undefined' && t ? t('achievementUnlocked') : 'Achievement Unlocked!'}</div>
                <div class="achievement-name">${achievement.name[lang] || achievement.name.en}</div>
                <div class="achievement-reward">+${achievement.reward?.xp ?? achievement.xp ?? 0} XP</div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Create global achievement manager
const achievementManager = new AchievementManager();
