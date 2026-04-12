import { SoundEvent, TamaruConfig } from "./types";
import { triggerHaptic } from "./hapticEngine";

type FilterType = "bandpass" | "lowpass" | "highpass" | "highshelf";
type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};
type SoundPlaybackOptions = { speed?: number };

const SPIN_MIN_INTERVAL_MS = 22;
const SOUND_VAR = 0.12;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private rollingBuf: AudioBuffer | null = null;

  // Rolling continuous sub-graph
  private rollSrc: AudioBufferSourceNode | null = null;
  private rollMidFilt: BiquadFilterNode | null = null;
  private rollHiFilt: BiquadFilterNode | null = null;
  private rollShaper: WaveShaperNode | null = null;
  private rollGain: GainNode | null = null;
  private rollFadeTimer: ReturnType<typeof setTimeout> | null = null;

  private lastRollTouchAt = 0;
  private lastSpinAt = 0;
  private rollIsActive = false;

  public getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const w = window as WindowWithWebkitAudio;
      const Ctor = globalThis.AudioContext || w.webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 24;
      this.compressor.ratio.value = 4;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.22;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.42;

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private tryResume() {
    if (this.ctx?.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
  }

  private out() {
    return this.compressor!;
  }

  // Utilities
  private appliedRandomVariation(v: number, amt = SOUND_VAR) {
    return v * (1 + (Math.random() - 0.5) * 2 * amt);
  }

  private jitterTime(t: number, s = 0.002) {
    return t + (Math.random() - 0.5) * s;
  }

  private clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
  }

  private normSpeed(s?: number) {
    return this.clamp01((s ?? 10) / 18);
  }

  private makeShaperCurve(amount: number) {
    const n = 256,
      curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  private ensureNoiseBuf() {
    if (this.noiseBuf || !this.ctx) return this.noiseBuf!;
    const len = Math.floor(this.ctx.sampleRate * 0.5);
    const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      lp = lp * 0.85 + w * 0.15;
      d[i] = w * 0.6 + lp * 0.4;
    }
    this.noiseBuf = b;
    return b;
  }

  private ensureRollingBuf() {
    if (this.rollingBuf || !this.ctx) return this.rollingBuf!;
    const len = Math.floor(this.ctx.sampleRate * 2.2);
    const b = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    let lp = 0;
    let mid = 0;
    let prevMid = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      lp = lp * 0.97 + w * 0.03;
      mid = mid * 0.9 + (w - lp) * 0.1;
      const hi = 0.95 * (prevMid - mid);
      prevMid = mid;
      d[i] = lp * 0.45 + mid * 0.42 + hi * 0.13;
    }
    const fade = Math.floor(this.ctx.sampleRate * 0.04);
    for (let i = 0; i < fade; i++) {
      const t = i / fade;
      d[i] *= t;
      d[len - 1 - i] *= t;
    }
    this.rollingBuf = b;
    return b;
  }

  private env(g: GainNode, t: number, peak: number, dur: number, atk = 0.003) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  private noiseBurst(
    t: number,
    dur: number,
    peak: number,
    ftype: FilterType,
    freq: number,
    q = 0.9,
  ) {
    if (!this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.ensureNoiseBuf();
    const f = this.ctx.createBiquadFilter();
    f.type = ftype as BiquadFilterType;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.ctx.createGain();
    this.env(g, t, peak, dur);

    src.connect(f);
    f.connect(g);
    g.connect(this.out());

    src.start(t);
    src.stop(t + dur + 0.02);
  }

  private toneBurst(
    t: number,
    dur: number,
    peak: number,
    type: OscillatorType,
    f0: number,
    f1?: number,
  ) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator(),
      g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    if (f1 != null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    }
    this.env(g, t, peak, dur, 0.004);

    osc.connect(g);
    g.connect(this.out());

    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  // Pre-configured sounds
  private playGrabSound(t: number) {
    this.noiseBurst(
      t,
      this.appliedRandomVariation(0.006),
      this.appliedRandomVariation(0.22),
      "highpass",
      this.appliedRandomVariation(3200),
      this.appliedRandomVariation(0.6),
    );
    this.noiseBurst(
      t + 0.003,
      this.appliedRandomVariation(0.045),
      this.appliedRandomVariation(0.12),
      "bandpass",
      this.appliedRandomVariation(680),
      this.appliedRandomVariation(0.7),
    );
    this.toneBurst(
      this.jitterTime(t, 0.001),
      this.appliedRandomVariation(0.075),
      this.appliedRandomVariation(0.07),
      "sine",
      this.appliedRandomVariation(145),
      this.appliedRandomVariation(90),
    );
    this.noiseBurst(
      t + 0.008,
      this.appliedRandomVariation(0.06),
      this.appliedRandomVariation(0.055),
      "lowpass",
      this.appliedRandomVariation(280),
      this.appliedRandomVariation(0.5),
    );
  }

  private playReleaseSound(t: number) {
    this.noiseBurst(
      t,
      this.appliedRandomVariation(0.005),
      this.appliedRandomVariation(0.15),
      "highpass",
      this.appliedRandomVariation(2800),
      this.appliedRandomVariation(0.55),
    );
    this.noiseBurst(
      t + 0.003,
      this.appliedRandomVariation(0.032),
      this.appliedRandomVariation(0.085),
      "bandpass",
      this.appliedRandomVariation(600),
      this.appliedRandomVariation(0.65),
    );
    this.toneBurst(
      this.jitterTime(t, 0.001),
      this.appliedRandomVariation(0.06),
      this.appliedRandomVariation(0.04),
      "sine",
      this.appliedRandomVariation(130),
      this.appliedRandomVariation(80),
    );
  }

  private playSnapSound(t: number) {
    this.noiseBurst(
      t,
      this.appliedRandomVariation(0.004),
      this.appliedRandomVariation(0.35),
      "highpass",
      this.appliedRandomVariation(5000),
      this.appliedRandomVariation(0.5),
    );
    this.noiseBurst(
      t + 0.001,
      this.appliedRandomVariation(0.018),
      this.appliedRandomVariation(0.22),
      "bandpass",
      this.appliedRandomVariation(1800),
      this.appliedRandomVariation(1.1),
    );
    this.toneBurst(
      this.jitterTime(t, 0.0005),
      this.appliedRandomVariation(0.055),
      this.appliedRandomVariation(0.11),
      "triangle",
      this.appliedRandomVariation(380),
      this.appliedRandomVariation(160),
    );
    this.noiseBurst(
      t + 0.012,
      this.appliedRandomVariation(0.022),
      this.appliedRandomVariation(0.09),
      "bandpass",
      this.appliedRandomVariation(1100),
      this.appliedRandomVariation(0.8),
    );
  }

  private playSpinTick(t: number, speed: number) {
    const fc = 380 + speed * 560 + (Math.random() - 0.5) * 180;
    const pk = 0.028 + speed * 0.038;
    this.noiseBurst(
      t,
      this.appliedRandomVariation(0.009),
      this.appliedRandomVariation(pk),
      "bandpass",
      fc,
      this.appliedRandomVariation(1.4),
    );
    if (Math.random() < 0.35) {
      this.toneBurst(
        this.jitterTime(t, 0.001),
        this.appliedRandomVariation(0.012),
        this.appliedRandomVariation(0.012),
        "sine",
        this.appliedRandomVariation(200 + speed * 120),
      );
    }
  }

  private playStopSound(t: number, speed: number) {
    const dur = 0.08 + speed * 0.18;
    this.noiseBurst(
      t,
      this.appliedRandomVariation(dur * 0.6),
      this.appliedRandomVariation(0.08 + speed * 0.06),
      "bandpass",
      this.appliedRandomVariation(320 + speed * 140),
      this.appliedRandomVariation(0.7),
    );
    this.toneBurst(
      this.jitterTime(t, 0.002),
      this.appliedRandomVariation(dur * 0.9),
      this.appliedRandomVariation(0.055),
      "sine",
      this.appliedRandomVariation(95 + speed * 55),
      this.appliedRandomVariation(35),
    );
    this.noiseBurst(
      t + dur * 0.3,
      this.appliedRandomVariation(dur * 0.5),
      this.appliedRandomVariation(0.035),
      "lowpass",
      this.appliedRandomVariation(180),
      this.appliedRandomVariation(0.45),
    );
    if (speed > 0.4) {
      this.noiseBurst(
        t + dur * 0.55,
        this.appliedRandomVariation(dur * 0.35),
        this.appliedRandomVariation(0.02),
        "bandpass",
        this.appliedRandomVariation(260),
        this.appliedRandomVariation(0.6),
      );
    }
  }

  // Rolling Loop Logic
  private ensureRollingLayer() {
    if (this.rollSrc || !this.ctx) return;

    this.rollSrc = this.ctx.createBufferSource();
    this.rollSrc.buffer = this.ensureRollingBuf();
    this.rollSrc.loop = true;
    this.rollSrc.playbackRate.value = 1.0;

    this.rollMidFilt = this.ctx.createBiquadFilter();
    this.rollMidFilt.type = "bandpass";
    this.rollMidFilt.frequency.value = 620;
    this.rollMidFilt.Q.value = 0.48;

    this.rollHiFilt = this.ctx.createBiquadFilter();
    this.rollHiFilt.type = "highshelf";
    this.rollHiFilt.frequency.value = 1800;
    this.rollHiFilt.gain.value = -2;

    this.rollShaper = this.ctx.createWaveShaper();
    this.rollShaper.curve = this.makeShaperCurve(5);
    this.rollShaper.oversample = "2x";

    this.rollGain = this.ctx.createGain();
    this.rollGain.gain.value = 0.0001;

    this.rollSrc.connect(this.rollMidFilt);
    this.rollMidFilt.connect(this.rollHiFilt);
    this.rollHiFilt.connect(this.rollShaper);
    this.rollShaper.connect(this.rollGain);
    this.rollGain.connect(this.out());

    this.rollSrc.start();
  }

  private setRollLevel(
    level: number,
    rampSec: number,
    speed: number,
    intensity: number,
  ) {
    if (!this.rollGain || !this.rollMidFilt || !this.rollSrc || !this.ctx)
      return;
    const t = this.ctx.currentTime;
    const scaled =
      this.clamp01(level) * this.clamp01(intensity) * (0.032 + speed * 0.068);
    const gainTC = Math.max(0.01, rampSec * 0.45);
    const rateTC = Math.max(0.015, rampSec * 0.38);
    const freqTC = Math.max(0.012, rampSec * 0.35);

    this.rollGain.gain.cancelScheduledValues(t);
    this.rollGain.gain.setValueAtTime(
      Math.max(this.rollGain.gain.value, 0.0001),
      t,
    );
    this.rollGain.gain.setTargetAtTime(Math.max(0.0001, scaled), t, gainTC);

    this.rollSrc.playbackRate.cancelScheduledValues(t);
    this.rollSrc.playbackRate.setValueAtTime(
      this.rollSrc.playbackRate.value,
      t,
    );
    this.rollSrc.playbackRate.setTargetAtTime(0.5 + speed * 0.9, t, rateTC);

    this.rollMidFilt.frequency.cancelScheduledValues(t);
    this.rollMidFilt.frequency.setValueAtTime(
      this.rollMidFilt.frequency.value,
      t,
    );
    this.rollMidFilt.frequency.setTargetAtTime(360 + speed * 760, t, freqTC);
  }

  private teardownRollNodes() {
    try {
      this.rollSrc?.stop();
    } catch {}
    this.rollGain?.disconnect();
    this.rollSrc = null;
    this.rollGain = null;
    this.rollMidFilt = null;
    this.rollHiFilt = null;
    this.rollShaper = null;
  }

  // Public methods
  public touchRollingSound(speed: number, intensity: number) {
    this.lastRollTouchAt = performance.now();
    this.rollIsActive = true;
    if (this.rollFadeTimer) clearTimeout(this.rollFadeTimer);

    this.ensureRollingLayer();
    this.setRollLevel(1, 0.045 + (1 - speed) * 0.07, speed, intensity);

    const scheduleFadeCheck = (delayMs: number) => {
      this.rollFadeTimer = setTimeout(
        () => {
          const idleMs = performance.now() - this.lastRollTouchAt;
          if (this.rollIsActive && idleMs < 220) {
            scheduleFadeCheck(220 - idleMs + 20);
            return;
          }
          this.rollFadeTimer = null;
          if (!this.rollIsActive) this.setRollLevel(0, 0.18, speed, intensity);
        },
        Math.max(40, delayMs),
      );
    };
    scheduleFadeCheck(220);
  }

  public stopRollingSound(
    speed: number,
    immediate: boolean,
    intensity: number,
  ) {
    this.rollIsActive = false;
    this.lastRollTouchAt = 0;
    if (this.rollFadeTimer) {
      clearTimeout(this.rollFadeTimer);
      this.rollFadeTimer = null;
    }
    if (!this.rollGain) return;

    const fadeOut = immediate ? 0.08 : 0.2 + (1 - speed) * 0.2;
    this.setRollLevel(0, fadeOut, speed, intensity);

    setTimeout(
      () => {
        if (!this.rollIsActive) this.teardownRollNodes();
      },
      (fadeOut + 0.1) * 1000,
    );
  }

  public playSound(
    event: SoundEvent,
    config?: TamaruConfig,
    options?: SoundPlaybackOptions,
  ) {
    try {
      const c = this.getContext();
      if (!c || !this.out()) return;
      this.tryResume();

      const t = c.currentTime;
      const rollScale = this.clamp01(config?.rollSoundLevel ?? 1);
      const speed = this.normSpeed(options?.speed);

      if (event === "spin") {
        this.touchRollingSound(speed, rollScale);
        const minGap = SPIN_MIN_INTERVAL_MS + (1 - speed) * 18;
        if (performance.now() - this.lastSpinAt < minGap) return;
        this.lastSpinAt = performance.now();
      }

      switch (event) {
        case "grab":
          this.playGrabSound(t);
          break;
        case "release":
          this.playReleaseSound(t);
          this.stopRollingSound(speed, true, rollScale);
          break;
        case "snap":
          this.playSnapSound(t);
          break;
        case "spin":
          this.playSpinTick(t, speed);
          break;
        case "stop":
          this.playStopSound(t, speed);
          this.stopRollingSound(speed, false, rollScale);
          break;
      }
    } catch {
      // Keep UI functional when audio is unsupported or blocked.
    }
  }
}

const engine = new AudioEngine();

export function playSound(
  event: SoundEvent,
  config?: TamaruConfig,
  options?: SoundPlaybackOptions,
) {
  engine.playSound(event, config, options);
}

export function feedback(
  event: "grab" | "release" | "snap" | "spin" | "stop",
  config: TamaruConfig,
  options?: SoundPlaybackOptions,
) {
  if (config.sound) playSound(event, config, options);
  if (config.haptics) triggerHaptic(event);
}
