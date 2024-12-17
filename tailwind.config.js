/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",          // 包含根 HTML 文件
    "./src/**/*.{js,jsx,ts,tsx}", // 包含所有 JS/JSX/TS/TSX 文件
  ],
  theme: {
    extend: {}, // 可自定義主題
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ], // 可添加 Tailwind 插件
};
