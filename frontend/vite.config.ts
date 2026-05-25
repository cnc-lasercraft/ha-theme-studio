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
    // HACS-Layout: Bundle landet INSIDE der custom_components, damit
    // HACS-User mit einem einzigen Repo-Clone sowohl Python-Backend
    // als auch Frontend-Bundle bekommen — kein separater npm-Build
    // im User-Install.
    outDir: '../custom_components/theme_studio/dist',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: true,
  },
});
