import defaultTheme from "../themes/default.json";
import aquaTheme from "../themes/aqua.json";
import redTheme from "../themes/red.json";
import glossyTheme from "../themes/glossy.json";
import metalTheme from "../themes/metal.json";
import neonTheme from "../themes/neon.json";
import sunsetTheme from "../themes/sunset.json";

export const themes = {
  default: defaultTheme,
  aqua: aquaTheme,
  red: redTheme,
  glossy: glossyTheme,
  metal: metalTheme,
  neon: neonTheme,
  sunset: sunsetTheme,
};

export type ThemeName = keyof typeof themes;

export function updateTexture(texture: HTMLElement, x: number, y: number) {
  texture.style.backgroundPosition = `${x}px ${y}px`;
}
