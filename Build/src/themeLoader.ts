import defaultTheme from "../themes/default.json";
import aquaTheme from "../themes/aqua.json";
import redTheme from "../themes/red.json";
import glossyTheme from "../themes/glossy.json";
import metalTheme from "../themes/metal.json";

export const themes = {
  default: defaultTheme,
  aqua: aquaTheme,
  red: redTheme,
  glossy: glossyTheme,
  metal: metalTheme,
};

export type ThemeName = keyof typeof themes;
