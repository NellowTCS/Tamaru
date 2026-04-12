import { mainLogger } from "./logger";
import styles from "../styles/styles.css";
import { createWidgetContainer, injectStyleTag } from "./domManager";
import { TrackballState, applyMovement, snapToEdge } from "./trackball";
import { TamaruConfig, DEFAULT_CONFIG } from "./types";
import { themes, updateTexture } from "./themeLoader";
import {
  doSnapToEdge,
  doScroll,
  cycleScrollableTarget,
  setStickScrollTarget,
} from "./scrollEngine";
import {
  setControlsVisible,
  showControls,
  hideControlsWithDelay,
} from "./controlsManager";
import { feedback } from "./sound";
import { createPhysicsLoop } from "./physicsEngine";
import { setupStickMode } from "./stickMode";

export class TamaruApp {
  public container: HTMLElement | null = null;
  public config: Required<TamaruConfig>;
  public state: TrackballState;

  private animationFrame: number | null = null;
  private paused = false;
  private isWidgetDragging = false;
  private isTrackballDragging = false;
  private currentLeft = 0;
  private currentTop = 0;
  private startLeft = 0;
  private startTop = 0;
  private startMouseX = 0;
  private startMouseY = 0;
  private tbPrevMouseX = 0;
  private tbPrevMouseY = 0;
  private lastPointerSpinFeedbackAt = 0;
  private controlsHideTimeout: ReturnType<typeof setTimeout> | null = null;
  private cleanupHooks: Array<() => void> = [];

  constructor(config?: TamaruConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = { texPosX: 0, texPosY: 0, velX: 0, velY: 0, friction: 0.92 };
  }

  public init() {
    if (this.container) {
      mainLogger.warn("Init called but Tamaru is already mounted. Aborting.");
      return;
    }
    mainLogger.info("Initializing Tamaru...", {
      state: { config: this.config },
    });
    this.applyTheme();
    injectStyleTag(styles as unknown as string);
    this.container = createWidgetContainer();
    document.body.appendChild(this.container);

    this.currentLeft = window.innerWidth - 120 - 24;
    this.currentTop = window.innerHeight - 120 - 24;
    this.updatePosition();

    this.bindWidgetDragging();
    this.bindMiniToggle();
    this.bindTrackball();
    this.bindStickMode();
    this.bindVisibility();

    const physicsLoop = createPhysicsLoop(
      this.state,
      () => this.isTrackballDragging,
      () => this.paused,
      applyMovement,
      (x: number, y: number) => this.updateTextureHandler(x, y),
      this.config,
      this.container,
      (event: string, speed?: number) =>
        feedback(event as any, this.config, { speed }),
    );
    this.animationFrame = requestAnimationFrame(physicsLoop);
  }

