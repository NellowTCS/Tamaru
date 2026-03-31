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
    background-color: #0b3d6e;
}

#vt-texture {
    position: absolute;
    top: -50px;
    left: -50px;
    right: -50px;
    bottom: -50px;
    background-color: #1e5ba3;
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
    background: radial-gradient(circle at 30px 30px, rgba(255, 255, 255, 0.5) 0%, transparent 50%, rgba(0, 0, 0, 0.8) 100%);
    box-shadow: inset -10px -10px 20px rgba(0, 0, 0, 0.9), inset 0 0 10px rgba(0, 0, 0, 0.5), inset 5px 5px 10px rgba(255, 255, 255, 0.2);
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
    background: radial-gradient(circle at 30% 30%, #5cabff, #0b3d6e);
    border-radius: 50%;
    box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.5);
}

#vt-widget-container.vt-mini #vt-mini-icon {
    display: block;
}`;

// src/dom.ts
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
function applyMovement(state, dx, dy, scrollCallback, updateTexture) {
  const scrollSensitivity = 1.8;
  scrollCallback(-dx * scrollSensitivity, -dy * scrollSensitivity);
  state.texPosX += dx * 1.5;
  state.texPosY += dy * 1.5;
  updateTexture(Math.round(state.texPosX), Math.round(state.texPosY));
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

// src/scrollUtil.ts
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
function doScroll(dx, dy, mode, target) {
  const scrollable = findNearestScrollable(target);
  switch (mode) {
    case "page":
      window.scrollBy({ left: dx, top: dy, behavior: "auto" });
      break;
    case "nearest":
      if (scrollable) {
        scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
      }
      break;
    case "horizontal":
      if (scrollable) {
        scrollable.scrollBy({ left: dx, top: 0, behavior: "auto" });
      }
      break;
    case "momentum":
      if (scrollable) {
        scrollable.scrollBy({ left: dx * 2, top: dy * 2, behavior: "smooth" });
      }
      break;
    default:
      if (scrollable) {
        scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
      }
  }
}

// src/sound.ts
function playSound(event) {
}

// src/haptics.ts
function triggerHaptic(event) {
}

// src/main.ts
function applyThemeVars(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    if (key === "name" || key === "author" || key === "desc") return;
    root.style.setProperty(
      `--vt-${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`,
      value
    );
  });
}
function initVirtualTrackball(config) {
  if (document.getElementById("vt-widget-container")) return;
  const merged = { ...DEFAULT_CONFIG, ...config };
  const themeVars = themes[merged.theme] || themes["default"];
  applyThemeVars(themeVars);
  injectStyleTag(styles_default);
  const container = createWidgetContainer();
  document.body.appendChild(container);
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
    feedback("grab");
  });
  dragHandle.addEventListener("pointermove", (e) => {
    if (!isWidgetDragging) return;
    currentLeft = startLeft + (e.clientX - startMouseX);
    currentTop = startTop + (e.clientY - startMouseY);
    container.style.left = currentLeft + "px";
    container.style.top = currentTop + "px";
  });
  function doSnapToEdge() {
    const rect = container.getBoundingClientRect();
    const pos = snapToEdge(
      currentLeft,
      currentTop,
      rect,
      window.innerWidth,
      window.innerHeight
    );
    currentLeft = pos.left;
    currentTop = pos.top;
    container.style.left = currentLeft + "px";
    container.style.top = currentTop + "px";
    doSnapToEdge();
    feedback("snap");
  }
  dragHandle.addEventListener("pointerup", (e) => {
    isWidgetDragging = false;
    container.classList.remove("is-dragging");
    dragHandle.releasePointerCapture(e.pointerId);
    doSnapToEdge();
    feedback("release");
  });
  window.addEventListener("resize", doSnapToEdge);
  const toggleBtn = container.querySelector("#vt-toggle-btn");
  const trackballArea = container.querySelector(
    "#vt-trackball-area"
  );
  toggleBtn.addEventListener("click", () => {
    container.classList.toggle("vt-mini");
    toggleBtn.textContent = container.classList.contains("vt-mini") ? "+" : "-";
    doSnapToEdge();
  });
  trackballArea.addEventListener("click", () => {
    if (container.classList.contains("vt-mini")) {
      container.classList.remove("vt-mini");
      toggleBtn.textContent = "-";
      doSnapToEdge();
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
  function updateTexture(x, y) {
    texture.style.backgroundPosition = `${x}px ${y}px`;
  }
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
    applyMovement(state, dx, dy, (dx2, dy2) => doScroll(dx2, dy2, merged.scrollMode, container), updateTexture);
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) feedback("spin");
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
  function physicsLoop() {
    if (!isTrackballDragging) {
      updatePhysics(
        state,
        (dx, dy) => applyMovement(state, dx, dy, (dx2, dy2) => doScroll(dx2, dy2, merged.scrollMode, container), updateTexture)
      );
      if (state.velX === 0 && state.velY === 0) feedback("stop");
    }
    requestAnimationFrame(physicsLoop);
  }
  requestAnimationFrame(physicsLoop);
  const controls = container.querySelector("#vt-controls");
  let controlsHideTimeout = null;
  function setControlsVisible(visible) {
    if (visible) {
      controls.classList.add("vt-controls-visible");
    } else {
      controls.classList.remove("vt-controls-visible");
    }
  }
  function showControls() {
    if (controlsHideTimeout) {
      clearTimeout(controlsHideTimeout);
      controlsHideTimeout = null;
    }
    setControlsVisible(true);
  }
  function hideControlsWithDelay() {
    if (controlsHideTimeout) clearTimeout(controlsHideTimeout);
    controlsHideTimeout = setTimeout(() => {
      if (!container.matches(":hover") && !controls.matches(":hover")) {
        setControlsVisible(false);
      }
    }, 350);
  }
  container.addEventListener("mouseenter", showControls);
  container.addEventListener("mouseleave", hideControlsWithDelay);
  controls.addEventListener("mouseenter", showControls);
  controls.addEventListener("mouseleave", hideControlsWithDelay);
  setControlsVisible(false);
  function feedback(event) {
    if (merged.sound) playSound(event);
    if (merged.haptics) triggerHaptic(event);
  }
}
export {
  initVirtualTrackball
};
//# sourceMappingURL=main.mjs.map