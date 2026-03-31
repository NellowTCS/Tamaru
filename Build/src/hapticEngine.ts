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

  if (typeof p === "number") tactusTrigger(p);
  else tactusTrigger((p as number[])[0]);
}
