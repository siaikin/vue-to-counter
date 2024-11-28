import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue To Timer",
  description: "A Vue Countdown Component",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "Introduction",
        items: [
          {
            text: "What VueToCounter did?",
            link: "/guide/introduction",
          },
          { text: "Getting Started", link: "/guide/get-started" },
        ],
      },
      {
        text: "Usage",
        items: [
          { text: "Basic Usage", link: "/guide/basic-usage" },
          // { text: "Advanced Usage", link: "/guide/advanced-usage" },
          { text: "API", link: "/guide/api" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/siaikin/vue-to-counter",
      },
    ],
  },
});
