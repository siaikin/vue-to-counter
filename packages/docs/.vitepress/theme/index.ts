// .vitepress/theme/index.ts
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

import VueToCounter from "vue-to-counter";
import "vue-to-counter/dist/style.css";

import CustomLayout from "./CustomLayout.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(VueToCounter);
  },
  Layout: CustomLayout,
} satisfies Theme;
