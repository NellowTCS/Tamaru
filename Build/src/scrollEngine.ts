import { TamaruScrollMode } from "./types";
import { snapToEdge } from "./trackball";

function markScrollbarHidden(el: HTMLElement | null) {
  if (!el) return;
  el.setAttribute("data-vt-hide-scrollbar", "1");
}

export function doSnapToEdge(
  container: HTMLElement,
  currentLeft: number,
  currentTop: number,
  feedback: (event: "snap") => void,
  snapDistance?: number,
): { left: number; top: number } {
  const rect = container.getBoundingClientRect();
  const pos = snapToEdge(
    currentLeft,
    currentTop,
    rect,
    window.innerWidth,
    window.innerHeight,
    24,
    typeof snapDistance === "number" ? snapDistance : undefined,
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
  scrollFallback: "document" | "none" | "container" = "document",
  scrollFallbackContainer?: string,
): void {
  // Find nearest scrollable ancestor
  const nearest = findNearestScrollable(target);

  // Resolve effective element to scroll based on fallback policy
  let scrollable: HTMLElement | null = nearest;

  if (!scrollable) {
    if (scrollFallback === "container" && scrollFallbackContainer) {
      const el = document.querySelector(
        scrollFallbackContainer,
      ) as HTMLElement | null;
      if (el) scrollable = el;
    } else if (scrollFallback === "document") {
      scrollable =
        (document.scrollingElement as HTMLElement) ||
        (document.documentElement as HTMLElement);
    } else {
      scrollable = null; // 'none' -> do nothing
    }
  }

  if (!scrollable) return; // nothing to scroll per policy

  markScrollbarHidden(scrollable);
  if (
    scrollable === document.documentElement ||
    scrollable === document.body
  ) {
    markScrollbarHidden(document.documentElement as HTMLElement);
    markScrollbarHidden(document.body as HTMLElement);
  }

  switch (mode) {
    case "page":
      // Prefer window scrolling for page mode when scrolling document
      if (
        scrollable === document.documentElement ||
        scrollable === document.body
      ) {
        window.scrollBy({ left: dx, top: dy, behavior: "auto" });
      } else {
        scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
      }
      break;

    case "nearest":
      scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
      break;

    case "horizontal":
      scrollable.scrollBy({ left: dx, top: 0, behavior: "auto" });
      break;

    case "momentum":
      scrollable.scrollBy({ left: dx * 2, top: dy * 2, behavior: "smooth" });
      break;

    default:
      scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
  }
}
