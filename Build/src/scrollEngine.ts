import { TamaruScrollMode } from "./types";
import { snapToEdge } from "./trackball";
import { scrollLogger } from "./logger";

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

export function isElementScrollable(el: HTMLElement): boolean {
  if (el === document.body || el === document.documentElement) {
    return (
      document.body.scrollHeight > window.innerHeight ||
      document.documentElement.scrollHeight > window.innerHeight ||
      document.body.scrollWidth > window.innerWidth ||
      document.documentElement.scrollWidth > window.innerWidth
    );
  }
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  const overflowX = style.overflowX;
  if (
    (overflowY === "auto" || overflowY === "scroll") &&
    el.scrollHeight - el.clientHeight > 1
  ) {
    return true;
  }
  if (
    (overflowX === "auto" || overflowX === "scroll") &&
    el.scrollWidth - el.clientWidth > 1
  ) {
    return true;
  }
  return false;
}

let cachedScrollableElements: HTMLElement[] | null = null;
let domObserver: MutationObserver | null = null;

function clearScrollableCache() {
  cachedScrollableElements = null;
}

export function getAllScrollableElements(): HTMLElement[] {
  if (cachedScrollableElements) {
    return cachedScrollableElements;
  }

  // Set up observer on first call to invalidate cache when DOM changes
  if (!domObserver && typeof window !== "undefined") {
    domObserver = new MutationObserver(clearScrollableCache);
    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }

  const elements = document.querySelectorAll("*");
  const scrollableElements: HTMLElement[] = [];
  elements.forEach((el) => {
    if (el instanceof HTMLElement && isElementScrollable(el)) {
      scrollableElements.push(el);
    }
  });

  cachedScrollableElements = scrollableElements;
  return scrollableElements;
}

export function cycleScrollableTarget(
  dx: number,
  dy: number,
  currentTarget: HTMLElement | null,
): HTMLElement | null {
  const scrollableElements = getAllScrollableElements();
  if (scrollableElements.length === 0) return null;

  let currentIndex = scrollableElements.findIndex((el) => el === currentTarget);
  if (currentIndex === -1) {
    currentIndex = -1; // We start at -1 so the first dx/dy push lands exactly on element 0.
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      currentIndex = (currentIndex + 1) % scrollableElements.length;
    } else {
      currentIndex =
        currentIndex <= 0 ? scrollableElements.length - 1 : currentIndex - 1;
    }
  } else {
    if (dy > 0) {
      currentIndex = (currentIndex + 1) % scrollableElements.length;
    } else {
      currentIndex =
        currentIndex <= 0 ? scrollableElements.length - 1 : currentIndex - 1;
    }
  }

  const target = scrollableElements[currentIndex];
  scrollableElements.forEach((el) => {
    if (el.style) el.style.boxShadow = "";
  });
  if (target && target.style)
    target.style.boxShadow = "inset 0 0 0 2px rgba(0, 150, 255, 0.7)";

  setTimeout(() => {
    if (target && target.style) target.style.boxShadow = "";
  }, 1000);

  return target;
}

export function findNearestScrollable(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el;
  while (node && node !== document.body) {
    if (isElementScrollable(node)) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

let stickScrollTarget: HTMLElement | null = null;

export function setStickScrollTarget(target: HTMLElement | null) {
  stickScrollTarget = target;
}

export function resolveEffectiveScrollable(
  target: HTMLElement,
  scrollFallback: "document" | "none" | "container",
  scrollFallbackContainer?: string,
): HTMLElement | null {
  if (stickScrollTarget) {
    return stickScrollTarget;
  }
  const nearest = findNearestScrollable(target);
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
      scrollable = null;
    }
  }
  return scrollable;
}

export function doScroll(
  dx: number,
  dy: number,
  mode: TamaruScrollMode,
  target: HTMLElement,
  scrollFallback: "document" | "none" | "container" = "document",
  scrollFallbackContainer?: string,
): void {
  // Resolve effective element to scroll based on fallback policy
  const scrollable = resolveEffectiveScrollable(
    target,
    scrollFallback,
    scrollFallbackContainer,
  );

  if (!scrollable) {
    scrollLogger.warn("No scrollable target resolved. Aborting scroll.", {
      state: { dx, dy, mode, scrollFallback },
    });
    return; // nothing to scroll per policy
  }

  markScrollbarHidden(scrollable);
  if (scrollable === document.documentElement || scrollable === document.body) {
    markScrollbarHidden(document.documentElement as HTMLElement);
    markScrollbarHidden(document.body as HTMLElement);
  }

  scrollLogger.debug("Executing scroll", {
    state: { dx, dy, mode, target: scrollable.tagName },
  });

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
