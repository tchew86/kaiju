// KAIJU - Enemy Collection (Pokedex)
// Track and display all defeated enemies

class EnemyPokedex {
    constructor() {
        this.enemies = this.initializeEnemies();
    }

    // Initialize all enemy types in the game
    initializeEnemies() {
        return {
            // Tier 1 - Common enemies
            'SPIKEBACK': {
                id: 'spikeback',
                name: { en: 'Spikeback', nl: 'Spikeback', de: 'Spikeback', vi: 'Spikeback' },
                emoji: '🦔',
                type: 'armored',
                tier: 1,
                description: { en: 'Spiky armored beast, tough as a fortress', nl: 'Stekelig gepantserd beest, zo taai als een fort' }
            },
            'ROCKHORN': {
                id: 'rockhorn',
                name: { en: 'Rockhorn', nl: 'Rockhorn', de: 'Rockhorn', vi: 'Rockhorn' },
                emoji: '🦖',
                type: 'normal',
                tier: 1,
                description: { en: 'Burrowing brute with a thick rocky hide', nl: 'Gravend monster met een dikke rotsachtige huid' }
            },
            'SKYTALON': {
                id: 'skytalon',
                name: { en: 'Skytalon', nl: 'Skytalon', de: 'Skytalon', vi: 'Skytalon' },
                emoji: '🦅',
                type: 'flying',
                tier: 1,
                description: { en: 'Swift sky predator with fiery wings', nl: 'Snelle luchtjager met vurige vleugels' }
            },
            'GRUBLING': {
                id: 'grubling',
                name: { en: 'Grubling', nl: 'Grubling', de: 'Grubling', vi: 'Grubling' },
                emoji: '🐛',
                type: 'normal',
                tier: 1,
                description: { en: 'A gentle grub, weak but determined', nl: 'Een zachte larve, zwak maar vastberaden' }
            },
            'BOLTBOT': {
                id: 'boltbot',
                name: { en: 'Boltbot', nl: 'Boltbot', de: 'Boltbot', vi: 'Boltbot' },
                emoji: '🤖',
                type: 'normal',
                tier: 1,
                description: { en: 'Size-changing robot hero', nl: 'Grootte-veranderende robot held' }
            },

            // Tier 2 - Mid-tier enemies
            'LUNAWING': {
                id: 'lunawing',
                name: { en: 'Lunawing', nl: 'Lunawing', de: 'Lunawing', vi: 'Lunawing' },
                emoji: '🦋',
                type: 'flying',
                tier: 2,
                description: { en: 'Radiant winged guardian, graceful and fast', nl: 'Stralende gevleugelde voogd, sierlijk en snel' }
            },
            'RAZORBEAK': {
                id: 'razorbeak',
                name: { en: 'Razorbeak', nl: 'Razorbeak', de: 'Razorbeak', vi: 'Razorbeak' },
                emoji: '⚔️',
                type: 'fast',
                tier: 2,
                description: { en: 'Cyborg beast with razor claws', nl: 'Cyborg beest met scheermesklauwen' }
            },
            'SLUDGEMAW': {
                id: 'sludgemaw',
                name: { en: 'Sludgemaw', nl: 'Sludgemaw', de: 'Sludgemaw', vi: 'Sludgemaw' },
                emoji: '☠️',
                type: 'toxic',
                tier: 2,
                description: { en: 'Toxic sludge monster born of pollution', nl: 'Giftig slibmonster geboren uit vervuiling' }
            },
            'FINBACK': {
                id: 'finback',
                name: { en: 'Finback', nl: 'Finback', de: 'Finback', vi: 'Finback' },
                emoji: '🦕',
                type: 'aquatic',
                tier: 2,
                description: { en: 'Ancient deep-sea leviathan', nl: 'Oude diepzee-leviathan' }
            },
            'DRILLHORN': {
                id: 'drillhorn',
                name: { en: 'Drillhorn', nl: 'Drillhorn', de: 'Drillhorn', vi: 'Drillhorn' },
                emoji: '🪲',
                type: 'fast',
                tier: 2,
                description: { en: 'Drill-armed beetle warrior', nl: 'Boor-gewapende keverstrijder' }
            },
            'STONELION': {
                id: 'stonelion',
                name: { en: 'Stonelion', nl: 'Stonelion', de: 'Stonelion', vi: 'Stonelion' },
                emoji: '🦁',
                type: 'normal',
                tier: 2,
                description: { en: 'Ancient stone lion guardian', nl: 'Oude stenen leeuwvoogd' }
            },
            'VINEMAW': {
                id: 'vinemaw',
                name: { en: 'Vinemaw', nl: 'Vinemaw', de: 'Vinemaw', vi: 'Vinemaw' },
                emoji: '🌿',
                type: 'plant',
                tier: 2,
                description: { en: 'Plant-beast hybrid of terrifying beauty', nl: 'Plant-beest hybride van angstaanjagende schoonheid' }
            },

            // Tier 3 - Advanced enemies
            'GRIMAPE': {
                id: 'grimape',
                name: { en: 'Grimape', nl: 'Grimape', de: 'Grimape', vi: 'Grimape' },
                emoji: '🦍',
                type: 'normal',
                tier: 3,
                description: { en: 'Mighty ape titan from the lost island', nl: 'Machtige aap-titaan van het verloren eiland' }
            },
            'TRISTORM': {
                id: 'tristorm',
                name: { en: 'Tristorm', nl: 'Tristorm', de: 'Tristorm', vi: 'Tristorm' },
                emoji: '🐲',
                type: 'boss',
                tier: 3,
                description: { en: 'Three-headed dragon from the stars', nl: 'Driekoppige draak van de sterren' }
            },
            'DOOMCLAW': {
                id: 'doomclaw',
                name: { en: 'Doomclaw', nl: 'Doomclaw', de: 'Doomclaw', vi: 'Doomclaw' },
                emoji: '👹',
                type: 'boss',
                tier: 3,
                description: { en: 'Demonic evolution, destruction incarnate', nl: 'Demonische evolutie, vernietiging in eigen persoon' }
            },
            'RAZORBEAK_X': {
                id: 'razorbeak_x',
                name: { en: 'Razorbeak X', nl: 'Razorbeak X', de: 'Razorbeak X', vi: 'Razorbeak X' },
                emoji: '⚔️',
                type: 'fast',
                tier: 3,
                description: { en: 'Enhanced cyborg with dual chainsaws', nl: 'Verbeterde cyborg met dubbele kettingzagen' }
            },
            'SCARLORD': {
                id: 'scarlord',
                name: { en: 'Scarlord', nl: 'Scarlord', de: 'Scarlord', vi: 'Scarlord' },
                emoji: '👑',
                type: 'boss',
                tier: 3,
                description: { en: 'Tyrannical ape ruler from the deep earth', nl: 'Tirannieke aap-heerser uit de diepe aarde' }
            },

            // Tier 4 - Boss enemies
            'MECHATITAN': {
                id: 'mechatitan',
                name: { en: 'Mechatitan', nl: 'Mechatitan', de: 'Mechatitan', vi: 'Mechatitan' },
                emoji: '🤖',
                type: 'armored',
                tier: 4,
                description: { en: 'Mechanical doppelganger, armed to the teeth', nl: 'Mechanische dubbelganger, tot de tanden bewapend' }
            },
            'MECHA_TRISTORM': {
                id: 'mecha_tristorm',
                name: { en: 'Mecha Tristorm', nl: 'Mecha Tristorm', de: 'Mecha Tristorm', vi: 'Mecha Tristorm' },
                emoji: '🐉',
                type: 'boss',
                tier: 4,
                description: { en: 'Cybernetic resurrection of Tristorm', nl: 'Cybernetische opstanding van Tristorm' }
            },
            'OMEGA_MECHATITAN': {
                id: 'omega_mechatitan',
                name: { en: 'Omega Mechatitan', nl: 'Omega Mechatitan', de: 'Omega Mechatitan', vi: 'Omega Mechatitan' },
                emoji: '🦾',
                type: 'armored',
                tier: 4,
                description: { en: 'Ultimate mechanical war machine', nl: 'Ultieme mechanische oorlogsmachine' }
            },
            'DOOMCLAW_PRIME': {
                id: 'doomclaw_prime',
                name: { en: 'Doomclaw Prime', nl: 'Doomclaw Prime', de: 'Doomclaw Prime', vi: 'Doomclaw Prime' },
                emoji: '💀',
                type: 'boss',
                tier: 5,
                description: { en: 'Final evolution form, ultimate destruction', nl: 'Definitieve evolutievorm, ultieme vernietiging' }
            },
            'GIGAFIST': {
                id: 'gigafist',
                name: { en: 'Gigafist', nl: 'Gigafist', de: 'Gigafist', vi: 'Gigafist' },
                emoji: '💥',
                type: 'boss',
                tier: 4,
                description: { en: 'Colossal titan of raw power', nl: 'Kolossale titaan van pure kracht' }
            },
            'MUTAGEN': {
                id: 'mutagen',
                name: { en: 'Mutagen', nl: 'Mutagen', de: 'Mutagen', vi: 'Mutagen' },
                emoji: '🧪',
                type: 'boss',
                tier: 4,
                description: { en: 'Experimental genetic horror', nl: 'Experimentele genetische horror' }
            },
            'MUTAGEN_II': {
                id: 'mutagen_ii',
                name: { en: 'Mutagen II', nl: 'Mutagen II', de: 'Mutagen II', vi: 'Mutagen II' },
                emoji: '🧬',
                type: 'boss',
                tier: 4,
                description: { en: 'Advanced genetic abomination', nl: 'Geavanceerde genetische gruwel' }
            }
        };
    }

