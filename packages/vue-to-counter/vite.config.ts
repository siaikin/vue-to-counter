import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      outDir: "./dist/types",
    }),
  ],
  build: {
    target: "modules",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
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
