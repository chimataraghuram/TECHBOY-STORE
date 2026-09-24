// Subtle, non-intrusive mobile haptics & audio feedback for high-fidelity native feeling

class SoundAndHaptics {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
    }

    // Lazy initialize AudioContext on user gesture
    getAudioContext() {
        if (!this.soundEnabled) return null;
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        return this.ctx;
    }

    // Native device vibration (supported on modern Android & iOS web apps)
    vibrate(pattern = 10) {
        if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {}
        }
    }

    // 1. Subtle, silky click (for filter chips, brand selection, segmented tabs)
    click() {
        this.vibrate(8);
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.035);

            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.035);
        } catch (e) {}
    }

    // 2. Sweet chime for saving to wishlist / setting price alert
    heartPop() {
        this.vibrate([12, 35, 18]);
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    }

    // 3. Crisp pop when copying link / sharing
    shareSuccess() {
        this.vibrate([15, 40, 20]);
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(659, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(987, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {}
    }
}

export const feedback = new SoundAndHaptics();
