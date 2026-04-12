"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  destroyVirtualTrackball: () => destroyVirtualTrackball,
  hideVirtualTrackball: () => hideVirtualTrackball,
  initVirtualTrackball: () => initVirtualTrackball,
  pauseVirtualTrackball: () => pauseVirtualTrackball,
  resumeVirtualTrackball: () => resumeVirtualTrackball,
  showVirtualTrackball: () => showVirtualTrackball,
  updateVirtualTrackballConfig: () => updateVirtualTrackballConfig
});
module.exports = __toCommonJS(main_exports);

// styles/styles.css
var styles_default = `#vt-widget-container {
    position: fixed;
    z-index: 999999;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    pointer-events: none;
    transition: left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), width 0.3s ease, height 0.3s ease;
}

#vt-widget-container.is-dragging {
    transition: width 0.3s ease, height 0.3s ease !important;
}

#vt-controls {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0px) scale(0.8);
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;
    z-index: 20;
}

#vt-trackball-area,
#vt-controls,
#vt-controls .vt-btn,
#vt-viewport,
#vt-mini-icon {
    pointer-events: auto;
}

#vt-controls.vt-controls-visible {
    opacity: 1;
    transform: translate(-50%, -36px) scale(1);
    pointer-events: auto;
}

.vt-btn {
    width: 30px;
    height: 30px;
    background: #1e293b;
    color: #fff;
    border: 1px solid #475569;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

#vt-drag-handle {
    cursor: grab;
}

#vt-drag-handle:active {
    cursor: grabbing;
}

#vt-trackball-area {
    position: relative;
    width: 120px;
    height: 120px;
    background: #1a1a1a;
    border-radius: 50%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), inset 0 2px 5px rgba(255, 255, 255, 0.1), inset 0 -2px 5px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

#vt-viewport {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    z-index: 10;
    cursor: grab;
    touch-action: none;
}

#vt-viewport:active {
    cursor: grabbing;
}

#vt-sphere {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    background-color: var(--vt-sphereColor);
}

#vt-texture {
    position: absolute;
    top: -50px;
    left: -50px;
    right: -50px;
    bottom: -50px;
    background-color: var(--vt-textureColor);
    /* I know inline SVG bad but i want to bundle everything in one file 
    and this is the only way to do it without adding extra files 
    or like vite shenanigans */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E");
    background-size: 150px 150px;
    background-position: 0px 0px;
    transition: background-position 0.1s linear;
}

#vt-shading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle at 30px 30px, var(--vt-shadingLight) 0%, transparent 50%, var(--vt-shadingDark) 100%);
    box-shadow: inset -10px -10px 20px var(--vt-shadingDark), inset 0 0 10px var(--vt-shadingDark), inset 5px 5px 10px var(--vt-shadingLight);
}

#vt-widget-container.vt-mini {
    width: 48px;
    height: 48px;
}

#vt-widget-container.vt-mini #vt-trackball-area {
    width: 48px;
    height: 48px;
    cursor: pointer;
}

#vt-widget-container.vt-mini #vt-sphere,
#vt-widget-container.vt-mini #vt-viewport {
    display: none;
}

#vt-mini-icon {
    display: none;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle at 30% 30%, var(--vt-miniIcon), var(--vt-sphereColor));
    border-radius: 50%;
    box-shadow: 0 0 8px var(--vt-glow), inset -2px -2px 4px rgba(0, 0, 0, 0.5);
}

#vt-widget-container.vt-mini #vt-mini-icon {
    display: block;
}`;

// src/domManager.ts
function createWidgetContainer() {
  const container = document.createElement("div");
  container.id = "vt-widget-container";
  container.innerHTML = `
    <div id="vt-controls">
      <div id="vt-drag-handle" class="vt-btn" title="Drag to move">\u2725</div>
      <div id="vt-toggle-btn" class="vt-btn" title="Toggle Size">-</div>
    </div>
    <div id="vt-trackball-area">
      <div id="vt-sphere">
        <div id="vt-texture"></div>
        <div id="vt-shading"></div>
      </div>
      <div id="vt-viewport"></div>
      <div id="vt-mini-icon"></div>
    </div>
  `;
  return container;
}
function injectStyleTag(styles) {
  if (!document.getElementById("vt-styles")) {
    const style = document.createElement("style");
    style.id = "vt-styles";
    style.textContent = styles;
    document.head.appendChild(style);
  }
  if (!document.getElementById("vt-scrollbar-hide")) {
    const hideStyle = document.createElement("style");
    hideStyle.id = "vt-scrollbar-hide";
    hideStyle.textContent = `
      [data-vt-hide-scrollbar="1"] {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      [data-vt-hide-scrollbar="1"]::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        display: none !important;
        background: transparent;
      }
    `;
    document.head.appendChild(hideStyle);
  }
}

