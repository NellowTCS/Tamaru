import { stickLogger } from "./logger";
import { resumeIfNeeded } from "./sound";

export interface StickModeOptions {
  onEnter: () => void;
  onExit: () => void;
  onMove: (e: MouseEvent) => void;
  onWheel: (e: WheelEvent) => void;
}

export function setupStickMode(
  stickBtn: HTMLElement,
  container: HTMLElement,
  options: StickModeOptions,
) {
  let isPointerLocked = false;

  const onMouseMove = (e: MouseEvent) => {
    if (!isPointerLocked) return;
    options.onMove(e);
  };

  const onMouseWheel = (e: WheelEvent) => {
    if (!isPointerLocked) return;
    options.onWheel(e);
  };

  const onPointerLockChange = () => {
    if (document.pointerLockElement === container) {
      stickLogger.info("Pointer locked. Stick mode activated.");
      isPointerLocked = true;
      document.addEventListener("mousemove", onMouseMove, false);
      document.addEventListener("wheel", onMouseWheel, { passive: false });
      options.onEnter();
    } else {
      stickLogger.info("Pointer unlocked. Stick mode deactivated.");
      isPointerLocked = false;
      document.removeEventListener("mousemove", onMouseMove, false);
      document.removeEventListener("wheel", onMouseWheel, false);
      options.onExit();
    }
  };

  document.addEventListener("pointerlockchange", onPointerLockChange, false);

  stickBtn.addEventListener("click", () => {
    resumeIfNeeded();
    if (document.pointerLockElement !== container) {
      if (typeof container.requestPointerLock !== "function") {
        stickLogger.warn("Pointer lock not supported on this device/browser.");
        return;
      }
      try {
        container.requestPointerLock();
      } catch (err) {
        stickLogger.error("Failed to request pointer lock", {
          state: { error: err },
        });
      }
    } else {
      document.exitPointerLock();
    }
  });

  return () => {
    document.removeEventListener(
      "pointerlockchange",
      onPointerLockChange,
      false,
    );
    if (isPointerLocked) {
      document.exitPointerLock();
    }
  };
}
