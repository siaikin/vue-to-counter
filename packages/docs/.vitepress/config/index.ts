import { defineConfig } from "vitepress";
import { fileURLToPath } from "node:url";
import zh from "./zh";
import en from "./en";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue To Counter",

  rewrites: {
    "zh/:rest*": ":rest*",
  },

  lastUpdated: true,

  locales: {
    root: { label: "简体中文", ...zh },
    en: { label: "English", ...en },
  },
  themeConfig: {
    socialLinks: [
      { icon: "github", link: "https://github.com/siaikin/vue-to-counter" },
    ],
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPHero\.vue$/,
          replacement: fileURLToPath(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            new URL("../theme/CustomHero.vue", import.meta.url)
          ),
        },
      ],
    },
  },
});
