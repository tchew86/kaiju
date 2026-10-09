// KAIJU - Recommendations Widget
// Shows AI-powered learning recommendations on start screen

class RecommendationsWidget {
    constructor() {
        this.container = null;
    }

    // Create and show recommendations on start screen
    show(profile, lang = 'en') {
        // Remove existing widget
        const existing = document.querySelector('.recommendations-widget');
        if (existing) existing.remove();

        const recommendations = analytics.getRecommendations(profile);

        // If no recommendations, show encouragement
        if (recommendations.length === 0) {
            return this.showEncouragement(profile, lang);
        }

        const widget = document.createElement('div');
        widget.className = 'recommendations-widget';
        widget.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 170, 0, 0.2), rgba(255, 102, 0, 0.2));
            border: 3px solid #ffaa00;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 5px 20px rgba(255, 170, 0, 0.3);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        `;

        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 2rem;
        `;
        icon.textContent = '💡';

        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 1.3rem;
            font-weight: bold;
            color: #ffaa00;
        `;
        title.textContent = t('recommendedPractice', lang) || 'Recommended Practice';

        header.appendChild(icon);
        header.appendChild(title);

        // Get top recommendation
        const topRec = recommendations[0];
        const recCard = this.createRecommendationCard(topRec, profile, lang);

        // Show more link if multiple recommendations
        if (recommendations.length > 1) {
            const showMore = document.createElement('div');
            showMore.style.cssText = `
                text-align: center;
                margin-top: 15px;
                font-size: 0.9rem;
                color: #00ff00;
                cursor: pointer;
                text-decoration: underline;
            `;
            showMore.textContent = `+${recommendations.length - 1} more recommendations`;
            showMore.onclick = () => statsScreen.show(profile, lang);
            widget.appendChild(showMore);
        }

        widget.appendChild(header);
        widget.appendChild(recCard);

        return widget;
    }

    // Show encouragement when no recommendations
    showEncouragement(profile, lang) {
        const widget = document.createElement('div');
        widget.className = 'recommendations-widget';
        widget.style.cssText = `
            background: linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 200, 0, 0.2));
            border: 3px solid #00ff00;
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0, 255, 0, 0.3);
        `;

        const encouragements = [
            { icon: '🌟', text: 'Great progress! Keep up the excellent work!' },
            { icon: '🔥', text: 'You\'re on fire! All tables looking strong!' },
            { icon: '💪', text: 'Impressive mastery! Ready for any challenge!' },
            { icon: '🎯', text: 'Perfect form! Your skills are razor-sharp!' },
            { icon: '👑', text: 'Master level achieved! You\'re unstoppable!' }
        ];

        const chosen = encouragements[Math.floor(Math.random() * encouragements.length)];

        widget.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">${chosen.icon}</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #00ff00;">
                ${chosen.text}
            </div>
        `;

        return widget;
    }

    // Create recommendation card
    createRecommendationCard(rec, profile, lang) {
        const card = document.createElement('div');
        card.style.cssText = `
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #ff6600;
            border-radius: 12px;
            padding: 15px;
        `;

        if (rec.type === 'practice_table') {
            const table = rec.table;
            const tableData = profile.analytics?.tables?.[`table${table}`];
            const mastery = tableData?.mastery || 0;
            const accuracy = tableData && tableData.attempts > 0 ?
                Math.round((tableData.correct / tableData.attempts) * 100) : 0;

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #fff;">
                        📚 ${table}× Times Table
                    </div>
                    <div style="font-size: 1.2rem; color: #ff6600; font-weight: bold;">
                        ${Math.round(mastery)}% mastery
                    </div>
                </div>
                <div style="margin-bottom: 10px;">
                    ${this.createProgressBar(mastery, '#ff6600')}
                </div>
                <div style="font-size: 0.9rem; color: #aaa; margin-bottom: 15px;">
                    ${rec.reason}
                </div>
                <button class="practice-btn" data-table="${table}" style="
                    background: linear-gradient(135deg, #ff6600, #ff3300);
                    color: #fff;
                    border: none;
                    padding: 12px 24px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 100%;
                    box-shadow: 0 5px 15px rgba(255, 102, 0, 0.4);
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    🎯 Practice Now
                </button>
            `;

            // Add click handler
            const btn = card.querySelector('.practice-btn');
            btn.onclick = () => {
                if (typeof practiceMode !== 'undefined') {
                    practiceMode.startPractice(table, profile.settings?.operation || 'multiply');
                    // You would then show the practice UI
                }
            };

        } else if (rec.type === 'review_facts') {
            const facts = rec.facts.slice(0, 3); // Show first 3

            card.innerHTML = `
                <div style="font-size: 1.3rem; font-weight: bold; color: #fff; margin-bottom: 10px;">
                    🔄 Review These Facts
                </div>
                <div style="font-size: 0.9rem; color: #aaa; margin-bottom: 15px;">
                    ${rec.reason}
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
                    ${facts.map(fact => `
                        <div style="
                            background: rgba(255, 102, 0, 0.3);
                            border: 2px solid #ff6600;
                            border-radius: 8px;
                            padding: 8px 12px;
                            font-size: 1.1rem;
                            font-weight: bold;
                            color: #fff;
                        ">${fact}</div>
                    `).join('')}
                </div>
                <button class="review-btn" style="
                    background: linear-gradient(135deg, #00ccff, #0088ff);
                    color: #fff;
                    border: none;
                    padding: 12px 24px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 100%;
                    box-shadow: 0 5px 15px rgba(0, 200, 255, 0.4);
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    🎯 Start Review
                </button>
            `;

            const btn = card.querySelector('.review-btn');
            btn.onclick = () => {
                // Extract table number from first fact (e.g., "7×8" -> 7)
                const firstFact = facts[0];
                const tableMatch = firstFact.match(/^(\d+)[×+]/);
                if (tableMatch && typeof practiceUI !== 'undefined') {
                    const table = parseInt(tableMatch[1]);
                    practiceUI.start(table, profile.settings?.operation || 'multiply');
                } else {
                    alert('Practice mode not available');
                }
            };

        } else if (rec.type === 'spaced_review') {
            const facts = rec.facts.slice(0, 3);

            card.innerHTML = `
                <div style="font-size: 1.3rem; font-weight: bold; color: #fff; margin-bottom: 10px;">
                    ⏰ Spaced Repetition Review
                </div>
                <div style="font-size: 0.9rem; color: #aaa; margin-bottom: 15px;">
                    ${rec.reason}
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
                    ${facts.map(fact => `
                        <div style="
                            background: rgba(0, 255, 0, 0.3);
                            border: 2px solid #00ff00;
                            border-radius: 8px;
                            padding: 8px 12px;
                            font-size: 1.1rem;
                            font-weight: bold;
                            color: #fff;
                        ">${fact}</div>
                    `).join('')}
                </div>
                <button class="spaced-review-btn" style="
                    background: linear-gradient(135deg, #00ff00, #00aa00);
                    color: #000;
                    border: none;
                    padding: 12px 24px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 100%;
                    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4);
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    🧠 Review Now
                </button>
            `;

            const btn = card.querySelector('.spaced-review-btn');
            btn.onclick = () => {
                // Extract table number from first fact (e.g., "7×8" -> 7)
                const firstFact = facts[0];
                const tableMatch = firstFact.match(/^(\d+)[×+]/);
                if (tableMatch && typeof practiceUI !== 'undefined') {
                    const table = parseInt(tableMatch[1]);
                    practiceUI.start(table, profile.settings?.operation || 'multiply');
                } else {
                    alert('Practice mode not available');
                }
            };
        }

        return card;
    }

    // Create progress bar
    createProgressBar(percentage, color) {
        return `
            <div style="
                width: 100%;
                height: 12px;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 6px;
                overflow: hidden;
                border: 2px solid ${color};
            ">
                <div style="
                    width: ${Math.min(percentage, 100)}%;
                    height: 100%;
                    background: linear-gradient(90deg, ${color}, ${color}cc);
                    box-shadow: 0 0 10px ${color}66;
                    transition: width 0.5s ease;
                "></div>
            </div>
        `;
    }

    // Show quick stats summary
    showQuickStats(profile, lang) {
        const widget = document.createElement('div');
        widget.className = 'quick-stats-widget';
        widget.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin: 15px 0;
        `;

        const stats = [
            {
                icon: '⭐',
                label: t('level', lang) || 'Level',
                value: profile.level,
                color: '#ffaa00'
            },
            {
                icon: '🔥',
                label: t('streak', lang) || 'Streak',
                value: profile.streaks?.currentWinStreak || 0,
                color: '#ff0000'
            },
            {
                icon: '🏆',
                label: t('achievements', lang) || 'Achievements',
                value: profile.achievements?.unlocked?.length || 0,
                color: '#ffd700'
            }
        ];

        stats.forEach(stat => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(0, 0, 0, 0.5);
                border: 2px solid ${stat.color};
                border-radius: 10px;
                padding: 12px;
                text-align: center;
            `;

            card.innerHTML = `
                <div style="font-size: 1.8rem;">${stat.icon}</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: ${stat.color}; margin: 5px 0;">
                    ${stat.value}
                </div>
                <div style="font-size: 0.8rem; color: #aaa; text-transform: uppercase;">
                    ${stat.label}
                </div>
            `;

            widget.appendChild(card);
        });

        return widget;
    }

    // Show daily streak indicator
    showDailyStreak(profile, lang) {
        const streak = profile.streaks?.daily || 0;

        if (streak === 0) return document.createElement('div');

        const widget = document.createElement('div');
        widget.className = 'daily-streak-widget';
        widget.style.cssText = `
            background: linear-gradient(135deg, #ff6600, #ff3300);
            border: 3px solid #ff6600;
            border-radius: 15px;
            padding: 15px 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin: 15px 0;
            box-shadow: 0 5px 20px rgba(255, 102, 0, 0.4);
        `;

        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 2.5rem;
        `;
        icon.textContent = '🔥';

        const text = document.createElement('div');
        text.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        text.innerHTML = `
            <div style="font-size: 0.9rem; color: #fff; text-transform: uppercase; font-weight: bold;">
                ${t('dailyStreak', lang) || 'Daily Streak'}
            </div>
            <div style="font-size: 2rem; color: #fff; font-weight: bold;">
                ${streak} ${t('days', lang) || 'days'}!
            </div>
        `;

        widget.appendChild(icon);
        widget.appendChild(text);

        return widget;
    }

    // Show achievement progress
    showAchievementProgress(profile, lang) {
        const unlocked = profile.achievements?.unlocked?.length || 0;
        const total = typeof achievementManager !== 'undefined' ? achievementManager.achievements.length
            : (typeof ACHIEVEMENTS !== 'undefined' ? ACHIEVEMENTS.length : 0);

        const widget = document.createElement('div');
        widget.className = 'achievement-progress-widget';
        widget.style.cssText = `
            background: rgba(255, 215, 0, 0.2);
            border: 2px solid #ffd700;
            border-radius: 12px;
            padding: 15px;
            margin: 15px 0;
            cursor: pointer;
            transition: transform 0.2s;
        `;
        widget.onmouseover = () => widget.style.transform = 'scale(1.02)';
        widget.onmouseout = () => widget.style.transform = 'scale(1)';
        widget.onclick = () => {
            // Show achievements screen
        };

        const percentage = (unlocked / total) * 100;

        widget.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <div style="font-size: 2rem;">🏆</div>
                <div style="flex: 1;">
                    <div style="font-size: 1.1rem; font-weight: bold; color: #ffd700;">
                        ${t('achievements', lang) || 'Achievements'}
                    </div>
                    <div style="font-size: 0.9rem; color: #aaa;">
                        ${unlocked} / ${total} unlocked
                    </div>
                </div>
                <div style="font-size: 1.5rem; font-weight: bold; color: #ffd700;">
                    ${Math.round(percentage)}%
                </div>
            </div>
            ${this.createProgressBar(percentage, '#ffd700')}
        `;

        return widget;
    }
}

// Create global recommendations widget
const recommendationsWidget = new RecommendationsWidget();
