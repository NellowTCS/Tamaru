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

declare function initVirtualTrackball(config?: TamaruConfig): void;
declare function updateVirtualTrackballConfig(newConfig: Partial<TamaruConfig>): void;
declare function destroyVirtualTrackball(): void;
declare function hideVirtualTrackball(): void;

export { destroyVirtualTrackball, hideVirtualTrackball, initVirtualTrackball, updateVirtualTrackballConfig };
