import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/AdminPanel_React/' : '/',
  define: {
    'process.env.API_BASE_URL': JSON.stringify(process.env.NODE_ENV === 'production'? '/AdminPanel_React/': '/'),
  },
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  optimizeDeps: {
    include: ['ckeditor4-react'],
  },
});
