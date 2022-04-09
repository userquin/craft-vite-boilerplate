import { defineConfig } from 'vite';
import viteRestart from 'vite-plugin-restart';
import craftPartials from './vite-plugin-craft-partials.js';
import sassGlobImports from 'vite-plugin-sass-glob-import';
import { config } from 'dotenv';
config();

// https://vitejs.dev/config/

export default defineConfig({
  base: '/dist/',
  publicDir: './web/',
  server: {
    port: process.env.VITE_DEV_PORT || 3000,
  },
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
