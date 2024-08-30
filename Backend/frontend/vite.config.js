import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDotenv } from 'dotenv';
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `https://exploretoronto-1.onrender.com/`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

