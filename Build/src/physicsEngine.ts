import { updatePhysics } from "./trackball";
import { doScroll } from "./scrollEngine";

export function createPhysicsLoop(
  state: any,
  isTrackballDragging: () => boolean,
  tamaruPaused: () => boolean,
  applyMovement: Function,
  updateTexture: Function,
  merged: any,
  container: HTMLElement,
  feedback: (event: string) => void,
) {
  let wasStopped = true;
  function physicsLoop() {
    if (!tamaruPaused() && !isTrackballDragging()) {
      updatePhysics(state, (dx: number, dy: number) =>
        applyMovement(
          state,
          dx,
          dy,
          (dx: number, dy: number) =>
            doScroll(dx, dy, merged.scrollMode, container),
          updateTexture,
        ),
      );
      const stopped = state.velX === 0 && state.velY === 0;
      if (stopped && !wasStopped) {
        feedback("stop");
      }
      wasStopped = stopped;
    }
    requestAnimationFrame(physicsLoop);
  }
  return physicsLoop;
}
