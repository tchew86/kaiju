// KAIJU - Phase 2 Integration Functions
// Helper functions that connect Phase 2 systems to the main game

// ============================================
// DAILY STREAK MANAGEMENT
// ============================================

function updateDailyStreak() {
    if (!playerProfile.streaks) return;

    const today = new Date().toDateString();
    const lastPlay = playerProfile.streaks.lastPlayDate ?
        new Date(playerProfile.streaks.lastPlayDate).toDateString() : null;

    if (lastPlay !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastPlay === yesterday) {
            // Consecutive day
            playerProfile.streaks.daily = (playerProfile.streaks.daily || 0) + 1;
        } else if (lastPlay !== today) {
            // Streak broken
            playerProfile.streaks.daily = 1;
        }

        playerProfile.streaks.lastPlayDate = new Date().toISOString();
        saveCurrentProfile();
    }
}

// ============================================
// PRACTICE MODE SELECTOR
// ============================================

function showPracticeModeSelector() {
    const modal = UIComponents.createModal('', { maxWidth: '500px', borderColor: '#00ff00' });
    const container = modal.firstElementChild;

    container.innerHTML = `
        <h2 style="color: #00ff00; text-align: center; margin-bottom: 20px;">${t('practiceTitle')}</h2>
        <p style="color: #aaa; text-align: center; margin-bottom: 20px;">
            ${t('practiceChoose')}
        </p>

        <h3 style="color: #ffaa00; text-align: center; margin: 15px 0 10px 0;">${t('multiplicationTables')}</h3>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px;">
            ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(table => `
                <button class="practice-table-btn" data-table="${table}" style="
                    background: linear-gradient(135deg, #00ff00, #00aa00);
                    color: #000;
                    border: none;
                    padding: 15px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    ${table}×
                </button>
            `).join('')}
        </div>

        <h3 style="color: #ffaa00; text-align: center; margin: 15px 0 10px 0;">${t('additionRanges')}</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
            ${[
                {label: '1-5', range: '1-5'},
                {label: '6-10', range: '6-10'},
                {label: '1-10', range: '1-10'},
                {label: '11-20', range: '11-20'},
                {label: '21-50', range: '21-50'},
                {label: '51-100', range: '51-100'},
                {label: '100-250', range: '100-250'}
            ].map(r => `
                <button class="practice-range-btn" data-range="${r.range}" style="
                    background: linear-gradient(135deg, #ff6600, #cc5500);
                    color: #fff;
                    border: none;
                    padding: 15px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    ${r.label}
                </button>
            `).join('')}
        </div>

        <h3 style="color: #ffaa00; text-align: center; margin: 15px 0 10px 0;">${t('additionOptions')}</h3>
        <div style="display: flex; gap: 15px; justify-content: center; align-items: center; flex-wrap: wrap; margin-bottom: 20px; padding: 15px; background: rgba(0, 0, 0, 0.3); border: 2px solid #00ff00; border-radius: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; color: #fff; font-weight: bold; cursor: pointer;">
                <input type="checkbox" id="practice-subtraction-toggle" style="width: 20px; height: 20px; cursor: pointer;">
                <span>${t('includeSubtraction')}</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; color: #fff; font-weight: bold; cursor: pointer;">
                <input type="checkbox" id="practice-overhang-toggle" style="width: 20px; height: 20px; cursor: pointer;">
                <span>${t('carrying')}</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; color: #fff; font-weight: bold; cursor: pointer;">
                <input type="checkbox" id="practice-threepart-toggle" style="width: 20px; height: 20px; cursor: pointer;">
                <span>${t('threePart')}</span>
            </label>
        </div>

        <button id="close-practice-modal" style="
            background: #ff0000;
            color: #fff;
            border: none;
            padding: 12px 30px;
            font-size: 1.1rem;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            display: block;
            margin: 0 auto;
        ">${t('cancel')}</button>
    `;

    modal.appendChild(container);
    UIComponents.openModal(modal);

    // Wire up table buttons
    container.querySelectorAll('.practice-table-btn').forEach(btn => {
        btn.onclick = () => {
            const table = parseInt(btn.dataset.table);
            modal.remove();
            if (typeof practiceMode !== 'undefined') {
                startPracticeSession(table, 'multiply');
            }
        };
    });

    // Wire up range buttons
    container.querySelectorAll('.practice-range-btn').forEach(btn => {
        btn.onclick = () => {
            const range = btn.dataset.range;

            // Get options from checkboxes
            const options = {
                includeSubtraction: document.getElementById('practice-subtraction-toggle')?.checked || false,
                allowOverhang: document.getElementById('practice-overhang-toggle')?.checked || false,
                includeThreePart: document.getElementById('practice-threepart-toggle')?.checked || false
            };

            modal.remove();
            if (typeof practiceMode !== 'undefined') {
                startPracticeSession(range, 'add', options);
            }
        };
    });

    document.getElementById('close-practice-modal').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function startPracticeSession(tableOrRange, operation = 'multiply', options = {}) {

    if (typeof practiceUI !== 'undefined' && typeof practiceMode !== 'undefined') {
        try {
            practiceUI.start(tableOrRange, operation, options);
        } catch (error) {
            console.error('Error starting practice:', error);
            alert('Error starting practice mode: ' + error.message);
        }
    } else {
        const missing = [];
        if (typeof practiceUI === 'undefined') missing.push('practiceUI');
        if (typeof practiceMode === 'undefined') missing.push('practiceMode');
        alert(`Practice mode not loaded! Missing: ${missing.join(', ')}`);
    }
}

// ============================================
// GAME MODES SELECTOR
// ============================================

function showGameModesSelector() {
    const modal = UIComponents.createModal(`
        <h2>${t('gameModesTitle')}</h2>
        <div class="mode-choices">
            <button class="mode-card" data-mode="practice">
                <span class="mode-title">${t('practiceTitle')}</span>
                <span>${t('practiceDescription')}</span>
            </button>
            <button class="mode-card" data-mode="challenge">
                <span class="mode-title">${t('challengeTitle')}</span>
                <span>${t('challengeDescription')}</span>
            </button>
            <button class="mode-card" data-mode="campaign">
                <span class="mode-title">${t('campaignTitle')}</span>
                <span>${t('campaignDescription')}</span>
            </button>
        </div>
        <button class="dialog-close">${t('close')}</button>
    `, { maxWidth: '600px' });
    const actions = { practice: showPracticeModeSelector, challenge: showChallengeSetup, campaign: showCampaignMode };
    modal.querySelectorAll('[data-mode]').forEach(button => {
        button.onclick = () => { modal.remove(); actions[button.dataset.mode](); };
    });
    modal.querySelector('.dialog-close').onclick = () => modal.remove();
    UIComponents.openModal(modal);
}

function startChallengeMode() {
    document.querySelector('.modal-overlay')?.remove();
    showChallengeSetup();
}

function showChallengeSetup() {
    document.querySelector('.modal-overlay')?.remove();
    const modal = UIComponents.createModal('', { maxWidth: '700px', borderColor: '#ffaa00' });
    const container = modal.firstElementChild;

    const savedOperation = playerProfile.battleSettings?.selectedOperation || playerProfile.settings?.operation || 'multiply';
    const savedTables = playerProfile.battleSettings?.selectedTables || [1,2,3,4,5,6,7,8,9,10];
    const savedRanges = playerProfile.battleSettings?.selectedRanges || [];
    const savedMixedMode = playerProfile.battleSettings?.mixedMode || false;

    container.innerHTML = `
        <h1 style="color: #ffaa00; text-align: center; margin: 0 0 15px 0; font-size: 2rem;">${t('challengeSetup')}</h1>
        <p style="color: #aaa; text-align: center; margin-bottom: 20px;">${t('challengeSetupDescription')}</p>

        <!-- Operation Selection -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #ffaa00; margin: 0 0 10px 0; font-size: 1.3rem;">${t('chooseOperation')}</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <button class="challenge-operation-btn" data-operation="multiply" style="
                    background: ${savedOperation === 'multiply' && !savedMixedMode ? 'linear-gradient(135deg, #ffaa00, #ff8800)' : '#333'};
                    color: ${savedOperation === 'multiply' && !savedMixedMode ? '#000' : '#fff'};
                    border: 2px solid ${savedOperation === 'multiply' && !savedMixedMode ? '#ffaa00' : '#666'};
                    padding: 15px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                ">${t('multiply')}</button>
                <button class="challenge-operation-btn" data-operation="add" style="
                    background: ${savedOperation === 'add' && !savedMixedMode ? 'linear-gradient(135deg, #ffaa00, #ff8800)' : '#333'};
                    color: ${savedOperation === 'add' && !savedMixedMode ? '#000' : '#fff'};
                    border: 2px solid ${savedOperation === 'add' && !savedMixedMode ? '#ffaa00' : '#666'};
                    padding: 15px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                ">${t('add')}</button>
                <button class="challenge-operation-btn" data-operation="mixed" style="
                    background: ${savedMixedMode ? 'linear-gradient(135deg, #ff00ff, #aa00aa)' : '#333'};
                    color: #fff;
                    border: 2px solid ${savedMixedMode ? '#ff00ff' : '#666'};
                    padding: 15px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                ">${t('mixed')}</button>
            </div>
        </div>

        <!-- Addition Settings -->
        <div id="challenge-addition-options" style="display: none; margin-bottom: 20px; padding: 15px; background: rgba(0, 0, 0, 0.3); border: 2px solid #ffaa00; border-radius: 10px;">
            <h3 style="color: #ffaa00; margin: 0 0 10px 0; font-size: 1.1rem;">${t('additionOptions')}</h3>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <label style="display: flex; align-items: center; gap: 8px; color: #fff; cursor: pointer;">
                    <input type="checkbox" id="challenge-subtraction-toggle" style="width: 20px; height: 20px; cursor: pointer;">
                    <span>${t('includeSubtraction')} (+20%)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; color: #fff; cursor: pointer;">
                    <input type="checkbox" id="challenge-overhang-toggle" style="width: 20px; height: 20px; cursor: pointer;">
                    <span>${t('carrying')} (+30%)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; color: #fff; cursor: pointer;">
                    <input type="checkbox" id="challenge-threepart-toggle" style="width: 20px; height: 20px; cursor: pointer;">
                    <span>${t('threePart')} (+40%)</span>
                </label>
            </div>
        </div>

        <!-- Tables & Ranges Selection -->
        <div style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h2 id="challenge-selection-title" style="color: #ffaa00; margin: 0; font-size: 1.3rem;">${t('chooseTablesAndRanges')}</h2>
                <button id="challenge-select-all-btn" style="
                    background: #666;
                    color: #fff;
                    border: none;
                    padding: 8px 15px;
                    font-size: 0.9rem;
                    font-weight: bold;
                    border-radius: 5px;
                    cursor: pointer;
                ">${t('selectAll')}</button>
            </div>
            <div id="challenge-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;"></div>
        </div>

        <button id="confirm-challenge-setup" style="
            background: linear-gradient(135deg, #ffaa00, #ff8800);
            color: #000;
            border: none;
            padding: 15px 30px;
            font-size: 1.3rem;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            display: block;
            margin: 20px auto 10px;
            box-shadow: 0 4px 15px rgba(255, 170, 0, 0.3);
        ">${t('startChallenge')}</button>

        <button onclick="this.closest('.modal-overlay').remove()" style="
            background: #ff0000;
            color: #fff;
            border: none;
            padding: 12px 30px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            display: block;
            margin: 0 auto;
        ">${t('cancel')}</button>
    `;

    modal.appendChild(container);
    UIComponents.openModal(modal);

    let selectedOperation = savedMixedMode ? 'mixed' : savedOperation;
    let selectedTables = [...savedTables];
    let selectedRanges = [...savedRanges];

    function rebuildChallengeGrid(operation) {
        const grid = document.getElementById('challenge-grid');

        if (operation === 'multiply') {
            grid.innerHTML = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(table => {
                const isSelected = selectedTables.includes(table);
                return `
                    <button class="challenge-table-btn" aria-pressed="${isSelected}" data-table="${table}" style="
                        background: ${isSelected ? 'linear-gradient(135deg, #ffaa00, #ff8800)' : '#333'};
                        color: ${isSelected ? '#000' : '#fff'};
                        border: 2px solid ${isSelected ? '#ffaa00' : '#666'};
                        padding: 12px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        border-radius: 8px;
                        cursor: pointer;
                    ">${table}×</button>
                `;
            }).join('');
        } else if (operation === 'add') {
            const ranges = [
                {label: '1-5', value: '1-5'},
                {label: '6-10', value: '6-10'},
                {label: '11-20', value: '11-20'},
                {label: '21-50', value: '21-50'},
                {label: '51-100', value: '51-100'},
                {label: '100-250', value: '100-250'}
            ];
            grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            grid.innerHTML = ranges.map(range => {
                const isSelected = selectedRanges.includes(range.value);
                return `
                    <button class="challenge-range-btn" aria-pressed="${isSelected}" data-range="${range.value}" style="
                        background: ${isSelected ? 'linear-gradient(135deg, #ffaa00, #ff8800)' : '#333'};
                        color: ${isSelected ? '#000' : '#fff'};
                        border: 2px solid ${isSelected ? '#ffaa00' : '#666'};
                        padding: 15px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        border-radius: 8px;
                        cursor: pointer;
                    ">${range.label}</button>
                `;
            }).join('');
        } else {
            // Mixed
            grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
            const tables = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(table => {
                const isSelected = selectedTables.includes(table);
                return `
                    <button class="challenge-table-btn" aria-pressed="${isSelected}" data-table="${table}" style="
                        background: ${isSelected ? 'linear-gradient(135deg, #ffaa00, #ff8800)' : '#333'};
                        color: ${isSelected ? '#000' : '#fff'};
                        border: 2px solid ${isSelected ? '#ffaa00' : '#666'};
                        padding: 12px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        border-radius: 8px;
                        cursor: pointer;
                    ">${table}×</button>
                `;
            }).join('');

            const ranges = [
                {label: '1-5', value: '1-5'},
                {label: '6-10', value: '6-10'},
                {label: '1-10', value: '1-10'},
                {label: '11-20', value: '11-20'},
                {label: '1-20', value: '1-20'},
                {label: '21-50', value: '21-50'},
                {label: '51-100', value: '51-100'},
                {label: '100-250', value: '100-250'}
            ].map(range => {
                const isSelected = selectedRanges.includes(range.value);
                return `
                    <button class="challenge-range-btn" aria-pressed="${isSelected}" data-range="${range.value}" style="
                        background: ${isSelected ? 'linear-gradient(135deg, #ffaa00, #ff8800)' : '#333'};
                        color: ${isSelected ? '#000' : '#fff'};
                        border: 2px solid ${isSelected ? '#ffaa00' : '#666'};
                        padding: 15px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        border-radius: 8px;
                        cursor: pointer;
                    ">${range.label}</button>
                `;
            }).join('');

            grid.innerHTML = tables + ranges;
        }

        attachChallengeGridHandlers();
    }

    function attachChallengeGridHandlers() {
        container.querySelectorAll('.challenge-table-btn').forEach(btn => {
            btn.onclick = () => {
                const table = parseInt(btn.dataset.table);
                if (selectedTables.includes(table)) {
                    selectedTables = selectedTables.filter(t => t !== table);
                } else {
                    selectedTables.push(table);
                }
                rebuildChallengeGrid(selectedOperation);
            };
        });

        container.querySelectorAll('.challenge-range-btn').forEach(btn => {
            btn.onclick = () => {
                const range = btn.dataset.range;
                if (selectedRanges.includes(range)) {
                    selectedRanges = selectedRanges.filter(r => r !== range);
                } else {
                    selectedRanges.push(range);
                }
                rebuildChallengeGrid(selectedOperation);
            };
        });
    }

    // Operation buttons
    container.querySelectorAll('.challenge-operation-btn').forEach(btn => {
        btn.onclick = () => {
            selectedOperation = btn.dataset.operation;
            container.querySelectorAll('.challenge-operation-btn').forEach(b => {
                if (b.dataset.operation === selectedOperation) {
                    if (selectedOperation === 'mixed') {
                        b.style.background = 'linear-gradient(135deg, #ff00ff, #aa00aa)';
                        b.style.borderColor = '#ff00ff';
                    } else {
                        b.style.background = 'linear-gradient(135deg, #ffaa00, #ff8800)';
                        b.style.borderColor = '#ffaa00';
                    }
                    b.style.color = selectedOperation === 'mixed' ? '#fff' : '#000';
                } else {
                    b.style.background = '#333';
                    b.style.color = '#fff';
                    b.style.borderColor = '#666';
                }
            });

            // Show/hide addition options
            const addOptions = document.getElementById('challenge-addition-options');
            if (selectedOperation === 'add' || selectedOperation === 'mixed') {
                addOptions.style.display = 'block';
            } else {
                addOptions.style.display = 'none';
            }

            rebuildChallengeGrid(selectedOperation);
        };
    });

    // Select all button — must mirror exactly the ranges shown for each operation
    const ADD_RANGES = ['1-5', '6-10', '11-20', '21-50', '51-100', '100-250'];
    const MIXED_RANGES = ['1-5', '6-10', '1-10', '11-20', '1-20', '21-50', '51-100', '100-250'];
    document.getElementById('challenge-select-all-btn').onclick = () => {
        if (selectedOperation === 'multiply') {
            const allTables = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
            selectedTables = selectedTables.length === allTables.length ? [] : [...allTables];
        } else if (selectedOperation === 'add') {
            const allRanges = ADD_RANGES;
            selectedRanges = selectedRanges.length === allRanges.length ? [] : [...allRanges];
        } else {
            const allTables = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
            const allRanges = MIXED_RANGES;
            const allSelected = selectedTables.length === allTables.length && selectedRanges.length === allRanges.length;
            if (allSelected) {
                selectedTables = [];
                selectedRanges = [];
            } else {
                selectedTables = [...allTables];
                selectedRanges = [...allRanges];
            }
        }
        rebuildChallengeGrid(selectedOperation);
    };

    // Confirm button
    document.getElementById('confirm-challenge-setup').onclick = () => {
        if (selectedOperation === 'multiply' && selectedTables.length === 0) {
            alert(t('selectOneTable'));
            return;
        }
        if (selectedOperation === 'add' && selectedRanges.length === 0) {
            alert(t('selectOneRange'));
            return;
        }
        if (selectedOperation === 'mixed' && selectedTables.length === 0 && selectedRanges.length === 0) {
            alert(t('selectOneChoice'));
            return;
        }

        // Get subtraction/overhang/3-part settings
        const includeSubtraction = document.getElementById('challenge-subtraction-toggle')?.checked || false;
        const allowOverhang = document.getElementById('challenge-overhang-toggle')?.checked || false;
        const includeThreePart = document.getElementById('challenge-threepart-toggle')?.checked || false;

        // Save settings
        if (!playerProfile.battleSettings) playerProfile.battleSettings = {};
        playerProfile.battleSettings.selectedTables = selectedTables;
        playerProfile.battleSettings.selectedRanges = selectedRanges;
        playerProfile.battleSettings.mixedMode = selectedOperation === 'mixed';
        playerProfile.battleSettings.selectedOperation = selectedOperation === 'mixed' ? 'multiply' : selectedOperation;
        playerProfile.battleSettings.includeSubtraction = includeSubtraction;
        playerProfile.battleSettings.allowOverhang = allowOverhang;
        playerProfile.battleSettings.includeThreePart = includeThreePart;
        saveCurrentProfile();

        // Start challenge
        modal.remove();

        // Convert ranges to objects for challenge mode
        const rangeObjects = selectedRanges.map(range => {
            const [min, max] = range.split('-').map(Number);
            return { min, max, label: range };
        });

        let tables;
        if (selectedOperation === 'mixed') {
            // For mixed mode, combine both tables and ranges
            tables = [...selectedTables, ...rangeObjects];
        } else if (selectedOperation === 'multiply') {
            tables = selectedTables;
        } else {
            tables = rangeObjects;
        }

        if (typeof challengeUI !== 'undefined') {
            challengeUI.start(tables, 60, selectedOperation, includeSubtraction, allowOverhang, includeThreePart);
        } else {
            alert('Challenge Mode UI not loaded!');
        }
    };

    rebuildChallengeGrid(selectedOperation);

    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Quiz mode removed per user request

function showCampaignMode() {
    // Remove existing modal if present
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // Campaign chapters - 12 progressive story chapters
    const chapters = [
        { num: 1, name: 'Egg Island', enemy: 'SPIKEBACK', level: 1, unlocked: true, description: 'Your first battle begins...' },
        { num: 2, name: 'Baby Steps', enemy: 'ROCKHORN', level: 2, unlocked: false, description: 'Learning to roar' },
        { num: 3, name: 'Toddler Troubles', enemy: 'SKYTALON', level: 3, unlocked: false, description: 'Sky battle training' },
        { num: 4, name: 'Kiddo Kaiju', enemy: 'GRUBLING', level: 4, unlocked: false, description: 'Cocoon crisis' },
        { num: 5, name: 'Teen Titan', enemy: 'BOLTBOT', level: 5, unlocked: false, description: 'Robot rebellion' },
        { num: 6, name: 'Young Blood', enemy: 'LUNAWING', level: 7, unlocked: false, description: 'Wings of destiny' },
        { num: 7, name: 'Junior Rumble', enemy: 'RAZORBEAK', level: 9, unlocked: false, description: 'Cyborg showdown' },
        { num: 8, name: 'Rising Power', enemy: 'STONELION', level: 11, unlocked: false, description: 'Guardian challenge' },
        { num: 9, name: 'Atomic Awakening', enemy: 'GRIMAPE', level: 13, unlocked: false, description: 'Legendary clash' },
        { num: 10, name: 'Three Heads', enemy: 'TRISTORM', level: 15, unlocked: false, description: 'Three-headed terror' },
        { num: 11, name: 'Mechanical Menace', enemy: 'MECHATITAN', level: 18, unlocked: false, description: 'Your evil twin' },
        { num: 12, name: 'Ultimate Battle', enemy: 'DOOMCLAW PRIME', level: 21, unlocked: false, description: 'Final confrontation!' }
    ];

    // Check which chapters are unlocked based on player level
    // Initialize campaign tracking if needed
    if (!playerProfile.campaign) {
        playerProfile.campaign = { currentChapter: 1, completedChapters: [] };
    }

    const completedChapters = playerProfile.campaign.completedChapters || [];
    chapters.forEach((chapter, index) => {
        if (index === 0) {
            chapter.unlocked = true; // Chapter 1 always unlocked
        } else {
            // Unlock if previous chapter has been completed
            chapter.unlocked = completedChapters.includes(chapters[index - 1].num);
        }
        // Mark as completed if in list
        chapter.completed = completedChapters.includes(chapter.num);
    });

    const modal = UIComponents.createModal('', { maxWidth: '700px', borderColor: '#ff00ff' });
    const container = modal.firstElementChild;

    const chaptersHTML = chapters.map(chapter => {
        const locked = !chapter.unlocked;
        const bgColor = locked ? 'rgba(100, 100, 100, 0.1)' : 'rgba(255, 0, 255, 0.2)';
        const borderColor = locked ? '#666' : '#ff00ff';
        const textColor = locked ? '#666' : '#fff';
        const cursorStyle = locked ? 'not-allowed' : 'pointer';
        const opacity = locked ? '0.5' : '1';

        return `
            <div class="campaign-chapter" style="
                background: ${bgColor};
                border: 3px solid ${borderColor};
                border-radius: 15px;
                padding: 15px;
                margin-bottom: 12px;
                cursor: ${cursorStyle};
                transition: transform 0.2s;
                opacity: ${opacity};
                ${locked ? '' : 'onmouseover="this.style.transform=\'scale(1.02)\'" onmouseout="this.style.transform=\'scale(1)\'"'}
            " ${locked ? '' : `onclick="startCampaignChapter(${chapter.num}, '${chapter.enemy}', ${chapter.level})"`}>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <div style="color: #ff00ff; font-weight: bold; font-size: 1.1rem;">
                            ${locked ? '🔒' : '📖'} Chapter ${chapter.num}: ${chapter.name}
                        </div>
                        <div style="color: ${textColor}; font-size: 0.9rem; margin-top: 5px;">
                            ${chapter.description}
                        </div>
                        <div style="color: #aaa; font-size: 0.85rem; margin-top: 5px;">
                            Enemy: ${chapter.enemy} (Level ${chapter.level})
                        </div>
                        <div style="color: #00ff00; font-size: 0.85rem; margin-top: 3px;">
                            📊 Focus: ${chapter.num}× multiplication table
                        </div>
                    </div>
                    <div style="text-align: right;">
                        ${locked ?
                            `<div style="color: #666; font-size: 0.8rem;">🔒 Locked<br>Complete Chapter ${chapter.num - 1}</div>` :
                            chapter.completed ?
                            `<div style="color: #ffd700; font-weight: bold; font-size: 1.2rem;">✓ REPLAY</div>` :
                            `<div style="color: #00ff00; font-weight: bold; font-size: 1.2rem;">START →</div>`
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <h1 style="color: #ff00ff; text-align: center; margin: 0 0 10px 0; font-size: 2rem;">${t('campaignTitle')}</h1>
        <p style="color: #aaa; text-align: center; margin: 0 0 20px 0;">
            12 chapters of progressive story battles. Chapters completed: ${completedChapters.length}/12
        </p>

        <div style="margin-bottom: 20px;">
            ${chaptersHTML}
        </div>

        <button onclick="this.closest('.modal-overlay').remove()" style="
            background: #ff0000;
            color: #fff;
            border: none;
            padding: 12px 30px;
            font-size: 1.1rem;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            display: block;
            margin: 0 auto;
        ">${t('close')}</button>
    `;

    modal.appendChild(container);
    UIComponents.openModal(modal);

    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function startCampaignChapter(chapterNum, enemyName, enemyLevel) {
    document.querySelector('.modal-overlay')?.remove();

    // Set campaign chapter for tracking
    gameState.campaignChapter = chapterNum;

    // Generate image filename from enemy name
    const imageFilename = enemyName.replace(/\s+/g, '_').toUpperCase() + '.png';

    // Create a custom enemy for this chapter with proper structure
    // Use player's current level instead of fixed chapter level
    const playerLevel = playerProfile.level;
    gameState.currentEnemy = {
        name: enemyName,
        level: playerLevel,
        hp: 80 + (playerLevel * 20), // Scaled HP based on player level
        damageMultiplier: 0.8 + (playerLevel * 0.1),
        image: imageFilename, // Proper image field for sprite loading
        tier: Math.ceil(chapterNum / 3) // Tier based on chapter
    };

    // Each campaign chapter focuses on its specific multiplication table
    // Chapter 1 = 1× table, Chapter 2 = 2× table, etc.
    const campaignTables = [chapterNum];

    // Set up the battle with campaign tables
    gameState.selectedTables = campaignTables;
    gameState.selectedOperation = 'multiply';

    // Start the battle with standard flow - use startGame to properly initialize battle state
    if (typeof startGame === 'function') {
        startGame();
    } else {
        console.error('Battle system not ready');
        alert('Battle system not ready. Please try regular battles first.');
    }
}

// ============================================
// MANUAL / HELP SCREEN
// ============================================

function showManual() {
    const sections = ['manualBattle', 'manualPractice', 'manualChallenge', 'manualProgress', 'manualSaves'];
    const modal = UIComponents.createModal(`
        <h1>${t('manualTitle')}</h1>
        ${sections.map(key => `<section class="manual-section"><h2>${t(key + 'Title')}</h2><p>${t(key)}</p></section>`).join('')}
        <button class="dialog-close">${t('close')}</button>
    `);
    modal.querySelector('.dialog-close').onclick = () => modal.remove();
    UIComponents.openModal(modal);
}

// ============================================
// BATTLE INTEGRATION - HINTS & VISUAL AIDS
// ============================================

function initBattleHelpers() {
    // Hint and visual buttons removed - no longer needed
}

// ============================================
// ANALYTICS TRACKING
// ============================================

function trackQuestionAnalytics(question, correct, timeSpent) {
    if (typeof analytics === 'undefined') return;

    // Determine operator symbol from question
    let operator = '×';
    if (question.operation === 'add') operator = '+';
    else if (question.operation === 'subtract') operator = '-';
    else if (question.operation === 'multiply') operator = '×';

    const fact = `${question.num1}${operator}${question.num2}`;
    analytics.trackQuestion(fact, correct, timeSpent, playerProfile);

    // Also track table/range performance
    try {
        if (typeof analytics !== 'undefined') {
            if (question.operation === 'multiply' && typeof analytics.trackTable === 'function') {
                // For multiplication, track both numbers as table practice
                if (question.num1 <= 20) {
                    analytics.trackTable(question.num1, correct, timeSpent, playerProfile);
                }
                if (question.num2 <= 20 && question.num2 !== question.num1) {
                    analytics.trackTable(question.num2, correct, timeSpent, playerProfile);
                }
            } else if ((question.operation === 'add' || question.operation === 'subtract') && typeof analytics.trackRange === 'function') {
                // For addition/subtraction, track range performance
                const maxNum = Math.max(question.num1, question.num2);
                let rangeKey = null;

                // Determine which range this question belongs to
                if (maxNum <= 5) rangeKey = 'range_1_5';
                else if (maxNum <= 10) rangeKey = 'range_6_10';
                else if (maxNum <= 20) rangeKey = 'range_11_20';
                else if (maxNum <= 50) rangeKey = 'range_21_50';
                else if (maxNum <= 100) rangeKey = 'range_51_100';
                else if (maxNum <= 250) rangeKey = 'range_100_250';

                // Also track the combined 1-10 and 1-20 ranges if applicable
                if (maxNum <= 10 && rangeKey) {
                    analytics.trackRange('range_1_10', correct, timeSpent, playerProfile);
                }
                if (maxNum <= 20 && rangeKey) {
                    analytics.trackRange('range_1_20', correct, timeSpent, playerProfile);
                }

                if (rangeKey) {
                    analytics.trackRange(rangeKey, correct, timeSpent, playerProfile);
                }
            }
        }
    } catch (error) {
        console.error('Error tracking stats:', error);
    }

    saveCurrentProfile();
}

// ============================================
// POWER-UP MANAGEMENT
// ============================================

function checkPowerUpAwards() {
    if (typeof powerupManager === 'undefined') return;

    // Award on 10-correct streak
    if (gameState.comboCount === 10) {
        const available = powerupManager.getAvailable(playerProfile.level);
        if (available.length > 0) {
            const randomPowerup = available[Math.floor(Math.random() * available.length)];
            powerupManager.activate(randomPowerup.id, playerProfile.settings.language);
        }
    }

    // Award Combo Boost on 15-combo
    if (gameState.comboCount === 15 && powerupManager.isUnlocked('COMBO_BOOST', playerProfile.level)) {
        powerupManager.activate('COMBO_BOOST', playerProfile.settings.language);
    }
}

function applyPowerUpEffects(baseDamage, isCorrect) {
    if (typeof powerupManager === 'undefined') return baseDamage;

    let damage = baseDamage;

    // Apply damage boost
    damage = powerupManager.applyDamageEffect(damage);

    // Block HP loss if shield active and wrong answer
    if (!isCorrect && powerupManager.shouldBlockDamage()) {
        // Don't reduce player HP
        return { damage, blockHPLoss: true };
    }

    return { damage, blockHPLoss: false };
}

function usePowerUpCharge() {
    if (typeof powerupManager !== 'undefined') {
        powerupManager.useCharge();
    }
}

// ============================================
// SOUND EFFECTS
// ============================================

function playSound(soundName) {
    if (typeof soundSystem === 'undefined' || !playerProfile.settings.soundEnabled) return;

    switch(soundName) {
        case 'attack': soundSystem.playAttack(); break;
        case 'hit': soundSystem.playHit(); break;
        case 'correct': soundSystem.playCorrect(); break;
        case 'wrong': soundSystem.playWrong(); break;
        case 'combo': soundSystem.playCombo(); break;
        case 'supercharge': soundSystem.playSupercharge(); break;
        case 'victory': soundSystem.playVictory(); break;
        case 'defeat': soundSystem.playDefeat(); break;
        case 'evolution': soundSystem.playEvolution(); break;
        case 'achievement': soundSystem.playAchievement(); break;
        case 'boss': soundSystem.playBossAppears(); break;
    }
}

// ============================================
// ACHIEVEMENT NOTIFICATIONS
// ============================================

function showAchievementNotification(achievement) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ffd700, #ffaa00);
        border: 3px solid #ffd700;
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
        z-index: 10001;
        min-width: 300px;
        animation: slideInRight 0.5s ease;
    `;

    const lang = playerProfile.settings.language;
    const name = achievement.name[lang] || achievement.name.en;
    const desc = achievement.description[lang] || achievement.description.en;

    notification.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🏆</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #000; margin-bottom: 5px;">
                Achievement Unlocked!
            </div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #333;">
                ${name}
            </div>
            <div style="font-size: 0.9rem; color: #555; margin-top: 5px;">
                ${desc}
            </div>
            <div style="font-size: 1rem; color: #ff6600; font-weight: bold; margin-top: 10px;">
                +${achievement.reward.xp} XP
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Play sound
    playSound('achievement');

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// ============================================
// INITIALIZATION
// ============================================

// Call this after DOM is ready
function initPhase2Systems() {

    // Initialize battle helpers
    initBattleHelpers();

    // Set up achievement listeners
    if (typeof achievementManager !== 'undefined') {
        achievementManager.onUnlock = (achievement) => {
            showAchievementNotification(achievement);
            // Award XP
            playerProfile.xp += achievement.reward.xp;
            saveCurrentProfile();
            updateProfileDisplay();
        };
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhase2Systems);
} else {
    initPhase2Systems();
}

// ============================================
// BATTLE SETUP MODAL
// ============================================

function showBattleSetup() {
    const modal = UIComponents.createModal('', { maxWidth: '700px', borderColor: '#00ff00' });
    const container = modal.firstElementChild;

    // Load saved settings from player profile
    const savedOperation = playerProfile.settings?.operation || 'multiply';
    const savedTables = playerProfile.battleSettings?.selectedTables || [1,2,3,4,5,6,7,8,9,10];
    const savedMixedMode = playerProfile.battleSettings?.mixedMode || false;
    const savedSubtraction = playerProfile.battleSettings?.includeSubtraction || false;
    const savedOverhang = playerProfile.battleSettings?.allowOverhang || false;

    // Generate enemy first
    const playerLevel = playerProfile.level || 1;
    let enemy;
    if (typeof generateEnemy === 'function') {
        enemy = generateEnemy(playerLevel);
        // Set maxHP and damage for display
        enemy.maxHP = enemy.hp;
        enemy.damage = Math.floor(20 + (enemy.level * 2) + (enemy.damageMultiplier * 10));
    } else {
        // Fallback enemy
        enemy = {
            name: 'ENEMY',
            level: Math.max(1, playerLevel - 2),
            hp: 100,
            maxHP: 100,
            damage: 20
        };
    }

    container.innerHTML = `
        <h1 style="color: #00ff00; text-align: center; margin: 0 0 15px 0; font-size: 2rem;">${t('battleSetup')}</h1>

        <!-- Enemy Preview -->
        <div style="background: rgba(255, 0, 0, 0.1); border: 3px solid #ff0000; border-radius: 15px; padding: 20px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: #ff6600; margin-bottom: 10px;">
                ${enemy.name}
            </div>
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                <div>
                    <div style="color: #aaa; font-size: 0.9rem;">${t('uiLevel')}</div>
                    <div style="color: #fff; font-size: 1.2rem; font-weight: bold;">${enemy.level}</div>
                </div>
                <div>
                    <div style="color: #aaa; font-size: 0.9rem;">HP</div>
                    <div style="color: #ff0000; font-size: 1.2rem; font-weight: bold;">${enemy.maxHP}</div>
                </div>
                <div>
                    <div style="color: #aaa; font-size: 0.9rem;">${t('attackLabel')}</div>
                    <div style="color: #ff6600; font-size: 1.2rem; font-weight: bold;">${enemy.damage}</div>
                </div>
            </div>
        </div>

        <!-- Operation Selection -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #ffaa00; margin: 0 0 10px 0; font-size: 1.3rem;">${t('chooseOperation')}</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <button class="operation-choice-btn" data-operation="multiply" style="
                    background: ${savedOperation === 'multiply' && !savedMixedMode ? 'linear-gradient(135deg, #00ff00, #00aa00)' : '#333'};
                    color: ${savedOperation === 'multiply' && !savedMixedMode ? '#000' : '#fff'};
                    border: 2px solid ${savedOperation === 'multiply' && !savedMixedMode ? '#00ff00' : '#666'};
                    padding: 15px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                ">${t('multiply')}</button>
                <button class="operation-choice-btn" data-operation="add" style="
                    background: ${savedOperation === 'add' && !savedMixedMode ? 'linear-gradient(135deg, #00ff00, #00aa00)' : '#333'};
                    color: ${savedOperation === 'add' && !savedMixedMode ? '#000' : '#fff'};
                    border: 2px solid ${savedOperation === 'add' && !savedMixedMode ? '#00ff00' : '#666'};
                    padding: 15px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                ">${t('add')}</button>
                <button class="operation-choice-btn" data-operation="mixed" style="
                    background: ${savedMixedMode ? 'linear-gradient(135deg, #ff00ff, #aa00aa)' : '#333'};
                    color: ${savedMixedMode ? '#fff' : '#fff'};
                    border: 2px solid ${savedMixedMode ? '#ff00ff' : '#666'};
                    padding: 15px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                ">${t('mixed')}</button>
            </div>
        </div>

        <!-- Addition Options (shown only when Add or Mixed is selected) -->
        <div id="addition-options" style="display: ${savedOperation === 'add' || savedMixedMode ? 'block' : 'none'}; margin-bottom: 25px; padding: 15px; background: rgba(0, 255, 0, 0.1); border-left: 4px solid #00ff00; border-radius: 5px;">
            <h3 style="color: #00ff00; margin: 0 0 10px 0; font-size: 1.1rem;">${t('additionOptions')}</h3>
            <label style="display: flex; align-items: center; gap: 10px; color: #fff; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" id="setup-subtraction-toggle" ${savedSubtraction ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                <span>${t('includeSubtraction')}</span>
            </label>
            <label style="display: flex; align-items: center; gap: 10px; color: #fff; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" id="setup-overhang-toggle" ${savedOverhang ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                <span>${t('carrying')}</span>
            </label>
            <label style="display: flex; align-items: center; gap: 10px; color: #fff; cursor: pointer;">
                <input type="checkbox" id="setup-threepart-toggle" style="width: 20px; height: 20px; cursor: pointer;">
                <span>${t('threePart')}</span>
            </label>
        </div>

        <!-- Table/Range Selection -->
        <div style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h2 style="color: #ffaa00; margin: 0; font-size: 1.3rem;" id="selection-title">${t('chooseTablesShort')}</h2>
                <button id="select-all-tables-btn" style="background: #666; color: #fff; border: none; padding: 8px 15px; font-size: 0.9rem; font-weight: bold; border-radius: 5px; cursor: pointer;">
                    ${t('selectAll')}
                </button>
            </div>
            <div id="setup-table-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
                <!-- Grid will be populated dynamically -->
            </div>
        </div>

        <!-- Confirm Button -->
        <button id="confirm-battle-setup" style="
            background: linear-gradient(135deg, #00ff00, #00aa00);
            color: #000;
            border: none;
            padding: 15px 40px;
            font-size: 1.3rem;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            display: block;
            margin: 20px auto 10px;
            box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
            transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            ${t('startBattle')} ⚔️
        </button>

        <button onclick="this.closest('.modal-overlay').remove()" style="
            background: #ff0000;
            color: #fff;
            border: none;
            padding: 12px 30px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            display: block;
            margin: 0 auto;
        ">${t('cancel')}</button>
    `;

    modal.appendChild(container);
    UIComponents.openModal(modal);

    // Track selected state
    let selectedOperation = savedMixedMode ? 'mixed' : savedOperation;
    let selectedTables = [...savedTables];
    let selectedRanges = playerProfile.battleSettings?.selectedRanges || [];

    // Function to rebuild the grid based on operation
    function rebuildGrid(operation) {
        const grid = document.getElementById('setup-table-grid');
        const title = document.getElementById('selection-title');

        if (operation === 'multiply') {
            // Show multiplication tables (1-20)
            title.textContent = t('chooseTablesShort');
            grid.innerHTML = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(table => {
                const isSelected = selectedTables.includes(table);
                return `
                    <button class="setup-table-btn" aria-pressed="${isSelected}" data-table="${table}" style="
                        background: ${isSelected ? 'linear-gradient(135deg, #00ff00, #00aa00)' : '#333'};
                        color: ${isSelected ? '#000' : '#fff'};
                        border: 2px solid ${isSelected ? '#00ff00' : '#666'};
                        padding: 12px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">${table}×</button>
                `;
            }).join('');
        } else if (operation === 'add') {
            // Show addition ranges (1-10, 11-20, etc.)
            title.textContent = t('chooseRanges');
            const ranges = [
                {label: '1-5', value: '1-5'},
                {label: '6-10', value: '6-10'},
                {label: '11-20', value: '11-20'},
                {label: '21-50', value: '21-50'},
                {label: '51-100', value: '51-100'},
                {label: '100-250', value: '100-250'}
            ];
            grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            grid.innerHTML = ranges.map(range => {
                const isSelected = selectedRanges.includes(range.value);
                return `
                    <button class="setup-range-btn" aria-pressed="${isSelected}" data-range="${range.value}" style="
                        background: ${isSelected ? 'linear-gradient(135deg, #00ff00, #00aa00)' : '#333'};
                        color: ${isSelected ? '#000' : '#fff'};
                        border: 2px solid ${isSelected ? '#00ff00' : '#666'};
                        padding: 15px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">${range.label}</button>
                `;
            }).join('');
        } else {
            // Mixed: Show both tables and ranges
            title.textContent = t('chooseTablesAndRanges');
            grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
            const tablesHTML = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(table => {
                const isSelected = selectedTables.includes(table);
                return `
                    <button class="setup-table-btn" aria-pressed="${isSelected}" data-table="${table}" style="
                        background: ${isSelected ? 'linear-gradient(135deg, #00ff00, #00aa00)' : '#333'};
                        color: ${isSelected ? '#000' : '#fff'};
                        border: 2px solid ${isSelected ? '#00ff00' : '#666'};
                        padding: 12px;
                        font-size: 0.95rem;
                        font-weight: bold;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">${table}×</button>
                `;
            }).join('');

            const rangesHTML = [
                {label: '1-5', value: '1-5'},
                {label: '6-10', value: '6-10'},
                {label: '1-10', value: '1-10'},
                {label: '11-20', value: '11-20'},
                {label: '1-20', value: '1-20'},
                {label: '21-50', value: '21-50'},
                {label: '51-100', value: '51-100'},
                {label: '100-250', value: '100-250'}
            ].map(range => {
                const isSelected = selectedRanges.includes(range.value);
                return `
                    <button class="setup-range-btn" aria-pressed="${isSelected}" data-range="${range.value}" style="
                        background: ${isSelected ? 'linear-gradient(135deg, #ff00ff, #aa00aa)' : '#333'};
                        color: #fff;
                        border: 2px solid ${isSelected ? '#ff00ff' : '#666'};
                        padding: 12px;
                        font-size: 0.95rem;
                        font-weight: bold;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">${range.label}+</button>
                `;
            }).join('');

            grid.innerHTML = tablesHTML + rangesHTML;
        }

        // Re-attach click handlers
        attachGridHandlers();
    }

    // Function to attach grid click handlers
    function attachGridHandlers() {
        const tableBtns = container.querySelectorAll('.setup-table-btn');
        // Table button handlers
        tableBtns.forEach(btn => {
            btn.onclick = () => {
                const table = parseInt(btn.dataset.table);
                const index = selectedTables.indexOf(table);

                if (index > -1) {
                    selectedTables.splice(index, 1);
                    btn.style.background = '#333';
                    btn.style.color = '#fff';
                    btn.style.borderColor = '#666';
                } else {
                    selectedTables.push(table);
                    btn.style.background = 'linear-gradient(135deg, #00ff00, #00aa00)';
                    btn.style.color = '#000';
                    btn.style.borderColor = '#00ff00';
                }
            };
        });

        // Range button handlers
        container.querySelectorAll('.setup-range-btn').forEach(btn => {
            btn.onclick = () => {
                const range = btn.dataset.range;
                const index = selectedRanges.indexOf(range);

                if (index > -1) {
                    selectedRanges.splice(index, 1);
                    btn.style.background = '#333';
                    btn.style.borderColor = '#666';
                } else {
                    selectedRanges.push(range);
                    btn.style.background = 'linear-gradient(135deg, #ff00ff, #aa00aa)';
                    btn.style.borderColor = '#ff00ff';
                }
            };
        });
    }

    // Initial grid build
    rebuildGrid(selectedOperation);

    // Operation button handlers
    container.querySelectorAll('.operation-choice-btn').forEach(btn => {
        btn.onclick = () => {
            const operation = btn.dataset.operation;
            selectedOperation = operation;

            // Update button styles
            container.querySelectorAll('.operation-choice-btn').forEach(b => {
                if (b.dataset.operation === operation) {
                    if (operation === 'mixed') {
                        b.style.background = 'linear-gradient(135deg, #ff00ff, #aa00aa)';
                        b.style.color = '#fff';
                        b.style.borderColor = '#ff00ff';
                    } else {
                        b.style.background = 'linear-gradient(135deg, #00ff00, #00aa00)';
                        b.style.color = '#000';
                        b.style.borderColor = '#00ff00';
                    }
                } else {
                    b.style.background = '#333';
                    b.style.color = '#fff';
                    b.style.borderColor = '#666';
                }
            });

            // Show/hide addition options
            const addOptions = document.getElementById('addition-options');
            if (operation === 'add' || operation === 'mixed') {
                addOptions.style.display = 'block';
            } else {
                addOptions.style.display = 'none';
            }

            // Rebuild grid based on new operation
            rebuildGrid(operation);
        };
    });

    // Table and range handlers are now in attachGridHandlers()

    // Select all button
    // These must mirror exactly the ranges shown for each operation in rebuildGrid()
    const ADD_RANGES = ['1-5', '6-10', '11-20', '21-50', '51-100', '100-250'];
    const MIXED_RANGES = ['1-5', '6-10', '1-10', '11-20', '1-20', '21-50', '51-100', '100-250'];
    document.getElementById('select-all-tables-btn').onclick = () => {
        if (selectedOperation === 'multiply') {
            const allTables = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
            const allSelected = selectedTables.length === allTables.length;

            if (allSelected) {
                selectedTables = [];
            } else {
                selectedTables = [...allTables];
            }
        } else if (selectedOperation === 'add') {
            const allRanges = ADD_RANGES;
            const allSelected = selectedRanges.length === allRanges.length;

            if (allSelected) {
                selectedRanges = [];
            } else {
                selectedRanges = [...allRanges];
            }
        } else {
            // Mixed: select all tables and ranges
            const allTables = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
            const allRanges = MIXED_RANGES;
            const allSelected = selectedTables.length === allTables.length && selectedRanges.length === allRanges.length;

            if (allSelected) {
                selectedTables = [];
                selectedRanges = [];
            } else {
                selectedTables = [...allTables];
                selectedRanges = [...allRanges];
            }
        }

        // Rebuild grid to reflect changes
        rebuildGrid(selectedOperation);
    };

    // Confirm button
    document.getElementById('confirm-battle-setup').onclick = () => {
        if (selectedOperation === 'multiply' && selectedTables.length === 0) {
            alert(t('selectOneTable'));
            return;
        }
        if (selectedOperation === 'add' && selectedRanges.length === 0) {
            alert(t('selectOneRange'));
            return;
        }
        if (selectedOperation === 'mixed' && selectedTables.length === 0 && selectedRanges.length === 0) {
            alert(t('selectOneChoice'));
            return;
        }

        // Save settings to player profile
        if (!playerProfile.battleSettings) {
            playerProfile.battleSettings = {};
        }

        const mixedMode = selectedOperation === 'mixed';
        const finalOperation = mixedMode ? 'multiply' : selectedOperation;

        playerProfile.battleSettings.selectedTables = selectedTables;
        playerProfile.battleSettings.selectedRanges = selectedRanges;
        playerProfile.battleSettings.mixedMode = mixedMode;
        playerProfile.settings.operation = finalOperation;

        if (selectedOperation === 'add' || mixedMode) {
            playerProfile.battleSettings.includeSubtraction = document.getElementById('setup-subtraction-toggle').checked;
            playerProfile.battleSettings.allowOverhang = document.getElementById('setup-overhang-toggle').checked;
            playerProfile.battleSettings.includeThreePart = document.getElementById('setup-threepart-toggle').checked;
        }

        // Update game state - convert ranges to objects with min/max
        if (finalOperation === 'add') {
            gameState.selectedTables = selectedRanges.map(range => {
                const [min, max] = range.split('-').map(Number);
                return { min, max, label: range };
            });
        } else if (mixedMode) {
            // Mixed mode: combine tables and ranges
            const tableObjects = selectedTables.map(table => ({
                table: table,
                min: 0,
                max: 12,
                label: `${table}×`
            }));
            const rangeObjects = selectedRanges.map(range => {
                const [min, max] = range.split('-').map(Number);
                return { min, max, label: range };
            });
            gameState.selectedTables = [...tableObjects, ...rangeObjects];
        } else {
            // Multiply mode: just use table numbers
            gameState.selectedTables = selectedTables;
        }

        enemy.skipIntro = true; // Flag to skip battle intro screen
        gameState.currentEnemy = enemy; // Save the enemy we generated
        playerProfile.settings.operation = finalOperation;

        saveCurrentProfile();

        // Close modal and start game directly (skip battle intro)
        modal.remove();
        startGame();
    };

    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}
