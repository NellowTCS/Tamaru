import { SoundEvent } from "./types";
import { triggerHaptic } from "./hapticEngine";
import { TamaruConfig } from "./types";

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let compressor: DynamicsCompressorNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let rollingBuf: AudioBuffer | null = null;

let rollSrc: AudioBufferSourceNode | null = null;
let rollMidFilt: BiquadFilterNode | null = null;
let rollHiFilt: BiquadFilterNode | null = null;
let rollShaper: WaveShaperNode | null = null;
let rollGain: GainNode | null = null;
let rollFadeTimer: ReturnType<typeof setTimeout> | null = null;

let lastSpinAt = 0;
let rollIsActive = false;

const SPIN_MIN_INTERVAL_MS = 22;
const SOUND_VAR = 0.12;

type FilterType = "bandpass" | "lowpass" | "highpass" | "highshelf";
type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};
type SoundPlaybackOptions = { speed?: number };

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const w = window as WindowWithWebkitAudio;
    const Ctor = globalThis.AudioContext || w.webkitAudioContext;
    if (!Ctor) return null;
    const c = new Ctor();
    audioCtx = c;
    compressor = c.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 24;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.22;
    masterGain = c.createGain();
    masterGain.gain.value = 0.42;
    compressor.connect(masterGain);
    masterGain.connect(c.destination);
  }
  return audioCtx;
}

function out() {
  return compressor;
}
function r(v: number, amt = SOUND_VAR) {
  return v * (1 + (Math.random() - 0.5) * 2 * amt);
}
function jt(t: number, s = 0.002) {
  return t + (Math.random() - 0.5) * s;
}
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function normSpeed(s?: number) {
  return clamp01((s ?? 10) / 18);
}

function tryResume(c: AudioContext) {
  if (c.state === "suspended") void c.resume().catch(() => {});
}

function makeShaperCurve(amount: number) {
  const n = 256,
    curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function ensureNoiseBuf(c: AudioContext) {
  if (noiseBuf) return noiseBuf;
  const len = Math.floor(c.sampleRate * 0.5);
  const b = c.createBuffer(1, len, c.sampleRate);
  const d = b.getChannelData(0);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    lp = lp * 0.85 + w * 0.15;
    d[i] = w * 0.6 + lp * 0.4;
  }
  noiseBuf = b;
  return b;
}

function ensureRollingBuf(c: AudioContext) {
  if (rollingBuf) return rollingBuf;
  const len = Math.floor(c.sampleRate * 2.2);
  const b = c.createBuffer(1, len, c.sampleRate);
  const d = b.getChannelData(0);
  let lp = 0,
    hp = 0,
    prev = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    lp = lp * 0.94 + w * 0.06;
    const mid = w - lp;
    hp = 0.97 * (hp + mid - prev);
    prev = mid;
    d[i] = mid * 0.55 + hp * 0.3 + w * 0.15;
  }
  // Smooth loop seam
  const fade = Math.floor(c.sampleRate * 0.04);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    d[i] *= t;
    d[len - 1 - i] *= t;
  }
  rollingBuf = b;
  return b;
}

function env(g: GainNode, t: number, peak: number, dur: number, atk = 0.003) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}

function noiseBurst(
  c: AudioContext,
  t: number,
  dur: number,
  peak: number,
  ftype: FilterType,
  freq: number,
  q = 0.9,
) {
  const src = c.createBufferSource();
  src.buffer = ensureNoiseBuf(c);
  const f = c.createBiquadFilter();
  f.type = ftype as BiquadFilterType;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  env(g, t, peak, dur);
  src.connect(f);
  f.connect(g);
  g.connect(out()!);
  src.start(t);
  src.stop(t + dur + 0.02);
}

function toneBurst(
  c: AudioContext,
  t: number,
  dur: number,
  peak: number,
  type: OscillatorType,
  f0: number,
  f1?: number,
) {
  const osc = c.createOscillator(),
    g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t);
  if (f1 != null)
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  env(g, t, peak, dur, 0.004);
  osc.connect(g);
  g.connect(out()!);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// Per-event sounds

