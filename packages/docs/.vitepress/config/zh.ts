import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue To Counter",
  description: "像老虎机一样的滚动字符串，数字和时间",
  lang: "zh-CN",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "指南", link: "/guide/what-is-vue-to-counter" },
      { text: "参考", link: "/reference/api" },
    ],

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
              { text: "简单的滚动效果", link: "examples/simple-usage" },
              { text: "本地化", link: "examples/locale-usage" },
              { text: "自定义样式", link: "examples/styled-usage" },
              { text: "自定义动画", link: "examples/animated-usage" },
              {
                collapsed: true,
                text: "更多示例",
                items: [
                  {
                    text: "炉石传说排队界面",
                    link: "examples/hearthstone-queue",
                  },
                  {
                    text: "Vue To Counter Logo",
                    link: "examples/logo",
                  },
                ],
              },
            ],
          },
          {
            collapsed: false,
            text: "进阶",
            items: [
              { text: "限制及如何解决", link: "optional-dependencies" },
              { text: "深入 VueToCounter", link: "vue-to-counter-in-depth" },
            ],
          },
        ],
      },
      "/reference/": {
        base: "/reference/",
        items: [
          {
            collapsed: false,
            text: "组件 API",
            link: "api",
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
