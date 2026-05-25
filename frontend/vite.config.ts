import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Custom-Element-Build: liefert ein einzelnes ES-Modul, das HA als Panel laden
// kann. Lit wird mit gebundelt (HA stellt es nicht öffentlich bereit).
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'theme-studio-panel.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: true,
  },
});
