export type TamaruTheme = "default" | "aqua" | "red" | "glossy" | "metal";
export type TamaruScrollMode = "page" | "nearest" | "horizontal" | "momentum";
export type SoundEvent = "grab" | "release" | "snap" | "spin" | "stop";
export type HapticEvent = "grab" | "release" | "snap" | "spin" | "stop";

export interface TamaruConfig {
  sound?: boolean;
  haptics?: boolean;
  theme?: TamaruTheme;
  scrollMode?: TamaruScrollMode;
  friction?: number;
  sensitivity?: number;
  snapDistance?: number;
  size?: number;
}

export const DEFAULT_CONFIG: Required<TamaruConfig> = {
  sound: false,
  haptics: false,
  theme: "default",
  scrollMode: "page",
  friction: 0.92,
  sensitivity: 1.8,
  snapDistance: 80,
  size: 120,
};
