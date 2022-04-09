import { defineConfig, loadEnv } from 'vite';
import viteRestart from 'vite-plugin-restart';
import craftPartials from './vite-plugin-craft-partials.js';
import sassGlobImports from 'vite-plugin-sass-glob-import';

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  
  return {
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
  };
});
