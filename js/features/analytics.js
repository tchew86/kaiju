// KAIJU - Learning Analytics & Progress Tracking

class AnalyticsTracker {
    constructor() {
        this.sessionStart = null;
    }

    // Start tracking session
    startSession() {
        this.sessionStart = Date.now();
    }

    // End session and save stats
    endSession(profile) {
        if (!this.sessionStart) return;

        const duration = Date.now() - this.sessionStart;
        const session = {
            date: new Date().toISOString().split('T')[0],
            duration: duration,
            questionsAnswered: 0,
            accuracy: 0
        };

        // Keep last 30 sessions
        if (!profile.analytics.sessions) {
            profile.analytics.sessions = [];
        }

        profile.analytics.sessions.push(session);
        if (profile.analytics.sessions.length > 30) {
            profile.analytics.sessions.shift();
        }

        this.sessionStart = null;
    }

    // Track a question attempt
    trackQuestion(fact, correct, timeSpent, profile) {
        if (!profile.analytics.facts) {
            profile.analytics.facts = {};
        }

        // Initialize fact data if not exists
        if (!profile.analytics.facts[fact]) {
            profile.analytics.facts[fact] = {
                attempts: 0,
                correct: 0,
                avgTime: 0,
                lastSeen: null,
                strength: 0  // 0-100, for spaced repetition
            };
        }

        const factData = profile.analytics.facts[fact];

        // Update attempts and correct count
        factData.attempts++;
        if (correct) factData.correct++;

        // Update average time (rolling average)
        factData.avgTime = ((factData.avgTime * (factData.attempts - 1)) + timeSpent) / factData.attempts;

        // Update last seen
        factData.lastSeen = Date.now();

        // Update strength (spaced repetition algorithm)
        if (correct) {
            // Correct answer: increase strength
            factData.strength = Math.min(100, factData.strength + 10);
        } else {
            // Incorrect answer: decrease strength
            factData.strength = Math.max(0, factData.strength - 20);
        }

        return factData;
    }

    // Track table performance
    trackTable(table, correct, timeSpent, profile) {
        if (!profile.analytics.tables) {
            profile.analytics.tables = {};
        }

        const tableKey = `table${table}`;

        if (!profile.analytics.tables[tableKey]) {
            profile.analytics.tables[tableKey] = {
                attempts: 0,
                correct: 0,
                avgTime: 0,
                mastery: 0
            };
        }

        const tableData = profile.analytics.tables[tableKey];

        tableData.attempts++;
        if (correct) tableData.correct++;

        // Update average time
        tableData.avgTime = ((tableData.avgTime * (tableData.attempts - 1)) + timeSpent) / tableData.attempts;

        // Calculate mastery (0-100)
        const accuracy = (tableData.correct / tableData.attempts) * 100;
        tableData.mastery = Math.min(100, (accuracy * 0.7 + this.speedFactor(tableData.avgTime) * 0.3));

        return tableData;
    }

    // Track range performance (for addition/subtraction ranges)
    trackRange(rangeKey, correct, timeSpent, profile) {
        if (!profile.analytics.ranges) {
            profile.analytics.ranges = {};
        }

        if (!profile.analytics.ranges[rangeKey]) {
            profile.analytics.ranges[rangeKey] = {
                attempts: 0,
                correct: 0,
                avgTime: 0,
                mastery: 0
            };
        }

        const rangeData = profile.analytics.ranges[rangeKey];

        rangeData.attempts++;
        if (correct) rangeData.correct++;

        // Update average time
        rangeData.avgTime = ((rangeData.avgTime * (rangeData.attempts - 1)) + timeSpent) / rangeData.attempts;

        // Calculate mastery (0-100)
        const accuracy = (rangeData.correct / rangeData.attempts) * 100;
        rangeData.mastery = Math.min(100, (accuracy * 0.7 + this.speedFactor(rangeData.avgTime) * 0.3));

        return rangeData;
    }

    // Track mistake for pattern analysis
    trackMistake(fact, correctAnswer, givenAnswer, profile) {
        if (!profile.analytics.mistakes) {
            profile.analytics.mistakes = [];
        }

        const mistake = {
            fact: fact,
            correct: correctAnswer,
            given: givenAnswer,
            timestamp: Date.now()
        };

        profile.analytics.mistakes.push(mistake);

        // Keep only last 100 mistakes
        if (profile.analytics.mistakes.length > 100) {
            profile.analytics.mistakes.shift();
        }

        return mistake;
    }

    // Get weak facts (for adaptive learning)
    getWeakFacts(profile, limit = 10) {
        if (!profile.analytics.facts) return [];

        const facts = Object.entries(profile.analytics.facts)
            .map(([fact, data]) => ({
                fact,
                ...data,
                accuracy: data.attempts > 0 ? (data.correct / data.attempts) * 100 : 0
            }))
            .filter(f => f.attempts >= 3 && f.accuracy < 80)  // Only show facts with < 80% accuracy (mistakes)
            .sort((a, b) => a.accuracy - b.accuracy);  // Sort by accuracy (worst first)

        return facts.slice(0, limit);
    }