function playGrabSound(c: AudioContext, t: number) {
  noiseBurst(c, t, r(0.006), r(0.22), "highpass", r(3200), r(0.6));
  noiseBurst(c, t + 0.003, r(0.045), r(0.12), "bandpass", r(680), r(0.7));
  toneBurst(c, jt(t, 0.001), r(0.075), r(0.07), "sine", r(145), r(90));
  noiseBurst(c, t + 0.008, r(0.06), r(0.055), "lowpass", r(280), r(0.5));
}

function playReleaseSound(c: AudioContext, t: number) {
  noiseBurst(c, t, r(0.005), r(0.15), "highpass", r(2800), r(0.55));
  noiseBurst(c, t + 0.003, r(0.032), r(0.085), "bandpass", r(600), r(0.65));
  toneBurst(c, jt(t, 0.001), r(0.06), r(0.04), "sine", r(130), r(80));
}

function playSnapSound(c: AudioContext, t: number) {
  noiseBurst(c, t, r(0.004), r(0.35), "highpass", r(5000), r(0.5));
  noiseBurst(c, t + 0.001, r(0.018), r(0.22), "bandpass", r(1800), r(1.1));
  toneBurst(c, jt(t, 0.0005), r(0.055), r(0.11), "triangle", r(380), r(160));
  noiseBurst(c, t + 0.012, r(0.022), r(0.09), "bandpass", r(1100), r(0.8));
}

function playSpinTick(c: AudioContext, t: number, speed: number) {
  const fc = 380 + speed * 560 + (Math.random() - 0.5) * 180;
  const pk = 0.028 + speed * 0.038;
  noiseBurst(c, t, r(0.009), r(pk), "bandpass", fc, r(1.4));
  if (Math.random() < 0.35) {
    toneBurst(
      c,
      jt(t, 0.001),
      r(0.012),
      r(0.012),
      "sine",
      r(200 + speed * 120),
    );
  }
}

function playStopSound(c: AudioContext, t: number, speed: number) {
  // Inertia decay: duration scales with speed
  const dur = 0.08 + speed * 0.18;
  noiseBurst(
    c,
    t,
    r(dur * 0.6),
    r(0.08 + speed * 0.06),
    "bandpass",
    r(320 + speed * 140),
    r(0.7),
  );
  toneBurst(
    c,
    jt(t, 0.002),
    r(dur * 0.9),
    r(0.055),
    "sine",
    r(95 + speed * 55),
    r(35),
  );
  noiseBurst(
    c,
    t + dur * 0.3,
    r(dur * 0.5),
    r(0.035),
    "lowpass",
    r(180),
    r(0.45),
  );
  if (speed > 0.4) {
    // Secondary bearing settle at medium/high speed
    noiseBurst(
      c,
      t + dur * 0.55,
      r(dur * 0.35),
      r(0.02),
      "bandpass",
      r(260),
      r(0.6),
    );
  }
}

function ensureRollingLayer(c: AudioContext) {
  if (rollSrc) return;

  rollSrc = c.createBufferSource();
  rollSrc.buffer = ensureRollingBuf(c);
  rollSrc.loop = true;
  rollSrc.playbackRate.value = 1.0;

  rollMidFilt = c.createBiquadFilter();
  rollMidFilt.type = "bandpass";
  rollMidFilt.frequency.value = 800;
  rollMidFilt.Q.value = 0.6;

  rollHiFilt = c.createBiquadFilter();
  rollHiFilt.type = "highshelf";
  rollHiFilt.frequency.value = 2200;
  rollHiFilt.gain.value = 3;

  rollShaper = c.createWaveShaper();
  rollShaper.curve = makeShaperCurve(5);
  rollShaper.oversample = "2x";

  rollGain = c.createGain();
  rollGain.gain.value = 0.0001;

  rollSrc.connect(rollMidFilt);
  rollMidFilt.connect(rollHiFilt);
  rollHiFilt.connect(rollShaper);
  rollShaper.connect(rollGain);
  rollGain.connect(out()!);

  rollSrc.start();
}

