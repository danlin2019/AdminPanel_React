/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // 包含根 HTML 文件
    "./src/**/*.{js,jsx,ts,tsx,scss}", // 包含所有 JS/JSX/TS/TSX 文件
  ],
  theme: {
    extend: {
      colors: {},
      boxShadow: {
        custom: "-9px -1px 10px 8px #0000004d",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
      },
    },
    variants: {
      extend: {
        backgroundColor: ["hover"], // 啟用 hover 狀態
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ], // 可添加 Tailwind 插件
};
