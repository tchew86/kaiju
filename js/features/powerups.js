// KAIJU - Power-ups System
// Rage Mode, Shield, Time Freeze

class PowerUpManager {
    constructor() {
        this.powerups = this.initializePowerups();
        this.activePowerup = null;
        this.duration = 0;
    }

    // Initialize power-up definitions
    initializePowerups() {
        return {
            RAGE: {
                id: 'rage',
                name: {
                    en: 'Rage Mode',
                    nl: 'Woede Modus',
                    de: 'Wut-Modus',
                    vi: 'Chế Độ Giận Dữ'
                },
                icon: '😤',
                duration: 3, // Number of questions
                effect: 'double_damage',
                description: {
                    en: 'Deal 2× damage for 3 questions',
                    nl: 'Doe 2× schade voor 3 vragen',
                    de: 'Verursache 2× Schaden für 3 Fragen',
                    vi: 'Gây 2× sát thương trong 3 câu'
                },
                color: '#ff0000',
                unlockLevel: 5
            },

            SHIELD: {
                id: 'shield',
                name: {
                    en: 'Shield',
                    nl: 'Schild',
                    de: 'Schild',
                    vi: 'Khiên'
                },
                icon: '🛡️',
                duration: 3,
                effect: 'block_wrong',
                description: {
                    en: 'Wrong answers don\'t damage HP for 3 questions',
                    nl: 'Foute antwoorden schaden HP niet voor 3 vragen',
                    de: 'Falsche Antworten schaden HP nicht für 3 Fragen',
                    vi: 'Câu trả lời sai không giảm HP trong 3 câu'
                },
                color: '#00ccff',
                unlockLevel: 10
            },

            TIME_FREEZE: {
                id: 'time_freeze',
                name: {
                    en: 'Time Freeze',
                    nl: 'Tijd Bevriezen',
                    de: 'Zeit Einfrieren',
                    vi: 'Đóng Băng Thời Gian'
                },
                icon: '❄️',
                duration: 3,
                effect: 'freeze_timer',
                description: {
                    en: 'Timer doesn\'t count down for 3 questions',
                    nl: 'Timer telt niet af voor 3 vragen',
                    de: 'Timer läuft nicht ab für 3 Fragen',
                    vi: 'Đồng hồ không chạy trong 3 câu'
                },
                color: '#00ffff',
                unlockLevel: 15
            },

            FOCUS: {
                id: 'focus',
                name: {
                    en: 'Focus',
                    nl: 'Focus',
                    de: 'Fokus',
                    vi: 'Tập Trung'
                },
                icon: '🎯',
                duration: 5,
                effect: 'show_hint',
                description: {
                    en: 'See hints for 5 questions',
                    nl: 'Zie hints voor 5 vragen',
                    de: 'Sehe Hinweise für 5 Fragen',
                    vi: 'Xem gợi ý trong 5 câu'
                },
                color: '#ff00ff',
                unlockLevel: 8
            },

            COMBO_BOOST: {
                id: 'combo_boost',
                name: {
                    en: 'Combo Boost',
                    nl: 'Combo Boost',
                    de: 'Combo-Boost',
                    vi: 'Tăng Combo'
                },
                icon: '🔥',
                duration: 5,
                effect: 'triple_combo',
                description: {
                    en: 'Combo builds 3× faster for 5 questions',
                    nl: 'Combo bouwt 3× sneller voor 5 vragen',
                    de: 'Combo baut sich 3× schneller auf für 5 Fragen',
                    vi: 'Combo tăng 3× nhanh hơn trong 5 câu'
                },
                color: '#ffaa00',
                unlockLevel: 12
            }
        };
    }

    // Activate a power-up
    activate(powerupId, lang = 'en') {
        const powerup = this.powerups[powerupId.toUpperCase()];

        if (!powerup) {
            console.error(`Power-up ${powerupId} not found`);
            return false;
        }

        if (this.activePowerup) {
            console.warn('Power-up already active');
            return false;
        }

        this.activePowerup = powerup;
        this.duration = powerup.duration;

        // Play sound
        if (typeof soundSystem !== 'undefined') {
            soundSystem.playSupercharge();
        }

        // Show notification
        this.showPowerupNotification(powerup, lang);

        return true;
    }

    // Use one charge of the active power-up
    useCharge() {
        if (!this.activePowerup || this.duration <= 0) return false;

        // Consume one charge for the current question. A duration-N power-up applies
        // to exactly N questions: this returns true for each of those N charges.
        this.duration--;
        this.updateIndicator();

        if (this.duration <= 0) {
            // Last charge consumed — tear down, but this charge still counted.
            this.deactivate();
        }

        return true;
    }

