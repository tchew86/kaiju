const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function fixture(...scripts) {
    let now = 1000;
    let nextTimer = 0;
    const timers = new Map();
    const elements = new Map();
    const listeners = new Set();
    const storage = new Map();
    let failWrites = false;
    let failReads = false;
    const buttons = Array.from({ length: 12 }, () => ({ disabled: false }));
    function element(id) {
        if (!elements.has(id)) elements.set(id, {
            textContent: '', style: {}, innerHTML: '',
            classList: { add() {}, remove() {} },
            querySelectorAll: selector => selector.includes('answer-btn') ? buttons : [],
            remove() {}, appendChild() {},
        });
        return elements.get(id);
    }
    class Clock extends Date { static now() { return now; } }
    const context = vm.createContext({
        console, Date: Clock,
        document: {
            getElementById: element,
            querySelectorAll: selector => selector.includes('answer-btn') ? buttons : [],
            addEventListener: (type, listener) => listeners.add(listener),
            removeEventListener: (type, listener) => listeners.delete(listener),
        },
        localStorage: {
            getItem: key => { if (failReads) throw new Error('Storage blocked'); return storage.has(key) ? storage.get(key) : null; },
            setItem: (key, value) => {
                if (failWrites) throw new Error('Storage full');
                storage.set(key, String(value));
            },
            removeItem: key => storage.delete(key),
            get length() { return storage.size; },
            key: index => [...storage.keys()][index] || null,
        },
        window: { scrollTo() {} },
        setTimeout: (callback, delay) => { timers.set(++nextTimer, { callback, delay }); return nextTimer; },
        clearTimeout: id => timers.delete(id),
        setInterval: (callback, delay) => { timers.set(++nextTimer, { callback, delay }); return nextTimer; },
        clearInterval: id => timers.delete(id),
    });
    const run = code => vm.runInContext(code, context);
    if (!scripts.includes('js/utils/storage-utils.js')) scripts.unshift('js/utils/storage-utils.js');
    scripts.forEach(script => run(fs.readFileSync(path.join(root, script), 'utf8')));
    return { run, timers, elements, buttons, listeners, storage,
        failWrites: value => { failWrites = value; }, failReads: value => { failReads = value; }, advance: ms => { now += ms; } };
}

test('all production scripts parse and referenced assets exist', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    for (const [, source] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        assert.ok(fs.existsSync(path.join(root, source)), source);
        if (source.endsWith('.js')) new vm.Script(fs.readFileSync(path.join(root, source), 'utf8'), { filename: source });
    }
});

test('keyboard handling respects modifiers, editable fields, input lock, and answer length', () => {
    const f = fixture('js/utils/keyboard-handler.js');
    f.run(`
        let state = { currentAnswer: '' };
        let submissions = 0;
        let enabled = true;
        const handler = KeyboardHandler.createHandler(state, 'answer', () => submissions++, () => enabled);
        const press = (key, extras = {}) => handler({ key, preventDefault() {}, ...extras });
        press('1', { ctrlKey: true });
        press('1', { target: { matches: () => true } });
        enabled = false; press('1'); enabled = true;
    `);
    assert.equal(f.run('state.currentAnswer'), '');
    f.run(`press('1'); press('2'); press('3'); press('4'); press('Enter', { repeat: true });`);
    assert.equal(f.run('state.currentAnswer'), '123');
    assert.equal(f.run('submissions'), 0);
    f.run(`press('Backspace'); press('Enter');`);
    assert.equal(f.run('state.currentAnswer'), '12');
    assert.equal(f.run('submissions'), 1);
});

function practiceFixture() {
    const f = fixture('js/utils/array-utils.js', 'js/utils/question-generator.js',
        'js/utils/keyboard-handler.js', 'js/core/translations.js', 'js/core/menu-translations.js', 'js/features/game-modes.js', 'js/ui/practice-ui.js');
    f.run(`
        practiceUI.createUI = function() { this.container = document.getElementById('overlay'); };
        practiceUI.showFeedback = () => {};
        practiceUI.start(2);
        practiceUI.currentAnswer = String(practiceUI.questions[0].answer);
    `);
    return f;
}