function setRollLevel(
  c: AudioContext,
  level: number,
  rampSec: number,
  speed: number,
) {
  if (!rollGain || !rollMidFilt || !rollSrc) return;
  const t = c.currentTime;
  const scaled = clamp01(level) * (0.032 + speed * 0.068);

  rollGain.gain.cancelScheduledValues(t);
  rollGain.gain.setValueAtTime(Math.max(rollGain.gain.value, 0.0001), t);
  rollGain.gain.linearRampToValueAtTime(Math.max(0.0001, scaled), t + rampSec);

  rollSrc.playbackRate.cancelScheduledValues(t);
  rollSrc.playbackRate.setValueAtTime(rollSrc.playbackRate.value, t);
  rollSrc.playbackRate.linearRampToValueAtTime(0.55 + speed * 1.1, t + rampSec);

  rollMidFilt.frequency.cancelScheduledValues(t);
  rollMidFilt.frequency.setValueAtTime(rollMidFilt.frequency.value, t);
  rollMidFilt.frequency.linearRampToValueAtTime(420 + speed * 980, t + rampSec);
}

function touchRollingSound(c: AudioContext, speed: number) {
  rollIsActive = true;
  if (rollFadeTimer) {
    clearTimeout(rollFadeTimer);
    rollFadeTimer = null;
  }
  ensureRollingLayer(c);
  setRollLevel(c, 1, 0.035 + (1 - speed) * 0.045, speed);

  rollFadeTimer = setTimeout(
    () => {
      rollFadeTimer = null;
      if (!rollIsActive) setRollLevel(c, 0, 0.18, speed);
    },
    140 + Math.random() * 50,
  );
}

function stopRollingSound(c: AudioContext, speed: number, immediate: boolean) {
  rollIsActive = false;
  if (rollFadeTimer) {
    clearTimeout(rollFadeTimer);
    rollFadeTimer = null;
  }
  if (!rollGain) return;

  const fadeOut = immediate ? 0.04 : 0.18 + (1 - speed) * 0.14;
  setRollLevel(c, 0, fadeOut, speed);

  // Tear down the nodes entirely after fade
  const silenceMs = (fadeOut + 0.1) * 1000;
  setTimeout(() => {
    if (!rollIsActive) teardownRollNodes();
  }, silenceMs);
}

function teardownRollNodes() {
  try {
    rollSrc?.stop();
  } catch {}
  rollGain?.disconnect();
  rollSrc = null;
  rollGain = null;
  rollMidFilt = null;
  rollHiFilt = null;
  rollShaper = null;
}

function tryResumeCtx(c: AudioContext) {
  if (c.state === "suspended") void c.resume().catch(() => {});
}

export function playSound(
  event: SoundEvent,
  config?: TamaruConfig,
  options?: SoundPlaybackOptions,
) {
  try {
    const c = getAudioContext();
    if (!c || !out() || !masterGain) return;
    tryResumeCtx(c);
    const t = c.currentTime;
    const rollScale = clamp01(config?.rollSoundLevel ?? 1);
    const speed = normSpeed(options?.speed);

    if (event === "spin") {
      touchRollingSound(c, speed);
      const now = performance.now();
      const minGap = SPIN_MIN_INTERVAL_MS + (1 - speed) * 18;
      if (now - lastSpinAt < minGap) return;
      lastSpinAt = now;
    }

    switch (event) {
      case "grab":
        playGrabSound(c, t);
        break;
      case "release":
        playReleaseSound(c, t);
        stopRollingSound(c, speed, true);
        break;
      case "snap":
        playSnapSound(c, t);
        break;
      case "spin":
        playSpinTick(c, t, speed);
        break;
      case "stop":
        playStopSound(c, t, speed);
        stopRollingSound(c, speed, false);
        break;
    }
  } catch {
    // Keep UI functional when audio is unsupported or blocked.
  }
}

export function feedback(
  event: "grab" | "release" | "snap" | "spin" | "stop",
  config: TamaruConfig,
  options?: SoundPlaybackOptions,
) {
  if (config.sound) playSound(event, config, options);
  if (config.haptics) triggerHaptic(event);
}
