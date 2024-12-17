/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx,md,vue}",
    ".vitepress/**/*.{js,ts,jsx,tsx,md,vue}",
    "!.vitepress/cache/**/*",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
