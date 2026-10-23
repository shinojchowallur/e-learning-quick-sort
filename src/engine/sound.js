/**
 * Web Audio API Sound Generator for QuickSort Visualizer
 * Synthesizes harmonious tones corresponding to element values.
 */

class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.15;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  // Map element value to a pleasant musical frequency (Pentatonic / Major Scale in Hz)
  getFrequency(value, minVal = 5, maxVal = 100) {
    const minFreq = 180;
    const maxFreq = 880;
    const normalized = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal || 1)));
    
    // Pentatonic scale degrees for musical harmony
    const pentatonicRatios = [1, 9/8, 5/4, 3/2, 5/3, 2];
    const baseFreq = minFreq + normalized * (maxFreq - minFreq);
    return baseFreq;
  }

  playCompareTone(val, minVal, maxVal) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const freq = this.getFrequency(val, minVal, maxVal);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(this.volume * 0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio playback fails gracefully if blocked
    }
  }

  playSwapTone(val1, val2, minVal, maxVal) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const freq1 = this.getFrequency(val1, minVal, maxVal);
      const freq2 = this.getFrequency(val2, minVal, maxVal);

      [freq1, freq2].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.04);

        gain.gain.setValueAtTime(this.volume * 0.6, this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.15);
      });
    } catch {
      // Audio playback fails gracefully
    }
  }

  playPivotLockTone(val, minVal, maxVal) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const freq = this.getFrequency(val, minVal, maxVal);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);

      gain.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.19);
    } catch {
      // Ignore
    }
  }

  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C, E, G, C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);

        gain.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.07);
        osc.stop(this.ctx.currentTime + i * 0.07 + 0.26);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundController();
