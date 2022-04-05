import legacy from '@vitejs/plugin-legacy';
import ViteRestart from 'vite-plugin-restart';
import createPartials from "./vite-create-partials.js";

// https://vitejs.dev/config/
export default ({ command }) => {
  return {
    base: command === 'serve' ? '' : '/dist/',
    build: {
      emptyOutDir: true,
      manifest: true,
      outDir: './web/dist/',
      rollupOptions: {
        input: './src/scripts/main.js',
      },
    },
    plugins: [
      createPartials(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      ViteRestart({
        reload: ['./templates/**/*'],
      }),
    ],
  };
};
