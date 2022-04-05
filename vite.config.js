import { defineConfig } from 'vite';
import viteRestart from 'vite-plugin-restart';
import craftPartials from './vite-plugin-craft-partials.js';

// https://vitejs.dev/config/

export default defineConfig({
  base: '/dist/',
  publicDir: './web/',
  build: {
    emptyOutDir: true,
    manifest: true,
    outDir: './web/dist/',
    rollupOptions: {
      input: {
        scripts: './src/scripts/main.js',
        styles: './src/styles/main.scss',
      },
    },
  },
  plugins: [
    craftPartials(),
    viteRestart({
      reload: ['./templates/**/*'],
    }),
  ],
});