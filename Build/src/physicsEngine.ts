import { updatePhysics } from "./trackball";
import { doScroll } from "./scrollEngine";
import { physicsLogger } from "./logger";

export function createPhysicsLoop(
  state: any,
  isTrackballDragging: () => boolean,
  tamaruPaused: () => boolean,
  applyMovement: Function,
  updateTexture: Function,
  config: any,
  container: HTMLElement,
  feedback: (event: string, speed?: number) => void,
) {
  let wasStopped = true;
  let lastSpinFeedbackAt = 0;
  function physicsLoop() {
    if (!tamaruPaused() && !isTrackballDragging()) {
      updatePhysics(state, (dx: number, dy: number) =>
        applyMovement(
          state,
          dx,
          dy,
          (dx: number, dy: number) =>
            doScroll(
              dx,
              dy,
              config.scrollMode,
              container,
              config.scrollFallback,
              config.scrollFallbackContainer,
            ),
          updateTexture,
          config.sensitivity,
        ),
      );

      const speed = Math.hypot(state.velX || 0, state.velY || 0);
      if (speed > 0.8) {
        const now = performance.now();
        if (now - lastSpinFeedbackAt >= 95) {
          lastSpinFeedbackAt = now;
          feedback("spin", speed);
        }
      }

      const stopped = state.velX === 0 && state.velY === 0;
      if (stopped && !wasStopped) {
        physicsLogger.debug("Physics engine stopped spinning");
        feedback("stop");
      } else if (!stopped && wasStopped) {
        physicsLogger.debug("Physics engine started spinning", {
          state: { velX: state.velX, velY: state.velY },
        });
      }
      wasStopped = stopped;
    }
    requestAnimationFrame(physicsLoop);
  }
  return physicsLoop;
}
