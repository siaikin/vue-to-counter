import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue To Counter",
  description: "像老虎机一样的滚动字符串，数字和时间",
  lang: "zh-CN",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "主页", link: "/" }],

    sidebar: {
      "/guide/": {
        base: "/guide/",
        items: [
          {
            collapsed: false,
            text: "简介",
            items: [
              {
                text: "VueToCounter 是什么？",
                link: "what-is-vue-to-counter",
              },
              { text: "快速开始", link: "getting-started" },
            ],
          },
          {
            collapsed: false,
            text: "示例",
            items: [
              { text: "基础", link: "examples/basic-usage" },
              { text: "高级", link: "examples/advanced-usage" },
              {
                collapsed: true,
                text: "更多示例",
                items: [
                  {
                    text: "炉石传说排队界面",
                    link: "examples/hearthstone-queue",
                  },
                ],
              },
            ],
          },
        ],
      },
    },

    editLink: {
      pattern:
        "https://github.com/siaikin/vue-to-counter/edit/main/packages/docs/:path",
      text: "在 GitHub 上编辑此页",
    },
  },
});
