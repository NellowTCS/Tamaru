import { SoundEvent } from "./types";
import { triggerHaptic } from "./hapticEngine";
import { TamaruConfig } from "./types";

export function playSound(event: SoundEvent) {
  // TODO: Implement sound playback logic
}

export function feedback(
  event: "grab" | "release" | "snap" | "spin" | "stop",
  config: TamaruConfig,
) {
  if (config.sound) playSound(event);
  if (config.haptics) triggerHaptic(event);
}
