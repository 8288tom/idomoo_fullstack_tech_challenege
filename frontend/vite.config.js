import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "${path.resolve(new URL('.', import.meta.url).pathname, 'src/sass/abstracts/_variables.scss')}";
          @import "${path.resolve(new URL('.', import.meta.url).pathname, 'src/sass/abstracts/_animations.scss')}";
          @import "${path.resolve(new URL('.', import.meta.url).pathname, 'src/sass/abstracts/_utilities.scss')}";
        `,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': 'http://backend:5172'
    }
  }
});
