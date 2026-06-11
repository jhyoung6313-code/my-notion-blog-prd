import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const DEV_PORT = 5173;
const API_TARGET = 'http://localhost:4000';

// /api 요청은 백엔드(4000)로 프록시 → 프론트에서는 baseURL '/api'만 쓰면 된다.
export default defineConfig({
  plugins: [react()],
  server: {
    port: DEV_PORT,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
});
