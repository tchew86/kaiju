// KAIJU - Multi-Language Translation System
// Supports: English, Dutch, German, Vietnamese

const TRANSLATIONS = {
    en: {
        // Game Title & UI
        gameTitle: 'KAIJU',
        subtitle: 'MATH BATTLE ARENA',

        // Operations
        multiply: 'Multiply',
        add: 'Add',
        times: '×',
        plus: '+',

        // Screens
        battle: 'BATTLE',
        practice: 'PRACTICE',
        stats: 'STATS',
        achievements: 'ACHIEVEMENTS',
        history: 'HISTORY',
        settings: 'SETTINGS',

        // Battle
        victory: 'VICTORY!',
        defeat: 'DEFEATED!',
        correct: 'CORRECT!',
        wrong: 'WRONG!',
        timeout: 'TIME OUT!',
        supercharge: 'SUPERCHARGED!',
        combo: 'COMBO',
        bossAppears: 'BOSS APPEARS!',

        // Stats
        level: 'Level',
        power: 'Power',
        accuracy: 'Accuracy',
        speed: 'Avg Speed',
        mastery: 'Mastery',
        streak: 'Daily Streak',

        // Achievements
        achievementUnlocked: 'Achievement Unlocked!',
        progress: 'Progress',

        // Messages
        selectTables: 'Select Tables to Battle',
        selectAll: 'Select All',
        startBattle: 'START BATTLE!',
        playAgain: 'PLAY AGAIN',
        continue: 'CONTINUE',
        backToMenu: 'BACK TO MENU',

        // Evolution
        evolution: 'EVOLUTION!',
        levelUp: 'LEVEL UP!',

        // Enemy types
        normal: 'Normal',
        flying: 'Flying',
        armored: 'Armored',
        fast: 'Fast',
        boss: 'BOSS',

        // Stats labels
        table: 'Table',
        weak: 'Needs Practice',
        good: 'Good',
        strong: 'Mastered',
        attempts: 'Attempts',
        avgTime: 'Avg Time',

        // --- Static UI (data-i18n) ---
        pageTitle: 'KAIJU - Math Battle Arena',
        selectProfile: 'Select Profile',
        newProfileName: 'Enter new profile name',
        createProfile: 'CREATE PROFILE',
        changeProfile: '👤 CHANGE PROFILE',
        uiLevel: 'LEVEL',
        uiMaxDmg: '⚔️ MAX DMG',
        uiMaxHp: '❤️ MAX HP',
        totalXp: 'Total XP:',
        upgradesTitle: '⚡ UPGRADES ⚡',
        pointsAvailable: 'Points Available',
        levelColon: 'Level:',
        upgradeHpBtn: 'UPGRADE (+20 HP)',
        uiPower: '⚔️ POWER',
        upgradePowerBtn: 'UPGRADE (+15% DMG)',
        chooseTables: 'Choose Your Battle Tables',
        includeSubtraction: 'Include Subtraction',
        allowOverhangLabel: 'Allow Overhang (e.g., 9+4=13)',
        selectAllTables: 'SELECT ALL TABLES',
        chooseRanges: 'Choose Number Ranges',
        selectAllRanges: 'SELECT ALL RANGES',
        statsBtn: '📊 STATS',
        collectionBtn: '🦖 COLLECTION',
        manualBtn: '📖 MANUAL',
        modesBtn: '🎮 MODES',
        wildKaijuAppears: 'A WILD KAIJU APPEARS!',
        hpColon: 'HP:',
        levelCapsColon: 'LEVEL:',
        attackColon: '⚔️ ATTACK:',
        battleParams: '📋 BATTLE PARAMETERS',
        operationColon: 'Operation:',
        tablesColon: 'Tables:',
        beginBattle: 'BEGIN BATTLE!',
        hpLabel: 'HP',
        yourAnswer: 'YOUR ANSWER:',
        attackBtn: 'ATTACK!',
        specialAttack: '⚡ SPECIAL ATTACK! ⚡',
        atomicBreathCharging: '⚡ ATOMIC BREATH CHARGING ⚡',
        superFastAnswers: 'Super Fast Answers',
        youLabel: 'YOU',
        damageDealt: 'Damage Dealt',
        attacksLabel: 'Attacks',
        xpGainedLabel: 'XP GAINED:',
        nextBattle: 'NEXT BATTLE!',
        battleHistoryTitle: 'BATTLE HISTORY',
        backBtn: 'BACK',
        battleDetailsTitle: 'BATTLE DETAILS',
        backToHistory: 'BACK TO HISTORY',
        youDefeatedEnemy: 'You defeated %1 (Level %2)!',
        enemyDefeatedYou: '%1 (Level %2) has defeated you!',

        // --- In-battle toasts & dynamic gameplay strings ---
        atomicBreathFired: '⚡ ATOMIC BREATH! ⚡',
        atomicBreathReady: '⚡ ATOMIC BREATH READY! ⚡',
        pressSpecialAttack: 'PRESS SPECIAL ATTACK!',
        gigarexAttacks: 'GIGAREX ATTACKS!',
        comboGigarexAttacks: '%1x COMBO! GIGAREX ATTACKS!',
        shieldBlocked: '🛡️ SHIELD BLOCKED THE ATTACK! 🛡️',
        enemyAttacksAnswer: '%1 ATTACKS! (Answer: %2)',
        tooSlowEnemyAttacks: 'TOO SLOW! %1 ATTACKS! (Answer: %2)',
        comboLabel: '%1x COMBO!',
        evolvedTo: '🎉 EVOLVED TO %1! 🎉',
        levelUpNow: '⬆️ LEVEL UP! Now Level %1! ⬆️',
        deselectAll: 'DESELECT ALL',
        enterProfileName: 'Please enter a profile name',
        opMultiplication: 'Multiplication',
        opAddition: 'Addition',
        opDivision: 'Division'
    },

    nl: {  // Dutch
        gameTitle: 'KAIJU',
        subtitle: 'WISKUNDE STRIJDARENA',

        multiply: 'Vermenigvuldigen',
        add: 'Optellen',
        times: '×',
        plus: '+',

        battle: 'GEVECHT',
        practice: 'OEFENEN',
        stats: 'STATISTIEKEN',
        achievements: 'PRESTATIES',
        history: 'GESCHIEDENIS',
        settings: 'INSTELLINGEN',

        victory: 'OVERWINNING!',
        defeat: 'VERSLAGEN!',
        correct: 'GOED!',
        wrong: 'FOUT!',
        timeout: 'TIJD OP!',
        supercharge: 'SUPER KRACHT!',
        combo: 'COMBO',
        bossAppears: 'BAAS VERSCHIJNT!',

        level: 'Niveau',
        power: 'Kracht',
        accuracy: 'Nauwkeurigheid',
        speed: 'Gem Snelheid',
        mastery: 'Beheersing',
        streak: 'Dagelijkse Reeks',

        achievementUnlocked: 'Prestatie Behaald!',
        progress: 'Voortgang',

        selectTables: 'Selecteer Tafels om te Vechten',
        selectAll: 'Alles Selecteren',
        startBattle: 'START GEVECHT!',
        playAgain: 'SPEEL OPNIEUW',
        continue: 'DOORGAAN',
        backToMenu: 'TERUG NAAR MENU',

        evolution: 'EVOLUTIE!',
        levelUp: 'NIVEAU OMHOOG!',

        normal: 'Normaal',
        flying: 'Vliegend',
        armored: 'Gepantserd',
        fast: 'Snel',
        boss: 'BAAS',

        table: 'Tafel',
        weak: 'Moet Oefenen',
        good: 'Goed',
        strong: 'Beheerst',
        attempts: 'Pogingen',
        avgTime: 'Gem Tijd',

        // --- Static UI (data-i18n) ---
        pageTitle: 'KAIJU - Wiskunde Strijdarena',
        selectProfile: 'Selecteer Profiel',
        newProfileName: 'Voer nieuwe profielnaam in',
        createProfile: 'PROFIEL AANMAKEN',
        changeProfile: '👤 PROFIEL WIJZIGEN',
        uiLevel: 'NIVEAU',
        uiMaxDmg: '⚔️ MAX SCHADE',
        uiMaxHp: '❤️ MAX HP',
        totalXp: 'Totaal XP:',
        upgradesTitle: '⚡ UPGRADES ⚡',
        pointsAvailable: 'Punten Beschikbaar',
        levelColon: 'Niveau:',
        upgradeHpBtn: 'UPGRADE (+20 HP)',
        uiPower: '⚔️ KRACHT',
        upgradePowerBtn: 'UPGRADE (+15% SCHADE)',
        chooseTables: 'Kies Je Gevechtstafels',
        includeSubtraction: 'Inclusief Aftrekken',
        allowOverhangLabel: 'Overhang Toestaan (bijv. 9+4=13)',
        selectAllTables: 'ALLE TAFELS SELECTEREN',
        chooseRanges: 'Kies Getalbereiken',
        selectAllRanges: 'ALLE BEREIKEN SELECTEREN',
        statsBtn: '📊 STATISTIEKEN',
        collectionBtn: '🦖 COLLECTIE',
        manualBtn: '📖 HANDLEIDING',
        modesBtn: '🎮 MODI',
        wildKaijuAppears: 'EEN WILDE KAIJU VERSCHIJNT!',
        hpColon: 'HP:',
        levelCapsColon: 'NIVEAU:',
        attackColon: '⚔️ AANVAL:',
        battleParams: '📋 GEVECHTSPARAMETERS',
        operationColon: 'Bewerking:',
        tablesColon: 'Tafels:',
        beginBattle: 'BEGIN GEVECHT!',
        hpLabel: 'HP',
        yourAnswer: 'JOUW ANTWOORD:',
        attackBtn: 'AANVAL!',
        specialAttack: '⚡ SPECIALE AANVAL! ⚡',
        atomicBreathCharging: '⚡ ATOOMSTRAAL LADEN ⚡',
        superFastAnswers: 'Supersnelle Antwoorden',
        youLabel: 'JIJ',
        damageDealt: 'Schade Toegebracht',
        attacksLabel: 'Aanvallen',
        xpGainedLabel: 'XP VERDIEND:',
        nextBattle: 'VOLGEND GEVECHT!',
        battleHistoryTitle: 'GEVECHTSGESCHIEDENIS',
        backBtn: 'TERUG',
        battleDetailsTitle: 'GEVECHTSDETAILS',
        backToHistory: 'TERUG NAAR GESCHIEDENIS',
        youDefeatedEnemy: 'Je hebt %1 verslagen (Niveau %2)!',
        enemyDefeatedYou: '%1 (Niveau %2) heeft jou verslagen!',

        // --- In-battle toasts & dynamic gameplay strings ---
        atomicBreathFired: '⚡ ATOOMSTRAAL! ⚡',
        atomicBreathReady: '⚡ ATOOMSTRAAL KLAAR! ⚡',
        pressSpecialAttack: 'DRUK OP SPECIALE AANVAL!',
        gigarexAttacks: 'GIGAREX VALT AAN!',
        comboGigarexAttacks: '%1x COMBO! GIGAREX VALT AAN!',
        shieldBlocked: '🛡️ SCHILD BLOKKEERDE DE AANVAL! 🛡️',
        enemyAttacksAnswer: '%1 VALT AAN! (Antwoord: %2)',
        tooSlowEnemyAttacks: 'TE LANGZAAM! %1 VALT AAN! (Antwoord: %2)',
        comboLabel: '%1x COMBO!',
        evolvedTo: '🎉 GEËVOLUEERD NAAR %1! 🎉',
        levelUpNow: '⬆️ NIVEAU OMHOOG! Nu Niveau %1! ⬆️',
        deselectAll: 'ALLES DESELECTEREN',
        enterProfileName: 'Voer een profielnaam in',
        opMultiplication: 'Vermenigvuldiging',
        opAddition: 'Optellen',
        opDivision: 'Delen'
    },

    de: {  // German
        gameTitle: 'KAIJU',
        subtitle: 'MATHE-KAMPFARENA',

        multiply: 'Multiplizieren',
        add: 'Addieren',
        times: '×',
        plus: '+',

        battle: 'KAMPF',
        practice: 'ÜBEN',
        stats: 'STATISTIKEN',
        achievements: 'ERFOLGE',
        history: 'GESCHICHTE',
        settings: 'EINSTELLUNGEN',

        victory: 'SIEG!',
        defeat: 'BESIEGT!',
        correct: 'RICHTIG!',
        wrong: 'FALSCH!',
        timeout: 'ZEIT ABGELAUFEN!',
        supercharge: 'AUFGELADEN!',
        combo: 'COMBO',
        bossAppears: 'BOSS ERSCHEINT!',

        level: 'Stufe',
        power: 'Kraft',
        accuracy: 'Genauigkeit',
        speed: 'Durchschn. Geschw.',
        mastery: 'Beherrschung',
        streak: 'Tägliche Serie',

        achievementUnlocked: 'Erfolg Freigeschaltet!',
        progress: 'Fortschritt',

        selectTables: 'Wähle Tafeln zum Kämpfen',
        selectAll: 'Alle Auswählen',
        startBattle: 'KAMPF STARTEN!',
        playAgain: 'NOCHMAL SPIELEN',
        continue: 'WEITER',
        backToMenu: 'ZURÜCK ZUM MENÜ',

        evolution: 'EVOLUTION!',
        levelUp: 'STUFE AUFGESTIEGEN!',

        normal: 'Normal',
        flying: 'Fliegend',
        armored: 'Gepanzert',
        fast: 'Schnell',
        boss: 'BOSS',

        table: 'Tafel',
        weak: 'Üben Nötig',
        good: 'Gut',
        strong: 'Gemeistert',
        attempts: 'Versuche',
        avgTime: 'Durchschn. Zeit',

        // --- Static UI (data-i18n) ---
        pageTitle: 'KAIJU - Mathe-Kampfarena',
        selectProfile: 'Profil Wählen',
        newProfileName: 'Neuen Profilnamen eingeben',
        createProfile: 'PROFIL ERSTELLEN',
        changeProfile: '👤 PROFIL WECHSELN',
        uiLevel: 'STUFE',
        uiMaxDmg: '⚔️ MAX SCHADEN',
        uiMaxHp: '❤️ MAX HP',
        totalXp: 'Gesamt-XP:',
        upgradesTitle: '⚡ VERBESSERUNGEN ⚡',
        pointsAvailable: 'Punkte Verfügbar',
        levelColon: 'Stufe:',
        upgradeHpBtn: 'VERBESSERN (+20 HP)',
        uiPower: '⚔️ KRAFT',
        upgradePowerBtn: 'VERBESSERN (+15% SCHADEN)',
        chooseTables: 'Wähle Deine Kampftafeln',
        includeSubtraction: 'Subtraktion Einschließen',
        allowOverhangLabel: 'Übertrag Erlauben (z.B. 9+4=13)',
        selectAllTables: 'ALLE TAFELN AUSWÄHLEN',
        chooseRanges: 'Wähle Zahlenbereiche',
        selectAllRanges: 'ALLE BEREICHE AUSWÄHLEN',
        statsBtn: '📊 STATISTIKEN',
        collectionBtn: '🦖 SAMMLUNG',
        manualBtn: '📖 ANLEITUNG',
        modesBtn: '🎮 MODI',
        wildKaijuAppears: 'EIN WILDER KAIJU ERSCHEINT!',
        hpColon: 'HP:',
        levelCapsColon: 'STUFE:',
        attackColon: '⚔️ ANGRIFF:',
        battleParams: '📋 KAMPFPARAMETER',
        operationColon: 'Rechenart:',
        tablesColon: 'Tafeln:',
        beginBattle: 'KAMPF BEGINNEN!',
        hpLabel: 'HP',
        yourAnswer: 'DEINE ANTWORT:',
        attackBtn: 'ANGRIFF!',
        specialAttack: '⚡ SPEZIALANGRIFF! ⚡',
        atomicBreathCharging: '⚡ ATOMSTRAHL LÄDT ⚡',
        superFastAnswers: 'Superschnelle Antworten',
        youLabel: 'DU',
        damageDealt: 'Verursachter Schaden',
        attacksLabel: 'Angriffe',
        xpGainedLabel: 'XP ERHALTEN:',
        nextBattle: 'NÄCHSTER KAMPF!',
        battleHistoryTitle: 'KAMPFVERLAUF',
        backBtn: 'ZURÜCK',
        battleDetailsTitle: 'KAMPFDETAILS',
        backToHistory: 'ZURÜCK ZUM VERLAUF',
        youDefeatedEnemy: 'Du hast %1 besiegt (Stufe %2)!',
        enemyDefeatedYou: '%1 (Stufe %2) hat dich besiegt!',

        // --- In-battle toasts & dynamic gameplay strings ---
        atomicBreathFired: '⚡ ATOMSTRAHL! ⚡',
        atomicBreathReady: '⚡ ATOMSTRAHL BEREIT! ⚡',
        pressSpecialAttack: 'SPEZIALANGRIFF DRÜCKEN!',
        gigarexAttacks: 'GIGAREX GREIFT AN!',
        comboGigarexAttacks: '%1x COMBO! GIGAREX GREIFT AN!',
        shieldBlocked: '🛡️ SCHILD BLOCKIERTE DEN ANGRIFF! 🛡️',
        enemyAttacksAnswer: '%1 GREIFT AN! (Antwort: %2)',
        tooSlowEnemyAttacks: 'ZU LANGSAM! %1 GREIFT AN! (Antwort: %2)',
        comboLabel: '%1x COMBO!',
        evolvedTo: '🎉 ENTWICKELT ZU %1! 🎉',
        levelUpNow: '⬆️ STUFE AUFGESTIEGEN! Jetzt Stufe %1! ⬆️',
        deselectAll: 'ALLE ABWÄHLEN',
        enterProfileName: 'Bitte gib einen Profilnamen ein',
        opMultiplication: 'Multiplikation',
        opAddition: 'Addition',
        opDivision: 'Division'
    },

    vi: {  // Vietnamese
        gameTitle: 'KAIJU',
        subtitle: 'ĐẤU TRƯỜNG TOÁN HỌC',

        multiply: 'Nhân',
        add: 'Cộng',
        times: '×',
        plus: '+',

        battle: 'TRẬN CHIẾN',
        practice: 'LUYỆN TẬP',
        stats: 'THỐNG KÊ',
        achievements: 'THÀNH TÍCH',
        history: 'LỊCH SỬ',
        settings: 'CÀI ĐẶT',

        victory: 'CHIẾN THẮNG!',
        defeat: 'THUA TRẬN!',
        correct: 'ĐÚNG!',
        wrong: 'SAI!',
        timeout: 'HẾT GIỜ!',
        supercharge: 'SIÊU NĂNG LƯỢNG!',
        combo: 'COMBO',
        bossAppears: 'BOSS XUẤT HIỆN!',

        level: 'Cấp',
        power: 'Sức Mạnh',
        accuracy: 'Độ Chính Xác',
        speed: 'Tốc Độ TB',
        mastery: 'Thành Thạo',
        streak: 'Chuỗi Ngày',

        achievementUnlocked: 'Mở Khóa Thành Tích!',
        progress: 'Tiến Trình',

        selectTables: 'Chọn Bảng để Chiến Đấu',
        selectAll: 'Chọn Tất Cả',
        startBattle: 'BẮT ĐẦU CHIẾN ĐẤU!',
        playAgain: 'CHƠI LẠI',
        continue: 'TIẾP TỤC',
        backToMenu: 'VỀ MENU',

        evolution: 'TIẾN HÓA!',
        levelUp: 'THĂNG CẤP!',

        normal: 'Thường',
        flying: 'Bay',
        armored: 'Giáp',
        fast: 'Nhanh',
        boss: 'BOSS',

        table: 'Bảng',
        weak: 'Cần Luyện',
        good: 'Tốt',
        strong: 'Thành Thạo',
        attempts: 'Lần Thử',
        avgTime: 'Thời Gian TB',

        // --- Static UI (data-i18n) ---
        pageTitle: 'KAIJU - Đấu Trường Toán Học',
        selectProfile: 'Chọn Hồ Sơ',
        newProfileName: 'Nhập tên hồ sơ mới',
        createProfile: 'TẠO HỒ SƠ',
        changeProfile: '👤 ĐỔI HỒ SƠ',
        uiLevel: 'CẤP',
        uiMaxDmg: '⚔️ SÁT THƯƠNG TỐI ĐA',
        uiMaxHp: '❤️ HP TỐI ĐA',
        totalXp: 'Tổng XP:',
        upgradesTitle: '⚡ NÂNG CẤP ⚡',
        pointsAvailable: 'Điểm Khả Dụng',
        levelColon: 'Cấp:',
        upgradeHpBtn: 'NÂNG CẤP (+20 HP)',
        uiPower: '⚔️ SỨC MẠNH',
        upgradePowerBtn: 'NÂNG CẤP (+15% SÁT THƯƠNG)',
        chooseTables: 'Chọn Bảng Chiến Đấu',
        includeSubtraction: 'Bao Gồm Phép Trừ',
        allowOverhangLabel: 'Cho Phép Nhớ (vd: 9+4=13)',
        selectAllTables: 'CHỌN TẤT CẢ BẢNG',
        chooseRanges: 'Chọn Khoảng Số',
        selectAllRanges: 'CHỌN TẤT CẢ KHOẢNG',
        statsBtn: '📊 THỐNG KÊ',
        collectionBtn: '🦖 BỘ SƯU TẬP',
        manualBtn: '📖 HƯỚNG DẪN',
        modesBtn: '🎮 CHẾ ĐỘ',
        wildKaijuAppears: 'MỘT KAIJU HOANG DÃ XUẤT HIỆN!',
        hpColon: 'HP:',
        levelCapsColon: 'CẤP:',
        attackColon: '⚔️ TẤN CÔNG:',
        battleParams: '📋 THÔNG SỐ TRẬN ĐẤU',
        operationColon: 'Phép Tính:',
        tablesColon: 'Bảng:',
        beginBattle: 'BẮT ĐẦU TRẬN!',
        hpLabel: 'HP',
        yourAnswer: 'CÂU TRẢ LỜI:',
        attackBtn: 'TẤN CÔNG!',
        specialAttack: '⚡ ĐÒN ĐẶC BIỆT! ⚡',
        atomicBreathCharging: '⚡ ĐANG NẠP HƠI THỞ NGUYÊN TỬ ⚡',
        superFastAnswers: 'Câu Trả Lời Siêu Nhanh',
        youLabel: 'BẠN',
        damageDealt: 'Sát Thương Gây Ra',
        attacksLabel: 'Đòn Tấn Công',
        xpGainedLabel: 'XP NHẬN ĐƯỢC:',
        nextBattle: 'TRẬN TIẾP THEO!',
        battleHistoryTitle: 'LỊCH SỬ TRẬN ĐẤU',
        backBtn: 'QUAY LẠI',
        battleDetailsTitle: 'CHI TIẾT TRẬN ĐẤU',
        backToHistory: 'VỀ LỊCH SỬ',
        youDefeatedEnemy: 'Bạn đã đánh bại %1 (Cấp %2)!',
        enemyDefeatedYou: '%1 (Cấp %2) đã đánh bại bạn!',

        // --- In-battle toasts & dynamic gameplay strings ---
        atomicBreathFired: '⚡ HƠI THỞ NGUYÊN TỬ! ⚡',
        atomicBreathReady: '⚡ HƠI THỞ NGUYÊN TỬ SẴN SÀNG! ⚡',
        pressSpecialAttack: 'NHẤN ĐÒN ĐẶC BIỆT!',
        gigarexAttacks: 'GIGAREX TẤN CÔNG!',
        comboGigarexAttacks: '%1x COMBO! GIGAREX TẤN CÔNG!',
        shieldBlocked: '🛡️ KHIÊN ĐÃ CHẶN ĐÒN! 🛡️',
        enemyAttacksAnswer: '%1 TẤN CÔNG! (Đáp án: %2)',
        tooSlowEnemyAttacks: 'QUÁ CHẬM! %1 TẤN CÔNG! (Đáp án: %2)',
        comboLabel: '%1x COMBO!',
        evolvedTo: '🎉 TIẾN HÓA THÀNH %1! 🎉',
        levelUpNow: '⬆️ THĂNG CẤP! Bây Giờ Cấp %1! ⬆️',
        deselectAll: 'BỎ CHỌN TẤT CẢ',
        enterProfileName: 'Vui lòng nhập tên hồ sơ',
        opMultiplication: 'Phép Nhân',
        opAddition: 'Phép Cộng',
        opDivision: 'Phép Chia'
    }
};