    // Deactivate current power-up
    deactivate() {
        if (!this.activePowerup) return;
        this.activePowerup = null;
        this.duration = 0;

        // Hide UI indicator
        const indicator = document.querySelector('.powerup-active');
        if (indicator) {
            indicator.remove();
        }
    }

    // Check if a specific effect is active
    hasEffect(effectType) {
        return this.activePowerup && this.activePowerup.effect === effectType;
    }

    // Get active power-up info
    getActive() {
        if (!this.activePowerup) return null;

        return {
            ...this.activePowerup,
            remaining: this.duration
        };
    }

    // Check if player has unlocked a power-up
    isUnlocked(powerupId, playerLevel) {
        const powerup = this.powerups[powerupId.toUpperCase()];
        return powerup && playerLevel >= powerup.unlockLevel;
    }

    // Get all available power-ups for player
    getAvailable(playerLevel) {
        return Object.values(this.powerups).filter(p => playerLevel >= p.unlockLevel);
    }

    // Apply power-up effect to damage calculation
    applyDamageEffect(baseDamage) {
        if (this.hasEffect('double_damage')) {
            return baseDamage * 2;
        }
        return baseDamage;
    }

    // Apply power-up effect to combo
    applyComboEffect(comboIncrement) {
        if (this.hasEffect('triple_combo')) {
            return comboIncrement * 3;
        }
        return comboIncrement;
    }

    // Check if timer should be frozen
    shouldFreezeTimer() {
        return this.hasEffect('freeze_timer');
    }

    // Check if HP damage should be blocked
    shouldBlockDamage() {
        return this.hasEffect('block_wrong');
    }

    // Check if hints should be shown
    shouldShowHint() {
        return this.hasEffect('show_hint');
    }

    // Show power-up activation notification
    showPowerupNotification(powerup, lang = 'en') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'powerup-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: ${powerup.color};
            border: 5px solid #fff;
            border-radius: 20px;
            padding: 30px 50px;
            text-align: center;
            z-index: 9999;
            box-shadow: 0 0 40px ${powerup.color};
            animation: powerupPop 1s ease-out forwards;
        `;

        notification.innerHTML = `
            <div style="font-size: 5rem;">${powerup.icon}</div>
            <div style="font-size: 2rem; font-weight: bold; color: #fff; margin-top: 10px;">
                ${powerup.name[lang] || powerup.name.en}
            </div>
            <div style="font-size: 1.2rem; color: #fff; margin-top: 10px;">
                ${powerup.description[lang] || powerup.description.en}
            </div>
        `;

        document.body.appendChild(notification);

        // Add CSS animation once (avoid leaking a new <style> node per activation)
        if (!document.getElementById('powerup-pop-style')) {
            const style = document.createElement('style');
            style.id = 'powerup-pop-style';
            style.textContent = `
                @keyframes powerupPop {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'powerupPop 0.3s ease-in reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2000);

        // Show persistent indicator
        this.showActiveIndicator(powerup, lang);
    }

    // Show active power-up indicator (stays on screen)
    showActiveIndicator(powerup, lang = 'en') {
        // Remove old indicator if exists
        const oldIndicator = document.querySelector('.powerup-active');
        if (oldIndicator) oldIndicator.remove();

        const indicator = document.createElement('div');
        indicator.className = 'powerup-active';
        indicator.innerHTML = `
            <span class="powerup-icon">${powerup.icon}</span>
            <span class="powerup-name">${powerup.name[lang] || powerup.name.en}</span>
            <span class="powerup-duration">${this.duration}</span>
        `;

        document.body.appendChild(indicator);
    }

    // Update indicator remaining count
    updateIndicator() {
        const durationEl = document.querySelector('.powerup-duration');
        if (durationEl) {
            durationEl.textContent = this.duration;

            // Pulse animation when low
            if (this.duration <= 1) {
                durationEl.style.animation = 'pulse 0.5s ease-in-out infinite';
            }
        }
    }

    // Randomly award power-up based on performance
    maybeAwardPowerup(correctStreak, comboCount, playerLevel) {
        // Don't award if one is already active
        if (this.activePowerup) return null;

        // Award power-up every 10 correct answers (use modulo so a skipped exact
        // value — e.g. from combo multipliers — doesn't silently miss the award)
        if (correctStreak > 0 && correctStreak % 10 === 0) {
            const available = this.getAvailable(playerLevel);
            if (available.length > 0) {
                const powerup = available[Math.floor(Math.random() * available.length)];
                return powerup.id;
            }
        }

        // Award on high combo
        if (comboCount > 0 && comboCount % 15 === 0) {
            if (this.isUnlocked('COMBO_BOOST', playerLevel)) {
                return 'COMBO_BOOST';
            }
        }

        return null;
    }
}

// Create global power-up manager instance
const powerupManager = new PowerUpManager();
