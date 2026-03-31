import styles from "../styles/styles.css";
import { createWidgetContainer, injectStyleTag } from "./dom";
import {
  TrackballState,
  applyMovement,
  updatePhysics,
  snapToEdge,
} from "./trackball";
import { TamaruConfig, DEFAULT_CONFIG } from "./types";
import { themes } from "./themeLoader";
import { findNearestScrollable, doScroll } from "./scrollUtil";
import { playSound } from "./sound";
import { triggerHaptic } from "./haptics";

type ThemeVars = (typeof themes)["default"];

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
  if (document.getElementById("vt-widget-container")) return;
  const merged = { ...DEFAULT_CONFIG, ...config };
  // Apply theme
  const themeVars = themes[merged.theme] || themes["default"];
  applyThemeVars(themeVars);
  injectStyleTag(styles as unknown as string);
  const container = createWidgetContainer();
  document.body.appendChild(container);

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
    feedback("grab");
  });

  dragHandle.addEventListener("pointermove", (e: PointerEvent) => {
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
      window.innerHeight,
    );
    currentLeft = pos.left;
    currentTop = pos.top;
    container.style.left = currentLeft + "px";
    container.style.top = currentTop + "px";
    doSnapToEdge();
    feedback("snap");
  }

  dragHandle.addEventListener("pointerup", (e: PointerEvent) => {
    isWidgetDragging = false;
    container.classList.remove("is-dragging");
    dragHandle.releasePointerCapture(e.pointerId);
    doSnapToEdge();
    feedback("release");
  });

  window.addEventListener("resize", doSnapToEdge);

  const toggleBtn = container.querySelector("#vt-toggle-btn") as HTMLElement;
  const trackballArea = container.querySelector(
    "#vt-trackball-area",
  ) as HTMLElement;

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

  function updateTexture(x: number, y: number) {
    texture.style.backgroundPosition = `${x}px ${y}px`;
  }

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
    applyMovement(state, dx, dy, (dx, dy) => doScroll(dx, dy, merged.scrollMode, container), updateTexture);
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) feedback("spin");
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

  function physicsLoop(): void {
    if (!isTrackballDragging) {
      updatePhysics(state, (dx, dy) =>
        applyMovement(state, dx, dy, (dx, dy) => doScroll(dx, dy, merged.scrollMode, container), updateTexture),
      );
      if (state.velX === 0 && state.velY === 0) feedback("stop");
    }
    requestAnimationFrame(physicsLoop);
  }
  requestAnimationFrame(physicsLoop);

  const controls = container.querySelector("#vt-controls") as HTMLElement;
  let controlsHideTimeout: ReturnType<typeof setTimeout> | null = null;

  function setControlsVisible(visible: boolean) {
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
      // Only hide if neither container nor controls are hovered
      if (!container.matches(":hover") && !controls.matches(":hover")) {
        setControlsVisible(false);
      }
    }, 350);
  }

  container.addEventListener("mouseenter", showControls);
  container.addEventListener("mouseleave", hideControlsWithDelay);
  controls.addEventListener("mouseenter", showControls);
  controls.addEventListener("mouseleave", hideControlsWithDelay);

  // Hide controls initially
  setControlsVisible(false);

  // Helper to trigger sound/haptic if enabled
  function feedback(event: "grab" | "release" | "snap" | "spin" | "stop") {
    if (merged.sound) playSound(event);
    if (merged.haptics) triggerHaptic(event);
  }
}