// Translation function
function t(key, lang = null) {
    const language = lang || getCurrentLanguage();
    // Guard against an unknown/corrupted language so we never throw on lookup
    const table = TRANSLATIONS[language] || TRANSLATIONS.en;
    return table[key] || TRANSLATIONS.en[key] || key;
}

// Translate a template containing %1, %2 ... placeholders
function tFormat(key, lang, ...args) {
    let str = t(key, lang);
    args.forEach((arg, i) => {
        str = str.replace(new RegExp('%' + (i + 1), 'g'), arg);
    });
    return str;
}

// Get current language
function getCurrentLanguage() {
    return (typeof playerProfile !== 'undefined' && playerProfile?.settings?.language) || 'en';
}

// Set language
function setLanguage(lang) {
    if (typeof playerProfile !== 'undefined' && playerProfile && TRANSLATIONS[lang]) {
        playerProfile.settings.language = lang;
        updateUILanguage();
        if (typeof saveCurrentProfile === 'function') {
            saveCurrentProfile();
        }
    }
}

// Update all UI text to current language by sweeping data-i18n attributes.
// Any element with data-i18n="key" gets its textContent set to t(key); any
// element with data-i18n-placeholder="key" gets its placeholder set.
function updateUILanguage() {
    const lang = getCurrentLanguage();

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = t(key, lang);
        if (value) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = t(key, lang);
        if (value) el.setAttribute('placeholder', value);
    });

    // Document title
    document.title = t('pageTitle', lang);
}

// Expose globally so the rest of the (non-module) codebase can call these
if (typeof window !== 'undefined') {
    window.t = t;
    window.tFormat = tFormat;
    window.getCurrentLanguage = getCurrentLanguage;
    window.setLanguage = setLanguage;
    window.updateUILanguage = updateUILanguage;
}
