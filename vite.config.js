import { defineConfig } from 'vite';
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
    viteRestart({
      reload: ['./templates/**/*'],
    }),
  ],
});