// src/trackball.ts
function applyMovement(state, dx, dy, scrollCallback, updateTexture2, sensitivity = 1.8) {
  const scrollSensitivity = sensitivity;
  scrollCallback(-dx * scrollSensitivity, -dy * scrollSensitivity);
  state.texPosX += dx * 1.5;
  state.texPosY += dy * 1.5;
  updateTexture2(Math.round(state.texPosX), Math.round(state.texPosY));
}
function updatePhysics(state, movementFn) {
  if (Math.abs(state.velX) >= 0.1 || Math.abs(state.velY) >= 0.1) {
    state.velX *= state.friction;
    state.velY *= state.friction;
    if (Math.abs(state.velX) < 0.1) state.velX = 0;
    if (Math.abs(state.velY) < 0.1) state.velY = 0;
    if (state.velX !== 0 || state.velY !== 0)
      movementFn(state.velX, state.velY);
  }
}
function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}
function snapToEdge(currentLeft, currentTop, containerRect, windowWidth, windowHeight, margin = 24, snapDist = 80) {
  const maxLeft = windowWidth - containerRect.width - margin;
  const maxTop = windowHeight - containerRect.height - margin;
  let left = currentLeft;
  let top = currentTop;
  if (left < snapDist) left = margin;
  if (left > maxLeft - snapDist + margin) left = maxLeft;
  if (top < snapDist) top = margin;
  if (top > maxTop - snapDist + margin) top = maxTop;
  left = clamp(left, margin, maxLeft);
  top = clamp(top, margin, maxTop);
  return { left, top };
}

// src/types.ts
var DEFAULT_CONFIG = {
  sound: false,
  rollSoundLevel: 0.45,
  haptics: false,
  theme: "default",
  scrollMode: "page",
  scrollFallback: "document",
  scrollFallbackContainer: "",
  friction: 0.92,
  sensitivity: 1.8,
  snapDistance: 80,
  size: 120
};

// themes/default.json
var default_default = {
  name: "Default",
  author: "NellowTCS",
  desc: "Standard blue theme for Tamaru.",
  sphereColor: "#0b3d6e",
  textureColor: "#1e5ba3",
  shadingLight: "rgba(255,255,255,0.5)",
  shadingDark: "rgba(0,0,0,0.8)",
  glow: "#5cabff",
  miniIcon: "#5cabff"
};

// themes/aqua.json
var aqua_default = {
  name: "Aqua",
  author: "NellowTCS",
  desc: "Aqua (macOS-like) theme.",
  sphereColor: "#1ca9e6",
  textureColor: "#5fd0ff",
  shadingLight: "rgba(255,255,255,0.6)",
  shadingDark: "rgba(0,0,0,0.7)",
  glow: "#aefbff",
  miniIcon: "#aefbff"
};

// themes/red.json
var red_default = {
  name: "Red",
  author: "NellowTCS",
  desc: "Red accent theme.",
  sphereColor: "#b91c1c",
  textureColor: "#f87171",
  shadingLight: "rgba(255,255,255,0.5)",
  shadingDark: "rgba(0,0,0,0.8)",
  glow: "#ffb4b4",
  miniIcon: "#ffb4b4"
};

// themes/glossy.json
var glossy_default = {
  name: "Glossy",
  author: "NellowTCS",
  desc: "Glossy light theme.",
  sphereColor: "#f2f4f8",
  textureColor: "#c8d0da",
  shadingLight: "rgba(255,255,255,0.95)",
  shadingDark: "rgba(8,16,30,0.64)",
  glow: "#f8fbff",
  miniIcon: "#ffffff"
};

// themes/metal.json
var metal_default = {
  name: "Metal",
  author: "NellowTCS",
  desc: "Metallic gray theme.",
  sphereColor: "#757575",
  textureColor: "#b0b0b0",
  shadingLight: "rgba(255,255,255,0.7)",
  shadingDark: "rgba(0,0,0,0.7)",
  glow: "#e0e0e0",
  miniIcon: "#e0e0e0"
};

// themes/neon.json
var neon_default = {
  name: "Neon",
  author: "NellowTCS",
  desc: "Neon theme.",
  sphereColor: "#101a3a",
  textureColor: "#1f2e66",
  shadingLight: "rgba(120,255,250,0.72)",
  shadingDark: "rgba(1,7,23,0.92)",
  glow: "#2ffcff",
  miniIcon: "#6dff88"
};

