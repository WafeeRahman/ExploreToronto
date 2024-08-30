import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDotenv } from 'dotenv';
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `${process.env.VITE_BACKEND_URL}`,

gin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

