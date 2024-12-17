<script setup>
import DemoContainer from "../../../components/DemoContainer.vue";
import BasicStringDemo from "../../../components/BasicStringDemo.vue";
import BasicNumberDemo from "../../../components/BasicNumberDemo.vue";
import BasicDatetimeDurationDemo from "../../../components/BasicDatetimeDurationDemo.vue";

import LocaleNumberDemo from "../../../components/LocaleNumberDemo.vue";
import LocaleDatetimeDurationDemo from "../../../components/LocaleDatetimeDurationDemo.vue";

import ColorfulNumberDemo from "../../../components/ColorfulNumberDemo.vue";
import PlayfulNumberDemo from "../../../components/PlayfulNumberDemo.vue";
</script>

# 基础

### 滚动字符串

<DemoContainer><BasicStringDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/BasicStringDemo.vue{vue} [BasicStringDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::

### 滚动数字

<DemoContainer><BasicNumberDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/BasicNumberDemo.vue{vue} [BasicNumberDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::

### 滚动时间间隔

<DemoContainer><BasicDatetimeDurationDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/BasicDatetimeDurationDemo.vue{vue} [BasicDatetimeDurationDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::

## 本地化

### 数字本地化

<DemoContainer><LocaleNumberDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/LocaleNumberDemo.vue{vue} [LocaleNumberDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::

### 时间间隔本地化

<DemoContainer><LocaleDatetimeDurationDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/LocaleDatetimeDurationDemo.vue{vue} [LocaleDatetimeDurationDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::

## 奇形怪状的，五颜六色的

为了更容易观察填充颜色变化，调大了字体。

### 自定义颜色

<DemoContainer><ColorfulNumberDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/ColorfulNumberDemo.vue{vue} [ColorfulNumberDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::

### 自定义字体

切换字体只需要修改 `font-family` 属性。
<DemoContainer><PlayfulNumberDemo /></DemoContainer>
::: details 点击查看代码
::: code-group
<<< @/components/PlayfulNumberDemo.vue{vue} [PlayfulNumberDemo]
<<< @/components/DemoContainer.vue{vue} [DemoContainer]
:::
