import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf('node_modules') > 0) {
            return 'vendor';
          }
        }
      }
    }
  },
  plugins: [
    vue()
  ],
});
