// KAIJU - Stats Visualization Screen
// Displays progress, mastery, analytics, recommendations

class StatsScreen {
    constructor() {
        this.container = null;
    }

    // Show stats screen modal
    show(profile, lang = 'en') {
        // Remove existing if present
        const existing = document.querySelector('.stats-screen-modal');
        if (existing) existing.remove();

        const modal = UIComponents.createModal('', { maxWidth: '1200px' });
        modal.classList.add('stats-screen-modal');
        const container = modal.firstElementChild;

        // Header
        const header = this.createHeader(profile, lang);
        container.appendChild(header);

        // Overview stats
        const overview = this.createOverview(profile, lang);
        container.appendChild(overview);

        // Achievements section
        const achievementsSection = this.createAchievementsSection(profile, lang);
        container.appendChild(achievementsSection);

        // Table mastery grid
        const masteryGrid = this.createMasteryGrid(profile, lang);
        container.appendChild(masteryGrid);

        // Weak facts section
        const weakFacts = this.createWeakFactsSection(profile, lang);
        container.appendChild(weakFacts);

        // Recent progress chart
        const progressChart = this.createProgressChart(profile, lang);
        container.appendChild(progressChart);

        // Battle history
        const battleHistory = this.createBattleHistory(profile, lang);
        container.appendChild(battleHistory);

        // Challenge mode highscores
        const challengeHighscores = this.createChallengeHighscores(profile, lang);
        container.appendChild(challengeHighscores);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = t('close', lang) || 'Close';
        closeBtn.style.cssText = `
            background: #ff0000;
            color: #fff;
            border: none;
            padding: 15px 40px;
            font-size: 1.2rem;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            margin-top: 30px;
            display: block;
            margin-left: auto;
            margin-right: auto;
        `;
        closeBtn.onclick = () => modal.remove();
        container.appendChild(closeBtn);

        modal.appendChild(container);

        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        UIComponents.openModal(modal);
        return modal;
    }

    // Create header with player info
    createHeader(profile, lang) {
        const header = document.createElement('div');
        header.style.cssText = `
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #00ff00;
        `;

        const title = document.createElement('h1');
        title.style.cssText = `
            font-size: 2.5rem;
            color: #00ff00;
            margin: 0 0 10px 0;
            text-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
        `;
        title.textContent = '📊 Your Progress';

        const playerName = document.createElement('div');
        playerName.style.cssText = `
            font-size: 1.5rem;
            color: #ffaa00;
            font-weight: bold;
        `;
        playerName.textContent = profile.name;

        header.appendChild(title);
        header.appendChild(playerName);

        return header;
    }

