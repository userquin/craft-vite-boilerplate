import { defineConfig, loadEnv } from 'vite';
import viteRestart from 'vite-plugin-restart';
import craftPartials from './vite-plugin-craft-partials.js';
import sassGlobImports from 'vite-plugin-sass-glob-import';

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    base: command === 'serve' ? '' : '/dist/',
    publicDir: './web/dist',
    server: {
      port: process.env.VITE_DEV_PORT || 3000,
    },
    build: {
      emptyOutDir: true,
      manifest: true,
      outDir: './web/dist/',
      rollupOptions: {
        input: './src/entry.html',
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
