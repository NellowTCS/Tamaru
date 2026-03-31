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

export { initVirtualTrackball };
