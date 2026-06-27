import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs', 'esm', 'iife'],
  globalName: 'Tamaru',
  dts: true,
  sourcemap: true,
  clean: true,
  deps: {
    alwaysBundle: [/.*/],
    onlyBundle: false,
  },
});
