import { defineConfig, loadEnv } from 'vite';
import viteRestart from 'vite-plugin-restart';
import { vitePluginCraftCms } from 'vite-plugin-craftcms';
import sassGlobImports from 'vite-plugin-sass-glob-import';

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    base: '/dist/',
    publicDir: './web/static',
    server: {
      port: process.env.VITE_DEV_PORT || 3000,
      host: true,
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
      vitePluginCraftCms({
        outputFile: './templates/_partials/vite.twig',
      }),
      viteRestart({
        reload: ['./templates/**/*'],
      }),
    ],
  };
});
