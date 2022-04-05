import { defineConfig } from 'vite';
import viteRestart from 'vite-plugin-restart';
import craftPartials from './vite-plugin-craft-partials.js';
import sassGlobImports from 'vite-plugin-sass-glob-import';

// https://vitejs.dev/config/

export default defineConfig({
  base: '/dist/',
  publicDir: './web/',
  build: {
    emptyOutDir: true,
    manifest: true,
    outDir: './web/dist/',
    assetsDir: './web/static/',
    rollupOptions: {
      input: {
        scripts: './src/scripts/main.js',
        styles: './src/styles/main.scss',
      },
    },
  },
  plugins: [
    sassGlobImports(),
    craftPartials(),
    viteRestart({
      reload: ['./templates/**/*'],
    }),
  ],
});
