import { mainLogger } from "./logger";
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
let lastPointerSpinFeedbackAt = 0;
let cleanupVisibilityHandlers: (() => void) | null = null;

function applyThemeVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    if (key === "name" || key === "author" || key === "desc") return;
    root.style.setProperty(`--vt-${key}`, value as string);
  });
}

export function initVirtualTrackball(config?: TamaruConfig): void {
  if (tamaruContainer) {
    mainLogger.warn("Init called but Tamaru is already mounted. Aborting.");
    return; // already mounted
  }

  mainLogger.info("Initializing Tamaru...", { state: { config } });
  tamaruConfig = { ...DEFAULT_CONFIG, ...config };
  // Apply theme
  const themeVars = {
    ...(themes[tamaruConfig.theme] || themes["default"]),
    ...tamaruConfig.customTheme,
  };
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
    const pos = doSnapToEdge(
      container,
      currentLeft,
      currentTop,
      (ev: "snap") => feedback(ev, tamaruConfig!),
      tamaruConfig!.snapDistance,
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

  const setWidgetSize = (sizePx: number) => {
    container.style.width = sizePx + "px";
    container.style.height = sizePx + "px";
    trackballArea.style.width = sizePx + "px";
    trackballArea.style.height = sizePx + "px";
  };

  const applyMiniState = (mini: boolean) => {
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
      (dx, dy) =>
        doScroll(
          dx,
          dy,
          tamaruConfig!.scrollMode,
          container,
          tamaruConfig!.scrollFallback,
          tamaruConfig!.scrollFallbackContainer,
        ),
      updateTextureHandler,
      tamaruConfig!.sensitivity,
    );
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
    const speed = Math.hypot(dx, dy);
    if (speed > 10) {
      const now = performance.now();
      if (now - lastPointerSpinFeedbackAt >= 85) {
        lastPointerSpinFeedbackAt = now;
        feedback("spin", tamaruConfig!, { speed });
      }
    }
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
    (event: string, speed?: number) =>
      feedback(event as any, tamaruConfig!, { speed }),
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

  const controls = container.querySelector("#vt-controls") as HTMLElement;
  let controlsHideTimeout: ReturnType<typeof setTimeout> | null = null;
  trackballArea.addEventListener("mouseenter", () => {
    controlsHideTimeout = showControls(
      controls,
      controlsHideTimeout,
      setControlsVisible,
    );
  });
  trackballArea.addEventListener("mouseleave", () => {
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
export function updateVirtualTrackballConfig(
  newConfig: Partial<TamaruConfig>,
): void {
  if (!tamaruContainer || !tamaruConfig) {
    mainLogger.warn("Failed to update config: Widget not initialized.");
    return;
  }
  mainLogger.debug("Updating config", { state: { newConfig } });
  Object.assign(tamaruConfig, newConfig);

  // Reapply theme if changed
  if (newConfig.theme || newConfig.customTheme) {
    const themeVars = {
      ...(themes[tamaruConfig.theme] || themes["default"]),
      ...tamaruConfig.customTheme,
    };
    applyThemeVars(themeVars);
  }

  // Update state-driven values
  if (tamaruState) {
    if (typeof newConfig.friction === "number")
      tamaruState.friction = tamaruConfig.friction;
  }

  // Update container size if changed
  if (typeof newConfig.size === "number") {
    const size = tamaruConfig.size;
    tamaruContainer.style.width = size + "px";
    tamaruContainer.style.height = size + "px";
    const trackballArea = tamaruContainer.querySelector(
      "#vt-trackball-area",
    ) as HTMLElement | null;
    if (trackballArea) {
      trackballArea.style.width = size + "px";
      trackballArea.style.height = size + "px";
    }
    const sphere = tamaruContainer.querySelector(
      "#vt-sphere",
    ) as HTMLElement | null;
    if (sphere) {
      const inner = Math.max(0, size - 20);
      sphere.style.width = inner + "px";
      sphere.style.height = inner + "px";
    }
    // If widget currently in mini mode, adjust mini sizing to remain proportional
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

// destroy
export function destroyVirtualTrackball(): void {
  if (!tamaruContainer) {
    mainLogger.warn("Destroy called but no widget is active");
    return;
  }
  mainLogger.info("Destroying widget");
  cleanupVisibilityHandlers?.();
  // Stop animation
  if (tamaruAnimationFrame !== null) {
    cancelAnimationFrame(tamaruAnimationFrame);
    tamaruAnimationFrame = null;
  }
  // Remove DOM
  tamaruContainer.remove();
  tamaruContainer = null;
  const styleTag = document.getElementById("vt-styles");
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
