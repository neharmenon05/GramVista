import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // change to your desired port number
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});