export interface TrackballState {
  texPosX: number;
  texPosY: number;
  velX: number;
  velY: number;
  friction: number;
}

export function applyMovement(
  state: TrackballState,
  dx: number,
  dy: number,
  scrollCallback: (dx: number, dy: number) => void,
  updateTexture: (x: number, y: number) => void,
): void {
  const scrollSensitivity = 1.8;
  scrollCallback(-dx * scrollSensitivity, -dy * scrollSensitivity);
  state.texPosX += dx * 1.5;
  state.texPosY += dy * 1.5;
  updateTexture(Math.round(state.texPosX), Math.round(state.texPosY));
}

export function updatePhysics(
  state: TrackballState,
  movementFn: (dx: number, dy: number) => void,
): void {
  if (Math.abs(state.velX) >= 0.1 || Math.abs(state.velY) >= 0.1) {
    state.velX *= state.friction;
    state.velY *= state.friction;
    if (Math.abs(state.velX) < 0.1) state.velX = 0;
    if (Math.abs(state.velY) < 0.1) state.velY = 0;
    if (state.velX !== 0 || state.velY !== 0)
      movementFn(state.velX, state.velY);
  }
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(val, max));
}

export function snapToEdge(
  currentLeft: number,
  currentTop: number,
  containerRect: DOMRect,
  windowWidth: number,
  windowHeight: number,
  margin = 24,
  snapDist = 80,
): { left: number; top: number } {
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
