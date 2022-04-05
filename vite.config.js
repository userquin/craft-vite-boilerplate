import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import viteRestart from 'vite-plugin-restart';
import createPartials from './vite-create-partials.js';

// https://vitejs.dev/config/

export default defineConfig({
  base: '/dist/',
  build: {
    emptyOutDir: true,
    manifest: true,
    outDir: './web/dist/',
    rollupOptions: {
      input: {
        script: './src/scripts/main.js',
        styles: './src/styles/main.scss',
      },
    },
  },
  plugins: [
    createPartials(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    viteRestart({
      reload: ['./templates/**/*'],
    }),
  ],
});