test('practice records one answer during feedback and excludes feedback time from next answer', () => {
    const f = practiceFixture();
    f.advance(500);
    f.run('practiceUI.checkAnswer(); practiceUI.checkAnswer();');
    assert.equal(f.run('practiceMode.results.length'), 1);
    assert.equal(f.run('practiceUI.results.length'), 1);
    assert.ok(f.buttons.every(button => button.disabled));
    const timer = [...f.timers.values()].find(timer => timer.delay === 1000);
    f.advance(1000);
    timer.callback();
    assert.equal(f.run('practiceUI.currentQuestionIndex'), 1);
    assert.ok(f.buttons.every(button => !button.disabled));
    f.advance(500);
    f.run('practiceUI.currentAnswer = String(practiceUI.questions[1].answer); practiceUI.checkAnswer();');
    assert.equal(f.run('practiceUI.results[1].timeSpent'), 0.5);
});

test('quitting practice cancels pending advancement and deactivates the mode', () => {
    const f = practiceFixture();
    f.run('practiceUI.checkAnswer(); practiceUI.stop();');
    assert.equal(f.timers.size, 0);
    assert.equal(f.run('practiceMode.active'), false);
    f.run('practiceUI.showQuestion(); practiceUI.checkAnswer();');
    assert.equal(f.run('practiceUI.results.length'), 1);
});

test('practice completion removes its keyboard listener', () => {
    const f = practiceFixture();
    f.run(`
        practiceUI.keyboardHandler = () => {};
        KeyboardHandler.addHandler(practiceUI.keyboardHandler);
        practiceUI.stop();
    `);
    assert.equal(f.listeners.size, 0);
});

test('selected language uses the actual profile and persists changes', () => {
    const f = fixture('js/core/translations.js');
    f.run(`let playerProfile = { settings: { language: 'nl' } }; let saves = 0; function saveCurrentProfile() { saves++; }`);
    assert.equal(f.run('getCurrentLanguage()'), 'nl');
    assert.equal(f.run("t('startBattle')"), f.run("TRANSLATIONS.nl.startBattle"));
    f.run(`setLanguage('de');`);
    assert.equal(f.run('getCurrentLanguage()'), 'de');
    assert.equal(f.run('saves'), 1);
    f.run('playerProfile = null;');
    assert.equal(f.run('getCurrentLanguage()'), 'en');
});

test('battle accepts only one answer during attack animation', () => {
    const f = fixture('js/core/game.js');
    f.run(`
        showBattleMessage = showDamageNumber = playAttackAnimation = updateHPDisplay = updateComboDisplay = () => {};
        function t(key) { return key; }
        function tFormat(key) { return key; }
        Object.assign(gameState, {
            battleActive: true, acceptingAnswer: true, currentAnswer: '2',
            currentCorrectAnswer: 2, currentQuestionDifficulty: 1,
            currentEnemy: { name: 'TEST', damageMultiplier: 1 }, enemyHP: 1000,
            questions: [{ num1: 1, num2: 2, answer: 2, operation: 'multiply' }], startTime: Date.now()
        });
        checkAnswer(); checkAnswer(); handleTimeout();
    `);
    assert.equal(f.run('gameState.totalAnswers'), 1);
    assert.equal(f.run('gameState.questionLog.length'), 1);
    assert.equal(f.run('gameState.acceptingAnswer'), false);
});

test('challenge rejects late answers after the deadline', () => {
    const f = fixture('js/utils/array-utils.js', 'js/features/game-modes.js', 'js/ui/challenge-ui.js');
    f.run(`challengeUI.mode = challengeMode; challengeMode.startChallenge([2], 60); challengeUI.currentAnswer = '2'; let ended = 0; challengeUI.endChallenge = () => ended++;`);
    f.advance(61000);
    f.run('challengeUI.checkAnswer();');
    assert.equal(f.run('ended'), 1);
    assert.equal(f.run('challengeMode.questionsAnswered'), 0);
});

test('challenge timer follows elapsed time after a delayed callback', () => {
    const f = fixture('js/utils/array-utils.js', 'js/features/game-modes.js', 'js/ui/challenge-ui.js');
    f.run('challengeUI.mode = challengeMode; challengeMode.startChallenge([2], 60); challengeUI.startTimer();');
    f.advance(17000);
    [...f.timers.values()][0].callback();
    assert.equal(f.run('challengeUI.timeLeft'), 43);
});

