type TamaruTheme = "default" | "aqua" | "red" | "glossy" | "metal" | "neon" | "sunset";
type TamaruScrollMode = "page" | "nearest" | "horizontal" | "momentum";
interface TamaruConfig {
    sound?: boolean;
    rollSoundLevel?: number;
    haptics?: boolean;
    theme?: TamaruTheme;
    scrollMode?: TamaruScrollMode;
    scrollFallback?: "document" | "none" | "container";
    scrollFallbackContainer?: string;
    friction?: number;
    sensitivity?: number;
    snapDistance?: number;
    size?: number;
}

declare function initVirtualTrackball(config?: TamaruConfig): void;
declare function updateVirtualTrackballConfig(newConfig: Partial<TamaruConfig>): void;
declare function destroyVirtualTrackball(): void;
declare function hideVirtualTrackball(): void;
declare function showVirtualTrackball(): void;
declare function pauseVirtualTrackball(): void;
declare function resumeVirtualTrackball(): void;

export { destroyVirtualTrackball, hideVirtualTrackball, initVirtualTrackball, pauseVirtualTrackball, resumeVirtualTrackball, showVirtualTrackball, updateVirtualTrackballConfig };
