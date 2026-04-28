export interface TamaruConfig {
  sound?: boolean;
  rollSoundLevel?: number;
  haptics?: boolean;
  theme?: string;
  scrollMode?: string;
  scrollFallback?: string;
  scrollFallbackContainer?: string;
  friction?: number;
  sensitivity?: number;
  snapDistance?: number;
  size?: number;
  startMinimized?: boolean;
  stickMode?: boolean;
  stickModeTargetCycleKey?: string;
  stickModeCycleSnap?: boolean;
}

export const DEFAULT_CONFIG: Required<TamaruConfig> = {
  sound: false,
  rollSoundLevel: 0.45,
  haptics: false,
  theme: "default",
  scrollMode: "page",
  scrollFallback: "document",
  scrollFallbackContainer: "",
  friction: 0.92,
  sensitivity: 1.8,
  snapDistance: 80,
  size: 120,
  startMinimized: true,
  stickMode: true,
  stickModeTargetCycleKey: "Shift",
  stickModeCycleSnap: true,
};

export const STORAGE_KEY = "tamaruConfig";
