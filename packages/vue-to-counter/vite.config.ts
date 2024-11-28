import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: "es2015",
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue"],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        /**
         * @see https://cn.vite.dev/config/shared-options#css-preprocessoroptions
         */
        api: "modern-compiler",
      },
    },
  },
});