test('all supported addition ranges retain operand bounds and honour carrying for every option', () => {
    const f = fixture('js/utils/question-generator.js');
    const ranges = [[1, 5], [6, 10], [1, 10], [11, 20], [21, 50], [51, 100], [100, 250]];
    for (const [min, max] of ranges) {
        for (const three of [false, true]) for (const subtract of [false, true]) for (const carry of [false, true]) {
            for (let attempt = 0; attempt < 50; attempt++) {
                const q = f.run(`QuestionGenerator.generateAdditionQuestion(${min}, ${max}, ${three}, ${subtract}, ${carry})`);
                [q.num1, q.num2, ...(q.isThreePart ? [q.num3] : [])].forEach(n => assert.ok(n >= min && n <= max));
                const subtotal = q.isSubtraction ? q.num1 - q.num2 : q.num1 + q.num2;
                assert.equal(q.answer, subtotal + (q.num3 || 0));
                assert.ok(q.answer >= 0);
                if (!carry) assert.equal(q.hasOverhang, false);
                if (q.isThreePart) assert.ok(three);
                if (q.isSubtraction) assert.ok(subtract);
            }
        }
    }
});

test('impossible carry-free ranges fail explicitly rather than changing the range', () => {
    const f = fixture('js/utils/question-generator.js');
    assert.throws(() => f.run('QuestionGenerator.generateAdditionQuestion(99, 99)'), /needs carrying/);
    assert.equal(f.run('QuestionGenerator.generateAdditionQuestion(99, 99, false, false, true).answer'), 198);
});

test('battle uses shared addition settings and preserves multiplication and mixed question counts', () => {
    const f = fixture('js/utils/array-utils.js', 'js/utils/question-generator.js', 'js/core/game.js');
    f.run(`playerProfile.settings.operation = 'multiply'; gameState.selectedTables = [2, { min: 51, max: 100 }]; playerProfile.battleSettings = { includeThreePart: true, allowOverhang: false };`);
    const questions = f.run('generateQuestions()');
    assert.equal(questions.length, 40);
    assert.equal(questions.filter(q => q.operation === 'multiply').length, 20);
    questions.filter(q => q.operation !== 'multiply').forEach(q => {
        assert.ok(q.num1 >= 51 && q.num2 >= 51);
        assert.equal(q.hasOverhang, false);
    });
});

test('challenge continues with fresh questions when its initial pool is exhausted', () => {
    const f = fixture('js/utils/array-utils.js', 'js/utils/question-generator.js', 'js/features/game-modes.js');
    f.run(`challengeMode.startChallenge([2], 60); challengeMode.currentIndex = challengeMode.questions.length;`);
    assert.ok(f.run('challengeMode.getCurrentQuestion()'));
    assert.equal(f.run('challengeMode.currentIndex'), 0);
});

test('unreadable saves are backed up exactly before a new save replaces them', () => {
    const f = fixture('js/core/game.js');
    f.storage.set('kaijuProfiles', 'broken { json');
    assert.equal(f.run('getAllProfileNames().length'), 0);
    assert.equal(f.run('saveProfiles({ Alice: createNewProfile("Alice") })'), true);
    assert.equal([...f.storage.entries()].find(([key]) => key.startsWith('kaijuProfiles.recovery.'))[1], 'broken { json');
    assert.ok(JSON.parse(f.storage.get('kaijuProfiles')).Alice);
});

test('failed recovery writes never overwrite the original save', () => {
    const f = fixture('js/core/game.js');
    f.storage.set('kaijuProfiles', 'broken { json');
    f.run('loadProfiles();');
    f.failWrites(true);
    assert.equal(f.run('saveProfiles({})'), false);
    assert.equal(f.storage.get('kaijuProfiles'), 'broken { json');
    assert.equal(f.run('StorageUtils.warning'), 'storageUnavailable');
});

test('profile migration fills nested defaults and preserves campaign, settings and scores', () => {
    const f = fixture('js/core/game.js');
    const profile = f.run(`migrateProfile({ name: 'Old', xp: 250, analytics: { facts: {} }, upgrades: { power: 2 }, settings: { language: 'nl' }, campaign: { completedChapters: [1, 2] }, challengeScores: [{ score: 100 }], battleSettings: { selectedTables: [7] } })`);
    assert.equal(profile.upgrades.maxHP, 0);
    assert.equal(profile.upgrades.power, 2);
    assert.equal(profile.settings.language, 'nl');
    assert.equal(profile.settings.soundEnabled, true);
    assert.ok(Array.isArray(profile.analytics.sessions));
    assert.equal(profile.campaign.completedChapters.length, 2);
    assert.equal(profile.challengeScores[0].score, 100);
    assert.equal(profile.battleSettings.selectedTables[0], 7);
});

