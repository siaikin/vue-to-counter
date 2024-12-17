import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  description: "Scroll strings, numbers, dates like a slot machine",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/en/" }],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What vueToPrint did?", link: "/guide/introduction" },
          { text: "Getting Started", link: "/guide/getting-started" },
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
      {
        text: "Other",
        items: [
          {
            text: "Common Pitfalls",
            link: "https://github.com/gregnb/react-to-print#common-pitfalls",
          },
          {
            text: "FAQ",
            link: "https://github.com/gregnb/react-to-print#faq",
          },
          {
            text: "Helpful Style Tips",
            link: "https://github.com/gregnb/react-to-print#faq",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/siaikin/vue-to-print" },
    ],

    editLink: {
      pattern:
        "https://github.com/siaikin/vue-to-counter/edit/main/packages/docs/en/:path",
      text: "Edit this page on GitHub",
    },
  },
});
