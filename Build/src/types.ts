export type TamaruTheme =
  | "default"
  | "aqua"
  | "red"
  | "glossy"
  | "metal"
  | "neon"
  | "sunset";
export type TamaruScrollMode = "page" | "nearest" | "horizontal" | "momentum";
export type SoundEvent = "grab" | "release" | "snap" | "spin" | "stop";
export type HapticEvent = "grab" | "release" | "snap" | "spin" | "stop";

export interface TamaruConfig {
  sound?: boolean;
  // 0..1 intensity multiplier for continuous rolling bed sound
  rollSoundLevel?: number;
  haptics?: boolean;
  theme?: TamaruTheme;
  customTheme?: Record<string, string>;
  scrollMode?: TamaruScrollMode;
  // How to behave when no nearest scrollable ancestor is found
  // 'document' -> fall back to document scrolling (default)
  // 'none' -> do nothing when no ancestor found
  // 'container' -> use a user-specified selector in `scrollFallbackContainer`
  scrollFallback?: "document" | "none" | "container";
  // Optional selector string used when scrollFallback === 'container'
  scrollFallbackContainer?: string;
  friction?: number;
  sensitivity?: number;
  snapDistance?: number;
  size?: number;
}

export const DEFAULT_CONFIG: Required<TamaruConfig> = {
  sound: false,
  rollSoundLevel: 0.45,
  haptics: false,
  theme: "default",
  customTheme: {},
  scrollMode: "page",
  scrollFallback: "document",
  scrollFallbackContainer: "",
  friction: 0.92,
  sensitivity: 1.8,
  snapDistance: 80,
  size: 120,
};