// themes/sunset.json
var sunset_default = {
  name: "Sunset",
  author: "NellowTCS",
  desc: "Dusk and sunset theme.",
  sphereColor: "#5f2d20",
  textureColor: "#c4542d",
  shadingLight: "rgba(255,220,170,0.62)",
  shadingDark: "rgba(33,12,8,0.86)",
  glow: "#ffb46a",
  miniIcon: "#ffd4ad"
};

// src/themeLoader.ts
var themes = {
  default: default_default,
  aqua: aqua_default,
  red: red_default,
  glossy: glossy_default,
  metal: metal_default,
  neon: neon_default,
  sunset: sunset_default
};
function updateTexture(texture, x, y) {
  texture.style.backgroundPosition = `${x}px ${y}px`;
}

// src/scrollEngine.ts
function markScrollbarHidden(el) {
  if (!el) return;
  el.setAttribute("data-vt-hide-scrollbar", "1");
}
function doSnapToEdge(container, currentLeft, currentTop, feedback2, snapDistance) {
  const rect = container.getBoundingClientRect();
  const pos = snapToEdge(
    currentLeft,
    currentTop,
    rect,
    window.innerWidth,
    window.innerHeight,
    24,
    typeof snapDistance === "number" ? snapDistance : void 0
  );
  container.style.left = pos.left + "px";
  container.style.top = pos.top + "px";
  feedback2("snap");
  return pos;
}
function findNearestScrollable(el) {
  let node = el;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight) {
      return node;
    }
    if ((overflowX === "auto" || overflowX === "scroll") && node.scrollWidth > node.clientWidth) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}
function doScroll(dx, dy, mode, target, scrollFallback = "document", scrollFallbackContainer) {
  const nearest = findNearestScrollable(target);
  let scrollable = nearest;
  if (!scrollable) {
    if (scrollFallback === "container" && scrollFallbackContainer) {
      const el = document.querySelector(
        scrollFallbackContainer
      );
      if (el) scrollable = el;
    } else if (scrollFallback === "document") {
      scrollable = document.scrollingElement || document.documentElement;
    } else {
      scrollable = null;
    }
  }
  if (!scrollable) return;
  markScrollbarHidden(scrollable);
  if (scrollable === document.documentElement || scrollable === document.body) {
    markScrollbarHidden(document.documentElement);
    markScrollbarHidden(document.body);
  }
  switch (mode) {
    case "page":
      if (scrollable === document.documentElement || scrollable === document.body) {
        window.scrollBy({ left: dx, top: dy, behavior: "auto" });
      } else {
        scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
      }
      break;
    case "nearest":
      scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
      break;
    case "horizontal":
      scrollable.scrollBy({ left: dx, top: 0, behavior: "auto" });
      break;
    case "momentum":
      scrollable.scrollBy({ left: dx * 2, top: dy * 2, behavior: "smooth" });
      break;
    default:
      scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
  }
}

// src/controlsManager.ts
function setControlsVisible(controls, visible) {
  if (visible) {
    controls.classList.add("vt-controls-visible");
  } else {
    controls.classList.remove("vt-controls-visible");
  }
}
function showControls(controls, controlsHideTimeout, setControlsVisible2) {
  if (controlsHideTimeout) {
    clearTimeout(controlsHideTimeout);
    controlsHideTimeout = null;
  }
  setControlsVisible2(controls, true);
  return controlsHideTimeout;
}
function hideControlsWithDelay(container, controls, controlsHideTimeout, setControlsVisible2) {
  if (controlsHideTimeout) clearTimeout(controlsHideTimeout);
  return setTimeout(() => {
    if (!container.matches(":hover") && !controls.matches(":hover")) {
      setControlsVisible2(controls, false);
    }
  }, 350);
}

// node_modules/tactus/dist/index.mjs
var HAPTIC_ID = "___haptic-switch___";
var HAPTIC_DURATION_MS = 10;
function isIOS$1() {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return false;
  }
  const iOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOSDevice || iPadOS;
}
var inputElement = null;
var labelElement = null;
var isIOS = false;
function mount() {
  if (labelElement && inputElement) return;
  isIOS = isIOS$1();
  inputElement = document.querySelector(`#${HAPTIC_ID}`);
  labelElement = document.querySelector(
    `label[for="${HAPTIC_ID}"]`
  );
  if (inputElement && labelElement) return;
  inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = HAPTIC_ID;
  inputElement.setAttribute("switch", "");
  inputElement.style.display = "none";
  document.body.appendChild(inputElement);
  labelElement = document.createElement("label");
  labelElement.htmlFor = HAPTIC_ID;
  labelElement.style.display = "none";
  document.body.appendChild(labelElement);
}
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, {
      once: true
    });
  } else {
    mount();
  }
}
function triggerHaptic(duration = HAPTIC_DURATION_MS) {
  if (typeof window === "undefined") return;
  if (isIOS) {
    if (!inputElement || !labelElement) mount();
    labelElement?.click();
  } else {
    if (navigator?.vibrate) navigator.vibrate(duration);
    else labelElement?.click();
  }
}

