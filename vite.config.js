import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import legacy from "@vitejs/plugin-legacy"

// https://vite.dev/config/
export default defineConfig({
  // 開發中 還是產品路徑
  base: process.env.NODE_ENV === 'production' ? '/AdminPanel_React/' : '/',
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11"],
    })
  ],
  optimizeDeps: {
    include: ["ckeditor4-react"],
  },
});