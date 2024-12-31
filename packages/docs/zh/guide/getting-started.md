# 快速开始

## 在线尝试

可以直接在 [StackBlitz](https://stackblitz.com/edit/vitejs-vite-32bxkk?file=src%2Fcomponents%2FComponentToPrint.vue) 上在线尝试。

## 安装

### 前置准备

- [Vue.js](https://vuejs.org/) 3.x

::: code-group

```shell [npm]
$ npm install vue-to-counter --save
```

```shell [pnpm]
$ pnpm add vue-to-counter
```

```shell [yarn]
$ yarn add vue-to-counter
```

:::

::: tip 注意
VueToCounter 目前有两个可选的依赖项，考虑到它们的体积较大，所以默认情况下不会被安装。你可以根据需要手动安装它们。

- **decimal.js**: Decimal.js 提供了近乎无限制的精度，用于处理大数/高精度浮点数计算。[什么时候需要使用它](optional-dependencies.md#字符长度限制)

  ![npm bundle size](https://img.shields.io/bundlephobia/min/decimal.js?style=flat-square)

- **grapheme-splitter**: grapheme-splitter 可以正确地分割包含 emoji 的字符串。[什么时候需要使用它](optional-dependencies.md#支持-emoji-分词)

  ![npm bundle size](https://img.shields.io/bundlephobia/min/grapheme-splitter?style=flat-square)
  :::

## 注册/引入组件

### 全局注册

::: code-group

```javascript [main.js/main.ts]
import { createApp } from "vue";
import App from "./App.vue";
import VueToCounter from "vue-to-counter";

createApp(App).use(VueToCounter).mount("#app");
```

:::

### 局部引入

```vue
<script setup>
import { VueToCounter } from "vue-to-counter";
</script>

<template>
  <VueToCounter />
</template>
```

## 用法

你只需要更新数值，`VueToCounter` 会自动处理剩下的事情。

<blockquote class="text-xs">
`VueToCounter` 是这样的，你只要更新数值就可以，可 `VueToCounter` 要考虑的事情就很多了。XD
</blockquote>

下方这是一个简单的示例，`VueToCounter` 会自动响应数字的变化，并且会自动处理数字的增减动画。

<script setup>
import GettingStartedDemo from "../../components/GettingStartedDemo.vue"; 
import DemoContainer from "../../components/DemoContainer.vue"; 

</script>

<DemoContainer><GettingStartedDemo /></DemoContainer>

::: code-group
<<< @/components/GettingStartedDemo.vue{4,5,11 vue} [GettingStartedDemo]
:::

## 下一步

- 想查看更多 `VueToCounter` 的示例？请查看 [示例](/guide/examples/simple-usage)。
- 要了解 `VueToCounter` 的配置参数？请查看 [配置和API](/reference/)。
- 要探索 `VueToCounter` 样式和动画更多的可能性，例如实现[这样](./examples/logo)的效果？你可以从 [深入 VueToCounter](/guide/vue-to-counter-in-depth) 开始。