    // Create overview section
    createOverview(profile, lang) {
        const section = document.createElement('div');
        section.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        `;

        const stats = [
            { label: t('level', lang) || 'Level', value: profile.level, icon: '⭐', color: '#ffaa00' },
            { label: t('totalXP', lang) || 'Total XP', value: profile.xp, icon: '💎', color: '#00ccff' },
            { label: t('battles', lang) || 'Battles', value: profile.gamesPlayed, icon: '⚔️', color: '#ff6600' },
            { label: t('winStreak', lang) || 'Win Streak', value: profile.streaks?.currentWinStreak || 0, icon: '🔥', color: '#ff0000' },
            { label: t('dailyStreak', lang) || 'Daily Streak', value: profile.streaks?.daily || 0, icon: '📅', color: '#00ff00' }
        ];

        UIComponents.renderStatCards(section, stats, { borderWidth: '3px' });

        return section;
    }

    // Create achievements section
    createAchievementsSection(profile, lang) {
        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 30px;
        `;

        const sectionTitle = document.createElement('h2');
        sectionTitle.style.cssText = `
            font-size: 1.8rem;
            color: #ffd700;
            margin-bottom: 15px;
            text-align: center;
        `;
        sectionTitle.textContent = '🏆 Achievements';

        const description = document.createElement('div');
        description.style.cssText = `
            font-size: 0.9rem;
            color: #aaa;
            text-align: center;
            margin-bottom: 15px;
            font-style: italic;
        `;
        description.textContent = 'Complete challenges to unlock achievements and earn bonus XP!';

        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        `;

        // Get achievements from the global achievements manager
        if (typeof achievementManager === 'undefined') {
            section.appendChild(sectionTitle);
            section.appendChild(description);
            const noAchievements = document.createElement('div');
            noAchievements.style.cssText = 'text-align: center; color: #888; padding: 20px;';
            noAchievements.textContent = 'Achievement system not loaded';
            section.appendChild(noAchievements);
            return section;
        }

        const allAchievements = achievementManager.achievements;

        allAchievements.forEach(achievement => {
            // For multi-level achievements, check if the NEXT level is unlocked
            let isUnlocked;
            let currentLevelIndex;
            let targetValue;

            if (achievement.multiLevel) {
                currentLevelIndex = achievementManager.getCurrentLevel(achievement.id, profile);
                // Check if we're at max level
                if (currentLevelIndex >= achievement.levels.length) {
                    isUnlocked = true; // Max level achieved
                    targetValue = achievement.levels[achievement.levels.length - 1].target;
                } else {
                    // Check if current working level is unlocked
                    const currentProgress = profile.achievements.progress[achievement.id] || 0;
                    targetValue = achievement.levels[currentLevelIndex].target;
                    isUnlocked = currentProgress >= targetValue;
                }
            } else {
                isUnlocked = achievementManager.isUnlocked(achievement.id, profile);
            }

            const progress = achievementManager.getProgress(achievement.id, profile);

            const card = document.createElement('div');
            card.style.cssText = `
                background: ${isUnlocked ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 0, 0, 0.5)'};
                border: 3px solid ${isUnlocked ? '#ffd700' : '#444'};
                border-radius: 12px;
                padding: 15px;
                position: relative;
                ${isUnlocked ? 'box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);' : ''}
            `;

            // Achievement icon
            const icon = document.createElement('div');
            icon.style.cssText = `
                font-size: 2.5rem;
                text-align: center;
                margin-bottom: 10px;
                ${!isUnlocked ? 'filter: grayscale(100%) opacity(0.5);' : ''}
            `;
            icon.textContent = achievement.icon;

            // Achievement name - show level for multi-level achievements
            const name = document.createElement('div');
            name.style.cssText = `
                font-size: 1.1rem;
                font-weight: bold;
                color: ${isUnlocked ? '#ffd700' : '#888'};
                text-align: center;
                margin-bottom: 5px;
            `;

            // Display name with level for multi-level achievements
            if (achievement.multiLevel) {
                const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
                const nextLevel = currentLevelIndex < achievement.levels.length ? currentLevelIndex + 1 : currentLevelIndex;
                const levelSuffix = romanNumerals[nextLevel - 1] || nextLevel.toString();
                name.textContent = `${achievement.name[lang] || achievement.name.en} ${levelSuffix}`;
            } else {
                name.textContent = achievement.name[lang] || achievement.name.en;
            }

            // Achievement description with target for multi-level
            const desc = document.createElement('div');
            desc.style.cssText = `
                font-size: 0.85rem;
                color: #aaa;
                text-align: center;
                margin-bottom: 10px;
            `;

            if (achievement.multiLevel && targetValue) {
                const baseDesc = achievement.description[lang] || achievement.description.en;
                desc.textContent = `${baseDesc} (Target: ${targetValue})`;
            } else {
                desc.textContent = achievement.description[lang] || achievement.description.en;
            }

            // Progress bar (only show if not unlocked)
            if (!isUnlocked) {
                const progressContainer = document.createElement('div');
                progressContainer.style.cssText = `
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 10px;
                    height: 20px;
                    margin-bottom: 5px;
                    position: relative;
                    overflow: hidden;
                `;

                const progressFill = document.createElement('div');
                progressFill.style.cssText = `
                    background: linear-gradient(90deg, #ffaa00, #ffd700);
                    height: 100%;
                    width: ${progress}%;
                    transition: width 0.3s ease;
                `;

                const progressText = document.createElement('div');
                progressText.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 0.75rem;
                    font-weight: bold;
                    text-shadow: 0 0 3px #000;
                `;
                progressText.textContent = `${Math.floor(progress)}%`;

                progressContainer.appendChild(progressFill);
                progressContainer.appendChild(progressText);
                card.appendChild(icon);
                card.appendChild(name);
                card.appendChild(desc);
                card.appendChild(progressContainer);
            } else {
                // Unlocked badge
                const unlockedBadge = document.createElement('div');
                unlockedBadge.style.cssText = `
                    background: #ffd700;
                    color: #000;
                    padding: 5px 10px;
                    border-radius: 5px;
                    text-align: center;
                    font-weight: bold;
                    font-size: 0.8rem;
                    margin-top: 10px;
                `;
                unlockedBadge.textContent = '✓ UNLOCKED';

                card.appendChild(icon);
                card.appendChild(name);
                card.appendChild(desc);
                card.appendChild(unlockedBadge);
            }

            // XP reward - handle both single-level and multi-level achievements
            const xpReward = document.createElement('div');
            xpReward.style.cssText = `
                color: #00ff00;
                font-size: 0.85rem;
                text-align: center;
                margin-top: 8px;
            `;

            // Determine XP value to display
            let xpValue;
            if (achievement.multiLevel) {
                // For multi-level achievements, show XP for the level we're displaying
                if (currentLevelIndex < achievement.levels.length) {
                    xpValue = achievement.levels[currentLevelIndex].xp;
                    if (isUnlocked && currentLevelIndex === achievement.levels.length - 1) {
                        xpReward.textContent = `Max Level: +${xpValue} XP`;
                    } else if (isUnlocked) {
                        xpReward.textContent = `Unlocked: +${xpValue} XP`;
                    } else {
                        xpReward.textContent = `Reward: +${xpValue} XP`;
                    }
                } else {
                    xpValue = achievement.levels[achievement.levels.length - 1].xp;
                    xpReward.textContent = `Max Level: +${xpValue} XP`;
                }
            } else {
                // Single-level achievement
                xpValue = achievement.reward?.xp || 0;
                xpReward.textContent = `+${xpValue} XP`;
            }

            card.appendChild(xpReward);

            grid.appendChild(card);
        });

        section.appendChild(sectionTitle);
        section.appendChild(description);
        section.appendChild(grid);

        return section;
    }

    // Create table mastery grid
    createMasteryGrid(profile, lang) {
        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 30px;
        `;

        const sectionTitle = document.createElement('h2');
        sectionTitle.style.cssText = `
            font-size: 1.8rem;
            color: #00ff00;
            margin-bottom: 15px;
            text-align: center;
        `;
        sectionTitle.textContent = '📚 Table Mastery';

        const description = document.createElement('div');
        description.style.cssText = `
            font-size: 0.9rem;
            color: #aaa;
            text-align: center;
            margin-bottom: 15px;
            font-style: italic;
        `;
        description.textContent = 'Shows your accuracy and practice level for multiplication tables and addition ranges';

        const legend = document.createElement('div');
        legend.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            flex-wrap: wrap;
        `;
        legend.innerHTML = `
            <div style="text-align: center;">
                <div style="color: #aaa; font-size: 0.85rem; margin-bottom: 5px;">Mastery Levels:</div>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 20px; height: 20px; border: 3px solid #e5e4e2; border-radius: 4px;"></div>
                        <span style="color: #e5e4e2; font-size: 0.9rem;">💎 Platinum (≥90)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 20px; height: 20px; border: 3px solid #ffd700; border-radius: 4px;"></div>
                        <span style="color: #ffd700; font-size: 0.9rem;">🥇 Gold (≥75)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 20px; height: 20px; border: 3px solid #c0c0c0; border-radius: 4px;"></div>
                        <span style="color: #c0c0c0; font-size: 0.9rem;">🥈 Silver (≥60)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 20px; height: 20px; border: 3px solid #cd7f32; border-radius: 4px;"></div>
                        <span style="color: #cd7f32; font-size: 0.9rem;">🥉 Bronze (≥40)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 20px; height: 20px; border: 3px solid #666; border-radius: 4px;"></div>
                        <span style="color: #888; font-size: 0.9rem;">Not Mastered</span>
                    </div>
                </div>
            </div>
        `;

        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 15px;
        `;

        // Show tables 1-20
        for (let table = 1; table <= 20; table++) {
            const tableKey = `table${table}`;
            const tableData = profile.analytics?.tables?.[tableKey];
            const masteryLevel = tableData ? analytics.getMasteryLevel(tableData) : 'none';
            const mastery = tableData?.mastery || 0;
            const accuracy = tableData && tableData.attempts > 0 ?
                Math.round((tableData.correct / tableData.attempts) * 100) : 0;

            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(0, 0, 0, 0.7);
                border: 3px solid ${this.getMasteryColor(masteryLevel)};
                border-radius: 12px;
                padding: 15px;
                text-align: center;
                position: relative;
                cursor: pointer;
                transition: transform 0.2s;
            `;
            card.onmouseover = () => card.style.transform = 'scale(1.05)';
            card.onmouseout = () => card.style.transform = 'scale(1)';

            // Mastery badge
            const badge = this.createMasteryBadge(masteryLevel);
            badge.style.position = 'absolute';
            badge.style.top = '-10px';
            badge.style.right = '-10px';

            card.innerHTML = `
                <div style="font-size: 1.5rem; font-weight: bold; color: #fff;">
                    ${table}× Table
                </div>
                <div style="margin: 10px 0;">
                    ${this.createMiniBar(mastery, this.getMasteryColor(masteryLevel))}
                </div>
                <div style="font-size: 0.9rem; color: #aaa;">
                    ${accuracy}% accuracy
                </div>
                <div style="font-size: 0.8rem; color: #666;">
                    ${tableData?.attempts || 0} attempts
                </div>
            `;

            card.insertBefore(badge, card.firstChild);

            // Add click handler to show table details
            card.onclick = () => this.showTableDetails(table, tableData);

            grid.appendChild(card);
        }

        // Add divider between tables and ranges
        const divider = document.createElement('div');
        divider.style.cssText = `
            grid-column: 1 / -1;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ff00, transparent);
            margin: 15px 0;
        `;
        grid.appendChild(divider);

        const rangeHeader = document.createElement('div');
        rangeHeader.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            color: #ffaa00;
            font-size: 1.3rem;
            font-weight: bold;
            margin: 10px 0;
        `;
        rangeHeader.textContent = '➕ Addition Ranges';
        grid.appendChild(rangeHeader);

        // Add addition ranges
        const ranges = [
            {label: '1-5', key: 'range_1_5'},
            {label: '6-10', key: 'range_6_10'},
            {label: '1-10', key: 'range_1_10'},
            {label: '11-20', key: 'range_11_20'},
            {label: '21-50', key: 'range_21_50'},
            {label: '51-100', key: 'range_51_100'},
            {label: '100-250', key: 'range_100_250'}
        ];

        ranges.forEach(rangeInfo => {
            const rangeData = profile.analytics?.ranges?.[rangeInfo.key];
            const masteryLevel = rangeData ? analytics.getMasteryLevel(rangeData) : 'none';
            const mastery = rangeData?.mastery || 0;
            const accuracy = rangeData && rangeData.attempts > 0 ?
                Math.round((rangeData.correct / rangeData.attempts) * 100) : 0;

            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(0, 0, 0, 0.7);
                border: 3px solid ${this.getMasteryColor(masteryLevel)};
                border-radius: 12px;
                padding: 15px;
                text-align: center;
                position: relative;
                cursor: pointer;
                transition: transform 0.2s;
            `;
            card.onmouseover = () => card.style.transform = 'scale(1.05)';
            card.onmouseout = () => card.style.transform = 'scale(1)';

            const badge = this.createMasteryBadge(masteryLevel);
            badge.style.position = 'absolute';
            badge.style.top = '-10px';
            badge.style.right = '-10px';

            card.innerHTML = `
                <div style="font-size: 1.5rem; font-weight: bold; color: #fff;">
                    ${rangeInfo.label}
                </div>
                <div style="margin: 10px 0;">
                    ${this.createMiniBar(mastery, this.getMasteryColor(masteryLevel))}
                </div>
                <div style="font-size: 0.9rem; color: #aaa;">
                    ${accuracy}% accuracy
                </div>
                <div style="font-size: 0.8rem; color: #666;">
                    ${rangeData?.attempts || 0} attempts
                </div>
            `;

            card.insertBefore(badge, card.firstChild);
            grid.appendChild(card);
        });

        section.appendChild(sectionTitle);
        section.appendChild(description);
        section.appendChild(legend);
        section.appendChild(grid);

        return section;
    }

    // Create weak facts section
    createWeakFactsSection(profile, lang) {
        const weakFacts = analytics.getWeakFacts(profile, 10);

        if (weakFacts.length === 0) return document.createElement('div');

        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 30px;
        `;

        const sectionTitle = document.createElement('h2');
        sectionTitle.style.cssText = `
            font-size: 1.8rem;
            color: #ff6600;
            margin-bottom: 15px;
            text-align: center;
        `;
        sectionTitle.textContent = '🎯 Facts to Practice';

        const description = document.createElement('div');
        description.style.cssText = `
            font-size: 0.9rem;
            color: #aaa;
            text-align: center;
            margin-bottom: 15px;
            font-style: italic;
        `;
        description.textContent = 'Math facts you struggle with most - focus on these to improve faster!';

        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
        `;

        weakFacts.forEach(fact => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(255, 102, 0, 0.2);
                border: 2px solid #ff6600;
                border-radius: 10px;
                padding: 12px;
                text-align: center;
            `;

            const accuracy = Math.round(fact.accuracy);
            // Use accuracy for the bar display (0-100 scale)
            const barValue = accuracy;

            card.innerHTML = `
                <div style="font-size: 1.3rem; font-weight: bold; color: #fff;">
                    ${fact.fact}
                </div>
                <div style="font-size: 0.9rem; color: #ffaa00; margin-top: 5px;">
                    ${accuracy}% correct
                </div>
                <div style="margin-top: 5px;">
                    ${this.createMiniBar(barValue, '#ff6600')}
                </div>
                <div style="font-size: 0.8rem; color: #aaa; margin-top: 3px;">
                    ${fact.attempts || 0} attempts
                </div>
            `;

            grid.appendChild(card);
        });

        section.appendChild(sectionTitle);
        section.appendChild(description);
        section.appendChild(grid);

        return section;
    }

    // Create progress chart
    createProgressChart(profile, lang) {
        const sessions = profile.analytics?.sessions || [];
        if (sessions.length === 0) return document.createElement('div');

        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 30px;
        `;

        const sectionTitle = document.createElement('h2');
        sectionTitle.style.cssText = `
            font-size: 1.8rem;
            color: #00ccff;
            margin-bottom: 15px;
            text-align: center;
        `;
        sectionTitle.textContent = t('recentProgress', lang) || '📈 Recent Activity';

        // Last 7 sessions
        const recentSessions = sessions.slice(-7);

        const chartContainer = document.createElement('div');
        chartContainer.style.cssText = `
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #00ccff;
            border-radius: 15px;
            padding: 20px;
        `;

        const bars = document.createElement('div');
        bars.style.cssText = `
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            height: 150px;
            gap: 10px;
        `;

        // Guard against all-zero / missing durations (would make height NaN)
        const maxDuration = Math.max(1, ...recentSessions.map(s => s.duration || 0));

        recentSessions.forEach((session, i) => {
            const height = ((session.duration || 0) / maxDuration) * 100;
            const date = new Date(session.date).toLocaleDateString();

            const bar = document.createElement('div');
            bar.style.cssText = `
                flex: 1;
                background: linear-gradient(to top, #00ccff, #00ff00);
                height: ${height}%;
                border-radius: 5px 5px 0 0;
                position: relative;
                min-height: 20px;
                cursor: pointer;
            `;
            bar.title = `${date}\nDuration: ${Math.round(session.duration / 1000 / 60)}min`;

            const label = document.createElement('div');
            label.style.cssText = `
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.7rem;
                color: #aaa;
                white-space: nowrap;
            `;
            label.textContent = `Day ${i + 1}`;

            bar.appendChild(label);
            bars.appendChild(bar);
        });

        chartContainer.appendChild(bars);
        section.appendChild(sectionTitle);
        section.appendChild(chartContainer);

        return section;
    }

    // Create recommendations section
    createRecommendations(profile, lang) {
        const recommendations = analytics.getRecommendations(profile);

        if (recommendations.length === 0) {
            const section = document.createElement('div');
            section.style.cssText = `
                text-align: center;
                padding: 20px;
                background: rgba(0, 255, 0, 0.1);
                border: 2px solid #00ff00;
                border-radius: 15px;
                color: #00ff00;
                font-size: 1.2rem;
            `;
            section.textContent = t('noRecommendations', lang) || '✅ Great work! Keep practicing!';
            return section;
        }

        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 20px;
        `;

        const sectionTitle = document.createElement('h2');
        sectionTitle.style.cssText = `
            font-size: 1.8rem;
            color: #ffaa00;
            margin-bottom: 15px;
            text-align: center;
        `;
        sectionTitle.textContent = t('recommendations', lang) || '💡 Recommendations';

        const list = document.createElement('div');
        list.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(255, 170, 0, 0.2);
                border: 2px solid #ffaa00;
                border-radius: 12px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
            `;

            const priority = rec.priority === 'high' ? '🔴' : '🟡';
            const icon = rec.type === 'practice_table' ? '📚' : '🔄';

            card.innerHTML = `
                <div style="font-size: 2rem;">${priority} ${icon}</div>
                <div style="flex: 1;">
                    <div style="font-size: 1.2rem; font-weight: bold; color: #fff; margin-bottom: 5px;">
                        ${this.getRecommendationTitle(rec, lang)}
                    </div>
                    <div style="font-size: 1rem; color: #aaa;">
                        ${rec.reason}
                    </div>
                </div>
            `;

            list.appendChild(card);
        });

        section.appendChild(sectionTitle);
        section.appendChild(list);

        return section;
    }

    // Create battle history section
    createBattleHistory(profile, lang) {
        const battles = profile.battleHistory || [];

        if (battles.length === 0) {
            return document.createElement('div');
        }

        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 30px;
        `;

        const sectionTitle = document.createElement('h2');
        sectionTitle.style.cssText = `
            font-size: 1.8rem;
            color: #00ff00;
            margin-bottom: 15px;
            text-align: center;
        `;
        sectionTitle.textContent = '⚔️ Battle History';

        const description = document.createElement('div');
        description.style.cssText = `
            font-size: 0.9rem;
            color: #aaa;
            text-align: center;
            margin-bottom: 15px;
            font-style: italic;
        `;
        description.textContent = 'Your recent battles against kaiju enemies';

        const historyContainer = document.createElement('div');
        historyContainer.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // Show last 20 battles
        battles.slice(-20).reverse().forEach(battle => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: ${battle.victory ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
                border: 2px solid ${battle.victory ? '#00ff00' : '#ff0000'};
                border-radius: 10px;
                padding: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;
                cursor: pointer;
                transition: all 0.2s;
            `;

            // Add hover effects - no scaling, just background change and shadow
            card.onmouseenter = () => {
                card.style.background = battle.victory ? 'rgba(0, 255, 0, 0.15)' : 'rgba(255, 0, 0, 0.15)';
                card.style.boxShadow = `0 5px 15px ${battle.victory ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`;
            };
            card.onmouseleave = () => {
                card.style.background = battle.victory ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';
                card.style.boxShadow = 'none';
            };

            // Click to show details
            card.onclick = () => this.showBattleDetails(battle);

            const date = new Date(battle.timestamp || Date.now()).toLocaleDateString();
            const time = new Date(battle.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            card.innerHTML = `
                <div style="flex: 1; min-width: 200px;">
                    <div style="font-size: 1.2rem; font-weight: bold; color: ${battle.victory ? '#00ff00' : '#ff0000'};">
                        ${battle.victory ? '✓ VICTORY' : '✗ DEFEAT'}
                    </div>
                    <div style="color: #aaa; font-size: 0.9rem; margin-top: 3px;">
                        vs ${battle.enemy || battle.enemyName || 'Unknown Enemy'} (Lvl ${battle.enemyLevel || '?'})
                    </div>
                    <div style="color: #666; font-size: 0.8rem; margin-top: 3px;">
                        ${date} ${time}
                    </div>
                </div>
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <div style="text-align: center;">
                        <div style="color: #aaa; font-size: 0.8rem;">Enemy HP</div>
                        <div style="color: #ff0000; font-weight: bold; font-size: 1rem;">${battle.enemyHP || '?'}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #aaa; font-size: 0.8rem;">Enemy DMG</div>
                        <div style="color: #ff6600; font-weight: bold; font-size: 1rem;">${battle.enemyMaxDamage || '?'}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #aaa; font-size: 0.8rem;">XP</div>
                        <div style="color: #ffaa00; font-weight: bold; font-size: 1.1rem;">+${battle.xpGained || 0}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #aaa; font-size: 0.8rem;">Accuracy</div>
                        <div style="color: #fff; font-weight: bold; font-size: 1.1rem;">${battle.accuracy || 0}%</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #aaa; font-size: 0.8rem;">Speed</div>
                        <div style="color: #fff; font-weight: bold; font-size: 1.1rem;">${battle.avgSpeed || 0}s</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #aaa; font-size: 0.8rem;">👁️</div>
                        <div style="color: #888; font-size: 0.9rem;">Details</div>
                    </div>
                </div>
            `;

            historyContainer.appendChild(card);
        });

        section.appendChild(sectionTitle);
        section.appendChild(description);
        section.appendChild(historyContainer);

        return section;
    }

    // Show detailed battle view
    showBattleDetails(battle) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            overflow-y: auto;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            background: #1a1a1a;
            border: 3px solid ${battle.victory ? '#00ff00' : '#ff0000'};
            border-radius: 15px;
            padding: 25px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8);
        `;

        const date = new Date(battle.timestamp || Date.now()).toLocaleDateString();
        const time = new Date(battle.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let questionsHTML = '';
        if (battle.questions && battle.questions.length > 0) {
            questionsHTML = battle.questions.map((q, i) => {
                // Handle special attack (atomic breath)
                if (q.isSpecialAttack) {
                    return `
                    <div style="
                        background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 170, 0, 0.15));
                        border-left: 4px solid #ffd700;
                        padding: 12px;
                        margin-bottom: 8px;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                            <div style="flex: 1;">
                                <span style="color: #666; font-size: 0.9rem;">#${i + 1}</span>
                                <span style="color: #ffd700; font-size: 1.3rem; margin-left: 10px; font-weight: bold;">⚡ ATOMIC BREATH ⚡</span>
                            </div>
                            <div style="display: flex; gap: 15px; font-size: 0.9rem;">
                                <div>
                                    <span style="color: #aaa;">Damage:</span>
                                    <span style="color: #ff0000; font-weight: bold; margin-left: 5px; font-size: 1.2rem;">⚔️ ${q.damage}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }

                // Handle old records that don't have damageDealt/hpLost
                const damageDealt = q.damageDealt || 0;
                const hpLost = q.hpLost || 0;
                const damageDisplay = damageDealt > 0 ? `⚔️ ${damageDealt}` : (hpLost > 0 ? `❤️ -${hpLost}` : '-');

                return `
                <div style="
                    background: ${q.correct ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 0, 0, 0.05)'};
                    border-left: 3px solid ${q.correct ? '#00ff00' : '#ff0000'};
                    padding: 10px;
                    margin-bottom: 8px;
                    border-radius: 5px;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div style="flex: 1;">
                            <span style="color: #666; font-size: 0.9rem;">#${i + 1}</span>
                            <span style="color: #fff; font-size: 1.1rem; margin-left: 10px;">${q.question}</span>
                        </div>
                        <div style="display: flex; gap: 15px; font-size: 0.9rem;">
                            <div>
                                <span style="color: #aaa;">Your answer:</span>
                                <span style="color: ${q.correct ? '#00ff00' : '#ff0000'}; font-weight: bold; margin-left: 5px;">${q.userAnswer}</span>
                            </div>
                            ${!q.correct ? `<div>
                                <span style="color: #aaa;">Correct:</span>
                                <span style="color: #00ff00; font-weight: bold; margin-left: 5px;">${q.correctAnswer}</span>
                            </div>` : ''}
                            <div>
                                <span style="color: #aaa;">Time:</span>
                                <span style="color: #ffaa00; font-weight: bold; margin-left: 5px;">${q.timeSpent.toFixed(1)}s</span>
                            </div>
                            <div>
                                <span style="color: #aaa;">Damage:</span>
                                <span style="color: ${damageDealt > 0 ? '#ff0000' : '#ff6666'}; font-weight: bold; margin-left: 5px;">${damageDisplay}</span>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        } else {
            questionsHTML = '<div style="color: #666; text-align: center; padding: 20px;">No question details available for this battle.</div>';
        }

        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: ${battle.victory ? '#00ff00' : '#ff0000'}; margin: 0; font-size: 1.8rem;">
                    ${battle.victory ? '✓ VICTORY' : '✗ DEFEAT'}
                </h2>
                <button id="close-battle-details" style="
                    background: #333;
                    border: 2px solid #666;
                    color: #fff;
                    font-size: 1.5rem;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">✖</button>
            </div>

            <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                    <div id="enemy-sprite-detail" style="
                        width: 100px;
                        height: 100px;
                        background-size: contain;
                        background-position: center;
                        background-repeat: no-repeat;
                        flex-shrink: 0;
                    "></div>
                    <div style="flex: 1;">
                        <div style="color: #ffaa00; font-size: 1.3rem; font-weight: bold; margin-bottom: 10px;">
                            vs ${battle.enemy || battle.enemyName || 'Unknown Enemy'} (Level ${battle.enemyLevel || '?'})
                        </div>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 8px;">
                            <div>
                                <span style="color: #aaa; font-size: 0.85rem;">Enemy HP:</span>
                                <span style="color: #ff0000; font-weight: bold; margin-left: 5px;">${battle.enemyHP || '?'}</span>
                            </div>
                            <div>
                                <span style="color: #aaa; font-size: 0.85rem;">Enemy Max Damage:</span>
                                <span style="color: #ff6600; font-weight: bold; margin-left: 5px;">${battle.enemyMaxDamage || '?'}</span>
                            </div>
                        </div>
                        <div style="color: #666; font-size: 0.9rem; margin-top: 8px;">${date} at ${time}</div>
                        ${battle.duration ? `<div style="color: #666; font-size: 0.9rem;">Duration: ${battle.duration}s</div>` : ''}
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 25px;">
                <div style="background: rgba(255, 170, 0, 0.1); border: 2px solid #ffaa00; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="color: #aaa; font-size: 0.8rem;">XP Gained</div>
                    <div style="color: #ffaa00; font-size: 1.5rem; font-weight: bold;">+${battle.xpGained || 0}</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.05); border: 2px solid #666; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="color: #aaa; font-size: 0.8rem;">Accuracy</div>
                    <div style="color: #fff; font-size: 1.5rem; font-weight: bold;">${battle.accuracy || 0}%</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.05); border: 2px solid #666; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="color: #aaa; font-size: 0.8rem;">Avg Speed</div>
                    <div style="color: #fff; font-size: 1.5rem; font-weight: bold;">${battle.avgSpeed || 0}s</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.05); border: 2px solid #666; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="color: #aaa; font-size: 0.8rem;">Questions</div>
                    <div style="color: #fff; font-size: 1.5rem; font-weight: bold;">${battle.correctQuestions || battle.correctAnswers || 0}/${battle.totalQuestions || 0}</div>
                </div>
                ${battle.rank ? `<div style="background: rgba(255, 215, 0, 0.1); border: 2px solid #ffd700; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="color: #aaa; font-size: 0.8rem;">Rank</div>
                    <div style="color: #ffd700; font-size: 1.5rem; font-weight: bold;">${battle.rank}</div>
                </div>` : ''}
                ${battle.damageDealt ? `<div style="background: rgba(255, 0, 0, 0.1); border: 2px solid #ff0000; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="color: #aaa; font-size: 0.8rem;">Damage Dealt</div>
                    <div style="color: #ff0000; font-size: 1.5rem; font-weight: bold;">${battle.damageDealt}</div>
                </div>` : ''}
            </div>

            <h3 style="color: #00ff00; margin: 20px 0 15px 0; font-size: 1.3rem;">📝 Question by Question</h3>
            <div style="max-height: 400px; overflow-y: auto;">
                ${questionsHTML}
            </div>
        `;

        modal.appendChild(container);
        UIComponents.openModal(modal);

        // Set enemy sprite
        const enemySpriteEl = document.getElementById('enemy-sprite-detail');
        if (enemySpriteEl && battle.enemy) {
            const enemyFileName = battle.enemy.replace(/\s+/g, '_').toUpperCase();
            enemySpriteEl.style.backgroundImage = `url('images/enemies/${enemyFileName}.png')`;
        }

        // Close modal handlers
        document.getElementById('close-battle-details').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    // Create challenge mode highscores section
    createChallengeHighscores(profile, lang) {
        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 30px;
        `;

        const sectionTitle = document.createElement('h2');
        sectionTitle.style.cssText = `
            font-size: 1.8rem;
            color: #ffaa00;
            margin-bottom: 15px;
            text-align: center;
        `;
        sectionTitle.textContent = '🏆 Challenge Mode Highscores';

        const description = document.createElement('div');
        description.style.cssText = `
            font-size: 0.9rem;
            color: #aaa;
            text-align: center;
            margin-bottom: 15px;
            font-style: italic;
        `;
        description.textContent = 'Top 10 challenge mode runs across all players';

        // Toggle buttons
        const toggleContainer = document.createElement('div');
        toggleContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 15px;
        `;

        const personalBtn = document.createElement('button');
        personalBtn.textContent = '👤 Personal';
        personalBtn.style.cssText = `
            background: linear-gradient(135deg, #ffaa00, #ff8800);
            color: #000;
            border: none;
            padding: 10px 20px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
        `;

        const totalBtn = document.createElement('button');
        totalBtn.textContent = '🌍 Total';
        totalBtn.style.cssText = `
            background: #333;
            color: #fff;
            border: 2px solid #666;
            padding: 10px 20px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
        `;

        const scoresContainer = document.createElement('div');
        scoresContainer.id = 'challenge-scores-container';

        let showingPersonal = true;

        const renderScores = () => {
            let scores = [];

            if (showingPersonal) {
                // Get personal scores from current profile
                scores = (profile.challengeScores || [])
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10);
            } else {
                // Get all scores from all profiles
                const allProfiles = loadProfiles();
                scores = [];
                Object.values(allProfiles).forEach(p => {
                    if (p.challengeScores) {
                        p.challengeScores.forEach(s => {
                            scores.push({ ...s, playerName: p.name });
                        });
                    }
                });
                scores.sort((a, b) => b.score - a.score);
                scores = scores.slice(0, 10);
            }

            scoresContainer.innerHTML = '';

            if (scores.length === 0) {
                scoresContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666; font-style: italic;">
                        No challenge runs yet. Start a challenge to set your first score!
                    </div>
                `;
                return;
            }

            scores.forEach((score, index) => {
                const isPersonalBest = showingPersonal && index === 0;
                const rank = index + 1;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

                const card = document.createElement('div');
                card.style.cssText = `
                    background: ${isPersonalBest ? 'rgba(255, 170, 0, 0.2)' : 'rgba(0, 0, 0, 0.5)'};
                    border: 2px solid ${isPersonalBest ? '#ffaa00' : '#666'};
                    border-radius: 10px;
                    padding: 15px;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                `;

                const date = new Date(score.timestamp || Date.now()).toLocaleDateString();

                card.innerHTML = `
                    <div style="font-size: 1.5rem; font-weight: bold; color: ${rank <= 3 ? '#ffaa00' : '#fff'}; min-width: 40px;">
                        ${medal} ${rank}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-size: 1.1rem; font-weight: bold; color: #fff;">
                            ${UIComponents.escapeHtml(score.playerName || profile.name)}
                        </div>
                        <div style="font-size: 0.85rem; color: #aaa; margin-top: 3px;">
                            ${score.answered || 0} answered • ${score.accuracy || 0}% accuracy • ${date}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.8rem; font-weight: bold; color: #ffaa00;">
                            ${score.score || 0}
                        </div>
                        <div style="font-size: 0.8rem; color: #aaa;">
                            points
                        </div>
                    </div>
                `;

                scoresContainer.appendChild(card);
            });
        };

        personalBtn.onclick = () => {
            showingPersonal = true;
            personalBtn.style.background = 'linear-gradient(135deg, #ffaa00, #ff8800)';
            personalBtn.style.color = '#000';
            personalBtn.style.border = 'none';
            totalBtn.style.background = '#333';
            totalBtn.style.color = '#fff';
            totalBtn.style.border = '2px solid #666';
            renderScores();
        };

        totalBtn.onclick = () => {
            showingPersonal = false;
            totalBtn.style.background = 'linear-gradient(135deg, #ffaa00, #ff8800)';
            totalBtn.style.color = '#000';
            totalBtn.style.border = 'none';
            personalBtn.style.background = '#333';
            personalBtn.style.color = '#fff';
            personalBtn.style.border = '2px solid #666';
            renderScores();
        };

        toggleContainer.appendChild(personalBtn);
        toggleContainer.appendChild(totalBtn);

        section.appendChild(sectionTitle);
        section.appendChild(description);
        section.appendChild(toggleContainer);
        section.appendChild(scoresContainer);

        // Initial render
        renderScores();

        return section;
    }

    // Helper: Get mastery color
    getMasteryColor(level) {
        const colors = {
            'none': '#666',
            'bronze': '#cd7f32',
            'silver': '#c0c0c0',
            'gold': '#ffd700',
            'platinum': '#e5e4e2'
        };
        return colors[level] || '#666';
    }

    // Helper: Create mastery badge
    createMasteryBadge(level) {
        const badges = {
            'none': '',
            'bronze': '🥉',
            'silver': '🥈',
            'gold': '🥇',
            'platinum': '💎'
        };

        const badge = document.createElement('div');
        badge.style.cssText = `
            font-size: 1.5rem;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 50%;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid ${this.getMasteryColor(level)};
        `;
        badge.textContent = badges[level] || '';

        return badge;
    }

    // Helper: Create mini progress bar
    createMiniBar(percentage, color) {
        return `
            <div style="
                width: 100%;
                height: 8px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 4px;
                overflow: hidden;
            ">
                <div style="
                    width: ${Math.min(percentage, 100)}%;
                    height: 100%;
                    background: ${color};
                    transition: width 0.3s ease;
                "></div>
            </div>
        `;
    }

    // Helper: Get recommendation title
    getRecommendationTitle(rec, lang) {
        const titles = {
            'practice_table': `Practice ${rec.table}× table`,
            'review_facts': `Review these facts: ${rec.facts.join(', ')}`,
            'spaced_review': `Time to review: ${rec.facts.join(', ')}`
        };
        return titles[rec.type] || 'Practice recommended';
    }

    // Show table details modal
    showTableDetails(table, tableData) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 3px solid #ffaa00;
            border-radius: 15px;
            padding: 30px;
            max-width: 700px;
            width: 100%;
            max-height: 85vh;
            overflow-y: auto;
        `;

        // Get individual fact statistics from analytics
        const profile = typeof playerProfile !== 'undefined' ? playerProfile : null;
        const factsData = profile?.analytics?.facts || {};

        content.innerHTML = `
            <h2 style="color: #ffaa00; text-align: center; margin-bottom: 20px;">
                ${table}× Multiplication Table
            </h2>
            ${tableData ? `
                <div style="background: rgba(0, 255, 0, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00ff00;">
                    <div style="color: #00ff00; font-weight: bold; margin-bottom: 8px;">📊 Overall Table Progress:</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; color: #aaa; font-size: 0.9rem;">
                        <div>Attempts: <strong style="color: #fff;">${tableData.attempts || 0}</strong></div>
                        <div>Correct: <strong style="color: #0f0;">${tableData.correct || 0}</strong></div>
                        <div>Accuracy: <strong style="color: #ffaa00;">${tableData.attempts > 0 ? Math.round((tableData.correct / tableData.attempts) * 100) : 0}%</strong></div>
                    </div>
                </div>
            ` : ''}
            <div style="color: #aaa; font-size: 0.9rem; margin-bottom: 15px; text-align: center;">
                Click on each fact to see detailed statistics
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                ${Array.from({length: table}, (_, i) => i + 1).map(num => {
                    const result = table * num;
                    const factKey = `${table}×${num}`;
                    const factData = factsData[factKey];
                    const attempts = factData?.attempts || 0;
                    const correct = factData?.correct || 0;
                    const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

                    // Color based on accuracy
                    let borderColor = '#444'; // gray for no data
                    let bgColor = 'rgba(68, 68, 68, 0.1)';
                    if (attempts > 0) {
                        if (accuracy >= 80) {
                            borderColor = '#00ff00'; // green
                            bgColor = 'rgba(0, 255, 0, 0.1)';
                        } else if (accuracy >= 60) {
                            borderColor = '#ffaa00'; // yellow
                            bgColor = 'rgba(255, 170, 0, 0.1)';
                        } else {
                            borderColor = '#ff0000'; // red
                            bgColor = 'rgba(255, 0, 0, 0.1)';
                        }
                    }

                    return `
                        <div style="
                            background: ${bgColor};
                            border: 2px solid ${borderColor};
                            border-radius: 8px;
                            padding: 10px;
                            text-align: center;
                            color: #fff;
                            font-size: 1.1rem;
                            cursor: pointer;
                            transition: transform 0.2s;
                        "
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'"
                        >
                            <div style="font-weight: bold; margin-bottom: 5px;">${table} × ${num} = ${result}</div>
                            ${attempts > 0 ? `
                                <div style="font-size: 0.75rem; color: #aaa; margin-top: 5px;">
                                    ${attempts} attempts | ${accuracy}% accuracy
                                </div>
                            ` : `
                                <div style="font-size: 0.75rem; color: #666; margin-top: 5px;">
                                    No data yet
                                </div>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
            <button id="close-table-details" style="
                width: 100%;
                padding: 15px;
                margin-top: 20px;
                background: #ffaa00;
                color: #000;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                font-size: 1.1rem;
                cursor: pointer;
            ">Close</button>
        `;

        modal.appendChild(content);
        UIComponents.openModal(modal);

        document.getElementById('close-table-details').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
}

// Create global stats screen instance
const statsScreen = new StatsScreen();
