//#region src/types.d.ts
type TamaruTheme = "default" | "aqua" | "red" | "glossy" | "metal" | "neon" | "sunset";
type TamaruScrollMode = "page" | "nearest" | "horizontal" | "momentum";
interface TamaruConfig {
  sound?: boolean;
  rollSoundLevel?: number;
  haptics?: boolean;
  theme?: TamaruTheme;
  customTheme?: Record<string, string>;
  scrollMode?: TamaruScrollMode;
  scrollFallback?: "document" | "none" | "container";
  scrollFallbackContainer?: string;
  friction?: number;
  sensitivity?: number;
  snapDistance?: number;
  size?: number;
  startMinimized?: boolean;
  stickMode?: boolean;
  stickModeTargetCycleKey?: "Shift" | "Alt" | "Control" | "Meta" | "None";
  stickModeCycleSnap?: boolean;
}
//#endregion
//#region src/main.d.ts
export declare function initVirtualTrackball(config?: TamaruConfig): void;
export declare function updateVirtualTrackballConfig(newConfig: Partial<TamaruConfig>): void;
export declare function destroyVirtualTrackball(): void;
export declare function hideVirtualTrackball(): void;
//#endregion
//# sourceMappingURL=main.d.cts.map