// src/hapticEngine.ts
var lastHapticAt = 0;
function isIOSLike() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  return /iPad|iPhone|iPod/i.test(ua) || platform === "MacIntel" && maxTouchPoints > 1;
}
function triggerHaptic2(event) {
  if (typeof document !== "undefined" && document.hidden) return;
  const minGapMs = event === "spin" ? 120 : 35;
  const now = performance.now();
  if (now - lastHapticAt < minGapMs) return;
  lastHapticAt = now;
  const patterns = {
    grab: 40,
    release: 25,
    snap: 50,
    spin: 80,
    stop: 30
  };
  const p = patterns[event];
  const duration = typeof p === "number" ? p : p[0];
  try {
    if (!isIOSLike() && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(duration);
      return;
    }
    triggerHaptic(duration);
  } catch {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(duration);
    }
  }
}

// src/sound.ts
var audioCtx = null;
var masterGain = null;
var compressor = null;
var noiseBuf = null;
var rollingBuf = null;
var rollSrc = null;
var rollMidFilt = null;
var rollHiFilt = null;
var rollShaper = null;
var rollGain = null;
var rollFadeTimer = null;
var lastRollTouchAt = 0;
var lastSpinAt = 0;
var rollIsActive = false;
var SPIN_MIN_INTERVAL_MS = 22;
var SOUND_VAR = 0.12;
function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const w = window;
    const Ctor = globalThis.AudioContext || w.webkitAudioContext;
    if (!Ctor) return null;
    const c = new Ctor();
    audioCtx = c;
    compressor = c.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 24;
    compressor.ratio.value = 4;
    compressor.attack.value = 3e-3;
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
function r(v, amt = SOUND_VAR) {
  return v * (1 + (Math.random() - 0.5) * 2 * amt);
}
function jt(t, s = 2e-3) {
  return t + (Math.random() - 0.5) * s;
}
function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
function normSpeed(s) {
  return clamp01((s ?? 10) / 18);
}
function makeShaperCurve(amount) {
  const n = 256, curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = i * 2 / n - 1;
    curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}
