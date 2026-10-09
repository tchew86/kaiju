const ProfileBackup = {
    createExport() {
        const profiles = loadProfiles();
        // Include progress that could not be written when browser storage is unavailable.
        if (currentProfileName) profiles[currentProfileName] = playerProfile;
        return JSON.stringify({
            format: 'kaiju-backup', version: 1, exportedAt: new Date().toISOString(),
            profiles,
            challengeHighscores: StorageUtils.read('challengeHighscores', () => [], Array.isArray),
            recovery: StorageUtils.recoveryCopies()
        }, null, 2);
    },

    importText(text) {
        const backup = JSON.parse(text);
        if (backup?.format !== 'kaiju-backup' || backup.version !== 1 || !StorageUtils.isRecord(backup.profiles)) {
            throw new Error(t('invalidBackup'));
        }
        const entries = Object.entries(backup.profiles);
        if (!entries.length || entries.some(([name, profile]) =>
            !name.trim() || !StorageUtils.isRecord(profile) ||
            (profile.xp !== undefined && (!Number.isFinite(profile.xp) || profile.xp < 0))
        )) throw new Error(t('invalidBackup'));

        // Validate the complete file before mutating storage. Existing names are kept.
        const profiles = loadProfiles();
        const importedNames = [];
        entries.forEach(([name, profile]) => {
            const base = name.trim().slice(0, 20);
            let importedName = base;
            let copy = 1;
            while (Object.hasOwn(profiles, importedName)) {
                const suffix = ` (${++copy})`;
                importedName = base.slice(0, 20 - suffix.length) + suffix;
            }
            profiles[importedName] = migrateProfile({ ...profile, name: importedName });
            importedNames.push(importedName);
        });
        if (!saveProfiles(profiles)) throw new Error(t('storageUnavailable'));
        return importedNames;
    },

    download() {
        const blob = new Blob([this.createExport()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `kaiju-profiles-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    init() {
        const exportButton = document.getElementById('export-profiles-btn');
        const importButton = document.getElementById('import-profiles-btn');
        const fileInput = document.getElementById('import-profiles-file');
        const status = document.getElementById('profile-backup-status');
        exportButton.addEventListener('click', () => {
            this.download();
            status.textContent = t('backupDownloaded');
        });
        importButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', async () => {
            const file = fileInput.files[0];
            if (!file) return;
            try {
                if (file.size > 5 * 1024 * 1024) throw new Error(t('backupTooLarge'));
                const names = this.importText(await file.text());
                renderProfileList();
                status.textContent = tFormat('backupImported', null, names.length);
            } catch (error) {
                status.textContent = error instanceof SyntaxError ? t('invalidBackup') : error.message;
            } finally {
                fileInput.value = '';
            }
        });
        StorageUtils.onWarning = key => {
            const notice = document.getElementById('storage-notice');
            notice.hidden = false;
            notice.dataset.i18n = key;
            notice.textContent = t(key);
        };
        if (StorageUtils.warning) StorageUtils.onWarning(StorageUtils.warning);
    }
};

document.addEventListener('DOMContentLoaded', () => ProfileBackup.init());