  private applyTheme() {
    const themeVars = {
      ...(themes[this.config.theme] || themes["default"]),
      ...this.config.customTheme,
    };
    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => {
      if (key !== "name" && key !== "author" && key !== "desc")
        root.style.setProperty(`--vt-${key}`, value as string);
    });
  }

  private updatePosition() {
    if (!this.container) return;
    this.container.style.left = this.currentLeft + "px";
    this.container.style.top = this.currentTop + "px";
  }

  private snapToEdgeHandler = () => {
    if (!this.container) return;
    const pos = doSnapToEdge(
      this.container,
      this.currentLeft,
      this.currentTop,
      (ev) => feedback(ev, this.config),
      this.config.snapDistance,
    );
    this.currentLeft = pos.left;
    this.currentTop = pos.top;
  };

  private bindWidgetDragging() {
    const handle = this.container!.querySelector(
      "#vt-drag-handle",
    ) as HTMLElement;

    handle.addEventListener("pointerdown", (e) => {
      this.isWidgetDragging = true;
      this.container!.classList.add("is-dragging");
      this.startMouseX = e.clientX;
      this.startMouseY = e.clientY;
      this.startLeft = this.currentLeft;
      this.startTop = this.currentTop;
      handle.setPointerCapture(e.pointerId);
      e.stopPropagation();
      feedback("grab", this.config);
    });

    handle.addEventListener("pointermove", (e) => {
      if (!this.isWidgetDragging) return;
      this.currentLeft = this.startLeft + (e.clientX - this.startMouseX);
      this.currentTop = this.startTop + (e.clientY - this.startMouseY);
      this.updatePosition();
    });

    handle.addEventListener("pointerup", (e) => {
      this.isWidgetDragging = false;
      this.container!.classList.remove("is-dragging");
      handle.releasePointerCapture(e.pointerId);
      this.snapToEdgeHandler();
      feedback("release", this.config);
    });

    window.addEventListener("resize", this.snapToEdgeHandler);
    this.cleanupHooks.push(() =>
      window.removeEventListener("resize", this.snapToEdgeHandler),
    );
  }

  private setWidgetSize(sizePx: number) {
    if (!this.container) return;
    this.container.style.width = sizePx + "px";
    this.container.style.height = sizePx + "px";
    const trackballArea = this.container.querySelector(
      "#vt-trackball-area",
    ) as HTMLElement;
    if (trackballArea) {
      trackballArea.style.width = sizePx + "px";
      trackballArea.style.height = sizePx + "px";
    }
    const sphere = this.container.querySelector("#vt-sphere") as HTMLElement;
    if (sphere) {
      const inner = Math.max(0, sizePx - 20);
      sphere.style.width = inner + "px";
      sphere.style.height = inner + "px";
    }
  }

  private applyMiniState(mini: boolean, skipSnap = false) {
    if (!this.container) return;
    const size = this.config.size || 120;
    const targetSize = mini ? Math.max(40, Math.round(size * 0.4)) : size;
    this.container.classList.toggle("vt-mini", mini);
    const toggleBtn = this.container.querySelector(
      "#vt-toggle-btn",
    ) as HTMLElement;
    if (toggleBtn) toggleBtn.textContent = mini ? "+" : "-";
    this.setWidgetSize(targetSize);
    if (!skipSnap) this.snapToEdgeHandler();
  }

  private bindMiniToggle() {
    const toggleBtn = this.container!.querySelector(
      "#vt-toggle-btn",
    ) as HTMLElement;
    const trackballArea = this.container!.querySelector(
      "#vt-trackball-area",
    ) as HTMLElement;

    toggleBtn.addEventListener("click", () => {
      this.applyMiniState(!this.container!.classList.contains("vt-mini"));
    });

    trackballArea.addEventListener("click", () => {
      if (
        this.container!.classList.contains("vt-mini") &&
        !this.container!.classList.contains("vt-stick-mode")
      ) {
        this.applyMiniState(false);
      }
    });

    const controls = this.container!.querySelector(
      "#vt-controls",
    ) as HTMLElement;
    const hoverIn = () =>
      (this.controlsHideTimeout = showControls(
        controls,
        this.controlsHideTimeout,
        setControlsVisible,
      ));
    const hoverOut = () =>
      (this.controlsHideTimeout = hideControlsWithDelay(
        this.container!,
        controls,
        this.controlsHideTimeout,
        setControlsVisible,
      ));

    trackballArea.addEventListener("mouseenter", hoverIn);
    trackballArea.addEventListener("mouseleave", hoverOut);
    controls.addEventListener("mouseenter", hoverIn);
    controls.addEventListener("mouseleave", hoverOut);
    setControlsVisible(controls, false);
  }

  private updateTextureHandler(x: number, y: number) {
    if (!this.container) return;
    const texture = this.container.querySelector("#vt-texture") as HTMLElement;
    updateTexture(texture, x, y);
  }

  private bindTrackball() {
    const viewport = this.container!.querySelector(
      "#vt-viewport",
    ) as HTMLElement;

    viewport.addEventListener("pointerdown", (e) => {
      this.isTrackballDragging = true;
      this.tbPrevMouseX = e.clientX;
      this.tbPrevMouseY = e.clientY;
      this.state.velX = 0;
      this.state.velY = 0;
      viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener("pointermove", (e) => {
      if (!this.isTrackballDragging) return;
      const dx = e.clientX - this.tbPrevMouseX;
      const dy = e.clientY - this.tbPrevMouseY;
      this.state.velX = dx;
      this.state.velY = dy;

      applyMovement(
        this.state,
        dx,
        dy,
        (dx, dy) =>
          doScroll(
            dx,
            dy,
            this.config.scrollMode,
            this.container!,
            this.config.scrollFallback,
            this.config.scrollFallbackContainer,
          ),
        (x, y) => this.updateTextureHandler(x, y),
        this.config.sensitivity,
      );

      this.tbPrevMouseX = e.clientX;
      this.tbPrevMouseY = e.clientY;

      const speed = Math.hypot(dx, dy);
      if (speed > 10) {
        const now = performance.now();
        if (now - this.lastPointerSpinFeedbackAt >= 85) {
          this.lastPointerSpinFeedbackAt = now;
          feedback("spin", this.config, { speed });
        }
      }
    });

    viewport.addEventListener("pointerup", (e) => {
      this.isTrackballDragging = false;
      viewport.releasePointerCapture(e.pointerId);
    });

    viewport.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.state.velX += -e.deltaX * 0.2;
        this.state.velY += -e.deltaY * 0.2;
        this.state.velX = Math.max(-60, Math.min(60, this.state.velX));
        this.state.velY = Math.max(-60, Math.min(60, this.state.velY));
      },
      { passive: false },
    );
  }

  private bindStickMode() {
    const stickBtn = this.container!.querySelector(
      "#vt-stick-btn",
    ) as HTMLElement;
    const isMobileOrCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (!this.config.stickMode || isMobileOrCoarse) {
      stickBtn.style.display = "none";
    }

    let preStickLeft = 0;
    let preStickTop = 0;
    let currentStickTarget: HTMLElement | null = null;
    let lastCycleTime = 0;
    let wheelAccX = 0;
    let wheelAccY = 0;
    const CYCLE_THRESHOLD = 50;

    const cleanupStickMode = setupStickMode(stickBtn, this.container!, {
      onEnter: () => {
        preStickLeft = this.currentLeft;
        preStickTop = this.currentTop;
        const size = this.config.size || 120;
        const miniSize = Math.max(40, Math.round(size * 0.4));
        this.currentLeft = (window.innerWidth - miniSize) / 2;
        this.currentTop = (window.innerHeight - miniSize) / 2;
        this.updatePosition();
        this.applyMiniState(true, true);
        this.container!.classList.add("vt-stick-mode");
      },
      onExit: () => {
        this.currentLeft = preStickLeft;
        this.currentTop = preStickTop;
        this.updatePosition();
        this.container!.classList.remove("vt-stick-mode");
        this.applyMiniState(false, false);
        setStickScrollTarget(null);
        currentStickTarget = null;
      },
      onMove: (e: MouseEvent) => {
        if (!this.config.stickMode) return;
        this.state.velX += e.movementX * 0.5;
        this.state.velY += e.movementY * 0.5;
      },
      onWheel: (e: WheelEvent) => {
        if (!this.config.stickMode) return;
        const cycleKey = this.config.stickModeTargetCycleKey || "Shift";
        const isModifierPressed =
          (cycleKey === "Shift" && e.shiftKey) ||
          (cycleKey === "Alt" && e.altKey) ||
          (cycleKey === "Control" && e.ctrlKey) ||
          (cycleKey === "Meta" && e.metaKey) ||
          (cycleKey === "None" &&
            !e.shiftKey &&
            !e.altKey &&
            !e.ctrlKey &&
            !e.metaKey);

        if (isModifierPressed) {
          e.preventDefault();
          wheelAccX += e.deltaX;
          wheelAccY += e.deltaY;
          const now = Date.now();
          if (
            now - lastCycleTime > 300 &&
            (Math.abs(wheelAccX) > CYCLE_THRESHOLD ||
              Math.abs(wheelAccY) > CYCLE_THRESHOLD)
          ) {
            currentStickTarget = cycleScrollableTarget(
              wheelAccX,
              wheelAccY,
              currentStickTarget,
            );
            setStickScrollTarget(currentStickTarget);
            if (
              currentStickTarget &&
              this.config.stickModeCycleSnap !== false
            ) {
              currentStickTarget.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }
            lastCycleTime = now;
            wheelAccX = 0;
            wheelAccY = 0;
          }
        } else {
          wheelAccX = 0;
          wheelAccY = 0;
        }
      },
    });

    this.cleanupHooks.push(cleanupStickMode);
  }

  private stopInertiaAndRolling() {
    const speed = Math.hypot(this.state.velX || 0, this.state.velY || 0);
    this.state.velX = 0;
    this.state.velY = 0;
    if (speed > 0.05) feedback("stop", this.config, { speed });
  }

  private bindVisibility() {
    const onVisibilityChange = () => {
      if (document.hidden) this.stopInertiaAndRolling();
    };
    const onWindowBlur = () => this.stopInertiaAndRolling();

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);

    this.cleanupHooks.push(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
    });
  }

  public updateConfig(newConfig: Partial<TamaruConfig>) {
    Object.assign(this.config, newConfig);
    if (newConfig.theme || newConfig.customTheme) this.applyTheme();
    if (typeof newConfig.friction === "number")
      this.state.friction = this.config.friction;
    if (typeof newConfig.size === "number") {
      this.setWidgetSize(this.config.size);
      if (this.container!.classList.contains("vt-mini")) {
        this.setWidgetSize(Math.max(40, Math.round(this.config.size * 0.4)));
      }
      setTimeout(this.snapToEdgeHandler, 50); // Refresh snapping after size update
    }
  }

  public destroy() {
    this.cleanupHooks.forEach((hook) => hook());
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    if (this.container) this.container.remove();
    this.container = null;
    const styleTag = document.getElementById("vt-styles");
    if (styleTag) styleTag.remove();
  }

  public hide() {
    if (this.container) this.container.style.display = "none";
  }

  public show() {
    if (this.container) this.container.style.display = "flex"; // Assuming flex layout based on default styles
  }
}
