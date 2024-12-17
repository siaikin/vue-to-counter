<script setup>
import {ref} from "vue"; 
import {useData} from "vitepress"; 
import VueToCounterText from "../../components/VueToCounterText.vue";

const { site } = useData();
const userCount = ref(10000);
setInterval(() => userCount.value += Math.floor(Math.random() * 10), 2000);

const now = ref(new Date());
setInterval(() => now.value = new Date(), 2000);
const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);
nextMonth.setDate(0);
nextMonth.setHours(0, 0, 0, 0);
</script>

# VueToCounter 是什么？

VueToCounter 是一个基于 Vue 3 用于展示**数值变化**的组件，它可以在数值变化时增加动画效果。

::: tip
懒得看？跳到[快速开始](getting-started)。
:::

# 使用场景

- **站点首屏**

  本文档的[首页标题](/)（<vue-to-counter-text />）就是一个例子。它可以为你的站点增加一些动态效果，使其看起来更加生动。

- **数据展示**

  你可以使用 VueToCounter 来展示一些实时数据，统计数据等。比如，你可以使用它来展示:

  - 今天已有 <vue-to-counter-number class="font-mono font-bold" :value="userCount" suffix="人" color="black" :locale="site.lang" locale-number /> 访问了你的网站
  - 距离下个月还有 <vue-to-counter-datetime-duration class="font-mono font-bold" :value="[now, nextMonth]" color="black" :locale="site.lang" />

  ::: tip
  VueToCounter 还通过 [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) 支持国际化。你可以在右上角切换语言来查看效果。
  :::

[//]: # '  * 你的网站已经运行了 <vue-to-counter-number class="font-mono font-bold" :value="userCount" suffix="小时" color="black" /> 了'
