import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs', 'esm', 'iife'],
  globalName: 'Tamaru',
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  loader: {
    '.css': 'text'
  },
  // Bundle all packages (regex matches everything)
  noExternal: [/.*/],
});
