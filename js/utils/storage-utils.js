// Browser storage failures must not interrupt play or overwrite an unreadable save.
const StorageUtils = {
    pendingRecovery: new Map(),
    onWarning: null,
    warning: null,

    warn(key) {
        this.warning = key;
        if (this.onWarning) this.onWarning(key);
    },

    isRecord(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    },

    readText(key) {
        try {
            return localStorage.getItem(key);
        } catch {
            this.warn('storageUnavailable');
            return null;
        }
    },

    read(key, fallback, validate) {
        const raw = this.readText(key);
        if (raw === null) return fallback();
        try {
            const value = JSON.parse(raw);
            if (!validate(value)) throw new Error('Invalid save data');
            return value;
        } catch {
            this.pendingRecovery.set(key, raw);
            this.warn('saveRecoveryNotice');
            return fallback();
        }
    },

    writeText(key, text) {
        try {
            // Preserve the exact unreadable data before replacing a saved value.
            if (this.pendingRecovery.has(key)) {
                const raw = this.pendingRecovery.get(key);
                let recoveryKey = `${key}.recovery.${Date.now()}`;
                while (localStorage.getItem(recoveryKey) !== null) recoveryKey += '-copy';
                localStorage.setItem(recoveryKey, raw);
                this.pendingRecovery.delete(key);
            }
            localStorage.setItem(key, text);
            return true;
        } catch {
            this.warn('storageUnavailable');
            return false;
        }
    },

    write(key, value) {
        try {
            return this.writeText(key, JSON.stringify(value));
        } catch {
            this.warn('storageUnavailable');
            return false;
        }
    },

    remove(key) {
        try { localStorage.removeItem(key); } catch { this.warn('storageUnavailable'); }
    },

    recoveryCopies() {
        const copies = Object.fromEntries(this.pendingRecovery);
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (/^(kaijuProfiles|challengeHighscores)\.recovery\./.test(key)) copies[key] = localStorage.getItem(key);
            }
        } catch { this.warn('storageUnavailable'); }
        return copies;
    },

    // Fill partial older objects recursively while preserving optional game fields.
    mergeDefaults(defaults, value) {
        if (Array.isArray(defaults)) return Array.isArray(value) ? value : defaults;
        if (this.isRecord(defaults)) {
            const result = { ...(this.isRecord(value) ? value : {}) };
            Object.keys(defaults).forEach(key => {
                result[key] = this.mergeDefaults(defaults[key], Object.hasOwn(result, key) ? result[key] : undefined);
            });
            return result;
        }
        if (typeof defaults === 'number') return Number.isFinite(value) && value >= 0 ? value : defaults;
        if (defaults === null) return value === undefined ? null : value;
        return typeof value === typeof defaults ? value : defaults;
    }
};