    // Get facts due for review (spaced repetition)
    getDueForReview(profile, limit = 10) {
        if (!profile.analytics.facts) return [];

        const now = Date.now();
        const facts = Object.entries(profile.analytics.facts)
            .map(([fact, data]) => {
                const timeSinceSeen = data.lastSeen ? (now - data.lastSeen) / 1000 / 60 : Infinity;  // minutes
                const reviewInterval = this.getReviewInterval(data.strength);

                return {
                    fact,
                    ...data,
                    timeSinceSeen,
                    reviewInterval,
                    isDue: timeSinceSeen >= reviewInterval
                };
            })
            .filter(f => f.isDue)
            .sort((a, b) => b.timeSinceSeen - a.timeSinceSeen);  // Most overdue first

        return facts.slice(0, limit);
    }

    // Calculate review interval based on strength (spaced repetition)
    getReviewInterval(strength) {
        // Strength 0-20: Review in 5 minutes
        // Strength 20-40: Review in 30 minutes
        // Strength 40-60: Review in 4 hours
        // Strength 60-80: Review in 1 day
        // Strength 80-100: Review in 7 days

        if (strength < 20) return 5;
        if (strength < 40) return 30;
        if (strength < 60) return 240;  // 4 hours
        if (strength < 80) return 1440;  // 1 day
        return 10080;  // 7 days
    }

    // Convert an average answer time (seconds) into a 0-100 speed score.
    // Full marks at <= 2s, linearly down to 0 at >= 12s. Gentler than the old
    // (100 - avgTime*10), which zeroed out at a 10s average.
    speedFactor(avgTimeSeconds) {
        const t = avgTimeSeconds || 0;
        return Math.max(0, Math.min(100, 100 - Math.max(0, t - 2) * 10));
    }

    // Get mastery level for a table
    getMasteryLevel(tableStats) {
        if (!tableStats || tableStats.attempts < 5) return 'none';

        const mastery = tableStats.mastery || 0;

        if (mastery >= 90) return 'platinum';
        if (mastery >= 75) return 'gold';
        if (mastery >= 60) return 'silver';
        if (mastery >= 40) return 'bronze';
        return 'none';
    }

    // Get recommendations for practice
    getRecommendations(profile) {
        const recommendations = [];

        // Get weakest table
        if (profile.analytics.tables) {
            const tables = Object.entries(profile.analytics.tables)
                .map(([table, data]) => ({
                    table: parseInt(table.replace('table', '')),
                    ...data
                }))
                .filter(t => t.attempts >= 5)
                .sort((a, b) => a.mastery - b.mastery);

            if (tables.length > 0 && tables[0].mastery < 70) {
                recommendations.push({
                    type: 'practice_table',
                    table: tables[0].table,
                    reason: `Low mastery (${Math.round(tables[0].mastery)}%)`,
                    priority: 'high'
                });
            }
        }

        // Get weak facts
        const weakFacts = this.getWeakFacts(profile, 3);
        if (weakFacts.length > 0) {
            recommendations.push({
                type: 'review_facts',
                facts: weakFacts.map(f => f.fact),
                reason: 'These facts need more practice',
                priority: 'medium'
            });
        }

        // Get due facts
        const dueFacts = this.getDueForReview(profile, 3);
        if (dueFacts.length > 0) {
            recommendations.push({
                type: 'spaced_review',
                facts: dueFacts.map(f => f.fact),
                reason: 'Time to review these facts',
                priority: 'medium'
            });
        }

        return recommendations;
    }

    // Generate progress report
    generateReport(profile) {
        const report = {
            overall: {
                totalBattles: profile.gamesPlayed || 0,
                level: profile.level || 1,
                xp: profile.xp || 0,
                evolutionStage: profile.evolutionStage || 0
            },
            tables: {},
            topFacts: [],
            weakFacts: [],
            recentProgress: null
        };

        // Table stats
        if (profile.analytics.tables) {
            Object.entries(profile.analytics.tables).forEach(([table, data]) => {
                const tableNum = parseInt(table.replace('table', ''));
                report.tables[tableNum] = {
                    accuracy: data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : 0,
                    avgTime: Math.round(data.avgTime * 10) / 10,
                    mastery: Math.round(data.mastery),
                    masteryLevel: this.getMasteryLevel(data),
                    attempts: data.attempts
                };
            });
        }

        // Top performing facts
        if (profile.analytics.facts) {
            const facts = Object.entries(profile.analytics.facts)
                .map(([fact, data]) => ({
                    fact,
                    accuracy: data.attempts > 0 ? (data.correct / data.attempts) * 100 : 0,
                    attempts: data.attempts
                }))
                .filter(f => f.attempts >= 3)
                .sort((a, b) => b.accuracy - a.accuracy);

            report.topFacts = facts.slice(0, 5);
        }

        // Weak facts
        report.weakFacts = this.getWeakFacts(profile, 5);

        // Recent progress (last 7 days)
        if (profile.analytics.sessions) {
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            const recentSessions = profile.analytics.sessions.filter(
                s => new Date(s.date).getTime() > sevenDaysAgo
            );

            report.recentProgress = {
                daysPlayed: new Set(recentSessions.map(s => s.date)).size,
                totalTime: recentSessions.reduce((sum, s) => sum + s.duration, 0),
                avgSessionTime: recentSessions.length > 0 ?
                    recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length : 0
            };
        }

        return report;
    }
}

// Create global analytics tracker
const analytics = new AnalyticsTracker();