function ensureNoiseBuf(c) {
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
function ensureRollingBuf(c) {
  if (rollingBuf) return rollingBuf;
  const len = Math.floor(c.sampleRate * 2.2);
  const b = c.createBuffer(1, len, c.sampleRate);
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
  const fade = Math.floor(c.sampleRate * 0.04);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    d[i] *= t;
    d[len - 1 - i] *= t;
  }
  rollingBuf = b;
  return b;
}
function env(g, t, peak, dur, atk = 3e-3) {
  g.gain.setValueAtTime(1e-4, t);
  g.gain.linearRampToValueAtTime(peak, t + atk);
  g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
}
function noiseBurst(c, t, dur, peak, ftype, freq, q = 0.9) {
  const src = c.createBufferSource();
  src.buffer = ensureNoiseBuf(c);
  const f = c.createBiquadFilter();
  f.type = ftype;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  env(g, t, peak, dur);
  src.connect(f);
  f.connect(g);
  g.connect(out());
  src.start(t);
  src.stop(t + dur + 0.02);
}
function toneBurst(c, t, dur, peak, type, f0, f1) {
  const osc = c.createOscillator(), g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t);
  if (f1 != null)
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  env(g, t, peak, dur, 4e-3);
  osc.connect(g);
  g.connect(out());
  osc.start(t);
  osc.stop(t + dur + 0.02);
}
function playGrabSound(c, t) {
  noiseBurst(c, t, r(6e-3), r(0.22), "highpass", r(3200), r(0.6));
  noiseBurst(c, t + 3e-3, r(0.045), r(0.12), "bandpass", r(680), r(0.7));
  toneBurst(c, jt(t, 1e-3), r(0.075), r(0.07), "sine", r(145), r(90));
  noiseBurst(c, t + 8e-3, r(0.06), r(0.055), "lowpass", r(280), r(0.5));
}
function playReleaseSound(c, t) {
  noiseBurst(c, t, r(5e-3), r(0.15), "highpass", r(2800), r(0.55));
  noiseBurst(c, t + 3e-3, r(0.032), r(0.085), "bandpass", r(600), r(0.65));
  toneBurst(c, jt(t, 1e-3), r(0.06), r(0.04), "sine", r(130), r(80));
}
function playSnapSound(c, t) {
  noiseBurst(c, t, r(4e-3), r(0.35), "highpass", r(5e3), r(0.5));
  noiseBurst(c, t + 1e-3, r(0.018), r(0.22), "bandpass", r(1800), r(1.1));
  toneBurst(c, jt(t, 5e-4), r(0.055), r(0.11), "triangle", r(380), r(160));
  noiseBurst(c, t + 0.012, r(0.022), r(0.09), "bandpass", r(1100), r(0.8));
}
function playSpinTick(c, t, speed) {
  const fc = 380 + speed * 560 + (Math.random() - 0.5) * 180;
  const pk = 0.028 + speed * 0.038;
  noiseBurst(c, t, r(9e-3), r(pk), "bandpass", fc, r(1.4));
  if (Math.random() < 0.35) {
    toneBurst(
      c,
      jt(t, 1e-3),
      r(0.012),
      r(0.012),
      "sine",
      r(200 + speed * 120)
    );
  }
}
function playStopSound(c, t, speed) {
  const dur = 0.08 + speed * 0.18;
  noiseBurst(
    c,
    t,
    r(dur * 0.6),
    r(0.08 + speed * 0.06),
    "bandpass",
    r(320 + speed * 140),
    r(0.7)
  );
  toneBurst(
    c,
    jt(t, 2e-3),
    r(dur * 0.9),
    r(0.055),
    "sine",
    r(95 + speed * 55),
    r(35)
  );
  noiseBurst(
    c,
    t + dur * 0.3,
    r(dur * 0.5),
    r(0.035),
    "lowpass",
    r(180),
    r(0.45)
  );
  if (speed > 0.4) {
    noiseBurst(
      c,
      t + dur * 0.55,
      r(dur * 0.35),
      r(0.02),
      "bandpass",
      r(260),
      r(0.6)
    );
  }
}
function ensureRollingLayer(c) {
  if (rollSrc) return;
  rollSrc = c.createBufferSource();
  rollSrc.buffer = ensureRollingBuf(c);
  rollSrc.loop = true;
  rollSrc.playbackRate.value = 1;
  rollMidFilt = c.createBiquadFilter();
  rollMidFilt.type = "bandpass";
  rollMidFilt.frequency.value = 620;
  rollMidFilt.Q.value = 0.48;
  rollHiFilt = c.createBiquadFilter();
  rollHiFilt.type = "highshelf";
  rollHiFilt.frequency.value = 1800;
  rollHiFilt.gain.value = -2;
  rollShaper = c.createWaveShaper();
  rollShaper.curve = makeShaperCurve(5);
  rollShaper.oversample = "2x";
  rollGain = c.createGain();
  rollGain.gain.value = 1e-4;
  rollSrc.connect(rollMidFilt);
  rollMidFilt.connect(rollHiFilt);
  rollHiFilt.connect(rollShaper);
  rollShaper.connect(rollGain);
  rollGain.connect(out());
  rollSrc.start();
}
function setRollLevel(c, level, rampSec, speed, intensity) {
  if (!rollGain || !rollMidFilt || !rollSrc) return;
  const t = c.currentTime;
  const scaled = clamp01(level) * clamp01(intensity) * (0.032 + speed * 0.068);
  const gainTC = Math.max(0.01, rampSec * 0.45);
  const rateTC = Math.max(0.015, rampSec * 0.38);
  const freqTC = Math.max(0.012, rampSec * 0.35);
  rollGain.gain.cancelScheduledValues(t);
  rollGain.gain.setValueAtTime(Math.max(rollGain.gain.value, 1e-4), t);
  rollGain.gain.setTargetAtTime(Math.max(1e-4, scaled), t, gainTC);
  rollSrc.playbackRate.cancelScheduledValues(t);
  rollSrc.playbackRate.setValueAtTime(rollSrc.playbackRate.value, t);
  rollSrc.playbackRate.setTargetAtTime(0.5 + speed * 0.9, t, rateTC);
  rollMidFilt.frequency.cancelScheduledValues(t);
  rollMidFilt.frequency.setValueAtTime(rollMidFilt.frequency.value, t);
  rollMidFilt.frequency.setTargetAtTime(360 + speed * 760, t, freqTC);
}
function touchRollingSound(c, speed, intensity) {
  lastRollTouchAt = performance.now();
  rollIsActive = true;
  if (rollFadeTimer) {
    clearTimeout(rollFadeTimer);
    rollFadeTimer = null;
  }
  ensureRollingLayer(c);
  const attackSec = 0.045 + (1 - speed) * 0.07;
  setRollLevel(c, 1, attackSec, speed, intensity);
  const idleBeforeFadeMs = 220;
  const scheduleFadeCheck = (delayMs) => {
    rollFadeTimer = setTimeout(
      () => {
        const idleMs = performance.now() - lastRollTouchAt;
        if (rollIsActive && idleMs < idleBeforeFadeMs) {
          scheduleFadeCheck(idleBeforeFadeMs - idleMs + 20);
          return;
        }
        rollFadeTimer = null;
        if (!rollIsActive) setRollLevel(c, 0, 0.18, speed, intensity);
      },
      Math.max(40, delayMs)
    );
  };
  scheduleFadeCheck(idleBeforeFadeMs);
}
function stopRollingSound(c, speed, immediate, intensity) {
  rollIsActive = false;
  lastRollTouchAt = 0;
  if (rollFadeTimer) {
    clearTimeout(rollFadeTimer);
    rollFadeTimer = null;
  }
  if (!rollGain) return;
  const fadeOut = immediate ? 0.08 : 0.2 + (1 - speed) * 0.2;
  setRollLevel(c, 0, fadeOut, speed, intensity);
  const silenceMs = (fadeOut + 0.1) * 1e3;
  setTimeout(() => {
    if (!rollIsActive) teardownRollNodes();
  }, silenceMs);
}
function teardownRollNodes() {
  try {
    rollSrc?.stop();
  } catch {
  }
  rollGain?.disconnect();
  rollSrc = null;
  rollGain = null;
  rollMidFilt = null;
  rollHiFilt = null;
  rollShaper = null;
}
function tryResumeCtx(c) {
  if (c.state === "suspended") void c.resume().catch(() => {
  });
}
function playSound(event, config, options) {
  try {
    const c = getAudioContext();
    if (!c || !out() || !masterGain) return;
    tryResumeCtx(c);
    const t = c.currentTime;
    const rollScale = clamp01(config?.rollSoundLevel ?? 1);
    const speed = normSpeed(options?.speed);
    if (event === "spin") {
      touchRollingSound(c, speed, rollScale);
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
        stopRollingSound(c, speed, true, rollScale);
        break;
      case "snap":
        playSnapSound(c, t);
        break;
      case "spin":
        playSpinTick(c, t, speed);
        break;
      case "stop":
        playStopSound(c, t, speed);
        stopRollingSound(c, speed, false, rollScale);
        break;
    }
  } catch {
  }
}
function feedback(event, config, options) {
  if (config.sound) playSound(event, config, options);
  if (config.haptics) triggerHaptic2(event);
}

