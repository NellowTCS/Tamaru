import styles from "../styles/styles.css";
import { createWidgetContainer, injectStyleTag } from "./dom";
import {
  TrackballState,
  applyMovement,
  updatePhysics,
  snapToEdge,
} from "./trackball";

export function initVirtualTrackball(): void {
  if (document.getElementById("vt-widget-container")) return;
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
  }

  dragHandle.addEventListener("pointerup", (e: PointerEvent) => {
    isWidgetDragging = false;
    container.classList.remove("is-dragging");
    dragHandle.releasePointerCapture(e.pointerId);
    doSnapToEdge();
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
    applyMovement(state, dx, dy, window.scrollBy.bind(window), updateTexture);
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
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
        applyMovement(
          state,
          dx,
          dy,
          window.scrollBy.bind(window),
          updateTexture,
        ),
      );
    }
    requestAnimationFrame(physicsLoop);
  }
  requestAnimationFrame(physicsLoop);

  const controls = container.querySelector('#vt-controls') as HTMLElement;
  let controlsHideTimeout: ReturnType<typeof setTimeout> | null = null;

  function setControlsVisible(visible: boolean) {
    if (visible) {
      controls.classList.add('vt-controls-visible');
    } else {
      controls.classList.remove('vt-controls-visible');
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
      if (!container.matches(':hover') && !controls.matches(':hover')) {
        setControlsVisible(false);
      }
    }, 350);
  }

  container.addEventListener('mouseenter', showControls);
  container.addEventListener('mouseleave', hideControlsWithDelay);
  controls.addEventListener('mouseenter', showControls);
  controls.addEventListener('mouseleave', hideControlsWithDelay);

  // Hide controls initially
  setControlsVisible(false);
}