test('backup import adds names without overwriting existing profiles and keeps optional fields', () => {
    const f = fixture('js/core/translations.js', 'js/core/game.js', 'js/ui/profile-backup.js');
    f.run(`saveProfiles({ Alice: createNewProfile('Alice') }); let exported = ProfileBackup.createExport();`);
    f.run('ProfileBackup.importText(exported);');
    const profiles = JSON.parse(f.storage.get('kaijuProfiles'));
    assert.equal(profiles.Alice.xp, 0);
    assert.equal(profiles['Alice (2)'].name, 'Alice (2)');
    assert.equal(Object.keys(profiles).length, 2);
});

test('invalid backup files are rejected before writing any profile', () => {
    const f = fixture('js/core/translations.js', 'js/core/game.js', 'js/ui/profile-backup.js');
    f.run(`saveProfiles({ Alice: createNewProfile('Alice') });`);
    const before = f.storage.get('kaijuProfiles');
    assert.throws(() => f.run(`ProfileBackup.importText('{"format":"kaiju-backup","version":1,"profiles":{"Good":{"xp":5},"Bad":{"xp":-1}}}')`));
    assert.equal(f.storage.get('kaijuProfiles'), before);
});

test('profile names matching inherited properties are ordinary saved names', () => {
    const f = fixture('js/core/game.js');
    f.run(`loadProfile('constructor');`);
    assert.equal(f.run('playerProfile.name'), 'constructor');
    assert.ok(Object.hasOwn(JSON.parse(f.storage.get('kaijuProfiles')), 'constructor'));
});


test('export includes unsaved active progress and unreadable originals', () => {
    const f = fixture('js/core/game.js', 'js/ui/profile-backup.js');
    f.storage.set('kaijuProfiles', 'invalid save');
    f.run("currentProfileName = 'Alice'; playerProfile = createNewProfile('Alice'); playerProfile.xp = 123;");
    const backup = JSON.parse(f.run('ProfileBackup.createExport()'));
    assert.equal(backup.profiles.Alice.xp, 123);
    assert.equal(backup.recovery.kaijuProfiles, 'invalid save');
    assert.equal(f.storage.get('kaijuProfiles'), 'invalid save');
});

test('shared menu translations cover all four profile languages', () => {
    const f = fixture('js/core/translations.js', 'js/core/menu-translations.js');
    const translations = f.run('TRANSLATIONS');
    for (const key of f.run('Object.keys(MENU_TRANSLATIONS)')) {
        for (const lang of ['en', 'nl', 'de', 'vi']) assert.ok(translations[lang][key], `${lang}.${key}`);
    }
});

test('mixed challenge awards the same difficulty points as a single-operation challenge', () => {
    const f = fixture('js/features/game-modes.js');
    const points = operation => f.run(`
        challengeMode.startChallenge([20], 60); challengeMode.operation = '${operation}'; challengeMode.combo = 0;
        challengeMode.currentQuestion = { num1: 20, num2: 12, operation: 'multiply', answer: 240 };
        challengeMode.checkAnswer(240, 3).points;
    `);
    assert.equal(points('mixed'), points('multiply'));
});


test('blocked browser storage reports a warning without interrupting profile loading', () => {
    const f = fixture('js/core/game.js');
    f.failReads(true);
    assert.equal(f.run('getAllProfileNames().length'), 0);
    assert.equal(f.run('StorageUtils.warning'), 'storageUnavailable');
});

test('profile backup round trip retains campaign, personal scores and learning progress', () => {
    const f = fixture('js/core/translations.js', 'js/core/game.js', 'js/ui/profile-backup.js');
    f.run(`
        currentProfileName = 'Alice'; playerProfile = createNewProfile('Alice');
        playerProfile.xp = 250;
        playerProfile.campaign = { currentChapter: 3, completedChapters: [1, 2] };
        playerProfile.challengeScores = [{ score: 777 }];
        playerProfile.analytics.facts['2×3'] = { attempts: 5, correct: 4 };
        saveCurrentProfile();
        ProfileBackup.importText(ProfileBackup.createExport());
        loadProfile('Alice (2)');
    `);
    assert.equal(f.run('playerProfile.xp'), 250);
    assert.equal(f.run('playerProfile.campaign.currentChapter'), 3);
    assert.equal(f.run('playerProfile.challengeScores[0].score'), 777);
    assert.equal(f.run("playerProfile.analytics.facts['2×3'].correct"), 4);
});
