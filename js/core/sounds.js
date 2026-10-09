// KAIJU - Web Audio API Sound System
// Generates all sounds programmatically (no audio files needed)

class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('⚠️ Web Audio API not supported');
            this.enabled = false;
        }
    }

    // Resume audio context (required for user interaction)
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Play attack sound
    playAttack() {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Oscillator for main tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Swoosh attack sound
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

        gain.gain.setValueAtTime(this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Play hit/damage sound
    playHit() {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Impact sound
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);

        gain.gain.setValueAtTime(this.volume * 0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Play correct answer sound
    playCorrect() {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Two-tone positive sound
        [400, 500].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            gain.gain.setValueAtTime(this.volume * 0.3, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05 + i * 0.05 + 0.1);

            osc.start(now + i * 0.05);
            osc.stop(now + 0.15 + i * 0.05);
        });
    }

    // Play wrong answer sound
    playWrong() {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Descending negative sound
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    // Play combo sound
    playCombo(comboLevel = 1) {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Higher pitch for higher combo
        const baseFreq = 300 + (comboLevel * 20);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);

        gain.gain.setValueAtTime(this.volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Play supercharge activation
    playSupercharge() {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Power-up sound with multiple tones
        [200, 300, 400, 500].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            gain.gain.setValueAtTime(this.volume * 0.25, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.start(now + i * 0.05);
            osc.stop(now + 0.35);
        });
    }

    // Play victory fanfare
    playVictory() {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Victory melody: C-E-G-C
        const melody = [261.63, 329.63, 392.00, 523.25];

        melody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            gain.gain.setValueAtTime(this.volume * 0.4, now + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.15);

            osc.start(now + i * 0.15);
            osc.stop(now + (i + 1) * 0.15);
        });
    }

    // Play defeat sound
    playDefeat() {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Descending tones
        const melody = [392.00, 329.63, 261.63, 196.00];

        melody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            gain.gain.setValueAtTime(this.volume * 0.3, now + i * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.2);

            osc.start(now + i * 0.2);
            osc.stop(now + (i + 1) * 0.2);
        });
    }

    // Play evolution sound
    playEvolution() {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Ascending scale with sparkle
        const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

        scale.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(this.volume * 0.3, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.08);

            osc.start(now + i * 0.08);
            osc.stop(now + (i + 1) * 0.08);
        });
    }

    // Play achievement unlock sound
    playAchievement() {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Triumphant chord progression
        const chords = [
            [261.63, 329.63, 392.00],  // C major
            [293.66, 369.99, 440.00],  // D major
            [329.63, 415.30, 493.88]   // E major
        ];

        chords.forEach((chord, i) => {
            chord.forEach(freq => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = freq;
                gain.gain.setValueAtTime(this.volume * 0.2, now + i * 0.25);
                gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.25);

                osc.start(now + i * 0.25);
                osc.stop(now + (i + 1) * 0.25);
            });
        });
    }

    // Play boss appears sound
    playBossAppears() {
        if (!this.enabled) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Ominous low rumble
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);

        gain.gain.setValueAtTime(this.volume * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        osc.start(now);
        osc.stop(now + 0.8);
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Set volume (0-1)
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// Create global sound system instance
const soundSystem = new SoundSystem();
