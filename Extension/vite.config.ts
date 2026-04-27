import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import path from "path";

export default defineConfig({
  plugins: [crx({ manifest })],
  base: "./",
  resolve: {
    alias: {
      tamaru: path.resolve(__dirname, "../Build/dist/main.mjs"),
    },
  },
});