// src/physicsEngine.ts
function createPhysicsLoop(state, isTrackballDragging, tamaruPaused2, applyMovement2, updateTexture2, config, container, feedback2) {
  let wasStopped = true;
  let lastSpinFeedbackAt = 0;
  function physicsLoop() {
    if (!tamaruPaused2() && !isTrackballDragging()) {
      updatePhysics(
        state,
        (dx, dy) => applyMovement2(
          state,
          dx,
          dy,
          (dx2, dy2) => doScroll(
            dx2,
            dy2,
            config.scrollMode,
            container,
            config.scrollFallback,
            config.scrollFallbackContainer
          ),
          updateTexture2,
          config.sensitivity
        )
      );
      const speed = Math.hypot(state.velX || 0, state.velY || 0);
      if (speed > 0.8) {
        const now = performance.now();
        if (now - lastSpinFeedbackAt >= 95) {
          lastSpinFeedbackAt = now;
          feedback2("spin", speed);
        }
      }
      const stopped = state.velX === 0 && state.velY === 0;
      if (stopped && !wasStopped) {
        feedback2("stop");
      }
      wasStopped = stopped;
    }
    requestAnimationFrame(physicsLoop);
  }
  return physicsLoop;
}

// src/main.ts
var tamaruContainer = null;
var tamaruAnimationFrame = null;
var tamaruPaused = false;
var tamaruConfig = null;
var tamaruState = null;
var lastPointerSpinFeedbackAt = 0;
var cleanupVisibilityHandlers = null;
function applyThemeVars(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    if (key === "name" || key === "author" || key === "desc") return;
    root.style.setProperty(`--vt-${key}`, value);
  });
}
function initVirtualTrackball(config) {
  if (tamaruContainer) return;
  tamaruConfig = { ...DEFAULT_CONFIG, ...config };
  const themeVars = themes[tamaruConfig.theme] || themes["default"];
  applyThemeVars(themeVars);
  injectStyleTag(styles_default);
  const container = createWidgetContainer();
  document.body.appendChild(container);
  tamaruContainer = container;
  let currentLeft = window.innerWidth - 120 - 24;
  let currentTop = window.innerHeight - 120 - 24;
  container.style.left = currentLeft + "px";
  container.style.top = currentTop + "px";
  const dragHandle = container.querySelector("#vt-drag-handle");
  let isWidgetDragging = false;
  let startMouseX = 0, startMouseY = 0;
  let startLeft = 0, startTop = 0;
  dragHandle.addEventListener("pointerdown", (e) => {
    isWidgetDragging = true;
    container.classList.add("is-dragging");
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startLeft = currentLeft;
    startTop = currentTop;
    dragHandle.setPointerCapture(e.pointerId);
    e.stopPropagation();
    feedback("grab", tamaruConfig);
  });
  dragHandle.addEventListener("pointermove", (e) => {
    if (!isWidgetDragging) return;
    currentLeft = startLeft + (e.clientX - startMouseX);
    currentTop = startTop + (e.clientY - startMouseY);
    container.style.left = currentLeft + "px";
    container.style.top = currentTop + "px";
  });
  const snapToEdgeHandler = () => {
    const pos = doSnapToEdge(
      container,
      currentLeft,
      currentTop,
      (ev) => feedback(ev, tamaruConfig),
      tamaruConfig.snapDistance
    );
    currentLeft = pos.left;
    currentTop = pos.top;
  };
  dragHandle.addEventListener("pointerup", (e) => {
    isWidgetDragging = false;
    container.classList.remove("is-dragging");
    dragHandle.releasePointerCapture(e.pointerId);
    snapToEdgeHandler();
    feedback("release", tamaruConfig);
  });
  window.addEventListener("resize", snapToEdgeHandler);
  const toggleBtn = container.querySelector("#vt-toggle-btn");
  const trackballArea = container.querySelector(
    "#vt-trackball-area"
  );
  const setWidgetSize = (sizePx) => {
    container.style.width = sizePx + "px";
    container.style.height = sizePx + "px";
    trackballArea.style.width = sizePx + "px";
    trackballArea.style.height = sizePx + "px";
  };
  const applyMiniState = (mini) => {
    const size = tamaruConfig ? tamaruConfig.size : 120;
    const targetSize = mini ? Math.max(40, Math.round(size * 0.4)) : size;
    container.classList.toggle("vt-mini", mini);
    toggleBtn.textContent = mini ? "+" : "-";
    setWidgetSize(targetSize);
    snapToEdgeHandler();
  };
  toggleBtn.addEventListener("click", () => {
    const nextMini = !container.classList.contains("vt-mini");
    applyMiniState(nextMini);
  });
  trackballArea.addEventListener("click", () => {
    if (container.classList.contains("vt-mini")) {
      applyMiniState(false);
    }
  });
  const viewport = container.querySelector("#vt-viewport");
  const texture = container.querySelector("#vt-texture");
  const state = {
    texPosX: 0,
    texPosY: 0,
    velX: 0,
    velY: 0,
    friction: 0.92
  };
  let isTrackballDragging = false;
  let tbPrevMouseX = 0, tbPrevMouseY = 0;
  const updateTextureHandler = (x, y) => updateTexture(texture, x, y);
  viewport.addEventListener("pointerdown", (e) => {
    isTrackballDragging = true;
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
    state.velX = 0;
    state.velY = 0;
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!isTrackballDragging) return;
    const dx = e.clientX - tbPrevMouseX;
    const dy = e.clientY - tbPrevMouseY;
    state.velX = dx;
    state.velY = dy;
    applyMovement(
      state,
      dx,
      dy,
      (dx2, dy2) => doScroll(
        dx2,
        dy2,
        tamaruConfig.scrollMode,
        container,
        tamaruConfig.scrollFallback,
        tamaruConfig.scrollFallbackContainer
      ),
      updateTextureHandler,
      tamaruConfig.sensitivity
    );
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
    const speed = Math.hypot(dx, dy);
    if (speed > 10) {
      const now = performance.now();
      if (now - lastPointerSpinFeedbackAt >= 85) {
        lastPointerSpinFeedbackAt = now;
        feedback("spin", tamaruConfig, { speed });
      }
    }
  });
  viewport.addEventListener("pointerup", (e) => {
    isTrackballDragging = false;
    viewport.releasePointerCapture(e.pointerId);
  });
  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      state.velX += -e.deltaX * 0.2;
      state.velY += -e.deltaY * 0.2;
      state.velX = Math.max(-60, Math.min(60, state.velX));
      state.velY = Math.max(-60, Math.min(60, state.velY));
    },
    { passive: false }
  );
  tamaruState = state;
  const physicsLoop = createPhysicsLoop(
    state,
    () => isTrackballDragging,
    () => tamaruPaused,
    applyMovement,
    updateTextureHandler,
    tamaruConfig,
    container,
    (event, speed) => feedback(event, tamaruConfig, { speed })
  );
  tamaruAnimationFrame = requestAnimationFrame(physicsLoop);
  const stopInertiaAndRolling = () => {
    if (!tamaruState || !tamaruConfig) return;
    const speed = Math.hypot(tamaruState.velX || 0, tamaruState.velY || 0);
    tamaruState.velX = 0;
    tamaruState.velY = 0;
    if (speed > 0.05) {
      feedback("stop", tamaruConfig, { speed });
    }
  };
  const onVisibilityChange = () => {
    if (document.hidden) stopInertiaAndRolling();
  };
  const onWindowBlur = () => {
    stopInertiaAndRolling();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("blur", onWindowBlur);
  cleanupVisibilityHandlers = () => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("blur", onWindowBlur);
    cleanupVisibilityHandlers = null;
  };
  const controls = container.querySelector("#vt-controls");
  let controlsHideTimeout = null;
  trackballArea.addEventListener("mouseenter", () => {
    controlsHideTimeout = showControls(
      controls,
      controlsHideTimeout,
      setControlsVisible
    );
  });
  trackballArea.addEventListener("mouseleave", () => {
    controlsHideTimeout = hideControlsWithDelay(
      container,
      controls,
      controlsHideTimeout,
      setControlsVisible
    );
  });
  controls.addEventListener("mouseenter", () => {
    controlsHideTimeout = showControls(
      controls,
      controlsHideTimeout,
      setControlsVisible
    );
  });
  controls.addEventListener("mouseleave", () => {
    controlsHideTimeout = hideControlsWithDelay(
      container,
      controls,
      controlsHideTimeout,
      setControlsVisible
    );
  });
  setControlsVisible(controls, false);
}
function updateVirtualTrackballConfig(newConfig) {
  if (!tamaruContainer || !tamaruConfig) return;
  Object.assign(tamaruConfig, newConfig);
  if (newConfig.theme) {
    const themeVars = themes[tamaruConfig.theme] || themes["default"];
    applyThemeVars(themeVars);
  }
  if (tamaruState) {
    if (typeof newConfig.friction === "number")
      tamaruState.friction = tamaruConfig.friction;
  }
  if (typeof newConfig.size === "number") {
    const size = tamaruConfig.size;
    tamaruContainer.style.width = size + "px";
    tamaruContainer.style.height = size + "px";
    const trackballArea = tamaruContainer.querySelector(
      "#vt-trackball-area"
    );
    if (trackballArea) {
      trackballArea.style.width = size + "px";
      trackballArea.style.height = size + "px";
    }
    const sphere = tamaruContainer.querySelector(
      "#vt-sphere"
    );
    if (sphere) {
      const inner = Math.max(0, size - 20);
      sphere.style.width = inner + "px";
      sphere.style.height = inner + "px";
    }
    if (tamaruContainer.classList.contains("vt-mini")) {
      const miniSize = Math.max(40, Math.round(size * 0.4));
      tamaruContainer.style.width = miniSize + "px";
      tamaruContainer.style.height = miniSize + "px";
      if (trackballArea) {
        trackballArea.style.width = miniSize + "px";
        trackballArea.style.height = miniSize + "px";
      }
    }
  }
}
function destroyVirtualTrackball() {
  if (!tamaruContainer) return;
  cleanupVisibilityHandlers?.();
  if (tamaruAnimationFrame !== null) {
    cancelAnimationFrame(tamaruAnimationFrame);
    tamaruAnimationFrame = null;
  }
  tamaruContainer.remove();
  tamaruContainer = null;
  const styleTag = document.getElementById("vt-styles");
  if (styleTag) styleTag.remove();
}
function hideVirtualTrackball() {
  if (tamaruContainer) tamaruContainer.style.display = "none";
}
function showVirtualTrackball() {
  if (tamaruContainer) tamaruContainer.style.display = "";
}
function pauseVirtualTrackball() {
  tamaruPaused = true;
}
function resumeVirtualTrackball() {
  tamaruPaused = false;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  destroyVirtualTrackball,
  hideVirtualTrackball,
  initVirtualTrackball,
  pauseVirtualTrackball,
  resumeVirtualTrackball,
  showVirtualTrackball,
  updateVirtualTrackballConfig
});
//# sourceMappingURL=main.js.map