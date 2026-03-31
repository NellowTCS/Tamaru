import styles from "../styles/styles.css";
import { createWidgetContainer, injectStyleTag } from "./domManager";
import {
  TrackballState,
  applyMovement,
  updatePhysics,
  snapToEdge,
} from "./trackball";
import { TamaruConfig, DEFAULT_CONFIG } from "./types";
import { themes, updateTexture } from "./themeLoader";
import { findNearestScrollable, doSnapToEdge, doScroll } from "./scrollEngine";
import {
  setControlsVisible,
  showControls,
  hideControlsWithDelay,
} from "./controlsManager";
import { feedback } from "./sound";
import { createPhysicsLoop } from "./physicsEngine";

type ThemeVars = (typeof themes)["default"];

let tamaruContainer: HTMLElement | null = null;
let tamaruAnimationFrame: number | null = null;
let tamaruPaused = false;
let tamaruConfig: Required<TamaruConfig> | null = null;
let tamaruState: TrackballState | null = null;

function applyThemeVars(vars: ThemeVars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    if (key === "name" || key === "author" || key === "desc") return;
    root.style.setProperty(
      `--vt-${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`,
      value as string,
    );
  });
}

export function initVirtualTrackball(config?: TamaruConfig): void {
  if (tamaruContainer) return; // already mounted
  tamaruConfig = { ...DEFAULT_CONFIG, ...config };
  // Apply theme
  const themeVars = themes[tamaruConfig.theme] || themes["default"];
  applyThemeVars(themeVars);
  injectStyleTag(styles as unknown as string);
  const container = createWidgetContainer();
  document.body.appendChild(container);
  tamaruContainer = container;

  let currentLeft = window.innerWidth - 120 - 24;
  let currentTop = window.innerHeight - 120 - 24;
  container.style.left = currentLeft + "px";
  container.style.top = currentTop + "px";

  const dragHandle = container.querySelector("#vt-drag-handle") as HTMLElement;
  let isWidgetDragging = false;
  let startMouseX = 0,
    startMouseY = 0;
  let startLeft = 0,
    startTop = 0;

  dragHandle.addEventListener("pointerdown", (e: PointerEvent) => {
    isWidgetDragging = true;
    container.classList.add("is-dragging");
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startLeft = currentLeft;
    startTop = currentTop;
    dragHandle.setPointerCapture(e.pointerId);
    e.stopPropagation();
    feedback("grab", tamaruConfig!);
  });

  dragHandle.addEventListener("pointermove", (e: PointerEvent) => {
    if (!isWidgetDragging) return;
    currentLeft = startLeft + (e.clientX - startMouseX);
    currentTop = startTop + (e.clientY - startMouseY);
    container.style.left = currentLeft + "px";
    container.style.top = currentTop + "px";
  });

  const snapToEdgeHandler = () => {
    const pos = doSnapToEdge(container, currentLeft, currentTop, (ev: "snap") =>
      feedback(ev, tamaruConfig!),
    );
    currentLeft = pos.left;
    currentTop = pos.top;
  };

  dragHandle.addEventListener("pointerup", (e: PointerEvent) => {
    isWidgetDragging = false;
    container.classList.remove("is-dragging");
    dragHandle.releasePointerCapture(e.pointerId);
    snapToEdgeHandler();
    feedback("release", tamaruConfig!);
  });

  window.addEventListener("resize", snapToEdgeHandler);

  const toggleBtn = container.querySelector("#vt-toggle-btn") as HTMLElement;
  const trackballArea = container.querySelector(
    "#vt-trackball-area",
  ) as HTMLElement;

  toggleBtn.addEventListener("click", () => {
    container.classList.toggle("vt-mini");
    toggleBtn.textContent = container.classList.contains("vt-mini") ? "+" : "-";
    snapToEdgeHandler();
  });

  trackballArea.addEventListener("click", () => {
    if (container.classList.contains("vt-mini")) {
      container.classList.remove("vt-mini");
      toggleBtn.textContent = "-";
      snapToEdgeHandler();
    }
  });

  const viewport = container.querySelector("#vt-viewport") as HTMLElement;
  const texture = container.querySelector("#vt-texture") as HTMLElement;
  const state: TrackballState = {
    texPosX: 0,
    texPosY: 0,
    velX: 0,
    velY: 0,
    friction: 0.92,
  };
  let isTrackballDragging = false;
  let tbPrevMouseX = 0,
    tbPrevMouseY = 0;

  const updateTextureHandler = (x: number, y: number) =>
    updateTexture(texture, x, y);

  viewport.addEventListener("pointerdown", (e: PointerEvent) => {
    isTrackballDragging = true;
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
    state.velX = 0;
    state.velY = 0;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener("pointermove", (e: PointerEvent) => {
    if (!isTrackballDragging) return;
    const dx = e.clientX - tbPrevMouseX;
    const dy = e.clientY - tbPrevMouseY;
    state.velX = dx;
    state.velY = dy;
    applyMovement(
      state,
      dx,
      dy,
      (dx, dy) => doScroll(dx, dy, tamaruConfig!.scrollMode, container),
      updateTextureHandler,
    );
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) feedback("spin", tamaruConfig!);
  });

  viewport.addEventListener("pointerup", (e: PointerEvent) => {
    isTrackballDragging = false;
    viewport.releasePointerCapture(e.pointerId);
  });

  viewport.addEventListener(
    "wheel",
    (e: WheelEvent) => {
      e.preventDefault();
      state.velX += -e.deltaX * 0.2;
      state.velY += -e.deltaY * 0.2;
      state.velX = Math.max(-60, Math.min(60, state.velX));
      state.velY = Math.max(-60, Math.min(60, state.velY));
    },
    { passive: false },
  );

  tamaruState = state;
  const physicsLoop = createPhysicsLoop(
    state,
    () => isTrackballDragging,
    () => tamaruPaused,
    applyMovement,
    updateTextureHandler,
    tamaruConfig!,
    container,
    (event: string) => feedback(event as any, tamaruConfig!),
  );
  tamaruAnimationFrame = requestAnimationFrame(physicsLoop);

  const controls = container.querySelector("#vt-controls") as HTMLElement;
  let controlsHideTimeout: ReturnType<typeof setTimeout> | null = null;
  container.addEventListener("mouseenter", () => {
    controlsHideTimeout = showControls(
      controls,
      controlsHideTimeout,
      setControlsVisible,
    );
  });
  container.addEventListener("mouseleave", () => {
    controlsHideTimeout = hideControlsWithDelay(
      container,
      controls,
      controlsHideTimeout,
      setControlsVisible,
    );
  });
  controls.addEventListener("mouseenter", () => {
    controlsHideTimeout = showControls(
      controls,
      controlsHideTimeout,
      setControlsVisible,
    );
  });
  controls.addEventListener("mouseleave", () => {
    controlsHideTimeout = hideControlsWithDelay(
      container,
      controls,
      controlsHideTimeout,
      setControlsVisible,
    );
  });

  // Hide controls initially
  setControlsVisible(controls, false);

  // expose internals via module-level refs so config can be updated later
}

// Update config at runtime
export function updateVirtualTrackballConfig(newConfig: Partial<TamaruConfig>): void {
  if (!tamaruContainer || !tamaruConfig) return;
  Object.assign(tamaruConfig, newConfig);

  // Reapply theme if changed
  if (newConfig.theme) {
    const themeVars = themes[tamaruConfig.theme] || themes["default"];
    applyThemeVars(themeVars);
  }

  // Update state-driven values
  if (tamaruState) {
    if (typeof newConfig.friction === "number") tamaruState.friction = tamaruConfig.friction;
  }

  // Update container size if changed
  if (typeof newConfig.size === "number") {
    const size = tamaruConfig.size;
    tamaruContainer.style.width = size + "px";
    tamaruContainer.style.height = size + "px";
    const trackballArea = tamaruContainer.querySelector("#vt-trackball-area") as HTMLElement | null;
    if (trackballArea) {
      trackballArea.style.width = size + "px";
      trackballArea.style.height = size + "px";
    }
    const sphere = tamaruContainer.querySelector("#vt-sphere") as HTMLElement | null;
    if (sphere) {
      const inner = Math.max(0, size - 20);
      sphere.style.width = inner + "px";
      sphere.style.height = inner + "px";
    }
  }
}

// destroy
export function destroyVirtualTrackball(): void {
  if (!tamaruContainer) return;
  // Stop animation
  if (tamaruAnimationFrame !== null) {
    cancelAnimationFrame(tamaruAnimationFrame);
    tamaruAnimationFrame = null;
  }
  // Remove DOM
  tamaruContainer.remove();
  tamaruContainer = null;
  const styleTag = document.getElementById("vt-style-tag");
  if (styleTag) styleTag.remove();
}

// hide/show
export function hideVirtualTrackball(): void {
  if (tamaruContainer) tamaruContainer.style.display = "none";
}

export function showVirtualTrackball(): void {
  if (tamaruContainer) tamaruContainer.style.display = "";
}

// pause/resume
export function pauseVirtualTrackball(): void {
  tamaruPaused = true;
}

export function resumeVirtualTrackball(): void {
  tamaruPaused = false;
}
