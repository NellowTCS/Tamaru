type TamaruTheme = "default" | "aqua" | "red" | "glossy" | "metal";
type TamaruScrollMode = "page" | "nearest" | "horizontal" | "momentum";
interface TamaruConfig {
    sound?: boolean;
    haptics?: boolean;
    theme?: TamaruTheme;
    scrollMode?: TamaruScrollMode;
    friction?: number;
    sensitivity?: number;
    snapDistance?: number;
    size?: number;
}

declare function initVirtualTrackball(config?: TamaruConfig): void;
declare function destroyVirtualTrackball(): void;
declare function hideVirtualTrackball(): void;
declare function showVirtualTrackball(): void;
declare function pauseVirtualTrackball(): void;
declare function resumeVirtualTrackball(): void;

export { destroyVirtualTrackball, hideVirtualTrackball, initVirtualTrackball, pauseVirtualTrackball, resumeVirtualTrackball, showVirtualTrackball };