    // Show Pokedex modal
    show(profile, lang = 'en') {
        const modal = document.createElement('div');
        modal.className = 'pokedex-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            overflow-y: auto;
            padding: 20px;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            max-width: 1200px;
            margin: 0 auto;
            background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
            border: 4px solid #00ff00;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 0 40px rgba(0, 255, 0, 0.5);
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #00ff00;
        `;

        header.innerHTML = `
            <h1 style="
                font-size: 2.5rem;
                color: #00ff00;
                margin: 0 0 10px 0;
                text-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
            ">🦖 KAIJU COLLECTION 🦖</h1>
            <div style="font-size: 1.2rem; color: #ffaa00;">
                ${this.getCollectionProgress(profile)} Discovered
            </div>
        `;

        // Filters
        const filters = this.createFilters();

        // Enemy grid
        const grid = this.createEnemyGrid(profile, lang);

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

        container.appendChild(header);
        container.appendChild(filters);
        container.appendChild(grid);
        container.appendChild(closeBtn);

        modal.appendChild(container);

        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        document.body.appendChild(modal);
        return modal;
    }

    // Create filter buttons
    createFilters() {
        const filters = document.createElement('div');
        filters.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        `;

        const types = [
            { id: 'all', label: 'All', icon: '🌟', color: '#fff' },
            { id: 'normal', label: 'Normal', icon: '⚪', color: '#888' },
            { id: 'flying', label: 'Flying', icon: '🦅', color: '#00ccff' },
            { id: 'armored', label: 'Armored', icon: '🛡️', color: '#666' },
            { id: 'fast', label: 'Fast', icon: '⚡', color: '#ffaa00' },
            { id: 'boss', label: 'Boss', icon: '👑', color: '#ff0000' }
        ];

        types.forEach(type => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${type.id === 'all' ? 'active' : ''}`;
            btn.style.cssText = `
                background: rgba(0, 0, 0, 0.5);
                border: 2px solid ${type.color};
                color: ${type.color};
                padding: 10px 20px;
                border-radius: 10px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            `;
            btn.textContent = `${type.icon} ${type.label}`;

            btn.onclick = () => {
                // Remove active from all
                filters.querySelectorAll('.filter-btn').forEach(b => {
                    b.style.background = 'rgba(0, 0, 0, 0.5)';
                    b.classList.remove('active');
                });

                // Set active
                btn.style.background = type.color + '33';
                btn.classList.add('active');

                // Filter grid
                this.filterGrid(type.id);
            };

            filters.appendChild(btn);
        });

        return filters;
    }

    // Create enemy grid
    createEnemyGrid(profile, lang) {
        const grid = document.createElement('div');
        grid.className = 'enemy-grid';
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        `;

        Object.values(this.enemies).forEach(enemy => {
            const defeated = this.isDefeated(profile, enemy.id);
            const card = this.createEnemyCard(enemy, defeated, lang, profile);
            grid.appendChild(card);
        });

        return grid;
    }

    // Create individual enemy card
    createEnemyCard(enemy, defeated, lang, profile) {
        const card = document.createElement('div');
        card.className = `enemy-card type-${enemy.type}`;
        card.style.cssText = `
            background: ${defeated ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 0, 0, 0.5)'};
            border: 3px solid ${this.getTypeColor(enemy.type)};
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            opacity: ${defeated ? '1' : '0.5'};
            filter: ${defeated ? 'none' : 'grayscale(100%)'};
        `;

        card.onmouseover = () => {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = `0 10px 30px ${this.getTypeColor(enemy.type)}66`;
        };
        card.onmouseout = () => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = 'none';
        };

        // Type badge
        const typeBadge = document.createElement('div');
        typeBadge.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: ${this.getTypeColor(enemy.type)};
            color: ${enemy.type === 'armored' ? '#fff' : '#000'};
            padding: 5px 10px;
            border-radius: 8px;
            font-size: 0.7rem;
            font-weight: bold;
            text-transform: uppercase;
        `;
        typeBadge.textContent = enemy.type;

        card.style.position = 'relative';
        card.appendChild(typeBadge);

        // Enemy display
        const display = document.createElement('div');
        display.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 10px;">
                ${defeated ? enemy.emoji : '❓'}
            </div>
            <div style="font-size: 1.3rem; font-weight: bold; color: ${this.getTypeColor(enemy.type)}; margin-bottom: 5px;">
                ${defeated ? (enemy.name[lang] || enemy.name.en) : '???'}
            </div>
            <div style="font-size: 0.9rem; color: #aaa; margin-bottom: 10px;">
                Tier ${enemy.tier}
            </div>
            <div style="font-size: 0.85rem; color: #999; min-height: 40px;">
                ${defeated ? (enemy.description[lang] || enemy.description.en) : 'Not yet discovered...'}
            </div>
        `;

        card.appendChild(display);

        // Stats (if defeated)
        if (defeated) {
            const stats = this.getEnemyStats(profile, enemy.id);
            if (stats) {
                const statsDiv = document.createElement('div');
                statsDiv.style.cssText = `
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 2px solid ${this.getTypeColor(enemy.type)}44;
                `;

                statsDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-around; font-size: 0.9rem;">
                        <div>
                            <div style="color: #00ff00; font-weight: bold;">${stats.defeated}</div>
                            <div style="color: #666; font-size: 0.7rem;">Defeated</div>
                        </div>
                        <div>
                            <div style="color: #ffaa00; font-weight: bold;">${stats.winRate}%</div>
                            <div style="color: #666; font-size: 0.7rem;">Win Rate</div>
                        </div>
                    </div>
                `;

                card.appendChild(statsDiv);
            }
        }

        return card;
    }

    // Check if enemy has been defeated
    isDefeated(profile, enemyId) {
        if (!profile.enemiesDefeated) return false;
        return profile.enemiesDefeated[enemyId] && profile.enemiesDefeated[enemyId].count > 0;
    }

    // Get enemy stats
    getEnemyStats(profile, enemyId) {
        if (!profile.enemiesDefeated || !profile.enemiesDefeated[enemyId]) {
            return null;
        }

        const data = profile.enemiesDefeated[enemyId];
        return {
            defeated: data.count || 0,
            winRate: data.battles > 0 ? Math.round((data.wins / data.battles) * 100) : 0
        };
    }

    // Get type color
    getTypeColor(type) {
        const colors = {
            'normal': '#888',
            'flying': '#00ccff',
            'armored': '#666',
            'fast': '#ffaa00',
            'boss': '#ff0000'
        };
        return colors[type] || '#888';
    }

    // Get collection progress
    getCollectionProgress(profile) {
        const total = Object.keys(this.enemies).length;
        let discovered = 0;

        Object.keys(this.enemies).forEach(enemyKey => {
            const enemy = this.enemies[enemyKey];
            if (this.isDefeated(profile, enemy.id)) {
                discovered++;
            }
        });

        return `${discovered}/${total}`;
    }

    // Filter grid by type
    filterGrid(type) {
        const cards = document.querySelectorAll('.enemy-card');

        cards.forEach(card => {
            if (type === 'all' || card.classList.contains(`type-${type}`)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Track enemy defeat
    trackDefeat(profile, enemyId, won) {
        if (!profile.enemiesDefeated) {
            profile.enemiesDefeated = {};
        }

        if (!profile.enemiesDefeated[enemyId]) {
            profile.enemiesDefeated[enemyId] = {
                count: 0,
                battles: 0,
                wins: 0,
                firstDefeated: Date.now()
            };
        }

        const data = profile.enemiesDefeated[enemyId];
        data.battles++;
        if (won) {
            data.count++;
            data.wins++;
        }
        data.lastBattle = Date.now();
    }
}

// Create global pokedex instance
const enemyPokedex = new EnemyPokedex();
