import { HapticEvent } from "./types";
import { triggerHaptic as tactusTrigger } from "tactus";

let lastHapticAt = 0;

function isIOSLike(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  return (
    /iPad|iPhone|iPod/i.test(ua) ||
    (platform === "MacIntel" && maxTouchPoints > 1)
  );
}

export function triggerHaptic(event: HapticEvent) {
  if (typeof document !== "undefined" && document.hidden) return;

  const minGapMs = event === "spin" ? 120 : 35;
  const now = performance.now();
  if (now - lastHapticAt < minGapMs) return;
  lastHapticAt = now;

  const patterns: Record<HapticEvent, number | number[]> = {
    grab: 40,
    release: 25,
    snap: 50,
    spin: 80,
    stop: 30,
  };

  const p = patterns[event];
  const duration = typeof p === "number" ? p : (p as number[])[0];

  try {
    if (
      !isIOSLike() &&
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      navigator.vibrate(duration);
      return;
    }
    tactusTrigger(duration);
  } catch {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      navigator.vibrate(duration);
    }
  }
}
