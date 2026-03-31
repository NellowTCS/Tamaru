import { TamaruScrollMode } from "./types";
import { snapToEdge } from "./trackball";

export function doSnapToEdge(
  container: HTMLElement,
  currentLeft: number,
  currentTop: number,
  feedback: (event: "snap") => void,
): { left: number; top: number } {
  const rect = container.getBoundingClientRect();
  const pos = snapToEdge(
    currentLeft,
    currentTop,
    rect,
    window.innerWidth,
    window.innerHeight,
  );
  container.style.left = pos.left + "px";
  container.style.top = pos.top + "px";
  feedback("snap");
  return pos;
}

export function findNearestScrollable(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    if (
      (overflowX === "auto" || overflowX === "scroll") &&
      node.scrollWidth > node.clientWidth
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

export function doScroll(
  dx: number,
  dy: number,
  mode: TamaruScrollMode,
  target: HTMLElement,
): void {
  const scrollable = findNearestScrollable(target);

  switch (mode) {
    case "page":
      // Always scroll the window
      window.scrollBy({ left: dx, top: dy, behavior: "auto" });
      break;

    case "nearest":
      // Scroll the nearest scrollable ancestor
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
