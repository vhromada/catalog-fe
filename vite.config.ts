import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'framework-vendor',
              test: /node_modules[\\/]vue/,
              priority: 20,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10
            },
          ],
        }
      }
    }
  },
  plugins: [
    vue()
  ],
});
