import { HapticEvent } from "./types";
import { triggerHaptic as tactusTrigger } from "tactus";

export function triggerHaptic(event: HapticEvent) {
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
    tactusTrigger(duration);
  } catch {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(duration);
    }
  }
}
