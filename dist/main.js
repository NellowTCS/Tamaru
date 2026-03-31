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
  sphereColor: "#e0e0e0",
  textureColor: "#bdbdbd",
  shadingLight: "rgba(255,255,255,0.8)",
  shadingDark: "rgba(0,0,0,0.5)",
  glow: "#ffffff",
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

// src/themeLoader.ts
var themes = {
  default: default_default,
  aqua: aqua_default,
  red: red_default,
  glossy: glossy_default,
  metal: metal_default
};
function updateTexture(texture, x, y) {
  texture.style.backgroundPosition = `${x}px ${y}px`;
}

// src/scrollEngine.ts
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
      const el = document.querySelector(scrollFallbackContainer);
      if (el) scrollable = el;
    } else if (scrollFallback === "document") {
      scrollable = document.scrollingElement || document.documentElement;
    } else {
      scrollable = null;
    }
  }
  if (!scrollable) return;
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
function triggerHaptic2(event) {
  const patterns = {
    grab: 40,
    release: 25,
    snap: 50,
    spin: 80,
    stop: 30
  };
  const p = patterns[event];
  if (typeof p === "number") triggerHaptic(p);
  else triggerHaptic(p[0]);
}

// src/sound.ts
function playSound(event) {
}
function feedback(event, config) {
  if (config.sound) playSound(event);
  if (config.haptics) triggerHaptic2(event);
}

// src/physicsEngine.ts
function createPhysicsLoop(state, isTrackballDragging, tamaruPaused2, applyMovement2, updateTexture2, config, container, feedback2) {
  let wasStopped = true;
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
  toggleBtn.addEventListener("click", () => {
    const isMini = !container.classList.contains("vt-mini");
    container.classList.toggle("vt-mini");
    toggleBtn.textContent = container.classList.contains("vt-mini") ? "+" : "-";
    const size = tamaruConfig ? tamaruConfig.size : 120;
    if (isMini) {
      const miniSize = Math.max(40, Math.round(size * 0.4));
      container.style.width = miniSize + "px";
      container.style.height = miniSize + "px";
      trackballArea.style.width = miniSize + "px";
      trackballArea.style.height = miniSize + "px";
    } else {
      container.style.width = size + "px";
      container.style.height = size + "px";
      trackballArea.style.width = size + "px";
      trackballArea.style.height = size + "px";
    }
    snapToEdgeHandler();
  });
  trackballArea.addEventListener("click", () => {
    if (container.classList.contains("vt-mini")) {
      container.classList.remove("vt-mini");
      toggleBtn.textContent = "-";
      snapToEdgeHandler();
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
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) feedback("spin", tamaruConfig);
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
    (event) => feedback(event, tamaruConfig)
  );
  tamaruAnimationFrame = requestAnimationFrame(physicsLoop);
  const controls = container.querySelector("#vt-controls");
  let controlsHideTimeout = null;
  container.addEventListener("mouseenter", () => {
    controlsHideTimeout = showControls(
      controls,
      controlsHideTimeout,
      setControlsVisible
    );
  });
  container.addEventListener("mouseleave", () => {
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
  if (tamaruAnimationFrame !== null) {
    cancelAnimationFrame(tamaruAnimationFrame);
    tamaruAnimationFrame = null;
  }
  tamaruContainer.remove();
  tamaruContainer = null;
  const styleTag = document.getElementById("vt-style-tag");
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